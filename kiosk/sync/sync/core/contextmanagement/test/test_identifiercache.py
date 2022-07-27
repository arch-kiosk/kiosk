from functools import reduce

import pytest

from contextmanagement.identifiercache import IdentifierCache
from test.testhelpers import KioskPyTestHelper
import logging
import os
import kioskstdlib
from kiosksqldb import KioskSQLDb
from dsd.dsd3singleton import Dsd3Singleton

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config\config_test.yml")


class TestIdentifierCache(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb
        assert KioskSQLDb.get_record_count("collected_material", "uid") == 0

    def test_init(self, config, urapdb, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = IdentifierCache(dsd)
        assert id_cache
        assert ("collected_material", "arch_context", "uid") in id_cache._identifiers
        assert ("collected_material", "external_id", "uid") in id_cache._identifiers
        assert len(id_cache._identifiers) == 7



