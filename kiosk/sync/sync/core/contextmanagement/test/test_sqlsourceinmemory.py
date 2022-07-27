import pytest

from test.testhelpers import KioskPyTestHelper
import logging
import os
import kioskstdlib
from kiosksqldb import KioskSQLDb
from dsd.dsd3singleton import Dsd3Singleton
from contextmanagement.sqlsource import ColumnsDontMatchError
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records.sql")


class TestSqlSourceInMemory(KioskPyTestHelper):

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

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test_get_column_names(self, urapdb_with_records):
        query = SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                           "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]

    def test_get_source_selects(self, urapdb_with_records):
        query = SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                           "select uid, arch_context from unit"])
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit"]

    def test_add_source(self, urapdb_with_records):
        query = SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                           "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]
        query2 = SqlSourceInMemory(selects=["select uid, arch_context from collected_material",
                                            "select uid, arch_context from pottery"])
        query.add_source(query2)
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit",
                                              "select uid, arch_context from collected_material",
                                              "select uid, arch_context from pottery"
                                              ]
        query3 = SqlSourceInMemory(selects=["select id, purpose from site"])
        assert query.get_column_names().sort() == ["uid", "arch_context"].sort()
        assert query3.get_column_names() == ["id", "purpose"]

        with pytest.raises(ColumnsDontMatchError):
            query.add_source(query3)

    def test_get_next_sql(self, urapdb_with_records):
        query = SqlSourceInMemory()
        assert query.get_next_sql() == ""

        query = SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                           "select uid, arch_context from unit"])

        assert query.get_next_sql() == "select uid, arch_context from locus"
        assert query.get_next_sql() == "select uid, arch_context from unit"
        assert query.get_next_sql() == ""

        assert query.get_next_sql(reset=True) == "select uid, arch_context from locus"
        assert query.get_next_sql() == "select uid, arch_context from unit"
        assert query.get_next_sql() == ""
