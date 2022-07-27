import logging
import os.path
import pprint
from typing import List, Dict, Callable

from eventmanager import EventManager
from typerepository import TypeRepository

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from .fileexportdriver import FileExportDriver
from .fileexportlib import FileExportError
from .fileexporttarget import FileExportTarget
from .fileexporttargettest import FileExportTargetTest
from .fileexporttargetzip import FileExportTargetZip
from filerepository import FileRepository
from kioskabstractclasses import PluginLoader
from orm.dsdtable import DSDTable
from sync_config import SyncConfig
from sync_constants import UserCancelledError
from syncrepositorytypes import TYPE_FILEEXPORTDRIVER


class FileExport:
    def __init__(self, conf: SyncConfig, event_manager: EventManager = None,
                 type_repository: TypeRepository = None,
                 plugin_loader: PluginLoader = None):
        self.conf: SyncConfig = conf
        self._master_dsd: DataSetDefinition = Dsd3Singleton.get_dsd3()
        self._event_manager: EventManager = event_manager
        self._type_repository: TypeRepository = type_repository
        self._plugin_loader: PluginLoader = plugin_loader
        self._load_file_export_plugins()
        self.include_files = ""
        self._file_repository = self.conf.get_file_repository()
        self._file_resolver = None
        self._filename_resolver = None
        self._file_repos = None
        self._export_target = FileExportTargetZip(self.conf)
        self._callback_progress = None

        dsd_view_file = kioskstdlib.try_get_dict_entry(self.conf["fileexportworkstation"], "file_export_dsd_view", "")
        if dsd_view_file:
            dsd_view_file = self.conf.resolve_symbols(dsd_view_file)
            dsd_view = DSDView(self._master_dsd)
            if dsd_view.apply_view_instructions(DSDYamlLoader().read_view_file(dsd_view_file)):
                self._dsd_view_dsd: DataSetDefinition = dsd_view.dsd
            else:
                raise FileExportError(f"Configured DSDView {dsd_view_file} could not be applied.")
        else:
            self._dsd_view_dsd: DataSetDefinition = self._master_dsd

    def register_file_resolver(self, func: Callable[[str, FileRepository], str]):
        """
        registers a function or method that returns the path and filename of a file to export as respresentative
        of the file in the file repository registered under the given uid.
        :param func: a method that gets the parameter "uid"
                     and returns either the absolute path to the file to use
                     or "" if no file should be exported
                     (usually because a dummy is supposed to be used according to file picking)
        """
        self._file_resolver = func

    def _interruptable_callback_progress(self, *args, **kwargs):
        if self._callback_progress and not self._callback_progress(*args, **kwargs):
            raise UserCancelledError

    def register_filename_resolver(self, func: Callable):
        """
        registers a function or method that determines the destination filename for the export. If no such
        resolver is registered the source-file's name will be used.
        Note that the returned filename must be without extension!

        :param func: a method that gets the parameter "uid" and a reference to an initialized file repository.
                     It returns either a filename (without path and extension!)
                     or "" if the source file's name should be used.
        """
        self._filename_resolver = func

    def use_dsd_view(self, dsd_view: DSDView):
        self._dsd_view_dsd = dsd_view.dsd

    def _load_file_export_plugins(self):
        try:
            plugins_to_load = self.conf["fileexportworkstation"]["plugins"]
            if not self._plugin_loader.load_plugins(plugins_to_load=plugins_to_load):
                raise FileExportError("An error occured when loading plugins")
        except FileExportError as e:
            logging.error(f"{self.__class__.__name__}._load_file_export_plugins: {repr(e)}")
            raise e
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._load_file_export_plugins: {repr(e)}")
            raise FileExportError(repr(e))

    def get_drivers(self) -> Dict[str, FileExportDriver]:
        """
        returns a dictionary with instances of available file export drivers
        :return: dict[driver-id, FileExportDriver]
        """
        types = self._type_repository.list_types(TYPE_FILEEXPORTDRIVER)
        instances = {}
        for type_id in types:
            driver: FileExportDriver = self._type_repository.create_type(TYPE_FILEEXPORTDRIVER, type_id, self.conf)
            instances[driver.driver_id] = driver

        return instances

    def get_file_export_targets(self) -> Dict[str, FileExportTarget]:
        """
        returns a dictionary with instances of available FileExportTargets
        :return: dict[target-id, FileExportTarget]
        """
        targets = {"FileExportTargetZip": FileExportTargetZip(self.conf),
                   "FileExportTargetTest": FileExportTargetTest(self.conf),
                   }
        return targets

    def get_export_tables(self) -> str:
        tables = set(self._dsd_view_dsd.list_tables())
        for table in tables:
            yield table

    def export(self, driver: FileExportDriver, target: FileExportTarget, callback_progress: Callable = None) -> bool:

        """

        :param driver: a instantiated and initialized FileExportDriver
        :param target: a instantiated and initialized FileExportTarget
        :param callback_progress: a method taking these parameters:
                                  progress: float, message: str

        :return: boolean, throws no exceptions
        """
        try:
            self._file_repos = None
            self._callback_progress = callback_progress
            self._interruptable_callback_progress(0, "Starting file export")
            driver.start_export(target=target)
            self._export_target = target
            target.start_export()
            c_tables = 0
            tables = list(self.get_export_tables())
            max_tables = len(tables)
            percentage = 0
            for t in tables:
                c_tables += 1
                self._interruptable_callback_progress(percentage * 0.75,
                                                      f"exporting {t}")

                if t == self._dsd_view_dsd.files_table and self.include_files:
                    self._export_files_table(t, driver, target, percentage)
                    percentage += 50
                else:
                    self._export_table(t, driver)
                    percentage += (100 / max_tables / (2 if self.include_files else 1))

            if c_tables == 0:
                raise FileExportError("No data has been exported because no table was selected.")

            try:
                def target_callback(progress, message):
                    if self._callback_progress:
                        return self._callback_progress(75 + progress * 0.25, message)
                    else:
                        return True

                target.store(target_callback)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.export: Exception in target.store: {repr(e)}")
                raise FileExportError(f"Exception in target.store: {repr(e)}")

            driver.end_export(success=True)
            target.end_export(success=True)
            self._interruptable_callback_progress(100, "File export finished")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.export: File export failed due to {repr(e)}")
            driver.end_export(success=False)
            target.end_export(success=False)

        return False

    def _export_table(self, table: str, driver: FileExportDriver):
        try:
            dsdtable = DSDTable(self._dsd_view_dsd, table)
            driver.new_table(self._dsd_view_dsd, table)
            errors = 0
            for r in dsdtable.get_many():
                try:
                    driver.export_record(r)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}._export_table: {repr(e)} in row:")
                    logging.debug(f"{pprint.pformat(r)}")
                    errors += 1
                    if errors > 10:
                        raise Exception(f"Too many errors in this table.")

            driver.close_table(success=True)
        except BaseException as e:
            driver.close_table(success=False)
            logging.error(
                f"{self.__class__.__name__}._export_table: Export of table {table} failed due to exception {repr(e)}")
            raise FileExportError(repr(e))

    def _export_files_table(self, table: str, driver: FileExportDriver, target: FileExportTarget, start_percentage):
        try:
            dsdtable = DSDTable(self._dsd_view_dsd, table)
            driver.new_table(self._dsd_view_dsd, table, ["exported_filename"])
            files_table = self._dsd_view_dsd.files_table
            if not files_table:
                raise FileExportError("_export_files_table: No files table available in dsd")

            file_uid_field = self._dsd_view_dsd.get_fields_with_instruction(files_table, "file_for")
            if len(file_uid_field) != 1:
                raise FileExportError(f"_export_files_table: No or too many file_for() instructions in "
                                      f"files table {files_table}.")

            file_uid_field = file_uid_field[0]
            c_files = dsdtable.count()
            c_file = 0
            for r in dsdtable.get_many():
                c_file += 1
                self._interruptable_callback_progress(start_percentage + (c_file * 100 / c_files) * 0.25,
                                                      f"exporting file {c_file}/{c_files}")
                uid_file = getattr(r, file_uid_field)
                source_file = self._get_source_file(uid_file, getattr(r, self._dsd_view_dsd.files_table_filename_field))
                if source_file:
                    if not os.path.isfile(source_file):
                        source_file = ""

                if source_file:
                    dest_filename = self._get_dest_file_name(uid_file, kioskstdlib.get_filename(source_file))
                    dest_filename = self._export_target.get_new_filename(dest_filename)
                else:
                    dest_filename = ""

                driver.export_record(r, [dest_filename])
                if source_file:
                    target.add_file(source_file, dest_filename)

            driver.close_table(success=True)
        except BaseException as e:
            driver.close_table(success=False)
            logging.error(
                f"{self.__class__.__name__}._export_table: Export of table {table} failed due to exception {repr(e)}")
            raise FileExportError(repr(e))

    def _get_source_file(self, uid_file: str, default_file_name: str) -> str:
        if self._file_resolver:
            return self._file_resolver(uid_file)
        else:
            return FileRepository.get_repository_filename_in_sub_dir(self._file_repository,
                                                                     uid_filename=default_file_name)

    def _get_dest_file_name(self, uid_file: str, filename: str) -> str:
        if self._filename_resolver:
            if not self._file_repos:
                self._file_repos = FileRepository(self.conf, self._event_manager,
                                                  self._type_repository, self._plugin_loader)
            rc = self._filename_resolver(uid_file, self._file_repos)
            if rc:
                return kioskstdlib.get_valid_filename(".".join([rc, kioskstdlib.get_file_extension(filename)]))

        return filename
