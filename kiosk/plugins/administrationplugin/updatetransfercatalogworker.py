import logging
import os

import kioskglobals
import kioskstdlib
from generalstore.generalstore import GeneralStore
from kioskbackup import KioskBackup
from kioskconfig import KioskConfig
from kioskfilemanagerbridge import KioskFileManagerBridge
from mcpcore.mcpworker import init_system_message_list
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from messaging.systemmessagecatalog import SYS_MSG_ID_BACKUP_REMINDER
from messaging.systemmessagelist import SystemMessageList
from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory
from sync_config import SyncConfig
from transferkiosk import TransferKiosk


class UpdateTransferCatalogWorker:
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
        logging.info(f"UpdateTransferCatalogWorker: Job {self.job.job_id} starts")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def update_transfer_catalog(self, transfer_dir):
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
        try:
            logging.info(f'UpdateTransferCatalogWorker: creating catalog in {transfer_dir}')
            plugin_cfg = cfg.get_plugin_config("administrationplugin")
            transfer_kiosk = TransferKiosk(cfg)
            transfer_kiosk.set_progress_handler(report_progress)
            logging.info(f'UpdateTransferCatalogWorker: creating files delta...')
            if transfer_kiosk.cat(transfer_dir):
                cat_file = os.path.join(transfer_dir, 'cat_file.json')
                self.job.publish_result({"success": True,
                                         "catalog file": cat_file,
                                         "message": f"The catalog file is ready to download. Do you want to download it now?"})
                return True
            else:
                json_msg = f"Error creating catalog file. " \
                           f"For detailed information please look at the log for job {self.job.job_id}"

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                json_msg = "Updating the cartalog was not successful" \
                           f"For further information please look at the log for job {self.job.job_id}"
            else:
                if self.job.fetch_status() != MCPJobStatus.JOB_STATUS_RUNNING:
                        json_msg = "Transfer cancelled by user"

        except InterruptedError:
            json_msg = f"An error occurred when updating the catalog file." \
                       f"For further information please look at the log for job {self.job.job_id}"
            logging.error(f"TransferWorker: Transfer job {self.job.job_id} failed: {json_msg}")

        self.job.publish_result({"success": result,
                                 "message": json_msg})
        return False

    def worker(self):
        try:
            transfer_dir = self.cfg.get_create_transfer_dir()
            if not transfer_dir:
                raise Exception("Cannot create transfer directory for this server")

            logging.info(f'UpdateTransferCatalogWorker: Starting with transfer_dir {transfer_dir}.')

            if self.update_transfer_catalog(transfer_dir):
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
            else:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        except Exception as exc:
            json_msg = "Exception in administrationcontroller/UpdateTransferCatalogWorker: " + repr(exc)
            logging.error(json_msg)
            self.job.publish_result({"success": False,
                                     "message": json_msg})
            self.job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)

        self.job.publish_progress(100)
        logging.info("UpdateTransferCatalogWorker ends")
