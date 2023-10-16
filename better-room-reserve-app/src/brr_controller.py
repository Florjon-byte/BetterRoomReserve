from tg import expose, TGController

class ApiController(TGController):

    @expose('json')
    def get_data(self):
        data = {"message": "Hello from TurboGears2!"}
        return data