import logging
import os
from shutil import copyfile

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from filerepository import FileRepository
from kioskfilecache import KioskFileCache
from kioskfilecachemodel import KioskFileCacheModel
from kioskfilesmodel import KioskFilesModel
from kiosklogicalfile import KioskCachedFile
from kiosklogicalfile import KioskLogicalFile
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions
from sync_config import SyncConfig
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb


# @pytest.mark.skip
class TestKioskLogicalFile(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file="config_kiosk_imagemanagement.yml")

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def db_session(self, cfg, urapdb):
        urapdb.close()
        return KioskSQLDb

    @pytest.fixture()
    def db_files_truncated(self, cfg, db_session):
        # cfg = SyncConfig.get_config({"config_file": config_file})
        assert cfg.database_name == "urap_test"
        db_session.truncate_table("images")
        db_session.commit()
        return db_session

    @pytest.fixture()
    def db_files_initialized(self, db_files_truncated, shared_datadir):
        KioskSQLDb.run_sql_script(os.path.join(shared_datadir,
                                              "insert_file_records.sql"))

        KioskSQLDb.commit()
        return db_files_truncated

    @pytest.fixture()
    def test_file(self, shared_datadir):
        test_file = os.path.join(shared_datadir, "7D", "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D2.jpg")
        copyfile(os.path.join(shared_datadir, "7D", "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D4.jpg"),
                 test_file)

        yield test_file

        os.remove(test_file)

    def test_connections(self, db_files_initialized):
        assert db_files_initialized
        assert KioskFilesModel().count() == 15
        test_rec = KioskFilesModel(uid="7dbd0fab-1859-4c5b-91b8-de2bc18550d4")
        assert test_rec.get_by_key()
        assert test_rec.created

    def test_get_file_record(self, db_files_initialized):
        sync = Synchronization()
        assert sync.type_repository
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid)
        assert kiosk_file._record_exists()
        assert kiosk_file._get_file_record()
        assert str(kiosk_file._file_record.uid) == uid

        kiosk_file = KioskLogicalFile(uid)
        assert kiosk_file._get_file_record()
        assert str(kiosk_file._file_record.uid) == uid

        kiosk_file = KioskLogicalFile(uid[:-1] + "3")
        assert not kiosk_file._record_exists()
        assert not kiosk_file._get_file_record()

    def test_filename(self, db_files_initialized, shared_datadir):
        sync = Synchronization()
        assert sync.type_repository
        file_repos = FileRepository(SyncConfig.get_config())
        assert file_repos
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file._get_path_and_filename() == os.path.join(file_repos.get_path(), "7d",
                                                                   "7dbd0fab-1859-4c5b-91b8-de2bc18550d4.jpg")

        uid = "8c665775-3e00-4bb4-84a9-3b86653cd16e"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file._get_path_and_filename() == os.path.join(file_repos.get_path(), "8c",
                                                                   "8c665775-3e00-4bb4-84a9-3b86653cd16e.tif")

    def test_conclude_filename_from_filerepository(self, db_files_initialized, shared_datadir):
        sync = Synchronization()
        assert sync.type_repository
        file_repos = FileRepository(SyncConfig.get_config())
        assert file_repos
        uid = "25e2df4a-c0b5-4444-8b46-50d538ee93a9"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert not kiosk_file._get_path_and_filename()
        assert kiosk_file.detect_filename_from_filerepository()
        uid = "25e2df4a-c0b5-4444-8b46-50d538ee93a9"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file._get_path_and_filename()
        assert kiosk_file.file_exists()

    def test_file_exists(self, db_files_initialized):
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert file_repos
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file.file_exists()

        kiosk_file = KioskLogicalFile(uid[:-1] + "3", file_repository=file_repos)
        assert not kiosk_file.file_exists()

        uid = "8c665775-3e00-4bb4-84a9-3b86653cd16e"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file.file_exists()

    def test_get_original(self, db_files_initialized):
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert file_repos

        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file
        filename_and_path = kiosk_file.get()
        assert filename_and_path
        assert os.path.isfile(str(filename_and_path))

        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d3"  # does not exist
        kiosk_file = KioskLogicalFile(uid, file_repository=file_repos)
        assert kiosk_file
        filename_and_path = kiosk_file.get()
        assert not filename_and_path

    def test_create_representation(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache")
        db_files_initialized.commit()
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert not path_and_filename
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1

        assert not cache_manager.is_valid(uid, representation)
        assert os.path.isdir(os.path.join(shared_datadir, "cache"))
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))

        assert sync.load_plugins(["defaultfilehandling", "heicfilehandling"])

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(str(path_and_filename))
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1
        assert cache_manager.is_valid(uid, representation)

        # try a heic
        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(str(path_and_filename))
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1
        assert cache_manager.is_valid(uid, representation)

        # make a different representation of the heic
        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs640X480")
        representation.format_request = {"*": "JPEG"}
        representation.dimensions = KioskRepresentationTypeDimensions(width=640, height=480)
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(path_and_filename)
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 2
        assert cache_manager.is_valid(uid, representation)
        self._get_representation(db_files_initialized, shared_datadir)

    def _get_representation(self, db_files_initialized, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskCachedFile(uid,
                                     cache_manager=cache_manager,
                                     file_repository=file_repos,
                                     type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs640X480")
        representation.format_request = {"*": "JPEG"}
        representation.dimensions = KioskRepresentationTypeDimensions(width=640, height=480)
        path_and_filename = kiosk_file.get(representation, create=False)
        assert path_and_filename
        assert os.path.isfile(path_and_filename)

    def test_load_plugins(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache;")
        db_files_initialized.commit()
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert not path_and_filename

        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository,
                                      plugin_loader=sync)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(path_and_filename)
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1
        assert cache_manager.is_valid(uid, representation)

        # try a heic
        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(path_and_filename)
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1
        assert cache_manager.is_valid(uid, representation)

        # make a different representation of the heic
        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs640X480")
        representation.format_request = {"*": "JPEG"}
        representation.dimensions = KioskRepresentationTypeDimensions(width=640, height=480)
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(path_and_filename)
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 2
        assert cache_manager.is_valid(uid, representation)
        self._get_representation(db_files_initialized, shared_datadir)

    def test_dimensions_only(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache;")
        db_files_initialized.commit()

        assert sync.load_plugins(["defaultfilehandling", "heicfilehandling"])

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "!"}
        representation.dimensions = KioskRepresentationTypeDimensions(100, 100)
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename
        assert os.path.isfile(str(path_and_filename))
        assert os.path.isdir(os.path.join(shared_datadir, "cache", representation.unique_name))
        assert KioskFileCacheModel().count(where="uid_file=%s",
                                           params=[uid]) == 1
        assert cache_manager.is_valid(uid, representation)
        logging.debug(f"{self.__class__.__name__}. : {path_and_filename}")

    def test_get_file_attributes(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache;")
        db_files_initialized.commit()

        assert sync.load_plugins(["defaultfilehandling", "heicfilehandling"])

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # Let's start with a new file. It should not have file attributes
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        attr = kiosk_file.get_file_attributes()
        assert not attr

        # So we have to force it to retrieve them
        attr = kiosk_file.get_file_attributes(force_it=True)
        assert attr
        assert attr["format"] == "JPEG"

        # Let's start with a new heic file. It should not have file attributes
        uid = "e44d93b0-c2f7-4a1c-8686-1e3292277999"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        attr = kiosk_file.get_file_attributes()
        assert not attr

        # so let's force it again
        attr = kiosk_file.get_file_attributes(force_it=True)
        assert attr
        assert attr["format"] == "HEIC"

        # should work now without the force
        attr = kiosk_file.get_file_attributes()
        assert attr
        assert attr["format"] == "HEIC"

        # and after meta information had been acquired once the database
        # should have it now
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)
        attr = kiosk_file.get_file_attributes()
        assert attr
        assert attr["format"] == "HEIC"

        # same for the first file
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)
        attr = kiosk_file.get_file_attributes()
        assert attr
        assert attr["format"] == "JPEG"

    def test_file_attributes_after_get(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache;")
        db_files_initialized.commit()

        assert sync.load_plugins(["defaultfilehandling", "heicfilehandling"])

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # Let's start with a new file. It should not have file attributes
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        attr = kiosk_file.get_file_attributes()
        assert not attr

        # Let's get a representation. That should also retrieve file attributes
        representation = KioskRepresentationType("jpgs")
        representation.format_request = {"*": "!"}
        representation.dimensions = KioskRepresentationTypeDimensions(100, 100)
        path_and_filename = kiosk_file.get(representation, create=True)
        assert path_and_filename

        attr = kiosk_file.get_file_attributes()
        assert attr
        assert attr["format"] == "JPEG"

        # is it still there?
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        attr = kiosk_file.get_file_attributes()
        assert attr
        assert attr["format"] == "JPEG"

        # good, now it should be dropped
        kiosk_file.invalidate_cache()
        attr = kiosk_file.get_file_attributes()
        assert not attr

        # and reloading it should make no difference
        # Let's start with a new file. It should not have file attributes
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)

        attr = kiosk_file.get_file_attributes()
        assert not attr

    def test_auto_representations(self, db_files_initialized, test_file, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        assert test_file
        assert os.path.exists(test_file)

        db_files_initialized.execute("truncate table kiosk_file_cache;")
        db_files_initialized.commit()

        assert sync.load_plugins(["defaultfilehandling", "heicfilehandling"])

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # Let's start with a new file. It should not have file attributes
        uid = "7dbd0fab-1859-4c5b-91b8-de2bc18550d4"
        kiosk_file = KioskLogicalFile(uid,
                                      cache_manager=cache_manager,
                                      file_repository=file_repos,
                                      type_repository=sync.type_repository)
        representation_type = KioskRepresentationType("128x128")

        assert not cache_manager.get(uid, representation_type)
        # kiosk_file.create_auto_representations()

    @pytest.mark.skip
    def test_delete(self):
        #  todo:
        assert False

    @pytest.mark.skip
    def test_get_representation(self):
        # todo
        assert False

    @pytest.mark.skip
    def test_get_image_count(self):
        # todo
        assert False

    @pytest.mark.skip
    def test_set_filename(self):
        # todo
        assert False
