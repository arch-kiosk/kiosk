import math
import os
from typing import List

import pytest
import yaml
from sqlalchemy import null
import math
import pytest

from dsd.dsd3singleton import Dsd3Singleton
from dsl.kioskdsl import KioskDSLException
from dsl.kioskdsllupa import KioskDSLLua, LazyResolverStop
from dsl.resolvers.dslluakioskconfigresolver import DSLLuaKioskConfigResolver
from dsl.resolvers.dslluakioskdsdresolver import DSLLuaKioskDSDResolver
from test.testhelpers import KioskPyTestHelper
from dsl.resolvers.dslluametaresolver import DSLLuaMetaResolver, NamedDSLLuaResolver

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestDSLLuaMetaResolver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    # @pytest.fixture(scope="module")
    # def urapdb(self, config):
    #     return self.get_urapdb(config)
    #
    @pytest.fixture()
    def urapdb_without_migration(self, config):
        return self.get_urapdb(config, migration=False)
    #
    @pytest.fixture()
    def dsd(self, urapdb_without_migration):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config):
        class TestResolver(NamedDSLLuaResolver):
            def resolve(self, path_elements: List):
                if path_elements[0] == "x":
                    return 42
                raise LazyResolverStop


        meta_resolver = DSLLuaMetaResolver([TestResolver("test")])
        dsl = KioskDSLLua()
        dsl.on_get = meta_resolver
        assert dsl.eval("test.x") == 42
        with pytest.raises(KioskDSLException, match="index a nil value"):
            assert dsl.eval("nix.x") == 42

    def test_config_resolver(self, config):
        config_resolver = DSLLuaKioskConfigResolver(config)
        meta_resolver = DSLLuaMetaResolver([config_resolver])

        dsl = KioskDSLLua()
        dsl.on_get = meta_resolver
        assert not meta_resolver.err
        assert dsl.eval("config.config.project_id") == "urap"
        assert not meta_resolver.err

        assert dsl.eval("config.kiosk.global_constants.project_short") == "URAP"
        assert not meta_resolver.err

        assert dsl.eval("config.kiosk.global_constants.does_not_exist") is None
        assert meta_resolver.err

        with pytest.raises(KioskDSLException):
            assert dsl.eval("config.kiosk.does_not_exist.does_not_exist") is None
        assert meta_resolver.err

    def test_execute(self, config):
        config_resolver = DSLLuaKioskConfigResolver(config)
        dsl = KioskDSLLua()
        dsl.on_get = config_resolver
        assert not config_resolver.err
        assert dsl.eval("config.project_id") == "urap"

    def test_multi_resolvers(self, config, dsd):
        config_resolver = DSLLuaKioskConfigResolver(config)
        dsd_resolver = DSLLuaKioskDSDResolver(dsd)
        meta_resolver = DSLLuaMetaResolver([config_resolver, dsd_resolver])

        dsl = KioskDSLLua()
        dsl.on_get = meta_resolver
        assert not meta_resolver.err
        assert dsl.eval("config.config.project_id") == "urap"
        assert not meta_resolver.err

    def test_multi_resolvers_execute(self, config, dsd):
        config_resolver = DSLLuaKioskConfigResolver(config)
        dsd_resolver = DSLLuaKioskDSDResolver(dsd)
        meta_resolver = DSLLuaMetaResolver([config_resolver, dsd_resolver])

        dsl = KioskDSLLua()
        dsl.on_get = meta_resolver

        assert dsl.eval("config.exists('config.project_id')")
        assert not dsl.eval("config.exists('config.x_project_id')")

        assert dsl.eval("DSD.exists('locus')")
        assert not meta_resolver.err

        assert not dsl.eval("DSD.exists('no_table')")
        assert not meta_resolver.err

        with pytest.raises(KioskDSLException):
            assert not dsl.eval("DSD.f_exists('no_table')")
        assert meta_resolver.err

        assert dsl.eval("DSD.exists('locus.uid')")
        assert not meta_resolver.err

        assert dsl.eval("DSD.exists('locus.replfield_uuid()')")
        assert not meta_resolver.err

        # assert not dsl.eval("DSD.exists('su_ceramics_preprocessing_entry')")
