# from flask_restplus import Namespace, Resource
import decimal
import logging
import datetime
from http import HTTPStatus
from typing import Callable, Union

import flask
import json

import werkzeug.http
from flask import request, jsonify, current_app, Response
from flask.json.provider import DefaultJSONProvider, _default
from flask_restful import Resource

import kioskglobals
import kioskstdlib
from api.kioskapi import PublicApiInfo
from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from marshmallow import Schema, fields, validate

from makejsonresponse import make_json_response
from presentationlayer.kioskviewdocument import KioskViewDocument

API_VERSION = "0.1.0"


def register_resources(api: KioskApi):
    api.add_resource(V1QueryAndViewApiInfo, '/queryandview/v1/api-info', endpoint='queryandview-v1-api-info')
    api.spec.components.schema("QueryAndViewApiInfoV1", schema=QueryAndViewApiInfoV1)
    api.spec.path(resource=V1QueryAndViewApiInfo, api=api, app=api.flask_app)
    V1QueryAndViewApiView.register(api)


# ************************************************************************************
# /api-info
# ************************************************************************************
class QueryAndViewApiInfoV1(PublicApiInfo):
    class Meta:
        fields = (*PublicApiInfo.Meta.fields, "api")
        ordered = True


class V1QueryAndViewApiInfo(Resource):

    @httpauth.login_required
    def get(self):
        """ retrieve information about the QueryAndView api.
            ---
            summary: retrieve information about the QueryAndView Api.
            security:
                - jwt: []
            responses:
                '200':
                    description: returns basic information about the api in the body
                    content:
                        application/json:
                            schema: QueryAndViewApiInfoV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        """
        cfg = get_config()
        return QueryAndViewApiInfoV1().dump({
            'api': 'queryandview',
            'project': cfg.config["project_id"],
            'project_name': get_global_constants()["project_name"],
            'kiosk_version_name': kiosk_version_name,
            'kiosk_version': kiosk_version,
            'api_version': API_VERSION})


# ************************************************************************************
# /view
# ************************************************************************************
class ApiResultViewError(Schema):
    class Meta:
        fields = ("result_msg",)

    result_msg: fields.Str()


class ApiViewIdentifierParameter(Schema):
    class Meta:
        fields = ("identifier",)
        ordered = True

    identifier = fields.Str(required=True)


class ApiResultView(Schema):
    class Meta:
        fields = ("result_msg", "document")
        ordered = True

    result_msg: fields.Str()
    document: fields.Dict()


class KioskApiJSONProvider(DefaultJSONProvider):
    def __init__(self, app):
        super().__init__(app)
        self.default = self._json_default

    @staticmethod
    def _json_default(o):
        if isinstance(o, datetime.date):
            return o.isoformat()
        else:
            return _default(o)


class V1QueryAndViewApiView(Resource):
    @classmethod
    def register(cls, api: KioskApi):
        api.add_resource(cls, '/queryandview/v1/view/<string:record_type>')
        # api.spec.components.schema("QueryAndViewApiInfoV1", schema=QueryAndViewApiInfoV1)
        # api.spec.components.schema("ApiKioskQueryUICScenarioParameter", schema=ApiKioskQueryUICScenarioParameter)
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self, record_type):
        ''' returns a View document for a record type and identifier
            ---
            summary: returns a complete View document for a record type and identifier
            description: the view document consists of a presentation layer definition with layout settings and data

            security:
                - jwt: []
            parameters:
                - in: path
                  name: record_type
                  required: true
                  schema:
                    type: string
                    minimum: 1
                  description: the trigger record type
                - in: query
                  name: identifier
                  schema: ApiViewIdentifierParameter
            responses:
                '200':
                    description: returns an ApiViewResult document
                    content:
                        application/json:
                            schema: ApiResultView
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        try:
            params = ApiViewIdentifierParameter().load(request.args)
            identifier = params["identifier"]
            logging.info(f"request of view document for {record_type}/{identifier}")
            print(f"request of view document for {record_type}/{identifier}")
            conf = kioskglobals.get_config()
            plugin_cfg = conf.kiosk["queryandviewplugin"]
            pld_id = kioskstdlib.try_get_dict_entry(plugin_cfg, "pld", "general", True)
            view_doc = KioskViewDocument(record_type, pld_id, identifier)
            try:
                doc = view_doc.compile()
                api_result = ApiResultView().dump({'result_msg': 'ok',
                                                   'document': doc})
            except Exception as e:
                if "No compilation" in repr(e):
                    api_result = ApiResultView().dump({'result_msg': f'The record type "{record_type}" '
                                                                     f'has no defined view and cannot be shown '
                                                                     f'with the current Kiosk configuration. '
                                                                     f'Please ask '
                                                                     f'your admin to install a view.',
                                                       'document': {}})
                else:
                    raise e

            response = make_json_response(api_result)
            return response

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            try:
                result = {'result_msg': repr(e),
                          }
                return ApiResultViewError().dump(result), HTTPStatus.NOT_FOUND
                # return jsonify()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
                flask.abort(500, description=repr(e))

