# todo time zone simpliciation
import psycopg2
import pytest
from migration.postgresdbmigration import PostgresDbMigration
from migration.postgrestablemigration import _PostgresTableMigration
from dsd.dsd3 import DataSetDefinition
from migration.postgresmigrationinstructions import AlterMigrationInstruction, AddMigrationInstruction, \
    DropMigrationInstruction, RenameMigrationInstruction, RenameTableMigrationInstruction
from dsd.dsderrors import *
from test.testhelpers import KioskPyTestHelper


class TestAlterMigrationInstruction(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        config = self.get_standard_test_config(__file__)

        con = psycopg2.connect(f"dbname=urap_test user={config.database_usr_name} "
                               f"password={config.database_usr_pwd} port={config.database_port}")
        con.autocommit = True
        yield con
        con.close()

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
            }
        })
        pg_migration = PostgresDbMigration(dsd, db)
        assert pg_migration
        return pg_migration

    def test_init(self, db, pg_migration):
        assert db
        assert pg_migration

    def test_get_new_field_instructions(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        old_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=1)
        new_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=2)
        result = AlterMigrationInstruction._get_new_field_instructions(old_field_instructions["name"],
                                                                       new_field_instructions["name"])
        assert result == {"default": ["name"], "not_null": [], "unique": []}
        result = AlterMigrationInstruction._get_new_field_instructions(old_field_instructions["description"],
                                                                       new_field_instructions["description"])
        assert result == {"default": ["description"], "not_null": []}

    def test_get_dropped_field_instructions(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        old_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=1)
        new_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=2)
        result = AlterMigrationInstruction._get_dropped_field_instructions(old_field_instructions["name"],
                                                                           new_field_instructions["name"])
        assert list(result.keys()) == ["default", "not_null", "unique"]
        result = AlterMigrationInstruction._get_dropped_field_instructions(old_field_instructions["description"],
                                                                           new_field_instructions["description"])
        assert list(result.keys()) == ["default", "not_null"]

    def test_get_modified_field_instructions(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT', 20)", "default(\"''\")", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('VARCHAR', 10)", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('VARCHAR')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        old_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=1)
        new_field_instructions = pgm.dsd.get_fields_with_instructions("test", version=2)
        result = AlterMigrationInstruction._get_modified_field_instructions(old_field_instructions["name"],
                                                                            new_field_instructions["name"])
        assert result == {"datatype": ["TEXT", '20'], "default": ["''"]}

    def test_get_sql_instructions_modify_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "primary()"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")
        with pytest.raises(DSDFeatureNotSupported):
            result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                       parameters=["name"])

        result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                   parameters=["description"])
        assert result == [
            "ALTER TABLE \"test_schema\".\"test\" ALTER \"description\" SET NOT NULL, ALTER \"description\" SET DEFAULT 'description'"]

    @pytest.mark.skip()
    def test_get_sql_instructions_modify_time_stamp_fields(self, pg_migration):
        # deactivated because altering a field from and to timestamp is currently allowed.
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "date": ["datatype('VARCHAR')", "not_null()"],
                        "description": ["datatype('TEXT')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "date": ["datatype('TIMESTAMP')", "not_null()"],
                        "description": ["datatype('VARCHAR')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")
        with pytest.raises(DSDDataTypeError):
            result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                       parameters=["date"])

        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "date": ["datatype('TIMESTAMP')", "not_null()"],
                        "description": ["datatype('TEXT')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "date": ["datatype('VARCHAR')", "not_null()"],
                        "description": ["datatype('VARCHAR')", "default('description')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")
        with pytest.raises(DSDDataTypeError):
            result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                       parameters=["date"])

    def test_get_sql_instructions_drop_field_attributes(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")
        with pytest.raises(DSDFeatureNotSupported):
            result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                       parameters=["name"])

        result = AlterMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                   parameters=["description"])
        assert result == [
            "ALTER TABLE \"test_schema\".\"test\" ALTER \"description\" DROP NOT NULL, ALTER \"description\" DROP DEFAULT"]


class TestAddMigrationInstruction(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        config = self.get_standard_test_config(__file__)

        con = psycopg2.connect(f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        con.autocommit = True
        yield con
        con.close()

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
            }
        })
        pg_migration = PostgresDbMigration(dsd, db)
        assert pg_migration
        return pg_migration

    def test_init(self, db, pg_migration):
        assert db
        assert pg_migration

    def test_get_sql_instructions_add_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = AddMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                 parameters=["description"])
        assert result == [
            "ALTER TABLE \"test_schema\".\"test\" ADD COLUMN \"description\" TEXT NOT NULL DEFAULT 'description'"]

    def test_get_sql_instructions_add_time_zone_field(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "date": ["datatype('TIMESTAMP')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = AddMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                 parameters=["date"])
        assert result[0].lower() == ('alter table "test_schema"."test" add column "date" timestamp not null').lower()


class TestDropMigrationInstruction(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        config = self.get_standard_test_config(__file__)

        con = psycopg2.connect(f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        con.autocommit = True
        yield con
        con.close()

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
            }
        })
        pg_migration = PostgresDbMigration(dsd, db)
        assert pg_migration
        return pg_migration

    def test_init(self, db, pg_migration):
        assert db
        assert pg_migration

    def test_get_sql_instructions_drop_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = DropMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                  parameters=["description"])
        assert result == ["ALTER TABLE \"test_schema\".\"test\" DROP COLUMN \"description\""]

    def test_get_sql_instructions_drop_time_stamp_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "date": ["datatype('DATETIME')"],
                        "date_2": ["datatype('TIMESTAMP')"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = DropMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                  parameters=["date"])
        assert result == ["ALTER TABLE \"test_schema\".\"test\" DROP COLUMN \"date\""]

        result = DropMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                  parameters=["date_2"])
        assert result == ["ALTER TABLE \"test_schema\".\"test\" DROP COLUMN \"date_2\""]

        with pytest.raises(DSDInstructionValueError):
            result = DropMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                      parameters=["date_3"])

    def test_get_sql_instructions_drop_table(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: "dropped",
                    1: {
                        "name": ["datatype('TEXT')"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = DropMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                  parameters=["*"])
        assert result == ["DROP TABLE \"test_schema\".\"test\""]


class TestRenameMigrationInstruction(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        config = self.get_standard_test_config(__file__)

        con = psycopg2.connect(f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        con.autocommit = True
        yield con
        con.close()

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
            }
        })
        pg_migration = PostgresDbMigration(dsd, db)
        assert pg_migration
        return pg_migration

    def test_init(self, db, pg_migration):
        assert db
        assert pg_migration

    def test_get_sql_instructions_rename_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "old_description": ["datatype('TEXT')", "default(\"'description'\")", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = RenameMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                    parameters=["old_description", "description"])
        assert result == ["ALTER TABLE \"test_schema\".\"test\" RENAME COLUMN \"old_description\" TO \"description\""]

    def test_get_sql_instructions_rename_time_stamp_fields(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    2: {
                        "name": ["datatype('TEXT')", "default('name')", "not_null()", "unique()"],
                        "date": ["datatype('TIMESTAMP')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    },
                    1: {
                        "name": ["datatype('TEXT')"],
                        "old_date": ["datatype('TIMESTAMP')", "not_null()"],
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = RenameMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                    parameters=["old_date", "date"])
        assert result == ["ALTER TABLE \"test_schema\".\"test\" RENAME COLUMN \"old_date\" TO \"date\""]

        with pytest.raises(DSDInstructionValueError):
            result = RenameMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                        parameters=["old_date_1", "date_1"])

    def test_get_sql_instructions_rename_table(self, pg_migration):
        pgm: PostgresDbMigration = pg_migration
        pgm.dsd.append({"config": {
            "format_version": 3},
            "name3": {
                "structure": {
                    3: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                    },
                    2: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                    },
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                    }
                }
            }
        })

        tablemigration = _PostgresTableMigration(migration=pgm, dsd_table="test", from_version=1, to_version=2,
                                                 namespace="test_schema")

        result = RenameTableMigrationInstruction.create_sql_instructions(table_migration=tablemigration,
                                                                         parameters=["name1", "name2"])
        assert result == ["ALTER TABLE \"test_schema\".\"name1\" RENAME TO \"name2\""]
        assert tablemigration.new_db_table_name == "name2"
