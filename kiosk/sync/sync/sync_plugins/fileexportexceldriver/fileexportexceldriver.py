import json
import logging
import os

from openpyxl import Workbook

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from sync_plugins.fileexportworkstation.fileexportdriver import FileExportDriver
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin


class FileExportExcelDriver(FileExportDriver):

    def __init__(self, config):
        self._working_dir = os.path.join(config.get_temp_dir(), self.__class__.__name__.lower())
        self._filename = ""
        self._workbook = None
        self._worksheet = None
        self._dsd = None
        self._columns = []
        super().__init__(config)

    def _load_driver(self):
        self._name = "XLSX"

        # if "fileexportexceldriver" in self._config.config:
        #     self.delimiter = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "delimiter", self.delimiter)
        #     self.quote = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "quote", self.quote)
        #     self.quote_mode = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "quote_mode",
        #                                                     self.quote_mode)

        self._description = f"Excel XLSX file format: Excel 2010 and higher"

    def start_export(self, target) -> None:
        """
        prepares the export
        :param target: a valid FileExportTarget
        :raises: Exceptions of all sorts
        """
        super().start_export(target)
        kioskstdlib.remove_kiosk_subtree(dir_to_remove=self._working_dir, base_path=self._config.base_path, delay=.2)
        os.mkdir(self._working_dir)

    def end_export(self, success: bool):
        pass

    def new_table(self, dsd: DataSetDefinition, tablename: str, extra_columns=[]):
        self._close_workbook()
        self._dsd = dsd
        self._columns = list(dsd.list_fields(tablename))
        self._filename = os.path.join(self._working_dir, kioskstdlib.get_valid_filename(tablename + ".xlsx"))
        self._workbook = Workbook(write_only=True)
        self._worksheet = self._workbook.create_sheet("data")
        self._worksheet.append(self._columns + extra_columns)

    def export_record(self, r: dict, extra_values=[]):
        row = [getattr(r, dsd_field) for dsd_field in self._columns]
        for i in range(0, len(row)):
            if isinstance(row[i], dict):
                row[i] = json.dumps(row[i])

        row.extend(extra_values)
        self._worksheet.append(row)

    def close_table(self, success: bool):
        self._close_workbook()
        self._target.add_file(self._filename, kioskstdlib.get_filename(self._filename))

    def _close_workbook(self):
        if self._workbook:
            self._workbook.save(self._filename)
            self._workbook = None
            self._worksheet = None

# ************************************************************************
# Plugin code for PluginFileExportExcelDriver
# ************************************************************************
class PluginFileExportExcelDriver(SynchronizationPlugin):

    _plugin_version = 0.2

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            FileExportExcelDriver.register(app.type_repository)
            logging.debug("PluginFileExportExcelDriver: plugin and driver type registered")
        else:
            logging.error("PluginFileExportExcelDriver: plugin and driver type could not be registered due to no app.")
            return False

        return True

