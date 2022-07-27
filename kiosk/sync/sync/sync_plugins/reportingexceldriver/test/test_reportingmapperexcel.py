import os
from typing import Tuple, Iterator

import pytest
import yaml

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from sync_plugins.reportingexceldriver.reportingmapperexcel import ReportingMapperExcel
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")
reporting_test_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")
ustp_context_1367_data = os.path.join(test_path, r"sql", "ustp_context_1367.sql")


class TestReportingMapperExcel(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture(scope="module")
    def test_data(self, db):
        KioskSQLDb.run_sql_script(sql_data)

    def test__resolve_value_and_type(self, config):
        test_mapping = {"header": {"version": "1.0"}, "mapping": {}}
        mapper = ReportingMapperExcel(test_mapping, {}, on_load_list=None)
        assert mapper._resolve_value_and_type(r" ") == (ReportingMapperExcel.TYPE_CONST, " ")
        assert mapper._resolve_value_and_type(r"a") == (ReportingMapperExcel.TYPE_CONST, "a")
        assert mapper._resolve_value_and_type(r"' '") == (ReportingMapperExcel.TYPE_CONST, " ")
        assert mapper._resolve_value_and_type(r"'a'") == (ReportingMapperExcel.TYPE_CONST, "a")
        assert mapper._resolve_value_and_type(r"'something'") == (ReportingMapperExcel.TYPE_CONST, "something")

        # test variable
        assert mapper._resolve_value_and_type(r"'#something'") == (None, None)
        mapper.add_key_value("#something", "somevalue")
        assert mapper._resolve_value_and_type(r"'#something'") == (ReportingMapperExcel.TYPE_VAR, "somevalue")

        assert mapper._resolve_value_and_type(r"'#something'") == (ReportingMapperExcel.TYPE_VAR, "somevalue")

        # test db-value
        assert mapper._resolve_value_and_type(r"#some key") == (None, None)
        mapper.add_key_value("some key", "somevalue")
        assert mapper._resolve_value_and_type(r"#some key") == (ReportingMapperExcel.TYPE_VALUE, "somevalue")

        # test constant
        assert mapper._resolve_value_and_type(r"'test result'") == (ReportingMapperExcel.TYPE_CONST, "test result")

        test_mapping = {"header": {"version": "1.0"}, "mapping": {"target_field": "#a_table"},
            "tables": {
                "a_table": {

                }
            }
        }
        mapper = ReportingMapperExcel(test_mapping, {}, on_load_list=None)

        # test db-value
        assert mapper._resolve_value_and_type(r"#a_table") == (ReportingMapperExcel.TYPE_TABLE, "a_table")


    def test_simple_mapping(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "director": "'n/a'"
                        "context#": "'#context_identifier'"
                        "dbvalue": "#db_value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapperExcel(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "director": "n/a",
            "context#": "FH-001",
            "dbvalue": "test value"
        }

    def test_simple_mapping_with_table(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "director": "'n/a'"
                        "context#": "'#context_identifier'"
                        "dbvalue": "#db_value"
                        "a_table": "#a_table"
                    "tables":
                        "a_table":
                        cells: ["1", "2"]
                        templated: True
                        table_orientation: row
                        mapping:
                          '1': '#context_identifier'
                          '2': 'US - positiva'
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapperExcel(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "director": "n/a",
            "context#": "FH-001",
            "dbvalue": "test value",
            "a_table": "#a_table"
        }

