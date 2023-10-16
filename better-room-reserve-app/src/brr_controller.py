from tg import expose, TGController
from tg import MinimalApplicationConfigurator
from wsgiref.simple_server import make_server
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);

# Open a cursor to perform database operations
cur = conn.cursor()

class RootController(TGController):
    @expose()
    def index(self):
        return 'Hello World'

    @expose('json')
    def get_data(self):
        data = {"message": "Hello from TurboGears2!"}
        return data

    @expose('json')
    def sample_db_query(self):
        query = "select * from user_info"
        cur.execute(query)
        data = {"result": cur.fetchall()}
        return data



config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController()
})

application = config.make_wsgi_app()

print("Serving on port 8080...")
httpd = make_server('', 8080, application)
httpd.serve_forever()

# class ApiController(TGController):

#     @expose('json')
#     def get_data(self):
#         data = {"message": "Hello from TurboGears2!"}
#         return data
