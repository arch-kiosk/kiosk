import os

import pytest

from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records.sql")


class TestMemoryIdentifierCache(KioskPyTestHelper):

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

    @pytest.fixture(scope="module")
    def insert_identifiers(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)
        return urapdb

    def test_init(self, config, urapdb, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = MemoryIdentifierCache(dsd)
        assert id_cache
        assert len(id_cache._identifier_cache) == 0

    def test_init_with_data(self, config, insert_identifiers, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = MemoryIdentifierCache(dsd)
        assert id_cache
        assert len(id_cache._identifier_cache) == 251

    def test_has_identifier(self, config, insert_identifiers, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = MemoryIdentifierCache(dsd)

        assert id_cache.has_identifier("FA")
        assert id_cache.has_identifier("FA-001")
        assert id_cache.has_identifier("FA-001-1")
        assert id_cache.has_identifier("24-5-15")
        assert id_cache.has_identifier("24-5-17")

    def test_get_recording_contexts(self, config, insert_identifiers, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = MemoryIdentifierCache(dsd)
        recording_context = id_cache.get_recording_contexts("FA")[0]
        assert recording_context == ("unit", "arch_context", "uid", "c109e19c-c73c-cc49-9f58-4ba0a3ad1339")

        recording_contexts = id_cache.get_recording_contexts("24-5-17")
        assert ("collected_material", "external_id",
                "uid", "dfba68fe-d261-4167-9523-6dc8c3ba18fd") in recording_contexts
        assert ("locus", "arch_context",
                "uid", "d4f228ff-1163-4f85-aa74-b6530affae9e") in recording_contexts

        with pytest.raises(KeyError):
            recording_contexts = id_cache.get_recording_contexts("not there")

    def test_skip_index_on(self, config, insert_identifiers, shared_datadir):
        dsd = Dsd3Singleton.get_dsd3()
        id_cache = MemoryIdentifierCache(dsd)
        assert not id_cache.has_identifier('hidden-00')
        assert not id_cache.has_identifier('hidden-01')
        assert not id_cache.has_identifier('hidden-too')

