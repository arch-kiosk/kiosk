import math
import os
from typing import List

import pytest
import yaml
from sqlalchemy import null
import math
import pytest

from dsl.kioskdsl import KioskDSLException
from dsl.kioskdsllupa import KioskDSLLua, LazyResolverStop
from dsl.resolvers.dslluakioskconfigresolver import DSLLuaKioskConfigResolver
from test.testhelpers import KioskPyTestHelper
from dsl.resolvers.dslluametaresolver import DSLLuaMetaResolver, NamedDSLLuaResolver

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestDSLLuaKioskConfigResolver(KioskPyTestHelper):
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

    def test_init(self, config):
        config_resolver = DSLLuaKioskConfigResolver(config)
        dsl = KioskDSLLua()
        dsl.on_get = config_resolver
        assert not config_resolver.err
        assert dsl.eval("config.project_id") == "urap"
        assert not config_resolver.err

        assert dsl.eval("kiosk.global_constants.project_short") == "URAP"
        assert not config_resolver.err

        assert dsl.eval("kiosk.global_constants.does_not_exist") is None
        assert config_resolver.err

        with pytest.raises(KioskDSLException):
            assert dsl.eval("kiosk.does_not_exist.does_not_exist") is None
        assert config_resolver.err

    def test_execute(self, config):
        config_resolver = DSLLuaKioskConfigResolver(config)
        dsl = KioskDSLLua()
        dsl.on_get = config_resolver
        assert not config_resolver.err
        assert dsl.eval("config.project_id") == "urap"
        assert not dsl.eval("exists('config.x_project_id')")
