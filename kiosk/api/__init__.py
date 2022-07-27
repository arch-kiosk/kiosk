import flask
from flask_restful import Resource

from core.kioskapi import KioskApi
from .kioskapi import register_resources

import kioskglobals


def register_api(app: flask.Flask):

    if kioskglobals.csrf:
        kioskglobals.api = KioskApi(app,
                                    title='kiosk api',
                                    version="1.0",
                                    description="This is the notorious kiosk api",
                                    decorators=[kioskglobals.csrf.exempt]
                                    )
    else:
        kioskglobals.api = KioskApi(app,
                                    title='kiosk api',
                                    version="1.0"
                                    )
    kioskglobals.api.add_resource(SwaggerJson, "/swagger.json", endpoint="swagger.json")
    register_resources(kioskglobals.api)
    kioskglobals.url_for_publisher.add_route("api", "/api")


class SwaggerJson(Resource):
    def get(self):
        return kioskglobals.api.get_swagger_json()