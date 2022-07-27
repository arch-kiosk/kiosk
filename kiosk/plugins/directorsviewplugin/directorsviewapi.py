# from flask_restplus import Namespace, Resource
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from flask_restful import Resource
from core.kioskapi import KioskApi
from marshmallow import Schema
from api.kioskapi import PublicApiInfo

API_VERSION = "0.1.0"


def register_resources(api: KioskApi):
    api.add_resource(V1DirectorsApiInfo, '/director/v1/api-info', endpoint='director-v1-api-info')
    api.spec.components.schema("DirectorApiInfoV1", schema=DirectorApiInfoV1)
    api.spec.path(resource=V1DirectorsApiInfo, api=api, app=api.flask_app)


class DirectorApiInfoV1(PublicApiInfo):
    class Meta:
        fields = (*PublicApiInfo.Meta.fields, "api")
        ordered = True


class V1DirectorsApiInfo(Resource):

    @httpauth.login_required
    def get(self):
        ''' retrieve information about the director's view api.
            ---
            summary: retrieve information about the director's view api.
            security:
                - jwt: []
            responses:
                '200':
                    description: returns basic information about the api in the body
                    content:
                        application/json:
                            schema: DirectorApiInfoV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''
        cfg = get_config()
        return DirectorApiInfoV1().dump({
            'api': 'director',
            'project': cfg.config["project_id"],
            'project_name': get_global_constants()["project_name"],
            'kiosk_version_name': kiosk_version_name,
            'kiosk_version': kiosk_version,
            'api_version': API_VERSION})
