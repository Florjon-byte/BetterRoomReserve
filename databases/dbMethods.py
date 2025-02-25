#!/usr/bin/python3
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from psycopg2.extras import register_uuid
sys.path.append("better-room-reserve-app/src")
from auth import AuthHandler

auth_handler = AuthHandler()

def openCursor(dbname="betterroomreserve", user="postgres"):
  # Connect to your postgres DB
  conn = psycopg2.connect("dbname="+dbname+" user="+user)
  conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

  # Open a cursor to perform database operations
  cur = conn.cursor()
  return cur, conn

def commitAndClose(cur, conn):
  conn.commit()
  conn.close()
  cur.close()

def createUser(net_id, email, password):
  cur, conn = openCursor()
  query = '''
          INSERT INTO user_data 
          (net_id, email, password)
          VALUES
          (%s, %s, %s)
          '''
  cur.execute(query,(net_id, email, password))
  commitAndClose(cur,conn)

def createRoom(room_id, max_occupancy, building, floor, outlets, monitor, whiteboard):
  cur, conn = openCursor();
  query = '''
          INSERT INTO room
          (room_id, max_occupancy, building, floor, outlets, monitor, whiteboard)
          VALUES
          (%s,%s,%s,%s,%s,%s,%s)
          '''
  cur.execute(query,(room_id, max_occupancy, building, floor, outlets, monitor, whiteboard))
  commitAndClose(cur,conn)

def createReservation(res_id, date, start_time, end_time, room_id, email):
  register_uuid()
  cur, conn = openCursor();
  query = '''
          INSERT INTO reservation
          (reservation_id, date, start_time, end_time, room_id, email)
          VALUES
          (%s, %s, %s, %s, %s, %s)
          '''
  cur.execute(query,(res_id, date, start_time, end_time, room_id, email))
  commitAndClose(cur,conn)

def getRoomByID(cur, room_id):
  cur.execute(f"Select * from room where room_id = '{room_id}'")
  return cur.fetchall()

def getUserByID(cur, user_id):
  cur.execute(f"Select * from user_data where net_id = '{user_id}'")
  return cur.fetchall()

def getUserByToken(cur, auth_token):
  cur.execute(f"Select * from user_data where auth_token = '{auth_token}'")
  return cur.fetchall()

def getUserByEmail(cur, user_email):
  cur.execute(f"Select * from user_data where email = '{user_email}'")
  return cur.fetchall()

def getReservationByID(cur, reservation_id):
  cur.execute(f"Select * from reservation NATURAL JOIN room where reservation_id = '{reservation_id}' order by date, start_time asc")
  return cur.fetchall()

def getReservationByUserEmail(cur, user_email):
  cur.execute(f"Select reservations from user_data where email = '{user_email}';")
  reservations = cur.fetchall()
  return reservations[0][0] if isinstance(reservations[0][0], list) else reservations[0][0].replace('{','').replace('}','').split(',')