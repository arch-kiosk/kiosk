import logging
import pprint

import flask
import marshmallow
from flask import request
from flask_restful import Resource
from marshmallow import Schema, fields, base

import kioskglobals
import kioskstdlib
from core.kioskapi import KioskApi
from fts.kioskfulltextsearch import FTS
from kioskglobals import httpauth
from makejsonresponse import make_json_response

MAX_FTS_HITS = 100
MAX_MAX_FTS_HITS = 500


class ApiResultFTSError(Schema):
    class Meta:
        fields = ("result_msg",)

    result_msg = fields.Str()


class ApiResultKioskFTSHit(Schema):
    class Meta:
        fields = ("uid", "identifier", "identifier_record_type", "record_type", "excerpt", "rank")
        ordered = True

    uid: fields.Str()
    identifier: fields.Str()
    identifier_record_type: fields.Str()
    record_type: fields.Str()
    excerpt: fields.Str()
    rank: fields.Dict()


class ApiResultFTS(Schema):
    class Meta:
        fields = ("result_msg", "page", "pages", "page_size", "record_count", "overall_record_count",
                  "records")
        ordered = True

    result_msg: fields.Str()
    page: fields.Int(default=1)
    pages: fields.Int()
    page_size: fields.Int()
    record_count: fields.Int()
    overall_record_count: fields.Int()
    # dsd_information: fields.Dict(missing={})
    # document_information: fields.Dict(missing={})
    records: fields.List(fields.Nested(ApiResultKioskFTSHit(many=True)), missing=[])


class ApiFTS(Resource):
    @classmethod
    def register(cls, api: KioskApi):
        api.add_resource(cls, '/v1/kioskfts')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' returns full text search results)
            ---
            summary: returns a number of full text search results
            description:

            security:
                - jwt: []
            parameters:
                - in: query
                  name: search_prompt
                  required: true
                  schema:
                    type: string
                - in: query
                  name: limit
                  type: string
                  required: false
                  description: the maximum number of hits to return. 100 if not specified.
            responses:
                '200':
                    description: returns a ApiResultFTS document
                    content:
                        application/json:
                            schema: ApiResultFTS
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        try:
            search_prompt = request.args.get("search_prompt")
            print("search_prompt", search_prompt)

            limit = MAX_FTS_HITS
            if "limit" in request.args:
                s = request.args.get("limit")
                if s.isnumeric():
                    limit = int(s)

            print(f"limited to {limit} hits")

            query_result = None
            if not FTS.ready():
                raise Exception("Kiosk's full text search is not available")

            cfg = kioskglobals.get_config()
            dsd = kioskglobals.master_view.dsd
            fts = FTS(dsd, cfg)

            if limit > MAX_MAX_FTS_HITS:
                limit = MAX_MAX_FTS_HITS
            if limit < 1:
                limit = MAX_FTS_HITS

            documents = []
            for hit in fts.search(search_prompt, limit,with_excerpts=True):
                doc = {"record_type": hit.record_type, "rank": hit.rank,
                       "identifier_record_type": hit.identifier_record_type, "identifier": hit.identifier,
                       "uid": hit.id, "excerpt": hit.excerpt}
                documents.append(doc)

            # pprint.pprint(documents)
            result = {'result_msg': "ok",
                      'record_count': len(documents),
                      'overall_record_count': len(documents),
                      'page': 1,
                      'page_size': len(documents),
                      'records': documents,
                      }
            # pprint.pprint(result)
            api_return = ApiResultFTS().dump(result)
            # try:
            #     if query_result is not None:
            #         query_result.close()
            # except BaseException as e:
            #     logging.error(f"{self.__class__.__name__}.POST: Exception "
            #                   f"when closing kiosk full text search results: {repr(e)}")
            response = make_json_response(api_return)
            return response
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            try:
                result = {'result_msg': e,
                          }
                return ApiResultFTSError().dump(result), 500
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.get: A second exception occured: {repr(e)}")
                flask.abort(500)
