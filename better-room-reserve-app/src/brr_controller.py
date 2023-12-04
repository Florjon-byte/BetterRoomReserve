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
            WHERE net_id = %s;
            """
    cur.execute(query,(jwtoken, login_info.email))
    db.commitAndClose(cur, conn)
    return { 'token': jwtoken }

@app.get("/logout")
async def logout(user: schemas.UserModel):
    cur, conn = db.openCursor()
    query = "UPDATE user_data SET auth_token = NULL WHERE net_id = '" + user.net_id + "';"
    cur.execute(query)
    db.commitAndClose(cur, conn)
    return { "logout" : True }

@app.post("/profile")
async def get_user_info(user: schemas.UserModel):
    if user:
        cur, conn = db.openCursor()
        profile = db.getUserByID(cur, user.net_id)
        db.commitAndClose(cur, conn)
        profile_json = {
                            "net_id": profile[0][0],
                            "email": profile[0][1],
                            "individual_hours": profile[0][3],
                            "group_hours": profile[0][4],
                            "token": profile[0][5],
                            "reservations": profile[0][6]
                        }
        return profile_json 

@app.delete("/profile/cancel")
def cancel_reservation(reservation_id: uuid.UUID):
    cur, conn = db.openCursor()


@app.get("/reserve/filter")
async def get_filtered_info(filters: schemas.Filters):
    query = "SELECT room_id FROM room WHERE "

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
    print(result)
    return result

@app.get("/reserve/room-info")
async def get_room_info(reservation: schemas.Reservation):
    reservation_info = reservation.dict()
    if reservation.room_id:
        cur, conn = db.openCursor()
        room_info = db.getRoomByID(cur, reservation.room_id)
        print(room_info)
        db.commitAndClose(cur, conn)
        return room_info

@app.get("/reserve")
async def reserve(reservation_info: schemas.Reservation):
    date = reservation_info.date
    start = reservation_info.start_time
    end = reservation_info.end_time
    room = reservation_info.room_id
    user = reservation_info.net_id

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

