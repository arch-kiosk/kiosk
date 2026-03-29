import logging
import os
import pprint
import traceback
from typing import Any, Generator

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from orm.dsdtable import DSDTable
from .fileexportdriver import FileExportDriver
from .fileexportlib import FileExportError


class TableBasedFileExportDriver (FileExportDriver):
    def get_export_tables(self) -> Generator[Any, Any, None]:
        tables = set(self._dsd_view_dsd.list_tables())
        for table in tables:
            yield table

    def export(self) -> bool:
        try:
            logging.info(f"{self.__class__.__name__}.export: Starting File Export")
            self._target.start_export()
            c_tables = 0
            tables = list(self.get_export_tables())
            max_tables = len(tables)
            percentage = 0
            for t in tables:
                c_tables += 1
                self._interruptable_callback_progress(percentage * 0.75,
                                                      f"exporting {t}")

                if t == self._dsd_view_dsd.files_table and self.include_files:
                    self._export_files_table(t, percentage)
                    percentage += 50
                else:
                    self._export_table(t)
                    percentage += (100 / max_tables / (2 if self.include_files else 1))

                logging.debug(f"{self.__class__.__name__}.export: Table {t} exported.")
            if c_tables == 0:
                raise FileExportError("No data has been exported because no table was selected.")
            else:
                logging.info(f"{self.__class__.__name__}.export: {c_tables} tables exported.")

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
            logging.error(f"{self.__class__.__name__}.export : {repr(e)}")
            try:
                self.end_export(success=False)
            except BaseException:
                pass
            try:
                self._target.end_export(success=False)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.export: Problems when ending export on target {repr(e)}")
            return False


    def _export_table(self, table: str):
        try:
            dsdtable = DSDTable(self._dsd_view_dsd, table)
            self.new_table(self._dsd_view_dsd, table)
            if self._target.has_file(kioskstdlib.get_filename(self.filename)):
                print(f"file {self.filename} already there")
            errors = 0
            c_row = 0
            for r in dsdtable.get_many():
                c_row += 1
                try:
                    self.export_record(r)
                except BaseException as e:
                    logging.warning(f"{self.__class__.__name__}._export_table: {repr(e)} in row {c_row}")
                    logging.debug(f"{pprint.pformat(r)}")
                    errors += 1
                    if errors > 10:
                        raise Exception(f"Too many errors in table {table}.")

            self.close_table(success=True)
        except BaseException as e:
            self.close_table(success=False)
            logging.error(
                f"{self.__class__.__name__}._export_table: Export of table {table} failed due to exception {repr(e)}")
            raise FileExportError(repr(e))


    def _export_files_table(self, table: str, start_percentage):
        try:
            dsdtable = DSDTable(self._dsd_view_dsd, table)
            self.new_table(self._dsd_view_dsd, table, ["exported_filename"])
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
            err = 0
            for r in dsdtable.get_many():
                if err > 10:
                    raise FileExportError("too many errors during _export_files_table.")

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
                    logging.warning(f"{self.__class__.__name__}._export_files_table: "
                                    f"File {uid_file} caused Exception {repr(e)}")
                    err += 1
                try:
                    if source_file:
                        dest_filename = self._get_dest_file_name(uid_file, kioskstdlib.get_filename(source_file))
                        dest_filename = self._target.get_new_filename(dest_filename)
                    else:
                        dest_filename = ""

                    self.export_record(r, [dest_filename])
                    if source_file:
                        self._target.add_file(source_file, dest_filename)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}._export_files_table: exporting record or file "
                                  f"{source_file} for uid {uid_file} failed: {repr(e)}")
                    trace = traceback.format_exc()
                    logging.error(f"{self.__class__.__name__}._export_files_table: {trace}")
                    err += 1
            logging.info(f"{self.__class__.__name__}.export: {c_file} files checked for export.")
            self.close_table(success=True)
        except BaseException as e:
            self.close_table(success=False)
            logging.error(
                f"{self.__class__.__name__}._export_table: Export of table {table} failed due to exception {repr(e)}")
            raise FileExportError(repr(e))



    def new_table(self, dsd: DataSetDefinition, tablename: str, extra_columns=[]):
        pass

    def export_record(self, r: dict, extra_values=[]):
        raise NotImplementedError()

    def close_table(self, success: bool):
        pass
