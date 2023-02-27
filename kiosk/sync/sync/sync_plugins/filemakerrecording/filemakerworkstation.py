import datetime
import logging
import os
import shutil
from shutil import copyfile
import time
from os import path

from statemachine import StateTransition
from werkzeug import datastructures

import kioskstdlib
from core.recordingworkstation import RecordingWorkstation
from core.sync_constants import UserCancelledError
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from sync_config import SyncConfig
from kiosksqldb import KioskSQLDb
from kioskstdlib import report_progress
from .filemakercontrol import FileMakerControl
from contextmanagement.sqlsourcecached import CONTEXT_CACHE_NAMESPACE

FILES_TABLE_NAME = "images"


class FileMakerWorkstation(RecordingWorkstation):
    IN_THE_FIELD = "IN_THE_FIELD"

    NOT_SET = -1
    UPLOAD = 1
    DOWNLOAD = 2

    XSTATE_IMPORT_ERROR = 'IMPORT_ERROR'
    IMPORT_ERROR_EARLIER = 'EARLIER'
    IMPORT_ERROR_LATER = 'LATER'
    IMPORT_ERROR_NOT_OPENED = 'NOT_OPENED'
    IMPORT_ERROR_FM_PREPARE = 'FM_PREPARE'

    debug_fork_sync_time = None
    debug_dont_check_open_state = False

    def __init__(self, workstation_id, description="", sync=None, *args, **kwargs):
        self._no_transfer_necessary = []
        self.repldata_records = {}
        self.ws_fork_sync_time = None
        self._download_upload_status: int = self.NOT_SET
        self._download_upload_ts: datetime.datetime or None = None
        self._disabled = False
        self._options = ''
        self.x_state_info = {}
        self.fix_import_errors = False
        super().__init__(workstation_id, description, sync=sync, *args, **kwargs)

    @classmethod
    def get_workstation_type(cls) -> str:
        return "filemakerworkstation"

    @classmethod
    def register_states(cls):
        super().register_states()
        cls.STATE_NAME.update(
            {2: cls.IN_THE_FIELD,
             })

    def _register_no_transfer_necessary(self, tablename):
        """
        todo: documentation
        :param tablename:
        """
        self._no_transfer_necessary.append(tablename)

    def _table_didnt_need_transfer(self, table):
        """
        todo: documentation
        :param table:
        """
        return table in self._no_transfer_necessary

    @property
    def download_upload_status(self):
        """
        returns the current download_upload_status of the workstation
        Strictly taken this plays no role in the sync subsystem and is even manipulating a kiosk table.
        But it must be here because only that way can it operate in mcp worker processes
        :return:
        """
        return self._download_upload_status

    @property
    def download_upload_ts(self) -> datetime.datetime:
        """
        returns the timestamp of the download upload status
        Strictly taken this plays no role in the sync subsystem and is even manipulating a kiosk table.
        But it must be here because only that way can it operate in mcp worker processes
        :return: datetime
        """
        return self._download_upload_ts

    @property
    def options(self):
        return self._options

    @options.setter
    def options(self, value: bool):
        self._options = value

    def add_option(self, option: str):
        if self._options:
            options = self._options.split(";")
        else:
            options = []
        options.append(option.upper())
        self._options = ";".join(set(options))

    def drop_option(self, option):
        option = option.upper()
        if self._options:
            options = self._options.split(";")
        else:
            return
        options.pop(options.index(option))
        self._options = ";".join(options)

    def has_option(self, option):
        options = self._options.split(";")
        try:
            return options.index(option.upper()) > -1
        except:
            return False

    @property
    def disabled(self):
        return self._disabled

    @disabled.setter
    def disabled(self, value: bool):
        if value != self._disabled:
            cur = KioskSQLDb.get_dict_cursor()
            try:
                cur.execute("update " + " kiosk_workstation set disabled=%s where id=%s", [value, self._id])
                self._disabled = value
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.disable: {repr(e)}")
            finally:
                try:
                    cur.close()
                except:
                    pass

    def set_download_upload_status(self, status, commit=False, cur=None):
        close_cur = False
        try:
            if not cur:
                cur = KioskSQLDb.get_dict_cursor()
                close_cur = True

            ts = datetime.datetime.now()
            cur.execute("update " + " kiosk_workstation set download_upload_status=%s, "
                                    "ts_status=%s where id=%s", [status, ts, self._id])
            if commit:
                KioskSQLDb.commit()
            self._download_upload_status = status
            self._download_upload_ts = ts
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.set_download_upload_status: "
                          f"Exception {repr(e)}")
            raise e

            # noinspection PyBroadException
        finally:
            if cur and close_cur:
                cur.close()

    def init_state_machine(self):
        """
            todo: document
        """

        super().init_state_machine()

        self.state_machine.add_transition(self.READY_FOR_EXPORT,
                                          StateTransition("EXPORT_TO_FILEMAKER", self.IN_THE_FIELD, None, self.export))
        self.state_machine.add_transition(self.IN_THE_FIELD,
                                          StateTransition("FORK", self.READY_FOR_EXPORT, None, self.fork,
                                                          failed_state=self.IDLE))
        self.state_machine.add_transition(self.IN_THE_FIELD,
                                          StateTransition("EXPORT_TO_FILEMAKER", self.IN_THE_FIELD, None, self.export,
                                                          failed_state=self.READY_FOR_EXPORT))
        self.state_machine.add_transition(self.IN_THE_FIELD,
                                          StateTransition("IMPORT_FROM_FILEMAKER", self.BACK_FROM_FIELD, None,
                                                          self.import_workstation))
        self.state_machine.add_transition(self.BACK_FROM_FIELD,
                                          StateTransition("IMPORT_FROM_FILEMAKER", self.BACK_FROM_FIELD, None,
                                                          self.import_workstation,
                                                          failed_state=self.IN_THE_FIELD))
        self.state_machine.add_transition(self.BACK_FROM_FIELD,
                                          StateTransition("SYNCHRONIZE", self.IDLE, None, self._on_synchronized))

    @classmethod
    def get_template_filepath_and_name(cls, recording_group="default", create=True):
        """
        returns the path and filename of the template file to use for a given recording group.
        From now on recording group will be set to "default" if is not explicitly set and
        the default template will be in its own sub directory just as it is with other recording groups.

        :param recording_group: if not given, the default is "default"
        :param create: if set to False the template file will not be copied if it does not exist.
        :return: path and filename of the template file. Throws exceptions otherwise
        """
        template_file = SyncConfig.get_config().filemaker_template
        if not recording_group:  # or recording_group == "default":
            raise Exception(f"{cls.__name__}.get_template_filepath_and_name: kiosk > 0.11.1 "
                            f"expects to export to a recording group.")
        else:
            master_template_filename = kioskstdlib.get_filename(template_file)
            group_dir = os.path.join(kioskstdlib.get_file_path(template_file),
                                     "recording_groups",
                                     kioskstdlib.get_valid_filename(recording_group))
            template_path_and_filename = os.path.join(group_dir, master_template_filename)
            if path.isfile(template_path_and_filename):
                return template_path_and_filename

            if create:
                os.makedirs(group_dir, exist_ok=True)
                if path.isfile(template_file):
                    copyfile(template_file, template_path_and_filename)
                    if path.isfile(template_path_and_filename):
                        return template_path_and_filename
                    else:
                        raise FileNotFoundError(
                            f"Could not find nor create group template {template_path_and_filename}")
                else:
                    raise FileNotFoundError(f"Could not find the master template {template_file}")
            else:
                return template_path_and_filename

    def _on_create_workstation(self, cur):
        """
        creates _fm_repldata_transfer, which is specific to filemaker workstations.
        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """
        super()._on_create_workstation(cur)

        KioskSQLDb.drop_table_if_exists(tablename=self._id + "_fm_repldata_transfer",
                                        namespace=self._db_namespace.lower())
        table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace.lower(),
                                                          db_table=self._id + "_fm_repldata_transfer")
        sql = f"create table {table_name}("
        sql += "id serial NOT NULL, "
        sql += "tablename varchar NOT NULL, "
        sql += "uid uuid NOT NULL, "
        sql += "modified varchar NOT NULL, "
        sql += "modified_by varchar NOT NULL "
        sql += ");"
        cur.execute(sql)

        sql = "INSERT " + "INTO \"repl_workstation_filemaker\"(\"id\") " \
                          "VALUES(%s)"

        cur.execute(sql, [self._id])

        try:
            KioskSQLDb.execute("delete from " + " kiosk_workstation where id=%s ", [self._id], commit=False)
            KioskSQLDb.execute("insert into " + " kiosk_workstation(id, download_upload_status, \"options\") "
                                                "values(%s,%s,%s)", [self._id, self.NOT_SET, self._options],
                               commit=False)
            self._download_upload_ts = None
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.create_workstation: {repr(e)}")
            KioskSQLDb.rollback()
            raise e

    def _on_load(self):
        self._download_upload_status = self.NOT_SET
        self._download_upload_status = None
        r = KioskSQLDb.get_first_record("kiosk_workstation", "id", self._id, )
        if r:
            self._download_upload_status = r["download_upload_status"]
            self._download_upload_ts = r["ts_status"]
            self._disabled = r["disabled"]
            self._options = r["options"]
        r = KioskSQLDb.get_first_record("repl_workstation_filemaker", "id", self._id, )
        if r:
            if "x_state_info" in r:
                self.x_state_info = r["x_state_info"]
            if not self.x_state_info:
                self.x_state_info = {}

    def _on_update_workstation(self, cur):
        close_cur = False
        try:
            if not cur:
                cur = KioskSQLDb.get_dict_cursor()
                close_cur = True

            cur.execute("update " + " kiosk_workstation set options=%s "
                                    " where id=%s", [self._options, self._id])
            cur.execute("update " + " repl_workstation_filemaker set x_state_info=%s "
                                    " where id=%s", [self.x_state_info, self._id])
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._on_update_workstation: {repr(e)}")
        finally:
            if close_cur:
                try:
                    cur.close()
                except BaseException as e:
                    pass

        # Not doing the following because e.g. updating the recording group does not mean the last download
        # has changed its date!
        # self.set_download_upload_status(self._download_upload_status,cur=cur)

    def _on_delete_workstation(self, cur, migration):
        super()._on_delete_workstation(cur, migration)
        logging.debug("removing record in repl_workstation_filemaker for " + self._id)
        cur.execute("delete from repl_workstation_filemaker where id=%s", [self._id])
        logging.debug("removing record in kiosk_workstation for " + self._id)
        cur.execute("delete from kiosk_workstation where id=%s", [self._id])
        if self._db_namespace:
            migration.drop_table(self._id + "_fm_repldata_transfer", namespace=self._db_namespace)

    def get_export_path_and_filename(self, create_if_necessary=False):
        """
            todo: used in workstationmanagercontroller - download, where it should not be used explicitly
            todo: document
            todo: redesign
            todo: refactor
        """
        fm = FileMakerControl.get_instance()
        file_name = fm._init_export_fm_filename(self)
        if not file_name:
            self.get_and_init_files_dir("export")
            file_name = fm._init_export_fm_filename(self, check_path_only=True)

        return file_name

    def get_import_path_and_filename(self, create_if_necessary=False):
        """
            todo: document
            todo: redesign
            todo: refactor
        """
        fm = FileMakerControl.get_instance()
        file_name = fm._init_import_fm_filename(self, check_path_only=True)
        if not file_name:
            self.get_and_init_files_dir("import")
            file_name = fm._init_import_fm_filename(self, check_path_only=True)

        return file_name

    def get_and_init_files_dir(self, direction="import", init=True):
        """ returns the path to the workstation's files-directory. Depending on the
            parameter direction it is either the "import" or the "export" directory.\n

            :param direction: optional. "import" (default value) or "export" depending on
                    which directory is requested.
            :param init: optional. If set to False missing directories will NOT be created.
            :return: "" or the path of the requested directory.
                     If the directory does not exist, it will be created.

                     The directories will not be emptied if they exist!

            todo: redesign towards using only a filemaker dir. Workstations should be subdirectories with import/export subdirectories
            todo: refactor
        """
        if direction == "import":
            dest_dir = SyncConfig.get_config().filemaker_import_dir
        else:
            dest_dir = SyncConfig.get_config().filemaker_export_dir

        if not path.isdir(dest_dir):
            os.mkdir(dest_dir)
            if not path.isdir(dest_dir):
                logging.error(
                    "get_and_init_files_dir: " + dest_dir + ' does not seem to exist or is not a folder/directory.')
                return ""

        dest_dir = path.join(dest_dir, self.get_id())
        if not path.isdir(dest_dir):
            if not init:
                logging.error(
                    "get_and_init_files_dir: " + dest_dir + ' does not seem to exist or is not a folder/directory.')
                return ""
            else:
                try:
                    os.mkdir(dest_dir)
                except Exception as e:
                    logging.error("get_and_init_files_dir: cannot create directory " + dest_dir + ": " + repr(e))
                    return ""

        dest_dir = path.join(dest_dir, "files")
        if path.isdir(dest_dir):
            return dest_dir
        else:
            try:
                os.mkdir(dest_dir)
            except Exception as e:
                logging.error("get_and_init_files_dir: cannot create directory " + dest_dir + ": " + repr(e))
                return ""
        if path.isdir(dest_dir):
            return dest_dir
        else:
            logging.error(
                ("get_and_init_files_dir: " + dest_dir + ' does not seem to exist after creation '
                                                         'or is not a folder/directory.'))
            return ""

    # *******************************************************************
    # ********             export files to filemaker         ************
    # *******************************************************************
    def interruptable_callback_progress(self, *args, **kwargs):
        """
        todo: documentation
        :param args:
        :param kwargs:
        """
        if not self.callback_progress(*args, **kwargs):
            raise UserCancelledError

    def export(self):
        """ exports the workstation's shadow tables
            to a filemaker database and sets the workstation to state IN_THE_FIELD.
            Checks if the workstation is in the correct state (which is usually READY_FOR_EXPORT).

            ignore_status ignores only if the workstation is already in state IN_THE_FIELD.

            Returns true or false and does not catch all exceptions.

            todo: redesign
            todo: refactor: It is long.

        """
        rc = False
        template_file = ""

        try:
            logging.info("FileMakerWorkstation.export: Exporting to workstation " + self.get_id())

            # just to make sure!
            if not self._export_check_machine_state():
                return False

            self.sleep_for_filemaker()
            self.repldata_records = {}
            self._no_transfer_necessary = []

            report_progress(self.interruptable_callback_progress, 1, None, "Starting FileMaker ...")

            template_file = self.get_template_filepath_and_name(self.recording_group)
            logging.debug(f"{self.__class__.__name__}.export: Using template {template_file}")

            fm = FileMakerControl.get_instance()
            if fm.start_fm_database(self, pathandfilename=template_file, use_odbc_ini_dsn=True) is None:
                raise Exception("Error when starting FileMaker database.")

            report_progress(self.interruptable_callback_progress, 5, None, "Checking database consistency ...")
            try:
                if not fm.check_fm_database(True):
                    raise Exception("check_fm_database reported an issue.")
            except BaseException as e:
                raise Exception(f"filemaker database check failed ({repr(e)}) ")

            if fm.set_constant("TRANSACTION_STATE", "CORRUPT"):
                images_with_modified_by_null = fm.count_images_with_modified_by_null()
                self.ws_fork_sync_time = fm.get_ts_constant("fork_sync_time")
                report_progress(self.interruptable_callback_progress, 20, None, "Transferring data to FileMaker...")
                if self._transfer_tables_to_filemaker(fm, self.interruptable_callback_progress):
                    report_progress(self.interruptable_callback_progress, 50, None,
                                    "Preparing images transfer to FileMaker...")
                    if self._sync_file_tables_in_filemaker(fm):
                        # raise InterruptedError()
                        report_progress(self.interruptable_callback_progress, 55, None,
                                        "Transferring images to FileMaker...")
                        if self._import_images_into_filemaker(fm,
                                                              callback_progress=self.interruptable_callback_progress):

                            # rc = self._build_file_identifier_cache(fm)
                            rc = self._transfer_file_identifier_cache(fm)
                            if not rc:
                                logging.error("FileMakerWorkstation.export: _transfer_file_identifier_cache failed.")
                            else:
                                rc = self._set_workstation_constants(fm)
                                if not rc:
                                    logging.error(
                                        "FileMakerWorkstation.export: _set_workstation_constants failed.")

                            if rc:
                                report_progress(self.interruptable_callback_progress, 90, None,
                                                "Individualizing workstation ...")
                                if self._finish_and_check_import(fm):
                                    report_progress(self.interruptable_callback_progress, 94, None,
                                                    "finalizing ...")
                                    diff = fm.count_images_with_modified_by_null() - images_with_modified_by_null
                                    if diff != 0:
                                        logging.info(f"{self.__class__.__name__}.export: {diff} new images "
                                                     f"with a null modified_by.")
                                    rc = fm._apply_config_patches()

                                    if rc:
                                        if rc and fm.set_constant("TRANSACTION_STATE", "OK"):
                                            # this constant will be checked when importing a file. If it is still "false" there,
                                            # the file won't be reimported.
                                            fm.set_constant("has_been_opened", "false")
                                            report_progress(self.interruptable_callback_progress, 95, None,
                                                            "Closing filemaker ...")
                                            rc = True
                                        else:
                                            rc = False
                                            logging.error("FileMakerWorkstation.export: Error setting constant "
                                                          "TRANSACTION_STATE failed")
                                    else:
                                        logging.error("FileMakerWorkstation.export: Error in apply_config_patches "
                                                      "TRANSACTION_STATE failed")
                                else:
                                    rc = False
                                    logging.error("FileMakerWorkstation.export: _finish_and_check_import failed.")

                        else:
                            logging.error(
                                "FileMakerWorkstation.export: fm.process_images_transfer_table failed.")
            else:
                logging.error(
                    "FileMakerWorkstation.export: setting constant TRANSACTION_STATE to CORRUPT failed")

            if not rc:
                logging.error(
                    "FileMakerWorkstation.export: error during process, statechange to IN_THE_FIELD not successful.")

        except UserCancelledError:
            logging.error(f"Exception in FileMakerWorkstation.export: A user has cancelled the process.")
            rc = False
            pass
        except Exception as e:
            logging.error(f"Exception in FileMakerWorkstation.export: {repr(e)}")
            rc = False

        finally:
            try:
                # noinspection PyUnusedLocal
                fm = None
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.export: "
                              f"Exception when closing filemaker: {repr(e)}")

        if not rc:
            try:
                # there is a rollback but I can't see any commit?
                KioskSQLDb.rollback()
                logging.info("FileMakerWorkstation.export: rollback successful ")
            except Exception as e:
                logging.error(f"FileMakerWorkstation.export: Exception when rolling back {repr(e)} ")
            # noinspection PyUnusedLocal
            fm = None

        # gives filemaker the chance to really close before we copy the file.
        try:
            report_progress(self.interruptable_callback_progress, 95, None,
                            "Publishing workstation file ...")
            time.sleep(3)
            if rc:
                # we get here if the template file has been turned into a proper workstation
                # now the template file has to be copied to the workstation
                rc = self._create_export_file_from_template(template_file)
        except BaseException:
            rc = False

        return rc

    def _build_file_identifier_cache(self, fm):
        if self._build_file_identifier_cache_necessary():
            report_progress(self.interruptable_callback_progress, 70, None,
                            "creating file identifier cache ...")
            rc = fm.rebuild_file_identifier_cache(
                callback_progress=self.interruptable_callback_progress)
        else:
            rc = True
        return rc

    def _transfer_file_identifier_cache(self, fm):
        """ transfers the file-identifier-cache to filemaker.
            Transfers only those entries for which there are images in the workstation's
            image table.

            returns true or false, does not catch exceptions.

            """
        try:
            if not self._build_file_identifier_cache_necessary():
                logging.debug(f"{self.__class__.__name__}._transfer_file_identifier_cache: "
                              f"file identifier cache does not need amendments.")
                return True

            cfg = SyncConfig.get_config()
            timeout_amend_fic = 120
            try:
                timeout_amend_fic = int(cfg["filemakerrecording"]["timeout_amend_file_identifier_cache"])
                logging.debug(f"{self.__class__.__name__}._transfer_file_identifier_cache: "
                              f"timeout_ammend_fic set to {timeout_amend_fic}. ")
            except KeyError as e:
                pass
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._transfer_file_identifier_cache : "
                              f"Exception when accessing config key: {repr(e)}")
            if not timeout_amend_fic:
                logging.warning(f"{self.__class__.__name__}._transfer_file_identifier_cache: "
                                f"file identifier cache did not get amended. Searching the gallery won't work in "
                                f"the filemaker database. This is not critical at all, just an inconvenience.")
                return True

            ws_img_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                     db_table=self._id + "_fm_image_transfer")

            kiosk_table = KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE, 'file_identifier_cache')
            sql_select = 'SELECT '
            # the nullif avoids the gobbledygook that ends up in filemaker if a string is empty:
            sql_select += f'(CASE kiosk_cache.{KioskSQLDb.sql_safe_ident("primary")} WHEN True ' \
                          f'THEN nullif(trim(kiosk_cache.{KioskSQLDb.sql_safe_ident("description")}),\'\') ' \
                          f'ELSE null END) AS {KioskSQLDb.sql_safe_ident("image_text")}'

            kiosk_field_list = ["identifier", "data", "record_type", "data_uuid"]
            fm_field_list = ["identifier", "uid_image", "recording_context", "uid_recording_context"]

            for _ in range(0, len(kiosk_field_list)):
                sql_select += f", kiosk_cache.{KioskSQLDb.sql_safe_ident(kiosk_field_list[_])} " \
                              f"{KioskSQLDb.sql_safe_ident(fm_field_list[_])}"

            fm_field_list.insert(0, "image_text")
            sql_from = f" FROM {kiosk_table} kiosk_cache INNER JOIN {ws_img_table_name} ws_images "
            sql_from += f" ON kiosk_cache.data = ws_images.uid_file "
            sql_where = f" where ws_images.filepath_and_name<>'dummy'"

            sql = sql_select + sql_from + sql_where
            cur = KioskSQLDb.execute_return_cursor(sql)

            logging.info((f"\nFileMakerWorkstation._transfer_file_identifier_cache: "
                          f"About to copy {str(cur.rowcount)} lines from {kiosk_table} to filemaker"))

            report_progress(self.interruptable_callback_progress, 85, None,
                            "transfering file identifier cache ...")

            rc = bool(fm.transfer_table_data_to_filemaker(cur, None, "file_identifier_cache_load", fm_field_list))
            if rc:
                try:
                    report_progress(self.interruptable_callback_progress, 87, None,
                                    "amending file identifier cache ...")
                    fm.truncate_table("file_identifier_cache")
                    rc = fm._start_fm_script_and_wait("import_file_identifier_cache", timeout_amend_fic)
                    if rc:
                        logging.debug(f"{self.__class__.__name__}._transfer_file_identifier_cache returned {rc}. ")
                        return True
                    else:
                        logging.error(f"{self.__class__.__name__}._transfer_file_identifier_cache: "
                                      f"Filemaker script returned False")
                except Exception as e:
                    logging.error(f"{self.__class__.__name__}._transfer_file_identifier_cache: Exception " + repr(e))

                return False
            else:
                return False
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._transfer_file_identifier_cache: {repr(e)}")
            raise e

    def _export_check_machine_state(self):
        """
        todo: documentation
        :return:
        """
        if not self.state_machine.get_state() in [self.READY_FOR_EXPORT, self.IN_THE_FIELD]:
            logging.error("FileMakerWorkstation.export: Export called although work station has state " +
                          self.state_machine.get_state())
            return False

        if self.state_machine.get_state() == self.IN_THE_FIELD:
            logging.info(
                f"FileMakerWorkstation.export: Called although workstation {self.get_id()} is already marked"
                f" as in the field. ")

        return True

    def sleep_for_filemaker(self):
        """
        todo: documentation
        :return:
        """
        cfg = SyncConfig.get_config()
        seconds = cfg.sleep_for_filemaker
        if seconds:
            report_progress(self.interruptable_callback_progress, 1, None,
                            "Sleeping a bit before starting FileMaker ...")
            time.sleep(seconds)

    def _transfer_tables_to_filemaker(self, fm, callback_progress=None):
        """ exports the workstation's shadow tables from the master-Model
            to a filemaker database. Requests an open FileMakerControl object.

            returns true or false

        .. note:

            does not check whether the workstation is in the appropriate state nor does
            it set the resulting state afterwards! Don't use outside of export_to_filemaker

            todo: redesign
            todo: refactor
        """

        cur = KioskSQLDb.get_dict_cursor()
        if cur is None:
            logging.error("FileMakerWorkstation._transfer_tables_to_filemaker: KioskSQLDb.get_cursor() failed.")
            return False

        dsd = self._get_workstation_dsd()
        if dsd is None:
            logging.error("FileMakerWorkstation._transfer_tables_to_filemaker: KioskSQLDb.get_dsd() failed.")
            return False

        san_fm_repldata_transfer = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                        db_table=self._id + "_fm_repldata_transfer")
        fm_repldata_transfer = db_table = self._id + "_fm_repldata_transfer"
        KioskSQLDb.truncate_table(table=fm_repldata_transfer, namespace=self._db_namespace)

        tables = dsd.list_tables()
        files_table = dsd.files_table.lower()
        c_tables = len(tables) + 2
        c = 0
        try:
            for table in tables:
                table: str
                c += 1
                report_progress(callback_progress, c * 100 / c_tables, "transfer_tables", f"transferring {table} ...")

                if table.lower() == files_table:
                    if not self._transfer_table_data_to_filemaker(cur, fm, dsd, table, table + "_load"):
                        raise Exception(("FileMakerWorkstation._transfer_tables_to_filemaker: "
                                         "_transfer_table_data_to_filemaker returned False for table " + table))
                else:
                    if not self._transfer_table_data_to_filemaker(cur, fm, dsd, table):
                        raise Exception(("FileMakerWorkstation._transfer_tables_to_filemaker: "
                                         "_transfer_table_data_to_filemaker returned False for table " + table))

                report_progress(callback_progress, c * 100 / c_tables, "transfer_tables", f"transferring {table} ...")

                if not self._table_didnt_need_transfer(table):
                    if not self._gather_repldata(cur, dsd, table):
                        raise Exception(("FileMakerWorkstation._transfer_tables_to_filemaker: "
                                         "_gather_repldata returned False for table " + table))
                else:
                    logging.debug(f"{self.__class__.__name__}._transfer_tables_to_filemaker: "
                                  f"No replication data colleted for {table}. Table did not need transfer.")

            c += 1
            report_progress(callback_progress, c * 100 / c_tables, "transfer_tables",
                            f"transferring image metadata ...")
            if not self._transfer_image_transfer_table(cur, fm):
                raise Exception(("FileMakerWorkstation._transfer_tables_to_filemaker: "
                                 "_transfer_image_transfer_table() returned False."))

            c += 1
            report_progress(callback_progress, c * 100 / c_tables, "transfer_tables",
                            "transferring replication metadata ... ")
            if not self._transfer_repldata_transfer_table(cur, fm):
                raise Exception(("FileMakerWorkstation._transfer_tables_to_filemaker: "
                                 "_transfer_repldata_transfer_table() returned False."))

            cur.close()
            KioskSQLDb.commit()
            return True
        except Exception as e:
            logging.error("FileMakerWorkstation._transfer_tables_to_filemaker: Exception " + repr(e))
            try:
                KioskSQLDb.rollback()
                logging.info("FileMakerWorkstation._transfer_tables_to_filemaker: rollback ok")
            except Exception as e:
                logging.error("FileMakerWorkstation._transfer_tables_to_filemaker: Exception at rollback " + repr(e))

        cur.close()
        return False

    def _sync_file_tables_in_filemaker(self, fm: FileMakerControl):
        dsd = self._get_workstation_dsd()
        columns = dsd.list_fields(dsd.files_table)
        if self._table_didnt_need_transfer(dsd.files_table):
            logging.debug(f"{self.__class__.__name__}._sync_file_tables_in_filemaker: "
                          f"step skipped because table {dsd.files_table} has not been updated.")
            return True
        else:
            return fm.sync_internal_files_tables(dsd.files_table, columns)

    def _transfer_image_transfer_table(self, cur, fm) -> bool:
        """ transfers the contents of the table id_fm_image_transfer from the master-Model to the
            filemaker-Model. Don't use outside of _transfer_tables_to_filemaker.

            :return: true or false

        """
        src_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                              db_table=self._id + "_fm_image_transfer")
        field_list = ["id", "uid_file", "filepath_and_name", "location", "resolution", "disabled", "file_type",
                      "file_size"]
        sql_select = 'SELECT '
        comma = ""
        for f in field_list:
            sql_select = sql_select + comma + '"' + f + '"'
            comma = ", "
        sql_select = sql_select + ' FROM ' + src_table_name + ';'
        cur.execute(sql_select)

        logging.info(("\nFileMakerWorkstation._transfer_image_transfer_table: "
                      "About to copy " + str(cur.rowcount) + " lines from " + src_table_name + " to filemaker"))
        rc = fm.transfer_table_data_to_filemaker(cur, None, "fm_image_transfer", field_list)
        if rc == 2:
            # table was already up to date.
            self._register_no_transfer_necessary("fm_image_transfer")

        return bool(rc)

    def _transfer_repldata_transfer_table(self, cur, fm) -> bool:
        """ transfers the contents of the table id_fm_repldata_transfer from the master-Model to the
            filemaker-Model. Don't use outside of _transfer_tables_to_filemaker.

            returns true or false, does not catch exceptions.

        """

        src_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                              db_table=self._id + "_fm_repldata_transfer")
        field_list = ["id", "tablename", "uid", "modified", "modified_by"]
        sql_select = 'SELECT '
        comma = ""
        for f in field_list:
            sql_select = sql_select + comma + '"' + f + '"'
            comma = ", "
        sql_select = sql_select + ' FROM ' + src_table_name + ';'
        cur.execute(sql_select)

        if cur.rowcount > 0:
            logging.info(f"FileMakerWorkstation._transfer_repldata_transfer_table: "
                         f" About to copy {str(cur.rowcount)} lines from {src_table_name} to filemaker")
        else:
            logging.info(f"FileMakerWorkstation._transfer_repldata_transfer_table: "
                         f"No records in {src_table_name}: import replication data can be skipped later.")
            self._register_no_transfer_necessary("fm_repldata_transfer")

        return bool(fm.transfer_table_data_to_filemaker(cur, None, "fm_repldata_transfer", field_list))

    def _gather_repldata(self, cur, dsd: DataSetDefinition, tablename):
        """
            todo: document
            todo: redesign
            todo: refactor
        """
        fld_names = []
        src_table_name = ""
        sql_repldata_insert = ""

        try:
            src_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                  db_table=self._id + "_" + tablename)

            transfer_table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                  db_table=self._id + "_fm_repldata_transfer")

            sql_repldata_insert = f"INSERT INTO {transfer_table}"
            sql_repldata_insert += "(\"tablename\", \"uid\", \"modified\", \"modified_by\")"
            ok = True
            for fld_name in ["replfield_uuid", "replfield_modified", "replfield_modified_by"]:
                fld = dsd.get_fields_with_instructions(tablename, [fld_name])
                if fld and len(fld) == 1:
                    fld_names.append(next(iter(fld.keys())))
                else:
                    ok = False
                    logging.debug(f"{self.__class__.__name__}._gather_repl_data: "
                                  f"dsd table {tablename} lacks replication field {fld_name}")
                    break
        except Exception as e:
            logging.error(("FileMakerWorkstation._gather_repldata: "
                           "Exception (1) in _gather_repldata with table " + tablename + ": " + repr(e)))
            ok = False

        if ok:
            ok = False
            sql = ""
            try:
                sql_select = "select \'" + tablename + "\' \"tablename\""
                for f in fld_names:
                    sql_select += ", \"" + f + "\""

                sql_select += f" from {src_table_name} "
                sql = sql_repldata_insert + " " + sql_select + ";"
                cur.execute(sql)
                logging.debug((f"FileMakerWorkstation._gather_repldata: Copied "
                               f"{str(cur.rowcount)} lines from {src_table_name} to "
                               f"{transfer_table}"))
                self.repldata_records[tablename] = cur.rowcount
                ok = True
            except Exception as e:
                logging.error("FileMakerWorkstation._gather_repldata: Exception " + repr(e))
                logging.error("SQL was: " + sql)

        return ok

    def _transfer_table_data_to_filemaker(self, cur, fm, dsd: DataSetDefinition, tablename, dest_tablename="") -> bool:
        """ transfers the data from a single table from the master-Model to the
            filemaker-Model.
            returns true or false, does not catch exceptions.

            todo: redesign
            todo: refactor
        """
        if not dest_tablename:
            dest_tablename = tablename

        # src_table_name does not need to be sanitized here. Will happen later.
        src_table_name = self._id + "_" + tablename
        sql_select = 'SELECT '
        comma = ""
        for f in dsd.list_fields(tablename):
            sql_select = sql_select + comma + '"' + f + '"'
            comma = ", "

        latest_record_data = self._get_up_to_date_markers_from_table(cur, dsd, src_table_name, tablename)

        san_src_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                  db_table=src_table_name)
        sql_select = sql_select + f' FROM {san_src_table_name};'
        try:
            cur.execute(sql_select)
            logging.info(f"FileMakerWorkstation._transfer_table_data_to_filemaker: "
                         f"About to copy {str(cur.rowcount)} lines from {san_src_table_name} "
                         f"to filemaker:{dest_tablename}")

            rc = fm.transfer_table_data_to_filemaker(cur, dsd, tablename, dest_tablename=dest_tablename,
                                                     latest_record_data=latest_record_data)
            if rc == 2:
                # table was already up to date.
                self._register_no_transfer_necessary(tablename)

            return bool(rc)

        except Exception as e:
            logging.error("FileMakerWorkstation._transfer_table_data_to_filemaker: Exception " + repr(e))
            logging.error("SQL is " + sql_select)
            return False

    def _get_up_to_date_markers_from_table(self, cur, dsd: DataSetDefinition, src_table_name, tablename):
        """
        returns markers that can be used to find out if a table's data is up to date.
        The markers are the max and the number of dates in the table's modified-date field.

        :param cur: a valid database cursor
        :param dsd: the dataset definition
        :param src_table_name: the unquoted name of the source table (usually the tablename with a prefix. If
               the workstation uses a namespace it will be added automatically.
        :param tablename: the name of the table's definition in the dsd
        :return: a tuple: (name of the table's modified-field, max(modified_field), count(modified_field)) or ()
        """
        latest_record_data = ()
        modified_field = dsd.get_modified_field(tablename)
        san_src_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                  db_table=src_table_name)
        if modified_field:
            cur.execute(f"select max(\"{modified_field}\") max_date, "
                        f"count(\"{modified_field}\") count_date from {san_src_table_name}")
            r = cur.fetchone()
            if r:
                latest_record_data = (modified_field, r[0], r[1])
                logging.debug(f"{self.__class__.__name__}._transfer_table_data_to_filemaker: "
                              f"latest_record_data is {latest_record_data}")
        return latest_record_data

    def _set_workstation_constants(self, fm):
        """
            sets necessary values in the constant table of the workstation's filemaker-Model

        """
        cfg = SyncConfig.get_config()
        rc = fm.set_constant("export_date", datetime.datetime.today())
        if rc:
            rc = fm.set_constant("export_device_id", self._id)
        if rc:
            rc = fm.set_constant("fork_time", self.get_fork_time())
        if rc:
            rc = fm.set_constant("fork_sync_time", self.get_fork_sync_time())
        if rc:
            rc = fm.set_constant("developer_mode", "false")
        if rc:
            if self.gmt_time_zone:
                time_offset_str = kioskstdlib.local_time_offset_str(self.gmt_time_zone)
                if time_offset_str:
                    rc = fm.set_constant("utc_time_diff", time_offset_str)
                    logging.info(f"{self.__class__.__name__}._set_workstation_constants: "
                                 f"Workstation {self.get_id()} in time_zone {time_offset_str} ")
                else:
                    logging.error(f"{self.__class__.__name__}._set_workstation_constants: "
                                  f"Error in time_zone setting {self.gmt_time_zone} "
                                  f"for workstation {self.get_id()}")
                    rc = False
            else:
                rc = fm.set_constant("utc_time_diff", kioskstdlib.local_time_offset_str())
        if rc:
            rc = fm.set_constant("database_name", kioskstdlib.get_filename_without_extension(cfg.filemaker_db_filename))
        if rc:
            rc = fm.set_constant("utc_offset_server", kioskstdlib.local_time_offset_str())

        return rc

    def _import_images_into_filemaker(self, fm, callback_progress=None):
        """
            todo: document
            todo: redesign
            todo: refactor
        """
        try:
            dsd = self._get_workstation_dsd()

            skip_it = self._table_didnt_need_transfer(dsd.files_table)
            if skip_it:
                logging.debug(f"{self.__class__.__name__}._import_images_into_filemaker: "
                              f"step can be skipped because table {dsd.files_table} had no updates.")
                skip_it = self._table_didnt_need_transfer("fm_image_transfer")
                if skip_it:
                    logging.debug(f"{self.__class__.__name__}._import_images_into_filemaker: "
                                  f"step can be skipped because table fm_image_transfer had no updates.")
                else:
                    logging.debug(f"{self.__class__.__name__}._import_images_into_filemaker: "
                                  f"step is necessary because table fm_image_transfer had been transferred.")
            else:
                logging.debug(f"{self.__class__.__name__}._import_images_into_filemaker: "
                              f"step is necessary because table {dsd.files_table} had been transferred.")

            if skip_it:
                return True

            import_results = fm.process_images_transfer_table(callback_progress=callback_progress)
            cimages = 0
            ok = False
            if import_results:
                if import_results[-1] == "|":
                    import_results = import_results[:-1]
                results_per_table = import_results.split("|")
                for tbl_val in results_per_table:
                    val = tbl_val.split(":")[1]
                    cimages = cimages + int(val)

                san_fm_image_transfer = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                             db_table=f"{self.get_id()}"
                                                                                      f"_fm_image_transfer")
                c = KioskSQLDb.execute(f"select id from {san_fm_image_transfer};")
                if int(cimages) != int(c):
                    logging.error(("FileMakerWorkstation._import_images_into_filemaker: "
                                   "filemaker reports a different number of records: " +
                                   str(cimages) + " instead of " + str(c)))
                    ok = False
                else:
                    ok = True
                    logging.info(("FileMakerWorkstation._import_images_into_filemaker: " +
                                  str(cimages) + " images/files successfully imported by filemaker."))
            else:
                logging.error(("FileMakerWorkstation._import_images_into_filemaker: "
                               "process_images_transfer_table failed for workstation " + self._id))
        except Exception as e:
            logging.error("FileMakerWorkstation._import_images_into_filemaker: Exception " + repr(e))
            ok = False
        return ok

    def _finish_and_check_import(self, fm):
        """
            finishes the export of records to filemaker by processing the fm_repldata_transfer table and
            checking the results filemaker reported with the record counts of the workstation's data tables.
            :param fm: filemaker instance
            :return: True or False
        """
        if self._table_didnt_need_transfer("fm_repldata_transfer"):
            logging.debug(f"{self.__class__.__name__}._finish_and_check_import: "
                          f"step unnecessary because table fm_repldata_transfer does not contain records.")
            return True

        import_results = fm.process_repldata_transfer_table()
        result_records = {}
        ok = False
        if import_results:
            if import_results[-1] == "|":
                import_results = import_results[:-1]
            results_per_table = import_results.split("|")
            for tbl_val in results_per_table:
                tbl = tbl_val.split(":")[0]
                val = tbl_val.split(":")[1]
                result_records[tbl] = val

            ok = True
            for tbl in list(self.repldata_records):
                if tbl in result_records:
                    if int(self.repldata_records[tbl]) != int(result_records[tbl]):
                        logging.error(("FileMakerWorkstation._finish_and_check_import: "
                                       "table " + tbl + " reports a different number of records: " +
                                       str(result_records[tbl]) + " instead of " + str(self.repldata_records[tbl])))
                        ok = False
                else:
                    logging.error(("FileMakerWorkstation._finish_and_check_import: "
                                   "_finish_and_check_import: table " + tbl + " missing in import_results from filemaker."))
                    ok = False
        else:
            logging.error(("FileMakerWorkstation._finish_and_check_import: "
                           "_finish_and_check_import: process_repldata_transfer_table failed for workstation " + self._id))
        return ok

    # *******************************************************************
    # ***********             import from filemaker           ***********
    # *******************************************************************

    def import_workstation(self):
        """ imports the data from a workstation's file maker file. Afterwards the workstation will
        turn to state "BACK_FROM_FIELD" \n

        checks if the workstation is in the correct state

        :returns: True or False

        TODO: callback_progress needs different solution
        TODO: redesign and refactor
        """

        # just to make sure
        if self.state_machine.get_state() in [self.IN_THE_FIELD, self.BACK_FROM_FIELD]:
            logging.info("FileMakerWorkstation.import_workstation: Importing data from work station " + self.get_id())
            return self._import_from_filemaker()

        else:
            logging.error("FileMakerWorkstation.import_workstation: Called with a workstation in state " +
                          self.state_machine.get_state())
            return False

    def get_fork_time(self):
        """
            returns the fork time of the workstation as stored in the database.
            If debug_fork_sync_time is set, that one will be returned instead.

            In any case, microseconds will be set to 0.
        """
        if self.debug_fork_sync_time and isinstance(self.debug_fork_sync_time, datetime.datetime):
            fork_time = self.debug_fork_sync_time
        else:
            fork_time = self._get_workstation_attribute_from_db("fork_time")

        fork_time = fork_time.replace(microsecond=0)

        return fork_time

    def _compare_imported_fork_time(self, ws_fork_time: datetime.datetime):
        """
          compares a given fork time (e.G. that from an actual workstation) with the
          fork time stored in the repl_workstation table.
        :param ws_fork_time: datetime
        :return: -1 if the given fork time is earlier, 0 if it is equal and 1 if it is later.
        """
        try:
            # don't compare microseconds
            db_fork_time = self.get_fork_time().replace(microsecond=0)
            ws_fork_time = ws_fork_time.replace(microsecond=0)
            if ws_fork_time < db_fork_time:
                return -1
            if ws_fork_time > db_fork_time:
                return 1
            if ws_fork_time == db_fork_time:
                return 0
            raise Exception(f"ws_fork_time {ws_fork_time} and db_fork_time{db_fork_time} cannot be compared.")
        except Exception as e:
            logging.error(f"Exception in _compare_imported_fork_time: {repr(e)}")
            raise e

    def _import_from_filemaker(self):
        """ imports data from a filemaker database back into the workstation's shadow table
            within the master database

            Does n o t check if the workstation's state machine is in the correct state.

            :returns: true or false and does not catch all exceptions.

        """
        rc = False

        try:
            if self.fix_import_errors:
                logging.warning("Importing in repair mode: Skipping problematic steps automatically.")
            fm = FileMakerControl.get_instance()
            self.sleep_for_filemaker()
            report_progress(self.interruptable_callback_progress, 1, None, "Starting FileMaker ...")
            if not fm.start_fm_database(self, "import", use_odbc_ini_dsn=True):
                raise Exception("Error opening fm database for import in Workstation.import_from_filemaker ")

            report_progress(self.interruptable_callback_progress, 5, None,
                            "checking database consistency ...")
            if self._check_fm_database_before_import(fm):
                report_progress(self.interruptable_callback_progress, 15, None,
                                "Database ok, importing data ...")
                prepare_rc = self._prepare_import_from_filemaker(fm,
                                                                 callback_progress=self.interruptable_callback_progress)
                if not prepare_rc:
                    if self.fix_import_errors:
                        logging.warning(f"{self.__class__.__name__}._import_from_filemaker: "
                                        f"_prepare_import_from_filemaker failed. However, because the import is "
                                        f"in repair mode it will proceed.")
                    else:
                        logging.error(f"{self.__class__.__name__}._import_from_filemaker: "
                                      f"_prepare_import_from_filemaker failed.")
                        logging.error(f"{self.__class__.__name__}._import_from_filemaker: "
                                      f"Should this error persist, the step can be skipped. Please contact your admin "
                                      f"who should consult the Q&A on how to surmount certain import issues.")

                    self.x_state_info[self.XSTATE_IMPORT_ERROR] = self.IMPORT_ERROR_FM_PREPARE

                    self.save()

                if prepare_rc or self.fix_import_errors:
                    if self._import_tables_from_filemaker(fm, callback_progress=self.interruptable_callback_progress):
                        if self._import_containerfiles_from_filemaker(fm,
                                                                      callback_progress=
                                                                      self.interruptable_callback_progress):
                            report_progress(self.interruptable_callback_progress, 100, None,
                                            "Database ok, importing data ...")
                            logging.info(("FileMakerWorkstation._import_from_filemaker: "
                                          "import of fm-database %s successful." % fm.opened_filename))
                            rc = True


        except BaseException as e:
            logging.error(f"FileMakerWorkstation._import_from_filemaker: {repr(e)}")

        if not rc:
            logging.error(f"FileMakerWorkstation._import_from_filemaker: "
                          f"statechange to BACK_FROM_FIELD not successful.")
        fm = None
        self.sleep_for_filemaker()
        return rc

    def get_xstate(self, key, default='') -> str:
        try:
            return self.x_state_info[key]
        except:
            pass
        return default

    def _check_fm_database_before_import(self, fm) -> bool:
        rc = True

        if not fm.check_fm_database(check_template_version=False):
            logging.error(f"{self.__class__.__name__}._check_fm_database_before_import:"
                          f"Error checking fm database in Workstation.import_from_filemaker ")
            if self.fix_import_errors:
                logging.error(f"FileMakerWorkstation._check_fm_database_before_import:"
                              f"This error can not be skipped with the import in repair mode.")
            return False

        logging.debug(("FileMakerWorkstation._check_fm_database_before_import: "
                       "opened fm-database %s for import" % fm.opened_filename))

        if str(fm.get_constant("TRANSACTION_STATE")).upper() != "OK":
            logging.error(("FileMakerWorkstation._check_fm_database_before_import:"
                           "Error importing data from a filemaker database that has a TRANSACTION_STATE"
                           "other than 'OK'"))
            if self.fix_import_errors:
                logging.error(f"FileMakerWorkstation._check_fm_database_before_import:"
                              f"This error can not be skipped with the import in repair mode.")
            return False

        logging.debug(("FileMakerWorkstation._check_fm_database_before_import: "
                       "transaction state of fm-database %s is ok." % fm.opened_filename))
        export_device_id = str(fm.get_constant("export_device_id")).upper()
        if export_device_id != self._id.upper():
            logging.error((f"FileMakerWorkstation._check_fm_database_before_import:"
                           f"Error importing data from a filemaker source originally exported to a "
                           f"different workstation ({export_device_id})."))
            if self.fix_import_errors:
                logging.error(f"FileMakerWorkstation._check_fm_database_before_import:"
                              f"This error can not be skipped with the import in repair mode.")

            return False

        if self.debug_fork_sync_time and \
                isinstance(self.debug_fork_sync_time, datetime.datetime):
            fm.set_constant("fork_time", self.debug_fork_sync_time)
            logging.warning(f"TESTMODE: fork time set to {self.debug_fork_sync_time}")

        ws_fork_time = fm.get_ts_constant("fork_time")
        cmp_result = self._compare_imported_fork_time(ws_fork_time)
        if cmp_result != 0:
            if cmp_result == -1:
                # ws_fork_time in the fm database is earlier than the fork time stored with the workstation im kiosk
                if self.fix_import_errors:
                    logging.warning(
                        f"This database cannot be the most recent version. It has been created EARLIER than the"
                        f"most recently prepared version."
                        f"The import will continue because it was started in repair mode.")
                else:
                    logging.error(
                        f"This database cannot be the most recent version. It has been created EARLIER than the"
                        f"most recently prepared version."
                        f"Please check what has been uploaded!")
                self.x_state_info[self.XSTATE_IMPORT_ERROR] = self.IMPORT_ERROR_EARLIER
            else:
                logging.error(f"Although this is the right database it cannot be the most recent version of it. "
                              f"It has been created AFTER the most recently prepared version, which is really weird."
                              f"Please check what has been uploaded!")
                self.x_state_info[self.XSTATE_IMPORT_ERROR] = self.IMPORT_ERROR_LATER
            self.save()

            if not self.fix_import_errors:
                logging.info((f"FileMakerWorkstation._check_fm_database_before_import:"
                              f"Error importing data from a filemaker-Model that does not have the expected "
                              f"comparing fork time {ws_fork_time} and {self.get_fork_time()} lead to {cmp_result}"))
                logging.error(f"If you cannot find a good explanation for what is going on, "
                              f"please consult your admin, who should consult the Q&A on this topic "
                              f"and perhaps get in contact with support.")
                rc = False

        if not self.debug_dont_check_open_state:  # just for testing purposes.
            has_been_opened = fm.get_constant("has_been_opened")
            logging.debug(f"has_been_opened was {has_been_opened}.")
            if has_been_opened:  # compatibility with old versions
                if str(has_been_opened).upper() != "TRUE":
                    if not self.fix_import_errors:
                        logging.error("FileMakerWorkstation._check_fm_database_before_import:"
                                      "The database does not seem to have been opened, ever. You might "
                                      "have uploaded or even worked in the wrong database. Check "
                                      "with filemaker on your device and upload the correct file.")
                        logging.error(f"If you cannot find a good explanation for what is going on, "
                                      f"please consult your admin, who should consult the Q&A on this topic "
                                      f"and perhaps get in contact with support.")
                    else:
                        logging.warning("FileMakerWorkstation._check_fm_database_before_import:"
                                        "The database does not seem to have been opened, ever. You might "
                                        "have uploaded or even worked in the wrong database. However,"
                                        "The import will continue because it is running in repair mode.")
                    self.x_state_info[self.XSTATE_IMPORT_ERROR] = self.IMPORT_ERROR_NOT_OPENED
                    self.save()
                    logging.info(f"has_been_opened is {has_been_opened}.")
                    if not self.fix_import_errors:
                        rc = False
            else:
                logging.warning(
                    "The template file for this project does not have the config key 'has_been_opened'. The "
                    "check cannot be done.")

        if rc:
            logging.info(("FileMakerWorkstation._check_fm_database_before_import: "
                          "workstation database %s can be imported." % fm.opened_filename))
        return rc

    def _prepare_import_from_filemaker(self, fm, callback_progress=None):
        """ calls a preprocessing script in filemaker that prepares the
            tables before they are actually imported.

        .. note:

            does not check whether the workstation is in the appropriate state nor does
            it set the resulting state afterwards! Don't use outside of import_from_filemaker

            todo: in emergency cases this could be skipped. It's operation are rather special and if they
                  fail it is not a disaster
        """
        ok = False
        try:
            logging.debug("FileMakerWorkstation._prepare_import_from_filemaker: "
                          "Calling Filemaker 'PrepareExport'")
            rc = fm.start_fm_script_with_progress("PrepareExport", "prepare_export",
                                                  printdots=bool(callback_progress),
                                                  callback_progress=callback_progress)
            return bool(rc != "")
        except Exception as e:
            logging.info(f"{self.__class__.__name__}._prepare_import_from_filemaker: {repr(e)}")

        return ok

    def _import_tables_from_filemaker(self, fm, callback_progress=None):
        """ imports a workstation's filemaker data back into the shadow tables
            in the master-Model. Requests an open FileMakerControl object.

            returns true or false

        .. note:

            does not check whether the workstation is in the appropriate state nor does
            it set the resulting state afterwards! Don't use outside of import_from_filemaker

            todo: redesign
            todo: refactor
        """

        dsd = self._get_workstation_dsd()
        if dsd is None:
            logging.error(("FileMakerWorkstation._import_tables_from_filemaker: "
                           "KioskSQLDb.get_dsd() failed"))
            return False

        try:
            ws_namespace = ""
            tables = self._get_import_tables(dsd)
            ws_namespace = self._db_namespace
            cur = KioskSQLDb.get_dict_cursor()
            if cur is None:
                logging.error(("FileMakerWorkstation._import_tables_from_filemaker: "
                               "KioskSQLDb.get_cursor() failed"))
                return False
            # tables = dsd.list_tables()
            ok = True
            c_table = 0

            for table in tables.keys():
                c_table += 1
                report_progress(self.interruptable_callback_progress, c_table * 100 / len(tables),
                                "_import_tables_from_filemaker", f"importing {table}")
                dsd_table = tables[table][0]
                dsd_version = tables[table][1]
                ok = self._import_table_from_filemaker(cur, fm, dsd, dsd_table, dsd_version=dsd_version,
                                                       namespace=ws_namespace)
                if not ok:
                    break

            cur.close()
            if ok:
                self.migrate_workstation_tables(dsd)
                KioskSQLDb.commit()
                return True
            else:
                try:
                    KioskSQLDb.rollback()
                    logging.error(("FileMakerWorkstation._import_tables_from_filemaker: "
                                   "rollback (1) ok"))
                except Exception as e:
                    logging.error((f"FileMakerWorkstation._import_tables_from_filemaker: "
                                   f"rollback (1) failed with {repr(e)}"))

                return False

        except Exception as e:
            logging.error(repr(e))
            try:
                KioskSQLDb.rollback()
                logging.error(("FileMakerWorkstation._import_tables_from_filemaker: "
                               "rollback (2) ok"))
            except Exception as e:
                logging.error((f"FileMakerWorkstation._import_tables_from_filemaker: "
                               f"rollback (2) failed with {repr(e)}"))

        cur.close()
        return False

    def _get_import_tables(self, dsd: DataSetDefinition) -> dict:
        """ returns the tables, their dsd names and version of the workstation. If a workstation is not stored
            in a schema, yet, it will be moved to one first.

        :return dict with the tablename as key and a Tuple (dsd-table, version) as value
        """
        db_migration = PostgresDbMigration(dsd, KioskSQLDb.get_con())
        tables = db_migration.get_tables_and_versions(only_prefix=self._id, namespace=self._db_namespace)
        if not tables:
            # this is just for the legacy case that a workstation is not stored in its own namespace. It can go
            # one day
            tables = db_migration.get_tables_and_versions(only_prefix=self._id)
            if tables:
                if not db_migration._adapter_move_tables(self._id, "", self._db_namespace, commit=False):
                    raise Exception(f"Workstation {self._id} "
                                    f"stored outside a namespace. Error when trying to fix the issue.")
                else:
                    for t in ["_fm_image_transfer", "_fm_repldata_transfer"]:
                        db_migration._move_table_to_namespace(self._id + t, "", self._db_namespace)

                tables = db_migration.get_tables_and_versions(only_prefix=self._id, namespace=self._db_namespace)
                # KioskSQLDb.commit()

        if not tables:
            raise Exception(f"Active tables for workstation {self._id} cannot be found.")
        return tables

    def _import_table_from_filemaker(self, cur, fm, dsd: DataSetDefinition, dsd_table_name, dsd_version=0,
                                     namespace=""):
        """ transfers the data from a single table of the filemaker-Model
            back to the workstation's shadow table of the master-Model.

            returns true or false, does not catch exceptions.

        .. Note::

            Records that exist in the shadow table but not anymore
            in the filemaker table are taken to have been deleted. Consequently
            they will be marked using the field repl_deleted in the shadow-table.

            LK: deleted records also get their modification timestamp set 2 seconds forward.

            todo: refactor, it is longish

        """
        ok = False
        dest_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=namespace,
                                                               db_table=self._id + "_" + dsd_table_name)
        sql = f'update {dest_table_name} set "repl_tag"=0'
        cur.execute(sql)
        update_counter = 0
        insert_counter = 0
        import_filter = dsd.get_import_filter(dsd_table_name, "fm12")
        # delete_counter = 0
        fm_cur = fm.select_table_data(dsd, dsd_table_name, version=dsd_version, import_filter=import_filter)
        record_counter = -1
        if not fm_cur:
            logging.error(f"{self.__class__.__name__}._import_table_from_filemaker: "
                          f"select_table_data failed for {dsd_table_name}")
        else:
            ok = True
            fm_rec = fm_cur.fetchone()
            record_counter = 1

            while ok and fm_rec:
                ok = False
                # sql_update = ""
                # sql_insert = ""
                # sql_insert_values = ""
                value_list = []
                uid = fm.getfieldvalue(fm_rec, "uid")
                if uid:
                    sql_update = f'UPDATE {dest_table_name} SET '
                    sql_insert = 'INSERT' + f' INTO {dest_table_name}('
                    sql_insert_values = "VALUES("

                    comma = ""
                    for f in dsd.list_fields(dsd_table_name, version=dsd_version):
                        sql_update = sql_update + comma + '"' + f + '" = %s'
                        value_list.append(fm.getfieldvalue(fm_rec, f))
                        sql_insert = sql_insert + comma + '"' + f + '"'
                        sql_insert_values = sql_insert_values + comma + "%s"
                        comma = ", "

                    sql_update = sql_update + comma + '"repl_tag" = 1'
                    sql_insert = sql_insert + comma + '"repl_tag"'
                    sql_insert_values = sql_insert_values + comma + "1"
                    # comma = ", "

                    sql_update = sql_update + ' where uid=\'' + uid + "\';"
                    sql_insert = sql_insert + ')'
                    sql_insert_values = sql_insert_values + ")"
                    sql_insert = sql_insert + " " + sql_insert_values
                    try:
                        cur.execute(sql_update, value_list)  # attempt to update an existing record
                        if cur.rowcount != 0:
                            ok = True
                            update_counter += 1
                        else:
                            # Update had nothing to do, so the record must have been added since the last fork:
                            cur.execute(sql_insert, value_list)
                            insert_counter += 1
                            ok = True
                    except Exception as e:
                        logging.error(("FileMakerWorkstation._import_table_from_filemaker: "
                                       '_import_table_from_filemaker: Update or insert caused an exception for record ' +
                                       uid + ' in table ' + dsd_table_name + ': ' + repr(e)))

                    if ok:
                        try:
                            fm_rec = fm_cur.fetchone()
                            record_counter += 1
                        except Exception as e:
                            logging.error("FileMakerWorkstation._import_table_from_filemaker: Exception " + repr(e))
                            logging.error(
                                "Exception data: table is " + dsd_table_name + ", uid is " + uid + ". It was record# " +
                                str(record_counter))
                            ok = False
                else:
                    logging.error(("FileMakerWorkstation._import_table_from_filemaker: "
                                   '_import_table_from_filemaker: Filemaker returned a record in table ' +
                                   dsd_table_name + ' with an empty UID'))
                    ok = False

        if ok:
            logging.debug(f"{self.__class__.__name__}._import_table_from_filemaker: "
                          f"{record_counter} records imported from filemaker")

            delete_counter = 0
            if self.fix_import_errors:
                sql = f'select ' + f'count(*) c from {dest_table_name} where "repl_tag"=0'
                r = KioskSQLDb.get_first_record_from_sql(sql)
                if r:
                    delete_counter = r["c"]
            else:
                # sql = f'update ' + f' {dest_table_name} set "repl_deleted"=true,"modified"=%s where "repl_tag"=0'
                sql = f'update ' + f' {dest_table_name} set "repl_deleted"=true,' \
                                   f'"modified"="modified" + (interval \'2 seconds\') where "repl_tag"=0'
                cur.execute(sql, [self.get_fork_time()])
                delete_counter = cur.rowcount

            log_s = "_import_table_from_filemaker. Table " + dsd_table_name + ": " + str(
                update_counter) + " records updated, "
            log_s = log_s + str(insert_counter) + " records inserted, "
            if self.fix_import_errors and delete_counter > 0:
                logging.warning(f" {delete_counter} records in {dsd_table_name} would have been deleted, "
                                f"but were not because of the import running in repair mode.")
            else:
                log_s = log_s + str(delete_counter) + " records deleted."
            logging.info(log_s)
        try:
            fm_cur.close()
        except Exception as e:
            pass
        return ok

    def _import_containerfiles_from_filemaker(self, fm, callback_progress=None):
        """ asks filemaker to spit out all the images that have been modified since the fork
            of the workstation data.
            returns true or false

        .. note:

            does not check whether the workstation is in the appropriate state nor does
            it set the resulting state afterwards! Don't use outside of import_from_filemaker

            todo: redesign
            todo: refactor

        """
        ok = False
        try:
            ok = fm.export_container_images(self, True, callback_progress)
        except Exception as e:
            logging.error("FileMakerWorkstation._import_containerfiles_from_filemaker: " + repr(e))

        return ok

    def ready_for_synchronization(self):
        """
            signals to the synchronization process whether this workstation is ready for synchronization
            If this returns false the synchronization process will issue a warning that can be skipped.

            :returns true/false

        """
        return self.state_machine.get_state() in [self.IDLE, self.BACK_FROM_FIELD]

    def needs_synchronization(self):
        """
            signals to the synchronization process whether this workstation is in a state that needs synchronization.

            :returns true/false

        """
        return self.ready_for_synchronization() and self.state_machine.get_state() in [self.BACK_FROM_FIELD]

    def on_synchronized(self, commit=True):
        """
            triggered from outside as soon as the synchronization process was successful.
            The workstation turns its internal state to "IDLE" and whatever else is necessary.
            :param commit: optional. Set to False if the database changes are part of a larger transition.
            :return: True/False
        """
        try:
            return self.transition("SYNCHRONIZE", commit)

        except Exception as e:
            logging.error("FileMakerWorkstation.on_synchronized: Exception " + repr(e))

        return False

    def reset(self):
        """
        resets the workstation to state IDLE
        :return: result of _set_state, which is true or false.
        todo: refactor - That might be more useful as an abstract method in Workstation.
        """
        return self._set_state(self.IDLE, commit=True)

    def _create_export_file_from_template(self, template_file):
        """ creates a new filemaker database file for a workstation from the given template file.
            The database file will be created in the configured filemaker_export_dir/id under the
            configured filemaker_db_filename. All directories will be created and
            if the destination file already exists, it will be eliminated first.
        """
        if not os.path.isfile(template_file):
            logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                          f"{template_file} does not seem to exist or is not a file.")
            return False

        # create the whole directory structure for the workstation at once although here we just need the export dir
        files_dir = self.get_and_init_files_dir(direction="export", init=True)
        if not os.path.isdir(files_dir):
            logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                          f"files dir {files_dir} does not seem to exist or is not a folder/directory.")
            return False

        dest_dir = SyncConfig.get_config().filemaker_export_dir
        dest_dir = path.join(dest_dir, self.get_id())
        if not os.path.isdir(dest_dir):
            try:
                os.mkdir(dest_dir)
            except Exception as e:
                logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                              f"cannot create directory {dest_dir}: {repr(e)}")
                return False

        dest_file = os.path.join(dest_dir, SyncConfig.get_config().filemaker_db_filename)
        if path.isfile(dest_file):
            try:
                os.remove(dest_file)
            except Exception as e:
                logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                              f"cannot export data to {dest_file} because the file is open in "
                              f"another application or something like that: {repr(e)}")
                return False
        try:
            shutil.copyfile(template_file, dest_file)
            source_size = os.path.getsize(template_file)
            dest_size = os.path.getsize(dest_file)
            if source_size != dest_size:
                logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                              f"{template_file} has {source_size} bytes <> {dest_size} bytes of {dest_file}")
                return False
            else:
                logging.debug(f"{self.__class__.__name__}._create_export_file_from_template: "
                              f"{template_file} has {source_size} bytes == {dest_size} bytes of {dest_file}")
                logging.debug(f"{self.__class__.__name__}._create_export_file_from_template: "
                              f"copied {template_file} to {dest_file}")
            return os.path.isfile(dest_file)
        except Exception as e:
            logging.error(f"{self.__class__.__name__}._create_export_file_from_template: "
                          f"cannot copy {template_file} to {dest_file} "
                          f"because: {repr(e)}")

        return False

    def upload_file(self, file: datastructures.FileStorage) -> bool:
        """
        todo: refactor. This is a method that does not belong in filemakerworkstation. At least
              not using datastructures.FileStorage, which is a werkzeug class.
        :param file:
        :return:
        """
        try:
            fm_filename = self.get_import_path_and_filename()
            if fm_filename:
                file.save(fm_filename)
                logging.info(f"{self.__class__.__name__}.upload_file: "
                             f"Stored uploaded file " + fm_filename + " for workstation " + self.get_id())
                return True
            else:
                logging.error(f"{self.__class__.__name__}.upload_file: "
                              f"destination filename could not be acquired for workstation " + self.get_id())
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.upload_file: {repr(e)}")

        return False

    def _get_workstation_dsd(self) -> DataSetDefinition:
        """
        returns a view on the master dsd for this workstation
        :return: a DataSetDefinition
        """
        dsd = Dsd3Singleton.get_dsd3()
        dsd_workstation_view = DSDView(dsd)
        dsd_workstation_view.apply_view_instructions({"config":
                                                          {"format_ver": 3},
                                                      "tables": ["include_tables_with_instruction('replfield_uuid')",
                                                                 "include_tables_with_flag('filemaker_recording')",
                                                                 "exclude_field('images', 'filename')",
                                                                 "exclude_field('images', 'md5_hash')",
                                                                 "exclude_field('images', 'image_attributes')"
                                                                 ]})
        return dsd_workstation_view.dsd

    def _build_file_identifier_cache_necessary(self):
        """
        checks if the current fork sync time of the filemaker database is different from the fork sync time in the
        kiosk database. If so, the image identifier cache needs to be recreated.
        :return:
        """
        fork_sync_time = self.get_fork_sync_time()
        logging.debug(f"{self.__class__.__name__}._build_file_identifier_cache_necessary: "
                      f"{self.ws_fork_sync_time} !=? {fork_sync_time}")
        if fork_sync_time and self.ws_fork_sync_time:
            return self.ws_fork_sync_time != fork_sync_time
        else:
            return True

    # @classmethod
    # def list_workstations(cls):
    #     """
    #     returns the ids of all workstations.
    #
    #     This lists the workstations of THIS type! Other workstation types might
    #     store their workstation information somewhere else. That is why it is a
    #     class method. For clarity it could move to FileMakerWorkstation but that could easily
    #     lead to duplicate code.
    #
    #     :return: List of workstation-ids (which are simple strings)
    #
    #     """
    #     cur = KioskSQLDb.get_dict_cursor()
    #     try:
    #         result_list = []
    #         if cur:
    #             sql = "select " + """repl_workstation.id from repl_workstation
    #                   where repl_workstation.workstation_type = %s
    #                   order by repl_workstation.description;"""
    #             cur.execute(sql, [cls.get_workstation_type()])
    #             for r in cur:
    #                 result_list.append(r["id"])
    #             return result_list
    #         else:
    #             logging.error(f"{cls.__name__}.list_workstations: KioskSQLDb.get_cursor() failed.")
    #     except Exception as e:
    #         logging.error(f"{cls.__name__}.list_workstations: Exception occured: {repr(e)}")
    #
    #     return []

    def _on_synchronized(self) -> bool:
        try:
            self.set_download_upload_status(self.NOT_SET, False)
            if self.XSTATE_IMPORT_ERROR in self.x_state_info:
                self.x_state_info.pop(self.XSTATE_IMPORT_ERROR)
                self._on_update_workstation(cur=None)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._on_synchronized: {repr(e)}")
        return True

    @classmethod
    def reset_template(cls, recording_group):
        """
        deletes the template for a recording group.
        :param recording_group: the recording group
        :except: raises Exceptions if something goes wrong. If the template file for the recording
        """
        try:
            template_file = cls.get_template_filepath_and_name(recording_group, create=False)
            logging.debug(f"Trying to reset template {template_file}")
            if os.path.isfile(template_file):
                kioskstdlib.delete_files([template_file], True)
        except BaseException as e:
            logging.error(f"{cls.__name__}.reset_template: {repr(e)}")
            raise e
