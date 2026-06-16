import os

import pytest

from dsl.kioskdsl import KioskDSLException
from dsl.kioskdsllupa import KioskDSLLua
from dsl.resolvers.dslluasettingsresolver import DSLLuaSettingsResolver
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_constants_file = os.path.join(test_path, r"sqls", "constants.sql")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestDSLLuaSettingsResolver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def kiosk_db(self, config):
        db = self.get_urapdb(config)
        KioskSQLDb.run_sql_script(sql_constants_file)
        return db

    # @pytest.fixture()
    # def urapdb_without_migration(self, config):
    #     return self.get_urapdb(config, migration=False)

    # @pytest.fixture()
    # def dsd(self, urapdb_without_migration):
    #     return Dsd3Singleton.get_dsd3()

    def test_init(self, config, kiosk_db):

        constants_resolver = DSLLuaSettingsResolver(config)
        dsl = KioskDSLLua()
        dsl.on_get = constants_resolver
        assert not constants_resolver.err
        assert dsl.eval("constants.settings.use_lots") == "yup"
        assert not constants_resolver.err

        with pytest.raises(KioskDSLException):
            assert dsl.eval("constants.does_not_exist.does_not_exist") is None
        assert constants_resolver.err

    def test_execute(self, config):
        constants_resolver = DSLLuaSettingsResolver(config)
        dsl = KioskDSLLua()
        dsl.on_get = constants_resolver
        assert not constants_resolver.err
        assert dsl.eval("exists('constants.settings.use_lots')")
        assert not dsl.eval("exists('constants.settings.no_such_setting')")
