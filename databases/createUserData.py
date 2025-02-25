#!/usr/bin/python3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS user_data 
        (net_id VARCHAR(256) NOT NULL,
        email VARCHAR(256) NOT NULL PRIMARY KEY,
        password VARCHAR(256) NOT NULL,
        individual_time INT DEFAULT 5,
        group_time INT DEFAULT 3,
        auth_token VARCHAR(256) UNIQUE,
        reservations UUID[] DEFAULT ARRAY[]::UUID[]);'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()