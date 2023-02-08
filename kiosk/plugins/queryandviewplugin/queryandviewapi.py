# from flask_restplus import Namespace, Resource

from flask_restful import Resource

from api.kioskapi import PublicApiInfo
from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth

API_VERSION = "0.1.0"


def register_resources(api: KioskApi):
    api.add_resource(V1SyncManagerApiInfo, '/queryandview/v1/api-info', endpoint='queryandview-v1-api-info')
    api.spec.components.schema("QueryAndViewApiInfoV1", schema=QueryAndViewApiInfoV1)
    api.spec.path(resource=V1SyncManagerApiInfo, api=api, app=api.flask_app)


# ************************************************************************************
# /api-info
# ************************************************************************************

class QueryAndViewApiInfoV1(PublicApiInfo):
    class Meta:
        fields = (*PublicApiInfo.Meta.fields, "api")
        ordered = True


class V1SyncManagerApiInfo(Resource):

    @httpauth.login_required
    def get(self):
        """ retrieve information about the synchronization manager api.
            ---
            summary: retrieve information about the synchronization manager api.
            security:
                - jwt: []
            responses:
                '200':
                    description: returns basic information about the api in the body
                    content:
                        application/json:
                            schema: SyncManagerApiInfoV1
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
