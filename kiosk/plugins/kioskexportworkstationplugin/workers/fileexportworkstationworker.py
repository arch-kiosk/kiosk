import logging

from kioskresult import KioskResult
from mcpinterface.mcpjob import MCPJobStatus
from plugins.kioskexportworkstationplugin import KioskExportWorkstation
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from synchronization import Synchronization


class FileExportWorkstationWorker(WorkstationManagerWorker):

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

    def report_export_progress(self, progress, message):
        """ ***** sub report_export_progress ****** """
        if not self.job_is_ok("File export"):
            return False

        # message = ""
        new_progress = 0

        if "progress":
            new_progress = int(progress)

            if not message:
                message = "Exporting ..."

            # self.job.publish_detailed_progress("export", new_progress, message, 2)
            self.job.publish_progress(50 + int(new_progress * 50 / 100), message)

        return True

    def worker(self):
        def fork_n_export():
            result = KioskResult(False, "An error occurred in FileExport worker.")
            try:
                logging.debug("FileExport Worker starts")
                self.init_dsd()
                sync = Synchronization()
                ws = KioskExportWorkstation(ws_id, sync=sync)
                ws.load_workstation()
                name = ws.description
                self.report_fork_progress({"progress": 0, "message": "forking..."})
                if ws:
                    try:
                        user = self.get_kiosk_user()
                    except BaseException as e:
                        raise Exception(f" When initializing user {repr(e)}")

                    rc = ws.sync_ws.transition("FORK", param_callback_progress=self.report_fork_progress)

                    status = self.job.fetch_status()
                    if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                        result = KioskResult(False, "Preparing the file export workstation has been cancelled by a user.")
                    else:
                        self.job.publish_detailed_progress("fork", 100, "Forking finished.", 1)
                        if not rc:
                            result = KioskResult(False, "An error occurred during forking.")

                    if rc:
                        self.report_export_progress(progress=0, message="File export in progress ...")

                        rc = ws.sync_ws.transition("EXPORT",
                                                   param_callback_progress=self.report_export_progress)
                        status = self.job.fetch_status()
                        if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                            result = KioskResult(False, "File export has been cancelled by a user.")
                        else:
                            self.job.publish_progress(100, "Finished.")
                            if rc:
                                result = KioskResult(True)
                            else:
                                result = KioskResult(False, "An error occurred during file export.")
                else:
                    result = KioskResult(message=f"error exporting workstation  {name}")
            except Exception as e:
                logging.error("Exception in FileExport worker: " + repr(e))
                result = KioskResult(message=f"Exception in FileExport worker: {repr(e)}")
                self.job.publish_progress(100)

            logging.debug("FileExport - worker ends")
            return result

        # *************************************************************************************
        # main method
        # *************************************************************************************

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                ws_id = self.job.job_data["workstation_id"]
                logging.debug(f"Starting file export workstation {ws_id}")
                result = fork_n_export()
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    status = self.job.fetch_status()
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="FileExport for workstation cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result(KioskResult(self.job.progress.get_message()).get_dict())
            else:
                self.job.publish_result(
                    KioskResult(message="An error occurred. Please refer to the log for details.").get_dict())

        logging.debug("FileExportWorkstation - worker ends")

