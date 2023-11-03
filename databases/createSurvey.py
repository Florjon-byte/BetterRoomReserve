import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

query = '''
        CREATE TABLE IF NOT EXISTS survey 
        (survey_id BIGSERIAL NOT NULL PRIMARY KEY,
        room_id VARCHAR(256) REFERENCES room(room_id),
        reservation_id BIGSERIAL REFERENCES reservation(reservation_id),
        noise_level INT,
        working_outlets BOOL DEFAULT NULL,
        working_monitor BOOL DEFAULT NULL,
        whiteboards VARCHAR(256));'''

cur.execute(query)

conn.commit()
conn.close()
cur.close()