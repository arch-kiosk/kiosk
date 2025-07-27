# todo time zone simpliciation
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
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from dsd.dsdyamlloader import DSDYamlLoader

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")

data_dir = os.path.join(test_path, 'data')
dsd_file = r'dsd3.yml'
dsd_v2_file = r'dsd3_v2.yml'


class TestMigration(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file,log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, cfg):
        assert cfg
        cfg.dsdfile = os.path.join(data_dir, dsd_file)
        cur = self.get_urapdb(cfg, migration=False)
        cur.close()
        yield KioskSQLDb.get_con()
        KioskSQLDb.close_connection()

    @pytest.fixture()
    def migration(self, db) -> Migration:
        dsd = Dsd3Singleton.get_dsd3()
        # dsd = DataSetDefinition()
        # dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(os.path.join(data_dir, dsd_file))
        pg_migration = PostgresDbMigration(dsd, db, migration_catalog_name='kiosk_migration_catalog')
        migration = Migration(dsd, pg_migration, project_id="urap")
        assert migration
        return migration

    def db_execute(self, con, sql: str):
        cur = con.cursor()
        try:
            cur.execute(sql)
        finally:
            cur.close()

    def test_init(self, db, migration):
        assert db
        assert migration
        assert migration._dsd

    @pytest.fixture()
    def delete_all_tables(self, db, migration):
        pg_migration: PostgresDbMigration = migration._db_adapter
        for table_name in migration._dsd.list_tables(include_system_tables=True):
            pg_migration.execute_sql(f"drop table if exists \"{table_name}\"")

        return migration

    @pytest.fixture()
    def pgm(self, db) -> PostgresDbMigration:
        dsd = DataSetDefinition()
        dsd.append({"config": {
            "format_version": 3},
            "migration_catalog": {
                "meta": {
                    "flags": ["system_table"]
                },
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
        pgm = PostgresDbMigration(dsd, db)
        pgm.dsd.append({"config": {
            "format_version": 3},
            "test": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')", "uuid_key()"],
                    }
                }
            }
        })
        return pgm

    def test_sort_structure(self):
        assert self.sort_structure([("c", 1, 2), ("a", 2, 2), ("b", 3, 3)]) == [("a", 2, 2), ("b", 3, 3), ("c", 1, 2)]

    def test_creation(self, db, delete_all_tables):
        tables = ["kiosk_migration_catalog",
                  "unit_narrative",
                  "migration_flags",
                  "collected_material"]
        migration = delete_all_tables
        helper = KioskPyTestHelper()
        for table in tables:
            helper.assert_table_missing(table)
        migration.migrate_dataset()
        for table in tables:
            helper.assert_table(table)

        unit_narrative = self.sort_structure([('repl_tag', 'integer', 'YES', None),
                                              ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                              ('created', 'timestamp without time zone', 'NO', None),
                                              ('modified', 'timestamp with time zone', 'YES', None),
                                              ('modified_tz', 'integer', 'YES', None),
                                              ('modified_ww', 'timestamp without time zone', 'YES', None),
                                              ('repl_deleted', 'boolean', 'YES', 'false'),
                                              ('date', 'timestamp without time zone', 'YES', None),
                                              ('id_excavator', 'text', 'YES', None),
                                              ('narrative', 'text', 'YES', None),
                                              ('modified_by', 'text', 'YES', "'sys'::text"),
                                              ('id_unit', 'text', 'YES', None)])

        assert self.sort_structure(helper.get_table_fields_info("unit_narrative")) == unit_narrative

        collected_material = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                                  ('date', 'timestamp without time zone', 'YES', None),
                                                  ('dearregistrar', 'character varying', 'YES', None),
                                                  ('description', 'character varying', 'YES', None),
                                                  ('external_id', 'character varying', 'YES', None),
                                                  ('id', 'integer', 'YES', None),
                                                  ('isobject', 'integer', 'YES', None),
                                                  ('modified', 'timestamp with time zone', 'YES', None),
                                                  ('modified_by', 'character varying', 'YES', None),
                                                  ('modified_tz', 'integer', 'YES', None),
                                                  ('modified_ww', 'timestamp without time zone', 'YES', None),
                                                  ('period', 'character varying', 'YES', None),
                                                  ('pottery_remarks', 'character varying', 'YES', None),
                                                  ('quantity', 'numeric', 'YES', None),
                                                  ('repl_deleted', 'boolean', 'YES', 'false'),
                                                  ('repl_tag', 'integer', 'YES', None),
                                                  ('status_done', 'character varying', 'YES', None),
                                                  ('status_todo', 'character varying', 'YES', None),
                                                  ('storage', 'character varying', 'YES', None),
                                                  ('type', 'character varying', 'YES', None),
                                                  ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                                  ('uid_locus', 'uuid', 'YES', None),
                                                  ('uid_lot', 'uuid', 'YES', None),
                                                  ('weight', 'numeric', 'YES', None)])

        assert self.sort_structure(helper.get_table_fields_info("collected_material")) == collected_material

        collected_material_photo = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                                        ('description', 'character varying', 'YES', None),
                                                        ('modified', 'timestamp with time zone', 'YES', None),
                                                        ('modified_by', 'character varying', 'YES', None),
                                                        ('modified_tz', 'integer', 'YES', None),
                                                        ('modified_ww', 'timestamp without time zone', 'YES', None),
                                                        ('repl_deleted', 'boolean', 'YES', 'false'),
                                                        ('repl_tag', 'integer', 'YES', None),
                                                        ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                                        ('uid_cm', 'uuid', 'YES', None),
                                                        ('uid_photo', 'uuid', 'YES', None)]
                                                       )

        assert self.sort_structure(helper.get_table_fields_info("collected_material_photo")) == collected_material_photo

        dayplan = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                       ('id_unit', 'character varying', 'YES', None),
                                       ('image_description', 'character varying', 'YES', None),
                                       ('modified', 'timestamp with time zone', 'YES', None),
                                       ('modified_by', 'character varying', 'YES', None),
                                       ('modified_tz', 'integer', 'YES', None),
                                       ('modified_ww', 'timestamp without time zone', 'YES', None),
                                       ('repl_deleted', 'boolean', 'YES', 'false'),
                                       ('repl_tag', 'integer', 'YES', None),
                                       ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                       ('uid_image', 'uuid', 'YES', None)]
                                      )

        assert self.sort_structure(helper.get_table_fields_info("dayplan")) == dayplan

        excavator = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                         ('id', 'character varying', 'YES', None),
                                         ('modified', 'timestamp with time zone', 'YES', None),
                                         ('modified_by', 'character varying', 'YES', None),
                                         ('modified_tz', 'integer', 'YES', None),
                                         ('modified_ww', 'timestamp without time zone', 'YES', None),
                                         ('name', 'character varying', 'YES', None),
                                         ('properties', 'character varying', 'YES', None),
                                         ('repl_deleted', 'boolean', 'YES', 'false'),
                                         ('repl_tag', 'integer', 'YES', None),
                                         ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
                                        )

        assert self.sort_structure(helper.get_table_fields_info("excavator")) == excavator

        feature_unit = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                            ('elevation', 'integer', 'YES', None),
                                            ('feature_type', 'character varying', 'YES', None),
                                            ('length', 'integer', 'YES', None),
                                            ('materials', 'character varying', 'YES', None),
                                            ('modified', 'timestamp with time zone', 'YES', None),
                                            ('modified_by', 'character varying', 'YES', None),
                                            ('modified_tz', 'integer', 'YES', None),
                                            ('modified_ww', 'timestamp without time zone', 'YES', None),
                                            ('repl_deleted', 'boolean', 'YES', 'false'),
                                            ('repl_tag', 'integer', 'YES', None),
                                            ('revisit', 'character varying', 'YES', None),
                                            ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                            ('uid_unit', 'uuid', 'YES', None),
                                            ('width', 'integer', 'YES', None)]
                                           )

        assert self.sort_structure(helper.get_table_fields_info("feature_unit")) == feature_unit

        images = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                      ('description', 'character varying', 'YES', None),
                                      ('file_datetime', 'timestamp without time zone', 'YES', None),
                                      ('filename', 'character varying', 'YES', None),
                                      ('id_cm', 'integer', 'YES', None),
                                      ('id_locus', 'integer', 'YES', None),
                                      ('id_site', 'character varying', 'YES', None),
                                      ('id_unit', 'character varying', 'YES', None),
                                      ('image_attributes', 'jsonb', 'YES', None),
                                      ('img_proxy', 'timestamp without time zone', 'YES', None),
                                      ('md5_hash', 'character varying', 'YES', None),
                                      ('modified', 'timestamp with time zone', 'YES', None),
                                      ('modified_by', 'character varying', 'YES', None),
                                      ('modified_tz', 'integer', 'YES', None),
                                      ('modified_ww', 'timestamp without time zone', 'YES', None),
                                      ('original_md5', 'character varying', 'YES', None),
                                      ('ref_uid', 'uuid', 'YES', None),
                                      ('repl_deleted', 'boolean', 'YES', 'false'),
                                      ('repl_tag', 'integer', 'YES', None),
                                      ('tags', 'character varying', 'YES', None),
                                      ('uid', 'uuid', 'NO', 'gen_random_uuid()')])

        assert self.sort_structure(helper.get_table_fields_info("images")) == images

        locus = self.sort_structure([('closing elevations', 'character varying', 'YES', None),
                                     ('colour', 'character varying', 'YES', None),
                                     ('created', 'timestamp without time zone', 'NO', None),
                                     ('date_closed', 'date', 'YES', None),
                                     ('date_defined', 'date', 'YES', None),
                                     ('description', 'character varying', 'YES', None),
                                     ('id', 'integer', 'YES', None),
                                     ('interpretation', 'character varying', 'YES', None),
                                     ('modified', 'timestamp with time zone', 'YES', None),
                                     ('modified_by', 'character varying', 'YES', None),
                                     ('modified_tz', 'integer', 'YES', None),
                                     ('modified_ww', 'timestamp without time zone', 'YES', None),
                                     ('opening elevations', 'character varying', 'YES', None),
                                     ('phase', 'character varying', 'YES', None),
                                     ('repl_deleted', 'boolean', 'YES', 'false'),
                                     ('repl_tag', 'integer', 'YES', None),
                                     ('type', 'character varying', 'YES', None),
                                     ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                     ('uid_unit', 'uuid', 'YES', None)]
                                    )

        assert self.sort_structure(helper.get_table_fields_info("locus")) == locus

        locus_architecture = self.sort_structure([('brick_size', 'character varying', 'YES', None),
                                                  ('created', 'timestamp without time zone', 'NO', None),
                                                  ('features', 'character varying', 'YES', None),
                                                  ('material', 'character varying', 'YES', None),
                                                  ('modified', 'timestamp with time zone', 'YES', None),
                                                  ('modified_by', 'character varying', 'YES', None),
                                                  ('modified_tz', 'integer', 'YES', None),
                                                  ('modified_ww', 'timestamp without time zone', 'YES', None),
                                                  ('mortar_desc', 'character varying', 'YES', None),
                                                  ('preserved_height', 'numeric', 'YES', None),
                                                  ('repl_deleted', 'boolean', 'YES', 'false'),
                                                  ('repl_tag', 'integer', 'YES', None),
                                                  ('stone_size', 'character varying', 'YES', None),
                                                  ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                                  ('uid_locus', 'uuid', 'YES', None),
                                                  ('wall_thickness', 'numeric', 'YES', None)]
                                                 )

        assert self.sort_structure(helper.get_table_fields_info("locus_architecture")) == locus_architecture

        locus_deposit = self.sort_structure([('clay_prc', 'numeric', 'YES', None),
                                             ('compositions', 'character varying', 'YES', None),
                                             ('created', 'timestamp without time zone', 'NO', None),
                                             ('description', 'character varying', 'YES', None),
                                             ('gravel_prc', 'numeric', 'YES', None),
                                             ('inclusions', 'character varying', 'YES', None),
                                             ('material', 'character varying', 'YES', None),
                                             ('modified', 'timestamp with time zone', 'YES', None),
                                             ('modified_by', 'character varying', 'YES', None),
                                             ('modified_tz', 'integer', 'YES', None),
                                             ('modified_ww', 'timestamp without time zone', 'YES', None),
                                             ('repl_deleted', 'boolean', 'YES', 'false'),
                                             ('repl_tag', 'integer', 'YES', None),
                                             ('sand_prc', 'numeric', 'YES', None),
                                             ('silt_prc', 'numeric', 'YES', None),
                                             ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                             ('uid_locus', 'uuid', 'YES', None)]
                                            )

        assert self.sort_structure(helper.get_table_fields_info("locus_deposit")) == locus_deposit

        locus_othertype = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                               ('description', 'character varying', 'YES', None),
                                               ('modified', 'timestamp with time zone', 'YES', None),
                                               ('modified_by', 'character varying', 'YES', None),
                                               ('modified_tz', 'integer', 'YES', None),
                                               ('modified_ww', 'timestamp without time zone', 'YES', None),
                                               ('repl_deleted', 'boolean', 'YES', 'false'),
                                               ('repl_tag', 'integer', 'YES', None),
                                               ('type', 'character varying', 'YES', None),
                                               ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                               ('uid_locus', 'uuid', 'YES', None)]
                                              )

        assert self.sort_structure(helper.get_table_fields_info("locus_othertype")) == locus_othertype

        locus_photo = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                           ('description', 'character varying', 'YES', None),
                                           ('modified', 'timestamp with time zone', 'YES', None),
                                           ('modified_by', 'character varying', 'YES', None),
                                           ('modified_tz', 'integer', 'YES', None),
                                           ('modified_ww', 'timestamp without time zone', 'YES', None),
                                           ('repl_deleted', 'boolean', 'YES', 'false'),
                                           ('repl_tag', 'integer', 'YES', None),
                                           ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                           ('uid_image', 'uuid', 'YES', None),
                                           ('uid_locus', 'uuid', 'YES', None)]
                                          )

        assert self.sort_structure(helper.get_table_fields_info("locus_photo")) == locus_photo

        locus_relations = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                               ('modified', 'timestamp with time zone', 'YES', None),
                                               ('modified_by', 'character varying', 'YES', None),
                                               ('modified_tz', 'integer', 'YES', None),
                                               ('modified_ww', 'timestamp without time zone', 'YES', None),
                                               ('repl_deleted', 'boolean', 'YES', 'false'),
                                               ('repl_tag', 'integer', 'YES', None),
                                               ('sketch_description', 'character varying', 'YES', None),
                                               ('type', 'character varying', 'YES', None),
                                               ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                               ('uid_locus', 'uuid', 'YES', None),
                                               ('uid_locus_2_related', 'uuid', 'YES', None),
                                               ('uid_sketch', 'uuid', 'YES', None)]
                                              )

        assert self.sort_structure(helper.get_table_fields_info("locus_relations")) == locus_relations

        locus_types = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                           ('id', 'character varying', 'YES', None),
                                           ('modified', 'timestamp with time zone', 'YES', None),
                                           ('modified_by', 'character varying', 'YES', None),
                                           ('modified_tz', 'integer', 'YES', None),
                                           ('modified_ww', 'timestamp without time zone', 'YES', None),
                                           ('repl_deleted', 'boolean', 'YES', 'false'),
                                           ('repl_tag', 'integer', 'YES', None),
                                           ('type_name', 'character varying', 'YES', None),
                                           ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
                                          )

        assert self.sort_structure(helper.get_table_fields_info("locus_types")) == locus_types

        lot = self.sort_structure([('closing_elevations', 'character varying', 'YES', None),
                                   ('created', 'timestamp without time zone', 'NO', None),
                                   ('date', 'timestamp without time zone', 'YES', None),
                                   ('id', 'integer', 'YES', None),
                                   ('modified', 'timestamp with time zone', 'YES', None),
                                   ('modified_by', 'character varying', 'YES', None),
                                   ('modified_ww', 'timestamp without time zone', 'YES', None),
                                   ('modified_tz', 'integer', 'YES', None),
                                   ('opening_elevations', 'character varying', 'YES', None),
                                   ('purpose', 'character varying', 'YES', None),
                                   ('repl_deleted', 'boolean', 'YES', 'false'),
                                   ('repl_tag', 'integer', 'YES', None),
                                   ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                   ('uid_locus', 'uuid', 'YES', None)]
                                  )

        assert self.sort_structure(helper.get_table_fields_info("lot")) == lot

    def test_creation_sync_subsystem(self, db, delete_all_tables):
        tables = ["kiosk_migration_catalog",
                  "repl_deleted_uids",
                  "repl_file_picking_rules",
                  "repl_workstation",
                  "repl_workstation_filemaker", ]

        migration = delete_all_tables
        # helper = KioskPyTestHelper()
        for table in tables:
            self.assert_table_missing(table)
        migration.migrate_dataset()
        KioskSQLDb.commit()
        for table in tables:
            self.assert_table(table)

        repl_deleted_uids = self.sort_structure([('deleted_uid', 'uuid', 'NO', None),
                                                 ('modified', 'timestamp with time zone', 'YES', None),
                                                 ('modified_tz', 'integer', 'YES', None),
                                                 ('modified_ww', 'timestamp without time zone', 'YES', None),
                                                 ('repl_workstation_id', 'character varying', 'YES', None),
                                                 ('table', 'character varying', 'YES', None),
                                                 ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
                                                )
        assert self.sort_structure(self.get_table_fields_info("repl_deleted_uids")) == repl_deleted_uids
        repl_file_picking_rules = self.sort_structure(
            [('created', 'timestamp without time zone', 'NO', 'now()'),
             ('disable_changes', 'boolean', 'YES', 'false'),
             ('misc', 'character varying', 'YES', None),
             ('modified', 'timestamp without time zone', 'NO', 'now()'),
             ('modified_by', 'character varying', 'YES', None),
             ('operator', 'character varying', 'YES', None),
             ('order', 'integer', 'NO', None),
             ('recording_group', 'character varying', 'NO', "'default'::character varying"),
             ('resolution', 'character varying', 'NO', None),
             ('rule_type', 'character varying', 'NO', None),
             ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
             ('value', 'character varying', 'YES', None),
             ('workstation_type', 'character varying', 'NO', None)]
        )
        assert self.sort_structure(self.get_table_fields_info("repl_file_picking_rules")) == repl_file_picking_rules

        repl_workstation = self.sort_structure(
            [('description', 'character varying', 'YES', None),
             ('dsd_version', 'character varying', 'YES', None),
             ('fork_sync_time', 'timestamp without time zone', 'YES', None),
             ('fork_time', 'timestamp without time zone', 'YES', None),
             ('id', 'character varying', 'NO', None),
             ('recording_group', 'character varying', 'YES', None),
             ('state', 'smallint', 'NO', '0'),
             ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
        )
        assert self.sort_structure(self.get_table_fields_info("repl_workstation")) == repl_workstation

        repl_workstation_filemaker = self.sort_structure(
            [('id', 'character varying', 'NO', None)]
        )
        assert self.sort_structure(
            self.get_table_fields_info("repl_workstation_filemaker")) == repl_workstation_filemaker

    def test_creation_kiosk_tables(self, db, delete_all_tables):
        tables = ["kiosk_migration_catalog",
                  "kiosk_file_cache",
                  "kiosk_privilege",
                  "kiosk_user",
                  "kiosk_workstation", ]

        migration = delete_all_tables
        helper = KioskPyTestHelper()
        for table in tables:
            helper.assert_table_missing(table)
        migration.migrate_dataset()
        for table in tables:
            helper.assert_table(table)

        kiosk_file_cache = self.sort_structure([('created', 'timestamp without time zone', 'NO', 'now()'),
                                                ('image_attributes', 'jsonb', 'YES', None),
                                                ('invalid', 'boolean', 'NO', 'true'),
                                                ('modified', 'timestamp without time zone', 'NO', 'now()'),
                                                ('path_and_filename', 'character varying', 'YES', None),
                                                ('representation_type', 'character varying', 'YES', None),
                                                ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                                ('uid_file', 'uuid', 'NO', None)]
                                               )
        assert self.sort_structure(helper.get_table_fields_info("kiosk_file_cache")) == kiosk_file_cache

        kiosk_privilege = self.sort_structure([('addressee', 'character varying', 'NO', None),
                                               ('privilege', 'character varying', 'NO', None),
                                               ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
                                              )
        assert self.sort_structure(helper.get_table_fields_info("kiosk_privilege")) == kiosk_privilege

        kiosk_user = self.sort_structure([('groups', 'character varying', 'YES', None),
                                          ('must_change_pwd', 'boolean', 'YES', None),
                                          ('pwd_hash', 'character varying', 'NO', None),
                                          ('repl_user_id', 'character varying', 'YES', None),
                                          ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                          ('user_id', 'character varying', 'NO', None),
                                          ('user_name', 'character varying', 'NO', None)]
                                         )
        assert self.sort_structure(helper.get_table_fields_info("kiosk_user")) == kiosk_user

        kiosk_workstation = self.sort_structure([('download_upload_status', 'integer', 'NO', '0'),
                                                 ('ts_status', 'timestamp without time zone', 'YES', None),
                                                 ('id', 'character varying', 'NO', None)]
                                                )
        assert self.sort_structure(helper.get_table_fields_info("kiosk_workstation")) == kiosk_workstation

    def test_migration(self, db, delete_all_tables):
        self.test_creation(db, delete_all_tables)
        tables = ["kiosk_migration_catalog",
                  "unit_narrative",
                  "collected_material",
                  "collected_material_photo",
                  "dayplan",
                  "excavator",
                  "feature_unit",
                  "images",
                  "locus",
                  "locus_architecture",
                  "locus_deposit",
                  "locus_othertype",
                  "locus_photo",
                  "locus_relations",
                  "locus_types",
                  "lot",
                  "pottery",
                  "pottery_images",
                  "site",
                  "site_notes",
                  "site_note_photo",
                  "small_find",
                  "survey_unit",
                  "survey_unit_data",
                  "tags",
                  "tagging",
                  "tickets",
                  "unit",
                  "unit_shop",
                  "unit_unit_relation",
                  "workflow_requests",
                  "inventory",
                  "kiosk_file_cache",
                  "kiosk_privilege",
                  "kiosk_user",
                  "kiosk_workstation",
                  "repl_deleted_uids",
                  "repl_file_picking_rules",
                  "repl_workstation",
                  "repl_workstation_filemaker"]
        migration = delete_all_tables
        helper = KioskPyTestHelper()
        for table in tables:
            helper.assert_table(table)

        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(os.path.join(data_dir, dsd_v2_file))
        pg_migration = PostgresDbMigration(dsd, db, migration_catalog_name='kiosk_migration_catalog')
        pg_migration.execute_sql(f"drop table if exists \"file\"")
        migration = Migration(dsd, pg_migration)
        assert migration
        migration.migrate_dataset()

        file = self.sort_structure([('created', 'timestamp without time zone', 'NO', None),
                                    ('description', 'character varying', 'YES', None),
                                    ('file_datetime', 'timestamp without time zone', 'YES', None),
                                    ('filename', 'character varying', 'YES', None),
                                    ('id_cm', 'integer', 'YES', None),
                                    ('id_locus', 'integer', 'YES', None),
                                    ('id_site', 'character varying', 'YES', None),
                                    ('id_unit', 'character varying', 'YES', None),
                                    ('image_attributes', 'jsonb', 'YES', None),
                                    ('img_proxy', 'timestamp without time zone', 'YES', None),
                                    ('md5_hash', 'character varying', 'YES', None),
                                    ('modified', 'timestamp with time zone', 'YES', None),
                                    ('modified_by', 'character varying', 'YES', None),
                                    ('modified_tz', 'integer', 'YES', None),
                                    ('modified_ww', 'timestamp without time zone', 'YES', None),
                                    ('original_md5', 'character varying', 'YES', None),
                                    ('ref_uid', 'uuid', 'YES', None),
                                    ('repl_deleted', 'boolean', 'YES', 'false'),
                                    ('repl_tag', 'integer', 'YES', None),
                                    ('tags', 'character varying', 'YES', None),
                                    ('uid', 'uuid', 'NO', 'gen_random_uuid()')]
                                   )
        assert self.sort_structure(helper.get_table_fields_info("file")) == file

        locus = self.sort_structure([('closing elevations txt', 'character varying', 'YES', None),
                                     ('colour', 'character varying', 'YES', None),
                                     ('created', 'timestamp without time zone', 'NO', None),
                                     ('date_closed', 'date', 'YES', None),
                                     ('date_defined', 'date', 'YES', None),
                                     ('description', 'character varying', 'YES', None),
                                     ('id', 'integer', 'YES', None),
                                     ('interpretation', 'character varying', 'YES', None),
                                     ('modified', 'timestamp with time zone', 'YES', None),
                                     ('modified_by', 'character varying', 'YES', None),
                                     ('modified_tz', 'integer', 'YES', None),
                                     ('modified_ww', 'timestamp without time zone', 'YES', None),
                                     ('opening elevations txt', 'character varying', 'YES', None),
                                     ('phase', 'character varying', 'YES', None),
                                     ('repl_deleted', 'boolean', 'YES', 'false'),
                                     ('repl_tag', 'integer', 'YES', None),
                                     ('type', 'character varying', 'YES', None),
                                     ('uid', 'uuid', 'NO', 'gen_random_uuid()'),
                                     ('uid_unit', 'uuid', 'YES', None)]
                                    )
        assert self.sort_structure(helper.get_table_fields_info("locus")) == locus

        replication = self.sort_structure([('id', 'character varying', 'NO', None),
                                           ('ts', 'timestamp without time zone', 'YES', 'now()'),
                                           ('value', 'character varying', 'YES', None)]
                                          )
        assert self.sort_structure(helper.get_table_fields_info("replication")) == replication

    # The next one I only used to build the table structures to compare with
    @pytest.mark.skip
    def test_create_urap_db_structure(self, db):
        try:
            helper = KioskPyTestHelper()
            assert helper.get_table_fields_info("replication") == []
        finally:
            KioskSQLDb.close_connection()

    @pytest.fixture()
    def pgm_test1_test2(self, pgm):
        pgm.dsd.dsd_root_path = os.path.join(test_path, "data")

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

        pgm.dsd._dsd_data.set(["test2"], {
            "structure": {
                1: {
                    "field1": ["datatype('TEXT')", "default(\"''\")"],
                    "uid": ["datatype('UUID')", "uuid_key()"],
                },
                2: {
                    "field1": ["datatype('TEXT')", "default(\"''\")"],
                    "field2": ["datatype('TEXT')", "default(\"''\")"],
                    "uid": ["datatype('UUID')", "uuid_key()"],
                },
            }
        })
        pgm.dsd._dsd_data.set(["test2", "migration"], {
            2: {"upgrade": ["add('field2')"]},
        })
        pgm.dsd._dsd_data.set(["migration_flags"], {
            "meta": {
                "flags": ["system_table"]
            },
            "structure": {
                1: {
                    "uid": ["datatype('UUID')", "uuid_key()"],
                    "flag": ["datatype('TEXT')", "not_null()", "unique()"],
                    "value": ["datatype('TEXT')", "not_null()"]
                }
            }
        })
        return pgm

    def test_save_cross_table_migration_status(self, db, pgm_test1_test2, capsys):

        pgm = pgm_test1_test2
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test2\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": "test",
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        migration = Migration(pgm.dsd, pgm)
        migration.save_cross_table_migration_status(namespace="test_schema")
        assert migration._ctm_status == {"test": 1, "test2": 0}

        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 1
        migration.save_cross_table_migration_status(namespace="test_schema")
        assert migration._ctm_status == {"test": 1, "test2": 1}

        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        migration.save_cross_table_migration_status(namespace="test_schema")
        assert migration._ctm_status == {"test": 2, "test2": 2}

    def test__ctm_preconditions_met(self, db, pgm_test1_test2, capsys):

        pgm = pgm_test1_test2
        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": "test",
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        migration = Migration(pgm.dsd, pgm)
        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert not migration._ctm_preconditions_met(namespace="test_schema",
                                                    ctm_name="ctm_test",
                                                    ctm=pgm.dsd._dsd_data.get(
                                                        ["config", "migration_scripts", "ctm_test"])
                                                    )

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 1
        assert not migration._ctm_preconditions_met(namespace="test_schema",
                                                    ctm_name="ctm_test",
                                                    ctm=pgm.dsd._dsd_data.get(
                                                        ["config", "migration_scripts", "ctm_test"])
                                                    )

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        assert not migration._ctm_preconditions_met(namespace="test_schema",
                                                    ctm_name="ctm_test",
                                                    ctm=pgm.dsd._dsd_data.get(
                                                        ["config", "migration_scripts", "ctm_test"])
                                                    )

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        assert migration._ctm_preconditions_met(namespace="test_schema",
                                                ctm_name="ctm_test",
                                                ctm=pgm.dsd._dsd_data.get(
                                                    ["config", "migration_scripts", "ctm_test"])
                                                )

    def test_run_cross_table_migration_mocked(self, db, pgm_test1_test2, capsys, monkeypatch):
        mock_called = False

        def mock__run_cross_table_migration(sql_instruction, prefix="", namespace=""):
            nonlocal mock_called
            mock_called = True
            return True

        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": "test",
                    "options": ["run_on_forked_datasets"],
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        migration = Migration(pgm.dsd, pgm)
        monkeypatch.setattr(migration, "_run_cross_table_migration", mock__run_cross_table_migration)

        mock_called = False
        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        time.sleep(1)
        migration.run_cross_table_migration("", "test_schema")
        assert not mock_called

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 1
        migration.run_cross_table_migration("", "test_schema")
        assert not mock_called

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        migration.run_cross_table_migration("", "test_schema")
        assert not mock_called

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        migration.run_cross_table_migration("", "test_schema")
        assert mock_called

    def test_run_cross_table_migration(self, db, pgm_test1_test2, capsys):
        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": "test_cross_table_migration.sql",
                    "options": ["run_on_forked_datasets"],
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 1
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        assert migration.run_cross_table_migration("", "test_schema")

        helper.assert_record_exists("test", field="field1", value="test_value_1", namespace="test_schema")
        helper.assert_record_exists("test", field="field2", value="test_value_2", namespace="test_schema")
        helper.assert_record_exists("test2", field="field1", value="test_value_3", namespace="test_schema")
        helper.assert_record_exists("test2", field="field2", value="test_value_4", namespace="test_schema")

    def test_run_cross_table_migration_single_sql_statement(self, db, pgm_test1_test2, capsys):
        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
                    "options": ["run_on_forked_datasets"],
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 1
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        assert migration.run_cross_table_migration("", "test_schema")
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema")
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test2", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        assert migration.run_cross_table_migration("", "test_schema")

        helper.assert_record_exists("test", field="field1", value="test_value_1", namespace="test_schema")
        helper.assert_record_exists("test", field="field2", value="test_value_2", namespace="test_schema")

    def test_run_cross_table_migration_with_dropped_table(self, db, pgm_test1_test2, capsys):
        pgm = pgm_test1_test2

        pgm.dsd._dsd_data.set(["test2"], {
            "structure": {
                1: {
                    "field1": ["datatype('TEXT')", "default(\"''\")"],
                    "uid": ["datatype('UUID')", "uuid_key()"],
                },
                2: {
                    "field1": ["datatype('TEXT')", "default(\"''\")"],
                    "field2": ["datatype('TEXT')", "default(\"''\")"],
                    "uid": ["datatype('UUID')", "uuid_key()"],
                },
                3: "dropped",
            }
        })
        pgm.dsd._dsd_data.set(["test2", "migration"], {
            2: {"upgrade": ["add('field2')"]},
            3: {"upgrade": ["drop(*)"]},
        })

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)

        migration.save_cross_table_migration_status(namespace="test_schema", check_precondition_tables=False)
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (1, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 1
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

        migration.save_cross_table_migration_status(namespace="test_schema", check_precondition_tables=False)
        with capsys.disabled():
            assert pgm.migrate_table(dsd_table="test", namespace="test_schema", one_step_only=True) == (2, 2)
        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        assert not migration.run_cross_table_migration("", "test_schema", check_precondition_tables=False)
        helper.assert_record_missing("test", field="field1", value="test_value_1", namespace="test_schema")

    def test_run_cross_table_migration_complete(self, db, pgm_test1_test2, capsys):
        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"migration_flags\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test\";")
        self.db_execute(db, "drop table if exists \"test_schema\".\"test2\";")
        self.db_execute(db, "drop table if exists \"test\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test", "test_schema")
        helper.assert_table_missing("test2", "test_schema")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
                    "options": ["run_on_forked_datasets"],
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)
        assert migration.migrate_dataset(namespace="test_schema")

        assert pgm.get_table_structure_version("test", namespace="test_schema") == 2
        assert pgm.get_table_structure_version("test2", namespace="test_schema") == 2
        helper.assert_record_exists("test", field="field1", value="test_value_1", namespace="test_schema")
        helper.assert_record_exists("test", field="field2", value="test_value_2", namespace="test_schema")

    def test_check_cross_table_migration_flags(self, db, pgm_test1_test2, capsys, monkeypatch):
        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"migration_flags\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test2\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test")
        helper.assert_table_missing("test2")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    },
                    "flags": {
                        "flag1": "value1",
                        "flag2": "value2",
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)
        assert migration.migrate_dataset()

        assert pgm.get_table_structure_version("migration_flags") == 1
        assert pgm.get_table_structure_version("test") == 2
        assert pgm.get_table_structure_version("test2") == 2
        KioskSQLDb.commit()
        helper.assert_record_exists("test", field="field1", value="test_value_1")
        helper.assert_record_exists("test", field="field2", value="test_value_2")

    def test_check_cross_table_migration_flags_mock(self, db, pgm_test1_test2, capsys, monkeypatch):
        mock_called = 0
        called_sql = []

        def mock__run_cross_table_migration(sql_instruction, prefix="", namespace=""):
            nonlocal mock_called
            nonlocal called_sql
            mock_called = mock_called + 1
            called_sql.append(sql_instruction)
            return True

        pgm = pgm_test1_test2

        self.db_execute(db, "drop table if exists \"migration_catalog\";")
        self.db_execute(db, "drop table if exists \"migration_flags\";")
        self.db_execute(db, "drop table if exists \"test\";")
        self.db_execute(db, "drop table if exists \"test2\";")
        helper = testhelpers.KioskPyTestHelper()
        helper.assert_table_missing("test")
        helper.assert_table_missing("test2")
        helper.assert_table_missing("migration_flags")

        pgm.dsd._dsd_data.set(["config"], {
            "migration_scripts": {
                "ctm_test": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
                    "preconditions": {
                        "test": 2,
                        "test2": 2
                    },
                    "flags": {
                        "flag1": "value1",
                        "flag2": "value2",
                    }
                },
                "ctm_test_2": {
                    "migration": r"insert" + " into {{test}}(field1, field2) values('test_value_3', 'test_value_4');",
                    "flags": {
                        "flag1": "value1",
                        "flag3": "value3",
                    }
                }
            }
        })

        pgm.dsd.dsd_root_path = os.path.join(test_path, "data", "sql")

        migration = Migration(pgm.dsd, pgm)
        monkeypatch.setattr(migration, "_run_cross_table_migration", mock__run_cross_table_migration)
        assert migration.migrate_dataset()

        assert pgm.get_table_structure_version("migration_flags") == 1
        assert pgm.get_table_structure_version("test") == 2
        assert pgm.get_table_structure_version("test2") == 2
        KioskSQLDb.commit()
        assert mock_called == 2
        assert called_sql.sort() == [
            r"insert into" + " {{test}}(field1, field2) values('test_value_1', 'test_value_2');",
            r"insert into" + " {{test}}(field1, field2) values('test_value_3', 'test_value_4');"].sort()
        mock_called = 0
        called_sql = []
        migration = Migration(pgm.dsd, pgm)
        monkeypatch.setattr(migration, "_run_cross_table_migration", mock__run_cross_table_migration)
        assert migration.migrate_dataset()
        assert mock_called == 0
        assert called_sql == []
