#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

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
  cur.execute("CREATE EXTENSION pgcrypto;")
  query = '''
          INSERT INTO user_data 
          (net_id, email, password)
          VALUES
          (%s, %s, crypt(%s,gen_salt("md5")))
          '''
  cur.execute(query,(net_id, email, password))
  cur.execute("select * from user_data")
  print(cur.fetchall())
  commitAndClose(cur,conn)

def createRoom(room_id, max_occupancy, building, floor, outlets, monitor):
  cur, conn = openCursor();
  query = '''
          INSERT INTO room
          (room_id, max_occupancy, building, floor, outlets, monitor)
          VALUES
          (%s,%s,%s,%s,%s,%s)
          '''
  cur.execute(query,(room_id, max_occupancy, building, floor, outlets, monitor))
  cur.execute("select * from room")
  print(cur.fetchall())
  commitAndClose(cur,conn)

def createReservation(date, start_time, end_time, floor, room_id, net_id):
  cur, conn = openCursor();
  query = '''
          INSERT INTO reservation
          (date, start_time, end_time, floor, room_id, net_id, availability)
          VALUES
          (%s, %s, %s, %s, %s, %s, %s)
          '''
  cur.execute(query,(date, start_time, end_time, floor, room_id, net_id))
  cur.execute("select * from reservation")
  print(cur.fetchall())
  commitAndClose(cur,conn)

def createSurvey(room_id, reservation_id, noise_level, working_outlets, working_monitor):
  cur, conn = openCursor();
  query = '''
          INSERT INTO survey
          (room_id, reservation_id, noise_level, working_outlets, working_monitor)
          VALUES
          (%s, %s, %s, %s, %s)
          '''
  cur.execute(query,(room_id, reservation_id, noise_level, working_outlets, working_monitor))
  cur.execute("select * from survey")
  print(cur.fetchall())
  commitAndClose(cur,conn)


# Test user_data
# createUser("dg3314","dg3314@nyu.edu","notAPassword")
# createUser("fh999", "fh999@nyu.edu","definitelyNotAPassword")

# Test room
with open("Rooms.csv") as file:
  for row in file:
    formattedRow = row.strip().split(',')
    room_id = 
    max_occupancy = 
    building = 
    floor = 
    outlets = 
    createRoom