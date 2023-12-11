#!/usr/bin/python3
import psycopg2
from passlib.context import CryptContext
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import uuid
from datetime import date, time
from dbMethods import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test user_data
createUser("dg3314","dg3314@nyu.edu",pwd_context.hash("1234"))
createUser("fh999", "fh999@nyu.edu",pwd_context.hash("4321"))

# Test rooms
with open("Rooms.csv") as file:
  next(file) # skip header line
  for row in file:
    formattedRow = row.strip().split(',')
    room_id = formattedRow[0]
    max_occupancy = formattedRow[1]
    building = formattedRow[3]
    floor = formattedRow[4]
    outlets = formattedRow[5]
    monitor = formattedRow[6]
    whiteboard = formattedRow[7]
    createRoom(room_id, max_occupancy, building, floor, outlets, monitor, whiteboard)

# create reservation tests

reservation_insert_statements = [
    (
        str(uuid.uuid4()), "2024/01/01", "10:00", "12:00", 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/01", "10:00", "12:00", 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/02", "10:00", "12:00", 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/02", "10:00", "12:00", 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/03", "10:00", "12:00", 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/03", "10:00", "12:00", 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/04", "10:00", "12:00", 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/04", "10:00", "12:00", 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/05", "10:00", "12:00", 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), "2024/01/05", "10:00", "12:00", 'LC416', 'fh999@nyu.edu'
    )
]

for data in reservation_insert_statements:
  res_id = data[0]
  res_date = data[1]
  res_start = data[2]
  res_end = data[3]
  res_room = data[4]
  res_user = data[5]
  createReservation(res_id, res_date, res_start, res_end, res_room, res_user)
  
  cur,conn = openCursor()
  
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
  cur.execute(user_update,(res_id, res_user))
  cur.execute(room_update,(res_id, res_room))

  commitAndClose(cur,conn)

