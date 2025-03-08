import time

import kioskglobals
import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from filecacherefresh import FileCacheRefresh
from fileidentifiercache import FileIdentifierCache
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import KIOSK_GENERAL_CACHE_REFRESH
from mcpinterface.mcpjob import MCPJob, MCPJobStatus, Progress
import logging

from sync_config import SyncConfig


class RefreshFidCacheWorker:
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
                f"RefreshFidCacheWorker: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"RefreshFidCacheWorker: DSD {self.cfg.get_dsdfile()} could not be loaded.")
        return master_dsd

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):
        # last_ts = int(time.time())
        # def report_progress(prg) -> bool:
        #     # #########
        #     # progress function
        #     # #########
        #     nonlocal last_ts
        #     try:
        #         status = self.job.fetch_status()
        #         if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
        #
        #             logging.info(f"RefreshFidCacheWorker.report_progress: job "
        #                          f"cancelled because job status is {status}")
        #             return False
        #
        #         new_progress = int(prg["progress"])
        #         if new_progress > int(self.job.progress.get_progress()) or int(time.time()) - last_ts > 5:
        #             last_ts = int(time.time())
        #             self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress",
        #                                                                                    None, True))
        #     except BaseException as e:
        #         logging.error(f"{self.__class__.__name__}.report_progress: {repr(e)}")
        #
        #     return True
        #
        # #########
        # Code of worker function
        # #########
        logging.debug("RefreshFidCacheWorker starts")

        try:
            from synchronization import Synchronization
            import filerepository
            master_dsd = self.init_dsd()
            sync = Synchronization()

            rc = FileIdentifierCache.build_fic_indexes(sync.type_repository, master_dsd)
            fic = FileIdentifierCache(master_dsd)
            rc = rc & fic.build_file_identifier_cache_from_contexts(commit=True)

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                if rc:
                    self.job.publish_result({"success": True})
                    logging.info(f"job {self.job.job_id}: done")
                    try:
                        self.gs.validate_cache(KIOSK_GENERAL_CACHE_REFRESH)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.worker: Error after successful completion: {repr(e)}")

                else:
                    self.job.publish_result({"success": False,
                                             "message": "An error occurred while refreshing the file identifier cache. "
                                                        "Please check the logs."
                                             })
            else:
                self.job.publish_result({"success": False,
                                         "message": "RefreshFidCacheWorker cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("RefreshFidCacheWorker: - worker ends")
