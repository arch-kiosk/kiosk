import logging
import pprint

from kioskresult import KioskResult
from mcpinterface.mcpjob import MCPJobStatus
from plugins.kioskreportingdockplugin import KioskReportingDock
from synchronization import Synchronization
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker


class RunReportingDockWorker(WorkstationManagerWorker):

    def report_progress(self, progress, message):
        if not self.job_is_ok("RUN"):
            return False

        new_progress = int(progress)

        self.job.publish_progress(new_progress, message)

        return True

    def worker(self):

        def run_report():
            self.init_dsd()
            sync = Synchronization()
            try:
                self.job.publish_progress(5)
                dock = KioskReportingDock(dock_id=dock_id, sync=sync)
                if dock.load_workstation():
                    dock.sync_dock.variables = self.job.job_data["variables"]
                    dock.sync_dock.base_query = self.job.job_data["base_query"]
                    dock.sync_dock.zip_output_files = self.job.job_data["zip_output_files"]
                    rc = dock.sync_dock.transition("RUN", param_callback_progress=self.report_progress)

                    status = self.job.fetch_status()
                    if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                        result = KioskResult(False, "Reporting has been cancelled by a user.")
                    else:
                        self.job.publish_progress(100, "Finished.")
                        if rc:
                            result = KioskResult(True)
                        else:
                            result = KioskResult(False, "An error occurred during reporting.")

                else:
                    result = KioskResult(False, "It was not possible to load the reporting dock.")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.worker: {repr(e)}")
                result = KioskResult(False, repr(e))
            return result

        # #########
        # Code of worker function
        # #########
        logging.debug("RunReportingDock worker starts")

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                dock_id = self.job.job_data["workstation_id"]
                logging.debug(f"job data: {pprint.pformat(self.job.job_data)}")
                result = run_report()
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    status = self.job.fetch_status()
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="Reporting cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("run reporting dock - worker ends")
