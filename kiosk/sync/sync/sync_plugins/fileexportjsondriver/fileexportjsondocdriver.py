import datetime
import decimal
import json
import logging
import os
import pprint
import traceback
import uuid
from typing import Union, Any

import kioskstdlib
from kiosksqldb import KioskSQLDb
from orm.dsdtable import DSDTable
from sync_plugins.fileexportworkstation.fileexportlib import FileExportError
from sync_plugins.fileexportworkstation.fileexportdriver import FileExportDriver
from .embeddedjsongenerator import SQL2EmbeddedJSON


class FileExportJSONDocDriver(FileExportDriver):

    def __init__(self, config, file_repository):
        self._working_dir = os.path.join(config.get_temp_dir(), self.__class__.__name__.lower())
        self._columns = []
        self._f = None
        self._first_table = True
        super().__init__(config, file_repository)

    def _load_driver(self):
        self._name = "json doc"
        self._description = f"JSON Document Format"

    def get_filename_renderings(self):
        return [("uid", "use unique id as filename")]

    def start_export(self, target) -> bool:
        """
        prepares the export
        :param target: a valid FileExportTarget
        :raises: Exceptions of all sorts
        """
        kioskstdlib.remove_kiosk_subtree(dir_to_remove=self._working_dir, base_path=self._config.base_path, delay=.2)
        os.mkdir(self._working_dir)
        self._filename = os.path.join(self._working_dir, "docs.json")
        self._f = open(self._filename, 'w', encoding='utf-8')
        self._f.write('{\n')
        logging.debug(f"{self.__class__.__name__}.start_export: Starting json (doc) export to {self._filename}")
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

    @property
    def is_open(self):
        return bool(self._f)

    def export(self) -> bool:
        try:
            logging.info(f"{self.__class__.__name__}.export: Starting JSON Doc Export")
            self._target.start_export()
            json_generator = SQL2EmbeddedJSON(self._config, self._dsd_view_dsd)
            sqls = json_generator.generate_nested_sqls()
            c_docs = 0
            percentage = 0

            for (t, sql) in sqls:
                logging.debug(f"{self.__class__.__name__}.export: Exporting context {t}")
                self._f.write(f'{"," if c_docs > 0 else ""}"{t}": [')
                c_docs += 1
                self._interruptable_callback_progress(percentage * 0.75,
                                                      f"exporting json doc type {c_docs}")
                cur = None
                try:
                    cur = KioskSQLDb.execute_return_cursor(sql)
                    row = cur.fetchone()
                    first_row = True
                    while row:
                        self._f.write(f'{"" if first_row else ","}{json.dumps(row[0], default=self.json_default)}')
                        first_row = False
                        row = cur.fetchone()

                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.export: Exception exporting {t}: {repr(e)}")
                    KioskSQLDb.rollback()
                finally:
                    if cur:
                        cur.close()
                self._f.write(f']')
                percentage += (100 / len(sqls) / (2 if self.include_files else 1))

            if self.include_files:
                self._export_files(start_percentage=percentage)

            self.end_export(success=True)

            try:
                def _target_callback(progress, message):
                    if self._callback_progress:
                        return self._callback_progress(75 + progress * 0.25, message)
                    else:
                        return True

                self._target.store(_target_callback)
            except BaseException as e:
                raise FileExportError(f"Exception in self._target.store: {repr(e)}")

            self._target.end_export(success=True)
            self._interruptable_callback_progress(100, "File export finished")
            logging.info(f"{self.__class__.__name__}.export: File export finished.")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.export: {repr(e)}")
            try:
                self.end_export(success=False)
            except BaseException:
                pass
            try:
                self._target.end_export(success=False)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.export: Problems when ending export on target {repr(e)}")
            return False

    def _export_files(self, start_percentage):
        try:
            files_table = self._dsd_view_dsd.files_table
            dsdtable = DSDTable(self._dsd_view_dsd, files_table)
            if not files_table:
                raise FileExportError("_export_files: No files table available in dsd")

            file_uid_field = self._dsd_view_dsd.get_fields_with_instruction(files_table, "file_for")
            if len(file_uid_field) != 1:
                raise FileExportError(f"_export_files: No or too many file_for() instructions in "
                                      f"files table {files_table}.")

            file_uid_field = file_uid_field[0]
            c_files = dsdtable.count()
            c_file = 0
            err = 0
            for r in dsdtable.get_many():
                if err > 10:
                    raise FileExportError("too many errors during _export_files.")

                c_file += 1
                self._interruptable_callback_progress(start_percentage + (c_file * 100 / c_files) * 0.25,
                                                      f"exporting file {c_file}/{c_files}")
                uid_file = getattr(r, file_uid_field)
                source_file = None
                try:
                    source_file = self._get_source_file(uid_file, getattr(r, self._dsd_view_dsd.files_table_filename_field))
                    if source_file:
                        if not os.path.isfile(source_file):
                            source_file = ""
                except BaseException as e:
                    logging.warning(f"{self.__class__.__name__}._export_files: "
                                    f"File {uid_file} caused Exception {repr(e)}")
                    err += 1
                try:
                    if source_file:
                        dest_filename = self._get_dest_file_name(uid_file, kioskstdlib.get_filename(source_file))
                        dest_filename = self._target.get_new_filename(dest_filename)
                    else:
                        dest_filename = ""

                    if source_file:
                        self._target.add_file(source_file, dest_filename)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}._export_files: exporting record or file "
                                  f"{source_file} for uid {uid_file} failed: {repr(e)}")
                    trace = traceback.format_exc()
                    logging.error(f"{self.__class__.__name__}._export_files: {trace}")
                    err += 1
            logging.info(f"{self.__class__.__name__}.export: {c_file} files checked for export.")
        except BaseException as e:
            logging.error(
                f"{self.__class__.__name__}._export_table: Export of files failed due to exception {repr(e)}")
            raise FileExportError(repr(e))
