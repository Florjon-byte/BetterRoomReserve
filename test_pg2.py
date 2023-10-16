import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

# create brr database
# cur.execute("create database BetterRoomReserve;")

# create a user_info table
# cur.execute("create table user_info (netId varchar(256), verification varchar(256), sso bool);")
# cur.execute("insert into user_info values ('dg3314', '090118', true);")
# cur.execute("insert into user_info values ('jb6924', '098765', true);")
# cur.execute("insert into user_info values ('fh999', '123456', true);")
# cur.execute("insert into user_info values ('gl1367', NULL, true);")
# cur.execute("insert into user_info values ('gnp9682', '123456', false);")

# create predictions table
cur.execute("create table prediction (location varchar(256), occupancy decimal(4,1), time_table set(9,10,11,12,1,2,3,4,5,6,7,8,9,10));")
cur.execute("insert into prediction values ('dibner first floor', 20.0);")
# cur.execute("insert into prediction values ('dibner second floor', 50.0);")

# create occupancy table
cur.execute("create table occupancy (location varchar(256), time_table set(), bookings set());")
# cur.execute("insert into user_info values ('dg3314', '090118', true);")
# cur.execute("insert into user_info values ('fh999', '123456', true);")


conn.commit()

# sample get request to prove we did the work
cur.execute("select * from user_info")

# print your information
print(cur.fetchall())