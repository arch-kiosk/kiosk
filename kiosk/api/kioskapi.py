import logging
from http import HTTPStatus

from flask import request
from flask_login import current_user
from flask_restful import Resource
from flask_wtf import CSRFProtect
from flask_wtf.csrf import generate_csrf
from marshmallow import Schema, fields, ValidationError

from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from kioskuser import KioskUser
from .kioskapiconstants import ApiConstants
from .kioskapicql import ApiCQLQuery
from .kioskapifiles import ApiFile, ApiResolution
from .kioskapicontexts import ApiContexts
from .kioskapikioskquery import ApiKioskQuery
from .kioskapilookup import ApiLookup


def register_resources(api: KioskApi):
    api.add_resource(ApiPublic, '/v1/api-info', endpoint='info')
    api.add_resource(ApiLogin, '/v1/login')
    api.add_resource(ApiLoginV2, '/v2/login')
    # api.spec.components.schema('Login', schema=LoginArgs)
    api.spec.path(resource=ApiPublic, api=api, app=api.flask_app)
    api.spec.path(resource=ApiLogin, api=api, app=api.flask_app)
    api.spec.path(resource=ApiLoginV2, api=api, app=api.flask_app)

    ApiCQLQuery.register(api)
    ApiFile.register(api)
    ApiResolution.register(api)
    ApiConstants.register(api)
    ApiContexts.register(api)
    ApiKioskQuery.register(api)
    ApiLookup.register(api)

# ***********************************************************************
# ******* /api-info
# ***********************************************************************
class PublicApiInfo(Schema):
    class Meta:
        fields = ("project", "project_name", "kiosk_version_name", "kiosk_version", "api_version")
        ordered = True

    project = fields.Str()
    project_name = fields.Str()
    kiosk_version_name = fields.Str()
    kiosk_version = fields.Str()
    api_version = fields.Str()


class ApiPublic(Resource):

    @httpauth.login_required
    def get(self):
        ''' retrieve information about the public kiosk api.
            ---
            summary: retrieve information about the public kiosk api.
            security:
                - jwt: []
            responses:
                '200':
                    description: returns a token
                    content:
                        application/json:
                            schema: PublicApiInfo
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''
        cfg = get_config()
        return PublicApiInfo().dump({
            'project': cfg.config["project_id"],
            'project_name': get_global_constants()["project_name"],
            'kiosk_version_name': kiosk_version_name,
            'kiosk_version': kiosk_version,
            'api_version': '1'})


# ***********************************************************************
# ******* /login
# ***********************************************************************
class LoginArgs(Schema):
    class Meta:
        fields = ("userid", "password")
        ordered = True

    userid = fields.Str(required=True)
    password = fields.Str(required=False)


class LoginError(Schema):
    class Meta:
        fields = ("err",)

    err = fields.Str()


class LoginSuccess(Schema):
    class Meta:
        fields = ("token",)

    token = fields.Str(required=True)


class ApiLogin(Resource):

    # @full_login_required
    def get(self):
        ''' get a valid access token to the api while logged in to the web interface of kiosk
            ---
            summary: get a valid access token to the api while logged in to the web interface of kiosk
            responses:
                '200':
                    description: returns a token
                    content:
                        application/json:
                            schema: LoginSuccess
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        text/html:
                            schema:
                                type: string
                '500':
                    description: an unexpected internal error occurred
                    content:
                        application/json:
                            schema: LoginError
        '''
        try:
            logging.debug("ApiLogin.login/GET")
            if current_user.is_authenticated:
                return LoginSuccess().dump({"token": current_user.get_token(reload=True)}), 200
            else:
                return LoginError().dump({"err": "unauthorized"}), 401

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.GET: {repr(e)}")
            return LoginError().dump({"err": repr(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    def post(self, *args, **kwargs):
        ''' login to the kiosk api and get access token.
            ---
            summary: login to the kiosk api and get access token.
            requestBody:
                required: true
                content:
                    application/json:
                      schema: LoginArgs
            responses:
                '200':
                    description: returns a token
                    content:
                        application/json:
                            schema: LoginSuccess
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
                '422':
                    description: invalid request (schema validation failed)
                    content:
                        application/json:
                            schema: LoginError
                '500':
                    description: an unexpected internal error occurred
                    content:
                        application/json:
                            schema: LoginError
        '''
        try:
            logging.debug("ApiLogin.login/POST")
            try:
                parameters = LoginArgs().load(request.json)
            except ValidationError as err:
                logging.error(
                    f"{self.__class__.__name__}.post : Validation error validating {request.json}: {repr(err)}")
                return LoginError().dump({"err": f"{repr(err)}"}), HTTPStatus.UNPROCESSABLE_ENTITY
            logging.info(f"ApiLogin.login/POST: Attempt to login by user {parameters['userid']}")
            user = KioskUser.authenticate(parameters['userid'], parameters['password'])
            if not user:
                return LoginError().dump({"err": "authentication failed"}), HTTPStatus.UNAUTHORIZED

            return LoginSuccess().dump({"token": user.get_token()}), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
            return LoginError().dump({"err": repr(e)}), HTTPStatus.INTERNAL_SERVER_ERROR


class LoginSuccessV2(Schema):
    class Meta:
        fields = ("token", "csrf")

    token = fields.Str(required=True)
    csrf = fields.Str(required=True)


class ApiLoginV2(Resource):
    # @full_login_required
    def get(self):
        ''' get a valid access token and csrf token to the api while logged in to the web interface of kiosk
            ---
            summary: get a valid access token and csrf token to the api while logged in to the web interface of kiosk
            responses:
                '200':
                    description: returns a token and a csrf token
                    content:
                        application/json:
                            schema: LoginSuccessV2
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        text/html:
                            schema:
                                type: string
                '500':
                    description: an unexpected internal error occurred
                    content:
                        application/json:
                            schema: LoginError
        '''
        try:
            logging.debug("ApiLoginV2.login/GET")
            if current_user.is_authenticated:
                csrf_token = generate_csrf()
                return LoginSuccessV2().dump({"token": current_user.get_token(reload=True), "csrf": csrf_token}), 200
            else:
                return LoginError().dump({"err": "unauthorized"}), 401

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.GET: {repr(e)}")
            return LoginError().dump({"err": repr(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    def post(self, *args, **kwargs):
        ''' login to the kiosk api and get access and csrf token.
            ---
            summary: login to the kiosk api and get access and csrf token.
            requestBody:
                required: true
                content:
                    application/json:
                      schema: LoginArgs
            responses:
                '200':
                    description: returns a token
                    content:
                        application/json:
                            schema: LoginSuccess
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
                '422':
                    description: invalid request (schema validation failed)
                    content:
                        application/json:
                            schema: LoginError
                '500':
                    description: an unexpected internal error occurred
                    content:
                        application/json:
                            schema: LoginError
        '''
        try:
            logging.debug("ApiLoginV2.login/POST")
            try:
                parameters = LoginArgs().load(request.json)
            except ValidationError as err:
                logging.error(
                    f"{self.__class__.__name__}.post : Validation error validating {request.json}: {repr(err)}")
                return LoginError().dump({"err": f"{repr(err)}"}), HTTPStatus.UNPROCESSABLE_ENTITY
            logging.info(f"ApiLogin.login/POST: Attempt to login by user {parameters['userid']}")

            user = KioskUser.authenticate(parameters['userid'], parameters['password'])
            if not user:
                return LoginError().dump({"err": "authentication failed"}), HTTPStatus.UNAUTHORIZED

            csrf_token = generate_csrf()
            return LoginSuccessV2().dump({"token": user.get_token(), "csrf": csrf_token}), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
            return LoginError().dump({"err": repr(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
