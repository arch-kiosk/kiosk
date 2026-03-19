from __future__ import annotations  # Must be line 1

import logging
from typing import Dict, Callable, TYPE_CHECKING

from eventmanager import EventManager
from filerepository import FileRepository
from kioskabstractclasses import PluginLoader
from sync_config import SyncConfig
from sync_constants import UserCancelledError
from syncrepositorytypes import TYPE_FILEEXPORTDRIVER
from typerepository import TypeRepository
from .fileexportlib import FileExportError
from .fileexporttarget import FileExportTarget
from .fileexporttargettest import FileExportTargetTest
from .fileexporttargetzip import FileExportTargetZip

if TYPE_CHECKING:
    from .fileexportdriver import FileExportDriver

class FileExport:
    def __init__(self, conf: SyncConfig, event_manager: EventManager = None,
                 type_repository: TypeRepository = None,
                 plugin_loader: PluginLoader = None):
        self.conf: SyncConfig = conf
        self._event_manager: EventManager = event_manager
        self._type_repository: TypeRepository = type_repository
        self._plugin_loader: PluginLoader = plugin_loader
        self._load_file_export_plugins()
        self.include_files = ""
        self._file_repository = FileRepository(self.conf,
                                               self._event_manager,
                                               self._type_repository,
                                               self._plugin_loader)

        self._file_resolver = None
        self._filename_resolver = None
        self._export_target = None
        self._callback_progress = None


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
            driver: FileExportDriver = self._type_repository.create_type(TYPE_FILEEXPORTDRIVER, type_id,
                                                                         self.conf,
                                                                         self._file_repository)
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

    def export(self, driver: FileExportDriver, target: FileExportTarget, callback_progress: Callable = None) -> bool:
        try:
            # self._file_repository_path = None
            self._callback_progress = callback_progress
            self._interruptable_callback_progress(0, "Starting file export")
            self._export_target = target
            driver.include_files = self.include_files
            driver.file_resolver = self._file_resolver
            driver.filename_resolver = self._filename_resolver
            driver.file_repository = self._file_repository
            driver.callback_progress = callback_progress
            if not driver.start_export(self._export_target):
                raise FileExportError("Driver reported failure.")
            driver.end_export(success=True)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.export: File export failed due to {repr(e)}")
            driver.end_export(success=False)
        return False

    # def old_export(self, driver: FileExportDriver, target: FileExportTarget, callback_progress: Callable = None) -> bool:
    #
    #     """
    #
    #     :param driver: a instantiated and initialized FileExportDriver
    #     :param target: a instantiated and initialized FileExportTarget
    #     :param callback_progress: a method taking these parameters:
    #                               progress: float, message: str
    #
    #     :return: boolean, throws no exceptions
    #     """
    #     try:
    #         # self._file_repos = None
    #         self._callback_progress = callback_progress
    #         self._interruptable_callback_progress(0, "Starting file export")
    #         self._export_target = target
    #         driver.start_export(target=target)
    #         target.start_export()
    #         c_tables = 0
    #         tables = list(self.get_export_tables())
    #         max_tables = len(tables)
    #         percentage = 0
    #         for t in tables:
    #             c_tables += 1
    #             self._interruptable_callback_progress(percentage * 0.75,
    #                                                   f"exporting {t}")
    #
    #             if t == self._dsd_view_dsd.files_table and self.include_files:
    #                 self._export_files_table(t, driver, target, percentage)
    #                 percentage += 50
    #             else:
    #                 self._export_table(t, driver)
    #                 percentage += (100 / max_tables / (2 if self.include_files else 1))
    #
    #         if c_tables == 0:
    #             raise FileExportError("No data has been exported because no table was selected.")
    #         driver.end_export(success=True)
    #
    #         try:
    #             def target_callback(progress, message):
    #                 if self._callback_progress:
    #                     return self._callback_progress(75 + progress * 0.25, message)
    #                 else:
    #                     return True
    #
    #             target.store(target_callback)
    #         except BaseException as e:
    #             logging.error(f"{self.__class__.__name__}.export: Exception in target.store: {repr(e)}")
    #             raise FileExportError(f"Exception in target.store: {repr(e)}")
    #
    #         target.end_export(success=True)
    #         self._interruptable_callback_progress(100, "File export finished")
    #         return True
    #     except BaseException as e:
    #         logging.error(f"{self.__class__.__name__}.export: File export failed due to {repr(e)}")
    #         driver.end_export(success=False)
    #         target.end_export(success=False)
    #
    #     return False

