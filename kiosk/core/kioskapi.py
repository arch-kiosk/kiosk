from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_restful import Api
from flask import Blueprint, Flask, current_app
from kioskstdlib import try_get_dict_entry
from flask_swagger_ui import get_swaggerui_blueprint
from apispec_flask_restful import RestfulPlugin


class KioskApi(Api):
    def __init__(self, app: Flask, *args, **kwargs):
        self.title = try_get_dict_entry(kwargs, 'title', '')
        self.version = try_get_dict_entry(kwargs, 'version', '')
        self.api_url = try_get_dict_entry(kwargs, 'api_url', '/api').strip()
        self.description = try_get_dict_entry(kwargs, 'description', '').strip()
        self.flask_app = app
        self.jwt_scheme = {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
        self.spec = APISpec(
            title=self.title,
            version=self.version,
            openapi_version="3.0.n",
            info={
                'description': self.description,
            },
            plugins=[RestfulPlugin(), MarshmallowPlugin()]
        )
        self.spec.components.security_scheme("jwt", self.jwt_scheme)

        if self.api_url[-1] == "/":
            self.api_url = self.api_url[0:-1]

        self.swagger_ui_url = f'{self.api_url}/ui'  # URL for exposing Swagger UI (without trailing '/')
        self.swagger_doc_url = f'{self.api_url}/swagger.json'  # Our API url (can of course be a local resource)

        for s in ['title', 'version', 'api_url', 'description']:
            if s in kwargs:
                kwargs.pop(s)

        # api_blueprint = Blueprint('api', __name__)
        kwargs["prefix"] = self.api_url
        super().__init__(app, *args, **kwargs)

        swagger_ui_blueprint = get_swaggerui_blueprint(self.swagger_ui_url,
                                                       self.swagger_doc_url,
                                                       config={
                                                           'app_name': self.title,
                                                           'layout': "BaseLayout"
                                                       })
        app.register_blueprint(swagger_ui_blueprint)

    def get_swagger_json(self):
        return self.spec.to_dict()
