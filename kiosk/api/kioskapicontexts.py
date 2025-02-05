from flask_restful import Resource
from flask import request
from marshmallow import Schema, fields

import kioskglobals
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from dsd.dsd3singleton import Dsd3Singleton
from fileidentifiercache import FileIdentifierCache
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
            parameters:
                - in: query
                  name: site_filter
                  required: false
                  schema:
                    type: string
            responses:
                '200':
                    description: returns a list of valid context identifiers
                    content:
                        application/json:
                            schema: ApiResultContexts
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
        site_filter = ""
        if "site_filter" in request.args:
            site_filter = request.args.get("site_filter")
            identifiers = self.get_site_identifiers(site_filter)
        else:
            cache: MemoryIdentifierCache = kioskglobals.identifier_cache
            identifiers = cache.get_identifiers()
        return ApiResultContexts().dump({"identifiers": identifiers}), 200

    def get_site_identifiers(self, site_uuid: str):
        fid = FileIdentifierCache(Dsd3Singleton.get_dsd3(), "site_index")
        query = fid.get_records_with_context(id_uuid=site_uuid)
        identifiers=set()
        site_id = ""
        for r in query.records(new_page_size=-1):
            if r["primary_identifier"]:
                identifiers.add(r["primary_identifier"])
                if not site_id:
                    site_id = identifiers.add(r["identifier"])
        if site_id:
            identifiers.add(site_id)

        return identifiers

