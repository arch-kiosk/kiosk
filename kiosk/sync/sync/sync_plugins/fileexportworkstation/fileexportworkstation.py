import logging

from statemachine import StateTransition
from werkzeug import datastructures

import kioskstdlib
from core.recordingworkstation import RecordingWorkstation
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from filerepository import FileRepository
from .fileexport import FileExport
from sync_config import SyncConfig
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

FILES_TABLE_NAME = "images"


class FileExportWorkstation(RecordingWorkstation):

    def __init__(self, workstation_id, description="", sync=None, *args, **kwargs):
        self._no_transfer_necessary = []
        self.repldata_records = {}
        self.ws_fork_sync_time = None
        self.include_files = False
        self.export_file_format: str = ""
        self.filename_rendering: str = ""
        self.output_topic: str = "file_export"
        self._export_file_dict = {}

        super().__init__(workstation_id, description, sync=sync, *args, **kwargs)

    def partakes_in_synchronization(self):
        return False

    @classmethod
    def get_workstation_type(cls) -> str:
        return "fileexportworkstation"

    @classmethod
    def register_states(cls):
        super().register_states()
        # cls.STATE_NAME.update(
        #     {2: cls.IN_THE_FIELD,
        #      })

    def init_state_machine(self):
        """
            todo: document
        """

        super().init_state_machine()

        self.state_machine.add_transition(self.READY_FOR_EXPORT,
                                          StateTransition("EXPORT", self.IDLE, None, self.export))
        # self.state_machine.add_transition(self.IN_THE_FIELD,
        #                                   StateTransition("EXPORT_TO_FILEMAKER", self.IN_THE_FIELD, None, self.export))
        # self.state_machine.add_transition(self.IN_THE_FIELD,
        #                                   StateTransition("IMPORT_FROM_FILEMAKER", self.BACK_FROM_FIELD, None,
        #                                                   self.import_workstation))
        # self.state_machine.add_transition(self.BACK_FROM_FIELD,
        #                                   StateTransition("IMPORT_FROM_FILEMAKER", self.BACK_FROM_FIELD, None,
        #                                                   self.import_workstation))

    def _on_create_workstation(self, cur):
        """
        creates repl_workstation_export, which is specific to the export workstation.
        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """
        super()._on_create_workstation(cur)

        sql = f"INSERT INTO " + f"{KioskSQLDb.sql_safe_ident('repl_workstation_file_export')}" \
                                f"({KioskSQLDb.sql_safe_ident('id')}," \
                                f" {KioskSQLDb.sql_safe_ident('include_files')}," \
                                f" {KioskSQLDb.sql_safe_ident('export_file_format')}," \
                                f" {KioskSQLDb.sql_safe_ident('filename_rendering')})" \
                                f" VALUES(%s,%s,%s,%s)"

        cur.execute(sql, [self._id, self.include_files, self.export_file_format, self.filename_rendering])

    def _on_load(self):
        r = KioskSQLDb.get_first_record("repl_workstation_file_export", "id", self._id, )
        if r:
            self.include_files = r["include_files"]
            self.export_file_format = r["export_file_format"]
            self.filename_rendering = r["filename_rendering"]

    def _on_update_workstation(self, cur):
        close_cur = False
        try:
            if not cur:
                cur = KioskSQLDb.get_dict_cursor()
                close_cur = True

            cur.execute("update " +
                        f"repl_workstation_file_export set"
                        f" {KioskSQLDb.sql_safe_ident('include_files')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('export_file_format')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('filename_rendering')}=%s"
                        f" where id=%s", [self.include_files,
                                          self.export_file_format,
                                          self.filename_rendering if self.filename_rendering else "",
                                          self._id])
            logging.debug(f"{self.__class__.__name__}._on_update_workstation successful: sql was {cur.query}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._on_update_workstation : {repr(e)}")
            logging.error(f"{self.__class__.__name__}._on_update_workstation : sql was {cur.query}")
        finally:
            if close_cur:
                try:
                    cur.close()
                except BaseException as e:
                    pass

    def _on_delete_workstation(self, cur, migration):
        logging.debug("removing record in repl_workstation_file_export for " + self._id)
        cur.execute("delete " + "from repl_workstation_file_export where id=%s", [self._id])

    def get_and_init_files_dir(self, direction="import", init=True):
        """ returns the path to the workstation's files-directory. Depending on the
            parameter direction it is either the "import" or the "export" directory.\n

            :param direction: optional. "import" (default value) or "export" depending on
                    which directory is requested.
            :param init: optional. If set to False missing directories will NOT be created.
            :return: "" or the path of the requested directory.
                     If the directory does not exist, it will be created.

                     The directories will not be emptied if they exist!

        """
        return ""

    def on_synchronized(self):
        pass

    def upload_file(self, file: datastructures.FileStorage) -> bool:
        pass

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

    def export(self):
        """
        handles the actual file export
        :return: True/False
        :raises: All kinds of exceptions
        """
        logging.debug(f"{self.__class__.__name__}.export: fileexportworkstation.export started.")
        rc = False

        config = SyncConfig.get_config()
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)

        driver = file_export.get_drivers()[self.export_file_format]
        target = file_export.get_file_export_targets()["FileExportTargetZip"]
        target.set_export_name(self.get_description())

        if self.include_files:
            self._load_file_transfer_files()
            if len(self._export_file_dict) == 0:
                logging.error(
                    f"{self.__class__.__name__}.export: no file picking rules of type 'FileExportWorkstation' "
                    f"for recording group '{self.recording_group}' found "
                    f"OR the given file picking rules would omit all files.")
                return False
            size = 0
            export_max_repository_size = 100
            try:
                export_max_repository_size = int(
                    self.get_config_value("max_export_repo_mbytes", str(export_max_repository_size)))
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.export: max_export_repo_mbytes not configured {repr(e)}")

            for file in self._export_file_dict.values():
                if file:
                    size += kioskstdlib.get_file_size(file) / 1024 / 1024
                    if size > export_max_repository_size:
                        logging.error(
                            f"{self.__class__.__name__}.export: the total size of all the files "
                            f"to export exceeds {export_max_repository_size} MBytes "
                            f"for recording group {self.recording_group}. ")
                        return False
            logging.info(f"{self.__class__.__name__}.export: total size of files is {size} MBytes")

            file_export.register_file_resolver(self._resolve_file_request)
            if self.filename_rendering == "descriptive":
                file_export.register_filename_resolver(self._resolve_filename)

        file_export.include_files = self.include_files

        rc = file_export.export(driver=driver, target=target, callback_progress=self.callback_progress)
        logging.debug(f"{self.__class__.__name__}.export: fileexportworkstation.export finished with {rc}")
        return rc

    def _load_file_transfer_files(self):
        """
        loads all files from the _fm_image_transfer table
        (which is the result of forking and hence file picking) into the _export_file_dict, which
        stores the actual file path and name per file-uid.
        """
        file_transfer_files = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                   db_table=f"{self.get_id()}"
                                                                            f"_fm_image_transfer")
        sql = "select "
        sql += f"{KioskSQLDb.sql_safe_ident('uid_file')}, " \
               f"{KioskSQLDb.sql_safe_ident('filepath_and_name')} " \
               f"from {file_transfer_files} where not {KioskSQLDb.sql_safe_ident('disabled')}"
        cur = KioskSQLDb.execute_return_cursor(sql)
        self._export_file_dict.clear()
        try:
            r = cur.fetchone()
            while r:
                if r["filepath_and_name"] and r["filepath_and_name"].lower() != "dummy":
                    self._export_file_dict[r["uid_file"]] = r["filepath_and_name"]
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._load_file_transfer_files: {repr(e)}")
            raise e
        finally:
            cur.close()

    def _resolve_file_request(self, uid: str):
        """
        returns the source file to use on the basis of the results of fork and file picking
        :param uid:
        :return: Bool
        """
        try:
            return self._export_file_dict[uid]
        except BaseException as e:
            pass
        return ""

    def _resolve_filename(self, uid: str, file_repos: FileRepository) -> str:
        """
        returns the descriptive filename that is also returned by the file repository when downloading a file.
        :param uid:
        :return: the filename without file extension or "" if the default filename should be used.
        """
        filename = ""
        try:
            ctx_file = file_repos.get_contextual_file(uid)
            filename = ctx_file.get_descriptive_filename()
        except BaseException as e:
            filename = ""

        logging.debug(f"{self.__class__.__name__}._resolve_filename: {uid} gets filename {filename}")
        return kioskstdlib.get_filename_without_extension(filename)
