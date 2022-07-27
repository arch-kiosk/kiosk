import time

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from generalstore.generalstore import GeneralStore
from housekeeping import Housekeeping
from mcpinterface.mcpjob import MCPJob, MCPJobStatus, Progress
import logging

from sync_config import SyncConfig


class HouseKeepingWorker:
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
                f"HouseKeepingWorker: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"HouseKeepingWorker: DSD {self.cfg.get_dsdfile()} could not be loaded.")
        return master_dsd

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):

        def report_progress(prg) -> bool:
            # #########
            # progress function
            # #########
            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False

            new_progress = int(prg["progress"])
            if new_progress >= self.job.progress.get_progress():
                self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress",
                                                                                       None, True))

            return True

        # #########
        # Code of worker function
        # #########
        logging.debug("advanced housekeeping starts")

        try:
            from synchronization import Synchronization
            import filerepository
            self.init_dsd()
            sync = Synchronization()
            file_repos = filerepository.FileRepository(self.cfg,
                                                       sync.events,
                                                       sync.type_repository,
                                                       sync)
            # c_files = file_repos.do_housekeeping(progress_handler=report_progress,
            #                                      housekeeping_tasks=self.job.job_data["tasks"])

            housekeeping: Housekeeping = Housekeeping(file_repos, False)
            c_files = housekeeping.do_housekeeping(progress_handler=report_progress,
                                                   housekeeping_tasks=self.job.job_data["tasks"],
                                                   file_tasks_only=False)

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                if c_files > 0:
                    self.job.publish_result({"success": True})
                    logging.info(f"job {self.job.job_id}: done")
                else:
                    self.job.publish_result({"success": False,
                                             "message": "An error occurred during housekeeping. Please check the logs."
                                             })
            else:
                self.job.publish_result({"success": False,
                                         "message": "Householding cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("advanced housekeeping - worker ends")
