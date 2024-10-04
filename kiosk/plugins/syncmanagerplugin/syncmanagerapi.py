# from flask_restplus import Namespace, Resource
import logging
import pprint

from flask import url_for, request
from flask_allows import requires
from flask_restful import Resource, abort
from marshmallow import Schema, fields

import kioskdatetimelib
import kioskglobals
import kioskrepllib
import kioskstdlib
from api.kioskapi import PublicApiInfo
from authorization import EDIT_WORKSTATION_PRIVILEGE, \
    IsAuthorized
from core.kioskapi import KioskApi
from kioskglobals import kiosk_version, kiosk_version_name, get_global_constants, get_config, httpauth
from kioskworkstation import KioskWorkstation
from makejsonresponse import make_json_response
from mcpinterface.mcpconstants import *
from .kiosksyncmanager import KioskSyncManager
from .kioskworkstationjobs import KioskWorkstationJob, JOB_META_TAG_DELETED, JOB_META_TAG_CREATED

API_VERSION = "0.1.0"


def register_resources(api: KioskApi):
    api.add_resource(V1SyncManagerApiInfo, '/syncmanager/v1/api-info', endpoint='syncmanager-v1-api-info')
    api.spec.components.schema("SyncManagerApiInfoV1", schema=SyncManagerApiInfoV1)
    api.spec.path(resource=V1SyncManagerApiInfo, api=api, app=api.flask_app)

    api.add_resource(V1SyncManagerWorkstations, '/syncmanager/v1/workstations', endpoint='syncmanager-v1-workstations')
    api.spec.components.schema("SyncManagerWorkstationV1", schema=SyncManagerWorkstationV1)
    api.spec.components.schema("SyncManagerWorkstationsV1", schema=SyncManagerWorkstationsV1)
    api.spec.path(resource=V1SyncManagerWorkstations, api=api, app=api.flask_app)

    api.add_resource(V1SyncManagerWorkstationJob, '/syncmanager/v1/workstation/<string:ws_id>/job',
                     endpoint='syncmanager-v1-workstation-job')
    api.spec.components.schema("SyncManagerWorkstationActionResultV1", schema=SyncManagerWorkstationActionResultV1)
    api.spec.path(resource=V1SyncManagerWorkstationJob, api=api, app=api.flask_app)

    V1SyncManagerDock.register(api)
    V1SyncManagerEvents.register(api)


# ************************************************************************************
# functions several resources share
# ************************************************************************************
def get_workstation_information(workstation_id, workstation):
    ws_result = {"id": workstation_id,
                 "type": workstation.get_readable_name(),
                 "workstation_class": workstation.__class__.__name__,
                 "description": workstation.description,
                 'disabled': workstation.disabled if hasattr(workstation, 'disabled') else False,
                 "state_text": workstation.state_text,
                 "state_description": workstation.state_description,
                 "recording_group": workstation.recording_group,
                 }

    if workstation.icon_code:
        ws_result["icon_code"] = workstation.icon_code
    elif workstation.icon_url:
        ws_result["icon_url"] = workstation.icon_url
    actions = {}
    actions["log"] = url_for("syncmanager.workstation_log", ws_id=workstation_id)
    ws_result["actions"] = actions

    return ws_result


# ************************************************************************************
# /api-info
# ************************************************************************************

class SyncManagerApiInfoV1(PublicApiInfo):
    class Meta:
        fields = (*PublicApiInfo.Meta.fields, "api")
        ordered = True


class V1SyncManagerApiInfo(Resource):

    @httpauth.login_required
    def get(self):
        ''' retrieve information about the synchronization manager api.
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
        '''
        cfg = get_config()
        return SyncManagerApiInfoV1().dump({
            'api': 'syncmanager',
            'project': cfg.config["project_id"],
            'project_name': get_global_constants()["project_name"],
            'kiosk_version_name': kiosk_version_name,
            'kiosk_version': kiosk_version,
            'api_version': API_VERSION})


# ************************************************************************************
# /workstations
# ************************************************************************************

class SyncManagerWorkstationV1(Schema):
    class Meta:
        fields = (
            "id", "workstation_class", "type", "description", "state_text", "state_description", "icon_code",
            "icon_url",
            "job_status", "job_status_code", "job_result", "job_progress", "meta")

    id: fields.Str()
    type: fields.Str()
    workstation_class: fields.Str()
    description: fields.Str()
    state_text: fields.Str()
    state_description: fields.Str()
    disabled: fields.Boolean()
    recording_group: fields.Str()
    icon_code: fields.Str(required=False)
    icon_url: fields.Str(required=False)
    job_status: fields.Str(required=False)
    job_status_code: fields.Int(required=False)
    job_result: fields.Str(required=False)
    job_progress: fields.Dict(required=False)
    meta: fields.Str(required=False)


class SyncManagerWorkstationsV1(Schema):
    class Meta:
        fields = ("result_msg", "poll_delay", "workstations", "sync_status", "last_sync_ts")
        ordered = True

    result_msg: fields.Str()
    workstations: fields.List(fields.Nested(SyncManagerWorkstationV1))
    poll_delay: fields.Int()
    sync_status: fields.Int()
    last_sync_ts: fields.Str(default='')


class V1SyncManagerWorkstations(Resource):

    @httpauth.login_required
    def get(self):
        ''' retrieves detailed information about the data and state of all workstations
            ---
            summary: retrieves detailed information about the data and state of all workstations
            security:
                - jwt: []
            responses:
                '200':
                    description: ok, workstation info included
                    content:
                        application/json:
                            schema: SyncManagerWorkstationsV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''
        cfg = get_config()
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        result = self.gather_workstation_information(sync_manager)
        try:
            sync_job = sync_manager.get_current_synchronization_job()
        except BaseException as e:
            sync_job = None

        if sync_job:
            sync_status = sync_job.status
        else:
            sync_status = -1

        poll_delay = kioskstdlib.try_get_dict_entry(cfg.get_plugin_config("syncmanagerplugin"),
                                                    "poll_intervall_slow_sec", 60)

        if self.gather_job_information(result, sync_manager):
            poll_delay = kioskstdlib.try_get_dict_entry(cfg.get_plugin_config("syncmanagerplugin"),
                                                        "poll_intervall_fast_sec", 2)
        else:
            poll_delay = kioskstdlib.try_get_dict_entry(cfg.get_plugin_config("syncmanagerplugin"),
                                                        "poll_intervall_slow_sec", 60)
        try:
            result = self.sort_by_port(result, cfg)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get: Error when sorting by port: {repr(e)}")

        return SyncManagerWorkstationsV1().dump({
            'result_msg': 'ok',
            'poll_delay': poll_delay,
            'sync_status': sync_status,
            'workstations': list(result.values()),
            'last_sync_ts': kioskstdlib.iso8601_to_str(sync_manager.last_sync_ts) if sync_manager.last_sync_ts else ""
        })

    @classmethod
    def gather_workstation_information(cls, sync_manager: KioskSyncManager):
        result = {}
        workstations = sync_manager.list_workstations()
        for workstation_id, workstation in workstations.items():
            result[workstation_id] = get_workstation_information(workstation_id, workstation)

        return result

    def gather_job_information(self, result, sync_manager) -> bool:
        """
        gathers job information for workstations.
        :param result: the result dict which will be updated with job information and even new workstations.
        :param sync_manager: the sync_manager instance
        :return: True if there is at least one workstation that has a running job.
        """
        poll_fast = False
        s = ""
        for ws_job in sync_manager.list_latest_workstation_jobs():
            if ws_job.workstation_id:
                if ws_job.workstation_id not in result:
                    result[ws_job.workstation_id] = {"id": ws_job.workstation_id}
                    if JOB_META_TAG_DELETED in ws_job.meta_data:
                        result[ws_job.workstation_id]["meta"] = JOB_META_TAG_DELETED
                    else:
                        result[ws_job.workstation_id]["meta"] = JOB_META_TAG_CREATED
                result[ws_job.workstation_id]["job_status"] = ws_job.mcp_job.status_text
                result[ws_job.workstation_id]["job_status_code"] = ws_job.mcp_job.status
                s += f'{ws_job.workstation_id} ({result[ws_job.workstation_id]["job_status_code"]}) '
                if MCPJobStatus.JOB_STATUS_REGISTERED <= ws_job.mcp_job.status <= MCPJobStatus.JOB_STATUS_CANCELLING:
                    poll_fast = True
                result[ws_job.workstation_id]["job_result"] = ws_job.mcp_job.result
                result[ws_job.workstation_id]["job_progress"] = ws_job.mcp_job.progress.get_progress_dict()

        return poll_fast

    def sort_by_port(self, docks: dict, cfg) -> dict:
        """
        sorts the list of docks according to the ports setting in the kiosk config.
        :param docks: the dict with the docks
        :param cfg: the configuration
        :return: True if there is at least one workstation that has a running job.
        """
        ports = kioskstdlib.try_get_dict_entry(cfg.get_plugin_config("syncmanagerplugin"),
                                               "ports", None)
        if not ports or not isinstance(ports, list):
            ports = ["default", "*"]
        top_ports = []
        bottom_ports = []

        _ = top_ports
        for p in ports:
            if p == "*":
                _ = bottom_ports
            else:
                _.append(p)

        default_dock = ports[0]
        top_ports.sort(key=lambda x: x.lower())
        bottom_ports.sort(key=lambda x: x.lower())
        all_ports = list(set([kioskstdlib.try_get_dict_entry(dock, "recording_group", default_dock, True)
                              for dock in docks.values()]))
        all_ports.sort(key=lambda x: x.lower())

        for key, dock in docks.items():
            if "recording_group" not in dock:
                dock["recording_group"] = default_dock
            port = dock["recording_group"]
            if port in top_ports:
                sort_id = "1"
            elif port in bottom_ports:
                sort_id = "3"
            else:
                sort_id = "2"
            sort_id += '%03d' % all_ports.index(port)
            sort_id += key.lower()
            dock["sort_id"] = sort_id

        return dict(sorted(docks.items(), key=lambda el: el[1]["sort_id"]))


# ************************************************************************************
# /workstation/<ws_id>/job
# ************************************************************************************

class SyncManagerWorkstationActionResultV1(Schema):
    class Meta:
        fields = ("result_msg",)

    result_msg: fields.Str()


class V1SyncManagerWorkstationJob(Resource):

    @httpauth.login_required
    @requires(IsAuthorized(EDIT_WORKSTATION_PRIVILEGE))
    def delete(self, ws_id: str):
        ''' cancels the running job of a workstation
            ---
            summary: cancels the running job of a workstation
            security:
                - jwt: []
            parameters:
                    - in: path
                      name: ws_id
                      required: true
                      schema:
                        type: string
                        minimum: 1
                      description: The Workstation Id
            responses:
                '200':
                    description: ok, workstation info included
                    content:
                        application/json:
                            schema: SyncManagerWorkstationActionResultV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''
        result_msg = ""
        try:
            cfg = get_config()
            sync_manager = KioskSyncManager(kioskglobals.type_repository)
            ws: KioskWorkstation = sync_manager.get_workstation(ws_id)
            if not ws:
                abort(404)

            job: KioskWorkstationJob = sync_manager.get_latest_workstation_job(ws_id)
            if job:
                if job.mcp_job.status == MCPJobStatus.JOB_STATUS_CANCELLING:
                    result_msg = "job is already trying to abort"
                else:
                    if job.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                        job.mcp_job.cancel()
                        result_msg = "ok"
                    else:
                        result_msg = "job has already either finished or stopped"
            else:
                result_msg = f"There is no running job for {ws.description}"
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.delete: {repr(e)}")
            result_msg = repr(e)

        return SyncManagerWorkstationActionResultV1().dump({
            'result_msg': result_msg})


# ************************************************************************************
# /workstation/<ws_id>
# ************************************************************************************

class ApiDockGetParameter(Schema):
    class Meta:
        fields = ("dock_id",)
        ordered = True

    dockid = fields.Str(required=True)


class ApiDockGetError(Schema):
    class Meta:
        fields = ("result_msg",)

    result_msg: fields.Str()


class V1SyncManagerDock(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/syncmanager/v1/dock')
        api.spec.components.schema("ApiDockGetError", schema=ApiDockGetError)
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    # @requires(IsAuthorized(EDIT_WORKSTATION_PRIVILEGE))
    def get(self):
        ''' retrieves the information for a single dock
            ---
            summary: retrieves the information for a single dock
            security:
                - jwt: []
            parameters:
                - in: query
                  name: dock_id
                  schema:
                    type: ApiDockGetParameter
            responses:
                '200':
                    description: returns the information for a single dock
                    content:
                        application/json:
                            schema: SyncManagerWorkstationV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
                '404':
                    description: the requested resource does not exist
                    content:
                        application/json:
                            schema: ApiDockGetError
                '500':
                    description: Something went wrong
                    content:
                        application/json:
                            schema: ApiDockGetError
        '''
        try:
            params = ApiDockGetParameter().load(request.args)
            cfg = get_config()
            sync_manager = KioskSyncManager(kioskglobals.type_repository)
            ws = sync_manager.get_workstation(params["dock_id"])
            if ws:
                result = get_workstation_information(ws.id, ws)
                return SyncManagerWorkstationV1().dump(result)
            else:
                return ApiDockGetError().dump({"result_msg": f"dock {params['dock_id']} does not exist."}), 404

        except BaseException as e:
            return ApiDockGetError().dump({"result_msg": repr(e)}), 500


# ************************************************************************************
# /events
# ************************************************************************************

class SyncManagerEventV1(Schema):
    class Meta:
        fields = (
            "uid", "ts", "type", "event", "message", "dock", "level", "user"
        )

    uid: fields.Str()
    ts: fields.Str()
    event: fields.Str()
    message: fields.Str()
    dock: fields.Str()
    level: fields.Integer()
    user: fields.Str(required=False)


class SyncManagerEventsV1(Schema):
    class Meta:
        fields = ("last_sync_ts", "events")
        ordered = True

    last_sync_ts: fields.Str()
    events: fields.List(fields.Nested(SyncManagerEventV1))


class ApiEventsGetParameter(Schema):
    class Meta:
        fields = ("dock_id", "days", "lines")
        ordered = True

    dock_id = fields.Str(required=False, missing="")
    days = fields.Str(required=False, missing=30)
    lines = fields.Str(required=False, missing=0)


class V1SyncManagerEvents(Resource):
    @classmethod
    def register(cls, api):
        api.add_resource(cls, '/syncmanager/v1/events')
        api.spec.components.schema("SyncManagerEventsV1", schema=SyncManagerEventsV1)
        api.spec.path(resource=cls, api=api, app=api.flask_app)

    @httpauth.login_required
    def get(self):
        ''' retrieves the sync manager's event list
            ---
            summary: retrieves the sync manager's event list
            security:
                - jwt: []
            parameters:
                - in: query
                  name: dock_id
                  schema:
                    type: ApiEventsGetParameter
                - in: query
                  name: days
                  schema:
                    type: ApiEventsGetParameter
                - in: query
                  name: lines
                  schema:
                    type: ApiEventsGetParameter
            responses:
                '200':
                    description: ok, events included
                    content:
                        application/json:
                            schema: SyncManagerEventsV1
                '401':
                    description: authorization failed / unauthorized access
                    content:
                        application/json:
                            schema: LoginError
        '''

        params = ApiEventsGetParameter().load(request.args)
        cfg = get_config()
        pprint.pprint(["API-Call: /syncmanager/v1/events", params])
        events = kioskrepllib.get_repl_events(params["dock_id"] if "dock_id" in params else None,
                                              days=params["days"],
                                              lines=params["lines"])
        for i, r in enumerate(events):
            events[i] = { "uid": r[0],
                          "ts": r[1],
                          "event": r[2],
                          "message": r[3],
                          "dock": r[4],
                          "level": r[5],
                          "user": r[6]
                          }


        api_return= SyncManagerEventsV1().dump({
            'events': events,
            'last_sync_ts': '',
        })
        response = make_json_response(api_return)
        return response
