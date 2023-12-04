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
    return { 'token': jwtoken }

@app.get("/logout")
async def logout(user: schemas.UserModel):
    cur, conn = db.openCursor()
    query = "UPDATE user_data SET auth_token = NULL WHERE email = '" + user.email + "';"
    cur.execute(query)
    db.commitAndClose(cur, conn)
    return { "logout" : True }

@app.delete("/profile/cancel")
def cancel_reservation(reservation_id: uuid.UUID):
    cur, conn = db.openCursor()

@app.post("/profile")
def get_user_by_token(user: schemas.UserModel):
    cur, conn = db.openCursor()
    response = db.getUserByToken(cur, user.auth_token)
    db.commitAndClose(cur, conn)
    response_json = {
                        "net_id": response[0][0],
                        "email": response[0][1],
                        "individual_hours": response[0][3],
                        "group_hours": response[0][4],
                        "token": response[0][5],
                        "reservations": response[0][6]
                    }
    return response_json

@app.get("/reserve/filter")
async def get_filtered_info(filters: schemas.Filters):
    query = "SELECT room_id, floor FROM room WHERE "

    chain = 0
    if (filters.size):
        query += "max_occupancy = " + str(filters.size)
        chain = 1
    if (filters.noise_level):
        if (chain > 0):
            query += " AND "
        query += "noise_level = '" + filters.noise_level + "'"
    if (filters.start_time):
        if (chain > 0):
            query += " AND "
        query += "start_time = "+ filters.start_time
        chian = 0

    cur, conn = db.openCursor()
    cur.execute(query)
    result = cur.fetchall()
    db.commitAndClose(cur, conn)
    result_json = {}
    for item in result:
        result_json[item[0]] = item[1]
    return result_json

@app.get("/reserve/room-info")
async def get_room_info(reservation: schemas.Reservation):
    reservation_info = reservation.dict()
    if reservation.room_id:
        cur, conn = db.openCursor()
        room_info = db.getRoomByID(cur, reservation.room_id)[0]
        db.commitAndClose(cur, conn)
        room_info_json = {
                            "room_id": room_info[0],
                            "size": room_info[1],
                            "building": room_info[3],
                            "floor": room_info[4],
                            "outlets": room_info[5],
                            "monitor": room_info[6],
                            "whiteboard": room_info[7],
                            "reservations": room_info[8]
                        }
        return room_info_json

@app.post("/reserve")
async def reserve(reservation_info: schemas.Reservation):
    if reservation_info:
        date = reservation_info.date
        cur, conn = db.openCursor()
        cur.execute("select to_timestamp(%s, 'HH12:MI AM,PM')",(reservation_info.start_time))
        start = cur.fetchall()
        print(start)
        end = to_timestamp(reservation_info.end_time, "HH12:MI AM,PM")
        room = reservation_info.room_id
        user = reservation_info.email
        res_id = str(uuid.uuid4())

        query = """
                SELECT reservation_id
                FROM reservation
                WHERE date = %s AND start_time = %s AND end_time = %s AND room_id = %s;
                """
        cur.execute(query,(date,start,end,room))
        room_check = cur.fetchall()

        if (len(room_check) == 0):
            query = """
                    SELECT reservation_id
                    FROM reservation
                    WHERE date = %s AND start_time = %s AND end_time = %s AND email = %s;
                    """
            cur.execute(query,(date,start,end,user))
            user_check = cur.fetchall()

            if (len(user_check) == 0):
                print("fucking gaming")
                # db.createReservation(res_id, date, start, end, room, user)



        return {"reservation" : True}
    else:
        return { "Error": "Reservation info missing" }

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

