import logging
import pprint
from http import HTTPStatus
import flask
from flask import request
from flask_login import current_user
from flask_restful import Resource
from flask_wtf import CSRFProtect
from flask_wtf.csrf import generate_csrf
from marshmallow import Schema, fields, ValidationError

import kioskglobals
import kioskstdlib
from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskquerystore import KioskQueryStore
from kiosksqldb import KioskSQLDb
from kioskuser import KioskUser
from makejsonresponse import make_json_response
from .kioskapiconstants import ApiConstants


class ApiResultKioskQueryError(Schema):
    class Meta:
        fields = ("err",)

    err = fields.Str()


class ApiResultKioskQueryDescription(Schema):
    class Meta:
        fields = ("id", "type", "name", "description", "ui", "category", "order_priority", "charts", "show_rows")
        ordered = True

    id: fields.Str()
    type: fields.Str()
    name: fields.Str()
    description: fields.Str()
    ui: fields.Dict()
    category: fields.Str()
    order_priority: fields.Str()
    charts: fields.Dict()
    show_rows: fields.Bool()


class ApiKioskQueryPostParameter(Schema):
    class Meta:
        fields = ("page", "page_size")

    page = fields.Int(missing=1)
    page_size = fields.Int(missing=0)


class ApiKioskQueryPostBody(Schema):
    class Meta:
        fields = ("query_id", "inputs")

    query_id = fields.Str()
    inputs = fields.Dict()


class ApiResultKioskQuery(Schema):
    class Meta:
        fields = ("result_msg", "page", "pages", "page_size", "record_count", "overall_record_count",
                  "dsd_information", "document_information", "records")
        ordered = True

    result_msg: fields.Str()
    page: fields.Int(default=1)
    pages: fields.Int()
    page_size: fields.Int()
    record_count: fields.Int()
    overall_record_count: fields.Int()
    dsd_information: fields.Dict(missing={})
    document_information: fields.Dict(missing={})
    records: fields.List(fields.Dict(), missing=[])


class ApiKioskQuery(Resource):
    @classmethod
    def register(cls, api: KioskApi):
        api.add_resource(cls, '/v1/kioskquery')
        # api.spec.components.schema("ApiKioskQueryUICScenarioParameter", schema=ApiKioskQueryUICScenarioParameter)
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' returns a list of queries and their requirements (ui requirements)
            ---
            summary: returns a list of queries and their requirements (ui requirements)
            description: returns a list of queries and their requirements (ui requirements).
                     To provide the scenario use the scenario parameter (which also works with the swagger ui)
                     To provide UIC literals other than scenario, provide them as normal query-parameters. That is
                     not possible with the swagger UI, though.

            security:
                - jwt: []
            parameters:
                - in: query
                  name: uic_literal
                  schema:
                    type: array
                    items:
                        type: string
            responses:
                '200':
                    description: returns a list of ApiResultKioskQueryDescription entries
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultKioskQueryDescription
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # todo: get the literals from a proper, swagger-ui compatible list of strings
        try:
            uic_literals = request.args.getlist("uic_literal")
            print("uic_literals", uic_literals)
            api_queries = []
            store_queries = KioskQueryStore.list()
            for store_query in store_queries:
                try:
                    store_query: tuple
                    api_query = ApiResultKioskQueryDescription()
                    (api_query.id, api_query.type, api_query.name, api_query.description,
                     api_query.category, api_query.order_priority) = store_query
                    kiosk_query = KioskQueryStore.get(api_query.id)
                    uic_tree = kioskglobals.get_uic_tree()
                    if not uic_tree:
                        raise KioskQueryException("Kiosk has no ui classes configured or "
                                                  "the class definitions have errors. Please consult the Kiosk log for"
                                                  "details")
                    ui = kiosk_query.get_query_ui(uic_tree)
                    api_query.ui = ui.render_input_request(uic_literals=uic_literals)
                    if kiosk_query.query_definition.charts:
                        api_query.charts = kiosk_query.query_definition.charts
                    try:
                        api_query.show_rows = kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(
                            kiosk_query.query_definition.raw_query_definition["queries"][api_query.id],
                            "show_rows", "True", True))
                    except BaseException as e:
                        logging.warning(f"{self.__class__.__name__}.get: {repr(e)}")
                        api_query.show_rows = True
                    api_queries.append(api_query)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.get: Could not load query {store_query[0]}: {repr(e)}")

            return ApiResultKioskQueryDescription(many=True).dump(api_queries), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            try:
                result = {'err': repr(e),
                          }
                return ApiResultKioskQueryError().dump(result), 500
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
                flask.abort(500)

    @httpauth.login_required
    def post(self):
        ''' runs a kiosk query
            ---
            summary: runs a kiosk query
            description: runs a kiosk query
            security:
                - jwt: []
            parameters:
                - in: query
                  name: execution_params
                  schema: ApiKioskQueryPostParameter
            requestBody:
                name: kiosk_query
                content:
                    application/json:
                        schema: ApiKioskQueryPostBody
            responses:
                '200':
                    description: returns a ApiResultKioskQuery JSON object
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultKioskQuery
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        cfg = get_config()
        query_result = None
        try:
            KioskSQLDb.commit()
            # KioskSQLDb.set_autocommit(True)
            logging.debug(f"{self.__class__.__name__}.POST: {request.json}")
            dsd = kioskglobals.master_view.dsd

            params = ApiKioskQueryPostParameter().load(request.args)
            # pprint.pprint({"ApiCQLQueryPostParameter": params})
            page = params["page"]
            page_size = params["page_size"]

            body = ApiKioskQueryPostBody().load(request.json)
            query_id = body["query_id"]
            inputs = body["inputs"] if "inputs" in body and body["inputs"] else {}

            kiosk_query = KioskQueryStore.get(query_id)
            uic_tree = kioskglobals.get_uic_tree()
            if not uic_tree:
                raise KioskQueryException("Kiosk has no ui classes configured or "
                                          "the class definitions have errors. Please consult the Kiosk log for"
                                          "details")
            ui = kiosk_query.get_query_ui(uic_tree)
            ui.process_input(inputs)

            query_result = kiosk_query.execute(query_id)
            documents = list(query_result.get_documents(new_page_size=page_size, page=page))
            result = {'result_msg': "ok",
                      'record_count': len(documents),
                      'overall_record_count': query_result.overall_record_count,
                      'page': page,
                      'page_size': query_result.page_size,
                      'dsd_information': query_result.get_DSD_information(),
                      'document_information': query_result.get_document_information(),
                      'records': documents,
                      }
            # pprint.pprint(result)
            api_return = ApiResultKioskQuery().dump(result)
            # pprint.pprint(api_return)
            try:
                if query_result is not None:
                    query_result.close()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.POST: Exception when closing kiosk query: {repr(e)}")
            response = make_json_response(api_return)
            return response
        except BaseException as e:
            try:
                if query_result is not None:
                    query_result.close()
                # pprint.pprint(repr(e))
            except BaseException as e_close:
                logging.error(f"{self.__class__.__name__}.POST: Exception when closing kiosk query: {repr(e_close)}")

            try:
                logging.error(f"{self.__class__.__name__}.post: Api Call fails with 500 because of: {repr(e)}")
                KioskSQLDb.rollback()
            except BaseException:
                pass
            try:
                result = {'result_msg': repr(e),
                          'record_count': 0,
                          'page': 0,
                          }
                rc = flask.make_response(ApiResultKioskQuery().dump(result), HTTPStatus.BAD_REQUEST)
                return rc
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: Exception when dumping result: {repr(e)}")
                flask.abort(500, repr(e))
