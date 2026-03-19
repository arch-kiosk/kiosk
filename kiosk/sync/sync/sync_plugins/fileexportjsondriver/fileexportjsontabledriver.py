import datetime
import decimal
import json
import logging
import os
import pprint
import uuid
from typing import Union, Any

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from fileexportworkstation.tablebasedfileexportdriver import TableBasedFileExportDriver


class FileExportJSONTableDriver(TableBasedFileExportDriver):

    def __init__(self, config, file_repository):
        self._working_dir = os.path.join(config.get_temp_dir(), self.__class__.__name__.lower())
        self._columns = []
        self._f = None
        self._first_table = True
        super().__init__(config, file_repository)

    def _load_driver(self):
        self._name = "json tables"
        self._description = f"JSON Table Format"

    def start_export(self, target) -> bool:
        """
        prepares the export
        :param target: a valid FileExportTarget
        :raises: Exceptions of all sorts
        """
        kioskstdlib.remove_kiosk_subtree(dir_to_remove=self._working_dir, base_path=self._config.base_path, delay=.2)
        os.mkdir(self._working_dir)
        self._filename = os.path.join(self._working_dir, "data.json")
        self._f = open(self._filename, 'w', encoding='utf-8')
        self._f.write('{\n')
        self._first_table = True
        logging.debug(f"{self.__class__.__name__}.start_export: Starting json (table) export to {self._filename}")
        return super().start_export(target)

    def end_export(self, success: bool):
        try:
            if self._f:
                self._f.write('\n}')
                self._f.close()
                self._f = None
                if success:
                    self._target.add_file(self._filename, kioskstdlib.get_filename(self._filename))
                    logging.debug(f"{self.__class__.__name__}.end_export: Added {self._filename}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.end_export: Exception when closing json file: {repr(e)}")

    def new_table(self, dsd: DataSetDefinition, tablename: str, extra_columns=[]):
        self._columns = list(dsd.list_fields(tablename))
        prefix = "" if self._first_table else ","
        self._f.write(f'{prefix}"{tablename}": [{json.dumps(self._columns + extra_columns)}')
        self._first_table = False
        logging.debug(f"{self.__class__.__name__}.new_table: starting table {tablename}")
        logging.debug(f"{self.__class__.__name__}.new_table: columns are {pprint.pformat(self._columns)}")

    def json_default(self, obj: Any) -> Union[Any, None]:
        if isinstance(obj, decimal.Decimal):
            return float(obj)  # Or str(obj) if you need absolute precision
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        if isinstance(obj, uuid.UUID):
            return str(obj)
        if isinstance(obj, bytes):
            return obj.decode('utf-8', errors='ignore')
        try:
            return str(obj)
        except BaseException:
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

    def export_record(self, r: dict, extra_values=[]):
        row = [getattr(r, dsd_field) for dsd_field in self._columns]
        for i in range(0, len(row)):
            if isinstance(row[i], dict):
                row[i] = json.dumps(row[i])
            if isinstance(row[i], datetime.datetime):
                row[i] = row[i].isoformat()
        row.extend(extra_values)
        self._f.write(f',{json.dumps(row, default=self.json_default)}')

    @property
    def is_open(self):
        return bool(self._f)

    def close_table(self, success: bool):
        self._f.write(f']')



