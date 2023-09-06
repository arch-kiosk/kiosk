# from flask_restplus import Namespace, Resource
import logging
import datetime
import flask
import json
from flask import request, jsonify
from flask_restful import Resource

import kioskglobals
import kioskstdlib
from api.kioskapi import PublicApiInfo
from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from marshmallow import Schema, fields, validate

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
        fields = ("err",)

    err: fields.Str()


class ApiViewIdentifierParameter(Schema):
    class Meta:
        fields = ("identifier",)
        ordered = True

    identifier = fields.Str(required=True)


class ApiResultView(Schema):
    class Meta:
        fields = ("document",)
        ordered = True

    document: fields.Dict()


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
        def json_serial(obj):
            """JSON serializer for objects not serializable by default json code"""

            if isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            raise TypeError("Type %s not serializable" % type(obj))
        try:
            params = ApiViewIdentifierParameter().load(request.args)
            identifier = params["identifier"]
            logging.info(f"request of view document for {record_type}/{identifier}")
            print(f"request of view document for {record_type}/{identifier}")
            conf = kioskglobals.get_config()
            plugin_cfg = conf.kiosk["queryandviewplugin"]
            pld_id = kioskstdlib.try_get_dict_entry(plugin_cfg, "pld", "general", True)
            view_doc = KioskViewDocument(record_type, pld_id, identifier)
            doc = view_doc.compile()
            # todo: This cannot be the last word here. first serializing json
            #       and then deserializing it only to have it serialized again by Flask later on?
            api_result = ApiResultView().dump({'document': doc})
            json_object = json.dumps(api_result, default=json_serial)
            return json.loads(json_object), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            try:
                result = {'err': repr(e),
                          }
                return ApiResultViewError().dump(result), 500
                # return jsonify()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
                flask.abort(500)
