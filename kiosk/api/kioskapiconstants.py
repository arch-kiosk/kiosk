import logging

import flask
from flask_restful import Resource

import kioskconstants
import kioskglobals
from kioskglobals import httpauth



class ApiConstants(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/constants')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves available constants
            ---
            summary: retrieves a list of constants
            security:
                - jwt: []
            responses:
                '200':
                    description: returns a list of available constants
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultConstant


                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # ******************************************
        # get main
        # ******************************************
        try:
            constants = kioskconstants.KioskProjectConstants().get_all_constants(kioskglobals.get_config())
            return kioskconstants.ApiResultConstant(many=True).dump(constants), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.post: Exception when dumping result: {repr(e)}")
            flask.abort(500, repr(e))

