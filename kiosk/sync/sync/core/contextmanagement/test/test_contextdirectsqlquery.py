import os
from pprint import pprint

import pytest
import yaml

from contextmanagement.cqlconstants import CqlError
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from contextmanagement.contextdirectsqlquery import ContextDirectSqlQuery


class TestContextDirectSqlQuery(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        # return self.get_config(config_file)
        return self.get_standard_test_config(__file__, test_config_file="config_test.yml")

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, cfg, urapdb):
        KioskSQLDb.run_sql_script(os.path.join(self.test_path, "sql", "records_kiosk_context.sql"))

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config, urapdb_with_records):
        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                                                 "select uid, arch_context from unit"]))
        assert query.get_column_names() == []  # before using "records" the column names are not accessible
        query.define_from_dict({"sql": " * from {base}"})
        try:
            r = next(query.records())
            assert query.get_column_names() == ["uid", "arch_context"]
        finally:
            query.close()

    def test_define_from_dict(self, urapdb_with_records):
        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))

        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            distinct: true
            columns:
                locus_type: 
                    source_field_name: "type"
                replfield_uid: 
                    source_field_name: "uid"
        """, yaml.FullLoader)
        with pytest.raises(CqlError):
            query.define_from_dict(params)

        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            sql: " * from something where something else is None"
        """, Loader=yaml.FullLoader)
        with pytest.raises(CqlError):
            query.define_from_dict(params)

        # select literal not allowed.
        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            sql: "select * from {base}"
        """, Loader=yaml.FullLoader)
        with pytest.raises(CqlError):
            query.define_from_dict(params)

        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            sql: " * from {base}"
        """, Loader=yaml.FullLoader)
        query.define_from_dict(params)

        records = list(query.records())
        assert len(records) == 6

    def test_some_sql(self, urapdb_with_records):
        query = ContextDirectSqlQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            sql: " distinct type, count(uid) from {base} where type is not null group by type"
        """, Loader=yaml.FullLoader)
        query.define_from_dict(params)

        records = list(query.records())
        pprint(records)
        assert len(records) == 2

