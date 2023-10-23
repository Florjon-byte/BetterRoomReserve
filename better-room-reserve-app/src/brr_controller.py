from tg import expose, TGController, request, response
from tg import MinimalApplicationConfigurator
from wsgiref.simple_server import make_server
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

LOCAL_URL = "http://localhost:8080/"

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

def createReservation(date,start,end,room_id,user_id):
    query = "insert into reservations values ("+date+","+start+","+end+","+room_id+","+user_id+")"
    cur.execute(query)

class RootController(TGController):
    @expose()
    def index(self):
        return 'Hello World'


    @expose('json')
    def sample_db_query(self):
        query = "select * from user_info"
        cur.execute(query)
        data = { 
                "result": cur.fetchall()
                }
        return data

    @expose('json')
    def profile(self, user_id=None):
        return "This will be the profile page for "+user_id+" and it will display information with regards to their account and bookings, there will be an authorization check that needs to happen in order to view the data."

    @expose('json')
    def reserve(self, user_id=None):
        createReservation("2023-10-25","160000-0500","170000-0500",'LC420',user_id)

        query = "select * from reservations where user_id="+user_id
        cur.execute(query)
        data = { "result": cur.fetchall() }
        return data
    




config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController()
})

application = config.make_wsgi_app()

print("Serving on port 8080...")
httpd = make_server('', 8080, application)
httpd.serve_forever()
