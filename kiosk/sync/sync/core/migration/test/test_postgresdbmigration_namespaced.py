import pytest
import os
from test import testhelpers
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

import psycopg2
from dsd.dsd3 import DataSetDefinition

from migration.postgresdbmigration import PostgresDbMigration
from migration.databasemigration import DatabaseMigration
import psycopg2.extras

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")

data_path = os.path.join(test_path, "data")

dsd_file = r'dsd3.yml'

log_file = os.path.join(test_path, "log", "test_migration.log")


def get_first_record(con, table, field=None, value=None, orderby=None):
    rc = None

    cur = con.cursor()
    try:
        if cur:
            if field and value:
                sql = "select * from \"" + table + "\" where \"" + field + "\" = %s"
            else:
                sql = "select * from \"" + table + "\""

            if orderby:
                sql = sql + " order by " + orderby
            sql = sql + " limit 1;"
            if value:
                cur.execute(sql, [value])
            else:
                cur.execute(sql, [])

            rc = cur.fetchone()
    finally:
        try:
            cur.close()
        except:
            pass

    return rc


def get_table_structure_info(con, table, schema, field):
    sql = f"select * " \
          f"from INFORMATION_SCHEMA.COLUMNS where table_name = '{table}' and table_schema='{schema}' and column_name='{field}';"
    r = None
    try:
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)

        if cur:
            cur.execute(sql)
            r = cur.fetchone()
            cur.close()
    finally:
        cur.close()

    return r


class TestPostgresDbMigrationNamespaced(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        cfg = self.get_config(config_file=config_file, log_file=log_file)
        assert cfg
        cfg.dsdfile = os.path.join(data_path, dsd_file)
        cur = self.get_urapdb(cfg, migration=False)
        cur.close()
        yield KioskSQLDb.get_con(autocommit=True)
        KioskSQLDb.close_connection()

    @pytest.fixture()
    def pg_migration(self, db) -> PostgresDbMigration:
        dsd = DataSetDefinition()
        dsd.append({"config": {
            "format_version": 3},
            "migration_catalog": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "uuid_key()"],
                        "table": ["datatype('TEXT')", "not_null()", "unique()"],
                        "table_definition": ["datatype('TEXT')", "not_null()"],
                        "namespace": ["datatype('TEXT')", 'default("\'\'")'],
                        "version": ["datatype('INT')", "not_null()"]
                    }
                }
            },
            "migration_flags": {
                "meta": {
                    "flags": ["system_table"]
                },
                "structure": {
                    "1": {
                        "uid": ["datatype('UUID')", "uuid_key()"],
                        "flag": ["datatype('TEXT')", "not_null()", "unique()"],
                        "value": ["datatype('TEXT')", "not_null()"]

                    }
                }
            }
        }
        )
        pg_migration = PostgresDbMigration(dsd, db)
        assert pg_migration
        return pg_migration

    @pytest.fixture()
    def pg_migration_with_test_table(self, pg_migration):
        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "uuid_key()"],
                    }
                }
            }
        })
        return pg_migration

    def test_init(self, db, pg_migration):
        assert db
        assert pg_migration

    def db_execute(self, con, sql: str):
        cur = con.cursor()
        try:
            cur.execute(sql)
        finally:
            cur.close()

    def test_adapter_table_exists(self, db, pg_migration):
        self.db_execute(db, "drop table if exists test_schema.testtable;")
        assert not pg_migration._adapter_table_exists("testtable", namespace="test_schema")
        self.db_execute(db, """
        create schema IF NOT EXISTS \"test_schema\";
        create table \"test_schema\".\"testtable\" (
                id int
            );
        """)

        assert pg_migration._adapter_table_exists("testtable", namespace="test_schema")
        self.db_execute(db, "drop table if exists test_schema.testtable;")

    def test_get_table_structure_version(self, db, pg_migration_with_test_table):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration_with_test_table.get_table_structure_version("test", namespace="test_schema") == 0
        assert pg_migration_with_test_table._adapter_table_exists("migration_catalog")

        assert pg_migration_with_test_table.get_table_structure_version("migration_catalog") == 1
        assert pg_migration_with_test_table.create_table("test", namespace="test_schema")
        assert not pg_migration_with_test_table.get_table_structure_version("test") == 1
        assert pg_migration_with_test_table.get_table_structure_version("test", namespace="test_schema") == 1

    def test_adapter_drop_table(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table
        assert pgm._adapter_drop_table("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0

        assert not pgm._adapter_table_exists("test", namespace="test_schema")
        assert pgm.create_table("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        assert pgm._adapter_drop_table("test", namespace="test_schema")
        assert not pgm._adapter_table_exists("test", "test_schema")

    def test__adapter_delete_from_migration_catalog(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.create_table("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        assert pgm._adapter_delete_from_migration_catalog("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0

    def test_reverse_engineer_datatable(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        # should succeed if table does not exist in the database
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema")

        # should fail if table in db does not match the dsd structure
        self.db_execute(db, "create table \"test_schema\".\"test\" (\"some_field\" varchar);")
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        assert not pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")

        # should succeed after table exists according to the dsd structure
        assert pgm.create_table("test", namespace="test_schema")
        self.db_execute(db, "truncate \"migration_catalog\";")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        # should succeed if table is already listed in migration catalog
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema")

    def test_reverse_engineer_datatable_all_versions(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        # should succeed if table does not exist in the database
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema", current_version_only=False)

        # should fail if table in db does not match the dsd structure
        self.db_execute(db, "create table \"test_schema\".\"test\" (\"some_field\" varchar);")
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        assert not pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema", current_version_only=False)
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")

        # should succeed after table exists according to the dsd structure
        assert pgm.create_table("test", namespace="test_schema")
        self.db_execute(db, "truncate \"migration_catalog\";")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema", current_version_only=False)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        # should succeed if table is already listed in migration catalog
        assert pgm.reverse_engineer_table(pgm.dsd, "test", "test_schema", current_version_only=False)

    def test_reverse_engineer_datatable_prefixed(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"x1_test\";")
        pgm = pg_migration_with_test_table

        # should succeed if table does not exist in the database
        assert pgm.get_table_structure_version("x1_test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", namespace="test_schema", prefix="x1_")

        # should fail if table in db does not match the dsd structure
        self.db_execute(db, "create table \"test_schema\".\"x1_test\" (\"some_field\" varchar);")
        assert pgm._adapter_table_exists("x1_test", namespace="test_schema")
        assert not pgm.reverse_engineer_table(pgm.dsd, "test", namespace="test_schema", prefix="x1_")
        self.db_execute(db, "drop table if exists \"test_schema\".\"x1_test\";")

        # should succeed after table exists according to the dsd structure
        assert pgm.create_table("test", namespace="test_schema", db_table="x1_test")
        self.db_execute(db, "truncate \"migration_catalog\";")
        assert pgm.get_table_structure_version("x1_test", namespace="test_schema") == 0
        assert pgm.reverse_engineer_table(pgm.dsd, "test", namespace="test_schema", prefix="x1_")
        assert pgm.get_table_structure_version("x1_test", namespace="test_schema") == 1

        # should succeed if table is already listed in migration catalog
        assert pgm.reverse_engineer_table(pgm.dsd, "test", namespace="test_schema", prefix="x1_")

    def test_drop_table(self, db, pg_migration_with_test_table):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        assert pgm.get_table_structure_version("migration_catalog") == 1
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0
        assert pgm.create_table("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert pgm.drop_table("test")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert pgm.drop_table("test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 0

    def test_create_with_schema(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        assert not pgm._adapter_table_exists("test", namespace="test_schema")
        with capsys.disabled():
            assert pgm.create_table(dsd_table="test", db_table="test",
                                    namespace="test_schema", version=1, sync_tools=True)
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        self.db_execute(db, "drop table test_schema.test;")
        with capsys.disabled():
            with pytest.raises(Exception):
                assert pgm.create_temporary_table(dsd_table="test", db_table="test",
                                                  namespace="test_schema", version=1)

    def test_migrate_create(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        assert not pgm._adapter_table_exists("test", namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        self.db_execute(db, "drop table test_schema.test;")
        with capsys.disabled():
            with pytest.raises(Exception):
                assert pgm.create_temporary_table(dsd_table="test", db_table="test",
                                                  namespace="test_schema", version=1)

    def test_migrate_add_field(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "description": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["add('description')"]
                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2

    def test_migrate_drop_field(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["drop('description')"]
                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2

    def test_migrate_rename_field(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "description": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["rename('test_description', 'description')"]
                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2

    def test_migrate_rename_fields(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test description 1": ["datatype('TEXT')", "default(\"''\")"],
            "test description 2": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test description 1": ["datatype('TEXT')", "default(\"''\")"],
            "test description 2": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "test_description_1": ["datatype('TEXT')", "default(\"''\")"],
                "test_description_2": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": [
            "rename('test description 1', 'test_description_1')",
            "rename('test description 2', 'test_description_2')"]
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2

    def test_migrate_change_field_add_modify_attributes(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ["datatype(TEXT)", "unique()"],
            "description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        field_info = get_table_structure_info(db, "test", "test_schema", "name")
        assert not field_info["column_default"]
        assert field_info["is_nullable"] == "YES"
        field_info = get_table_structure_info(db, "test", "test_schema", "description")
        assert field_info["column_default"] == "''::text"
        assert field_info["is_nullable"] == "YES"

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ["datatype(TEXT)", "unique()"],
            "description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
            ,
            2: {
                "name": ['datatype(VARCHAR)', "unique()", "not_null()", "default(\"''\")"],
                "description": ["datatype('VARCHAR', 10)", "default(\"'def_descr'\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["alter('description')", "alter('name')"]}
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2

        field_info = get_table_structure_info(db, "test", "test_schema", "name")
        assert field_info["column_default"] == "''::character varying"
        assert field_info["is_nullable"] == "NO"

        field_info = get_table_structure_info(db, "test", "test_schema", "description")
        assert field_info["column_default"] == "'def_descr'::character varying"
        assert field_info["is_nullable"] == "YES"

    def test_migrate_change_field_drop_attributes(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ['datatype(VARCHAR)', "unique()", "not_null()", "default(\"''\")"],
            "description": ["datatype('VARCHAR', 10)", "not_null()", "default(\"'def_descr'\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        field_info = get_table_structure_info(db, "test", "test_schema", "description")
        assert field_info["column_default"] == "'def_descr'::character varying"
        assert field_info["is_nullable"] == "NO"

        field_info = get_table_structure_info(db, "test", "test_schema", "name")
        assert field_info["column_default"] == "''::character varying"
        assert field_info["is_nullable"] == "NO"

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ['datatype(VARCHAR)', "unique()", "not_null()", "default(\"''\")"],
            "description": ["datatype('VARCHAR', 10)", "not_null()", "default(\"'def_descr'\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
            ,
            2: {
                "name": ["datatype(TEXT)", "unique()"],
                "description": ["datatype('TEXT')"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["alter('description')", "alter('name')"]}
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        field_info = get_table_structure_info(db, "test", "test_schema", "description")
        assert not field_info["column_default"]
        assert field_info["is_nullable"] == "YES"

        field_info = get_table_structure_info(db, "test", "test_schema", "name")
        assert not field_info["column_default"]
        assert field_info["is_nullable"] == "YES"

    def test_migrate_drop_table(self, db, pg_migration_with_test_table, capsys):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ['datatype(VARCHAR)', "unique()", "not_null()", "default(\"''\")"],
            "description": ["datatype('VARCHAR', 10)", "not_null()", "default(\"'def_descr'\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        field_info = get_table_structure_info(db, "test", "test_schema", "description")
        assert field_info["column_default"] == "'def_descr'::character varying"
        assert field_info["is_nullable"] == "NO"

        field_info = get_table_structure_info(db, "test", "test_schema", "name")
        assert field_info["column_default"] == "''::character varying"
        assert field_info["is_nullable"] == "NO"

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "name": ['datatype(VARCHAR)', "unique()", "not_null()", "default(\"''\")"],
            "description": ["datatype('VARCHAR', 10)", "not_null()", "default(\"'def_descr'\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
            ,
            2: "dropped"
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["drop(*)"]}
                                                      })
        self.assert_table("test", "test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        self.assert_table_missing("test", "test_schema")

    def test_migrate_rename_table(self, db, pg_migration_with_test_table, capsys):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name1\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name2\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name3\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd._dsd_data.merge([],
                                {"name1": {
                                    "structure": {
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }})
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name1", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("name1", namespace="test_schema") == 1

        pgm.dsd._dsd_data.delete(["name1"])
        pgm.dsd._dsd_data.merge([],
                                {"name2": {
                                    "structure": {
                                        2: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }
                                }
                                )

        pgm.dsd._dsd_data.set(["name2", "migration"], {2: {"upgrade": ["rename_table('name1', 'name2')"]}
                                                       })
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("name1", "test_schema")
        helper.assert_table_missing("name2", "test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name2", namespace="test_schema")
        helper.assert_table("name2", "test_schema")
        helper.assert_table_missing("name1", "test_schema")
        assert pgm.get_table_structure_version("name2", "test_schema") == 2

    def test_migrate_rename_table_2(self, db, pg_migration_with_test_table, capsys):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name1\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name2\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name3\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd._dsd_data.merge([],
                                {"name1": {
                                    "structure": {
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }})
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name1", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("name1", namespace="test_schema") == 1

        pgm.dsd._dsd_data.delete(["name1"])
        pgm.dsd._dsd_data.merge([],
                                {"name3": {
                                    "structure": {
                                        3: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        2: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }
                                }
                                )

        pgm.dsd._dsd_data.set(["name3", "migration"], {
            3: {"upgrade": ["rename_table('name2', 'name3')"]},
            2: {"upgrade": ["rename_table('name1', 'name2')"]},
        })

        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("name1", "test_schema")
        helper.assert_table_missing("name2", "test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name3", version=2, namespace="test_schema")
        helper.assert_table("name2", "test_schema")
        helper.assert_table_missing("name1", "test_schema")
        helper.assert_table_missing("name3", "test_schema")
        assert pgm.get_table_structure_version("name2", "test_schema") == 2

    def test_migrate_rename_table_3(self, db, pg_migration_with_test_table, capsys):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name1\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name2\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name3\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd._dsd_data.merge([],
                                {"name1": {
                                    "structure": {
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }})
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name1", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("name1", namespace="test_schema") == 1

        pgm.dsd._dsd_data.delete(["name1"])
        pgm.dsd._dsd_data.merge([],
                                {"name3": {
                                    "structure": {
                                        3: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        2: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }
                                }
                                )

        pgm.dsd._dsd_data.set(["name3", "migration"], {
            3: {"upgrade": ["rename_table('name2', 'name3')"]},
            2: {"upgrade": ["rename_table('name1', 'name2')"]},
        })

        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("name1", "test_schema")
        helper.assert_table_missing("name2", "test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name3", namespace="test_schema")
        helper.assert_table_missing("name2", "test_schema")
        helper.assert_table_missing("name1", "test_schema")
        helper.assert_table("name3", "test_schema")
        assert pgm.get_table_structure_version("name3", "test_schema") == 3
        assert not pgm._adapter_exists_in_catalog("name1", "test_schema")
        assert not pgm._adapter_exists_in_catalog("name2", "test_schema")
        assert pgm._adapter_exists_in_catalog("name3", "test_schema")

    def test_migrate_rename_table_3_prefix(self, db, pg_migration_with_test_table, capsys):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"x220lk_name1\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"x220lk_name2\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"x220lk_name3\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"name3\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd._dsd_data.merge([],
                                {"name1": {
                                    "structure": {
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }})
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name1", prefix="x220lk_", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("x220lk_name1", namespace="test_schema") == 1

        pgm.dsd._dsd_data.delete(["name1"])
        pgm.dsd._dsd_data.merge([],
                                {"name3": {
                                    "structure": {
                                        3: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        2: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        },
                                        1: {
                                            "uid": ["datatype('UUID')", "uuid_key()"],
                                        }
                                    }
                                }
                                }
                                )

        pgm.dsd._dsd_data.set(["name3", "migration"], {
            3: {"upgrade": ["rename_table('name2', 'name3')"]},
            2: {"upgrade": ["rename_table('name1', 'name2')"]},
        })

        helper = testhelpers.KioskPyTestHelper()
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name3", namespace="test_schema")

        helper.assert_table("x220lk_name1", "test_schema")
        helper.assert_table_missing("x220lk_name2", "test_schema")
        helper.assert_table_missing("x220lk_name3", "test_schema")
        helper.assert_table("name3", "test_schema")

        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="name3", prefix="x220lk_", namespace="test_schema")
        helper.assert_table_missing("x220lk_name2", "test_schema")
        helper.assert_table_missing("x220lk_name1", "test_schema")
        helper.assert_table("x220lk_name3", "test_schema")
        assert pgm.get_table_structure_version("x220lk_name3", "test_schema") == 3
        assert not pgm._adapter_exists_in_catalog("x220lk_name1", "test_schema")
        assert not pgm._adapter_exists_in_catalog("x220lk_name2", "test_schema")
        assert pgm._adapter_exists_in_catalog("x220lk_name3", "test_schema")

    def test_migrate_execute_before_migration(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd.dsd_root_path = data_path

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "description": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["rename('test_description', 'description')",
                                                                      r"execute_before_migration('"
                                                                      r"sql\test_execute_before_migration.sql')"]

                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("test", "test_schema")
        helper.assert_record_exists("test", "test", "description", namespace="test_schema")
        helper.assert_record_exists("test", "another test", "description", namespace="test_schema")

    def test_migrate_execute_after_migration(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd.dsd_root_path = data_path

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "description": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["rename('test_description', 'description')",
                                                                      r"execute_after_migration('"
                                                                      r"sql\test_execute_after_migration.sql')"]

                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("test", "test_schema")
        helper.assert_record_exists("test", "test", "description", namespace="test_schema")
        helper.assert_record_exists("test", "another test", "description", namespace="test_schema")

    def test_migrate_execute_after_migration_direct_statement(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd.dsd_root_path = os.path.join(data_path, dsd_file)

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        }
        })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", version=1)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1

        pgm.dsd._dsd_data.set(["test", "structure"], {1: {
            "test_description": ["datatype('TEXT')", "default(\"''\")"],
            "uid": ["datatype('UUID')", "uuid_key()"],
        },
            2: {
                "description": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            }
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {2: {"upgrade": ["rename('test_description', 'description')",
                                                                      r"execute_after_migration('"
                                                                      r"insert into {{test}}(description) values('direct test');')"]

                                                          }
                                                      })
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema")
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table("test", "test_schema")
        helper.assert_record_exists("test", "direct test", "description", namespace="test_schema")
        helper.assert_record_missing("test", "another test", "description", namespace="test_schema")

    def test_migrate_table_step_by_step(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm: DatabaseMigration = pg_migration_with_test_table
        pgm.dsd.dsd_root_path = os.path.join(data_path, dsd_file)

        pgm.dsd._dsd_data.set(["test", "structure"], {
            1: {
                "field1": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            },
            2: {
                "field1": ["datatype('TEXT')", "default(\"''\")"],
                "field2": ["datatype('TEXT')", "default(\"''\")"],
                "uid": ["datatype('UUID')", "uuid_key()"],
            },
        })

        pgm.dsd._dsd_data.set(["test", "migration"], {
            2: {"upgrade": ["add('field2')"]},
        })

        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        helper.assert_table("test", "test_schema")

    def test_create_with_schema_and_tz_field(self, db, pg_migration_with_test_table, capsys):

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test\";")
        pgm = pg_migration_with_test_table

        assert not pgm._adapter_table_exists("test", namespace="test_schema")
        with capsys.disabled():
            assert pgm.create_table(dsd_table="test", db_table="test",
                                    namespace="test_schema", version=1, sync_tools=True)
        assert pgm._adapter_table_exists("test", namespace="test_schema")
        self.db_execute(db, "drop table test_schema.test;")
        with capsys.disabled():
            with pytest.raises(Exception):
                assert pgm.create_temporary_table(dsd_table="test", db_table="test",
                                                  namespace="test_schema", version=1)
