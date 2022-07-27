import os

import pytest

from contextmanagement.contextquery import ContextQuery
from contextmanagement.sqlsource import ColumnsDontMatchError
from contextmanagement.sqlsourcecached import SqlSourceCached
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records.sql")
more_sql_records = os.path.join(test_path, "sql", "more_records.sql")


class TestSqlSourceCached(KioskPyTestHelper):

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
        query = SqlSourceCached(selects=["select uid, arch_context from locus",
                                         "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]

    def test_get_source_selects(self, urapdb_with_records):
        query = SqlSourceCached(selects=["select uid, arch_context from locus",
                                         "select uid, arch_context from unit"])
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit"]

    def test_add_source(self, urapdb_with_records):
        query = SqlSourceCached(selects=["select uid, arch_context from locus",
                                         "select uid, arch_context from unit"])
        assert query.get_column_names() == ["uid", "arch_context"]
        query2 = SqlSourceCached(selects=["select uid, arch_context from collected_material",
                                          "select uid, arch_context from pottery"])
        query.add_source(query2)
        assert query.get_source_selects() == ["select uid, arch_context from locus",
                                              "select uid, arch_context from unit",
                                              "select uid, arch_context from collected_material",
                                              "select uid, arch_context from pottery"
                                              ]
        query3 = SqlSourceCached(selects=["select id, purpose from site"])
        assert query.get_column_names().sort() == ["uid", "arch_context"].sort()
        assert query3.get_column_names() == ["id", "purpose"]

        with pytest.raises(ColumnsDontMatchError):
            query.add_source(query3)

    def test_get_next_sql(self, urapdb_with_records):
        query = SqlSourceCached(name="test_context")
        assert query.get_next_sql() == ""

        query = SqlSourceCached(name="test_context", selects=["select uid, arch_context from locus",
                                                              "select uid, arch_context from unit"])

        assert query.get_next_sql() == "select " + "* from \"context_cache\".\"test_context\""
        assert query.get_next_sql() == ""

        assert query.get_next_sql(reset=True) == "select " + "* from \"context_cache\".\"test_context\""
        assert query.get_next_sql() == ""

    def test_invalidate_cache(self, urapdb_with_records):
        KioskSQLDb.drop_table_if_exists("test_context", namespace="context_cache")
        sql_source = SqlSourceCached(name="test_context", selects=["select uid, arch_context from locus",
                                                                   "select uid, arch_context from unit"])
        self.assert_table_empty_or_missing("test_context", schema="context_cache")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 64

            sql_source.invalidate_cache()
            self.assert_empty_table("test_context", schema="context_cache")

        finally:
            query.close()

    def test_destroy_cache(self, urapdb_with_records):
        KioskSQLDb.drop_table_if_exists("test_context", namespace="context_cache")
        sql_source = SqlSourceCached(selects=["select uid, arch_context from locus",
                                              "select uid, arch_context from unit"])
        self.assert_table_empty_or_missing(sql_source.name)

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 64

            sql_source.destroy()
            self.assert_table_missing(sql_source.name)

        finally:
            query.close()

    def test_rebuild_cache(self, urapdb_with_records):
        sql_source = SqlSourceCached(name="test_context", selects=["select uid, arch_context from locus",
                                                                   "select uid, arch_context from unit"])
        sql_source.invalidate_cache()
        self.assert_table_empty_or_missing("test_context", schema="context_cache")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 64
        finally:
            query.close()

        KioskSQLDb.run_sql_script(more_sql_records)

        sql_source.build_cache()

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 66
        finally:
            query.close()

    def test_invalidate_cache_partially(self, urapdb_with_records):
        try:
            KioskSQLDb.run_sql_script(more_sql_records)
        except:
            pass
        sql_source = SqlSourceCached(name="test_context", selects=["select uid, arch_context from locus",
                                                                   "select uid, arch_context from unit"])
        sql_source.invalidate_cache()
        self.assert_table_empty_or_missing("test_context", schema="context_cache")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 66
        finally:
            query.close()

        assert sql_source.invalidate_cache(condition_field="arch_context", condition="='FI'") == 1

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 65
        finally:
            query.close()

    def test_rebuild_cache_partially(self, urapdb_with_records):
        try:
            KioskSQLDb.run_sql_script(more_sql_records)
        except:
            pass
        sql_source = SqlSourceCached(name="test_context", selects=["select uid, arch_context from locus",
                                                                   "select uid, arch_context from unit"])
        sql_source.invalidate_cache()
        self.assert_table_empty_or_missing("test_context", schema="context_cache")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 66
        finally:
            query.close()

        assert KioskSQLDb.get_field_value_from_sql("arch_context", "select " +
                                                  f"\"arch_context\" "
                                                  f"from \"context_cache\".\"test_context\" where "
                                                  f"\"uid\" = 'a10df3cb-e68b-4ce7-b456-9ea3d636d933'") != 'PLG-001'

        KioskSQLDb.execute("update locus set arch_context = 'PLG-001' where uid='a10df3cb-e68b-4ce7-b456-9ea3d636d933'")
        sql_source.build_cache(condition_field="uid", condition="='a10df3cb-e68b-4ce7-b456-9ea3d636d933'")

        query = ContextQuery(sql_source)
        try:
            r = list(query.records(new_page_size=100))
            assert len(r) == 66
        finally:
            query.close()

        assert KioskSQLDb.get_field_value_from_sql("arch_context", "select " +
                                                  f"\"arch_context\" "
                                                  f"from \"context_cache\".\"test_context\" where "
                                                  f"\"uid\" = 'a10df3cb-e68b-4ce7-b456-9ea3d636d933'") == 'PLG-001'

