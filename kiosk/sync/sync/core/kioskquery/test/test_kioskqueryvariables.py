import os

import pytest

import datetime

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
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

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

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

    def test_get_dsd_variable_type(self, config, dsd):
        definition = {
            "context_identifier": [r'dsd(locus, arch_context)'],
            "material_type": "dsd(collected_material, type)",
            "date": "dsd(collected_material, modified)"
        }
        assert dsd.table_is_defined("locus")
        vars = KioskQueryVariables(definition)
        assert vars

        assert vars.get_variable_type("context_identifier") == "varchar"
        assert vars.get_variable_type("date") == "timestamp"
        assert vars.get_variable_type("material_type") == "varchar"

    def test_get_dsd_variable_type_no_datatype_override(self, config, dsd):
        definition = {
            "context_identifier": [r'dsd(locus, arch_context)'],
            "material_type": "datatype(number)",
            "date": ["dsd(collected_material, modified)", "datatype(varchar)"]
        }
        assert dsd.table_is_defined("locus")
        vars = KioskQueryVariables(definition)
        assert vars

        assert vars.get_variable_type("context_identifier") == "varchar"
        assert vars.get_variable_type("date") == "timestamp"
        assert vars.get_variable_type("material_type") == "number"

    def test_get_variable_instructions(self, config, dsd):
        definition = {
            "context_identifier": r'dsd(locus, arch_context)',
            "material_type": ["datatype(VARCHAR)", "identifier()"],
            "date": ["dsd(collected_material, modified)", "additional_instruction(some, params)"]
        }
        assert dsd.table_is_defined("locus")
        vars = KioskQueryVariables(definition)
        assert vars

        assert vars.get_variable_type("context_identifier") == "varchar"
        assert vars.get_variable_type("date") == "timestamp"
        assert vars.get_variable_type("material_type") == "varchar"

        defs = vars.get_variable_definitions()
        assert defs["context_identifier"] == ['datatype(VARCHAR)',
                                              'identifier()',
                                              'skip_index_on("hidden")']

        assert defs["material_type"] == ['datatype(VARCHAR)',
                                         'identifier()']

        assert defs["date"] == ['datatype(TIMESTAMP)',
                                'replfield_modified()',
                                'additional_instruction(some, params)']

    def test_get_variable_instructions_override(self, config, dsd):
        definition = {
            "uid_unit": [r'dsd(locus, uid_unit)', r'datatype(VARCHAR)', r'join("some_other_table")'],
        }
        assert dsd.table_is_defined("locus")
        vars = KioskQueryVariables(definition)
        assert vars

        assert vars.get_variable_type("uid_unit") == "uuid"

        defs = vars.get_variable_definitions()
        assert defs["uid_unit"] == ['datatype(UUID)',
                                    'join("some_other_table")']
