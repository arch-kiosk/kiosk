import time

from mcpinterface.mcpjob import MCPJob, MCPJobStatus
import logging


class Job1:
    def __init__(self, cfg, job, gs):
        self.job: MCPJob = job
        self.gs = gs
        self.cfg = cfg

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        time.sleep(5)
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
        logging.info(f"job {self.job.job_id}: done")


class StuckJob:
    def __init__(self, cfg, job, gs):
        self.job: MCPJob = job
        self.gs = gs
        self.cfg = cfg

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        time.sleep(2)
        self.job.pulse()
        time.sleep(10)
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
        logging.info(f"job {self.job.job_id}: done")
