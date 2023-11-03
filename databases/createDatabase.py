#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=postgres user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

# drop brr database
cur.execute("drop database betterroomreserve")

# create brr database
try:
  cur.execute("CREATE DATABASE BetterRoomReserve;")
except(psycopg2.errors.DuplicateDatabase):
  print("Database already exists!")

conn.commit()
conn.close()
cur.close()