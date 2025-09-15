from pprint import pprint
import datetime
from flask_restful import Resource
from flask import abort, request
from marshmallow import Schema, fields

import kioskglobals
import kioskstdlib
from kioskglobals import get_config, httpauth
from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from kioskdbhelpers import get_valuelist_from_constants


class ApiDeletionsGetParameter(Schema):
    class Meta:
        fields = ("from_date", "to_date")
        ordered = True

    from_date = fields.Str(required=False, default="")
    to_date = fields.Str(required=False, default="")


class ApiDeletionsResult(Schema):
    class Meta:
        fields = ("result_msg",
                  "records")
        ordered = True

    result_msg = fields.Str()
    records = fields.List(fields.List(fields.Str()))


class ApiDeletions(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/deletions')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        """ retrieves information about deletions of a certain time span
            ---
            summary: retrieves a list of deletions
            description: retrieves a list of deletions
            security:
                - jwt: []
            parameters:
                - in: query
                  name: cql_query
                  schema: ApiDeletionsGetParameter
            responses:
                '200':
                    description: returns a list of json records. IF neither parameter is set returns a list of distinct days on which a deletion occurred.
                    content:
                        application/json:
                            schema: ApiDeletionsResult
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        """

        # ******************************************
        # get main
        # ******************************************
        cfg = get_config()
        dsd = kioskglobals.master_view.dsd
        params = ApiDeletionsGetParameter().load(request.args)
        # params = ApiLookupGetParameter().load(request.args)
        pprint({"ApiDeletionsGetParameter": params})
        result = {'result_msg': "error",
                  'records': [],
                  }
        try:
            from_date: datetime.date = None
            to_date: datetime.date = None

            if "from_date" in params:
                from_date = datetime.date.fromisoformat(params["from_date"])
            if "to_date" in params:
                to_date = datetime.date.fromisoformat(params["to_date"])
            if not (from_date or to_date):
                result = self.get_distinct_deletion_days()
            else:
                sql = f"""
                    {'select'} coalesce("master_deletion_ww", "modified")::varchar modified, "table" record_type, "repl_workstation_id" dock, count(uid) c from "repl_deleted_uids"
                """
                if from_date and to_date:
                    sql_where = f""" WHERE coalesce("master_deletion_ww", "modified")::date >=%s AND coalesce("master_deletion_ww", "modified")::date <= %s"""
                    params = [from_date, to_date]
                elif from_date:
                    sql_where = f""" WHERE coalesce("master_deletion_ww", "modified")::date >=%s"""
                    params = [from_date]
                else:
                    sql_where = f""" WHERE coalesce("master_deletion_ww", "modified")::date <=%s"""
                    params = [to_date]
                sql = sql + sql_where + """ group by coalesce("master_deletion_ww", "modified"), "table", "repl_workstation_id" """
                result['records'] = KioskSQLDb.get_records(sql, params, raise_exception=True)
                result['result_msg'] = "ok"
        except BaseException as e:
            result["result_msg"] = repr(e)
        return ApiDeletionsResult(many=False).dump(result), 200

    def get_distinct_deletion_days(self):
        result = {}
        sql = """
            select distinct coalesce("master_deletion_ww", "modified")::timestamp::varchar modified
            from public.repl_deleted_uids
            order by modified
        """

        result['records'] = KioskSQLDb.get_records(sql, raise_exception=True)
        result['result_msg'] = "ok"
        return result
