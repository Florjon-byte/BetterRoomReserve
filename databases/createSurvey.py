import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS survey 
        (survey_id VARCHAR(256) NOT NULL PRIMARY KEY,
        res_room_id VARCHAR(256) REFERENCES room(room_id),
        res_reservation_id VARCHAR(256) REFERENCES reservation(reservation_id),
        noise_level INT,
        working_outlets INT,
        working_monitor BOOL DEFAULT NULL);'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()