from flask_restful import Resource
from marshmallow import Schema, fields

import kioskglobals
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from kioskglobals import httpauth


class ApiResultContexts(Schema):
    class Meta:
        fields = ("identifiers",)

    identifiers = fields.List(fields.Str())


class ApiContexts(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/contexts')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves available contexts
            ---
            summary: retrieves a list of context identifiers
            security:
                - jwt: []
            responses:
                '200':
                    description: returns a list of valid context identifiers
                    content:
                        application/json:
                            schema:
                                items: ApiResultContexts


                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # ******************************************
        # get main
        # ******************************************
        # cfg = get_config()
        cache: MemoryIdentifierCache = kioskglobals.identifier_cache
        return ApiResultContexts().dump({"identifiers": cache.get_identifiers()}), 200

