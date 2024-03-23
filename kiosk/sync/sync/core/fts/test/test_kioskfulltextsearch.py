import os

import pytest
import logging

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper

from fts.kioskfulltextsearch import FTS
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(test_path, r"log", "test_log.log")
records_sql = os.path.join(test_path, r"sql", "records.sql")


class TestFTS(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file="test_kiosk_config.yml")

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def dsd(self, cfg):
        Dsd3Singleton.release_dsd3()
        return self.get_dsd(cfg)

    def test_init(self, dsd, cfg):
        fts = FTS(dsd, cfg)
        assert fts

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(records_sql)
        return urapdb

    def test_search(self, dsd, cfg, urapdb_with_records):
        fts = FTS(dsd, cfg)
        assert fts.rebuild_fts()
        assert fts.ready()
        KioskSQLDb.commit()
        result = fts.search("loose soil", 10)
        assert len(result) == 1
        assert result[0].record_type == "locus"
        assert result[0].identifier == "24-5-17"

    def test_search_with_excerpt(self, dsd, cfg, urapdb_with_records):
        fts = FTS(dsd, cfg)
        assert fts.rebuild_fts()
        assert fts.ready()
        KioskSQLDb.commit()
        result = fts.search("loose soil", 10, with_excerpts=True)
        assert len(result) == 1
        assert result[0].record_type == "locus"
        assert result[0].identifier == "24-5-17"
        assert result[0].excerpt.strip() == "type: dp   description: <b>loose</b> <b>soil</b>     arch_context: 24-5-17"
