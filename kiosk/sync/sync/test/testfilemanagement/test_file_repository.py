import datetime
import logging
import os
import shutil
import time
import pytest

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from filerepository import FileRepository
from kioskcontextualfile import KioskContextualFile
from kioskfilesmodel import KioskFilesModel
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions, KioskRepresentations
from sync_config import SyncConfig
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_dir = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_dir, "config", r"config_kiosk_imagemanagement.yml")
log_file = os.path.join(test_dir, r"log\test.log")


# information about the test data:
# -----------------------------------------------------------------------------------------
# CC-003-(1-4), CC-002-(1-3) and FH-4-(1-2) are valid identifiers in the database
# (there are according records in the locus, unit, site, collected_material tables)
# e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg is a HEIC
# 7DBD0FAB-1859-4C5B-91B8-DE2BC18550D4.jpg is in the file repository
#
# files under new_files are not in the repository either as records or files
#
# the data dir itself serves as the file repository (that is why there is new_files
# if it comes to uploading files to the file repository)
# shared_datadir is a fixture that makes sure, that all operations take place in a temporary directory.
# To achieve this, the whole data directory with subdirecories is copied before a test runs. Manipulations
# take place in that temporary folder. That is why os.path.join(shared_dir, some_file) points to a
# file and not as one should think os.path.join(r"test/testfilemanagement/data", some_file).


# @pytest.mark.skip
class TestFileRepository(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture()
    def urapdb(self, cfg, shared_datadir):
        cfg = SyncConfig.get_config()
        cfg.config["file_repository"] = str(shared_datadir)
        cfg._file_repository = str(shared_datadir)
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def db(self, urapdb, cfg, shared_datadir):
        assert cfg
        try:
            KioskSQLDb.truncate_table("images")
            KioskSQLDb.truncate_table("kiosk_file_cache")
        except:
            pass
        KioskSQLDb.run_sql_script(os.path.join(shared_datadir,
                                              "insert_file_records.sql"))
        KioskSQLDb.run_sql_script(os.path.join(shared_datadir,
                                              "create_archaeological_context_data.sql"))
        KioskSQLDb.commit()
        return urapdb

    def test_connections(self, db):
        assert db

        assert KioskFilesModel().count() == 15
        kfm = KioskFilesModel(uid="7dbd0fab-1859-4c5b-91b8-de2bc18550d4")
        assert kfm.get_by_key()

    def test_instantiation(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)

        assert file_repos
        assert file_repos.get_path() == str(shared_datadir)
        assert file_repos.get_cache_dir() == os.path.join(shared_datadir, "cache")
        assert file_repos.get_history_path() == os.path.join(shared_datadir, "history")
        assert file_repos._cache_manager

        # get a new file
        ctx_file: KioskContextualFile = file_repos.get_contextual_file()
        assert ctx_file
        assert ctx_file.uid
        assert ctx_file._cache_manager == file_repos._cache_manager
        assert ctx_file._type_repository == file_repos._type_repository
        assert ctx_file._plugin_loader == file_repos._plugin_loader
        assert ctx_file._file_repository == file_repos

    def test_add_new_file(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        ctx_file: KioskContextualFile = file_repos.get_contextual_file()
        ctx_file.description = "a test file"
        ctx_file.ts_file = datetime.datetime.now()
        candid_file = ctx_file.upload(os.path.join(shared_datadir, "new_files", "DSC_2489.png"))
        assert ctx_file.uid
        uid = ctx_file.uid
        assert candid_file
        assert os.path.isfile(candid_file)

        check_file = file_repos.get_contextual_file(uid)
        assert check_file.description == "a test file"
        assert check_file.get() == candid_file

        jpg_type = KioskRepresentationType("jpegs")
        jpg_type.format_request = {"*": "JPEG"}
        jpg = check_file.get(jpg_type, True)
        assert jpg
        assert os.path.isfile(jpg)

    def test_add_heic_file(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        ctx_file: KioskContextualFile = file_repos.get_contextual_file()
        ctx_file.description = "a heic file"
        ctx_file.archaeological_context = "CC-002-1"
        ctx_file.recording_context = "locus_photo"
        ctx_file.ts_file = datetime.datetime.now()
        ctx_file.modified_by = "lkh"
        heic_file = ctx_file.upload(os.path.join(shared_datadir, "new_files", "heic.jpg"))
        assert ctx_file.uid
        uid = ctx_file.uid
        assert heic_file
        assert os.path.isfile(heic_file)

        png_type = KioskRepresentationType("pngs")
        png_type.format_request = {"*": "PNG"}
        png = ctx_file.get(png_type, True)
        assert png
        assert os.path.isfile(png)

    def test_auto_representations(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        ctx_file: KioskContextualFile = file_repos.get_contextual_file()
        ctx_file.description = "a heic file"
        ctx_file.ts_file = datetime.datetime.now()
        ctx_file.modified_by = "lkh"
        heic_file = ctx_file.upload(os.path.join(shared_datadir, "new_files", "heic.jpg"))
        assert ctx_file.uid
        uid = ctx_file.uid
        assert heic_file
        assert kioskstdlib.file_exists(heic_file)

        r = KioskRepresentationType("small")
        r.format_request = {"*": "JPEG"}
        r.dimensions = KioskRepresentationTypeDimensions(128, 128)
        assert kioskstdlib.file_exists(ctx_file.get(r))

        r = KioskRepresentationType("medium")
        r.format_request = {"*": "JPEG"}
        r.dimensions = KioskRepresentationTypeDimensions(256, 256)
        assert kioskstdlib.file_exists(ctx_file.get(r))

    def test_housekeeping(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        file_repos.move_files_to_subdirectories()
        ctx_file = file_repos.get_contextual_file("bffe9764-8aa2-7342-887f-b107a940a69a")
        assert ctx_file
        representation = KioskRepresentations.instantiate_representation_from_config("small")
        if ctx_file.get(representation):
            ctx_file.invalidate_cache()

        ctx_file = file_repos.get_contextual_file("bffe9764-8aa2-7342-887f-b107a940a69a")
        assert ctx_file
        representation = KioskRepresentations.instantiate_representation_from_config("small")
        assert not ctx_file.get(representation)
        assert "BROKEN_CONTEXT" in ctx_file.get_tags()
        assert "BROKEN_FILE" in ctx_file.get_tags()

        # create some images with static file paths added to the filename to test whether that will be fixed.
        KioskSQLDb.execute("update images set filename=\'c:\\file_repository\\' || filename"
                          " where uid='7dbd0fab-1859-4c5b-91b8-de2bc18550d4'")

        # check whether that sql statement had the desired effect
        filename: str = KioskSQLDb.get_field_value_from_sql("filename",
                                                           "select filename from images "
                                                           "where uid='7dbd0fab-1859-4c5b-91b8-de2bc18550d4'")
        assert filename.find("c:\\") == 0

        assert file_repos.do_housekeeping(console=False) == 15
        assert KioskSQLDb.get_field_value("images", "uid", "6c1be9d5-4f7e-294c-aa07-7fc5c9715ded", "tags") == \
               "\"BROKEN_FILE\""
        assert KioskSQLDb.get_field_value("images", "uid", "bffe9764-8aa2-7342-887f-b107a940a69a",
                                         "md5_hash") == "013f48dd4e4d01f4c5eef298afbf8785"
        assert not KioskSQLDb.get_field_value("images", "uid", "6c1be9d5-4f7e-294c-aa07-7fc5c9715ded", "md5_hash")

        ctx_file = file_repos.get_contextual_file("bffe9764-8aa2-7342-887f-b107a940a69a")
        assert ctx_file
        representation = KioskRepresentations.instantiate_representation_from_config("small")
        assert ctx_file.get(representation)
        assert "BROKEN_FILE" not in ctx_file.get_tags()

        # check whether the static path has been removed
        filename: str = KioskSQLDb.get_field_value_from_sql("filename",
                                                           "select filename from images "
                                                           "where uid='7dbd0fab-1859-4c5b-91b8-de2bc18550d4'")
        assert filename.find("c:\\") == -1

    def test_delete_image(self, db, shared_datadir):
        sync = Synchronization()
        logging.info(f"Test delete image")
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        file_repos.move_files_to_subdirectories()
        uid = "31c70ca0-6cb9-4907-8c22-c158485ed23b"
        ctx_file = file_repos.get_contextual_file(uid)
        path_and_filename = ctx_file.get()
        assert os.path.isfile(path_and_filename)
        assert path_and_filename == os.path.join(shared_datadir, uid[:2], f"{uid}.jpg")

        references = file_repos.get_actual_file_references(uid)
        assert len(references) == 2

        file_repos.do_housekeeping()
        representation = ctx_file.get(KioskRepresentations.instantiate_representation_from_config("small"))
        assert representation
        logging.info(f"representation is {representation}")
        assert os.path.isfile(representation)
        assert file_repos.delete_file_from_repository(uid, commit=True) == -1
        time.sleep(2)
        assert file_repos.delete_file_from_repository(uid, clear_referencing_records=True, commit=True) == True
        time.sleep(2)
        assert not os.path.isfile(path_and_filename)
        assert not os.path.isfile(representation)

    def test_replace_image(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        uid = "31c70ca0-6cb9-4907-8c22-c158485ed23b"
        file_repos.move_files_to_subdirectories()
        assert os.path.isfile(os.path.join(shared_datadir, "31", "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))
        ctx_file = file_repos.get_contextual_file(uid)
        path_and_filename = ctx_file.get()
        assert os.path.isfile(path_and_filename)
        assert path_and_filename == os.path.join(shared_datadir, uid[:2], f"{uid}.jpg")

        references = file_repos.get_actual_file_references(uid)
        assert len(references) == 2

        file_repos.do_housekeeping()
        representation = ctx_file.get(KioskRepresentations.instantiate_representation_from_config("small"))
        assert representation
        assert os.path.isfile(representation)

        new_file = os.path.join(shared_datadir, "new_files", "DSC_2489.png")
        assert os.path.isfile(new_file)

        original_md5_hash = kioskstdlib.get_file_hash(path_and_filename)
        representation_hash = kioskstdlib.get_file_hash(representation)
        new_md5_hash = kioskstdlib.get_file_hash(new_file)

        assert new_md5_hash
        assert representation_hash
        assert original_md5_hash
        assert original_md5_hash != new_md5_hash

        assert file_repos.replace_file_in_repository(uid, new_file)

        ctx_file = file_repos.get_contextual_file(uid)
        new_original = ctx_file.get()
        new_original_md5_hash = kioskstdlib.get_file_hash(new_original)
        assert new_original
        logging.info(f"new_original: {new_original}")
        assert new_original_md5_hash
        assert original_md5_hash != new_original_md5_hash
        assert new_md5_hash == new_original_md5_hash

        representation = ctx_file.get(KioskRepresentations.instantiate_representation_from_config("small"))
        assert representation
        assert os.path.isfile(representation)
        logging.info(f"new representation: {representation}")

        new_representation_md5_hash = kioskstdlib.get_file_hash(representation)
        assert new_representation_md5_hash != representation_hash

    def test_move_files_to_subdirectories(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        shutil.copy(os.path.join(shared_datadir, "31", "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"),
                    os.path.join(shared_datadir, "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))
        shutil.rmtree(os.path.join(shared_datadir, "31"))
        uid = "31c70ca0-6cb9-4907-8c22-c158485ed23b"
        assert os.path.isfile(os.path.join(shared_datadir, "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))
        assert not os.path.isdir(os.path.join(shared_datadir, "31"))
        file_repos.move_files_to_subdirectories()
        assert not os.path.isfile(os.path.join(shared_datadir, "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))
        assert os.path.isdir(os.path.join(shared_datadir, "31"))
        assert os.path.isfile(os.path.join(shared_datadir, "31", "31c70ca0-6cb9-4907-8c22-c158485ed23b.jpg"))

    def test_get_files_with_tags(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)

        result = file_repos.get_files_with_tags(["Abi"], "=")
        result.sort()
        assert result == ["0995b71c-8b22-4541-b6ec-326af1da6a0a",
                          "ca2ce4f8-73f2-415f-91aa-69dd4874fdf1"]

        result = file_repos.get_files_with_tags(["Abi", "fire"], "=")
        result.sort()
        assert result == ["0995b71c-8b22-4541-b6ec-326af1da6a0a",
                          "ca2ce4f8-73f2-415f-91aa-69dd4874fdf1",
                          "f830c707-34cb-4428-96eb-5c7498e43d22"]

        result = file_repos.get_files_with_tags(["Abi", "fire"], "<>")
        result.sort()
        assert len(result) == 12
        for f in ["0995b71c-8b22-4541-b6ec-326af1da6a0a",
                  "ca2ce4f8-73f2-415f-91aa-69dd4874fdf1",
                  "f830c707-34cb-4428-96eb-5c7498e43d22"]:
            assert f not in result

    def test_get_files_by_date(self, db, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config(),
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)

        result = file_repos.get_files_by_date("within",
                                              [kioskstdlib.str_to_iso8601("2016-01-07"),
                                               kioskstdlib.str_to_iso8601("2016-01-07")])
        result.sort()
        assert result == ["31c70ca0-6cb9-4907-8c22-c158485ed23b",
                          "6c1be9d5-4f7e-294c-aa07-7fc5c9715ded",
                          "bffe9764-8aa2-7342-887f-b107a940a69a",
                          "c880f79a-ff08-5d4b-839c-0b50983e6991",
                          ]

        result = file_repos.get_files_by_date("!within",
                                              [kioskstdlib.str_to_iso8601("2016-01-07"),
                                               kioskstdlib.str_to_iso8601("2018-11-26")])
        result.sort()

        expected = [
            "1ebc7166-050d-45c7-a492-16d81e108a7b",
            "0995b71c-8b22-4541-b6ec-326af1da6a0a",
            "25e2df4a-c0b5-4444-8b46-50d538ee93a9",
            "ca2ce4f8-73f2-415f-91aa-69dd4874fdf1",
            "f830c707-34cb-4428-96eb-5c7498e43d22",
            "8c1faea2-235d-405f-b165-89b2aec0302b",
            "e44d93b0-c2f7-4a1c-8686-1e3292277999",
            "f589d6a7-0b1d-4473-a133-b23f63846428",
            "45388024-2e2f-495e-9fbb-a4cd0c2dc67b",
            "8c665775-3e00-4bb4-84a9-3b86653cd16e",
            "7dbd0fab-1859-4c5b-91b8-de2bc18550d4",
        ]
        expected.sort()

        assert result == expected

        result = file_repos.get_files_by_date(">",
                                              [kioskstdlib.str_to_iso8601("2018-11-26")])
        result.sort()

        expected = [
            "1ebc7166-050d-45c7-a492-16d81e108a7b",
            "0995b71c-8b22-4541-b6ec-326af1da6a0a",
            "ca2ce4f8-73f2-415f-91aa-69dd4874fdf1",
            "f830c707-34cb-4428-96eb-5c7498e43d22",
            "8c1faea2-235d-405f-b165-89b2aec0302b",
            "e44d93b0-c2f7-4a1c-8686-1e3292277999",
            "f589d6a7-0b1d-4473-a133-b23f63846428",
            "45388024-2e2f-495e-9fbb-a4cd0c2dc67b",
            "8c665775-3e00-4bb4-84a9-3b86653cd16e",
            "7dbd0fab-1859-4c5b-91b8-de2bc18550d4",
        ]
        expected.sort()

        assert result == expected

        result = file_repos.get_files_by_date("<",
                                              [kioskstdlib.str_to_iso8601("2018-11-26")])
        result.sort()

        expected = ['25e2df4a-c0b5-4444-8b46-50d538ee93a9',
                    "31c70ca0-6cb9-4907-8c22-c158485ed23b",
                    "6c1be9d5-4f7e-294c-aa07-7fc5c9715ded",
                    "bffe9764-8aa2-7342-887f-b107a940a69a",
                    "c880f79a-ff08-5d4b-839c-0b50983e6991",
                    ]
        expected.sort()

        assert result == expected
