#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS room 
        (room_id VARCHAR(256) NOT NULL PRIMARY KEY,
        max_occupancy INT NOT NULL,
        noise_level VARCHAR(256),
        building VARCHAR(256) NOT NULL,
        floor VARCHAR(3) NOT NULL,
        outlets BOOL NOT NULL,
        monitor BOOL NOT NULL,
        whiteboard BOOL NOT NULL,
        reservations UUID[] DEFAULT ARRAY[]::UUID[]);'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()