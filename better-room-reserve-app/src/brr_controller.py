#!/usr/bin/python3
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from typing import Union, List
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost:3000"
]
sys.path.append("../../databases")
import dbMethods as db

class UserModel(BaseModel):
    net_id: str
    email: EmailStr
    password: str
    individual_time: int
    group_time: int
    reservations: list[str]

class Room(BaseModel):
    room_id: str
    max_occupancy: int
    building: str
    floor: str
    outlets: bool
    monitor: bool
    whiteboard: bool
    reservations: list[str] = []

class Reservation(BaseModel):
    date: str
    start_time: str
    end_time: str
    room_id: str
    net_id: str

class Survey(BaseModel):
    user_id: str
    room_id: str
    reservation_id: int
    noise_level: int
    working_outlets: bool
    working_monitor: bool
    whiteboards: str

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

app = FastAPI()

@app.get("/api")
def read_root():
    return {"Hello": "World"}

@app.get("/reserve")
async def check_reservation(reservation: Reservation):
    reservation_info = reservation.dict()
    if reservation.room_id:
        cur, conn = db.openCursor()
        room_info = db.getRoomByID(cur, reservation.room_id)
        print(room_info)
        db.commitAndClose(cur, conn)
        return room_info

def reserve():
    return {"Hello": "World"}

@app.get("/profile")
def read_root():
    return {"Hello": "World"}

def cancel_reservation():
    return {"hello": "world"}

@app.get("/login")
def authenticate_user():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

def get_room_info(room_id):
    pass
