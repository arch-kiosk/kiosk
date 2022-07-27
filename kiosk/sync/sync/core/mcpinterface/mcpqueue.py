import logging

from generalstore.generalstore import GeneralStore
from mcpinterface.mcpconstants import *


def assert_mcp(general_store):
    """
    makes sure that mcp is running.
    :param general_store:
    :raises MCPNotRunningError
    """
    if not MCPQueue(general_store).is_mcp_alive():
        raise MCPNotRunningError("The Master Control Program is not running.")


def get_mcp_version(general_store):
    """
    fetches the version of the running mcp from the store
    :param general_store:
    :raises MCPNotRunningError
    """
    return MCPQueue(general_store).get_mcp_version()


class MCPQueue:
    def __init__(self, general_store: GeneralStore):
        self.gs = general_store

    def lock(self, timeout=5, expire_seconds=5):
        """
        locks the queue
        :return: the lock which is needed to unlock the queue again
        """
        lock = self.gs.acquire_process_lock(MCP_STORE, timeout=timeout, expire_seconds=expire_seconds)
        if not lock:
            raise MCPLockError(f"{self.__class__.__name__}.queue: Cannot lock MCP.")
        return lock

    def unlock(self, lock) -> None:
        """
        unlocks the queue again
        :param lock: the lock previously acquired by lock()
        :returns: always returns None
        """
        self.gs.release_process_lock(lock)
        return None

    def _get_gs_job_key(self, job_id=None) -> str:
        """
        creates the job's key in the general store
        :param job_id: the job-id
        :return: the key
        """
        if job_id:
            return self.gs.make_key(MCP_STORE, MCP_JOB, job_id)
        else:
            return self.gs.make_key(MCP_STORE, MCP_JOB) + "_"

    def push(self, job_id, data):
        """
        pushes a new job to the queue. Use only for new jobs!
        :param job_id: the job-id
        :param data: the job data
        :return: Boolean, throws exceptions
        """
        rc = False
        lock = self.lock()
        try:
            key = self._get_gs_job_key(job_id)
            if self.gs.put_dict(key, [], data):
                rc = True

        finally:
            self.unlock(lock)

        return rc

    def read(self, job_id, lock_queue=True) -> dict:
        """
        reads a job's data from the queue.
        locks the queue while reading!
        :param lock_queue: if set to false the caller is responsible for locking the queue.
        :param job_id: the job id
        :return: the data
        """
        lock = None
        if lock_queue:
            lock = self.lock()
        try:
            key = self._get_gs_job_key(job_id)
            return self.gs.get_dict(key)
        finally:
            if lock_queue and lock:
                self.unlock(lock)

    def change_job_attribute(self, job_id, path, value, use_lock=True):
        """
        :param job_id: the job id
        :param path: is either a string and interpreted as a top-level attribute of the job data or
                      an array of strings if a sub-attribute of the job data is addressed.
                      e.G. "status" sets the status attribute of the job,
                      ["data", "some_datum"] sets the data.some_datum attribute of the job.
        :param value: the value to set
        :param use_lock: if set to False, the caller is responsible for using queue.lock / unlock.
        :return: boolean
        """
        if isinstance(path, str):
            _attributes = [path]
        else:
            _attributes = [*path]

        rc = False
        lock = None
        if use_lock:
            lock = self.lock()
        try:
            # self._auto_renew_lock()
            key = self._get_gs_job_key(job_id)
            return self.gs.put_dict_value(key, _attributes, value)
        finally:
            if use_lock and lock:
                self.unlock(lock)

    def read_job_attribute(self, job_id, attribute: str, use_lock=True):
        """
        :param job_id: the job id
        :param attribute: main level attribute (you cannot use a path here). e.G.
                          "data" works, but not ["data", "some_item"]
        :param use_lock: if set to False, the caller is responsible for using queue.lock / unlock.
        :return: boolean
        """

        lock = None
        if use_lock:
            lock = self.lock()
        try:
            # self._auto_renew_lock()
            key = self._get_gs_job_key(job_id)
            d = self.gs.get_dict(key)
            return d[attribute]
        finally:
            if use_lock and lock:
                self.unlock(lock)

    def force_flush(self):
        """
        force flushes the queue: All job data will be list instantenously.
        Use for testing or emergency situations only.
        """
        lock = self.lock()
        try:
            for key in self.gs.get_keys(self._get_gs_job_key() + "*"):
                self.gs.delete_key(key)
        finally:
            self.unlock(lock)

    def pop(self, job_id) -> dict:
        """
        removes a job from the queue.
        :param job_id: the job id
        return: the job data or an empty dict, if the job is unknown. Can throw Exceptions.
        """
        data = {}
        lock = self.lock()
        try:
            key = self._get_gs_job_key(job_id=job_id)
            data = self.gs.get_dict(key)
            self.gs.delete_key(key)
        except KeyError as e:
            pass
        finally:
            self.unlock(lock)

        return data

    def list_jobs(self, lock_queue=True, suffix: str = "") -> list:
        """
        returns a list with all the jobs-ids that are currently registered.
        :param lock_queue: if false the caller is responsible for the locking
        :param suffix: if given, only jobs with the given suffix are returned
        :return list with job-ids: list<str>
        """
        lock = None
        if lock_queue:
            lock = self.lock()
        try:
            key = self._get_gs_job_key()
            key_len = len(key)
            if suffix:
                return [job_key[key_len:len(job_key)]
                        for job_key in self.gs.get_keys(prefix=key)
                        if job_key.endswith("#" + suffix)]
            else:
                return [job_key[key_len:len(job_key)] for job_key in self.gs.get_keys(prefix=key)]
        finally:
            if lock_queue and lock:
                self.unlock(lock)

    def is_mcp_alive(self) -> int:
        """
        tests if MCP is active and can receive requests.
        :return: alive counter
        """
        try:
            key = self.gs.get_int(KEY_MCP_PULSE)
            if key == 0:
                key += 1
            return key
        except KeyError:
            logging.debug(f"{self.__class__.__name__}.is_mcp_alive: KEY_ERROR when getting KEY_MCP_PULSE")
            return 0
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.is_mcp_alive: {repr(e)}")

    def get_mcp_version(self) -> str:
        """
        returns the version of the running mcp
        :return: a string with the version
        """
        try:
            key = self.gs.get_string(KEY_MCP_VER)
            return key
        except KeyError:
            logging.debug(f"{self.__class__.__name__}.get_mcp_version: KEY_ERROR when getting KEY_MCP_VER")
            return ""
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_mcp_version: {repr(e)}")

    def publish_log_lines(self, job_id, log_lines: [str]) -> int:
        """
        publishes a list of log lines for this job
        :param job_id: the job's id
        :param log_lines: a list of strings
        :return: number of loglines so far or false (0)
        """
        if len(log_lines) > 0 and job_id:
            # logging.debug(f"job {job_id} publishes {len(log_lines)} loglines")
            key = self.gs.make_key(MCP_STORE, MCP_JOB_LOG, job_id)
            return self.gs.append_values_to_array(key, log_lines)
        else:
            logging.debug(f"job {job_id} published no loglines")
        return 0

    def get_log_lines(self, job_id, filter_str: str = "") -> [str]:
        """
        returns a list of log lines for a job.

        :param job_id: the job's id
        :param filter_str: str. lines will be returned only if the filter string occurs in any of them.
                            Case insensitive!
        :return: a list of strings
        """
        key = key = self.gs.make_key(MCP_STORE, MCP_JOB_LOG, job_id)
        lines = self.gs.get_array(key)
        if not filter_str:
            return lines

        filter_str = filter_str.lower()
        for line in lines:
            if line.lower().find(filter_str) > -1:
                return lines

        return []
