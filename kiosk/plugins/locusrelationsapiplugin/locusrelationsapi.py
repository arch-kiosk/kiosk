# from flask_restplus import Namespace, Resource
import logging

import flask
from flask import request
from flask_restful import Resource
from marshmallow import Schema, fields

import kioskglobals
from core.kioskapi import KioskApi
from dsd.dsd3singleton import Dsd3Singleton
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from makejsonresponse import make_json_response
from api.kioskapilib import PublicApiInfo, KioskApiError
from plugins.locusrelationsapiplugin.locusrelationslib import LocusRelations

plugin_version = "0.1.0"
API_VERSION = "0.1.0"


def register_resources(api: KioskApi):
    api.add_resource(V1LocusRelationsApiInfo, '/locusrelations/v1/api-info', endpoint='locusrelations-v1-api-info')
    api.spec.components.schema("LocusRelationsApiInfoV1", schema=LocusRelationsApiInfoV1)
    api.spec.path(resource=V1LocusRelationsApiInfo, api=api, app=api.flask_app)
    V1LocusRelationsApiRelations.register(api)


# ************************************************************************************
# /api-info
# ************************************************************************************

class LocusRelationsApiInfoV1(PublicApiInfo):
    class Meta:
        fields = (*PublicApiInfo.Meta.fields, "api")
        ordered = True


class V1LocusRelationsApiInfo(Resource):

    @httpauth.login_required
    def get(self):
        ''' retrieve meta information about the locus relations api.
            ---
            summary: retrieve meta information about the locus relations api.
            security:
                - jwt: []
            responses:
                '200':
                    description: returns basic information about the api in the body
                    content:
                        application/json:
                            schema: LocusRelationsApiInfoV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''
        cfg = get_config()
        return LocusRelationsApiInfoV1().dump({
            'api': 'locusrelationsapi',
            'project': cfg.config["project_id"],
            'project_name': get_global_constants()["project_name"],
            'kiosk_version_name': kiosk_version_name,
            'kiosk_version': kiosk_version,
            'api_version': API_VERSION})


# ************************************************************************************
# /relations
# ************************************************************************************

class ApiLocusRelationsIdentifierParameter(Schema):
    class Meta:
        fields = ("identifier",)
        ordered = True

    identifier = fields.Str(required=True)


class ApiLocusRelationsRecordTypeParameter(Schema):
    class Meta:
        fields = ("identifier",)
        ordered = True

    identifier = fields.Str(required=True)


class ApiResultLocusRelations(Schema):
    class Meta:
        fields = ("result", "relation_headers", "locus_headers", "loci", "relations")
        ordered = True

    result: fields.Str()
    relation_headers: fields.List(fields.Str())
    locus_headers: fields.List(fields.Str())
    loci: fields.List(fields.List(fields.Field()))
    relations: fields.List(fields.List(fields.Field()))


class V1LocusRelationsApiRelations(Resource):
    @classmethod
    def register(cls, api: KioskApi):
        api.add_resource(cls, '/locusrelations/v1/relations')
        # api.spec.components.schema("QueryAndViewApiInfoV1", schema=QueryAndViewApiInfoV1)
        # api.spec.components.schema("ApiKioskQueryUICScenarioParameter", schema=ApiKioskQueryUICScenarioParameter)
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' returns all the locus relations involved in a context
            ---
            summary: returns all the locus relations (recursively) that are related to the context

            security:
                - jwt: []
            parameters:
                - in: query
                  name: record_type
                  schema:
                    type: string
                - in: query
                  name: identifier
                  schema:
                    type: string
            responses:
                '200':
                    description: returns an ApiResultLocusRelations document
                    content:
                        application/json:
                            schema: ApiResultLocusRelations
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: KioskApiError
        '''

        def get_headers(lst: list):
            headers = []
            if len(lst) > 0:
                rec1 = lst[0]
                for k in rec1.keys():
                    headers.append(k)

            return headers

        try:
            params = request.args
            identifier = params["identifier"]
            record_type = params["record_type"]
            logging.info(f"request of locus relations for {record_type}/{identifier}")
            print(f"request of locus relations for {record_type}/{identifier}")
            conf = kioskglobals.get_config()
            plugin_cfg = conf.kiosk["locusrelationsapiplugin"]
            dsd = Dsd3Singleton.get_dsd3()
            lr = LocusRelations(record_type, identifier, dsd)
            lr.get_all_relations()
            relation_headers = get_headers(lr.relations)
            locus_headers = get_headers(lr.loci)

            api_result = ApiResultLocusRelations().dump({'result': True,
                                                         'relation_headers': relation_headers,
                                                         'locus_headers': locus_headers,
                                                         'loci': lr.loci,
                                                         'relations': lr.relations})
            response = make_json_response(api_result)
            return response
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            try:
                result = {'err': repr(e),
                          }
                return KioskApiError().dump(result), 500
                # return jsonify()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.post: {repr(e)}")
                flask.abort(500, description=repr(e))
