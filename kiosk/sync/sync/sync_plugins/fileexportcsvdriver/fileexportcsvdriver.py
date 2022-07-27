import logging
import os
import csv
import datetime
import shutil

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from sync_plugins.fileexportworkstation.fileexportdriver import FileExportDriver
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin


class FileExportCSVDriver(FileExportDriver):
    def __init__(self, config):
        self._working_dir = os.path.join(config.get_temp_dir(), "fileexportcsvdriver")
        self._file = None
        self._filename = ""
        self._csv_writer = None
        self._dsd = None
        self._columns = []
        self.delimiter = ","
        self.quote = '"'
        self.quote_mode = 'minimal'
        super().__init__(config)

    def _load_driver(self):
        self._name = "CSV"

        if "fileexportcsvdriver" in self._config.config:
            self.delimiter = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "delimiter", self.delimiter)
            self.quote = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "quote", self.quote)
            self.quote_mode = kioskstdlib.try_get_dict_entry(self._config.config["fileexportcsvdriver"], "quote_mode",
                                                            self.quote_mode)

        self._description = f"UTF-8 encoded values separated by '{self.delimiter}'"

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
        self._close_file()
        self._dsd = dsd
        self._columns = list(dsd.list_fields(tablename))
        self._filename = os.path.join(self._working_dir, kioskstdlib.get_valid_filename(tablename + ".csv"))
        self._file = open(self._filename, mode='w', encoding='utf-8')
        quoting = csv.QUOTE_MINIMAL
        if self.quote_mode.lower() == "nonnumeric":
            quoting = csv.QUOTE_NONNUMERIC
        elif self.quote_mode.lower() == "all":
            quoting = csv.QUOTE_ALL
        elif self.quote_mode.lower() == "none":
            quoting = csv.QUOTE_NONE

        self._csv_writer = csv.writer(self._file, delimiter=self.delimiter, quotechar=self.quote, quoting=quoting,
                                      lineterminator="\n")
        if extra_columns:
            self._csv_writer.writerow(self._columns + extra_columns)
        else:
            self._csv_writer.writerow(self._columns)

    def export_record(self, r: dict, extra_values=[]):
        row = [getattr(r, dsd_field) for dsd_field in self._columns]
        row.extend(extra_values)
        self._csv_writer.writerow(row)

    def close_table(self, success: bool):
        self._close_file()
        self._target.add_file(self._filename, kioskstdlib.get_filename(self._filename))

    def _close_file(self):
        if self._file:
            self._file.close()
            self._file = None


# ************************************************************************
# Plugin code for PluginFileExportCSVDriver
# ************************************************************************
class PluginFileExportCSVDriver(SynchronizationPlugin):
    _plugin_version = 0.2

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            FileExportCSVDriver.register(app.type_repository)
            logging.debug("PluginFileExportCSVDriver: plugin and driver type registered")
        else:
            logging.error("PluginFileExportCSVDriver: plugin and driver type could not be registered due to no app.")
            return False

        return True
