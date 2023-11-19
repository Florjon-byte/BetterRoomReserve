#!/usr/bin/python3
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from typing import Union
from typing import List
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
    reservations: List[str]

class Room(BaseModel):
    room_id: str
    max_occupancy: int
    building: str
    floor: str
    outlets: bool
    monitor: bool
    whiteboard: bool
    reservations: List[str] 

class Reservation(BaseModel):
    net_id: str
    email: str
    individual_time: int
    group_time: int
    reservations: int

class Survey(BaseModel):
    net_id: str
    email: str
    individual_time: int
    group_time: int
    reservations: int

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
async def get_room_reservation():
#    response = await 
    pass

def reserve_room():
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
