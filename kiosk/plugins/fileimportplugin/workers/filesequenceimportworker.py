import logging

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from generalstore.generalstore import GeneralStore
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from sync_config import SyncConfig
from kioskuser import KioskUser


class FileSequenceImportWorker:
    def __init__(self, cfg: SyncConfig, job: MCPJob, gs: GeneralStore):
        self.job: MCPJob = job
        self.gs: GeneralStore = gs
        from kioskconfig import KioskConfig
        self.cfg: KioskConfig = KioskConfig.get_config({"config_file": cfg.configfile})

    def init_dsd(self):
        master_dsd = Dsd3Singleton.get_dsd3()
        master_dsd.register_loader("yml", DSDYamlLoader)
        if not master_dsd.append_file(self.cfg.get_dsdfile()):
            logging.error(
                f"HouseKeepingWorker: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"HouseKeepingWorker: DSD {self.cfg.get_dsdfile()} could not be loaded.")
        return master_dsd

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def get_kiosk_user(self):
        """
        returns a KioskUser object with the user data of the user who started the job.
        returns None if there is no user data or that user does not exist.
        """
        try:
            user_uuid = self.job.user_data["uuid"]
            logging.info(f"WorkstationManagerWorker.get_kiosk_user: loading user {user_uuid}")
            user = KioskUser(user_uuid, check_token=False)
            return user
        except BaseException as e:
            logging.error(f"WorkstationManagerWorker.get_kiosk_user: {repr(e)}")
            return None

    def worker(self):

        def report_progress(prg) -> bool:
            # #########
            # progress function
            # #########
            if self.job.fetch_status() >= MCPJobStatus.JOB_STATUS_CANCELLING:
                return False

            new_progress = int(prg["progress"])
            if new_progress >= self.job.progress.get_progress():
                extended_progress = kioskstdlib.try_get_dict_entry(prg, "extended_progress", None, True)
                if extended_progress:
                    msg = f"{extended_progress[1]} of {extended_progress[0]} files imported"
                else:
                    msg = ""
                self.job.publish_progress(new_progress, msg)

            return True

        # #########
        # Code of worker function
        # #########
        logging.debug("File Sequence Worker starts")

        try:
            from synchronization import Synchronization
            import filerepository
            from filesequenceimport import FileSequenceImport
            from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
            import kiosklib

            dsd = self.init_dsd()
            sync = Synchronization()
            file_repos = filerepository.FileRepository(self.cfg,
                                                       sync.events,
                                                       sync.type_repository,
                                                       sync)

            file_import = FileSequenceImport(self.cfg, sync)
            file_import.set_from_dict(self.job.job_data)
            kiosk_user = self.get_kiosk_user()
            logging.debug(f"filesequenceimportworker: User is {kiosk_user.repl_user_id}")
            file_import.modified_by = kiosk_user.repl_user_id
            logging.debug(f"filesequenceimportworker: {file_import.get_wtform_values()}")
            file_import.file_repository = file_repos
            file_import.callback_progress = report_progress
            ic = MemoryIdentifierCache(dsd)
            file_import.identifier_evaluator = ic.has_identifier
            file_import.move_finished_files = True
            rc = file_import.execute()
            try:
                kiosklib.run_quality_control()
            except BaseException as e:
                logging.warning(f"filesequenceimportworker: Error running quality control: {repr(e)}. "
                                f"Please use Housekeeping if you want to rerun quality control rules after the import.")

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                if rc:
                    self.job.publish_result({"success": True,
                                             "files_processed": file_import.files_processed,
                                             "files_imported": file_import.files_added
                                             })
                    logging.info(f"job {self.job.job_id}: done")
                else:
                    self.job.publish_result({"success": False,
                                             "message": "An error occurred during file sequence import. "
                                                        "Please check the logs.",
                                             "files_processed": file_import.files_processed,
                                             "files_imported": file_import.files_added
                                             })
            else:
                self.job.publish_result({"success": False,
                                         "message": "File Sequence Import cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("File Sequence Import - worker ends")
