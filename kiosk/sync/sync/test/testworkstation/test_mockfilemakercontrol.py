import os
import pprint
import shutil
import datetime

import pytest

from dsd.dsd3 import DataSetDefinition
from filemakerrecording.mockfilemakercontrol import FileMakerControlMock, MockWorkstation
from kiosksqldb import KioskSQLDb
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from test.testhelpers import KioskPyTestHelper

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from tz.kiosktimezoneinstance import KioskTimeZoneInstance
# from tz.kiosktimezones import KioskTimeZones
from test.mock_timezoneinfo import mock_kiosk_time_zones, KioskTimeZones
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from workstation import Workstation, Dock

test_dir = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_dir, r"data\config\config_test.yml")
log_file = os.path.join(test_dir, r"log\test.log")


class TestMockFileMakerControl(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def db(self, config):
        assert KioskSQLDb.drop_database()
        assert KioskSQLDb.create_database()

    @pytest.fixture()
    def migrated_db(self, config, db):
        dsd = Dsd3Singleton.get_dsd3()
        dsd.append_file(config.dsdfile)
        migration = Migration(dsd, PostgresDbMigration(dsd, KioskSQLDb.get_con()))
        migration.self_check()
        migration.migrate_dataset()
        KioskSQLDb.commit()

    def test_postgres_connections(self, config, db):
        assert config
        assert KioskSQLDb.get_default_time_zone() == "UTC"

    def test_migration(self, config, migrated_db):
        assert config
        assert KioskSQLDb.get_default_time_zone() == "UTC"
        assert KioskSQLDb.does_table_exist("migration_catalog")

    def test_start_fm_database(self, config, db, shared_datadir):
        ws = MockWorkstation("testdock", "test dock")
        fm = FileMakerControlMock()
        assert fm.start_fm_database(ws, "import", use_odbc_ini_dsn=True)
        assert fm.opened_filename == os.path.join(shared_datadir, "filemaker", "from_work_station", "testdock",
                                                  "recording_v12.fmp12")

    def test_select_table_data(self, config, db, mocker):
        ws = MockWorkstation("testdock", "test dock")
        fm = FileMakerControlMock()
        assert fm.start_fm_database(ws, "import", use_odbc_ini_dsn=True)

        dsd = DataSetDefinition()
        mocker.patch.object(dsd, "list_fields",
                            lambda tablename, version=0: {
                                "test_table": ["field1", "field2", "field2_tz"],
                            }[tablename])
        mocker.patch.object(dsd, "omit_fields_by_datatype",
                            lambda tablename, _, __: {
                                "test_table": ["field1", "field2"],
                            }[tablename])

        KioskSQLDb.execute("create table test_table(field1 varchar, field2 varchar, field3 varchar)")
        cur = fm.select_table_data(dsd, "test_table")
        colnames = [desc[0] for desc in cur.description]
        assert colnames == ["field1", "field2"]

    def test_getfieldvalue(self, config, db, mocker):
        ws = MockWorkstation("testdock", "test dock")
        fm = FileMakerControlMock()
        assert fm.start_fm_database(ws, "import", use_odbc_ini_dsn=True)

        dsd = DataSetDefinition()
        mocker.patch.object(dsd, "list_fields",
                            lambda tablename, version=0: {
                                "test_table": ["field1", "field2", "field2_tz"],
                            }[tablename])
        mocker.patch.object(dsd, "omit_fields_by_datatype",
                            lambda tablename, _, __: {
                                "test_table": ["field1", "field2"],
                            }[tablename])

        KioskSQLDb.execute("create table test_table(field1 varchar, field2 varchar, field2_tz varchar)")
        KioskSQLDb.execute("insert into test_table values('r1f1', 'r1f2', 'r1f3')")
        KioskSQLDb.execute("insert into test_table values('r2f1', 'r2f2', 'r2f3')")
        cur = fm.select_table_data(dsd, "test_table")
        r = cur.fetchone()
        r_c = 1
        while r:
            for idx, f in enumerate(["field1", "field2"]):
                assert fm.getfieldvalue(r, f) == f"r{r_c}f{idx+1}"
            r_c += 1
            r = cur.fetchone()


