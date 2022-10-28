import logging
import os
import time

import kioskstdlib
from generalstore.generalstore import GeneralStore
from kioskconfig import KioskConfig
from kioskrestore import KioskRestore
from kiosksqldb import KioskSQLDb
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from kiosklib import write_reset_file
from messaging.systemmessagecatalog import SYS_MSG_ID_SYSTEM_RESTORED
from messaging.systemmessagelist import init_system_message_list
from kiosklib import dispatch_system_message
import kioskglobals


class RestoreJob:
    def __init__(self, cfg, job: MCPJob, gs: GeneralStore):
        self.job: MCPJob = job
        self.gs: GeneralStore = gs

        configfile = cfg.configfile
        cfg._release_config()
        self.cfg = KioskConfig.get_config(default_config={"config_file": configfile})
        kioskglobals.system_messages = init_system_message_list(gs, cfg)

    def start(self):
        logging.info(f"restore job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):
        c = 0

        def report_progress(prg):
            nonlocal c

            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False
            if isinstance(prg, dict):
                new_progress = int(prg["progress"])
                self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress",
                                                                                       None, True))
            elif isinstance(prg, str):
                c += 1
                if c % 10 == 0:
                    filename = kioskstdlib.get_filename(prg)
                    if len(filename) == 2:
                        self.job.publish_progress(0, f"backing up files from branch {filename}")

            return True

        try:
            restore_options = self.job.job_data
            logging.info(f'Restoring from {restore_options["backup_file"]}')
            restore_file_repos = kioskstdlib.try_get_dict_entry(restore_options, "restore_file_repository", False)
            if restore_file_repos:
                logging.info(f'Restoring file repository, too')

            cfg: KioskConfig = self.cfg
            try:
                result = {}
                KioskRestore.set_progress_handler(report_progress)
                KioskRestore._report_progress(msg="restoring database")
                KioskSQLDb.release_pool()
                KioskRestore.restore_db(cfg, src_dir="",
                                        restore_users=True,
                                        restore_workstations=True,
                                        backup_file=restore_options["backup_file"])
                if restore_file_repos:
                    restore_dir = os.path.join(kioskstdlib.get_file_path(restore_options["backup_file"]), 'files')
                    c_restored_files = KioskRestore.restore_file_repository(cfg, restore_dir)
                    result["restored_files"] = c_restored_files

                result["success"] = True

                if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                    KioskSQLDb.release_pool()
                    self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                    self.job.publish_result(result)
                    dispatch_system_message(headline="The data of this kiosk has been restored. Housekeeping needed!",
                                            message_id=SYS_MSG_ID_SYSTEM_RESTORED,
                                            sender="MCP.restore_worker",
                                            body="Please run housekeeping after the server has been restarted.",
                                            project_id=cfg.get_project_id())
                    time.sleep(5)
                    try:
                        write_reset_file(self.cfg)
                    except BaseException as e:
                        logging.error(f"restore worker: Ignored Exception when creating reset file: {repr(e)}")
                    logging.info(f"restore job {self.job.job_id}: done")
                else:
                    self.job.publish_result({"success": False,
                                             "message": "Restore cancelled by user."})
                    logging.info(f"restore job {self.job.job_id}: cancelled")

            except InterruptedError:
                # Todo: Hm not sure what that was and why it is not okay anymore:
                # if extended_progress:
                #     json_msg = extended_progress[0]
                # else:
                json_msg = "An error occurred during Restore. The log might shed some light on it."
                self.job.publish_result({"success": False,
                                         "message": json_msg})
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        except Exception as exc:
            json_msg = "Exception in administrationcontroller/restore.worker: " + repr(exc)
            logging.error(json_msg)
            self.job.publish_result({"success": False,
                                     "message": json_msg})
            self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        self.job.publish_progress(100)
        logging.info("Restore Job ends")
