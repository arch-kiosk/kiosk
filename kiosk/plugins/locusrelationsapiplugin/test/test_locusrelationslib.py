import os

import pytest

import yaml

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from plugins.locusrelationsapiplugin.locusrelationslib import LocusRelations
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
records_sql = os.path.join(test_path, r"sql", "records.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestLocusRelations(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        try:
            os.remove(log_file)
        except BaseException as e:
            pass
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def db_with_records(self, db):
        KioskSQLDb.run_sql_script(records_sql)
        return db

    @pytest.fixture()
    def db_without_migration(self, config):
        return self.get_urapdb(config, migration=False)

    @pytest.fixture()
    def dsd(self, db_without_migration):
        return Dsd3Singleton.get_dsd3()

    def test_get_direct_relations(self, config, dsd, db_with_records):
        assert KioskSQLDb.get_first_record_from_sql("select uid from locus_relations")
        lr = LocusRelations("unit", "H", dsd)
        relations = lr.get_direct_relations()
        assert relations
        assert len(relations) == 192

    def test_get_all_relations_for_a_locus(self, config, dsd, db_with_records):
        assert KioskSQLDb.get_first_record_from_sql("select uid from locus_relations")
        lr = LocusRelations("locus", "SU23-H037", dsd)
        relations = lr.get_all_relations()
        assert relations
        assert len(relations) == 192

    def test_get_all_relations_for_a_unit(self, config, dsd, db_with_records):
        assert KioskSQLDb.get_first_record_from_sql("select uid from locus_relations")
        lr = LocusRelations("unit", "H", dsd)
        relations = lr.get_all_relations()
        assert relations
        assert len(relations) == 192
        print(relations[0])
        print(relations[1])
