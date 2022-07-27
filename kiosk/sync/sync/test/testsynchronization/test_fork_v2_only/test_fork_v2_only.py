import os
import shutil
import uuid

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from filerepository import FileRepository
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_dir = os.path.dirname(os.path.abspath(__file__))
file_picking_rules_1 = os.path.join(test_dir, "sqls", "file_picking_rules_1.sql")
config_file = os.path.join(test_dir, r"data", "config", "config_test.yml")
log_file = os.path.join(test_dir, r"log", "test_log.log")


# @pytest.mark.skip
class TestForkV2Only(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file=config_file, log_file=log_file)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture(scope="class")
    def urapdb(self, cfg):
        assert KioskSQLDb.drop_database()
        assert KioskSQLDb.create_database()
        dsd = Dsd3Singleton.get_dsd3()
        dsd.append_file(cfg.dsdfile)
        migration = Migration(dsd, PostgresDbMigration(dsd, KioskSQLDb.get_con()))
        migration.self_check()
        migration.migrate_dataset()
        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        return cur

    @pytest.fixture()
    def file_repos(self, config):
        sync = Synchronization()
        file_repos = FileRepository(config, sync.events,
                                    sync.type_repository,
                                    sync)
        return file_repos

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test_instantiation(self, urapdb, shared_datadir):
        sync = Synchronization()

    def init_and_import_a_bunch_of_images(self, urapdb, config, shared_datadir):
        assert urapdb
        self.set_file_repos_dir(config, shared_datadir)
        sync = Synchronization()
        # KioskSQLDb.run_sql_script(os.path.join(test_dir,
        #                                       "create_database_sqls",
        #                                       "create_master_tables.sql"))
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_unit_fa.sql"))
        assert config
        assert config.database_name == "urap_test"
        shutil.rmtree(os.path.join(test_dir, r"data", "file_repository"), ignore_errors=True)
        KioskSQLDb.truncate_table("images")
        KioskSQLDb.truncate_table("kiosk_file_cache")
        KioskSQLDb.truncate_table("dayplan")
        KioskSQLDb.commit()
        file_repos = FileRepository(config, sync.events,
                                    sync.type_repository,
                                    sync)
        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b", "heic.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43", "DSC_2489.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7", "DSC_2528.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29", "A_NEF.NEF"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f", "kiosk_logo.png"),
                  ("fa886c46-12e7-41f1-84eb-ed02929f4cd8", "mummy.svg"),
                  ("4e10c871-1a20-4b03-ba68-07ee857b8e2b", "test.avi"),
                  ("1f10c871-1a20-4b03-ba68-07ee857b8e2b", "candid_1.jpg"),
                  ("2f10c871-1a20-4b03-ba68-07ee857b8e2b", "site_map_1.jpg"),
                  ]
        candids = ["1f10c871-1a20-4b03-ba68-07ee857b8e2b", "2f10c871-1a20-4b03-ba68-07ee857b8e2b"]

        for i in images:
            f = file_repos.get_contextual_file(i[0])
            path_and_filename = os.path.join(test_dir, "images_for_import", i[1])
            assert os.path.exists(path_and_filename)
            assert f.upload(path_and_filename)
            if i[0] == '2f10c871-1a20-4b03-ba68-07ee857b8e2b':
                f.add_tag("site-map", save=True)

            if i[0] not in candids:
                sql = f"""INSERT INTO public.dayplan (uid_unit, image_description, 
                uid_image, uid, created, modified, modified_by, 
                repl_deleted, repl_tag) 
                VALUES ('c109e19c-c73c-cc49-9f58-4ba0a3ad1339', 'white striped ware', 
                '{i[0]}',  
                '{uuid.uuid4()}', 
                '2019-03-11 20:52:30.000000', 
                '2019-03-11 20:52:30.000000', 'sys', false, null);"""
                KioskSQLDb.execute(sql)
            else:
                print(f"{i[0]} is a candid")
            KioskSQLDb.commit()

    def test_fork(self, config, urapdb, shared_datadir, file_repos):
        assert config
        assert urapdb
        self.init_and_import_a_bunch_of_images(urapdb, config, shared_datadir)
        KioskSQLDb.run_sql_script(file_picking_rules_1)

        assert KioskSQLDb.get_field_value_from_sql("c", f"select count(*) c from dayplan") == 7
        assert KioskSQLDb.get_field_value_from_sql("c", f"select count(*) c from images") == 9
        assert KioskSQLDb.get_field_value_from_sql("c", f"select count(*) c from repl_workstation") == 0
        sync = Synchronization()

        workstation = FileMakerWorkstation("x260lk", "Some notebook", sync=sync)
        workstation.recording_group = "default"
        assert workstation.save()
        workstation = sync.get_workstation("FileMakerWorkstation", "x260lk")
        assert workstation
        workstation.debug_mode = "V2"
        assert workstation.transition("FORK", param_callback_progress=lambda *argv: True)
        # add a bunch of tests of the file cache and if the files are really there etc.

        self.assert_table_data_json("x260lk_fm_image_transfer",
                                    os.path.join(test_dir, "json", "urap_test_public_x260lk_fm_image_transfer.json"),
                                    ["uid_file"], True, ["created", "modified", "uid", "filepath_and_name"],
                                    namespace="x260lk")

        self.assert_table_data_json("kiosk_file_cache",
                                    os.path.join(test_dir, "json", "urap_test_public_kiosk_file_cache.json"),
                                    ["uid_file", "representation_type"], True,
                                    ["created", "modified", "uid", "path_and_filename"])

        # has the heic file been converted and cached?
        value = KioskSQLDb.get_field_value_from_sql("filepath_and_name",
                                                   "select filepath_and_name from x260lk.x260lk_fm_image_transfer where uid_file=%s",
                                                    ["31c70ca0-6cb9-4907-8c22-c158485ed23b"])
        assert r"cache\1024x768" in value

        # has the very small file been left untouched?
        value = KioskSQLDb.get_field_value_from_sql("filepath_and_name",
                                                   "select filepath_and_name from x260lk.x260lk_fm_image_transfer where uid_file=%s",
                                                    ["458f0838-305b-48ac-b68f-935fa0e4f09f"])
        assert "cache" not in value
        assert r"file_repository\45\458f0838" in value

        # is the svg there in its original?
        value = KioskSQLDb.get_field_value_from_sql("filepath_and_name",
                                                   "select filepath_and_name from x260lk.x260lk_fm_image_transfer where uid_file=%s",
                                                    ["fa886c46-12e7-41f1-84eb-ed02929f4cd8"])
        assert "cache" not in value
        assert r"file_repository\fa\fa886c46" in value

        # has the avi been turned into a dummy?
        value = KioskSQLDb.get_field_value_from_sql("filepath_and_name",
                                                   "select filepath_and_name from x260lk.x260lk_fm_image_transfer where uid_file=%s",
                                                    ["4e10c871-1a20-4b03-ba68-07ee857b8e2b"])
        assert value == "dummy"

        KioskSQLDb.commit()

        # workstation.delete(True)
