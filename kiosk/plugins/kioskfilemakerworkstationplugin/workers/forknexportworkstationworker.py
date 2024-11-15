import logging
import kioskglobals

from kioskresult import KioskResult
from mcpinterface.mcpjob import MCPJobStatus
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from synchronization import Synchronization


class ForkNExportWorkstationWorker(WorkstationManagerWorker):

    def report_fork_progress(self, prg):
        """ ***** sub report_fork_progress ****** """
        if not self.job_is_ok("Fork"):
            return False

        if "progress" in prg:
            new_progress = 0

            if "topic" in prg:
                if prg["topic"].find("images"):
                    new_progress = 10 + int(prg["progress"] * 80 / 100)
            else:
                new_progress = int(prg["progress"])

            # self.job.publish_detailed_progress("fork", new_progress, "forking...", 1)
            self.job.publish_progress(int(new_progress * 50 / 100), "forking...")

        return True

    def report_export_progress(self, prg):
        """ ***** sub report_export_progress ****** """
        if not self.job_is_ok("Export to FileMaker"):
            return False

        message = ""
        new_progress = 0

        if "progress" in prg:
            if "topic" in prg:
                if prg["topic"] == "transfer_tables":
                    new_progress = 20 + int(prg["progress"] * 30 / 100)

                if prg["topic"] == "import_images":
                    new_progress = 55 + int(prg["progress"] * 30 / 100)
                    message = "Exporting images to FileMaker..."

                # if prg["topic"] == "index_all_images":
                #     new_progress = 70 + int(prg["progress"] * 20 / 100)
                #     message = "Creating file identifier cache ..."
            else:
                new_progress = int(prg["progress"])

            if "extended_progress" in prg:
                message = prg["extended_progress"]

            if not message:
                message = "Exporting to FileMaker..."

            # self.job.publish_detailed_progress("export", new_progress, message, 2)
            self.job.publish_progress(50 + int(new_progress * 50 / 100), message)

        return True

    def worker(self):
        def fork_n_export():
            try:
                logging.debug("ForkNExport Worker starts")
                name = "?"
                self.init_dsd()
                sync = Synchronization()
                self.report_fork_progress({"progress": 0, "message": "forking..."})
                ws = self.init_dock(ws_id, sync, kioskglobals.kiosk_time_zones)
                # if ws:
                # ws = KioskFileMakerWorkstation(ws_id, sync=sync)
                # ws.load_workstation()
                # self.report_export_progress({"progress": 0, "message": "export to filemaker"})
                if ws:
                    name = ws.description
                    # try:
                    #     user = self.get_kiosk_user()
                    # except BaseException as e:
                    #     raise Exception(f" When initializing user {repr(e)}")

                    ws.reset_download_upload_status()
                    rc = ws.sync_ws.transition("FORK", param_callback_progress=self.report_fork_progress)

                    status = self.job.fetch_status()
                    if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                        result = KioskResult(False, "Preparing the workstation has been cancelled by a user.")
                    else:
                        self.job.publish_detailed_progress("fork", 100, "Forking finished.", 1)
                        if not rc:
                            result = KioskResult(False, "An error occurred during forking.")

                    if rc:
                        self.report_export_progress({"progress": 0, "message": "Export to FileMaker..."})

                        rc = ws.sync_ws.transition("EXPORT_TO_FILEMAKER",
                                                   param_callback_progress=self.report_export_progress)
                        status = self.job.fetch_status()
                        if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                            result = KioskResult(False, "Exporting to FM has been cancelled by a user.")
                        else:
                            self.job.publish_progress(100, "Finished.")
                            if rc:
                                result = KioskResult(True)
                            else:
                                result = KioskResult(False, "An error occurred during export.")
                else:
                    result = KioskResult(message=f"error exporting workstation  {name}")
            except Exception as e:
                logging.error("Exception in ForkNExport-worker: " + repr(e))
                result = KioskResult(message=f"Exception in ForkNExport-worker: {repr(e)}")
                self.job.publish_progress(100)

            logging.debug("ForknExport - worker ends")
            return result

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                # self.job.publish_progress(0, "processing request...")
                ws_id = self.job.job_data["workstation_id"]
                logging.debug(f"Preparing workstation {ws_id}")
                result = fork_n_export()
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    status = self.job.fetch_status()
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="ForkNExport Workstation cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result(KioskResult(self.job.progress.get_message()).get_dict())
            else:
                self.job.publish_result(
                    KioskResult(message="An error occurred. Please refer to the log for details.").get_dict())

        logging.debug("forknexport workstation - worker ends")

