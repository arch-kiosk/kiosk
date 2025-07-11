import logging
import pprint

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import KIOSK_GENERAL_CACHE_REFRESH
from kiosksqldb import KioskSQLDb
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from plugins.filerepositoryplugin.filerepositoryarchive import FileRepositoryArchive
from sync_config import SyncConfig
from kioskuser import KioskUser


class FileRepositoryArchiveWorker:
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
                f"FileRepositoryArchiveWorker: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"FileRepositoryArchiveWorker: DSD {self.cfg.get_dsdfile()} could not be loaded.")
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
            logging.info(f"FileRepositoryArchiveWorker.get_kiosk_user: loading user {user_uuid}")
            user = KioskUser(user_uuid, check_token=False)
            user.init_from_dict(self.job.user_data)
            logging.info(f"FileRepositoryArchiveWorker.get_kiosk_user: user settings are "
                         f"{pprint.pformat(self.job.user_data)}")
            return user
        except BaseException as e:
            logging.error(f"FileRepositoryArchiveWorker.get_kiosk_user: {repr(e)}")
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
                # extended_progress = kioskstdlib.try_get_dict_entry(prg, "extended_progress", None, True)
                # if extended_progress:
                #     msg = f"{extended_progress[1]} of {extended_progress[0]} files imported"
                # else:
                msg = ""
                self.job.publish_progress(new_progress, msg)

            return True

        # #########
        # Code of worker function
        # #########
        logging.debug("FileRepositoryArchiveWorker starts")

        try:
            from synchronization import Synchronization
            import filerepository
            import kiosklib

            options = self.job.job_data["options"]
            if "unarchive" in options:
                self.job.publish_progress(5, "un-archiving...")
            else:
                self.job.publish_progress(5, "archiving...")
            dsd = self.init_dsd()
            sync = Synchronization()
            file_repos = filerepository.FileRepository(self.cfg,
                                                       sync.events,
                                                       sync.type_repository,
                                                       sync)

            kiosk_user = self.get_kiosk_user()
            logging.debug(pprint.pformat(self.job.job_data))
            archive = ""
            if "unarchive" in options:
                if "selected_archive" in options:
                    archive = options["selected_archive"]
                if not archive:
                    raise Exception("There was no archive selected from which to un-archive files.")
            else:
                if "use_new_archive" in options and options["use_new_archive"]:
                    archive = options["new_archive"]
                if "use_existing_archive" in options and options["use_existing_archive"]:
                    archive = options["selected_archive"]

                if not archive:
                    raise Exception("There was neither a new nor an existing archive selected")

            fr_archive = FileRepositoryArchive(dsd, self.cfg, archive)
            fr_archive.set_frf_options(self.job.job_data["frf"])
            fr_archive.set_selected_files(self.job.job_data["files"])

            if "unarchive" in options:
                rows = fr_archive.un_archive()
                if rows:
                    logging.info(f"FileRepositoryArchiveWorker: {rows} files moved from archive {archive} "
                                 f"back to file repository")
                    KioskSQLDb.commit()
            else:
                rows = fr_archive.archive()
                if rows:
                    logging.info(f"FileRepositoryArchiveWorker: {rows} files moved to archive {archive}")
                    KioskSQLDb.commit()
            self.job.publish_progress(100, "")

            try:
                self.gs.invalidate_cache(KIOSK_GENERAL_CACHE_REFRESH)
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.worker: "
                                f"Error invalidating file identifier caches: {repr(e)}. "
                                f"Please use Administration if you want to "
                                f"refresh the fid caches manually.")

            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
                if rows:
                    message = (f"{rows} files got moved from archive '{archive}' "
                               f"to the file repository.") if "unarchive" in \
                                                              options else (f"{rows} files got "
                                                                            f"moved to archive '{archive}'.")
                    self.job.publish_result({"success": True,
                                             "message": message,
                                             "archived_files": rows,
                                             })
                    logging.info(f"job {self.job.job_id}: done")
                else:
                    self.job.publish_result({"success": False,
                                             "message": ("No files got (un-)archived. This can easily happen "
                                                         "if you try to archive files that are bound to archaeological "
                                                         "data. Only files that are not connected to an archaeological "
                                                         "record can be archived."),
                                             "archived_files": rows,
                                             })
            else:
                self.job.publish_result({"success": False,
                                         "message": "file repository (un-)archiving cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("FileRepositoryArchiveWorker ends")
