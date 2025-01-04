import logging

import kioskglobals
from kioskresult import KioskResult
from kioskuser import KioskUser
from mcpinterface.mcpjob import MCPJobStatus
from synchronization import Synchronization
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation
from tz.kiosktimezoneinstance import KioskTimeZoneInstance


class ExportWorkstationWorker(WorkstationManagerWorker):

    def report_progress(self, prg):
        """ ***** sub report_progress ****** """
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

            self.job.publish_progress(new_progress, message)

        return True

    def worker(self):
        def export():
            try:
                logging.debug("Export Worker starts")
                self.report_progress({"progress": 0, "message": "Export to FileMaker..."})
                self.init_dsd()
                sync = Synchronization()
                ws = self.init_dock(ws_id, sync, kioskglobals.kiosk_time_zones)
                if ws:
                    rc = ws.sync_ws.transition("EXPORT_TO_FILEMAKER", param_callback_progress=self.report_progress,
                    before_transition=ws.reset_download_upload_status)
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
                    result = KioskResult(message=f"error exporting workstation  {ws.description}")
            except Exception as e:
                logging.error("Exception in export-worker: " + repr(e))
                result = KioskResult(message=f"Exception in export-worker: {repr(e)}")
                self.job.publish_progress(100)

            logging.debug("export - worker ends")
            return result

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                ws_id = self.job.job_data["workstation_id"]
                logging.debug(f"exporting workstation {ws_id}")
                result = export()
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="Export Workstation cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result(KioskResult(self.job.progress.get_message()).get_dict())
            else:
                self.job.publish_result(
                    KioskResult(message="An error occurred. Please refer to the log for details.").get_dict())

        logging.debug("export workstation - worker ends")
