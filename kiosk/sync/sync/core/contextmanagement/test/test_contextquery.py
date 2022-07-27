import os

import pytest
import yaml

from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from contextmanagement.contextquery import ContextQuery

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


class TestContextQuery(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config, urapdb):
        query = ContextQuery(SqlSourceInMemory(selects=["select uid, arch_context from locus",
                                                        "select uid, arch_context from unit"]))
        assert query.get_column_names() == ["uid", "arch_context"]

    def test_define_from_dict(self, urapdb_with_records):
        query = ContextQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        assert not query.distinct
        assert query.get_column_names() == ["uid", "type", "arch_context"]

        query = ContextQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            distinct: true
            columns:
                locus_type: 
                    source_field_name: "type"
                replfield_uid: 
                    source_field_name: "uid"
        """, yaml.FullLoader)
        query.define_from_dict(params)
        assert query.distinct
        assert query.get_column_names() == ["locus_type", "replfield_uid"]

        query = ContextQuery(SqlSourceInMemory(selects=["select uid, type, arch_context from locus"]))
        params = yaml.load("""
            distinct: false
        """, yaml.FullLoader)
        query.define_from_dict(params)
        assert not query.distinct
        assert query.get_column_names() == ["uid", "type", "arch_context"]
