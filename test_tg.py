from tg import expose, TGController
from tg import MinimalApplicationConfigurator
from wsgiref.simple_server import make_server


class RootController(TGController):
    @expose()
    def index(self):
        return 'Hello World'

config = MinimalApplicationConfigurator()
config.update_blueprint({
    'root_controller': RootController()
})

application = config.make_wsgi_app()

print("Serving on port 8080...")
httpd = make_server('', 8080, application)
httpd.serve_forever()