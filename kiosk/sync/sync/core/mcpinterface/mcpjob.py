import logging
import os
import logging
import datetime
import time

import kioskdatetimelib
import kioskstdlib
import uuid
import nanoid
import copy
from mcpinterface.mcpqueue import MCPQueue

from sync_config import SyncConfig

from generalstore.generalstore import GeneralStore
from mcpinterface.mcpconstants import *


def is_mcp_job(job_uid):
    return len(job_uid) <= 21


class Progress:
    def __init__(self, progress: dict):
        self._progress = copy.deepcopy(progress)

    def get_progress(self, topic=""):
        if topic:
            topic = topic.replace(" ", "_")
            if topic in self._progress:
                return kioskstdlib.try_get_dict_entry(self._progress[topic], "progress", 0)
            else:
                return 0
        else:
            return kioskstdlib.try_get_dict_entry(self._progress, "progress", 0)

    def get_message(self, topic=""):
        if topic:
            topic = topic.replace(" ", "_")
            if topic in self._progress:
                return kioskstdlib.try_get_dict_entry(self._progress[topic], "message", "")
            else:
                return ""
        else:
            return kioskstdlib.try_get_dict_entry(self._progress, "message", "")

    def get_progress_dict(self):
        """
        returns a copy of the complete progress dictionary.
        Be aware that if a topic was used with a space, it will have an underscore in the returned dict.
        :return: the raw progress dictionary
        """
        progress = copy.deepcopy(self._progress)
        return progress


class MCPJobInfo:
    job_id: str = ""
    status: int = 0
    base_path: str = ""
    config_file: str = ""
    project_id: str = ""
    module_name: str = ""
    class_name: str = ""
    kiosk_base_path: str = ""
    system_lock: bool = False
    ts_created: datetime.datetime = None
    ts_modified: datetime.datetime = None
    ns_created: int = 0
    ns_modified: int = 0
    auto_renew: bool = True
    capture_log: bool = True
    seconds_till_timeout: int = 120
    seconds_to_idle: int = 600
    os_pid: int = 0
    background_job: bool = False

    def as_dict(self):
        result_dict = dict()
        for attr, value in self.__dict__.items():
            if attr in ["ts_modified", "ts_created"]:
                result_dict[attr] = kioskstdlib.ts_to_str(value)
            else:
                if attr != "as_dict":
                    result_dict[attr] = value

        return result_dict

    def from_dict(self, new_data: dict):
        for attr, value in new_data.items():
            if attr in ["ts_modified", "ts_created"]:
                setattr(self, attr, kioskstdlib.str_to_ts(value))
            else:
                setattr(self, attr, value)


class MCPPayload:
    job_data = {}
    user_data = {}
    meta_data = []


class MCPJob:

    # noinspection PyTypeChecker
    def __init__(self, gs: GeneralStore, job_id: str = '', lock_queue=True, job_type_suffix=''):

        self._job_info: MCPJobInfo = None
        self._payload: MCPPayload = None
        self._config = SyncConfig.get_config()
        self._progress = {}
        self._result = {}
        if not self._config:
            raise Exception(f"{self.__class__.__name__}: SyncConfig.get_config returned None.")

        if not gs:
            raise Exception(f"{self.__class__.__name__}: no general store instance given.")

        self.gs = gs
        self._queue = MCPQueue(self.gs)

        self._init_job(job_type_suffix)
        if job_id:
            self._job_info.job_id = job_id
            self._fetch(lock_queue=lock_queue)

    @property
    def job_id(self):
        return self._job_info.job_id

    @property
    def kiosk_base_path(self):
        return self._job_info.kiosk_base_path

    @property
    def config_file(self):
        return self._job_info.config_file

    @property
    def status(self):
        return self._job_info.status

    @property
    def modified_ns(self):
        return self._job_info.ns_modified

    @property
    def modified_datetime(self):
        return self._job_info.ts_modified

    @property
    def status_text(self):
        return MCPJobStatus.STATUS_TO_STR[self._job_info.status]

    def set_status_to(self, new_status, lock_queue=True):
        """
        sets the status to a new status. Should be used by MCP only.
        :param new_status:
        :returns: True or raises Exception
        """
        self._set_job_attribute("status", new_status, lock_queue=lock_queue, max_status=MCPJobStatus.JOB_STATUS_ABORTED)
        return True

    @property
    def result(self) -> dict:
        """
        returns the current result without fetching it from the general store
        :return: a dict
        """
        return self._result

    @property
    def progress(self) -> Progress:
        """
        returns a copy of the current progress without fetching it from the general store
        :return: Progress: a copy of the progress
        """
        return Progress(self._progress)

    @property
    def capture_log(self):
        return self._job_info.capture_log

    @capture_log.setter
    def capture_log(self, value):
        self._set_job_attribute("capture_log", value)

    @property
    def auto_renew(self):
        return self._job_info.auto_renew

    @auto_renew.setter
    def auto_renew(self, value):
        self._set_job_attribute("auto_renew", value)

    @property
    def seconds_till_timeout(self):
        return self._job_info.seconds_till_timeout

    @seconds_till_timeout.setter
    def seconds_till_timeout(self, value):
        self._set_job_attribute("seconds_till_timeout", value)

    @property
    def seconds_to_idle(self):
        return self._job_info.seconds_to_idle

    @seconds_to_idle.setter
    def seconds_to_idle(self, value):
        self._set_job_attribute("seconds_to_idle", value, max_status=MCPJobStatus.JOB_STATUS_ABORTED)

    @property
    def os_pid(self):
        return self._job_info.os_pid

    @os_pid.setter
    def os_pid(self, value):
        self._set_job_attribute("os_pid", value, max_status=MCPJobStatus.JOB_STATUS_STARTED)

    def drop_process_id(self):
        self._set_job_attribute("os_pid", 0, max_status=MCPJobStatus.JOB_STATUS_ABORTED)

    @property
    def project_id(self):
        return self._job_info.project_id

    @project_id.setter
    def project_id(self, value):
        self._set_job_attribute("project_id", value, max_status=MCPJobStatus.JOB_STATUS_REGISTERED)

    @property
    def system_lock(self):
        return self._job_info.system_lock

    @system_lock.setter
    def system_lock(self, value: bool):
        """
        set to true to make this job run by an exclusive process and give it priority over non-exclusive jobs.
        The job will run as the sole exclusive process and only parallel to non-exclusive jobs from other projects
        and background jobs.
        :param value: true/false
        """
        self._set_job_attribute("system_lock", value, max_status=MCPJobStatus.JOB_STATUS_GHOST)

    @property
    def background_job(self):
        return self._job_info.background_job

    @background_job.setter
    def background_job(self, value: bool):
        """
        set to true to make this job a background job.
        Such a job will not block any other job - Not even system_lock jobs!
        It won't start, tough, as long as there is a system_lock job running.

        :param value: true/false
        """
        self._set_job_attribute("background_job", value, max_status=MCPJobStatus.JOB_STATUS_GHOST)

    def get_job_info_attribute(self, attribute: str):
        return getattr(self._job_info, attribute)

    def set_worker(self, module_name: str, class_name: str):
        self._set_job_attribute("module_name", module_name, max_status=MCPJobStatus.JOB_STATUS_GHOST)
        self._set_job_attribute("class_name", class_name, max_status=MCPJobStatus.JOB_STATUS_GHOST)

    def get_worker(self):
        if self._job_info.module_name and self._job_info.class_name:
            return self._job_info.module_name, self._job_info.class_name
        else:
            return ()

    def _set_payload(self, attr: str, data: dict):
        if attr:
            if self.status == MCPJobStatus.JOB_STATUS_GHOST:
                if data:
                    setattr(self._payload, attr, copy.deepcopy(data))
                else:
                    setattr(self._payload, attr, dict())
            else:
                raise MCPJobStatusError(f"{self.__class__.__name__}._set_payload: No possible in state "
                                        f"{MCPJobStatus.STATUS_TO_STR[self.status]}")
        else:
            raise ValueError(f"{self.__class__.__name__}._set_payload: no attr given.")

    @property
    def job_data(self):
        return copy.deepcopy(self._payload.job_data)

    @job_data.setter
    def job_data(self, value: dict):
        self._set_payload("job_data", value)

    @property
    def user_data(self):
        return copy.deepcopy(self._payload.user_data)

    @user_data.setter
    def user_data(self, value: dict):
        self._set_payload("user_data", value)

    @property
    def meta_data(self):
        return copy.deepcopy(self._payload.meta_data)

    @meta_data.setter
    def meta_data(self, value: dict):
        self._set_payload("meta_data", value)

    def _set_job_attribute(self, name: str, value, max_status: int = MCPJobStatus.JOB_STATUS_DONE,
                           lock_queue=True):
        if getattr(self._job_info, name) != value:
            if self._job_info.status <= max_status:
                if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
                    self._change_data_attribute(name, value, lock_queue=lock_queue)
                setattr(self._job_info, name, value)
            else:
                raise MCPJobStatusError(f"Can't set {name} for job with status "
                                        f"{MCPJobStatus.STATUS_TO_STR[self.status]}")

    def _init_job(self, job_type_suffix=''):
        self._job_info = MCPJobInfo()
        self._payload = MCPPayload()
        # self._job_info.job_id = str(uuid.uuid4())
        if job_type_suffix:
            self._job_info.job_id = nanoid.generate() + "#" + job_type_suffix[:2]
        else:
            self._job_info.job_id = nanoid.generate()
            if self._job_info.job_id[-3] == "#":
                # just in case nanoid delivered an accidental suffix
                self._job_info.job_id = self._job_info.job_id[0:-3] + "_" + self._job_info.job_id[-2:]
        self._job_info.status = MCPJobStatus.JOB_STATUS_GHOST
        self._job_info.base_path = self._config.base_path
        self._job_info.config_file = self._config.configfile
        self._job_info.project_id = self._config.get_project_id()
        self._job_info.ts_created = kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True)
        # todo time zone simplified: this is not great.
        #   It is a system specific ticker that would not compare with a second system!
        #   So MCP and the queueing process need to be on the same system.
        #   I think a microsecond utc time stamp would be better here.
        self._job_info.ns_created = time.monotonic_ns()

    def _fetch_data_attribute(self, attribute, lock_queue=False):
        value = self._queue.read_job_attribute(self.job_id, attribute, use_lock=lock_queue)
        if attribute == "job_data":
            self._payload.job_data = value
        elif attribute == "user_data":
            self._payload.user_data = value
        elif attribute == "meta_data":
            self._payload.meta_data = value
        elif attribute == "progress":
            self._progress = value
        elif attribute == "result":
            self._result = value
        else:
            if hasattr(self._job_info, attribute):
                setattr(self._job_info, attribute, value)
            else:
                logging.error(f" ")
                raise ValueError(f"{self.__class__.__name__}._fetch_data_attribute: Unknown attribute {attribute}.")
        return value

    def _change_data_attribute(self, attribute, value, lock_queue=True):
        """

        :param attribute: is either a string and interpreted as a top-level attribute of the job data or
                          an array of strings if a sub-attribute of the job data is addressed.
                          e.G. "status" sets the status attribute of the job,
                          ["data", "some_datum"] sets the data.some_datum attribute of the job.
        :param value: the value to set
        :return: boolean
        """
        lock = None
        if lock_queue:
            lock = self._queue.lock()
        try:
            rc = self._queue.change_job_attribute(self.job_id, attribute, value, use_lock=False)
            if rc:
                self._ts_modified = kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True)
                rc = self._queue.change_job_attribute(self.job_id, ["ts_modified"],
                                                      kioskstdlib.ts_to_str(self._ts_modified),
                                                      use_lock=False) and \
                # todo time zone simplified: this is not great.
                #   It is a system specific ticker that would not compare with a second system!
                #   So MCP and the queueing process need to be on the same system.
                #   I think a microsecond utc time stamp would be better here.
                self._queue.change_job_attribute(self.job_id, ["ns_modified"],
                                                      time.monotonic_ns(), use_lock=False)
            self._auto_pulse()
        finally:
            if lock and lock_queue:
                self._queue.unlock(lock)
        return rc

    def _fetch(self, lock_queue=True):
        def _copy_and_pop(d, key):
            rc = copy.deepcopy(d[key])
            data.pop(key)
            return rc

        try:
            data = self._queue.read(self.job_id, lock_queue=lock_queue)
        except KeyError as e:
            raise MCPJobUnknownError(f"Could not fetch {self.job_id} from queue: {repr(e)}")
        if data:
            if "job_data" in data:
                self._payload.job_data = _copy_and_pop(data, "job_data")
            if "user_data" in data:
                self._payload.user_data = _copy_and_pop(data, "user_data")
            if "meta_data" in data:
                self._payload.meta_data = _copy_and_pop(data, "meta_data")
            if "result" in data:
                self._result = _copy_and_pop(data, "result")
            if "progress" in data:
                self._progress = _copy_and_pop(data, "progress")
            self._job_info.from_dict(data)
            return True

        return False

    def check_pulse(self):
        """
        Checks, if the own job is still doing something.
        :return: Pulse count or 0
        :exception Can throw Exceptions!
        """
        try:
            return self.gs.get_int(f"pulse_{self.job_id}")
        except KeyError:
            return 0

    def _auto_pulse(self):
        if self.auto_renew:
            if not self.pulse():
                logging.warning(f"could not pulse job {self.job_id}")
            # else:
            #     logging.debug(f"renewed lock for job {self.job_id}")

    def pulse(self, start=False):
        """
        renews the pulse to show that the job is still doing something.
        Will fail if the heartbeat already doesn't exist anymore.
        :param start: if set to True, this is the first pulse, so the key will be create.
        :return: True/False
        :exception Can throw Exceptions!
        """
        try:
            key = self.gs.make_key(f"pulse_{self.job_id}")
            if start:
                self.gs.put_int(key, 0)
            self.gs.inc_int(key, 1)
            self.gs.set_timeout(f"pulse_{self.job_id}", self.seconds_till_timeout)
            # logging.debug(f"{self.__class__.__name__}.pulse: pulsed job {self.job_id} ")
        except KeyError:
            logging.warning(f"{self.__class__.__name__}.pulse: Could not pulse job {self.job_id} "
                            f"because the key does not exist.")
            return False

        return True

    def cancel(self) -> bool:
        """
        sets the job to JOB_STATUS_CANCELLING so that the thread knows to cancel its task
        :return: bool
        """
        if self.status > MCPJobStatus.JOB_STATUS_REGISTERED:
            return self.set_status_to(MCPJobStatus.JOB_STATUS_CANCELLING)
        else:
            return self.set_status_to(MCPJobStatus.JOB_STATUS_CANCELLED)

    def reload(self, lock_queue=True):
        return self._fetch(lock_queue)

    def fetch_status(self):
        """
        fetches the current status from the general store (and updates the object's internal state).
        :returns the status
        """
        return self._fetch_data_attribute("status")

    def publish_result(self, result: dict) -> bool:
        """
        changes the job's result (and sends only that status change to the general store)
        :param result: a dict that is entirely specific to the job. But it is good policy, to have
               a "success" key in there that is set to either true or false or something peculiar.
               And a "message" key might indicate that there is further information to show to the user.
        :return: True or exception
        """
        if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
            self._change_data_attribute("result", result)
        self._result = result
        return True

    def publish_progress(self, progress: int, message="") -> bool:
        """
        publishes the general progress and a message to the general store
        If more detailed progress is needed, use publish_detailed_progress.
        :param message: usually a string, could be a dict, too.
        :param progress: int
        :return: bool, can throw exception
        """
        if (progress is not None) or message:
            _progress = {"progress": progress,
                         "message": message
                         }
            if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
                self._change_data_attribute("progress", _progress)
            self._progress = _progress
            return True
        return False

    def publish_detailed_progress(self, topic: str, progress: int, message="", order=0) -> bool:
        """
        publishes a topical progress to the general store
        :param topic: the topic identifier (should be unique within a job and should not contain white space characters)
        :param progress: progress as int
        :param message: usually a string, but could be a dict with more data
        :param order: if the topics should appear in a certain order, e.G. when listed, this controls the order.
        :return: True or throws Exception
        """
        if topic:
            topic = topic.replace(" ", "_")

        _topic_progress = {"progress": progress,
                           "message": message,
                           "order": order
                           }
        if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
            self._change_data_attribute(["progress", topic], _topic_progress)
        self._progress[topic] = _topic_progress
        return True

    def publish_log_lines(self, log_lines: [str]) -> int:
        """
        publishes a list of log lines for this job. If there are already log lines
        for the job, the new ones will be added to the list.

        :param log_lines: a list of strings
        :return: number of loglines so far or false (0)
        """
        if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
            return self._queue.publish_log_lines(self.job_id, log_lines)
        else:
            return 0

    def get_log_lines(self, filter_str: str = "") -> [str] or 0:
        """
        returns a list of log lines for this job.

        :param filter_str: str. lines will be returned only if the filter string occurs in any of them.
                            Case insensitive!
        :return: a list of strings or - strangely - 0 if the job is not registered
        """
        if self._job_info.status >= MCPJobStatus.JOB_STATUS_REGISTERED:
            return self._queue.get_log_lines(self.job_id, filter_str)
        else:
            return 0

    def fetch_result(self):
        """
        fetches the current result from the general store (and updates the object's internal result).
        :returns the result
        """
        return self._fetch_data_attribute("result")

    def poll_progress(self) -> Progress:
        """
        retrieves a job's progress from the general store (and updates the object's internal progress)
        :return: the progress or False (0)
        """
        return Progress(self._fetch_data_attribute("progress"))

    def validate_job(self, err_prefix: str):
        if not self._job_info.project_id:
            raise ValueError(f"{err_prefix}: Job has no project_id.")
        if not self._job_info.class_name:
            raise ValueError(f"{err_prefix}: Job has no class name.")
        if not self._job_info.module_name:
            raise ValueError(f"{err_prefix}: Job has no module name.")
        if not self._job_info.kiosk_base_path:
            raise ValueError(f"{err_prefix}: Job has no base path.")
        if not self._job_info.config_file:
            raise ValueError(f"{err_prefix}: Job has no config file.")

    def queue(self) -> None:
        """
        queues the job so that MCP can pick it up.
        """
        status = self.status
        if status == MCPJobStatus.JOB_STATUS_GHOST:
            status = MCPJobStatus.JOB_STATUS_REGISTERED
        else:
            raise MCPJobStatusError(f"cannot queue job with status {MCPJobStatus.STATUS_TO_STR[status]}")

        if not self._job_info.kiosk_base_path:
            self._job_info.kiosk_base_path = self._config.base_path
        if not self._job_info.config_file:
            self._job_info.config_file = kioskstdlib.get_filename(self._config.configfile)

        self.validate_job(f"{self.__class__.__name__}.queue")

        self._job_info.ts_modified = kioskdatetimelib.get_utc_now(no_tz_info=True)
        # todo time zone simplified: this is not great.
        #   It is a system specific ticker that would not compare with a second system!
        #   So MCP and the queueing process need to be on the same system.
        #   I think a microsecond utc time stamp would be better here.
        self._job_info.ns_modified = time.monotonic_ns()
        data = self._job_info.as_dict()
        data["status"] = status
        data["job_data"] = self._payload.job_data
        data["user_data"] = self._payload.user_data
        data["meta_data"] = self._payload.meta_data
        data["progress"] = self._progress
        data["result"] = self._result

        if self._queue.push(self.job_id, data):
            self._job_info.status = status
        else:
            raise Exception(f"{self.__class__.__name__}.queue: could not push job to queue.")

            # self._auto_renew_lock()
