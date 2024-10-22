import logging
import pprint
import time

import kioskglobals
import kioskstdlib
from housekeeping import Housekeeping
from kioskresult import KioskResult
from kioskuser import KioskUser
from kioskworkstation import KioskWorkstation
from mcpinterface.mcpjob import MCPJobStatus
from recordingworkstation import RecordingWorkstation
from synchronization import Synchronization
from workstation import Workstation
from ..kiosksyncmanager import KioskSyncManager
from ..workstationmanagerworker import WorkstationManagerWorker
# from ..modelworkstation import ModelWorkstation
import filerepository


class SynchronizationWorker(WorkstationManagerWorker):

    def report_progress(self, prg):
        """ ***** sub report_progress ****** """
        if not self.job_is_ok("Synchronization"):
            return False

        message = ""
        new_progress = 0
        if "progress" in prg:
            if "topic" in prg:
                if prg["topic"] == "_sync_workstations_to_temptables":
                    new_progress = int(prg["progress"] * 20 / 100)
                    message = "preparing workstation data"
                elif prg["topic"] == "_sync_new_records":
                    new_progress = 20 + int(prg["progress"] * 20 / 100)
                    message = "synchronizing new records"
                elif prg["topic"] == "_sync_modified_records":
                    new_progress = 40 + int(prg["progress"] * 20 / 100)
                    message = "synchronizing modified records"
                elif prg["topic"] == "_sync_deleted_records":
                    new_progress = 60 + int(prg["progress"] * 20 / 100)
                    message = "synchronizing deleted records"
                elif prg["topic"] == "synchronize_files":
                    new_progress = 79 + int(prg["progress"] * 20 / 100)
                    message = "synchronizing files"
            # else:
            #     new_progress = prg["progress"]

            if not message:
                message = "synchronizing ..."

            self.job.publish_progress(new_progress, message)

        return True

    def worker(self):

        # #################################################

        def synchronize():
            worker_result = KioskResult(message="An unknown error occurred in start_synchronization.worker")
            try:
                logging.debug("Synchronization Worker starts")
                self.init_dsd()
                logging.debug(pprint.pformat(self.job.job_data))
                housekeeping = self.job.job_data["housekeeping"]
                sync = Synchronization(options=self.job.job_data)
                # sync.debug_mode = "proxy_field"
                rc = sync.synchronize(callback_progress=self.report_progress)
                if rc:
                    worker_result = KioskResult(success=True)
                else:
                    worker_result = KioskResult(success=False, message="Synchronization failed.")

                if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:  # and worker_result.success:
                    if housekeeping:
                        self.housekeeping(sync)
                    else:
                        logging.info(f"{self.__class__.__name__}.synchronize: Housekeeping skipped.")

            except BaseException as e:
                s = f"Exception in start_synchronization.worker: {repr(e)}"
                logging.error(s)
                worker_result = KioskResult(message=s)

            return worker_result

            # #################################################
            # synchronize() ends
            # #################################################

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                result = synchronize()
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="Synchronization cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result(KioskResult(self.job.progress.get_message()).get_dict())
            else:
                self.job.publish_result(
                    KioskResult(message="An error occurred. Please refer to the log for details.").get_dict())

        self.inc_system_wide_init_counter()
        logging.debug("synchronization workstation - worker ends")

    def housekeeping(self, sync: Synchronization):

        # #########
        # progress function
        # #########

        def report_housekeeping_progress(prg) -> bool:
            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False

            new_progress = int(prg["progress"])
            if new_progress > self.job.progress.get_progress():
                self.job.publish_progress(new_progress, f"synchronization completed. Housekeeping: " +
                                                        kioskstdlib.try_get_dict_entry(prg, "extended_progress",
                                                                                      None, True))

            return True

        # #########


        # #########
        # Code of main method
        # #########
        logging.info("******** synchronization is finished ********")
        logging.info("******** housekeeping starts. Note: The following messages if any are the result of housekeeping. They have not kept synchronization from completing.  ********")

        try:

            file_repos = filerepository.FileRepository(self.cfg,
                                                       sync.events,
                                                       sync.type_repository,
                                                       sync)
            # c_files = file_repos.do_housekeeping(progress_handler=report_housekeeping_progress)
            housekeeping: Housekeeping = Housekeeping(file_repos, False)
            c_files = housekeeping.do_housekeeping(progress_handler=report_housekeeping_progress,
                                                   file_tasks_only=False)

            if c_files > 0:
                logging.info("housekeeping after synchronization successful")
                self.job.publish_progress(100, f"synchronization and housekeeping completed. ")
            else:
                logging.warning("Although synchronization is complete, housekeeping had issues. "
                                "An admin should run a separate housekeeping task.")
                self.job.publish_progress(100, f"Synchronization completed, Housekeeping with issues.")
        except InterruptedError:
            logging.warning("Although synchronization is complete, housekeeping did not finish. "
                            "An admin should run a separate housekeeping task.")
            self.job.publish_progress(100, f"Synchronization completed, Housekeeping with issues.")
        except BaseException as e:
            logging.warning(f"Although synchronization is complete, housekeeping threw a fit: {repr(e)} "
                            "An admin should run a separate housekeeping task.")
            self.job.publish_progress(100, f"Synchronization completed, Housekeeping with issues.")

        logging.info("******** housekeeping finished ********")
