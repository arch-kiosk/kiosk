import logging
import pprint
import time

import kioskglobals
from kioskresult import KioskResult
from kioskuser import KioskUser
from mcpinterface.mcpjob import MCPJobStatus
from recordingworkstation import RecordingWorkstation
from synchronization import Synchronization
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation


class ImportWorkstationWorker(WorkstationManagerWorker):
    last_stop = 0.0
    last_message = ""

    def report_progress(self, prg):
        """ ***** sub report_progress ****** """
        new_stop = time.monotonic()
        if (new_stop - self.last_stop > .1 or
                ("extended_progress" in prg and prg["extended_progress"] != self.last_message)):
            if not self.job_is_ok("Import to FileMaker"):
                return False

            message = ""
            new_progress = 0
            if "progress" in prg:
                if "topic" in prg:
                    if prg["topic"] == "_import_tables_from_filemaker":
                        new_progress = 15 + int(prg["progress"] * 35 / 100)
                    elif prg["topic"] == "ExportImages":
                        new_progress = 50 + int(prg["progress"] * 50 / 100)
                else:
                    new_progress = int(prg["progress"])

                if "extended_progress" in prg:
                    message = prg["extended_progress"]

                if not message:
                    message = "Importing from FileMaker..."

                self.job.publish_progress(new_progress, message)
                self.last_message = message

            self.last_stop = new_stop

        return True

    def worker(self):
        def import_from_fm(fix=False):
            try:
                logging.debug("Import Worker starts")
                self.init_dsd()
                sync = Synchronization()
                # ws = KioskFileMakerWorkstation(ws_id, sync=sync)
                # ws.load_workstation()
                self.report_progress({"progress": 0, "message": "Import from FileMaker..."})
                ws = self.init_dock(ws_id, sync, kioskglobals.kiosk_time_zones)
                name = ws.description
                if ws:
                    ws.sync_ws.fix_import_errors = fix
                    rc = ws.sync_ws.transition("IMPORT_FROM_FILEMAKER", param_callback_progress=self.report_progress)
                    status = self.job.fetch_status()
                    if status == MCPJobStatus.JOB_STATUS_CANCELLING:
                        result = KioskResult(False, "Importing from FM has been cancelled by a user.")
                    else:
                        self.job.publish_progress(100, "Finished.")
                        if rc:
                            result = KioskResult(True)
                        else:
                            result = KioskResult(False, "An error occurred when importing from filemaker.")
                else:
                    result = KioskResult(message=f"error importing workstation  {name}")
            except Exception as e:
                logging.error("Exception in import-worker: " + repr(e))
                result = KioskResult(message=f"Exception in import-worker: {repr(e)}")
                self.job.publish_progress(100)

            logging.debug("import - worker ends")
            return result

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                ws_id = self.job.job_data["workstation_id"]
                logging.info(pprint.pformat(self.job.job_data))
                if "fix" in self.job.job_data:
                    fix = self.job.job_data["fix"]
                else:
                    fix = False

                logging.debug(f"importing workstation {ws_id}")
                result = import_from_fm(fix)
                self.job.publish_result(result.get_dict())
                if result.success:
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    logging.info(f"job {self.job.job_id}: failed: {result.message}")
            else:
                self.job.publish_result(KioskResult(message="Import Workstation cancelled by user.").get_dict())

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result(KioskResult(self.job.progress.get_message()).get_dict())
            else:
                self.job.publish_result(
                    KioskResult(message="An error occurred. Please refer to the log for details.").get_dict())

        logging.debug("import workstation - worker ends")
