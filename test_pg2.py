import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

# create brr database
cur.execute("create database BetterRoomReserve;")

# create a user_info table
cur.execute("create table user_info (netId varchar(256), verification varchar(256), sso bool);")
conn.commit()

# sample get request to prove we did the work
cur.execute("select * from user_info")

# print your information
print(cur.fetchall())