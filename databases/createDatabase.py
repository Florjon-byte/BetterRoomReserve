import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

# create brr database
try:
  cur.execute("CREATE DATABASE BetterRoomReserve;")
except(psycopg2.errors.DuplicateDatabase):
  pass

# create a user_info table
cur.execute('''
            CREATE TABLE IF NOT EXISTS user_info 
            (net_id VARCHAR(256) NOT NULL PRIMARY KEY, 
            verification VARCHAR(256), 
            sso BOOL);''')

# create predictions table
# cur.execute('''
#             CREATE TABLE IF NOT EXISTS prediction 
#             (location varchar(256),
#             occupancy decimal(4,1),
#             time_table set(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23));''')

# # create occupancy table
# cur.execute('''
#             create table occupancy 
#             (location varchar(256),
#             time_table set(),
#             bookings set());''');

cur.execute('''
            CREATE TABLE IF NOT EXISTS rooms
            (room_id VARCHAR(256) NOT NULL PRIMARY KEY,
            max_occupancy VARCHAR(256) NOT NULL,
            location VARCHAR(256) NOT NULL,
            reservations UUID[] DEFAULT ARRAY[]::UUID[]);
            ''')

# cur.execute("drop table reservations")

# cur.execute('''
#             CREATE TABLE IF NOT EXISTS reservations
#             (reservation_id SERIAL PRIMARY KEY,
#             date DATE,
#             start_time TIME,
#             end_time TIME,
#             room_id VARCHAR(256),
#             user_id VARCHAR(256),

#             FOREIGN KEY (room_id) REFERENCES rooms(room_id),
#             FOREIGN KEY (user_id) REFERENCES user_info(net_id));
#             ''')


# cur.execute("drop table rooms")

f = open("Rooms.csv", 'r')
for row in f:
  cutRow = row.split(",")
  room_id, max_occupancy, location = cutRow
  cur.execute("INSERT INTO rooms (room_id, max_occupancy, location) VALUES (%s, %s, %s)",(room_id, max_occupancy, location))
f.close()

# cur.execute("insert into user_info values ('dg3314', '090118', true);")
# cur.execute("insert into user_info values ('fh999', '123456', true);")
# cur.execute("insert into user_info values ('jb6924', NULL, false);")
# cur.execute("insert into user_info values ('gl1367', NULL, true);")
# cur.execute("insert into user_info values ('gnp9682', '123456', false);")



# conn.commit()

# sample get request to prove we did the work
# cur.execute("insert into reservations values (uuid,'2023-10-25', '160000-0500','170000-0500','LC420','dg3314')")
cur.execute("select * from reservations")

# print your information
print(cur.fetchall())