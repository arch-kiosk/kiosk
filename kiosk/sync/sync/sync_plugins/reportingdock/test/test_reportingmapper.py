import os
from typing import Tuple, Iterator

import pytest
import yaml

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from reportingdock.reportingmapper import ReportingMapper
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")
reporting_test_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")
ustp_context_1367_data = os.path.join(test_path, r"sql", "ustp_context_1367.sql")


class TestReportingMapper(KioskPyTestHelper):
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
        mapper = ReportingMapper(test_mapping, {}, on_load_list=None)
        assert mapper._resolve_value_and_type(r" ") == (ReportingMapper.TYPE_CONST, " ")
        assert mapper._resolve_value_and_type(r"a") == (ReportingMapper.TYPE_CONST, "a")
        assert mapper._resolve_value_and_type(r"' '") == (ReportingMapper.TYPE_CONST, " ")
        assert mapper._resolve_value_and_type(r"'a'") == (ReportingMapper.TYPE_CONST, "a")
        assert mapper._resolve_value_and_type(r"'something'") == (ReportingMapper.TYPE_CONST, "something")

        # test variable
        assert mapper._resolve_value_and_type(r"'#something'") == (None, None)
        mapper.add_key_value("#something", "somevalue")
        assert mapper._resolve_value_and_type(r"'#something'") == (ReportingMapper.TYPE_VAR, "somevalue")

        assert mapper._resolve_value_and_type(r"'#something'") == (ReportingMapper.TYPE_VAR, "somevalue")

        # test db-value
        assert mapper._resolve_value_and_type(r"#some key") == (None, None)
        mapper.add_key_value("some key", "somevalue")
        assert mapper._resolve_value_and_type(r"#some key") == (ReportingMapper.TYPE_VALUE, "somevalue")

        # test constant
        assert mapper._resolve_value_and_type(r"'test result'") == (ReportingMapper.TYPE_CONST, "test result")

    def test__resolve_instruction(self, config):
        test_mapping = {"header": {"version": "1.0"}, "mapping": {}}
        mapper = ReportingMapper(test_mapping, {}, on_load_list=None)
        assert mapper._resolve_instruction(r"simple()") == {"instruction": "simple", "params": []}
        assert mapper._resolve_instruction(r"simple(param1, param2)") == {"instruction": "simple",
                                                                          "params": ["param1", "param2"]}
        assert mapper._resolve_instruction(r"simple(param1, param2)?then") == {
            "instruction": "simple",
            "params": ["param1", "param2"],
            "then": "then"}
        assert mapper._resolve_instruction(r"simple(param1, param2):else") == {
            "instruction": "simple",
            "params": ["param1", "param2"],
            "else": "else"}
        assert mapper._resolve_instruction(r"simple(param1, param2)?then:else") == {
            "instruction": "simple",
            "params": ["param1", "param2"],
            "then": "then",
            "else": "else"}
        assert mapper._resolve_instruction(r"simple?then:else") == {
            "instruction": "simple",
            "params": [],
            "then": "then",
            "else": "else"}
        assert mapper._resolve_instruction(r"simple") == {
            "instruction": "simple",
            "params": [],
        }
        assert mapper._resolve_instruction(r"simple?then") == {
            "instruction": "simple",
            "params": [],
            "then": "then"}
        assert mapper._resolve_instruction(r"simple:else") == {
            "instruction": "simple",
            "params": [],
            "else": "else"}

    def test_simple_mapping(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "director": "'n/a'"
                        "context#": "'#context_identifier'"
                        "dbvalue": "#db_value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "director": "n/a",
            "context#": "FH-001",
            "dbvalue": "test value"
        }

    def test_complex_mapping_1(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "test value"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - "#context_identifier"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "FH-001"
        }

    def test_complex_mapping_append(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - append(' ', "appendix")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "test value appendix"
        }

    def test_complex_mapping_append_strip(self, config):
        # test if results are trimmed
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#no_value"
                            - append(" ", "#db_value")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "test value"
        }

    def test_complex_mapping_prepend(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - prepend("prependix", ' ')
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "prependix test value"
        }

    def test_complex_mapping_prepend_strip(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#no_value"
                            - prepend("#prependix", " ")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": ""
        }

    def test_complex_mapping_set_if_smaller(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller(0)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "1", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "0"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller(2)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "1", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "1"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller(2)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller(12)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "not an int", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "not an int"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller("not an int")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "12", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "12"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_smaller(1, "param 2")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "2", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "param 2"
        }


    def test_complex_mapping_set_if_greater(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater(1)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "0", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "1"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater(1)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "2", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater(2)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater(12)
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "not an int", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "not an int"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater("not an int")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "12", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "12"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.2"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - set_if_greater(3, "param 2")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "2", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "param 2"
        }


    def test_complex_mapping_has_value(self, config):
        #  test simple then case with a constant then value
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - has_value("#db_value")?'then value'
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "then value"
        }

        #  test simple then case with a db-value
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - has_value("#db_value")?"#then-value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "then-value": "db then value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "db then value"
        }

        #  test simple else case with a constant
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - has_value("#no_value"):"else-value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "then-value": "db then value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "else-value"
        }

        #  test simple else case with a db-value
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - has_value("#no_value"):"#else-value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "else-value": "db else value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "db else value"
        }

        #  test then else case
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#no_value"
                            - has_value()?"#then-value":"#else-value"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict,
                                 {"db_value": "test value", "then-value": "then-value", "else-value": "db else value",
                                  "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "db else value"
        }

    def test_complex_mapping_has_value_simple(self, config):
        #  this just tests "has_value" without parameters
        mapping_dict = yaml.load("""
                "header":
                    "version": "1.0"
                "mapping": 
                    "target_field":
                        - "#db_value"
                        - has_value?"#then-value":"#else-value"
            """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "then-value": "db then value",
                                                "else-value": "db else value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "db then value"
        }

    def test_complex_mapping_has_value_2(self, config):
        mapping_dict = yaml.load("""
                "header":
                    "version": "1.0"
                "mapping": 
                    "target_field":
                        - "#db_value"
                        - append(" mm")
                        - has_value(#db_value):''
            """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "", "then-value": "db then value",
                                                "else-value": "db else value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": ""
        }

        mapper = ReportingMapper(mapping_dict, {"db_value": 10, "then-value": "db then value",
                                                "else-value": "db else value",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "10 mm"
        }

    def test_complex_mapping_in(self, config):
        #  test simple then case with a constant then value
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - in("test value")?'then value'
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "then value"
        }

        #  test simple then case with a constant else value
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#no_value"
                            - in("test value"):'else value'
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "else value"
        }

        #  test then else case with constant values
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - in("test value")?'then value':'else value'
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "else value"
        }

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "then value"
        }

    def test_complex_mapping_in_elevation_example(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "has_elevation":
                            - '#elevation_ne'
                            - has_value?"'X'":'#elevation_se'
                            - has_value?"'X'":'#elevation_nw'
                            - has_value?"'X'":'#elevation_sw'
                            - has_value?"X":' ' 
                          
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {
            "#context_identifier": "FH-001",
        }, None)
        assert mapper.map() == {
            "has_elevation": ""
        }

        for s in ["ne", "se", "nw", "sw"]:
            mapper = ReportingMapper(mapping_dict, {
                "#context_identifier": "FH-001",
                "elevation_" + s: "10",
            }, None)
            assert mapper.map() == {
                "has_elevation": "X"
            }

        mapper = ReportingMapper(mapping_dict, {
            "#context_identifier": "FH-001",
            "elevation_se": "10",
            "elevation_nw": "10",
        }, None)
        assert mapper.map() == {
            "has_elevation": "X"
        }

    def test_complex_mapping_mixed_example(self, config):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "has_elevation":
                            - '#elevation_ne'
                            - has_value:'#elevation_se'
                            - has_value:'#elevation_nw'
                            - has_value:'#elevation_sw'
                            - has_value:'0'
                            - append(" cm") 

                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {
            "#context_identifier": "FH-001", "elevation_se": "10"
        }, None)
        assert mapper.map() == {
            "has_elevation": "10 cm"
        }

    def test__resolve_value_and_type_from_list(self, config):
        def on_get_list(list_name: str, columns: list) -> Iterator[Tuple]:
            if list_name == "test_list":
                return [(f"row {i}",) for i in range(1, 3)]

        test_mapping = {"header": {"version": "1.0"}, "mapping": {},
                        "lists": {
                            "test_list": {
                                "columns": ["col1"],
                                "heading": ["column name"]
                            }
                        }}
        mapper = ReportingMapper(test_mapping, {}, on_load_list=on_get_list)
        # test db-value
        assert mapper._resolve_value_and_type(r"#test_list") == (ReportingMapper.TYPE_VALUE,
                                                                 'column name\nrow 1\nrow 2')

    def test_complex_mapping_lookup(self, test_data):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - "lookup('lookup_table', 'key_field')?'yup'"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "test value", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "test value"
        }

        mapper = ReportingMapper(mapping_dict, {"db_value": "key1", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "yup"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - "lookup('lookup_table', 'key_field')?'#value_field'"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "key1", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "value1"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - "lookup('lookup_table', 'key_field')?'#value_field':'else'"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "nokey", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "else"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#db_value"
                            - "lookup('lookup_table', 'key_field'):'else'"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"db_value": "key1", "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "key1"
        }

    def load_record_as_dict(self, table, key_field, key_value):
        cur = KioskSQLDb.execute_return_cursor(f"select * from {table} where {key_field}=%s", [key_value])
        result = {}
        try:
            r = cur.fetchone()
            if not r:
                raise Exception("load_record_as_dict: no results by query.")

            keys = [desc[0] for desc in cur.description]
            for k in keys:
                result[k] = r[k]

        finally:
            cur.close()
        return result

    def test_complex_mapping_let(self):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "a value"
                            - let("new_var")
                            - ""
                            - "#new_var"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "2018", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "a value"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "a value"
                            - let("new_var", "#min_year")
                            - ""
                            - "#new_var"
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "2018", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2018"
        }


    def test_complex_mapping_let_logic(self):
        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#min_year"
                            - set_if_smaller("9999","")
                            - let(from_year)
                            - "#from_year"
                            - set_if_greater(#max_year,"")
                            - has_value:"#max_year"
                            - let(to_year)
                            - "#to_year"
                            - has_value?"-"
                            - let(separator)
                            - "#from_year"
                            - append("#separator", "#to_year")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "2018", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2018-2019"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#min_year"
                            - set_if_smaller("9999","")
                            - let(from_year)
                            - "#from_year"
                            - set_if_greater(#max_year,"")
                            - has_value?"":"#max_year"
                            - let(to_year)
                            - "#to_year"
                            - has_value?"-"
                            - let(separator)
                            - "#from_year"
                            - append("#separator", "#to_year")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "2019", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2019"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#min_year"
                            - set_if_smaller("9999","")
                            - let(from_year)
                            - "#from_year"
                            - set_if_greater(#max_year,"")
                            - has_value?"":"#max_year"
                            - let(to_year)
                            - "#to_year"
                            - has_value?"-"
                            - let(separator)
                            - "#from_year"
                            - append("#separator", "#to_year")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "2019", "max_year": "",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2019"
        }

        mapper = ReportingMapper(mapping_dict, {"min_year": "2019", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2019"
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#min_year"
                            - set_if_smaller("9999","")
                            - let(from_year)
                            - "#from_year"
                            - set_if_greater(#max_year,"")
                            - has_value?"":"#max_year"
                            - set_if_greater(1,"")
                            - let(to_year)
                            - "#to_year"
                            - has_value?"-"
                            - let(separator)
                            - "#from_year"
                            - append("#separator", "#to_year")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "10000", "max_year": "0",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": ""
        }

        mapping_dict = yaml.load("""
                    "header":
                        "version": "1.0"
                    "mapping": 
                        "target_field":
                            - "#min_year"
                            - set_if_smaller("9999","")
                            - let(from_year)
                            - "#from_year"
                            - set_if_greater(#max_year,"")
                            - has_value?"":"#max_year"
                            - set_if_greater(1,"")
                            - let(to_year)
                            - "#to_year"
                            - has_value?"#from_year"
                            - has_value?"-"
                            - let(separator)
                            - "#from_year"
                            - append("#separator", "#to_year")
                """, Loader=yaml.FullLoader)

        mapper = ReportingMapper(mapping_dict, {"min_year": "10000", "max_year": "2019",
                                                "#context_identifier": "FH-001"}, None)
        result = mapper.map()
        assert result == {
            "target_field": "2019"
        }
