import logging
import re
from typing import List

import flask
from flask import request
from flask_restful import Resource
from marshmallow import Schema, fields

import kioskstdlib
from kioskglobals import get_config, httpauth
from tz.kiosktimezone import KioskTimeZones


class ApiResultTimeZone(Schema):
    class Meta:
        fields = ("id", "tz_long", "tz_IANA", "deprecated", "version")

    id = fields.Integer()
    tz_long = fields.Str()
    tz_IANA = fields.Str()
    deprecated = fields.Bool()
    version = fields.Integer()


class ApiTimeZones(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/timezones')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves a list of available time zone
            ---
            summary: retrieves a list of available time zones
            security:
                - jwt: []
            parameters:
                - in: query
                  name: newer_than
                  required: false
                  schema:
                    type: integer
                - in: query
                  name: filter
                  required: false
                  schema:
                    type: string
                - in: query
                  name: include_deprecated
                  required: false
                  schema:
                    type: boolean
            responses:
                '200':
                    description: returns a list of available time zones
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultTimeZone


                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # ******************************************
        # get main
        # ******************************************
        try:
            cfg = get_config()

            newer_than = 0
            if "newer_than" in request.args:
                s = request.args.get("newer_than")
                if s.isnumeric():
                    newer_than = int(s)

            filter_text = ""
            if "filter" in request.args:
                filter_text = request.args.get("filter")

            include_deprecated = False
            if "include_deprecated" in request.args:
                include_deprecated = request.args.get("include_deprecated")

            logging.info(f"{self.__class__.__name__}.get: Api call to /timezones with {newer_than}, {filter_text}, "
                         f"{include_deprecated}")

            kiosk_tz = KioskTimeZones()
            time_zones = kiosk_tz.list_time_zones(after_version=newer_than,
                                                  include_deprecated=include_deprecated,
                                                  filter_text=filter_text)
            return ApiResultTimeZone(many=True).dump(time_zones), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            flask.abort(500, description=repr(e))


class ApiFavouriteTimeZones(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/favouritetimezones')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves a list of preferred time zone
            ---
            summary: retrieves a list of preferred time zones
                     Preferred time zones are configured in the kiosk config in section 'favourite_time_zones'
            security:
                - jwt: []
            parameters:
                - in: query
                  name: include_deprecated
                  required: false
                  schema:
                    type: boolean
            responses:
                '200':
                    description: returns a list of available and preferred time zones
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultTimeZone


                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        # ******************************************
        # get main
        # ******************************************
        try:
            cfg = get_config()

            include_deprecated = False
            if "include_deprecated" in request.args:
                include_deprecated = request.args.get("include_deprecated")

            logging.info(f"{self.__class__.__name__}.get: Api call to /favouritetimezones with deprecated="
                         f"{include_deprecated}")

            kiosk_tz = KioskTimeZones()
            time_zones = [tz for tz in kiosk_tz.list_time_zones(include_deprecated=include_deprecated) if
                          any(re.search(regex, tz[1]) for regex in cfg.preferred_time_zones)]

            return ApiResultTimeZone(many=True).dump(time_zones), 200
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: {repr(e)}")
            flask.abort(500, description=repr(e))
