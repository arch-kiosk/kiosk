# todo time zone simpliciation
import pytest
import psycopg2
import datetime
from dsd.dsd3 import DataSetDefinition

from migration.postgresdbmigration import PostgresDbMigration
from test.testhelpers import KioskPyTestHelper


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


class TestPostgresDbMigration(KioskPyTestHelper):
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
            },
            "migration_flags": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "uuid_key()"],
                        "flag": ["datatype('TEXT')", "not_null()", "unique()"],
                        "value": ["datatype('TEXT')", "not_null()"]
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

    def test_schematize_curly_tables(self, db, pg_migration):
        sql = r"update " + "{{unit}} set {{unit}}.id = '';"
        assert pg_migration.schematize_curly_tables(sql, prefix="",
                                                    namespace="") == "update \"unit\" set \"unit\".id = '';"
        assert pg_migration.schematize_curly_tables(sql, prefix="",
                                                    namespace="test_schema") == "update \"test_schema\".\"unit\" set \"test_schema\".\"unit\".id = '';"

    def test_substitute_variables(self, db, pg_migration):
        sql = r"update " + "{{unit}} set {{unit}}.modified = {NOW};"
        iso_now = "'" + datetime.datetime.now().isoformat().split(".")[0]

        result = pg_migration.substitute_variables(sql)
        assert result.find(iso_now) == 40

    def db_execute(self, con, sql: str):
        cur = con.cursor()
        try:
            cur.execute(sql)
        finally:
            cur.close()

    def test_adapter_table_exists(self, db, pg_migration):
        self.db_execute(db, "drop table if exists testtable;")
        assert not pg_migration._adapter_table_exists("testtable")
        self.db_execute(db, """
        create table \"testtable\" (
                id int
            );
        """)

        assert pg_migration._adapter_table_exists("testtable")
        self.db_execute(db, "drop table if exists testtable;")

    def test_create_table(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert not pg_migration.create_table("not_in_dsd")
        assert not pg_migration.create_table("migration_catalog", 2)
        assert not pg_migration._adapter_table_exists("migration_catalog")
        assert pg_migration.create_table("migration_catalog", 1)
        assert pg_migration._adapter_table_exists("migration_catalog")

    def test_create_table_mocked(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.create_table("migration_catalog", 1)
        assert mock_sql == "CREATE TABLE \"migration_catalog\"(\"uid\" UUID UNIQUE PRIMARY KEY " \
                           "NOT NULL DEFAULT gen_random_uuid(),\"table\" TEXT NOT NULL UNIQUE," \
                           "\"table_definition\" TEXT NOT NULL,\"namespace\" TEXT DEFAULT '',\"version\" INTEGER NOT NULL);"

    def test_get_table_structure_version(self, db, pg_migration):

        # first let's see if the migration catalog is created
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.get_table_structure_version("test") == 0
        assert pg_migration._adapter_table_exists("migration_catalog")

        # first let's see if the migration catalog is created
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.get_table_structure_version("migration_catalog") == 1

    def test_adapter_drop_table(self, db, pg_migration):
        assert pg_migration._adapter_drop_table("test")
        assert pg_migration.get_table_structure_version("test") == 0
        assert pg_migration._adapter_table_exists("migration_catalog")
        assert pg_migration._adapter_drop_table("migration_catalog")
        assert not pg_migration._adapter_table_exists("migration_catalog")

    def test__adapter_delete_from_migration_catalog(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.get_table_structure_version("migration_catalog") == 1
        assert get_first_record(db, "migration_catalog")[1] == "migration_catalog"
        assert pg_migration._adapter_delete_from_migration_catalog("migration_catalog")
        assert not get_first_record(db, "migration_catalog")

    def test_drop_table(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration.get_table_structure_version("migration_catalog") == 1
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
        assert pg_migration.create_table("test")
        assert pg_migration.get_table_structure_version("test") == 1
        assert get_first_record(db, "migration_catalog", field="table", value="test")
        assert pg_migration.drop_table("test")
        assert not get_first_record(db, "migration_catalog", field="table", value="test")

    def test_repl_fields(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)

        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.create_table("test", 1)
        assert mock_sql == 'CREATE TABLE "test"("uid" UUID UNIQUE PRIMARY KEY NOT NULL DEFAULT ' \
                           'gen_random_uuid(),"created" TIMESTAMP NOT NULL,"repl_deleted" BOOLEAN ' \
                           'DEFAULT False,"repl_tag" INTEGER DEFAULT NULL);'

    def test_no_repluuid(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)

        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.create_table("test", 1)
        assert mock_sql == ('CREATE TABLE "test"("uid" UUID,"created" TIMESTAMP NOT '
                            'NULL);')

    def test_mock_sync_tools(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)

        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration.create_table("test", 1, sync_tools=True)
        assert mock_sql == (('CREATE TABLE "test"("uid" UUID NOT NULL DEFAULT gen_random_uuid(),"created" '
                             'TIMESTAMP NOT NULL,"repl_deleted" BOOLEAN DEFAULT False,"repl_tag" INTEGER '
                             'DEFAULT NULL,"repl_workstation_id" VARCHAR NOT NULL,CONSTRAINT '
                             '"PK_test_SYNC" PRIMARY KEY ("uid","repl_workstation_id"));'))

    def test_sync_tools(self, db, pg_migration):
        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert not pg_migration._adapter_table_exists("test")
        assert pg_migration.create_table("test", 1, sync_tools=True)
        assert pg_migration._adapter_table_exists("test")

    def test_mock_temp_create_table(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)

        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration.create_temporary_table("test", 1)
        assert mock_sql == (('CREATE TEMP TABLE "test"("uid" UUID UNIQUE PRIMARY KEY NOT NULL DEFAULT '
                             'gen_random_uuid(),"created" TIMESTAMP NOT NULL,"repl_deleted" BOOLEAN '
                             'DEFAULT False,"repl_tag" INTEGER DEFAULT NULL);'))
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration.create_temporary_table("test", 1, sync_tools=True)
        assert mock_sql == (('CREATE TEMP TABLE "test"("uid" UUID NOT NULL DEFAULT '
                             'gen_random_uuid(),"created" TIMESTAMP NOT NULL,"repl_deleted" BOOLEAN '
                             'DEFAULT False,"repl_tag" INTEGER DEFAULT NULL,"repl_workstation_id" VARCHAR '
                             'NOT NULL,CONSTRAINT "PK_test_SYNC" PRIMARY KEY '
                             '("uid","repl_workstation_id")) ON COMMIT DROP;'))

    def test_create_temporary_table(self, db, pg_migration, monkeypatch, capsys):
        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "replfield_uuid()"],
                        "created": ["datatype('DATETIME')", "replfield_created()"],
                    }
                }
            }
        })

        db.autocommit = False
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        db.commit()
        assert not pg_migration._adapter_table_exists("test")
        assert pg_migration.create_temporary_table("test", 1)
        db.commit()
        assert pg_migration._adapter_table_exists("test")
        self.db_execute(db, "drop table if exists \"test\";")
        db.commit()
        assert not pg_migration._adapter_table_exists("test")
        with capsys.disabled():
            assert pg_migration.create_temporary_table("test", 1, sync_tools=True)
        assert pg_migration._adapter_table_exists("test")
        db.commit()
        assert not pg_migration._adapter_table_exists("test")

    def test_mock_create_table_varchar_limited(self, db, pg_migration, monkeypatch):
        mock_sql = ""

        def mock_execute_sql(sql, params=[]):
            nonlocal mock_sql
            if sql.find("CREATE") >= 0:
                mock_sql = sql
            return True

        monkeypatch.setattr(pg_migration, "execute_sql", mock_execute_sql)

        pg_migration.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')"],
                        "description": ["datatype(VARCHAR,10)"],
                    }
                }
            }
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        assert pg_migration.create_temporary_table("test", 1)
        assert mock_sql == "CREATE TEMP TABLE \"test\"(\"uid\" UUID" \
                           ",\"description\" VARCHAR(10));"

    def test__adapter_get_tables_and_versions(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        assert pg_migration.get_table_structure_version("migration_catalog") == 1
        sql_script = """
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('954c1c28-973c-47d1-a7d8-09d2a14a49a3', 'unit_narrative', 'unit_narrative', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('9d21678f-99b9-483d-bb05-5589254debcf', 'collected_material', 'collected_material', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('ee039728-e8e2-40b9-a520-b51b44fac8c5', 'collected_material_photo', 'collected_material_photo', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('b9b69818-2c3c-4260-a12d-e5983ef765d4', 'dayplan', 'dayplan', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('690fd062-fd37-4e05-9d8b-abb1c68ecc49', 'excavator', 'excavator', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('f7b9f31e-c877-4375-a384-9a1fe51fda93', 'feature_unit', 'feature_unit', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('b5fbd44b-0c27-4367-984e-96520872f859', 'images', 'images', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('b81b8d47-a10a-4deb-a45d-20617d06f292', 'locus', 'locus', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('7f743f27-07d4-49c5-96fb-00883de36e2b', 'locus_architecture', 'locus_architecture', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('059d049b-b449-4978-b23f-0c56aa69294c', 'locus_deposit', 'locus_deposit', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('0ce22220-2b20-46b3-bdf2-326dd55f21f0', 'locus_othertype', 'locus_othertype', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('7479f045-d569-4650-8ef1-94a99c6a0bd3', 'locus_photo', 'locus_photo', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('d6ef3957-70fe-4777-ac9f-0e1b6630c3fa', 'locus_relations', 'locus_relations', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('72b9b133-42d4-43b7-adca-257b01873dea', 'locus_types', 'locus_types', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('c19c78b7-705b-4d71-b9c7-6ac03b92c9a8', 'lot', 'lot', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('be4c325c-fb5e-44f4-82f9-e382fbd1e0af', 'pottery', 'pottery', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('5d4ebc4b-894d-4f53-88fd-38f90e884853', 'pottery_images', 'pottery_images', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('f18c8ebb-0488-4b0b-8748-6ac5d8af6d74', 'site', 'site', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('94885f95-86ba-432b-ac03-f3adfde20ff1', 'site_notes', 'site_notes', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('d5d4c331-6c84-415a-b57d-03d1ed7f1013', 'site_note_photo', 'site_note_photo', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('4e9a3d58-69be-40d7-8b2d-59a0d77d7289', 'small_find', 'small_find', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('0e4f3d62-b27f-4f49-a592-446bc1d82259', 'survey_unit', 'survey_unit', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('e96e8f84-5fbd-4e31-8306-5f0e4b5e73fb', 'survey_unit_data', 'survey_unit_data', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('09fd9b21-606f-45f3-bb3c-4fa98112e422', 'tags', 'tags', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('7e8ae8eb-8537-4abf-8354-bdb534e84722', 'tagging', 'tagging', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('3fa0f73a-7130-4784-8c26-25be9cdc5ad7', 'tickets', 'tickets', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('8ee4e278-f443-49da-9482-fce5f6731983', 'unit', 'unit', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('641c4a32-295c-45dc-8509-3c470ad256d5', 'unit_shop', 'unit_shop', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('cffc4c2d-6773-4ab4-9fc8-c9763fd98da2', 'unit_unit_relation', 'unit_unit_relation', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('98fcbb92-5d90-416c-b583-171389aee1d4', 'workflow_requests', 'workflow_requests', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('4c952dfd-8084-4ccf-9a92-1d9fb07c9b7c', 'inventory', 'inventory', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('371b78fc-1e64-4b88-8fc7-75a4248c1a87', 'replication', 'replication', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('16fe45e2-e350-4acf-9691-196accc51b11', 'repl_deleted_uids', 'repl_deleted_uids', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('2e678bbb-d917-4830-ba4a-4f9b98237729', 'repl_image_resolution', 'repl_image_resolution', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('ff8f55b8-2a08-479c-b1e0-579a53c63d8a', 'repl_workstation', 'repl_workstation', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('edf3d67b-7999-4918-995e-1aded6be8f36', 'repl_workstation_filemaker', 'repl_workstation_filemaker', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('0bf364ec-9440-47e6-8d39-d0b5fd63eb41', 'kiosk_file_cache', 'kiosk_file_cache', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('33706c8a-2b48-45cc-b3dc-2f72f7abc01b', 'kiosk_privilege', 'kiosk_privilege', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('805406df-f32e-4395-a512-94c736051264', 'kiosk_user', 'kiosk_user', '', 2);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('8925b884-f954-47b2-b31f-b104bd7e8977', 'kiosk_workstation', 'kiosk_workstation', '', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('080bd10f-25b2-4a0a-a965-abcdacce86ff', 'MJL_unit_narrative', 'unit_narrative', 'MJL', 2);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('9ccfd382-af81-4801-83ae-3c7860be65d9', 'MJL_collected_material', 'collected_material', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('7f7c4c81-1976-469a-9a4a-7a26ecf27948', 'MJL_collected_material_photo', 'collected_material_photo', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('e27b9d02-1130-477b-9c53-38a673630df5', 'MJL_dayplan', 'dayplan', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('9b791cb0-1de1-4e54-bdbc-ea006915a019', 'MJL_excavator', 'excavator', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('291f8363-1336-46b1-97a1-1706da264470', 'MJL_feature_unit', 'feature_unit', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('a6fcfcf5-1350-4b9a-84da-3ec92e7780df', 'MJL_images', 'images', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('3adb6329-26ef-48bd-8520-d007c5eff8ce', 'MJL_locus', 'locus', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('d622e28d-52ab-445d-aabe-9ceef82b91f3', 'MJL_locus_architecture', 'locus_architecture', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('2b0c1467-06e7-466b-8d18-35759836b009', 'MJL_locus_deposit', 'locus_deposit', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('8a970fea-2ac1-4a99-bc9b-acdc5b72a0ed', 'MJL_locus_othertype', 'locus_othertype', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('dc3dd167-b193-4943-8da0-37d6012a5e0e', 'MJL_locus_photo', 'locus_photo', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('db8a1ea8-1a85-4cd4-abb0-4594492fa96e', 'MJL_locus_relations', 'locus_relations', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('c99856c5-5326-4f37-8be6-fd4963319450', 'MJL_locus_types', 'locus_types', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('f12997be-3989-4258-87dc-45cb9ec3e047', 'MJL_lot', 'lot', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('85d60bfa-3b68-46e3-8fb4-a3c2cdaede36', 'MJL_pottery', 'pottery', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('cdcfee4f-3158-4bea-8522-c7730ae8ff1e', 'MJL_pottery_images', 'pottery_images', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('d27baf64-0510-4188-b001-61fbf4c6f156', 'MJL_site', 'site', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('46b635ed-9eb9-41ba-9e24-7d69a7089c5b', 'MJL_site_notes', 'site_notes', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('f06bf182-037c-4369-ad6d-a789e9153513', 'MJL_site_note_photo', 'site_note_photo', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('4123fcb2-612e-47ec-aa06-9adf2d4ac146', 'MJL_small_find', 'small_find', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('73f38a12-f78b-4eaa-8a8a-200a25dae537', 'MJL_survey_unit', 'survey_unit', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('a855630e-01e1-45aa-9e5e-3c4fae40276e', 'MJL_survey_unit_data', 'survey_unit_data', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('67da43a0-fd19-4b07-9138-9eab6d5d984b', 'MJL_tags', 'tags', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('5d4f04a1-7511-489b-bb2d-45c93efb8b6b', 'MJL_tagging', 'tagging', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('d6808b11-feb8-4638-a620-6bbd8c375aa4', 'MJL_tickets', 'tickets', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('68d3fd37-935b-4a1b-b759-984adc105fee', 'MJL_unit', 'unit', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('e74a405e-68d2-4eb5-8998-c2d9e8b239f3', 'MJL_unit_shop', 'unit_shop', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('2207fb70-2c08-42f8-aa92-1fe6e8bbb2d5', 'MJL_unit_unit_relation', 'unit_unit_relation', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('081fe85b-517b-4ae5-96e9-e60b1fb57bf6', 'MJL_workflow_requests', 'workflow_requests', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('bd0449ba-dc20-4bb7-a65a-baa50b3986bb', 'MJL_inventory', 'inventory', 'MJL', 1);
                INSERT INTO public.migration_catalog (uid, "table", table_definition, namespace, version) VALUES ('4f1670b5-d966-4b87-843b-76c4f29ed98b', 'constants', 'constants', '', 1);
                """
        self.db_execute(db, sql_script)
        assert pg_migration.get_table_structure_version("unit_narrative") == 1
        tables = pg_migration.get_tables_and_versions(only_prefix="MJL_", namespace="MJL")
        assert tables
        assert tables["MJL_unit"] == ("unit", 1)
        assert tables["MJL_unit_narrative"] == ("unit_narrative", 2)
        assert "unit" not in tables
        assert "constants" not in tables
        tables = pg_migration.get_tables_and_versions()
        assert tables
        assert tables["unit"] == ("unit", 1)
        assert tables["unit_narrative"] == ("unit_narrative", 1)
        assert "MJL_unit" not in tables
        assert "MJL_constants" not in tables

    def test_set_migration_flag(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"migration_flags\";")
        assert not pg_migration._adapter_table_exists("migration_flags")
        assert pg_migration.create_table("migration_catalog", 1, sync_tools=False)
        assert pg_migration.create_table("migration_flags", 1, sync_tools=False)
        assert pg_migration._adapter_table_exists("migration_flags")

        assert not pg_migration.get_migration_flag("flag1")
        assert not pg_migration.get_migration_flag("flag2")
        assert pg_migration.set_migration_flag("flag1", "value1")
        assert pg_migration.set_migration_flag("flag2", "value2")
        assert pg_migration.get_migration_flag("flag1") == "value1"
        assert pg_migration.get_migration_flag("flag2") == "value2"
        assert pg_migration.set_migration_flag("flag1", "value1_2")
        assert pg_migration.set_migration_flag("flag2", "value2_2")
        assert pg_migration.get_migration_flag("flag1") == "value1_2"
        assert pg_migration.get_migration_flag("flag2") == "value2_2"

    def test__adapter_delete_namespace(self, db, pg_migration):
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "DROP SCHEMA if exists \"testnamespace\" CASCADE;")

        assert pg_migration.get_table_structure_version("migration_catalog") == 1
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
        assert pg_migration.create_table("test", namespace="testnamespace")
        assert pg_migration.get_table_structure_version("test", namespace="testnamespace") == 1
        assert pg_migration._adapter_table_exists(table="test", namespace="testnamespace")
        pg_migration.set_migration_flag("prefix_testnamespace_some_flag", "1")
        assert get_first_record(db, "migration_catalog", field="table", value="test")
        assert get_first_record(db, "migration_flags", field="flag", value="prefix_testnamespace_some_flag")
        assert pg_migration._adapter_delete_namespace("prefix", "testnamespace")
        assert not pg_migration._adapter_table_exists(table="test", namespace="testnamespace")
        assert not get_first_record(db, "migration_catalog", field="table", value="test")
        assert not get_first_record(db, "migration_flags", field="flag", value="prefix_testnamespace_some_flag")
