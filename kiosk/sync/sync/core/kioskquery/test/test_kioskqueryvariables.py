import os

import pytest

import datetime

import kioskstdlib
from kioskquery.kioskquerylib import KioskQueryException
from reportingdock.reportinglib import ReportingException
from kioskquery.kioskqueryvariables import KioskQueryVariables
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskQueryVariables(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    def test_get_variable_type(self, config):
        definition = {
            "context_identifier": ["datatype(VARCHAR)"],
            "material_type": "datatype(VARCHAR)",
            "date": "datatype(TIMESTAMP)"
        }
        vars = KioskQueryVariables(definition)
        assert vars

        assert vars.get_variable_type("context_identifier") == "varchar"
        assert vars.get_variable_type("date") == "timestamp"

    def test_set_variable(self, config):
        definition = {
            "context_identifier": ["datatype(VARCHAR)"],
            "material_type": "datatype(VARCHAR)",
            "date": "datatype(TIMESTAMP)"
        }
        vars = KioskQueryVariables({})
        assert vars
        with pytest.raises(KioskQueryException, match="not declared"):
            vars.set_variable("context_identifier", "FH-001")

        definition = {
            "context_identifier": ["datatype(VARCHAR)"],
            "material_type": "datatype(VARCHAR)",
            "date": "datatype(TIMESTAMP)"
        }
        vars = KioskQueryVariables(definition)
        vars.set_variable("context_identifier", "FH-001")
        assert vars.get_variable_raw("context_identifier") == "FH-001"

        with pytest.raises(KioskQueryException, match="does not comply"):
            vars.set_variable("date", "28.02.1973")
        vars.set_variable("date", kioskstdlib.iso8601_to_str(datetime.date(year=1973, month=2, day=28)))
        assert vars.get_variable_raw("date") == "1973-02-28"
        assert vars.get_variable_sql("date") == "'1973-02-28'"

        assert vars.get_variable_sql("context_identifier") == "$$FH-001$$"

    def test_add_constants(self, config):
        var_definition = {
            "context_identifier": ["datatype(VARCHAR)"],
            "material_type": "datatype(VARCHAR)",
            "date": "datatype(TIMESTAMP)"
        }
        vars = KioskQueryVariables(var_definition)
        vars.set_variable("context_identifier", "FH-001")
        assert vars.get_variable_raw("context_identifier") == "FH-001"
        settings = {
            "const_text": "varchar const",
            "const_int": 10,
            "const_float": 10.123,
            "const_text_list": ["one", "two", "three"],
            "const_int_list": [1, 12, 13],
            "const_float_list": [1.12, 12.11, 13.13]
        }
        vars.add_constants(settings)
        assert vars.get_variable_raw("const_text") == "varchar const"
        assert vars.get_variable_type("const_text") == "varchar"
        assert vars.get_variable_sql("const_text") == "$$varchar const$$"
        assert vars.get_variable_raw("const_int") == 10
        assert vars.get_variable_type("const_int") == "int"
        assert vars.get_variable_sql("const_int") == "10"
        assert vars.get_variable_raw("const_float") == 10.123
        assert vars.get_variable_type("const_float") == "float"
        assert vars.get_variable_sql("const_float") == "10.123"
        assert vars.get_variable_raw("const_text_list") == ["one", "two", "three"]
        assert vars.get_variable_type("const_text_list") == "varchar"
        assert vars.get_variable_sql("const_text_list") == "$$one$$,$$two$$,$$three$$"
        assert vars.get_variable_type("const_int_list") == "int"
        assert vars.get_variable_sql("const_int_list") == "1,12,13"
        assert vars.get_variable_type("const_float_list") == "float"
        assert vars.get_variable_sql("const_float_list") == "1.12,12.11,13.13"
