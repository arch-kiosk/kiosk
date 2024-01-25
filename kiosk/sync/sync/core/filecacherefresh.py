import logging
import time

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from filerepository import FileRepository
from generalstore.generalstore import GeneralStore
from kioskabstractclasses import PluginLoader
from kiosklogicalfile import KioskLogicalFile
from kioskrepresentationtype import KioskRepresentations
from mcpinterface.mcpqueue import MCPQueue
from sync_config import SyncConfig
from typerepository import TypeRepository
from kiosksqldb import KioskSQLDb


class FileCacheRefresh:
    def __init__(self, file_repos: FileRepository, type_repository: TypeRepository,
                 plugin_loader: PluginLoader, console: bool = False, general_store: GeneralStore = None):
        """

            :param console: True prints out status messages to the console.
        """
        self.console = console
        self._cancelled: bool = False
        self.progress_handler = None
        self.file_repos = file_repos
        self.type_repository = type_repository
        self.plugin_loader = plugin_loader
        self.counters = {}
        self.c_all_reprs = 0
        self.c_reprs = 0
        self.c_renewed = 0
        self.c_errors = 0
        self.general_store = general_store
        self.queue = None

    def _report_progress(self, progress_prc: int = 0, msg=""):
        if self.progress_handler:
            return self.progress_handler({"topic": "refreshfilecache",
                                          "progress": str(progress_prc),
                                          "extended_progress": msg
                                          })

        return True

    def check_for_active_job(self, project_id: str):
        if not self.queue:
            self.queue = MCPQueue(self.general_store)
        return self.queue.has_active_non_background_job(project_id)

    def refresh_file_cache(self, progress_handler=None, max_files=0, pause_for_jobs_of=""):
        """
        steps through the existing file cache records and tries to recreate thumbnails for all records that
        are either invalid or marked with renew.
        :param progress_handler: a call back to report the process
        :param max_files:maximum number of files to renew (for test purposes)
        :param pause_for_jobs_of: set this to the current project-id to pause (sleep) for other non-background jobs
        :return: number of checked file cache records
        """
        self._cancelled = False
        self.progress_handler = progress_handler
        self.c_all_reprs = 0
        self.c_reprs = 0
        self.c_renewed = 0
        self.c_all_reprs = KioskSQLDb().get_record_count("kiosk_file_cache", "uid")
        if not self.file_repos:
            raise Exception("No file repository assigned to FileCacheRefresh")
        if not self.type_repository:
            raise Exception("No type repository assigned in FileCacheRefresh")
        if not self.plugin_loader:
            raise Exception("No plugin loader assigned in FileCacheRefresh")

        file_cache = self.file_repos.get_cache_manager()
        logging.info(
            f"FileCacheRefresh.refresh_file_cache: checking on {self.c_all_reprs} representations.")
        files_in_cache_cur = KioskSQLDb.execute_return_cursor("select distinct uid_file from kiosk_file_cache "
                                                              "where renew=True or invalid=True")
        r = files_in_cache_cur.fetchone()
        while r:
            if pause_for_jobs_of and self.general_store:
                if self.check_for_active_job(pause_for_jobs_of):
                    if self.c_all_reprs:
                        if not self._report_progress(int(self.c_reprs * 100 / self.c_all_reprs),"paused"):
                            logging.info(f"{self.__class__.__name__}.refresh_file_cache: User cancelled.")
                            self._cancelled = True
                            break
                    logging.debug(f"{self.__class__.__name__}.refresh_file_cache: "
                                  f"Sleeping for 20 seconds because there is another job.")
                    time.sleep(20)
                    continue

            time.sleep(1)
            uid = r["uid_file"]
            if self.c_all_reprs:
                if not self._report_progress(int(self.c_reprs * 100 / self.c_all_reprs)):
                    logging.info(f"{self.__class__.__name__}.refresh_file_cache: User cancelled.")
                    self._cancelled = True

            if self._cancelled:
                break
            if max_files and self.c_renewed > max_files:
                break

            representations = list(file_cache.get_cache_entries_for_file(uid))
            representations = [x.representation_type for x in representations if x.renew or x.invalid]
            if representations:
                representation_type_ids = KioskRepresentations.get_ordered_representation_ids(representations)
            else:
                representation_type_ids = []

            for representation_type_id in representation_type_ids:
                self.c_reprs += 1
                kiosk_file = KioskLogicalFile(uid,
                                              cache_manager=file_cache,
                                              file_repository=self.file_repos,
                                              type_repository=self.type_repository,
                                              plugin_loader=self.plugin_loader)
                representation_type = KioskRepresentations.instantiate_representation_from_config(
                    representation_type_id)

                path_and_filename = kiosk_file.get_representation(representation_type,
                                                                  create=True, renew=True)
                if not path_and_filename:
                    self.c_errors += 1
                    logging.error(
                        f"FileCacheRefresh.refresh_file_cache: Could not renew file {uid}")
                else:
                    KioskSQLDb.commit()
                    logging.info(
                        f"FileCacheRefresh.refresh_file_cache: Renewed file {uid} successfully")
                    self.c_renewed += 1
            r = files_in_cache_cur.fetchone()

        logging.info(f"FileCacheRefresh.refresh_file_cache: Renewed {self.c_renewed} of {self.c_all_reprs}. ")
        if not r:
            self._report_progress(100)

        if self.c_errors > 0:
            logging.info(f"{self.c_errors} files could not be renewed due to errors.")

        return self.c_reprs


# *******************************************************************************+
# MAIN
# *******************************************************************************+#

if __name__ == '__main__':
    import sys
    from os import path
    import warnings

    ESC_RED = "\u001b[31m"
    ESC_GREEN = "\u001b[32;1m"
    ESC_YELLOW = "\u001b[33;1m"
    ESC_RESET = "\u001b[0m"

    params = {
        "-d": "dev",
        "--dev": "dev",
    }

    cfg: SyncConfig
    kiosk_dir = ""
    options = {}

    SEPARATOR = -2
    INFO = -1
    SUCCESS = 0
    WARNING = 1
    ERROR = 2

    log_name = ['Info:    ', 'OK:      ', 'WARNING: ', 'ERROR:   ']
    file_log_level = INFO
    console_log_level = INFO
    log_records = []
    old_prc = 0


    def log(msg, error_state=-1, nocr=False):
        if error_state == -1:
            if '\u001b' in msg:
                if ESC_RED in msg:
                    error_state = ERROR
                elif ESC_GREEN in msg:
                    error_state = SUCCESS
                elif ESC_YELLOW in msg:
                    error_state = WARNING
        else:
            if '\u001b' not in msg:
                if error_state == SUCCESS:
                    msg = ESC_GREEN + msg
                elif error_state == WARNING:
                    msg = ESC_YELLOW + msg
                elif error_state == ERROR:
                    msg = ESC_RED + msg
        msg += ESC_RESET
        if error_state >= console_log_level or error_state == SEPARATOR:
            print(msg, flush=True)
        if error_state >= file_log_level or error_state == SEPARATOR:
            cr = "\n" if not nocr else ""

            if error_state == SEPARATOR:
                log_records.append("" + cr)
                log_records.append(kioskstdlib.erase_esc_seq(msg) + cr)
            else:
                log_records.append(kioskstdlib.erase_esc_seq(log_name[error_state + 1] + msg) + cr)


    def interpret_param(known_param, param: str):
        new_option = params[known_param]

        # if new_option == "db":
        #     rc = {new_option: param.split("=")[1]}
        # elif new_option == "logfile":
        #     rc = {new_option: param.split("=")[1]}
        # elif new_option == "user":
        #     rc = {new_option: param.split("=")[1]}
        # else:
        rc = {new_option: None}

        return rc


    def usage(error: str = ""):
        if error:
            print("\n\u001b[31;1m")
            print("    " + error + "\u001b[0m")
        print("""
        Usage of filecacherefresh.py:
        ===================
          refreshes the thumbnails in the file cache if they are either invalid or set to "renew"

          filecacherefresh <kiosk-dir>

          <kiosk-dir> is required and must point to the base directory
                      (in which either a config\kiosk_config.yml or a config\sync_config.yml is expected)

          <path and filename of Excel file to import> is required and must point to an Excel file that meets the specs.

          options:

        """)
        sys.exit(0)


    def startup():
        global cfg, kiosk_dir, options
        logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
        logger = logging.getLogger()
        logger.setLevel(logging.INFO)
        if len(sys.argv) < 2:
            usage()

        kiosk_dir = sys.argv[1]
        if kiosk_dir and not path.isdir(kiosk_dir):
            usage(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")

        cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
        if not path.isfile(cfg_file):
            cfg_file = path.join(kiosk_dir, r'config\sync_config.yml')
            if not path.isfile(cfg_file):
                usage(f"neither a sync_config.yml nor a kiosk_config.yml can be found. ")

        cfg = SyncConfig.get_config({'config_file': cfg_file})

        for i in range(3, len(sys.argv)):
            param = sys.argv[i]
            known_param = [p for p in params if param.lower().startswith(p)]
            if known_param:
                known_param = known_param[0]
                new_option = interpret_param(known_param, param)
                if new_option:
                    options.update(new_option)
                else:
                    logging.error(f"parameter {param} not understood.")
                    usage()
            else:
                log(f"parameter \"{param}\" unknown.")
                usage()
        if "dev" not in options:
            warnings.simplefilter("ignore")
        else:
            console_log_level = -1
            file_log_level = -1


    def console_progress(progress: dict):
        global old_prc
        if "progress" in progress:
            prc = int(progress["progress"])
            if prc > old_prc:
                old_prc = prc
                print(f".", end="" if old_prc % 10 != 0 else "\n")
        return True


    startup()

    log_file = kioskstdlib.get_datetime_template_filename("filecacherefresh#a_#d#m#y-#H#M.log")
    log_path = kioskstdlib.get_file_path(cfg.get_logfile())

    print("", flush=True)
    print("\u001b[2J", flush=True)
    log("************************************************************************", error_state=0)
    log("******                  \u001b[34mFile Cache Refresh Tool \u001b[0m                  ******", error_state=0)
    log("************************************************************************", error_state=0)
    log(f"\u001b[32;1mOperating on database {cfg.database_name}\u001b[0m", error_state=0)
    log(f"\u001b[32;1mWith options {options}\u001b[0m", error_state=0)
    print(f"")

    from synchronization import Synchronization
    import filerepository

    # dsd = Dsd3Singleton.get_dsd3()
    # dsd.register_loader("yml", DSDYamlLoader)
    # if not dsd.append_file(cfg.get_dsdfile()):
    #     logging.error(
    #         f"FileCacheRefresh: DSD {cfg.get_dsdfile()} could not be loaded by append_file.")
    #     raise Exception(f"FileCacheRefresh: DSD {cfg.get_dsdfile()} could not be loaded.")

    sync = Synchronization()
    file_repository = filerepository.FileRepository(cfg,
                                                    sync.events,
                                                    sync.type_repository,
                                                    sync)

    refresher = FileCacheRefresh(file_repository, type_repository=sync.type_repository, plugin_loader=sync)
    c_files = refresher.refresh_file_cache(console_progress)
