from pprint import pprint
import datetime
import logging

from flask import request, make_response, send_file, current_app, send_from_directory
from flask_restful import Resource
from marshmallow import Schema, fields

import kioskdatetimelib
import kioskstdlib
from core.filerepository import FileRepository
from core.kioskrepresentationtype import KioskRepresentationTypeDimensions, KioskRepresentationType

import kioskglobals
from kioskglobals import get_config, httpauth
from synchronization import Synchronization


class ThumbnailNotFoundError(Exception):
    pass


class ApiFileGetParameter(Schema):
    class Meta:
        fields = ("uuid", "resolution")
        ordered = True

    uuid = fields.Str(required=True)
    resolution: str = fields.Str(missing="", default="")


class ApiGetFileError(Schema):
    class Meta:
        fields = ("result_msg",)

    result_msg: fields.Str()


class ApiFile(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/files/file')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves a file of a certain resolution
            ---
            summary: retrieves a file by stating its uid and a resolution
            security:
                - jwt: []
            parameters:
                - in: query
                  name: uuid_and_resolution
                  schema: ApiFileGetParameter
            responses:
                '200':
                    description: returns a single file
                    content:
                        image/*:
                            schema:
                               type: string
                               format: binary
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
                '404':
                    description: the requested resource does not exist
                    content:
                        application/json:
                            schema: ApiGetFileError
        '''

        # ******************************************
        # get main
        # ******************************************
        cfg = get_config()
        dsd = kioskglobals.master_view.dsd
        params = ApiFileGetParameter().load(request.args)
        uuid = params["uuid"]

        sync = Synchronization()
        file_repos = FileRepository(kioskglobals.cfg,
                                    event_manager=None,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync
                                    )

        ctx_file = file_repos.get_contextual_file(uuid)
        if ctx_file:
            file_attr = ctx_file.get_file_attributes()
            try:
                resolution = params["resolution"]
                if resolution:
                    representation_type = KioskRepresentationType(params["resolution"])
                    fm_filename = ctx_file.get(representation_type, create=True)
                    if not fm_filename:
                        raise ThumbnailNotFoundError()
                else:
                    print("getting raw file")
                    fm_filename = ctx_file.get()

                if fm_filename:
                    try:

                        resp = make_response(send_from_directory(kioskstdlib.get_file_path(fm_filename),
                                                                 kioskstdlib.get_filename(fm_filename)))
                        resp.set_cookie('fileDownload', 'true')
                        resp.headers['Last-Modified'] = kioskdatetimelib.get_utc_now(no_tz_info=True)
                        resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, ' \
                                                        'pre-check=0, max-age=0'
                        resp.headers['Pragma'] = 'no-cache'
                        resp.headers['Expires'] = '-1'
                        resp.headers["X-Image-Height"] = file_attr["height"] if "height" in file_attr else 0
                        resp.headers["X-Image-Width"] = file_attr["width"] if "width" in file_attr else 0
                        logging.info("Starting download of file " + fm_filename)
                        resp.headers["Access-Control-Expose-Headers"] = "X-Image-Height, X-Image-Width"
                        return resp
                    except BaseException as e:
                        logging.error(f"ApiFile.get: file_repository_download_file: {repr(e)}")
                        result = {'result_msg': repr(e)}
            except ThumbnailNotFoundError:
                logging.error(f"{self.__class__.__name__}.get: Thumbnail {params['resolution']} "
                              f"for file {uuid} not found.")
                pass
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.get : {repr(e)}")

        result = {'result_msg': "File not found"}

        return ApiGetFileError().dump(result), 404


class ApiResultResolution(Schema):
    class Meta:
        fields = ("id", "label", "width", "height")

    id = fields.Str()
    label = fields.Str()
    width = fields.Int()
    height = fields.Int()


class ApiResolution(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/v1/files/resolutions')
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves available file resolutions
            ---
            summary: retrieves a file by stating its uid and a resolution
            security:
                - jwt: []
            responses:
                '200':
                    description: returns a list of available resolutions
                    content:
                        application/json:
                            schema:
                                type: array
                                items: ApiResultResolution


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
        dsd = kioskglobals.master_view.dsd

        # params = ApiFileGetParameter().load(request.args)
        # pprint({"ApiFileGetParameter": params})
        thumbnails = FileRepository.get_thumbnail_types(cfg)
        result = []
        for thumbnail in thumbnails.values():
            try:
                detail = FileRepository.get_representation_type_details(cfg, thumbnail)
                dimensions = KioskRepresentationTypeDimensions()
                dimensions.from_string(detail["dimensions"])
                result.append({"id": thumbnail,
                               "label": detail["label"],
                               "width": dimensions.width,
                               "height": dimensions.height
                               })
            except KeyError as e:
                pass

        return ApiResultResolution(many=True).dump(result), 200
