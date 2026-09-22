import pprint
import time

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from generalstore.generalstore import GeneralStore
from housekeeping import Housekeeping
from kioskuser import KioskUser
from mcpinterface.mcpjob import MCPJob, MCPJobStatus, Progress
import logging

from sync_config import SyncConfig


class HouseKeepingWorker:
    def get_kiosk_user(self):
        """
        returns a KioskUser object with the user data of the user who started the job.
        returns None if there is no user data or that user does not exist.
        """
        try:
            user_uuid = self.job.user_data["uuid"]
            logging.info(f"WorkstationManagerWorker.get_kiosk_user: loading user {user_uuid}")
            user = KioskUser(user_uuid, check_token=False)
            user.init_from_dict(self.job.user_data)
            logging.info(f"WorkstationManagerWorker.get_kiosk_user: user settings are "
                         f"{pprint.pformat(self.job.user_data)}")
            return user
        except BaseException as e:
            logging.error(f"WorkstationManagerWorker.get_kiosk_user: {repr(e)}")
            return None

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
            user = self.get_kiosk_user()
            housekeeping: Housekeeping = Housekeeping(file_repos, False,
                                                      repl_user_id=user.repl_user_id if user else "",
                                                      tz_index=user.get_active_tz_index() if user else None)

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
                                         "message": "Housekeeping cancelled by user."})

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
