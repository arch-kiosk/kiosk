import os
import time

import kioskglobals
import kioskstdlib
from backupreminder import BackupReminder
from generalstore.generalstore import GeneralStore
from kioskbackup import KioskBackup
from kioskconfig import KioskConfig
from mcpcore.mcpworker import init_system_message_list
from mcpinterface.mcpjob import MCPJob, MCPJobStatus, Progress
import logging

from messaging.systemmessagecatalog import SYS_MSG_ID_BACKUP_REMINDER
from messaging.systemmessagelist import SystemMessageList
from sync_config import SyncConfig


class BackupJob:
    def __init__(self, cfg: SyncConfig, job: MCPJob, gs: GeneralStore):
        self.job: MCPJob = job
        self.gs: GeneralStore = gs
        configfile = cfg.configfile
        cfg._release_config()
        self.cfg = KioskConfig.get_config(default_config={"config_file": configfile})
        # if hasattr(self.cfg, "get_temporary_upload_path"):
        #     logging.info(f"Kiosk Config!")
        # else:
        #     logging.info(f"{self.cfg}: {self.cfg.configfile}")
        init_system_message_list(gs, cfg)
        kioskglobals.system_messages = SystemMessageList.get_instance()

    def start(self):
        logging.info(f"backup job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):
        extended_progress = ""
        c = 0

        def report_progress(prg):
            nonlocal extended_progress
            nonlocal c
            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False
            if isinstance(prg, dict):
                new_progress = int(prg["progress"])
                # if new_progress > self.job.progress.get_progress():
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
            backup_options = self.job.job_data
            backup_dir = backup_options["backup_dir"]
            logging.info(f'Backing up to {backup_dir}')

            cfg: KioskConfig = self.cfg
            plugin_cfg = cfg.get_plugin_config("administrationplugin")
            backup_filename_template = kioskstdlib.try_get_dict_entry(plugin_cfg, "backup_filename_template",
                                                                      "backup.dmp",
                                                                      null_defaults=True)
            KioskBackup.set_progress_handler(report_progress)
            try:
                # if "backup_workstation" in backup_options:
                #     KioskBackup.pack_kiosk(cfg, backup_dir, backup_options)
                backup_result = {}
                KioskBackup.backup_database(cfg, backup_dir,
                                            filename_template=backup_filename_template)
                backup_result["backup_file"] = KioskBackup.dest_backup_file
                if kioskstdlib.to_bool(backup_options["backup_file_repository"]):
                    dest_dir = os.path.join(backup_dir, "files")
                    logging.info(f"backup job {self.job.job_id}: Now backing up file repository to {dest_dir}")
                    files_copied = KioskBackup.copy_file_repository_to_path(cfg, dest_dir)
                    if files_copied > -1:
                        logging.info(f"backup job {self.job.job_id}: Backup of file repository to {dest_dir} "
                                     f"successful.")
                        backup_result["backup_file_repository_dir"] = dest_dir
                        backup_result["files_copied"] = files_copied
                    else:
                        raise Exception(f"backup job {self.job.job_id}: backup of file repository to {dest_dir} "
                                        f"failed.")

                if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                    backup_result["success"] = True
                    self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                    self.job.publish_result(backup_result)
                    logging.info(f"backup job {self.job.job_id}: done in file {KioskBackup.dest_backup_file}.")
                    try:
                        kioskglobals.system_messages.delete_message(SYS_MSG_ID_BACKUP_REMINDER)
                    except BaseException as e:
                        logging.debug(f"{self.__class__.__name__}.worker (not critical): "
                                        f"When deleting the backup reminder message: "
                                        f"{repr(e)}")
                    try:
                        BackupReminder.set_backup_datetime(cfg)
                    except BaseException as e:
                        logging.debug(f"{self.__class__.__name__}.worker (not critical): "
                                      f"When setting the last backup time: "
                                      f"{repr(e)}")
                    logging.info(f"backup job {self.job.job_id}: Backup successfully finished.")
                else:
                    self.job.publish_result({"success": False,
                                             "message": "Backup cancelled by user."})
                    logging.info(f"backup job {self.job.job_id}: cancelled")

            except InterruptedError:
                if extended_progress:
                    json_msg = extended_progress[0]
                else:
                    json_msg = "An error occurred during the backup. The log might help."
                self.job.publish_result({"success": False,
                                         "message": json_msg})
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        except Exception as exc:
            json_msg = "Exception in administrationcontroller/backup.worker: " + repr(exc)
            logging.error(json_msg)
            self.job.publish_result({"success": False,
                                     "message": json_msg})
            self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        self.job.publish_progress(100)
        logging.info("Backup Job ends")
