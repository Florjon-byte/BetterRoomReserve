#!/usr/bin/python3
import psycopg2
from passlib.context import CryptContext
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import uuid
from datetime import date, time
from dbMethods import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test user_data
createUser("dg3314","dg3314@nyu.edu",pwd_context.hash("notAPassword"))
createUser("fh999", "fh999@nyu.edu",pwd_context.hash("definitelyNotAPassword"))

# Test rooms
with open("Rooms.csv") as file:
  next(file) # skip header line
  for row in file:
    formattedRow = row.strip().split(',')
    room_id = formattedRow[0]
    max_occupancy = formattedRow[1]
    noise_level = formattedRow[2]
    building = formattedRow[3]
    floor = formattedRow[4]
    outlets = formattedRow[5]
    monitor = formattedRow[6]
    whiteboard = formattedRow[7]
    createRoom(room_id, max_occupancy, noise_level, building, floor, outlets, monitor, whiteboard)

# create reservation tests

reservation_insert_statements = [
    (
        str(uuid.uuid4()), date(2023, 12, 1), time(10, 0), time(12, 0), 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2023, 12, 2), time(14, 0), time(16, 0), 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 1, 1), time(10, 0), time(12, 0), 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 1, 2), time(14, 0), time(16, 0), 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 2, 1), time(10, 0), time(12, 0), 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 2, 2), time(14, 0), time(16, 0), 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 3, 1), time(10, 0), time(12, 0), 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 3, 2), time(14, 0), time(16, 0), 'LC416', 'fh999@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 4, 1), time(10, 0), time(12, 0), 'LC417', 'dg3314@nyu.edu'
    ),
    (
        str(uuid.uuid4()), date(2024, 4, 2), time(14, 0), time(16, 0), 'LC416', 'fh999@nyu.edu'
    )
]

for data in reservation_insert_statements:
  print(data)
  res_id = data[0]
  res_date = data[1]
  res_start = data[2]
  res_end = data[3]
  res_room = data[4]
  res_user = data[5]
  createReservation(res_id, res_date, res_start, res_end, res_room, res_user)

