#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dbMethods import *

# Test user_data
createUser("dg3314","dg3314@nyu.edu","notAPassword")
createUser("fh999", "fh999@nyu.edu","definitelyNotAPassword")

# Test rooms
with open("Rooms.csv") as file:
  next(file) # skip header line
  for row in file:
    formattedRow = row.strip().split(',')
    room_id = formattedRow[0]
    max_occupancy = formattedRow[1]
    building = formattedRow[2]
    floor = formattedRow[3]
    outlets = formattedRow[4]
    monitor = formattedRow[5]
    whiteboard = formattedRow[6]
    createRoom(room_id, max_occupancy, building, floor, outlets, monitor, whiteboard)

# create reservation tests

# create survey tests
