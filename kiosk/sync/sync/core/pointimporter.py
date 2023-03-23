import logging

import openpyxl
from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

import os
from typing import Callable

import kioskstdlib
import csv

from orm.dsdtable import DSDTable


class PointImportError(Exception):
    pass


class PointImporter:
    def __init__(self, path_and_filename: str, configuration: dict):
        self.path_and_filename = path_and_filename
        self.configuration = configuration

    def load(self, db_writer: Callable):
        if kioskstdlib.get_file_extension(self.path_and_filename) in ["csv", "txt"]:
            self.load_from_csv_file(db_writer)
        elif kioskstdlib.get_file_extension(self.path_and_filename) in ["xls", "xlsx", "xlsm"]:
            self.load_from_excel_file(db_writer)
        else:
            raise PointImportError(f"The file type of {kioskstdlib.get_filename(self.path_and_filename)} "
                                   f"is not supported.")

    def load_from_csv_file(self, db_writer: Callable):
        if "csv" not in self.configuration:
            raise PointImportError("Kiosk is not properly configured: "
                                   "There is no 'pointrepositoryplugin/csv' section at all.")

        csv_config = self.configuration["csv"]
        if "columns" not in csv_config:
            raise PointImportError("The importer requires a column setting.")

        if "point_name" not in csv_config["columns"]:
            raise PointImportError("The importer requires at least the column 'point_name' in the column settings.")

        if not os.path.isfile(self.path_and_filename):
            raise PointImportError(
                f"The import file {kioskstdlib.get_filename(self.path_and_filename)} does not exist.")

        col_to_idx = self.translate_col_to_idx(csv_config)

        try:
            skip_lines = int(kioskstdlib.try_get_dict_entry(csv_config, "skip_lines", 0, True))
            category_line = int(kioskstdlib.try_get_dict_entry(csv_config, "category_line", 0, True))
        except BaseException as e:
            raise PointImportError(f"skip_lines or category_line has an illegal setting: {repr(e)}")

        category = ""
        with open(self.path_and_filename, mode='r', encoding='utf-8', newline='') as csv_file:
            for line_nr in range(1, skip_lines + 1):
                line = csv_file.readline()
                if line_nr == category_line:
                    category = line.strip()
            if not category:
                category = kioskstdlib.get_filename_without_extension(self.path_and_filename)
            row_reader = csv.reader(csv_file)
            row_nr = skip_lines
            for row in row_reader:
                row_nr += 1
                db_row = {"category": category}

                for col, idx in col_to_idx.items():
                    if len(row) <= idx:
                        raise PointImportError(f"line {row_nr} has wrong number of columns: "
                                               f"No column {idx + 1} found")
                    if col in ["longitude", "latitude", "elevation"]:
                        try:
                            _ = float(row[idx].strip())
                        except BaseException as e:
                            raise PointImportError(f"line {row_nr}/column{idx + 1}: error interpreting {row[idx]} "
                                                   f"as decimal value")
                    db_row[col] = row[idx].strip()
                db_writer(db_row)

    def translate_col_to_idx(self, csv_config):
        col_to_idx = {}
        for idx, c in enumerate(csv_config["columns"]):
            if c:
                if c in ["point_name", "category", "description", "longitude", "latitude", "elevation"]:
                    col_to_idx[c] = idx
                else:
                    raise PointImportError(
                        f"The column name {c} in the column configuration is unknown.")
        return col_to_idx

    def load_from_excel_file(self, db_writer: Callable):
        if "excel" not in self.configuration:
            raise PointImportError("Kiosk is not properly configured: "
                                   "There is no 'pointrepositoryplugin/excel' section at all.")

        excel_config = self.configuration["excel"]
        if "columns" not in excel_config:
            raise PointImportError("The importer requires a column setting.")

        if "point_name" not in excel_config["columns"]:
            raise PointImportError("The importer requires at least the column 'point_name' in the column settings.")

        if not os.path.isfile(self.path_and_filename):
            raise PointImportError(
                f"The import file {kioskstdlib.get_filename(self.path_and_filename)} does not exist.")

        col_to_idx = self.translate_col_to_idx(excel_config)
        try:
            skip_lines = int(kioskstdlib.try_get_dict_entry(excel_config, "skip_lines", 0, True))
            category_line = int(kioskstdlib.try_get_dict_entry(excel_config, "category_line", 0, True))
        except BaseException as e:
            raise PointImportError(f"skip_lines or category_line has an illegal setting: {repr(e)}")

        category = ""
        wb = openpyxl.load_workbook(filename=self.path_and_filename, data_only=True)
        try:
            ws: Worksheet = wb.active
            row_nr = 0
            for row in ws.values:
                row_nr += 1
                if row_nr <= skip_lines:
                    if row_nr == category_line:
                        category = row[0]
                else:
                    if not category:
                        category = kioskstdlib.get_filename_without_extension(self.path_and_filename)

                    db_row = {"category": category}

                    for col, idx in col_to_idx.items():
                        if len(row) <= idx:
                            raise PointImportError(f"line {row_nr} has wrong number of columns: "
                                                   f"No column {idx + 1} found")
                        if col in ["longitude", "latitude", "elevation"]:
                            try:
                                _ = float(str(row[idx]).strip())
                            except BaseException as e:
                                raise PointImportError(f"line {row_nr}/column{idx + 1}: error interpreting {row[idx]} "
                                                       f"as decimal value: {repr(e)}")
                        db_row[col] = str(row[idx]).strip()
                    db_writer(db_row)
        finally:
            try:
                wb.close()
            except BaseException as e:
                pass