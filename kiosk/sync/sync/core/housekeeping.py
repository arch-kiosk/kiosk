from datetime import datetime

import kioskdatetimelib
import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from fts.kioskfulltextsearch import FTS
from housekeepingtools import housekeepingclearlog
from kioskcontextualfile import KioskContextualFile
from qualitycontrol.qualitycontrol import QualityControl
from kiosksqldb import KioskSQLDb
import logging
from filerepository import FileRepository
import os

from sync_config import SyncConfig
from sync_constants import FILES_TABLE_NAME
import re


class Housekeeping:

    def __init__(self, file_repos: FileRepository, console: bool = False):
        """

            :param console: True prints out status messages to the console.
        """
        self.console = console
        self.parameters: dict = {}
        self._cancelled: bool = False
        self.progress_handler = None
        self.file_repos = file_repos
        self.counters = {}
        self.limit_to_files = []  # list of file uids. If not empty only these files will be processed
        self.housekeeping_file_methods = {
            "housekeeping_check_broken_files": self.housekeeping_check_broken_files,
            "housekeeping_check_file_meta_data": self.housekeeping_check_file_meta_data,
            "housekeeping_check_cache_files": self.housekeeping_check_cache_files,
            "housekeeping_rewrite_image_record": self.housekeeping_rewrite_image_record,
            "housekeeping_lowercase_filenames": self.housekeeping_lowercase_filenames,
        }
        # these run only if explicitly requested
        self.housekeeping_peculiar_file_methods = {
            "housekeeping_enforce_file_meta_data": self.housekeeping_enforce_file_meta_data,
        }
        self.housekeeping_standalone_methods = {
            "housekeeping_quality_check": self.housekeeping_quality_check,
            "housekeeping_clear_log": self.housekeeping_clear_log,
            "housekeeping_fts": self.housekeeping_fts
        }

    def _report_progress(self, progress_prc: int = 0, msg=""):
        if self.progress_handler:
            return self.progress_handler({"topic": "housekeeping",
                                          "progress": str(progress_prc),
                                          "extended_progress": msg
                                          })

        return True

    def add_counter(self, counter_name: str, c: int):
        if counter_name in self.counters:
            self.counters[counter_name] += c
        else:
            self.counters[counter_name] = c

    def do_housekeeping(self, parameters: dict = None, progress_handler=None, housekeeping_tasks=[],
                        file_tasks_only=False):
        """
            walks through all the files and does all kinds of housekeeping with them.
            Also triggers other file-independent housekeeping tasks if ordered.

            :param parameters: a dict with parameters, interpreted by the several housekeeping methods
            :param progress_handler: a progress handler of the type report_progress(prg) with prg
                    being a dictionary: {"topic": percentage, "extended_progress": status message}
            :param housekeeping_tasks: List with the names of the tasks that housekeeping should do.
                                        If empty all housekeeping tasks will run.
            :param file_tasks_only: if set only the file-related tasks will be executed.
            :return: number of files that have been checked
        """
        self._cancelled = False
        self.progress_handler = progress_handler
        c = 0
        c2 = 0
        if self.console:
            print("Housekeeping: ", flush=True)

        file_tasks_todo = []
        stdalone_tasks_todo = []
        if housekeeping_tasks:
            self.housekeeping_file_methods.update(self.housekeeping_peculiar_file_methods)
            for task in housekeeping_tasks:
                if task in self.housekeeping_file_methods.keys():
                    file_tasks_todo.append(self.housekeeping_file_methods[task])
                if task in self.housekeeping_standalone_methods.keys() and not file_tasks_only:
                    stdalone_tasks_todo.append(self.housekeeping_standalone_methods[task])
        else:
            for task in self.housekeeping_file_methods.keys():
                file_tasks_todo.append(self.housekeeping_file_methods[task])
            if not file_tasks_only:
                for task in self.housekeeping_standalone_methods.keys():
                    stdalone_tasks_todo.append(self.housekeeping_standalone_methods[task])

        tasks_total = len(stdalone_tasks_todo) + len(file_tasks_todo)

        logging.info("\nRunning per file: " + ",".join(ft.__name__ for ft in file_tasks_todo))
        c = self._do_file_tasks(file_tasks_todo, parameters, tasks_total)

        if not self._cancelled and len(stdalone_tasks_todo) > 0:
            if not self._report_progress(int(len(file_tasks_todo) * 100 / tasks_total),
                                         f"task {len(file_tasks_todo)} of {tasks_total} "):
                logging.debug(f"{self.__class__.__name__}.do_housekeeping: User cancelled.")
                self._cancelled = True

            logging.info("\n\nRunning once: " + ",".join(ft.__name__ for ft in stdalone_tasks_todo))
            c2 = self._do_stdalone_tasks(stdalone_tasks_todo, parameters, len(file_tasks_todo), tasks_total)
        return c + c2

    def _do_stdalone_tasks(self, tasks_todo, parameters, tasks_done, tasks_total):
        c = 0
        for task in tasks_todo:
            try:
                if not self._report_progress(int((tasks_done + c) * 100 / tasks_total),
                                             f"running task {task.__name__} "):
                    logging.debug(f"{self.__class__.__name__}._do_stdalone_tasks: User cancelled.")
                    self._cancelled = True
                    break
                task(self.console, parameters)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._do_stdalone_tasks: Exception in task {task.__name__}: "
                              f"{repr(e)}")
            c += 1
            if not self._report_progress(int((tasks_done + c) * 100 / tasks_total),
                                         f"task {(tasks_done + c)} of {tasks_total} "):
                logging.debug(f"{self.__class__.__name__}.do_housekeeping: User cancelled.")
                self._cancelled = True
                break
        return c

    def _do_file_tasks(self, file_tasks_todo, parameters, tasks_total):
        c = 0
        if file_tasks_todo:
            cur = KioskSQLDb.get_dict_cursor()
            cur.execute(f"select " + f"count(uid) c from {FILES_TABLE_NAME};")
            r = cur.fetchone()
            c_files = int(r["c"])
            logging.info(f"c_files is {c_files}")
            cur.execute(f"select " + f"uid from {FILES_TABLE_NAME};")
            r = cur.fetchone()
            c_print = 0

            try:
                while r:
                    uid = r["uid"]
                    if not self._report_progress(int((c * 100 / c_files) * len(file_tasks_todo) / tasks_total),
                                                 f"checking file {c + 1} of {c_files} "):
                        logging.debug(f"{self.__class__.__name__}.do_housekeeping: User cancelled.")
                        self._cancelled = True
                        break

                    if not self.limit_to_files or uid in self.limit_to_files:
                        logging.debug(f"{self.__class__.__name__}.do_housekeeping: checking file {uid}")
                        for meth in file_tasks_todo:
                            try:
                                ctx_file = self.file_repos.get_contextual_file(uid)
                                meth(ctx_file, self.console, parameters)
                            except BaseException as e:
                                logging.error(f"{self.__class__.__name__}.do_housekeeping: "
                                              f"Exception when calling {meth} on {uid}: {repr(e)}")
                        c = c + 1
                    if self.console:
                        if c_print < 40:
                            print(".", end="", flush=True)
                            c_print += 1
                        else:
                            print(".", flush=True)
                            c_print = 0
                    r = cur.fetchone()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.do_housekeeping: "
                              f"Strange exceptions {repr(e)}")
            cur.close()
        else:
            logging.error(f"{self.__class__.__name__}.do_housekeeping: "
                          f"That's nice housekeeping: No tasks on file repository files have been ordered.")
        logging.info(f"File repository housekeeping has checked {c} files")
        if self.console:
            print(f"Done: {c} files checked.", flush=True)
        if self.counters:
            if self.console:
                print("summary:")
            for counter, v in self.counters.items():
                logging.info(f"Housekeeping counted {v} files marked as {counter}")
                if self.console:
                    print(f"Housekeeping counted {v} files marked as {counter}")
        return c

    def housekeeping_check_file_meta_data(self, ctx_file: KioskContextualFile,
                                          console, parameters: dict, enforce=False):
        if "BROKEN_FILE" not in ctx_file.get_tags():
            if ctx_file.file_exists():
                if not ctx_file.ensure_md5_hash(commit=True):
                    logging.warning(f"{self.__class__.__name__}.housekeeping_check_file_meta_data: "
                                    f"failed to create the md5 hash for {ctx_file.uid}.")

                if "NOT_AN_IMAGE" not in ctx_file.get_tags():
                    if enforce:
                        if not ctx_file.get_file_attributes_from_physical_file():
                            logging.debug(f"{self.__class__.__name__}.housekeeping_check_file_meta_data: "
                                            f"failed to create the file attributes for {ctx_file.uid}.")
                        else:
                            KioskSQLDb.commit()
                    else:
                        if not ctx_file.ensure_file_attributes(commit=True):
                            logging.debug(f"{self.__class__.__name__}.housekeeping_check_file_meta_data: "
                                            f"failed to create the file attributes for {ctx_file.uid}.")
            else:
                logging.warning(f"{self.__class__.__name__}.housekeeping_check_file_meta_data: "
                                f"file {ctx_file.uid} does not have a physical file")

    def housekeeping_enforce_file_meta_data(self, ctx_file: KioskContextualFile, console, parameters: dict):
        """
        Makes sure that the file attributes are fetched freshly from the physical file
        """
        self.housekeeping_check_file_meta_data(ctx_file, console, parameters, enforce=True)

    def housekeeping_check_broken_files(self, ctx_file: KioskContextualFile, console, parameters: dict):

        # correct file records that have a whole path and filename stored in field filename.
        # It should be the filename only.
        ctx_file.dont_set_file_datetime = True
        if ctx_file._get_path_and_filename():
            try:
                file_path = kioskstdlib.get_file_path(ctx_file._get_file_record().filename)
                if file_path:
                    ctx_file.set_filename(kioskstdlib.get_filename(ctx_file._get_path_and_filename()))
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.housekeeping_check_broken_files: {repr(e)}")

        if not ctx_file._get_path_and_filename():
            ctx_file.detect_filename_from_filerepository()

            if ctx_file._get_path_and_filename():
                logging.info(f"{self.__class__.__name__}.housekeeping_check_broken_files: "
                             f"File {ctx_file.uid} has no filename entry in database -> solved")
                KioskSQLDb.commit()

        if not ctx_file.file_exists():
            if "BROKEN_FILE" not in ctx_file.get_tags():
                logging.warning(f"{self.__class__.__name__}.housekeeping_check_broken_files: "
                                f"File {ctx_file.uid} does not exist -> tagged as broken.")
                if console:
                    print(f"\nFile {ctx_file.uid} is broken.", flush=True)
                ctx_file.add_tag("BROKEN_FILE")
                # todo: contexts
                # if not ctx_file.are_contexts_ok():
                #     ctx_file.add_tag("BROKEN_CONTEXT", save=False)

                # in this case there is no need to change the modification time stamp, so we keep it.
                if not ctx_file.update():
                    logging.error(f"{self.__class__.__name__}.housekeeping_check_broken_files:"
                                  f" Update went wrong. ")
        else:
            save = False
            if "BROKEN_FILE" in ctx_file.get_tags():
                ctx_file.drop_tag("BROKEN_FILE")
                save = True
            if "BROKEN_CONTEXT" in ctx_file.get_tags():
                # todo: contexts
                save = True
                pass
            if save:
                # in this case there is no need to change the modification time stamp, so we keep it.
                ctx_file.update()

    def housekeeping_check_cache_files(self, ctx_file: KioskContextualFile, console, parameters: dict):
        svg = False
        if ctx_file.file_exists():
            # if kioskstdlib.get_file_extension(ctx_file.get()).lower() == "svg":
            #     ctx_file._test_mode = True

            try:
                ctx_file._repair_cache_filename()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.housekeeping_check_cache_files:"
                              f" : Exception in _repair_cache_filename: {repr(e)}")

            try:
                ctx_file.transform_cache_filename()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.housekeeping_check_cache_files:"
                              f" : Exception in transform_cache_filename: {repr(e)}")

            if not ctx_file.create_auto_representations(error_on_fail=True, log_warning_on_fail=False):
                if "NOT_AN_IMAGE" not in ctx_file.get_tags():
                    logging.error(f"{self.__class__.__name__}.housekeeping_check_cache_files: "
                                  f"create_auto_representation failed for {ctx_file.uid}. Will be tagged NOT_AN_IMAGE.")

                    ctx_file.add_tag("NOT_AN_IMAGE")
                    # in this case there is no need to change the modification time stamp, so we keep it.
                    ctx_file.update()
            else:
                if "NOT_AN_IMAGE" in ctx_file.get_tags():
                    ctx_file.drop_tag("NOT_AN_IMAGE")
                    # in this case there is no need to change the modification time stamp, so we keep it.
                    ctx_file.update()

    def housekeeping_rewrite_image_record(self, ctx_file: KioskContextualFile, console, parameters: dict):

        # corrects tags that have trailing or leading spaces within quotes. An issue from a former version of the
        # edit file dialog.
        # it also adds a img_proxy date because that got lost in a former version, too.
        try:
            update = False
            proxy = ctx_file.image_proxy
            if not proxy:
                self.add_counter("proxy is null", 1)
                ctx_file.image_proxy = kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True)
                update = True

            csv_tags = ctx_file.get_csv_tags()
            if csv_tags:
                ctx_file.set_tags(ctx_file.get_tags_from_csv(csv_tags))
                update = True
            if update:
                # in this case there is no need to change the modification time stamp, so we keep it.
                if not ctx_file.update():
                    raise Exception(f"update of {ctx_file.uid} failed.")
        except BaseException as e:
            logging.warning(f"{self.__class__.__name__}.housekeeping_rewrite_image_record: {repr(e)}")

    def housekeeping_lowercase_filenames(self, ctx_file: KioskContextualFile, console, parameters: dict):
        # changes files that have an uppercase letter in the filename in the files table.
        # the filename in the table and the file will both be renamed.
        try:

            if "BROKEN_FILE" not in ctx_file.get_tags():
                current_filename = ctx_file._file_record.filename
                if current_filename:
                    if re.search(r"[A-Z]", current_filename):
                        # logging.info(f"Correcting uppercase filename {current_filename}")
                        path_and_filename = ctx_file.get()
                        if os.path.isfile(path_and_filename):
                            new_path_and_filename = path_and_filename.lower()
                            os.rename(path_and_filename, new_path_and_filename)
                            ctx_file.set_filename(new_path_and_filename, commit=True)
                            logging.info(f"Corrected uppercase filename to {new_path_and_filename}")

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.housekeeping_lowercase_filenames: {repr(e)}")

    def housekeeping_quality_check(self, console, parameters: dict):
        logging.info(f"{self.__class__.__name__}.housekeeping_quality_check starts")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_quality_check starts")
        from synchronization import Synchronization
        sync = Synchronization()
        dsd = Dsd3Singleton.get_dsd3()
        qc = QualityControl(dsd, sync.type_repository)
        qc.trigger_qc("rtl")
        logging.info(f"{self.__class__.__name__}.housekeeping_quality_check done")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_quality_check done")

    def housekeeping_fts(self, console, parameters: dict):
        logging.info(f"{self.__class__.__name__}.housekeeping_fts starts")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_fts starts")
        dsd = Dsd3Singleton.get_dsd3()
        fts = FTS(dsd, SyncConfig.get_config())
        fts.rebuild_fts(console_output=True)
        logging.info(f"{self.__class__.__name__}.housekeeping_fts done")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_fts done")

    def housekeeping_clear_log(self, console, parameters: dict):
        logging.info(f"{self.__class__.__name__}.housekeeping_clear_log starts")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_clear_log starts")

        cfg = SyncConfig.get_config()
        try:
            housekeepingclearlog.clear_log(cfg)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.housekeeping_clear_log: {repr(e)}")
        logging.info(f"{self.__class__.__name__}.housekeeping_clear_log done")
        if console:
            print(f"{self.__class__.__name__}.housekeeping_clear_log done")
