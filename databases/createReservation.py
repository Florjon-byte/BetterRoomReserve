import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS reservation 
        (reservation_id VARCHAR(256) NOT NULL PRIMARY KEY,
        date DATE,
        start_time TIME,
        end_time TIME,
        floor VARCHAR(256),
        res_room_id VARCHAR(256) REFERENCES room(room_id),
        res_net_id VARCHAR(256) REFERENCES user_data(net_id),
        availability BOOL DEFAULT FALSE);'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()