import logging
from typing import Callable, Optional

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from sync_constants import UserCancelledError
from typerepository import TypeRepository
import syncrepositorytypes
from dsd.dsd3 import DataSetDefinition
from .fileexportlib import FileExportError
from .fileexporttarget import FileExportTarget
from sync_config import SyncConfig
from filerepository import FileRepository


class FileExportDriver:
    def __init__(self, config, file_repository):
        self._driver_id = self.__class__.__name__
        self._config: SyncConfig = config
        self._master_dsd: DataSetDefinition = Dsd3Singleton.get_dsd3()
        self._name = ""
        self._filename = ""
        self._description = ""
        self._load_driver()
        self._target: Optional[FileExportTarget] = None
        self._callback_progress = None
        self.include_files = ""
        self._file_resolver = None
        self._filename_resolver = None
        self._file_repository = file_repository

        dsd_view_file = ""
        driver_name = self.__class__.__name__.lower()
        if self._config.has_key(driver_name):
            dsd_view_file = kioskstdlib.try_get_dict_entry(self._config[driver_name], "file_export_dsd_view", "")
        else:
            logging.info(f"No file_export_dsd_view configured for file export driver {driver_name}")
        if not dsd_view_file:
            if self._config.has_key("fileexportworkstation"):
                dsd_view_file = kioskstdlib.try_get_dict_entry(self._config["fileexportworkstation"], "file_export_dsd_view", "")
            else:
                logging.debug(f"{self.__class__.__name__}.__init__: No file_export_dsd_view "
                              f"configured for 'fileexportworkstation'")
        if dsd_view_file:
            dsd_view_file = self._config.resolve_symbols(dsd_view_file)
            logging.debug(f"{self.__class__.__name__}.__init__: using dsd view file {dsd_view_file}")
            try:
                dsd_view = DSDView(self._master_dsd)
                if dsd_view.apply_view_instructions(DSDYamlLoader().read_view_file(dsd_view_file)):
                    self._dsd_view_dsd: DataSetDefinition = dsd_view.dsd
                else:
                    raise FileExportError(f"Configured DSDView {dsd_view_file} could not be applied.")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.__init__: {repr(e)}")
                raise FileExportError(f"Could not initialize FileExportDriver {driver_name}")
        else:
            self._dsd_view_dsd: DataSetDefinition = self._master_dsd

    @property
    def filename(self):
        return self._filename

    def _load_driver(self):
        raise NotImplementedError()

    @property
    def filename_resolver(self):
        return self._filename_resolver

    @filename_resolver.setter
    def filename_resolver(self, value: Callable):
        self._filename_resolver = value

    @property
    def file_resolver(self):
        return self._file_resolver

    @file_resolver.setter
    def file_resolver(self, value: Callable):
        self._file_resolver = value

    @property
    def file_repository(self):
        return self._file_repository

    @file_repository.setter
    def file_repository(self, value):
        self._file_repository = value

    @classmethod
    def register(cls, type_repository: TypeRepository):
        type_repository.register_type(syncrepositorytypes.TYPE_FILEEXPORTDRIVER, cls.__name__, cls)

    @property
    def driver_id(self):
        return self._driver_id

    @property
    def name(self):
        return self._name

    @property
    def description(self):
        return self._description

    @property
    def is_open(self):
        raise NotImplementedError

    @property
    def callback_progress(self):
        return self._callback_progress

    @callback_progress.setter
    def callback_progress(self, callback: Callable):
        self._callback_progress = callback

    def _interruptable_callback_progress(self, *args, **kwargs):
        if self._callback_progress and not self._callback_progress(*args, **kwargs):
            logging.info(self._callback_progress)
            raise UserCancelledError

    def use_dsd_view(self, dsd_view: DSDView):
        self._dsd_view_dsd = dsd_view.dsd

    def _get_source_file(self, uid_file: str, default_file_name: str) -> str:
        if self._file_resolver:
            return self._file_resolver(uid_file)
        else:
            return FileRepository.get_repository_filename_in_sub_dir(self._file_repository.repository_path,
                                                                     uid_filename=default_file_name)


    def _get_dest_file_name(self, uid_file: str, filename: str) -> str:
        if self._filename_resolver:
            if not self._file_repository:
                logging.error(f"{self.__class__.__name__}._get_dest_file_name: No file repository set.")
            rc = self._filename_resolver(uid_file, self._file_repository)
            if rc:
                return kioskstdlib.get_valid_filename(".".join([rc, kioskstdlib.get_file_extension(filename)]))

        return filename

    def get_filename_renderings(self):
        return [("uid", "use unique id as filename"), ("descriptive", "render descriptive filenames")]

    def start_export(self, target: FileExportTarget) -> bool:
        self._target = target
        return self.export()

    def export(self) -> bool:
        raise NotImplementedError

    def end_export(self, success: bool):
        logging.info(f"{self.__class__.__name__}.export: Ending File Export "
                     f"{'successfully' if success else 'unsuccessfully'}.")
        pass
