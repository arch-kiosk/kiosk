import json
import logging
import os
import datetime
import traceback

from openpyxl import Workbook

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from sync_plugins.fileexportworkstation.tablebasedfileexportdriver import TableBasedFileExportDriver
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin


class FileExportExcelDriver(TableBasedFileExportDriver):

    def __init__(self, config, file_repository):
        self._working_dir = os.path.join(config.get_temp_dir(), self.__class__.__name__.lower())
        self._workbook = None
        self._worksheet = None
        self._dsd = None
        self._columns = []
        super().__init__(config, file_repository)

    def _load_driver(self):
        self._name = "XLSX"


        self._description = f"Excel XLSX file format: Excel 2010 and higher"

    def start_export(self, target) -> bool:
        """
        prepares the export
        :param target: a valid FileExportTarget
        :raises: Exceptions of all sorts
        """
        kioskstdlib.remove_kiosk_subtree(dir_to_remove=self._working_dir, base_path=self._config.base_path, delay=.2)
        os.mkdir(self._working_dir)
        return super().start_export(target)

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
            if isinstance(row[i], datetime.datetime):
                try:
                    if row[i].tzinfo:
                        utc_ts = row[i].astimezone(datetime.timezone.utc)
                        row[i] = utc_ts.replace(tzinfo=None)
                except BaseException as e:
                    logging.warning(f"{self.__class__.__name__}.export_record: Exception when tossing time zone of '{row[i]}': "
                                  f"{repr(e)}")
                    trace = traceback.format_exc()
                    logging.debug(f"{self.__class__.__name__}.export_record: {trace}")
                    row[i] = None

        row.extend(extra_values)
        self._worksheet.append(row)

    @property
    def is_open(self):
        return bool(self._workbook)

    def close_table(self, success: bool):
        if self.is_open:
            self._close_workbook()
            try:
                self._target.add_file(self._filename, kioskstdlib.get_filename(self._filename))
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.close_file: {repr(e)}")
                raise e

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

