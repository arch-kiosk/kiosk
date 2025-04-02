from typerepository import TypeRepository
import syncrepositorytypes
from dsd.dsd3 import DataSetDefinition
from .fileexporttarget import FileExportTarget
from sync_config import SyncConfig


class FileExportDriver:
    def __init__(self, config):
        self._driver_id = self.__class__.__name__
        self._config: SyncConfig = config
        self._name = ""
        self._filename = ""
        self._description = ""
        self._load_driver()
        self._target = None

    @property
    def filename(self):
        return self._filename

    def _load_driver(self):
        raise NotImplementedError()

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

    def start_export(self, target: FileExportTarget):
        self._target = target

    def end_export(self, success: bool):
        pass

    def new_table(self, dsd: DataSetDefinition, tablename: str, extra_columns=[]):
        pass

    def export_record(self, r: dict, extra_values=[]):
        raise NotImplementedError()

    def close_table(self, success: bool):
        pass
