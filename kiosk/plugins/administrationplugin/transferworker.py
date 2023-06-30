import logging
import os

import kioskglobals
import kioskstdlib
from generalstore.generalstore import GeneralStore
from kioskbackup import KioskBackup
from kioskconfig import KioskConfig
from mcpcore.mcpworker import init_system_message_list
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from messaging.systemmessagecatalog import SYS_MSG_ID_BACKUP_REMINDER
from messaging.systemmessagelist import SystemMessageList
from sync_config import SyncConfig
from transferkiosk import TransferKiosk


class TransferJob:
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
        logging.info(f"transfer job {self.job.job_id} starts")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def backup(self, backup_dir):
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
                self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress", ""))

            return True

        cfg: KioskConfig = self.cfg
        logging.info(f'TransferWorker: Backing up to {backup_dir}')
        plugin_cfg = cfg.get_plugin_config("administrationplugin")
        backup_filename_template = kioskstdlib.try_get_dict_entry(plugin_cfg, "backup_filename_template",
                                                                  "backup.dmp",
                                                                  null_defaults=True)
        KioskBackup.set_progress_handler(report_progress)
        try:
            backup_result = {}
            KioskBackup.backup_database(cfg, backup_dir,
                                        filename_template=backup_filename_template)
            backup_result["backup_file"] = KioskBackup.dest_backup_file

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                # backup_result["success"] = True
                # self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                # self.job.publish_result(backup_result)
                # logging.info(f"TransferWorker: Backup job {self.job.job_id} "
                #              f"finished file {KioskBackup.dest_backup_file}.")
                logging.info(f'TransferWorker: backup to {KioskBackup.dest_backup_file} finished.')
                return True
            else:
                self.job.publish_result({"success": False,
                                         "message": "Transfer cancelled by user."})
                logging.info(f"TransferWorker: Backup job {self.job.job_id} cancelled")
                return False

        except InterruptedError:
            json_msg = "An error occurred when backing up the recording data. The log might help."
            logging.error(f"TransferWorker: Backup job {self.job.job_id} failed: {json_msg}")
            self.job.publish_result({"success": False,
                                     "message": json_msg})
            self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)
            return False

    def transfer(self, transfer_dir, catalog_file):
        extended_progress = ""
        c = 0
        json_msg = "An unexpected error occurred."
        result = False

        def report_progress(prg):
            nonlocal extended_progress
            nonlocal c
            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False
            if isinstance(prg, dict):
                new_progress = int(prg["progress"])
                # if new_progress > self.job.progress.get_progress():
                self.job.publish_progress(new_progress, kioskstdlib.try_get_dict_entry(prg, "extended_progress", ""))

            return True

        cfg: KioskConfig = self.cfg
        logging.info(f'TransferWorker: Transferring zip files to {transfer_dir}')
        plugin_cfg = cfg.get_plugin_config("administrationplugin")
        max_zip_size = int(kioskstdlib.try_get_dict_entry(plugin_cfg, "max_transfer_zip_size",
                                                          "250000000",
                                                          null_defaults=True))
        fake_it = bool(kioskstdlib.try_get_dict_entry(plugin_cfg, "fake_transfer",
                                                      False,
                                                      null_defaults=True))
        logging.info(f'TransferWorker: Max size per zip file is {max_zip_size}')
        transfer_kiosk = TransferKiosk(cfg)
        transfer_kiosk.set_progress_handler(report_progress)

        try:
            self.job.publish_progress(10, "Backup finished")
            logging.info(f'TransferWorker: creating files delta...')
            if transfer_kiosk.create_files_delta(target_catalog=catalog_file):
                if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                    logging.info(f'TransferWorker: packing files...')
                    if transfer_kiosk.pack_delta(transfer_dir, max_zip_size=max_zip_size, fake_it=fake_it):
                        self.job.publish_result({"success": True,
                                                 "transfer_dir": transfer_dir,
                                                 "message": json_msg})
                        return True
                    else:
                        json_msg = f"Error packing files. " \
                                   f"For detailed information please look at the log for job {self.job.job_id}"
            else:
                json_msg = f"Error creating the files delta. " \
                           f"For detailed information please look at the log for job {self.job.job_id}"

            if result and self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                result = True
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                logging.info(f"TransferWorker: Transfer job {self.job.job_id} "
                             f"finished transfer to {transfer_dir}.")
            else:
                if self.job.fetch_status() != MCPJobStatus.JOB_STATUS_RUNNING:
                    json_msg = "Transfer cancelled by user"

        except InterruptedError:
            json_msg = f"An error occurred when transferring files." \
                       f"For further information please look at the log for job {self.job.job_id}"
            logging.error(f"TransferWorker: Transfer job {self.job.job_id} failed: {json_msg}")

        self.job.publish_result({"success": result,
                                 "message": json_msg})
        return False

    def worker(self):
        try:
            job_options = self.job.job_data
            transfer_dir = job_options["transfer_dir"]
            catalog_file = job_options["catalog_file"]
            try:
                os.mkdir(transfer_dir)
            except FileExistsError:
                pass
            sub_dir = kioskstdlib.get_datetime_template_filename('#d#m#y-#H#M')
            transfer_dir = os.path.join(transfer_dir, sub_dir)
            os.mkdir(transfer_dir)

            logging.info(f'TransferWorker: Starting with transfer_dir {transfer_dir}, catalog_file {catalog_file}')

            if self.backup(transfer_dir):
                if self.transfer(transfer_dir, catalog_file):
                    self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                else:
                    self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        except Exception as exc:
            json_msg = "Exception in administrationcontroller/transferworker: " + repr(exc)
            logging.error(json_msg)
            self.job.publish_result({"success": False,
                                     "message": json_msg})
            self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        self.job.publish_progress(100)
        logging.info("Transfer Job ends")
