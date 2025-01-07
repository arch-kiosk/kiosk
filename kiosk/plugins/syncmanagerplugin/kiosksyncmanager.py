import logging
import datetime
import typing

import kioskstdlib
from mcpinterface.mcpconstants import MCPJobStatus
from typerepository import TypeRepository
from typing import Dict, List, Optional

import kioskglobals
from kioskrepositorytypes import TYPE_KIOSK_WORKSTATION
from kioskworkstation import KioskWorkstation
from mcpinterface.mcpjob import MCPJob
from mcpinterface.mcpqueue import MCPQueue
from plugins.syncmanagerplugin.kioskworkstationjobs import KioskWorkstationJobs, KioskWorkstationJob, \
    JOB_META_TAG_SYNCHRONIZATION
from synchronization import Synchronization
from tz.kiosktimezoneinstance import KioskTimeZoneInstance
from workstation import Workstation


class KioskSyncManager:
    def __init__(self, type_repository, sync=None):
        self.type_repository: TypeRepository = type_repository
        if sync:
            self.sync = sync
        else:
            self.sync = Synchronization()
        self.workstation_types = {}
        self._workstation_jobs = None

    @property
    def last_sync_ts(self) -> typing.Union[None, datetime.datetime]:
        """
        returns the last synchronization date
        :return: datetime
        """

        return self.sync.get_sync_time()

    @property
    def workstation_jobs(self) -> KioskWorkstationJobs:
        """
        returns an initialized KioskWorkstationJobs instance that
        can be used to get a list of jobs connected to workstations (and loads if necessary).
        The KioskWorkstationJobs instance returns only jobs for the current project
        :return: KioskWorkstationJobs
        """
        if not self._workstation_jobs:
            self._workstation_jobs = KioskWorkstationJobs(kioskglobals.general_store,
                                                          kioskglobals.get_config().get_project_id())
        return self._workstation_jobs

    def _load_kiosk_workstations_for_workstations(self):

        self.workstation_types = {}
        for _ in self.type_repository.list_types(TYPE_KIOSK_WORKSTATION):
            kiosk_workstation_type = self.type_repository.get_type(TYPE_KIOSK_WORKSTATION, _)
            self.workstation_types.update(kiosk_workstation_type.get_supported_workstation_types())

    def get_kiosk_workstation_type_names(self) -> [str]:
        return self.type_repository.list_types(TYPE_KIOSK_WORKSTATION)

    def get_kiosk_workstation_class(self, workstation_type_name) -> KioskWorkstation:
        return self.type_repository.get_type(TYPE_KIOSK_WORKSTATION, workstation_type_name)

    def is_kiosk_workstation_class_available(self, workstation_type_name, current_user) -> bool:
        ws_class = self.type_repository.get_type(TYPE_KIOSK_WORKSTATION, workstation_type_name)
        if not hasattr(current_user, "fulfills_requirement"):
            return False
        if hasattr(ws_class, "is_available"):
            return ws_class.is_available(current_user)

        return True

    def get_kiosk_workstation_type_from_sync_type_name(self, sync_type_name: str) -> KioskWorkstation or None:
        """
        returns the KioskWorkstation child class (as a class) for the given type name of a sync workstation.
        In other words:
        This finds out which KioskWorkstation class handles a Workstation of a given type in the sync subsystem.
        :param sync_type_name: The name of the workstation type in the sync subsystem
        :return: a KioskWorkstation sub-class (not an instance!) that handles this workstation type
                 or None in case there is none
        """
        if not self.workstation_types:
            self._load_kiosk_workstations_for_workstations()
        for kiosk_type in self.workstation_types.keys():
            if sync_type_name in self.workstation_types[kiosk_type]:
                return self.get_kiosk_workstation_class(kiosk_type)

        return None

    def get_workstation(self, workstation_id: str, current_tz:KioskTimeZoneInstance=None):
        """
        Instantiates and loads a workstation
        :return: The workstation instance or None
        :exception: Can throw exceptions
        """
        for w_id, sync_type in self.sync.list_workstation_ids_and_types():
            if workstation_id == w_id:
                workstation_type = self.get_kiosk_workstation_type_from_sync_type_name(sync_type)
                if workstation_type:
                    # noinspection PyCallingNonCallable
                    workstation = workstation_type(w_id)
                    if workstation.load_workstation(current_tz=current_tz):
                        return workstation

        return None

    def list_workstations(self, filter_workstation_type="") -> Dict[str, KioskWorkstation]:
        """
        Instantiates all KioskWorkstations and returns a list of them.
        :param filter_workstation_type: only lists and instantiates the workstations of the given type
        :return: a dictionary with the workstation-id as key and the KioskWorkstation instances as values
        """
        workstations = {}
        cfg = kioskglobals.get_config()
        grant_by_wildcard = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg.kiosk["syncmanagerplugin"], "grant_by_wildcard", "True", True))
        for w_id, sync_ws_type in self.sync.list_workstation_ids_and_types():
            try:
                if sync_ws_type:
                    kiosk_ws_type = self.get_kiosk_workstation_type_from_sync_type_name(sync_ws_type)
                    if kiosk_ws_type:
                        kiosk_ws_type_name = kiosk_ws_type.__name__
                        if filter_workstation_type in ["", kiosk_ws_type_name]:
                            # noinspection PyCallingNonCallable
                            workstation = kiosk_ws_type(w_id)
                            if workstation.load_workstation():
                                if workstation.access_granted(grant_by_wildcard=grant_by_wildcard):
                                    workstations[w_id] = workstation
                            else:
                                logging.error(
                                    f"{self.__class__.__name__}.list_workstations: Could not load/instantiate "
                                    f"workstation {w_id} ")
                    else:
                        logging.error(f"{self.__class__.__name__}.list_workstations: workstation {w_id} "
                                      f"has no corresponding Kiosk class.")
                else:
                    logging.error(f"{self.__class__.__name__}.list_workstations: workstation {w_id} "
                                  f"has no sync_type")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.list_workstations: "
                              f"Exception when accessing dock {w_id}: {repr(e)}")
        return workstations

    def list_latest_workstation_jobs(self) -> List[KioskWorkstationJob]:
        """
        returns a dictionary with the most recent job currently connected to a workstation operation.
        :return: a list of KioskWorkstationJob instances
        """
        jobs = self.workstation_jobs.fetch_workstation_jobs()
        result = {}
        for job in jobs:
            if job.workstation_id in result.keys():
                if job.mcp_job.modified_ns <= result[job.workstation_id].mcp_job.modified_ns:
                    continue
            result[job.workstation_id] = job

        return list(result.values())

    def get_latest_workstation_job(self, workstation_id: str) -> KioskWorkstationJob or None:
        """
        returns the most recent KioskWorkstationJob for a workstation
        :return: a KioskWorkstationJob instance or None
        """
        jobs = self.workstation_jobs.fetch_workstation_jobs()
        result: typing.Union[KioskWorkstationJob, None] = None
        for job in jobs:
            if job.workstation_id == workstation_id:
                if result:
                    if job.mcp_job.modified_ns <= result.mcp_job.modified_ns:
                        continue
                result = job

        return result

    def get_active_workstation_jobs(self, workstation_id: str) -> List[KioskWorkstationJob]:
        """
        returns the all KioskWorkstationJob jobs that are still active for a workstation
        :return: a possibly empty array of KioskWorkstationJob instances
        """
        jobs = self.workstation_jobs.fetch_workstation_jobs()
        result: List[KioskWorkstationJob] = []
        for job in jobs:
            if job.workstation_id == workstation_id and \
                job.mcp_job.status < MCPJobStatus.JOB_STATUS_CANCELLING:
                    result.append(job)
        return result

    @classmethod
    def get_current_synchronization_job(cls) -> MCPJob:
        """
        fetches the running (or ended) synchronization job.
        Only returns the most recent job.
        :return: an MCPJob Instance of the most recent Job that is running a synchronization
                 or None if there is none.
        :except: throws exceptions
        """
        general_store = kioskglobals.general_store
        queue = MCPQueue(general_store)
        jobs = queue.list_jobs()
        current_job: Optional[MCPJob, None] = None
        cfg = kioskglobals.get_config()
        project_id = cfg.get_project_id()
        if jobs:
            for job_id in jobs:
                job = MCPJob(general_store, job_id)
                if job.project_id == project_id:
                    if job.meta_data and JOB_META_TAG_SYNCHRONIZATION in job.meta_data:
                        if current_job:
                            if job.modified_ns > current_job.modified_ns:
                                current_job = job
                        else:
                            current_job = job

        return current_job
