import os

import pytest
import logging

from contextmanagement.contexttypeinfo import ContextTypeInfo
from dsd.dsd3 import DataSetDefinition
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

from transpile.sqlconditiontranspiler import SqlConditionTranspiler
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestSqlConditionTranspiler(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    def test_init(self, urapdb):
        conditions = {
            "?": "equals(brick_size, 12)"
        }

        sct = SqlConditionTranspiler(KioskSQLDb)
        sql_where = sct.run(conditions)
        assert sql_where == "\"brick_size\"=12"

    def test_two_equals(self, urapdb):
        conditions = {
            "or": [
                "equals(brick_size, 12)",
                "equals(brick_size, 15)",
            ]
        }

        sct = SqlConditionTranspiler(KioskSQLDb)
        sql_where = sct.run(conditions)
        assert sql_where == "(\"brick_size\"=12 or \"brick_size\"=15)"

    def test_two_equals_and_range(self, urapdb):
        conditions = {
            "and": [
                {
                    "or": [
                        "equals(brick_size, 12)",
                        "equals(brick_size, 15)",
                    ]},
                "range(some_value,1,10)"
            ]
        }

        sct = SqlConditionTranspiler(KioskSQLDb)
        sql_where = sct.run(conditions)
        assert sql_where == "((\"brick_size\"=12 or \"brick_size\"=15) and (\"some_value\">=1 and \"some_value\"<=10))"

    def test_two_equals_and_range_with_type_info(self, urapdb):
        def get_type_info(record_type: str, field: str) -> str:
            if field in ["brick_size", "some_value"]:
                return "VARCHAR"
            else:
                return "?"

        conditions = {
            "and": [
                {
                    "or": [
                        "equals(brick_size, 12)",
                        "equals(brick_size, 15)",
                    ]},
                "range(some_value,1,10)"
            ]
        }
        type_info = ContextTypeInfo(get_type_info)
        type_info.add_type("brick_size", "locus")
        type_info.add_type("some_value", "locus")
        sct = SqlConditionTranspiler(KioskSQLDb)
        sct.type_info = type_info
        sql_where = sct.run(conditions)
        assert sql_where == f'(("brick_size"=$$12$$ or "brick_size"=$$15$$) and ' \
                            f'("some_value">=$$1$$ and "some_value"<=$$10$$))'

    def test_two_equals_and_range_with_dates(self, urapdb):
        def get_type_info(record_type: str, field: str) -> str:
            if field in ["modified", "created"]:
                return "DATETIME"
            else:
                return "?"

        conditions = {
            "and": [
                {
                    "or": [
                        "equals(modified, 2019-10-10)",
                        "equals(modified, 2019-10-15)",
                    ]},
                "range(created,2020-01-01T00:00:00,2020-01-01T01:00:00)"
            ]
        }
        type_info = ContextTypeInfo(get_type_info)
        type_info.add_type("modified", "locus")
        type_info.add_type("created", "locus")
        sct = SqlConditionTranspiler(KioskSQLDb)
        sct.type_info = type_info
        sql_where = sct.run(conditions)
        assert sql_where == f"((\"modified\"=\'2019-10-10\' or \"modified\"=\'2019-10-15\') " \
                            f"and (\"created\">=\'2020-01-01T00:00:00\' and \"created\"<=\'2020-01-01T01:00:00\'))"

    def test_test_case_1(self, urapdb):
        def get_type_info(record_type: str, field: str) -> str:
            if field in ["modified_by"]:
                return "VARCHAR"
            else:
                return "?"

        conditions = {
            "?": "equals(modified_by, \"Urap's iPad\")"
        }
        type_info = ContextTypeInfo(get_type_info)
        type_info.add_data_type("modified_by", "VARCHAR")
        sct = SqlConditionTranspiler(KioskSQLDb)
        sct.type_info = type_info
        sql_where = sct.run(conditions)
        assert sql_where == "\"modified_by\"=$$Urap's iPad$$"
