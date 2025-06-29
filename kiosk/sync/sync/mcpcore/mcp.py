# Master Control Program - job scheduler for Kiosk
import kioskdatetimelib

MCP_VERSION = "0.5"

import inspect
import logging
import datetime
import os
import sys
from collections import OrderedDict

import multiprocessing
import time
from importlib import import_module, invalidate_caches

import psutil

from generalstore.generalstore import GeneralStore
from mcpinterface.mcpconstants import MCPJobStatus, KEY_MCP_PULSE, MCP_PULSE_TIMEOUT, KEY_MCP_VER
from mcpinterface.mcpqueue import MCPQueue
from mcpinterface.mcpjob import MCPJob
from mcpcore.mcpworker import mcp_worker


class MCPCancelledError(Exception):
    pass


class MCP:
    def __init__(self, gs: GeneralStore):
        self.gs = gs
        self.queue = OrderedDict()
        self.mcp_pulse_timeout = MCP_PULSE_TIMEOUT
        self.in_debug_mode = False

    def _load_queue(self):
        """
        loads the jobs with all data from the queue in the general store.
        Does not temper with self.queue!

        :return: a new queue as an OrderedDict.
        """
        queue = OrderedDict()

        gs_queue = MCPQueue(self.gs)
        try:
            lock = gs_queue.lock()
            self.pulse_mcp()
            try:
                jobs = [MCPJob(self.gs, job_id, lock_queue=False) for job_id in gs_queue.list_jobs(lock_queue=False)]
            except Exception as e:
                logging.error(f"{self.__class__.__name__}.reload_queue: cannot list jobs from queue: {repr(e)}")
                return queue
            finally:
                gs_queue.unlock(lock)

            jobs.sort(key=lambda x: x.get_job_info_attribute("ns_created"))
            for job in jobs:
                queue[job.job_id] = job

        except Exception as e:
            logging.error(f"{self.__class__.__name__}.reload_queue: cannot lock queue: {repr(e)}")

        return queue

    def pulse_mcp(self, lock_queue=False):
        """
        renews the pulse to show that MCP is still alive.
        Will renew the heartbeat if it does not exist.
        :exception Can throw Exceptions!
        """
        gs_queue = None
        lock = None
        if lock_queue:
            gs_queue = MCPQueue(self.gs)
            lock = gs_queue.lock()

        try:
            key = KEY_MCP_PULSE
            try:
                self.gs.inc_int(key, 1)
            except KeyError as e:
                self.gs.put_int(key, 1)

            self.gs.set_timeout(key, self.mcp_pulse_timeout)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.pulse_mcp: {repr(e)}")
            raise e
        finally:
            if lock_queue and gs_queue:
                gs_queue.unlock(lock)

    def publish_version(self):
        """
        publishes the mcp version number.
        :exception Can throw Exceptions!
        """
        try:
            key = KEY_MCP_VER
            self.gs.put_string(KEY_MCP_VER, MCP_VERSION)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.publish_version: {repr(e)}")
            raise e

    def is_alive(self) -> int:
        """
        tests if MCP is active and can receive requests.
        :return: alive counter
        """
        try:
            key = self.gs.get_int(KEY_MCP_PULSE)
            return key
        except KeyError:
            return 0

    def reload_queue(self):
        """
        reloads the jobs and their data and stores it in self.queue.
        """
        self.queue = self._load_queue()

    def collect_garbage(self, queue: OrderedDict = None) -> int:
        """
        Terminates all processes without a pulse.
        Before the process of a job is actually terminated the method tries to cancel the job first.

        Also clears the queue of jobs that have been idling for longer than they are supposed to.
        Idling means they are in status >= JOB_DONE and their ts_modified date has not been updated
        within seconds_to_idle.

        Can be used in a garbage collection thread for it creates is own internal queue unless queue is given.
        If a queue is given only ONE process will be terminated / cancelled / removed per call!
        This makes sure that MCP is not blocked for too long.

        :param queue: A queue of MCPJobs jobs. If not given, terminate_timeouts creates its own queue.
        :returns: number of jobs cancelled, terminated or removed.
        """

        job: MCPJob

        if queue:
            only_one = True
        else:
            queue = self._load_queue()
            only_one = False

        jobs_affected = 0
        for job in queue.values():
            if MCPJobStatus.JOB_STATUS_STARTED <= job.status <= MCPJobStatus.JOB_STATUS_CANCELLING:
                jobs_affected += self._terminate_job_if_needed(job)
            elif MCPJobStatus.JOB_STATUS_DONE <= job.status:
                jobs_affected += self._remove_job_if_needed(job)
            if jobs_affected and only_one:
                break

        return jobs_affected

    def _terminate_job_if_needed(self, job: MCPJob):
        """
        if the pulse of the job is gone it will be cancelled or terminated depending on its status.
        :param job: MCPJob
        :return: 0 if pulse was there, 1 if not
        """
        rc = 0
        if not job.check_pulse():
            if job.status != MCPJobStatus.JOB_STATUS_CANCELLING:
                job.cancel()
                logging.info(f"MCP: job {job.job_id} cancelled due to timeout.")
            else:
                self.terminate_job(job)
                logging.info(f"MCP: job {job.job_id} terminated due to timeout in CANCELLING status.")
            rc = 1

        return rc

    def _remove_job_if_needed(self, job: MCPJob):
        """
        Removes a job from the queue that has been idling for too long:
        Idling means its status >= JOB_DONE and ts_modified date has not been updated
        within seconds_to_idle.
        :param job: MCPJob
        :return: 1 if job has been removed, 0 if that wasn't necessary
        """
        rc = 0
        if job.status >= MCPJobStatus.JOB_STATUS_DONE:
            idle_time = (kioskdatetimelib.get_utc_now(no_tz_info=True) - job.get_job_info_attribute(
                "ts_modified")).total_seconds()
            if idle_time:
                max_idling = job.get_job_info_attribute("seconds_to_idle")
                if idle_time > max_idling:
                    logging.debug(f"MCP garbage collection: Job {job.job_id} can be deleted. "
                                  f"It is {idle_time} seconds idling "
                                  f"and that is more than its allowed idling time of {max_idling}.")
                    queue = MCPQueue(self.gs)
                    queue.pop(job.job_id)
                    logging.info(f"MCP: job {job.job_id} cancelled due to timeout.")
                    rc = 1

        return rc

    def terminate_job(self, job: MCPJob):
        """
        aborts a job by terminating its process. Last resort! Try job.cancel() first.
        Afterwards the job will be set to status JOB_STATUS_ABORTED, no matter what.
        :param job:
        """
        try:
            pid = job.os_pid
            if pid:
                if psutil.pid_exists(pid):
                    try:
                        p = psutil.Process(pid)
                        p.terminate()
                        p.wait(timeout=2)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.terminate_job: "
                                      f"Exception terminating job {job.job_id}, process {pid}: {repr(e)}")
                        logging.error(f"{self.__class__.__name__}.terminate_job: "
                                      f"job will be aborted anyhow.")
                else:
                    logging.error(f"{self.__class__.__name__}.terminate_job: "
                                  f"process of job {job.job_id} cannot be terminated because it does not exist anymore. "
                                  f"Will be aborted anyway.")
                job.drop_process_id()
            else:
                logging.error(f"{self.__class__.__name__}.terminate_job: "
                              f"process of job {job.job_id} cannot be terminated because there is no pid. "
                              f"Will be aborted anyway.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.terminate_job: "
                          f"Exception terminating job {job.job_id}: {repr(e)}. Will set to ABORTED anyway.")
        try:
            job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.terminate_job: "
                          f"Exception terminating job {job.job_id}: {repr(e)}.Job cannot be set to JOB_STATUS_ABORTED.")

    def next_job(self, reload_queue=True) -> MCPJob:
        if reload_queue:
            self.reload_queue()

        job: MCPJob
        blocking = set()
        job_candidates = list()
        exclusive_job = None

        for job in self.queue.values():
            if job.status >= MCPJobStatus.JOB_STATUS_DONE:
                continue

            if job.status == MCPJobStatus.JOB_STATUS_REGISTERED:
                job_candidates.append(job)
            else:
                if MCPJobStatus.JOB_STATUS_STARTED <= job.status < MCPJobStatus.JOB_STATUS_DONE:
                    if not job.background_job:
                        blocking.add(job.project_id)
                        if job.system_lock:
                            if not exclusive_job:
                                exclusive_job = job
                            else:
                                logging.error(f"{self.__class__.__name__}.next_job: running jobs {job.job_id} "
                                              f"and {exclusive_job.job_id} both run exclusively. That must not happen!")

        next_job = None
        for job_candidate in job_candidates:
            if job_candidate.project_id not in blocking:
                if job_candidate.system_lock:
                    if not exclusive_job:
                        return job_candidate
                else:
                    if not next_job or (next_job.background_job and not job_candidate.background_job):
                        if not exclusive_job or job_candidate.project_id != exclusive_job.project_id:
                            next_job = job_candidate
            else:
                if job_candidate.background_job:
                    if not exclusive_job or job_candidate.project_id != exclusive_job.project_id:
                        next_job = job_candidate

        return next_job

    def start_job(self, job: MCPJob, test_mode=0):
        gs_queue = MCPQueue(self.gs)
        lock = gs_queue.lock()
        try:
            self.pulse_mcp()
            if job.get_worker():
                if job.get_worker()[0] == 'MCP':
                    if job.get_worker()[1] == 'CANCEL':
                        queue = MCPQueue(self.gs)
                        queue.pop(job.job_id)
                        time.sleep(.2)
                        logging.warning(f"{self.__class__.__name__}.start_job: MCP shut down by user.")
                        raise MCPCancelledError('MCP Cancelled by user.')
            if job.reload(lock_queue=False):
                if job.status != MCPJobStatus.JOB_STATUS_REGISTERED:
                    logging.error(f"{self.__class__.__name__}.start_job: Attempt to start job "
                                  f"with status {MCPJobStatus.STATUS_TO_STR[job.status]}.")
                    return 0
                try:
                    job.validate_job(f"{self.__class__.__name__}.start_job")
                    job.set_status_to(MCPJobStatus.JOB_STATUS_STARTED, lock_queue=False)
                    job.pulse(start=True)
                    lock = gs_queue.unlock(lock)
                except ValueError as e:
                    logging.error(repr(e))
                    return 0
                if self.in_debug_mode:
                    try:
                        return self.debug_process(job.job_id, job.kiosk_base_path, job.config_file, test_mode=test_mode)
                    except BaseException as e:
                        logging.error(
                            f"{self.__class__.__name__}.start_job: Exception when debugging job: {repr(e)}")
                else:
                    try:
                        return self.start_process(job.job_id, job.kiosk_base_path, job.config_file, test_mode=test_mode)
                    except BaseException as e:
                        logging.error(
                            f"{self.__class__.__name__}.start_job: Exception when starting process: {repr(e)}")
            else:
                logging.error(f"{self.__class__.__name__}.start_job: reload of job {job.job_id} failed.")
        finally:
            if lock:
                gs_queue.unlock(lock)

    @staticmethod
    def start_process(job_id, kiosk_base_path, config_file, test_mode=0):
        logging.debug(f"starting process under {kiosk_base_path} using {config_file}")
        p = multiprocessing.Process(target=mcp_worker, args=(job_id, kiosk_base_path, config_file, test_mode))
        p.start()
        return p

    @staticmethod
    def debug_process(job_id, kiosk_base_path, config_file, test_mode=0):
        logging.debug(f"debugging job under {kiosk_base_path} using {config_file}")
        # p = multiprocessing.Process(target=mcp_worker, args=(job_id, kiosk_base_path, config_file, test_mode))
        # p.start()
        mcp_worker(job_id, kiosk_base_path, config_file, test_mode)
        return 0

    def loop(self):
        pass
