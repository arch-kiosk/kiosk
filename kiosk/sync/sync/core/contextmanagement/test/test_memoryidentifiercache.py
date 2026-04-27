import os
from unittest.mock import MagicMock, patch

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

    @pytest.fixture
    def mock_cache_manager(self, config):
        # We patch 'rebuild_cache' so that when we instantiate the class,
        # it doesn't actually try to connect to KioskSQLDb.
        with patch.object(MemoryIdentifierCache, 'rebuild_cache', return_value=0):
            # Pass whatever args your actual parent class needs,
            # or leave empty if it handles *args/**kwargs gracefully.
            dsd = Dsd3Singleton.get_dsd3()
            instance = MemoryIdentifierCache(dsd)
            return instance

    def test_list_non_unique_identifiers(self, mock_cache_manager):
        # Setup:
        # UID is index 0, IDX is index 1
        mock_cache_manager._identifier_cache = {
            "ID_ALPHA": [
                ("uid_1", 100),
                ("uid_2", 200),
                ("uid_3", 100)  # Duplicate IDX 100
            ],
            "ID_BETA": [
                ("uid_4", 500),
                ("uid_5", 500),
                ("uid_6", 500)  # Triplicate IDX 500
            ]
        }

        result = mock_cache_manager.list_non_unique_identifiers()

        assert result["ID_ALPHA"] == {100}
        assert result["ID_BETA"] == {500}
        assert len(result) == 2

    def test_list_non_unique_identifiers_with_mixed_uniques(self, mock_cache_manager):
        # Setup: One duplicate, one completely unique
        mock_cache_manager._identifier_cache = {
            "ID_GAMMA": [("uid_7", 10), ("uid_8", 10), ("uid_9", 20)],  # 10 is dup, 20 is unique
            "ID_DELTA": [("uid_10", 99)]  # Totally unique
        }

        result = mock_cache_manager.list_non_unique_identifiers()

        assert result["ID_GAMMA"] == {10}
        assert "ID_DELTA" not in result
        assert len(result) == 1

    def test_list_non_unique_identifiers_empty_cache(self, mock_cache_manager):
        mock_cache_manager._identifier_cache = {}
        result = mock_cache_manager.list_non_unique_identifiers()
        assert result == {}

    def test_list_non_unique_identifiers_multiple_distinct_duplicates(self, mock_cache_manager):
        # Setup: One ID has two different index types that both duplicate
        mock_cache_manager._identifier_cache = {
            "ID_EPSILON": [
                ("u1", 1), ("u2", 1),  # Pair 1
                ("u3", 2), ("u4", 2),  # Pair 2
                ("u5", 3)  # Unique
            ]
        }

        result = mock_cache_manager.list_non_unique_identifiers()

        assert result["ID_EPSILON"] == {1, 2}