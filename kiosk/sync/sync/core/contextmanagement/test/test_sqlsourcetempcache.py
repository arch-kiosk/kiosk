import os

import pytest

from contextmanagement.contextquery import ContextQuery
from contextmanagement.sqlsource import ColumnsDontMatchError
from contextmanagement.sqlsourcetempcache import SqlSourceTempCache

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
sql_records = os.path.join(test_path, "sql", "records.sql")
more_sql_records = os.path.join(test_path, "sql", "more_records.sql")


class TestSqlSourceTempCache(KioskPyTestHelper):

    @pytest.fixture(scope="class")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="class")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture(scope="class")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb
        urapdb.close()

    def test_get_column_names(self, urapdb_with_records):
        query = SqlSourceTempCache(selects=["select uid, arch_context from locus",
                                            "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]

    def test_get_source_selects(self, urapdb_with_records):
        query = SqlSourceTempCache(selects=["select uid, arch_context from locus",
                                            "select uid, arch_context from unit"])
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit"]

    def test_add_source(self, urapdb_with_records):
        query = SqlSourceTempCache(selects=["select uid, arch_context from locus",
                                            "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]
        query2 = SqlSourceTempCache(selects=["select uid, arch_context from collected_material",
                                             "select uid, arch_context from pottery"])
        query.add_source(query2)
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit",
                                              "select uid, arch_context from collected_material",
                                              "select uid, arch_context from pottery"
                                              ]
        query3 = SqlSourceTempCache(selects=["select id, purpose from site"])
        assert query.get_column_names().sort() == ["uid", "arch_context"].sort()
        assert query3.get_column_names() == ["id", "purpose"]

        with pytest.raises(ColumnsDontMatchError):
            query.add_source(query3)

    def test_get_next_sql(self, urapdb_with_records):
        query = SqlSourceTempCache(name="test_context")
        assert query.get_next_sql() == ""

        query = SqlSourceTempCache(name="test_context", selects=["select uid, arch_context from locus",
                                                                 "select uid, arch_context from unit"])

        assert query.get_next_sql() == "select " + f"* from \"{query.name}\""
        assert query.get_next_sql() == ""

        assert query.get_next_sql(reset=True) == "select " + f"* from \"{query.name}\""
        assert query.get_next_sql() == ""

    def test_invalidate_cache(self, urapdb_with_records):
        KioskSQLDb.drop_table_if_exists("test_context", namespace="context_cache")
        sql_source = SqlSourceTempCache(selects=["select uid, arch_context from locus",
                                                 "select uid, arch_context from unit"])
        self.assert_table_empty_or_missing(sql_source.name)

        query = ContextQuery(sql_source)
        try:
            records = query.records(new_page_size=100)
            r = next(records)
            assert r
            self.assert_table(sql_source.name)

            sql_source.invalidate_cache()
            self.assert_table_isempty(sql_source.name)

        finally:
            query.close()

    def test_destroy_cache(self, urapdb_with_records):
        KioskSQLDb.drop_table_if_exists("test_context", namespace="context_cache")
        sql_source = SqlSourceTempCache(selects=["select uid, arch_context from locus",
                                                 "select uid, arch_context from unit"])
        self.assert_table_empty_or_missing(sql_source.name)

        query = ContextQuery(sql_source)
        try:
            records = query.records(new_page_size=100)
            r = next(records)
            assert r
            self.assert_table(sql_source.name)

            sql_source.destroy()
            self.assert_table_missing(sql_source.name)

        finally:
            query.close()

    def test_rebuild_cache(self, urapdb_with_records):
        sql_source = SqlSourceTempCache(name="test_context", selects=["select uid, arch_context from locus",
                                                                      "select uid, arch_context from unit"])
        sql_source.invalidate_cache()
        self.assert_table_missing("test_context", schema="context_cache")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 64
        finally:
            query.close()


        KioskSQLDb.run_sql_script(more_sql_records)
        assert KioskSQLDb.get_field_value_from_sql("c",
                                                  r"select count(*) c from (select uid from locus "
                                                  r"union select uid from unit) foo") == 66
        sql_source.build_cache()

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=200))
            assert len(r) == 66
        finally:
            query.close()

    def test_invalidate_cache_partially(self, urapdb_with_records):
        try:
            KioskSQLDb.run_sql_script(more_sql_records)
        except:
            pass
        sql_source = SqlSourceTempCache(name="test_context", selects=["select uid, arch_context from locus",
                                                                      "select uid, arch_context from unit"])
        sql_source.invalidate_cache()
        self.assert_table_empty_or_missing("test_context", schema="context_cache")
        assert sql_source.invalidate_cache(condition_field="arch_context", condition="='FI'") == 0

        query = ContextQuery(sql_source)
        r = list(query.records(new_page_size=100))
        # a temporary cache does not really do invalidate_cache. So the cache will be rebuilt at this point and
        # that means all records are back (with a permanent cache it would be down to 65)
        assert len(r) == 66

