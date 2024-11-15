import datetime
import logging
import os
import time
from shutil import copyfile

import pytest

import kioskstdlib
from filerepository import FileRepository
from kioskcontextualfile import KioskContextualFile
from kioskfilecache import KioskFileCache
from kioskfilecachemodel import KioskFileCacheModel
from kioskfilesmodel import KioskFilesModel
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions
from sync_config import SyncConfig
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from test.mock_timezoneinfo import mock_kiosk_time_zones
from tz.kiosktimezones import KioskTimeZones


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


class TestKioskContextualFile(KioskPyTestHelper):

    @pytest.fixture()
    def cfg(self):
        cfg = self.get_standard_test_config(__file__, test_config_file="config_kiosk_imagemanagement.yml")
        dsd_file = os.path.join(self.test_path, 'config', 'dsd', 'test_kioskcontextualfile_dsd3.yml')
        cfg["dataset_definition"] = dsd_file
        return cfg

    @pytest.fixture()
    def urapdb(self, cfg):
        urapdb = self.get_urapdb(cfg)
        urapdb.close()
        return KioskSQLDb

    @pytest.fixture()
    def urapdb_with_records(self, cfg, urapdb):
        sql_records = os.path.join(self.test_path,
                                   "data",
                                   "records_kiosk_context.sql")
        KioskSQLDb.run_sql_script(sql_records)
        return urapdb

    @pytest.fixture()
    def db_files_truncated(self, cfg, urapdb, shared_datadir):
        # cfg = SyncConfig.get_config()
        # assert cfg
        cfg.config["file_repository"] = shared_datadir
        cfg._file_repository = shared_datadir

        urapdb.truncate_table("images")
        urapdb.truncate_table("kiosk_file_cache")
        urapdb.commit()
        return urapdb

    @pytest.fixture()
    def db_files_initialized(self, cfg, db_files_truncated, shared_datadir):
        sql_insert_files = os.path.join(self.test_path, "data", "insert_file_records.sql")
        self.sql_context_data = os.path.join(self.test_path, "data", "create_archaeological_context_data.sql")

        KioskSQLDb.run_sql_script(sql_insert_files)

        KioskSQLDb.commit()
        return db_files_truncated

    @pytest.fixture()
    def test_file(self, shared_datadir):
        test_file = os.path.join(shared_datadir, "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D2.jpg")
        copyfile(os.path.join(shared_datadir, "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D4.jpg"),
                 test_file)

        yield test_file

        os.remove(test_file)

    def test_connections(self, db_files_initialized):
        logging.debug(f"{self.__class__.__name__}.test_connections : DRIN!")
        assert db_files_initialized
        session = db_files_initialized
        assert KioskFilesModel().count() == 15
        kfm = KioskFilesModel(uid="7dbd0fab-1859-4c5b-91b8-de2bc18550d4")
        assert kfm.get_by_key()
        assert kfm.img_proxy

    def test_instantiation(self, db_files_initialized, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        file = KioskContextualFile(None, cache_manager=cache_manager,
                                   file_repository=file_repos, type_repository=sync.type_repository)
        assert file
        assert file.uid
        assert kioskstdlib.check_uuid(file.uid)

        path_and_filename = os.path.join(shared_datadir, "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D2.jpg")
        uid = kioskstdlib.get_uuid_from_filename(path_and_filename)
        file = KioskContextualFile(uid, cache_manager, file_repos, sync.type_repository)
        assert file
        assert file.uid
        assert kioskstdlib.check_uuid(file.uid)

    def test_tags(self, db_files_initialized, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        file = KioskContextualFile(None, cache_manager, file_repos, sync.type_repository)
        tags = ["tag1", "tag2", "tag3"]
        file.set_tags(tags)
        assert file.get_tags() == ["tag1", "tag2", "tag3"]
        assert file.get_csv_tags() == '"tag1","tag2","tag3"'

    def test_uid_from_hash(self, db_files_initialized, shared_datadir, mock_kiosk_time_zones):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        path_and_filename = os.path.join(shared_datadir, "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D4.jpg")
        file = KioskContextualFile(None, cache_manager, file_repos, sync.type_repository)
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        rc = file._get_uid_from_hash(path_and_filename)
        assert not rc

        md5_hash = "92f7d42c03d33d9a6ec1a8eee5d39e9a"
        file = KioskContextualFile(None, cache_manager, file_repos, sync.type_repository)
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(96554373))
        rc = file._get_uid_from_hash(md5_hash=md5_hash)
        assert rc == "f589d6a7-0b1d-4473-a133-b23f63846428"

        path_and_filename = os.path.join(shared_datadir, "25E2DF4A-C0B5-4444-8B46-50D538EE93A9.jpg")
        md5_hash = kioskstdlib.get_file_hash(path_and_filename)
        rc = file._get_uid_from_hash(path_and_filename=path_and_filename)
        assert rc == "25e2df4a-c0b5-4444-8b46-50d538ee93a9"

    def test_upload_candid(self, db_files_initialized, shared_datadir, mock_kiosk_time_zones):
        KioskSQLDb.run_sql_script(os.path.join(self.sql_context_data))
        KioskSQLDb.commit()

        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # file already exists, but override not given
        path_and_filename = os.path.join(shared_datadir, "8c665775-3e00-4bb4-84a9-3b86653cd16e.tif")
        uid = kioskstdlib.get_uuid_from_filename(path_and_filename)
        file = KioskContextualFile(uid, cache_manager, file_repos, sync.type_repository)
        assert file.uid == uid
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        dst_path_and_filename = file.upload(path_and_filename)
        assert not dst_path_and_filename

        # different uid but same hash like an existing file should not work
        file = KioskContextualFile(None, cache_manager, file_repos, sync.type_repository)
        assert file.uid
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        uid = file.uid
        dst_path_and_filename = file.upload(path_and_filename)
        assert not dst_path_and_filename

        # this should work
        path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        uid = kioskstdlib.get_uuid_from_filename(path_and_filename)
        file = KioskContextualFile(uid, cache_manager, file_repos, sync.type_repository)
        assert file.uid == uid
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        dst_path_and_filename = file.upload(path_and_filename)
        assert dst_path_and_filename == os.path.join(shared_datadir, kioskstdlib.get_filename(path_and_filename)[:2],
                                                     kioskstdlib.get_filename(path_and_filename))
        assert os.path.exists(dst_path_and_filename)

        # let's override it with itself (should not work without override)
        time.sleep(2)
        file = KioskContextualFile(uid, cache_manager, file_repos, sync.type_repository)
        assert file.uid == uid
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        no_dst_path_and_filename = file.upload(path_and_filename)
        assert not no_dst_path_and_filename

        old_image_proxy = f"{file._file_record.img_proxy}"
        old_modified = file.modified

        # let's override it with something else with the override parameter given
        uid = file.uid
        old_hash = kioskstdlib.get_file_hash(dst_path_and_filename)
        path_and_filename = os.path.join(shared_datadir, "new_files", "DSC_2528.jpg")
        new_hash = kioskstdlib.get_file_hash(path_and_filename)

        # file.set_modified(*KioskTimeZones.get_modified_components_from_now(96554373))
        new_dst_path_and_filename = file.upload(path_and_filename, override=True)
        assert new_dst_path_and_filename == os.path.join(shared_datadir, uid[:2],
                                                         uid + ".jpg")
        assert os.path.isfile(new_dst_path_and_filename)
        md5_hash = kioskstdlib.get_file_hash(new_dst_path_and_filename)
        assert md5_hash == new_hash

        history_file = kioskstdlib.get_first_matching_file(file_repos.get_history_path(), uid, prefix="*")
        assert history_file
        history_file = os.path.join(file_repos.get_history_path(), history_file)
        hash_history_file = kioskstdlib.get_file_hash(history_file)
        assert old_hash == hash_history_file

        file = KioskContextualFile(uid, cache_manager, file_repos, sync.type_repository)
        assert file.modified == old_modified
        assert f"{file._file_record.img_proxy}" != old_image_proxy

        # let's override it with a different file type and check whether the old file is
        # gone
        file_to_replace = new_dst_path_and_filename
        path_and_filename = os.path.join(shared_datadir, "new_files", "DSC_2489.png")
        new_hash = kioskstdlib.get_file_hash(path_and_filename)
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        new_dst_path_and_filename = file.upload(path_and_filename, override=True)
        assert new_dst_path_and_filename == os.path.join(shared_datadir, uid[:2],
                                                         uid + ".png")
        assert os.path.isfile(new_dst_path_and_filename)
        assert not os.path.isfile(file_to_replace)

    def test_upload_with_identifier(self, db_files_initialized, urapdb_with_records, shared_datadir,
                                    mock_kiosk_time_zones):
        KioskSQLDb.run_sql_script(os.path.join(self.sql_context_data))
        KioskSQLDb.commit()

        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)
        # first upload: that one should work
        path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        uid = kioskstdlib.get_uuid_from_filename(path_and_filename)
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)
        assert not file.contexts.get_contexts()
        assert not file._file_record
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))

        file.contexts.add_context('FA-003-1')
        file.description = "my description"
        assert file.uid == uid

        # upload
        dst_path_and_filename = file.upload(path_and_filename, push_contexts=True)
        assert dst_path_and_filename

        assert dst_path_and_filename == os.path.join(shared_datadir, kioskstdlib.get_filename(path_and_filename)[:2],
                                                     kioskstdlib.get_filename(path_and_filename))
        assert os.path.exists(dst_path_and_filename)
        self.assert_table("file_identifier_cache", "context_cache")

        file = KioskContextualFile(uid, cache_manager, file_repos,
                                   sync.type_repository, test_mode=True, plugin_loader=sync)
        assert file._file_record
        assert self.sort_structure(file.contexts.get_contexts()) == self.sort_structure(
            [('FA-003-1', 'collected_material_photo')])
        assert file.description == "my description"
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))

        # let's do it again but with new contexts
        file.contexts.add_context("FA-003")
        file.modified_by = "lkh"
        # upload
        dst_path_and_filename = file.upload(path_and_filename, push_contexts=True, override=True)

        assert dst_path_and_filename == os.path.join(shared_datadir, kioskstdlib.get_filename(path_and_filename)[:2],
                                                     kioskstdlib.get_filename(path_and_filename))
        assert os.path.exists(dst_path_and_filename)

        file = KioskContextualFile(uid, cache_manager, file_repos,
                                   sync.type_repository, test_mode=True, plugin_loader=sync)
        assert file._file_record
        assert self.sort_structure(file.contexts.get_contexts()) == self.sort_structure(
            [('FA-003-1', 'collected_material_photo'), ('FA-003', 'locus_photo')])
        assert file.description == "my description"
        assert file.modified_by == "lkh"
        assert file.modified
        assert file._file_record.created

    def test_upload_cache_invalidation(self, db_files_initialized, shared_datadir):
        # init code
        KioskSQLDb.run_sql_script(os.path.join(self.sql_context_data))
        KioskSQLDb.commit()

        sync = Synchronization()

        file_repos = FileRepository(SyncConfig.get_config())
        file_repos.move_files_to_subdirectories()
        assert sync
        assert file_repos
        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        representation_jpg = KioskRepresentationType("jpgs480x640")
        representation_jpg.format_request = {"*": "JPEG"}
        representation_jpg.dimensions = KioskRepresentationTypeDimensions(480, 640)

        representation_png = KioskRepresentationType("jpgs100x100")
        representation_png.format_request = {"*": "PNG"}
        representation_png.dimensions = KioskRepresentationTypeDimensions(100, 100)

        # create some representations
        uid = "BFFE9764-8AA2-7342-887F-B107A940A69A"
        file = KioskContextualFile(uid,
                                   cache_manager, file_repos, sync.type_repository,
                                   plugin_loader=sync)
        path_and_filename = file.get(representation_jpg, create=True)
        assert os.path.isfile(path_and_filename)

        path_and_filename = file.get(representation_png, create=True)
        assert os.path.isfile(path_and_filename)

        assert KioskFileCacheModel().count(where="uid_file=%s and not invalid",
                                           params=[uid]) == 2
        # assert len([x for x in db_files_initialized.query(KioskFilesCacheModel).filter_by(uid_file=uid).all() if
        #             not x.invalid]) == 2

        uid = "25E2DF4A-C0B5-4444-8B46-50D538EE93A9"
        file = KioskContextualFile(uid,
                                   cache_manager, file_repos, sync.type_repository)

        # necessary because in the initializing SQL statements this image record has no filename
        file.detect_filename_from_filerepository()

        path_and_filename = file.get(representation_jpg, create=True)
        assert os.path.isfile(path_and_filename)

        path_and_filename = file.get(representation_png, create=True)
        assert os.path.isfile(path_and_filename)

        assert KioskFileCacheModel().count(where="uid_file=%s and not invalid",
                                           params=[uid]) == 2

        # change first file
        uid = "BFFE9764-8AA2-7342-887F-B107A940A69A"
        file = KioskContextualFile(uid,
                                   cache_manager, file_repos, sync.type_repository)
        new_file = os.path.join(shared_datadir, "new_files", "DSC_2489.png")
        assert file.upload(new_file, override=True, no_auto_representations=True)
        db_files_initialized.commit()

        # check that all cache entries have been invalidated
        assert KioskFileCacheModel().count(where="uid_file=%s and invalid",
                                           params=[uid]) == 2
        # assert len([x for x in db_files_initialized.query(KioskFileCacheModel).filter_by(uid_file=uid).all() if
        #             x.invalid]) == 2
        assert not file.get(representation_type=representation_jpg)
        assert not file.get(representation_type=representation_png)

        # check that other chache entries have not been changed

        uid = "25E2DF4A-C0B5-4444-8B46-50D538EE93A9"
        assert KioskFileCacheModel().count(where="uid_file=%s and not invalid",
                                           params=[uid]) == 2
        # assert len([x for x in db_files_initialized.query(KioskFileCacheModel).filter_by(uid_file=uid).all() if
        #             not x.invalid]) == 2

        file = KioskContextualFile(uid,
                                   cache_manager, file_repos, sync.type_repository)
        assert file.get(representation_type=representation_jpg)
        assert file.get(representation_type=representation_png)

    def test_update(self, db_files_initialized, shared_datadir, mock_kiosk_time_zones):
        KioskSQLDb.run_sql_script(os.path.join(self.sql_context_data))
        KioskSQLDb.commit()

        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)
        assert file
        assert not file._file_record

        file.description = "my description"
        assert file.uid == uid
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        dst_path_and_filename = file.upload(src_path_and_filename)
        assert dst_path_and_filename == os.path.join(shared_datadir, kioskstdlib.get_filename(src_path_and_filename)[:2],
                                                     kioskstdlib.get_filename(src_path_and_filename))
        assert os.path.exists(dst_path_and_filename)

        file = KioskContextualFile(uid, cache_manager, file_repos,
                                   sync.type_repository, test_mode=True, plugin_loader=sync)
        assert file._file_record
        assert file.description == "my description"
        assert file._file_record.img_proxy
        old_image_proxy = file._file_record.img_proxy
        assert file.modified
        old_modified = file.modified

        # ok, file uploaded without any contexts. Now let's test the update method
        file.archaeological_context = "CC-003-2"
        file.recording_context = "collected_material_photos"
        file.modified_by = "lkh"

        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        assert file.update()

        file = KioskContextualFile(uid, cache_manager, file_repos,
                                   sync.type_repository, test_mode=True, plugin_loader=sync)
        assert file._file_record
        assert file.description == "my description"
        assert file.modified_by == "lkh"
        assert file.modified
        assert file.modified != old_modified
        assert file._file_record.img_proxy
        assert file._file_record.img_proxy == old_image_proxy
        assert file._file_record.created

    def test_contexts(self, db_files_initialized, shared_datadir, mock_kiosk_time_zones):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)

        assert file
        assert not file._file_record

        file.description = "my description"
        assert file.uid == uid

        # testing contexts
        assert file.contexts.get_contexts() == []
        file.contexts.add_context("PLG", "site")
        assert file.contexts.get_contexts() == [("PLG", "site")]

        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        dst_path_and_filename = file.upload(src_path_and_filename)
        assert dst_path_and_filename == os.path.join(shared_datadir, kioskstdlib.get_filename(src_path_and_filename)[:2],
                                                     kioskstdlib.get_filename(src_path_and_filename))
        assert os.path.exists(dst_path_and_filename)

    def test__get_default_record_type_and_uuid(self, db_files_initialized, urapdb_with_records, shared_datadir):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)

        with pytest.raises(KeyError):
            assert file._get_file_location_and_uuid("PLG") == "site"

        assert file._get_file_location_and_uuid("FA") == ('dayplan', 'uid_image', 'unit',
                                                          'c109e19c-c73c-cc49-9f58-4ba0a3ad1339')
        assert file._get_file_location_and_uuid("FA-001") == ('locus_photo', 'uid_image', 'locus',
                                                              'c50df3cb-e68b-4ce7-b456-9ea3d636d933')
        assert file._get_file_location_and_uuid("FA-001-1") == ('collected_material_photo', 'uid_photo',
                                                                'collected_material',
                                                                '9495ce6f-da84-4e58-bf0b-f3b6775116f9')
        result = file._get_file_location_and_uuid("123456")
        p1, p2, p3, p4 = result
        assert p1 == 'collected_material_photo'
        assert p4 == '25531aa1-f7b2-4f67-9b08-ba3030889b5b'

        result = file._get_file_location_and_uuid("test_site")
        assert result[0] == 'site'

    def test__get_insert_context_sql(self, db_files_initialized, urapdb_with_records, shared_datadir,
                                     mock_kiosk_time_zones):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))

        sql, params = file._get_insert_context_sql("dayplan", "uid_image", "c109e19c-c73c-cc49-9f58-4ba0a3ad1339",
                                                   "unit")
        assert params[0] == 'c377be85-fa86-4772-ae30-3c0485ce1504'
        assert isinstance(params[1], datetime.datetime) # created
        assert isinstance(params[2], datetime.datetime) # modified
        assert isinstance(params[3], int) # modified_ww
        assert isinstance(params[4], datetime.datetime) # modified_ww
        assert params[5] == 'sys'
        assert params[6] == 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339'
        assert sql == 'insert into "dayplan" ("uid_image","created","modified","modified_tz","modified_ww",' \
                      '"modified_by","uid_unit") ' \
                      'values(%s,%s,%s,%s,%s,%s,%s)'

        file.modified_by = "lkh"
        sql, params = file._get_insert_context_sql("dayplan", "uid_image", "c109e19c-c73c-cc49-9f58-4ba0a3ad1339",
                                                   "unit")
        assert params[0] == 'c377be85-fa86-4772-ae30-3c0485ce1504'
        assert isinstance(params[1], datetime.datetime) # created
        assert isinstance(params[2], datetime.datetime) # modified
        assert isinstance(params[3], int) # modified_ww
        assert isinstance(params[4], datetime.datetime) # modified_ww
        assert params[5] == 'lkh'
        assert params[6] == 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339'
        assert sql == 'insert into "dayplan" ("uid_image","created","modified","modified_tz","modified_ww",' \
                      '"modified_by","uid_unit") ' \
                      'values(%s,%s,%s,%s,%s,%s,%s)'

    def test__push_context(self, db_files_initialized, urapdb_with_records, shared_datadir, mock_kiosk_time_zones):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        assert not KioskSQLDb.get_field_value("dayplan", "uid_image",
                                             "c377be85-fa86-4772-ae30-3c0485ce1504",
                                             "uid_unit") == "c109e19c-c73c-cc49-9f58-4ba0a3ad1339"

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)

        cur = KioskSQLDb.get_dict_cursor()
        try:
            file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
            assert file._push_context(("FA", ""), cur)
        finally:
            cur.close()

        assert KioskSQLDb.get_field_value("dayplan", "uid_image",
                                         "c377be85-fa86-4772-ae30-3c0485ce1504",
                                         "uid_unit") == "c109e19c-c73c-cc49-9f58-4ba0a3ad1339"

        cur = KioskSQLDb.get_dict_cursor()
        try:
            # not allowed because site is its own default file storage in the dsd and
            # it is not allowed to have a default file storage that itself has an identifier.
            assert not file._push_context(("test_site", ""), cur)
        finally:
            cur.close()
        # cur = KioskSQLDb.get_dict_cursor()
        # try:
        #     assert file._push_context(("test_site"), cur)
        # finally:
        #     cur.close()

    def test_push_contexts(self, db_files_initialized, urapdb_with_records, shared_datadir, mock_kiosk_time_zones):
        sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        assert sync and file_repos

        cache_manager = KioskFileCache(os.path.join(shared_datadir, "cache"),
                                       representation_repository=sync.type_repository)

        assert not KioskSQLDb.get_field_value("dayplan", "uid_image",
                                             "c377be85-fa86-4772-ae30-3c0485ce1504",
                                             "uid_unit") == "c109e19c-c73c-cc49-9f58-4ba0a3ad1339"

        # upload a new file without identifier first
        uid = "c377be85-fa86-4772-ae30-3c0485ce1504"
        src_path_and_filename = os.path.join(shared_datadir, "new_files", "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        file = KioskContextualFile(uid, cache_manager,
                                   file_repos, sync.type_repository, plugin_loader=sync, test_mode=True)

        file.contexts.add_context("FA")
        file.contexts.add_context("CC-001")
        file.set_modified(*KioskTimeZones.get_modified_components_from_now(27743346))
        assert file.push_contexts(False)

        assert KioskSQLDb.get_field_value("dayplan", "uid_image",
                                         "c377be85-fa86-4772-ae30-3c0485ce1504",
                                         "uid_unit") == "c109e19c-c73c-cc49-9f58-4ba0a3ad1339"

        assert KioskSQLDb.get_field_value("locus_photo", "uid_image",
                                         "c377be85-fa86-4772-ae30-3c0485ce1504",
                                         "uid_locus") == 'a1fc642f-568b-45e1-a368-d9c452c5df7f'

    @pytest.mark.skip
    def test_ensure_md5_hash(self, db_files_initialized, shared_datadir):
        # todo
        assert False

    @pytest.mark.skip
    def test_delete(self, db_files_initialized, shared_datadir):
        # todo
        assert False
