import os

import pytest

import datetime

from openpyxl import load_workbook

import kioskstdlib
import kioskdatetimelib
from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from reportingdock import ReportingDock
from reportingdock.reportingengine import ReportingEngine
from reportingdock.reportinglib import ReportingException
from sync_plugins.reportingexceldriver.reportingexceldriver import ReportingExcelDriver, ExcelReference
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestReportingOutputDriverExcel(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_excel_reference(self):
        ref = ExcelReference("A1")
        assert ref.type == ref.TYPE_CELL

        ref = ExcelReference("Something")
        assert ref.type == ref.TYPE_CELL

        ref = ExcelReference("sheet1!A1")
        assert ref.type == ref.TYPE_CELL
        assert ref.sheet == "sheet1"

        ref = ExcelReference("sheet1!title")
        assert ref.type == ref.TYPE_CELL
        assert ref.sheet == "sheet1"

    def test__copy_range_with_format(self, shared_datadir):
        src_file = os.path.join(shared_datadir, "template_1.xlsx")
        wb = load_workbook(src_file)
        ws = wb["AREA_SHEET"]
        src_ref = ExcelReference("AREA_SHEET!A5:O5")
        dst_ref = ExcelReference("AREA_SHEET!A6:A6")
        driver = ReportingExcelDriver()
        driver._add_row_below(ws, src_ref)
        driver._copy_range_with_format(ws, src_ref, dst_ref)
        wb.save(src_file)
        print("\n")
        print(src_file)

    def test_table_mapping(self, config, dsd, shared_datadir, monkeypatch):
        def get_output_directory(cfg):
            return shared_datadir

        definition_file = os.path.join(shared_datadir, "excel_test_table_mapping.yml")
        test_data_sql = os.path.join(test_path, "sql", "excel_test_table_mapping.sql")
        KioskSQLDb.run_sql_script(test_data_sql)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')

        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=definition_file)
        reporting_engine.set_variable("context_identifier", "LA")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.template_file = os.path.join(shared_datadir, "excel_test_table_mapping.xlsx")
        reporting_engine.load_mapping_definition(mapping_definition_file_path=definition_file)
        reporting_engine.map(namespace="dock_test")
        monkeypatch.setattr(reporting_engine, "get_output_directory", get_output_directory)
        reporting_engine.filename_prefix = "reporting_"
        reporting_engine.output("LA")
        assert os.path.isfile(os.path.join(shared_datadir, "reporting_LA.xlsx"))
        print("reporting_LA.xlsx in " + str(shared_datadir))

    def test_table_mapping_2(self, config, dsd, shared_datadir, monkeypatch):
        def get_output_directory(cfg):
            return shared_datadir

        definition_file = os.path.join(shared_datadir, "contexts_and_finds_report_definition.yml")
        test_data_sql = os.path.join(test_path, "sql", "excel_test_table_mapping.sql")
        KioskSQLDb.run_sql_script(test_data_sql)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')

        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=definition_file)
        reporting_engine.set_variable("context_identifier", "LA")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.template_file = os.path.join(shared_datadir, "pasu_contexts_finds_listing.xlsx")
        reporting_engine.load_mapping_definition(mapping_definition_file_path=definition_file)
        reporting_engine.map(namespace="dock_test")
        monkeypatch.setattr(reporting_engine, "get_output_directory", get_output_directory)
        reporting_engine.filename_prefix = "reporting_"
        reporting_engine.output("LA")
        assert os.path.isfile(os.path.join(shared_datadir, "reporting_LA.xlsx"))
        print("reporting_LA.xlsx in " + str(shared_datadir))
