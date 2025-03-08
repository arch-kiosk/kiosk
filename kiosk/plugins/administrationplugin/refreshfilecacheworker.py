import time

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from filecacherefresh import FileCacheRefresh
from generalstore.generalstore import GeneralStore
from mcpinterface.mcpjob import MCPJob, MCPJobStatus, Progress
import logging

from sync_config import SyncConfig


class RefreshFileCacheWorker:
    def __init__(self, cfg: SyncConfig, job: MCPJob, gs: GeneralStore):
        self.job: MCPJob = job
        self.gs: GeneralStore = gs
        from kioskconfig import KioskConfig
        self.cfg: KioskConfig = KioskConfig.get_config({"config_file": cfg.configfile})

    def init_dsd(self):
        master_dsd = Dsd3Singleton.get_dsd3()
        master_dsd.register_loader("yml", DSDYamlLoader)
        if not master_dsd.append_file(self.cfg.get_dsdfile()):
            logging.error(
                f"RefreshFileCacheWorker: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"RefreshFileCacheWorker: DSD {self.cfg.get_dsdfile()} could not be loaded.")
        return master_dsd

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):
        last_ts = int(time.time())

        def report_progress(prg) -> bool:
            # #########
            # progress function
            # #########
            nonlocal last_ts
            try:
                status = self.job.fetch_status()
                if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:

                    logging.info(f"refreshfilecacheworker.report_progress: job "
                                 f"cancelled because job status is {status}")
                    return False

                new_progress = int(prg["progress"])
                if new_progress > int(self.job.progress.get_progress()) or int(time.time()) - last_ts > 5:
                    last_ts = int(time.time())
                    self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress",
                                                                                           None, True))
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.report_progress: {repr(e)}")

            return True

        # #########
        # Code of worker function
        # #########
        logging.debug("RefreshFileCacheWorker starts")

        try:
            from synchronization import Synchronization
            import filerepository
            self.init_dsd()
            sync = Synchronization()
            file_repos = filerepository.FileRepository(self.cfg,
                                                       sync.events,
                                                       sync.type_repository,
                                                       sync)

            refresher = FileCacheRefresh(file_repos=file_repos,
                                         type_repository=sync.type_repository,
                                         plugin_loader=sync,
                                         general_store=self.gs)
            logging.debug("RefreshFileCacheWorker: Starting refresh_file_cache")
            c_files = refresher.refresh_file_cache(report_progress, pause_for_jobs_of=self.cfg.get_project_id())

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                if c_files > 0:
                    self.job.publish_result({"success": True})
                    logging.info(f"job {self.job.job_id}: done")
                else:
                    self.job.publish_result({"success": False,
                                             "message": "An error occurred while refreshing the file cache. Please check the logs."
                                             })
            else:
                self.job.publish_result({"success": False,
                                         "message": "RefreshFileCacheWorker cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("RefreshFileCacheWorker: - worker ends")
