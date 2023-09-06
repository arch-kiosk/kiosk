from flask_restful import Resource
from flask import abort
from marshmallow import Schema, fields

import kioskglobals
import kioskstdlib
from kioskglobals import get_config, httpauth
from kioskglossary import KioskGlossary
from kiosksqldb import KioskSQLDb


class ApiResultConstant(Schema):
    class Meta:
        fields = ("path", "key", "value")

    path = fields.Str()
    key = fields.Str()
    value = fields.Str()


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
        cfg = get_config()
        constants = []
        self.add_recording_context_aliases(cfg, constants)
        self.add_labels(constants)
        self.add_collected_material_type_names(constants)
        self.add_glossary(constants)

        return ApiResultConstant(many=True).dump(constants), 200

    def add_recording_context_aliases(self, config, constants):
        for key in config["file_repository"]["recording_context_aliases"].keys():
            constant = ApiResultConstant()
            constant.path = "file_repository/recording_context_aliases"
            constant.key = key
            constant.value = config["file_repository"]["recording_context_aliases"][key]
            constants.append(constant)

    def add_collected_material_type_names(self, constants):
        cur = KioskSQLDb.execute_return_cursor("select id, \"name\" from collected_material_types")
        r = cur.fetchone()
        while r:
            constant = ApiResultConstant()
            constant.path = "constants/collected_material_types"
            constant.key = r["id"]
            constant.value = kioskstdlib.null_val(r["name"], "")
            constants.append(constant)
            r = cur.fetchone()

    def add_labels(self, constants):
        cur = KioskSQLDb.execute_return_cursor("select id, value from constants where category=%s", ["labels"])
        r = cur.fetchone()
        while r:
            constant = ApiResultConstant()
            constant.path = "constants/labels"
            constant.key = r["id"]
            constant.value = kioskstdlib.null_val(r["value"], "")
            constants.append(constant)
            r = cur.fetchone()

    def add_glossary(self, constants):
        glossary = KioskGlossary(kioskglobals.get_config()).get_all()

        for key, value in glossary:
            constant = ApiResultConstant()
            constant.path = "glossary"
            constant.key = key
            constant.value = value
            constants.append(constant)
