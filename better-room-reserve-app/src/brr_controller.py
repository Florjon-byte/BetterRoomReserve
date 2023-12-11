#!/usr/bin/python3
import sys
import os
import psycopg2
import uuid
import datetime
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from typing import Union, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import register_uuid

sys.path.append("../../databases")
import dbMethods as db
import schemas
from auth import AuthHandler

origins = [
    "http://localhost:3000",
    "http://localhost:3000/login",
    "http://localhost:3000/profile",
    "http://localhost:3000/reserve"
]

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_handler = AuthHandler()

@app.post("/login")
async def login(login_info: schemas.LogIn):
    verification = None
    cur, conn = db.openCursor()
    verification = db.getUserByEmail(cur, login_info.email)
    
    if (verification is None) or (not auth_handler.verify_password(login_info.password, verification[0][2])):
        raise HTTPException(status_code=401, detail='Invalid username and/or password')
    jwtoken = auth_handler.encode_token(verification[0][0])
    query = """
            UPDATE user_data
            SET auth_token = %s
            WHERE email = %s;
            """
    cur.execute(query,(jwtoken, login_info.email))
    db.commitAndClose(cur, conn)
    return { 'token': jwtoken, 'email': login_info.email }

@app.get("/logout")
async def logout(user: schemas.UserModel):
    cur, conn = db.openCursor()
    query = f"UPDATE user_data SET auth_token = NULL WHERE email = '{user.email}';"
    cur.execute(query)
    db.commitAndClose(cur, conn)
    return { "logout" : True }

@app.post("/profile/get-reservation")
async def get_reservation(request: schemas.UserModel):
    cur, conn = db.openCursor()
    result = db.getReservationByUserEmail(cur, request.email)

    response = []
    for i, res_id in enumerate(result):
        i+=1
        reservation = db.getReservationByID(cur, res_id)

        response.append({
                    "room_id" : reservation[0][0],
                    "res_id": reservation[0][1],
                    "date" : reservation[0][2],
                    "start_time" : reservation[0][3],
                    "end_time" : reservation[0][4],
                    "building" : reservation[0][7],
                    "floor" : reservation[0][8]
                    })
   
    db.commitAndClose(cur, conn)

    return response

@app.delete("/profile/cancel")
async def cancel_reservation(res_info: schemas.ReservationInfo):

    reservation_id = res_info.res_id

    cur, conn = db.openCursor()
    result = db.getReservationByID(cur, reservation_id)

    if (len(result) == 0):
        return {"Error" : f"Reservation with id {reservation_id} does not exist"}

    res_info = {
                "room_id" : result[0][0],
                "reservation_id" : result[0][1],
                "date" : result[0][2],
                "start_time" : result[0][3],
                "end_time" : result[0][4],
                "email" : result[0][5]
                }

    room = res_info["room_id"]
    user = res_info["email"]

    user_update = """
                  UPDATE user_data
                  SET reservations = ARRAY_REMOVE(reservations, %s)
                  WHERE email = %s;
                  """

    room_update = """
                  UPDATE room
                  SET reservations = ARRAY_REMOVE(reservations, %s)
                  WHERE room_id = %s;
                  """
    
    reservation_delete = f"DELETE FROM reservation WHERE reservation_id = '{reservation_id}';"

    register_uuid()
    cur.execute(user_update,(str(reservation_id), user))
    cur.execute(room_update,(str(reservation_id), room))
    cur.execute(reservation_delete)

    db.commitAndClose(cur, conn)

    return {"reservation" : "removed"}


@app.post("/profile")
async def get_user_by_token(user: schemas.UserModel):
    cur, conn = db.openCursor()
    response = db.getUserByToken(cur, user.auth_token)
    db.commitAndClose(cur, conn)
    reservations = response[0][6] if isinstance(response[0][6], list) else response[0][6].replace('{','').replace('}','').split(',')
    response_json = {
                        "net_id": response[0][0],
                        "email": response[0][1],
                        "individual_hours": response[0][3],
                        "group_hours": response[0][4],
                        "token": response[0][5],
                        "reservations": reservations
                    }
    return response_json

@app.post("/reserve/filter")
async def get_filtered_info(filters: schemas.Filters):

    room_query = "SELECT room_id, floor FROM room"

    if (filters.size):
        room_query += f" WHERE max_occupancy = {filters.size}"
    
    cur, conn = db.openCursor()
    cur.execute(room_query)
    room_result = cur.fetchall()

    result_json = {}
    for item in room_result:
        result_json[item[0]] = item[1]

    room_times = {}

    if (filters.date):
        for item in room_result:
            room_info = db.getRoomByID(cur, item[0])[0]
            reservations = room_info[7] if isinstance(room_info[7],list) else room_info[7].replace('{','').replace('}','').split(',') 
            hours = generate_operational_hours()
            if ((reservations[0] != '') and (len(reservations) != 1)):
                for res_id in reservations:
                    reservation_query = f"SELECT start_time, end_time, date FROM reservation where reservation_id = '{res_id}';"
                    cur.execute(reservation_query)
                    reservation_results = cur.fetchall()[0]
                    if (len(reservation_results) > 0):
                        date = reservation_results[2].strftime("%Y-%m-%d")
                        if (date == filters.date):
                            start = reservation_results[0].strftime("%H:%M:%S")
                            end = reservation_results[1].strftime("%H:%M:%S")
                            try:
                                start_index = hours.index(start)
                                end_index = hours.index(end)
                                if ((start_index != -1) and (end_index != -1)):
                                    for index in range(start_index, end_index):
                                        hours[index] = None
                            except(ValueError):
                                continue
                room_times[item[0]] = clean_arr(hours)
            else:
                room_times[item[0]] = generate_operational_hours()

    if (filters.start_time):
        for room in room_result:
            if (filters.start_time+":00" not in room_times[room[0]]):
                del room_times[room[0]]
                del result_json[room[0]]

    db.commitAndClose(cur, conn)

    return result_json

@app.post("/reserve/room-info")
async def get_room_info(room: schemas.Room):
    if room.room_id:
        cur, conn = db.openCursor()
        room_info = db.getRoomByID(cur, room.room_id)[0]
        db.commitAndClose(cur, conn)

        reservations = room_info[7] if isinstance(room_info[7], list) else room_info[7].replace('{','').replace('}','').split(',')
        room_info_json = {
                            "room_id": room_info[0],
                            "size": room_info[1],
                            "building": room_info[2],
                            "floor": room_info[3],
                            "outlets": room_info[4],
                            "monitor": room_info[5],
                            "whiteboard": room_info[6],
                            "reservations": reservations
                        }
        return room_info_json

@app.post("/reserve/room-time")
async def get_time_info(room: schemas.Room):
    cur, conn = db.openCursor()
    room_info = db.getRoomByID(cur, room.room_id)[0]
    room_hours = generate_operational_hours()

    remove_end = room_hours.index(room.time+":00")
    
    for index in range(0, remove_end):
        room_hours[index] = None

    reservations = room_info[7] if isinstance(room_info[7], list) else room_info[7].replace('{','').replace('}','').split(',')
    for res_id in reservations:
        if (res_id != ""):
            cur.execute(f"SELECT start_time, end_time, date FROM reservation WHERE reservation_id = '{res_id}'")
            booked_times = cur.fetchall()[0]
            date = booked_times[2].strftime("%Y-%m-%d")
            if (date == room.date):
                start = booked_times[0].strftime("%H:%M:%S")
                end = booked_times[1].strftime("%H:%M:%S")
                try:
                    start_index = room_hours.index(start)
                    end_index = room_hours.index(end)
                    if ((start_index != -1) and (end_index != -1)):
                        for index in range(start_index, end_index):
                            room_hours[index] = None
                except(ValueError):
                    continue

    db.commitAndClose(cur, conn)

    return {"Room Hours" : clean_arr(room_hours)}



@app.post("/reserve")
async def reserve(reservation_info: schemas.Reservation):
    if reservation_info:
        cur, conn = db.openCursor()

        date = reservation_info.date
        start = reservation_info.time[0]
        end = reservation_info.time[len(reservation_info.time)-1]
        times = reservation_info.time
        room = reservation_info.room_id
        user = reservation_info.email
        res_id = str(uuid.uuid4())

        for time in times:
            query = """
                    SELECT reservation_id
                    FROM reservation
                    WHERE date = %s AND (start_time = %s OR end_time = %s) AND room_id = %s;
                    """
            cur.execute(query,(date,time,time,room))
            room_check = cur.fetchall()
            if (len(room_check) != 0):
                return {"Error" : "Room Occupied at this time."}

        for time in times:
            query = """
                    SELECT reservation_id
                    FROM reservation
                    WHERE date = %s AND (start_time = %s OR end_time = %s) AND email = %s;
                    """
            cur.execute(query,(date,time,time,user))
            user_check = cur.fetchall()
            if (len(user_check) != 0):
                return {"Error" : "User already has a reservation at this time elsewhere."}

        db.createReservation(res_id, date, start, end, room, user)
        user_update = """
                      UPDATE user_data
                      SET reservations = ARRAY_APPEND(reservations, %s)
                      WHERE email = %s;
                      """

        room_update = """
                      UPDATE room
                      SET reservations = ARRAY_APPEND(reservations, %s)
                      WHERE room_id = %s;
                      """
        cur.execute(user_update,(res_id, user))
        cur.execute(room_update,(res_id, room))
        db.commitAndClose(cur, conn)

        return {"reservation_id" : res_id}
    else:
        db.commitAndClose(cur, conn)
        return { "Error": "Reservation info missing" }

def clean_arr(arr):
    i = 0
    while (not(i >= len(arr)) and (len(arr) != 0)):
        if (arr[i] is None):
            arr.pop(i)
        else:
            i += 1
    return arr

def generate_operational_hours():
    operational_hours = []

    start_time = datetime.datetime.strptime("08:00:00", "%H:%M:%S")
    end_time = datetime.datetime.strptime("20:00:00", "%H:%M:%S")
    time_increment = datetime.timedelta(minutes=30)

    current_time = start_time
    while current_time <= end_time:
        operational_hours.append(current_time.strftime("%H:%M:%S"))
        current_time += time_increment
    
    return operational_hours