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
  print("Database already exists!")


# # f = open("Rooms.csv", 'r')
# # for row in f:
# #   cutRow = row.split(",")
# #   room_id, max_occupancy, location = cutRow
# #   cur.execute("INSERT INTO rooms (room_id, max_occupancy, location) VALUES (%s, %s, %s)",(room_id, max_occupancy, location))
# # f.close()








# # conn.commit()

# # sample get request to prove we did the work
# # cur.execute("")

# # print your information
# # print(cur.fetchall())