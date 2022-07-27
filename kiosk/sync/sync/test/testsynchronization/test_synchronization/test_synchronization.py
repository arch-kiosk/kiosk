import datetime
import logging
import os
import time

import pytest
from psycopg2 import Error as PsycopgError
from psycopg2.errorcodes import UNIQUE_VIOLATION

import kioskstdlib
from filerepository import FileRepository
from kioskrepresentationtype import KioskRepresentations
from kiosksqldb import KioskSQLDb
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_dir = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_dir, r"data\config\config_test.yml")
log_file = os.path.join(test_dir, r"log\test.log")
parent_test_dir = kioskstdlib.get_parent_dir(kioskstdlib.get_parent_dir(test_dir))


config_file = os.path.join(test_dir, r"data\config\config_test.yml")

rotation_applied = 0


# @pytest.mark.skip
class TestSynchronization(KioskPyTestHelper):

    @pytest.fixture()
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    @pytest.fixture()
    def sync(self, config):
        sync = Synchronization()
        return sync

    @pytest.fixture()
    def file_repos(self, config, sync):
        file_repos = FileRepository(config, sync.events,
                                    sync.type_repository,
                                    sync)
        return file_repos

    def test_update_sync_time(self, config, urapdb, sync):
        assert sync
        KioskSQLDb.truncate_table("replication")

        assert not Synchronization.get_sync_time()
        self.assert_table_isempty("replication")
        sync.update_sync_time()
        self.assert_table_isnotempty("replication")
        sync_time = Synchronization.get_sync_time()
        assert sync_time
        time.sleep(1)
        sync.update_sync_time()
        sync_time_new = Synchronization.get_sync_time()
        assert isinstance(sync_time_new, datetime.datetime)
        assert sync_time_new > sync_time

    def init_scenario(self, config, urapdb, sync, file_repos):
        assert sync
        assert file_repos
        assert config.database_name == "urap_test"

        logging.debug(f"************* initializing scenario **************")
        try:
            KioskSQLDb.rollback()
        except Exception as e:
            logging.debug(f"Exception in init_scenario: {repr(e)}")
            pass

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_unit_fa.sql"))

        workstation = FileMakerWorkstation("x260lk", sync=sync)
        if workstation.exists():
            assert workstation.delete(commit=True)
        KioskSQLDb.commit()
        self.assert_table_missing("x260lk.x260lk_images")

        assert KioskSQLDb.get_field_value_from_sql("c", f"select count(*) c from repl_workstation") == 0
        sync = Synchronization()

        workstation = FileMakerWorkstation("x260lk", "Some Device", sync=sync)
        workstation.recording_group = "ipad"
        assert workstation.save()
        workstation = sync.get_workstation("FileMakerWorkstation", "x260lk")
        assert workstation
        workstation.debug_mode = "V2"
        workstation._set_state("BACK_FROM_FIELD", True)

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "urap_test_x260lk_tables_and_records.sql"))

        workstation = FileMakerWorkstation("x260lk", "Some notebook", sync=sync)
        assert workstation.exists()
        assert workstation.get_state() == workstation.BACK_FROM_FIELD

    def test_synchronize_v2(self, config, sync, urapdb, shared_datadir, file_repos):

        assert config
        assert urapdb

        self.set_file_repos_dir(config, shared_datadir)

        self.init_scenario(config, urapdb, sync, file_repos)

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("fa886c46-12e7-41f1-84eb-ed02929f4cd8.svg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"

        assert sync.synchronize()

        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img[0:2], img)
            assert os.path.isfile(filename)

        filename = os.path.join(shared_datadir, "file_repository",
                                "4e10c871-1a20-4b03-ba68-07ee857b8e2b.avi")
        assert not os.path.isfile(filename)

    def test_exif_no_manipulation(self, config, sync, urapdb, shared_datadir, file_repos):

        self.init_scenario(config, urapdb, shared_datadir, sync)

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"
        assert sync.synchronize()

        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img[0:2], img)
            assert os.path.isfile(filename)

        filename = os.path.join(shared_datadir, "file_repository",
                                "c3", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        assert kioskstdlib.get_exif_data(os.path.join(shared_datadir,
                                                     "filemaker",
                                                     "from_work_station",
                                                     "x260lk",
                                                     "files",
                                                     "c377be85-fa86-4772-ae30-3c0485ce1504.jpg"))["Exif"]
        assert os.path.isfile(filename)
        exif = kioskstdlib.get_exif_data(filename)["Exif"]
        assert exif
        representation = KioskRepresentations.instantiate_representation_from_config("small")
        f = file_repos.get_contextual_file("c377be85-fa86-4772-ae30-3c0485ce1504")
        r_filename = f.get(representation)
        assert r_filename
        logging.debug(f"{self.__class__.__name__}: representation is {r_filename}")
        exif2 = kioskstdlib.get_exif_data(r_filename)["Exif"]
        assert exif == exif2

        #  test the exif data of the heic file
        filename = os.path.join(shared_datadir, "file_repository",
                                "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg")

        # assert kioskstdlib.get_exif_data(os.path.join(shared_datadir,
        #                                   "filemaker",
        #                                   "from_work_station",
        #                                   "x260lk",
        #                                   "files",
        #                                   "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))["Exif"]
        # assert os.path.isfile(filename)
        # exif = kioskstdlib.get_exif_data(filename)["Exif"]
        # assert exif
        representation = KioskRepresentations.instantiate_representation_from_config("small")
        f = file_repos.get_contextual_file("31c70ca0-6cb9-4907-8c22-c158485ed23b")
        r_filename = f.get(representation)
        assert r_filename
        logging.debug(f"{self.__class__.__name__}: representation is {r_filename}")
        exif2 = kioskstdlib.get_exif_data(r_filename)["Exif"]
        assert exif2

    def test_exif_manipulation(self, config, sync, urapdb, shared_datadir, file_repos):

        self.init_scenario(config, urapdb, shared_datadir, sync)

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img[0:2], img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"
        assert sync.synchronize()

        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img[0:2], img)
            assert os.path.isfile(filename)

        filename = os.path.join(shared_datadir, "file_repository",
                                "c3", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        assert kioskstdlib.get_exif_data(os.path.join(shared_datadir,
                                                     "filemaker",
                                                     "from_work_station",
                                                     "x260lk",
                                                     "files",
                                                     "c377be85-fa86-4772-ae30-3c0485ce1504.jpg"))["Exif"]
        assert os.path.isfile(filename)
        exif = kioskstdlib.get_exif_data(filename)["Exif"]
        assert exif

        representation = KioskRepresentations.instantiate_representation_from_config("small_no_exif")
        f = file_repos.get_contextual_file("c377be85-fa86-4772-ae30-3c0485ce1504")
        r_filename = f.get(representation)
        assert r_filename
        logging.debug(f"{self.__class__.__name__}: representation is {r_filename}")
        exif2 = kioskstdlib.get_exif_data(r_filename)["Exif"]
        assert not exif2

        #  test the exif data of the heic file

        # filename = os.path.join(shared_datadir, "file_repository",
        #                                    "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg")
        #
        # assert os.path.isfile(filename)
        # exif = kioskstdlib.get_exif_data(filename)["Exif"]
        # assert exif

        representation = KioskRepresentations.instantiate_representation_from_config("small_no_exif")
        f = file_repos.get_contextual_file("31c70ca0-6cb9-4907-8c22-c158485ed23b")
        r_filename = f.get(representation)
        assert r_filename
        logging.debug(f"{self.__class__.__name__}: representation is {r_filename}")
        exif2 = kioskstdlib.get_exif_data(r_filename)["Exif"]
        assert not exif2

    def test_rotation_manipulation(self, config, sync, urapdb, shared_datadir, file_repos, monkeypatch):
        # test whether a rotation manipulation is applied to one of the images
        # find a way to test which manipulations have been executed during sync?

        import defaultfilehandling.defaultfilehandling

        def mock_rotate(self, img, representation):
            global rotation_applied
            rotation_applied += 1
            return img

        global rotation_applied
        rotation_applied = 0

        self.init_scenario(config, urapdb, shared_datadir, sync)

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"
        assert sync.synchronize()

        filename = os.path.join(shared_datadir, "file_repository", "c3", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        assert os.path.isfile(filename)

        representation_type = KioskRepresentations.instantiate_representation_from_config("rotate_master")
        monkeypatch.setattr(defaultfilehandling.defaultfilehandling.KioskPhysicalPillowFile, "_fix_rotation",
                            mock_rotate)
        representation = file_repos.get_contextual_file(
            "c377be85-fa86-4772-ae30-3c0485ce1504").get(representation_type, True)
        assert os.path.isfile(representation)
        assert rotation_applied == 1
        exif = kioskstdlib.get_exif_data(representation)
        assert exif["Exif"]

        rotation_applied == 0
        # test that a rotation is not applied twice for a child of that master
        representation_type = KioskRepresentations.instantiate_representation_from_config("rotate_master_child")
        # monkeypatch.setattr(defaultfilehandling.defaultfilehandling.KioskPhysicalPillowFile, "_fix_rotation",
        # mock_rotate)
        representation = file_repos.get_contextual_file(
            "c377be85-fa86-4772-ae30-3c0485ce1504").get(representation_type, True)
        assert os.path.isfile(representation)
        exif = kioskstdlib.get_exif_data(representation)
        assert not exif["Exif"]

        assert rotation_applied == 1

    def test_synchronize_redundant_file(self, config, sync, urapdb, shared_datadir, file_repos):

        assert config
        assert urapdb

        self.set_file_repos_dir(config, shared_datadir)

        self.init_scenario(config, urapdb, shared_datadir, sync)
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "urap_test_x260lk_redundant_images.sql"))

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("fa886c46-12e7-41f1-84eb-ed02929f4cd8.svg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"

        assert not sync.synchronize()
        assert sync.duplicate_files == 3

    def test_synchronize_redundant_file_with_drop_option(self, config, urapdb, shared_datadir, file_repos):

        assert config
        assert urapdb

        sync = Synchronization(options={"drop_duplicates": True})

        self.set_file_repos_dir(config, shared_datadir)

        self.init_scenario(config, urapdb, shared_datadir, sync)
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "urap_test_x260lk_redundant_images.sql"))

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("fa886c46-12e7-41f1-84eb-ed02929f4cd8.svg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"

        assert sync.synchronize()
        assert sync.duplicate_files == 3
        assert sync.ignored_files == 3
        self.assert_record_exists("site", value="e72c73dc-abcd-4168-b290-c8f2ff2aaf29", field="uid_site_map")
        self.assert_record_missing("site", value="e72c73dc-abf5-4168-b290-c8f2ff2aaf29", field="uid_site_map")
        self.assert_record_exists("dayplan", value="0d09f3c4-0456-403d-80e0-bab677bbc0b7", field="uid_image")
        self.assert_record_exists("dayplan", value="0d09f3c4-0123-403d-80e0-bab677bbc0b7", field="uid_image")

    def test__init_rewiring_files(self, config, urapdb, sync):
        self.assert_table_missing("DEBUG_REWIRE_FILES")
        sync.options["rewire_duplicates"] = False
        sync.debug_mode = "v2"
        sync._init_rewiring_files()
        self.assert_table_missing("DEBUG_REWIRE_FILES")
        sync.options["rewire_duplicates"] = True
        sync._init_rewiring_files()
        self.assert_table("DEBUG_REWIRE_FILES")
        KioskSQLDb.rollback()
        sync.debug_mode = ""
        sync.options["rewire_duplicates"] = True
        sync._init_rewiring_files()
        assert KioskSQLDb.does_temp_table_exist("TEMP_REWIRE_FILES")

    def test__add_file_to_rewire(self, config, urapdb, sync):
        sync.debug_mode = ""
        sync.options["rewire_duplicates"] = True
        sync._init_rewiring_files()
        assert KioskSQLDb.does_temp_table_exist("TEMP_REWIRE_FILES")
        assert sync._add_file_to_rewire("31c70ca0-6cb9-4907-8c22-c158485ed23b", "fa886c46-12e7-41f1-84eb-ed02929f4cd8")
        try:
            sync._add_file_to_rewire("31c70ca0-6cb9-4907-8c22-c158485ed23b", "fa886c46-12e7-41f1-84eb-ed02929f4cd8")
            assert False
        except PsycopgError as e:
            assert e.pgcode == UNIQUE_VIOLATION

    def test_synchronize_redundant_file_with_rewire_option(self, config, urapdb, shared_datadir, file_repos):

        assert config
        assert urapdb

        sync = Synchronization(options={"rewire_duplicates": True})

        self.set_file_repos_dir(config, shared_datadir)

        self.init_scenario(config, urapdb, shared_datadir, sync)
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "urap_test_x260lk_redundant_images.sql"))

        images = [("31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                  ("9cab65cb-1368-4659-be5a-e2eaf132aa43.png"),
                  ("0d09f3c4-0f67-403d-80e0-bab677bbc0b7.jpg"),
                  ("e72c73dc-abf5-4168-b290-c8f2ff2aaf29.jpg"),
                  ("458f0838-305b-48ac-b68f-935fa0e4f09f.png"),
                  ("fa886c46-12e7-41f1-84eb-ed02929f4cd8.svg")
                  ]
        logging.debug(f"{os.path.join(shared_datadir, 'file_repository')}")
        for img in images:
            filename = os.path.join(shared_datadir, "file_repository", img)
            assert not os.path.isfile(filename)

        sync.debug_mode = "V2"

        assert sync.synchronize()
        assert sync.duplicate_files == 3

        assert sync.ignored_files == 0

        assert KioskSQLDb.get_records(f"select" + f" * from \"{sync._table_rewire_files}\"") == [
            ['0d09f3c4-0123-403d-80e0-bab677bbc0b7',
             '0d09f3c4-0f67-403d-80e0-bab677bbc0b7'],
            ['0d09f3c4-0456-403d-80e0-bab677bbc0b7',
             '0d09f3c4-0f67-403d-80e0-bab677bbc0b7'],
            ['e72c73dc-abcd-4168-b290-c8f2ff2aaf29',
             'e72c73dc-abf5-4168-b290-c8f2ff2aaf29']
        ]

        self.assert_record_missing("site", value="e72c73dc-abcd-4168-b290-c8f2ff2aaf29", field="uid_site_map")
        self.assert_record_exists("site", value="e72c73dc-abf5-4168-b290-c8f2ff2aaf29", field="uid_site_map")
        self.assert_record_missing("dayplan", value="0d09f3c4-0456-403d-80e0-bab677bbc0b7", field="uid_image")
        self.assert_record_exists("dayplan", value="0d09f3c4-0f67-403d-80e0-bab677bbc0b7", field="uid_image")
        self.assert_record_missing("dayplan", value="0d09f3c4-0123-403d-80e0-bab677bbc0b7", field="uid_image")
        self.assert_record_exists("dayplan", value="0d09f3c4-0f67-403d-80e0-bab677bbc0b7", field="uid_image")
