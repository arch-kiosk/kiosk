from flask_restful import Resource
from marshmallow import Schema, fields

import kioskglobals
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from kioskglobals import httpauth


class ApiResultContextsFullIdentifierInformation(Schema):
    class Meta:
        fields = ("identifier", "record_type", "field")

    identifier = fields.Str()
    record_type = fields.Str()
    field = fields.Str()


class ApiResultContextsFull(Schema):
    class Meta:
        fields = ("identifiers",)

    identifiers = fields.List(fields.Nested(ApiResultContextsFullIdentifierInformation()))


class ApiContextsFull(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/contexts/full')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves available contexts
            ---
            summary: retrieves a list of context identifiers together with their record types and identifier fields
            security:
                - jwt: []
            responses:
                '200':
                    description: returns a list of valid context identifiers, record types and identifier fields
                    content:
                        application/json:
                            schema: ApiResultContextsFull


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
        return ApiResultContextsFull().dump({"identifiers": cache.get_recording_contexts_with_structure()}), 200
