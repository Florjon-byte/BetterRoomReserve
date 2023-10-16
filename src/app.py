from tg.configuration import AppConfig

class MyAppConfig(AppConfig):
    def __init__(self):
        super(MyAppConfig, self).__init__()
        self.renderers = ['json', 'kajiki']
        self.default_renderer = 'json'
        self.package = myapp
        self.use_sqlalchemy = False
        self.use_toscawidgets2 = False
        self.hooks = None
        self.use_transaction_manager = True

        # Enable CORS (adjust origin as needed)
        self.base_config['cors'] = {
            'allow_origin': '*',
            'allow_methods': 'GET, POST',
            'allow_headers': 'Content-Type',
            'expose_headers': 'Location',
            'max_age': 3600,
            'allow_credentials': 'true'
        }