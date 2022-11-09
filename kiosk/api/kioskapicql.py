import logging
import datetime

from dsd.dsd3singleton import Dsd3Singleton
from qualitycontrol.qualitycontrol import QualityControl
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb
from pprint import pprint

from flask import request
from flask_restful import Resource
from marshmallow import Schema, fields, validate

import kioskglobals
import kioskstdlib

from contextmanagement.contextquery import ContextQuery
from contextmanagement.contextquerybakery import ContextQueryBakery
from contextmanagement.kioskcontext import KioskContext
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsderrors import DSDError
from kioskglobals import get_config, httpauth


class ApiCQLQueryGetParameter(Schema):
    class Meta:
        fields = ("scope", "identifier", "datum", "additional_datum", "page", "condition", "modifier")
        ordered = True

    scope = fields.Str(required=True)
    identifier = fields.Str(missing="", default="")
    datum = fields.Str(required=True)
    additional_datum = fields.Str(missing="", default="")
    page = fields.Int(missing=1)
    condition = fields.Str()
    modifier = fields.Str(validate=validate.OneOf(["distinct", "count", "max", "min", ""]), missing="")


class ApiCQLQueryPostParameter(Schema):
    class Meta:
        fields = ("page", "qc_data_context")

    page = fields.Int(missing=1)
    qc_data_context = fields.Str(missing="")


class ApiCQLQueryPostBody(Schema):
    class Meta:
        fields = ("cql",)

    cql = fields.Raw()


class ApiCQLQueryResult(Schema):
    class Meta:
        fields = ("result_msg", "page", "pages", "page_size", "record_count", "overall_record_count",
                  "records", "qc_messages")
        ordered = True

    result_msg: fields.Str()
    page: fields.Int(default=1)
    pages: fields.Int()
    page_size: fields.Int()
    record_count: fields.Int()
    records: fields.List(fields.Dict())
    qc_messages: fields.List(fields.Dict(), default=[])
    overall_record_count: fields.Int()

class ApiCQLQuery(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/cql/query')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    # ******************************************
    # get.format_row
    # ******************************************
    @staticmethod
    def format_row(row: dict) -> dict:
        for k in row.keys():
            if isinstance(row[k], datetime.datetime) \
                    or isinstance(row[k], datetime.date) \
                    or isinstance(row[k], datetime.time):
                row[k] = kioskstdlib.iso8601_to_str(row[k])
        return row

    @httpauth.login_required
    def get(self):
        ''' queries information from a context or index
            ---
            summary: queries information from a context or index
            description: The GET is a simplified form of the POST. It allows you to query a datum
                         from either a named scope or from the global scope "*".
                         You can query a single datum (a field name or dsd instruction) and
                         add one more datum (again a field or dsd instruction)
            security:
                - jwt: []
            parameters:
                - in: query
                  name: cql_query
                  schema: ApiCQLQueryGetParameter
            responses:
                '200':
                    description: returns a list of json records
                    content:
                        application/json:
                            schema: ApiCQLQueryResult
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # ******************************************
        # get.get_context
        # ******************************************
        def get_context() -> KioskContext:
            if params["scope"] == "*":
                raise ValueError("* not supported as a context at this time")
            try:
                ctx = KioskContext(params["scope"], dsd)
                ctx.read_from_dsd()
                return ctx
            except DSDError as e:
                pass

            try:
                ctx = KioskContext(params["scope"], dsd)
                ctx.auto_context(params["scope"])
                return ctx
            except DSDError as e:
                pass

        # ******************************************
        # get main
        # ******************************************
        cfg = get_config()
        dsd = kioskglobals.master_view.dsd
        params = ApiCQLQueryGetParameter().load(request.args)
        pprint({"ApiCQLQueryGetParameter": params})
        page = params["page"]
        context: KioskContext = get_context()
        if params["additional_datum"]:
            additional_fields = [(params["additional_datum"], "additional_datum", "", "", "")]
        else:
            additional_fields = []

        modifier = params["modifier"]
        if params["identifier"]:
            query = ContextQuery(context.select(params["identifier"],
                                                sql_source_class=SqlSourceInMemory,
                                                field_or_instruction=params["datum"],
                                                additional_fields=additional_fields))
        else:
            query = ContextQuery(context.select_all(sql_source_class=SqlSourceInMemory,
                                                    field_or_instruction=params["datum"],
                                                    additional_fields=additional_fields))

        if modifier == "distinct":
            columns = {"data": {"source_field": "data"}
                       }
            if additional_fields:
                columns["additional_datum"] = {"source_field": "additional_datum"}
            query.columns = columns
            pprint(columns)

            query.distinct = True

        if "condition" in params:
            query.add_conditions({"?": params["condition"]})

        records = list(query.records(formatter=self.format_row, page=page))
        result = {'result_msg': "ok",
                  'record_count': len(records),
                  'page': page,
                  'records': records,
                  }
        pages = query.page_count
        if pages:
            result["pages"] = query.page_count

        overall_record_count = query.overall_record_count
        if overall_record_count:
            result["overall_record_count"] = overall_record_count

        return ApiCQLQueryResult().dump(result)

    @httpauth.login_required
    def post(self):
        ''' full cql query
            ---
            summary: executes a cql query
            description: executes a full cql query given as json in the POST data.
            security:
                - jwt: []
            parameters:
                - in: query
                  name: cql_query
                  schema: ApiCQLQueryPostParameter
            requestBody:
                name: cql_query
                content:
                    application/json:
                        schema: ApiCQLQueryPostBody
            responses:
                '200':
                    description: returns a list of json records
                    content:
                        application/json:
                            schema: ApiCQLQueryResult
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
        try:
            KioskSQLDb.commit()
            # KioskSQLDb.set_autocommit(True)
            logging.debug(f"{self.__class__.__name__}.POST: {request.json}")
            try:
                comment = request.json["cql"]["meta"]["comment"]
                if comment == "cmwidget":
                    print("cmwidget")
            except:
                pass

            dsd = kioskglobals.master_view.dsd
            # pprint({"cql query": request.json})

            params = ApiCQLQueryPostParameter().load(request.args)
            # pprint({"ApiCQLQueryPostParameter": params})
            page = params["page"]

            bakery = ContextQueryBakery(dsd)
            query = bakery.get_query(request.json)

            query_result = query.records(formatter=self.format_row, page=page)
            if KioskSQLDb.in_error_state():
                KioskSQLDb.rollback()
                raise Exception("query cannot be finished because database connection reports an error.")
            records = list(query_result)
            qc_data_context = params["qc_data_context"]
            qc_messages = []
            if qc_data_context:
                if records and "qc_data_context" in records[0]:
                    qc_messages = self.get_qc_messages(records)

            result = {'result_msg': "ok",
                      'record_count': len(records),
                      'page': page,
                      'page_size': query.page_size,
                      'records': records,
                      'qc_messages': qc_messages
                      }
            pages = query.page_count
            if pages:
                result["pages"] = query.page_count

            overall_record_count = query.overall_record_count
            if overall_record_count:
                result["overall_record_count"] = overall_record_count

            api_return = ApiCQLQueryResult().dump(result)
            logging.debug(f"{self.__class__.__name__}.POST: API Call returns {len(records)} records")
            try:
                query.close()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.POST: Exception when closing query: {repr(e)}")
            return api_return
        except BaseException as e:
            try:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
                KioskSQLDb.rollback()
            except BaseException as e:
                pass
            try:
                result = {'result_msg': repr(e),
                          'record_count': 0,
                          'page': 0,
                          'records': [],
                          }
                return ApiCQLQueryResult().dump(result), 500
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
        # finally:
        #     if KioskSQLDb.transaction_active():
        #         KioskSQLDb.rollback()
        #     # KioskSQLDb.set_autocommit(False)

    def get_qc_messages(self, records: [dict]):
        # sync = Synchronization()
        # dsd = Dsd3Singleton.get_dsd3()
        qc = QualityControl()
        messages = []
        data_contexts = set(r["qc_data_context"] for r in records)
        for data_context in data_contexts:
            # data_context = r["qc_data_context"]
            if data_context:
                message_records = qc.get_messages(data_context=data_context)
                for msg_record in message_records:
                    messages.append({"data_context": msg_record["data_context"],
                                     "flag_id": msg_record["flag_id"],
                                     "severity": msg_record["severity"],
                                     "message": msg_record["message"]
                                     })
        return messages
