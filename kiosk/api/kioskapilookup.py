from pprint import pprint

from flask_restful import Resource
from flask import abort, request
from marshmallow import Schema, fields

import kioskglobals
import kioskstdlib
from kioskglobals import get_config, httpauth
from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from kioskdbhelpers import get_valuelist_from_constants


class ApiLookupGetParameter(Schema):
    class Meta:
        fields = ("lookup_type", "topic", "selection", "key")
        ordered = True

    lookup_type = fields.Str(required=True)
    topic = fields.Str(required=True)
    selection = fields.List(fields.Str())
    key = fields.Str(required=True)


class ApiResultLookup(Schema):
    class Meta:
        fields = ("result_msg", "page", "pages", "page_size", "record_count", "overall_record_count",
                  "records")
        ordered = True

    result_msg: fields.Str()
    page: fields.Int(default=1)
    pages: fields.Int()
    page_size: fields.Int()
    record_count: fields.Int()
    records: fields.List(fields.List(fields.Str()))
    overall_record_count: fields.Int()


class ApiLookup(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/lookup')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def post(self):
        ''' retrieves data from Kiosk tables
            ---
            summary: retrieves a list of constants
            security:
                - jwt: []
            requestBody:
                name: cql_query
                content:
                    application/json:
                        schema: ApiLookupGetParameter
            responses:
                '200':
                    description: returns a list of json records
                    content:
                        application/json:
                            schema: ApiResultLookup
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
        dsd: DataSetDefinition = kioskglobals.master_view.dsd
        # params = ApiLookupGetParameter().load(request.args)
        # pprint({"ApiLookupGetParameter": request.json})
        result = {'result_msg': "error",
                  'record_count': 0,
                  'page': 0,
                  'records': 0,
                  }
        try:
            lookup_type = request.json["lookup_type"]
            if not type:
                raise Exception("Bad parameter: lookup type missing")

            if lookup_type == "table":
                self.lookup_table(dsd, result)
            elif lookup_type == "valuelist":
                self.lookup_valuelist(dsd, result)
            else:
                raise Exception(f"Bad parameter: lookup type '{lookup_type}' unknown.")

        except BaseException as e:
            result["result_msg"] = repr(e)
        return ApiResultLookup(many=False).dump(result), 200

    def lookup_table(self, dsd, result):
        topic = request.json["topic"]
        selection = request.json["selection"]
        key = request.json["key"]
        if dsd.table_is_defined(topic):
            fields = dsd.list_fields(topic)
            for col in selection:
                if col not in fields:
                    raise Exception(f"selection '{col}' unknown for topic '{topic}'")
            if key not in fields:
                raise Exception(f"key '{key}' unknown for topic {topic}")
        else:
            raise Exception(f"topic '{topic}' unknown.")
        sql = "select distinct "
        sql = sql + f"{KioskSQLDb.sql_safe_ident(key)}"
        cols = ""
        order_cols = ""
        selection: list
        for idx, col in enumerate(selection):
            if col != key:
                cols += f",{KioskSQLDb.sql_safe_ident(col)}"
            order_cols += ("," if order_cols else "") + col

        sql += cols

        if not order_cols:
            order_cols = key
        sql += f" from {topic} order by {order_cols}"

        cur = KioskSQLDb.execute_return_cursor(sql)
        if not cur:
            raise Exception(f"Error accessing topic '{topic}'")
        try:
            records = []
            r = cur.fetchone()
            while r:
                if r[0]:
                    s = ""
                    if selection:
                        s = " ".join(str(r[col]) for col in selection if r[col])
                    else:
                        s = r[0]
                    records.append([r[0], s])
                r = cur.fetchone()
            result["result_msg"] = "ok"
            result["records"] = records
            result["record_count"] = len(result["records"])
        finally:
            cur.close()

    def lookup_valuelist(self, dsd, result):
        valuelist = request.json["topic"]
        result["result_msg"] = "ok"
        result["records"] = get_valuelist_from_constants(valuelist)
        result["record_count"] = len(result["records"])
