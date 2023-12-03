#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS reservation 
        (reservation_id UUID NOT NULL PRIMARY KEY,
        date DATE NOT NULL ,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_id VARCHAR(256) REFERENCES room(room_id),
        net_id VARCHAR(256) REFERENCES user_data(net_id));'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()