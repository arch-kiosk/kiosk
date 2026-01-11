import math
import os

import pytest
import yaml
from sqlalchemy import null
import math
import pytest

from dsl.kioskdsl import KioskDSLException
from test.testhelpers import KioskPyTestHelper
from dsl.kioskdsllupa import KioskDSLLuaResolver

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskDSLLuaResolver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    # @pytest.fixture(scope="module")
    # def urapdb(self, config):
    #     return self.get_urapdb(config)
    #
    # @pytest.fixture()
    # def urapdb_without_migration(self, config):
    #     return self.get_urapdb(config, migration=False)
    #
    # @pytest.fixture()
    # def dsd(self, urapdb_without_migration):
    #     return Dsd3Singleton.get_dsd3()

    @pytest.mark.parametrize("input_str, expected", [
        # Basic cases
        ("x.y.z", ["x", "y", "z"]),
        ("x", ["x"]),
        ("", []),

        # Strings
        ('x."y.z".w', ['x', '"y.z"', 'w']),
        ("x.'y.z'.w", ["x", "'y.z'", "w"]),
        ('x"y.z"w', ['x"y.z"w']),  # No dot outside string

        # Brackets
        ('x["y.z"].w', ['x["y.z"]', 'w']),
        ('x[y.z].w', ['x[y.z]', 'w']),
        ('x{y.z}.w', ['x{y.z}', 'w']),
        ('x([y.z]).w', ['x([y.z])', 'w']),

        # Nested brackets
        ('x[[y.z]].w', ['x[[y.z]]', 'w']),
        ('x[{y.z}].w', ['x[{y.z}]', 'w']),
        ('x([{y.z}]).w', ['x([{y.z}])', 'w']),

        # Escaped quotes in strings
        ('x."y\\".z".w', ['x', '"y\\".z"', 'w']),
        ("x.'y\\'.z'.w", ["x", "'y\\'.z'", "w"]),

        # Mixed
        ('x["y.z"].w["a.b"].c', ['x["y.z"]', 'w["a.b"]', 'c']),
        ('x.y["z.w"].u.v', ['x', 'y["z.w"]', 'u', 'v']),
        ('x.y.z.w', ['x', 'y', 'z', 'w']),

        # Kiosk
        ('unit.calc(12)', ['unit', 'calc(12)']),
    ])
    def test_split_lua_dot_notation(self, input_str, expected):
        assert KioskDSLLuaResolver.split_lua_dot_notation(input_str) == expected