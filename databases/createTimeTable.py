#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE timetable (
        time_id UUID PRIMARY KEY,
        date DATE,
        time_key TIME,
        reservation_id UUID references reservation(reservation_id));'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()