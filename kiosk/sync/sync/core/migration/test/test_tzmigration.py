import time

import pytest
import psycopg2
import os
import logging

from dsd.dsd3singleton import Dsd3Singleton
from test import testhelpers
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

from dsd.dsd3 import DataSetDefinition
from migration.tzmigration import TZMigration
from migration.postgresdbmigration import PostgresDbMigration
from dsd.dsdyamlloader import DSDYamlLoader

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")

data_dir = os.path.join(test_path, 'data')
dsd_file = r'dsd3.yml'
dsd_v2_file = r'dsd3_v2.yml'


class TestTZMigration(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config,migration_catalog_name="kiosk_migration_catalog")

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_migrate_table(self, config, db, dsd):
        assert KioskSQLDb.does_table_exist("unit_narrative")
        KioskSQLDb.drop_table_if_exists("unit_narrative")
        create_sql = "create " + """table unit_narrative
            (
                id_unit      text,
                id_excavator text,
                narrative    text,
                date         timestamp,
                uid          uuid    default public.gen_random_uuid() not null
                    primary key,
                created      timestamp                                not null,
                modified     timestamp,
                modified_by  text,
                repl_deleted boolean default false,
                repl_tag     integer,
                uid_unit     uuid,
                fts          tsvector generated always as ((
                    (setweight(to_tsvector('english'::regconfig, COALESCE(id_unit, ''::text)), 'B'::"char") ||
                     setweight(to_tsvector('english'::regconfig, COALESCE(id_excavator, ''::text)), 'B'::"char")) ||
                    setweight(to_tsvector('english'::regconfig, COALESCE(narrative, ''::text)), 'B'::"char"))) stored
            );
            
        """
        assert KioskSQLDb.execute(create_sql)
        tz_migration = TZMigration(config, dsd)
        fields = tz_migration.dbAdapter._adapter_get_database_table_field_names("unit_narrative")
        for field in ["date", "created", "modified"]:
            record = KioskSQLDb.get_first_record_from_sql(f"""select data_type 
                        from information_schema.columns where table_name = 'unit_narrative' and column_name = '{field}'""")
            assert record[0] == "timestamp without time zone"
            assert f"{field}_tz" not in fields

        assert tz_migration.migrate_table("unit_narrative") == 3

        fields = tz_migration.dbAdapter._adapter_get_database_table_field_names("unit_narrative")
        for field in ["date", "created", "modified"]:
            record = KioskSQLDb.get_first_record_from_sql(f"""select data_type 
                        from information_schema.columns where table_name = 'unit_narrative' and column_name = '{field}'""")
            assert record[0] == "timestamp with time zone"
            assert f"{field}_tz" in fields

        assert tz_migration.migrate_table("unit_narrative") == 0

    def test_tz_migrate(self, config, db, dsd):
        assert KioskSQLDb.does_table_exist("unit_narrative")
        KioskSQLDb.drop_table_if_exists("unit_narrative")
        create_sql = "create " + """table unit_narrative
            (
                id_unit      text,
                id_excavator text,
                narrative    text,
                date         timestamp,
                uid          uuid    default public.gen_random_uuid() not null
                    primary key,
                created      timestamp                                not null,
                modified     timestamp,
                modified_by  text,
                repl_deleted boolean default false,
                repl_tag     integer,
                uid_unit     uuid,
                fts          tsvector generated always as ((
                    (setweight(to_tsvector('english'::regconfig, COALESCE(id_unit, ''::text)), 'B'::"char") ||
                     setweight(to_tsvector('english'::regconfig, COALESCE(id_excavator, ''::text)), 'B'::"char")) ||
                    setweight(to_tsvector('english'::regconfig, COALESCE(narrative, ''::text)), 'B'::"char"))) stored
            );

        """
        assert KioskSQLDb.execute(create_sql)
        tz_migration = TZMigration(config, dsd)
        fields = tz_migration.dbAdapter._adapter_get_database_table_field_names("unit_narrative")
        for field in ["date", "created", "modified"]:
            record = KioskSQLDb.get_first_record_from_sql(f"""select data_type 
                        from information_schema.columns where table_name = 'unit_narrative' and column_name = '{field}'""")
            assert record[0] == "timestamp without time zone"
            assert f"{field}_tz" not in fields

        tz_migration.run()

        fields = tz_migration.dbAdapter._adapter_get_database_table_field_names("unit_narrative")
        for field in ["date", "created", "modified"]:
            record = KioskSQLDb.get_first_record_from_sql(f"""select data_type 
                        from information_schema.columns where table_name = 'unit_narrative' and column_name = '{field}'""")
            assert record[0] == "timestamp with time zone"
            assert f"{field}_tz" in fields

