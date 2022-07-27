import os
from pprint import pprint

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from filehandlingsets import FileHandlingSet
from fileidentifiercache import FileIdentifierCache
from filepicking.kioskfilepicking import KioskFilePicking
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_dir = os.path.dirname(os.path.abspath(__file__))

this_test_dir = test_dir
config_file = os.path.join(this_test_dir, r"data\config\config_test.yml")
log_file = os.path.join(test_dir, "log", "test.log")


# @pytest.mark.skip
class TestRecordingWorkstation(KioskPyTestHelper):

    @pytest.fixture()
    def config(self, shared_datadir):
        cfg = self.get_config(config_file, log_file)
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def urapdb(self, config):
        return self.get_urapdb(config)

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test_create_load_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        assert not ws.exists()
        ws.recording_group = "default"
        ws.save()
        assert ws.exists()
        helper.assert_table("test_id_locus", schema="test_id")
        helper.assert_table("test_id_fm_image_transfer", schema="test_id")
        helper.assert_table("test_id_fm_repldata_transfer", schema="test_id")

        ws = FileMakerWorkstation("test_id")
        assert ws.exists()
        assert ws.description == "test_description"
        assert ws.get_id() == "test_id"
        assert ws.recording_group == "default"

        assert ws.delete(commit=True)

        ws = FileMakerWorkstation("test_id", "test_description", recording_group="local_computer")
        assert ws
        assert not ws.exists()
        assert ws.save()
        assert ws.exists()

        ws = FileMakerWorkstation("test_id")
        assert ws.exists()
        assert ws.description == "test_description"
        assert ws.get_id() == "test_id"
        assert ws.recording_group == "local_computer"
        assert ws.delete(commit=True)

    def test_create_delete_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        ws.save()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        helper.assert_table("test_id_locus", schema="test_id")
        helper.assert_table("test_id_fm_image_transfer", schema="test_id")

        assert ws.delete(True)
        ws = FileMakerWorkstation("test_id", "test_description")
        assert not ws.exists()

        helper.assert_table_missing("test_id_locus", schema="test_id")
        helper.assert_table_missing("test_id_fm_image_transfer", schema="test_id")

    def test_update_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        assert ws.recording_group == "default"
        assert ws.description == "test_description"

        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.recording_group == "default"
        assert ws.description == "test_description"

        ws.recording_group = "local_computer"
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.description == "test_description"
        assert ws.recording_group == "local_computer"

        ws.description = "new description"
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.description == "new description"
        assert ws.recording_group == "local_computer"

    @pytest.fixture()
    def prepare(self, config, urapdb, shared_datadir):
        # prepare data
        #
        self.set_file_repos_dir(config, shared_datadir)
        assert config.database_name == "urap_test"
        # KioskSQLDb.run_sql_script(os.path.join(test_dir,
        #                                       "create_database_sqls",
        #                                       "create_master_tables.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_unit_fa.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_fa_dayplans.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_images.sql"),
                                  substitute_variables=config._config["config"])
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "file_picking_rule_set_1.sql"))

        for f in [('32d4db7e-ef19-4465-90de-5714c413638e', "32d4db7e-ef19-4465-90de-5714c413638e.JPG"),
                  ('21e9156c-c6a2-4229-9d9e-bd712323c4f1', "21e9156c-c6a2-4229-9d9e-bd712323c4f1.NEF"),
                  ('c5107d70-a9c2-4bde-945a-f41c2f11dfd6', "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.SVG")]:
            r = KioskSQLDb.get_first_record_from_sql(f"select filename from images "
                                                    f"where uid = '{f[0]}'")
            assert r["filename"].lower() == os.path.join(shared_datadir, "file_repository", f[1]).lower()

    def test__compute_file_handling_results(self, config, urapdb, prepare, shared_datadir):
        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts()
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")

        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"
        f = file_repos.get_contextual_file(uid_file)
        assert f
        src_file = os.path.join(shared_datadir, "file_repository", f'{uid_file}.jpg')
        result = ws._compute_file_handling_results(f,
                                                   fh_set,
                                                   file_picking,
                                                   src_file,
                                                   uid_file)
        assert result["location"] == "internal"
        assert result["representation"]
        assert not result["disable"]
        assert result["resolution"] == "low"

        # src_file dummy should result in defaults
        src_file = "dummy"
        result = ws._compute_file_handling_results(f,
                                                   fh_set,
                                                   file_picking,
                                                   src_file,
                                                   uid_file)
        assert result["location"] == "internal"
        assert not result["representation"]
        assert result["disable"]
        assert result["resolution"] == "dummy"

        # unsupported file type should result in defaults
        uid_file = 'c5107d70-a9c2-4bde-945a-f41c2f11dfd6'
        src_file = os.path.join(shared_datadir, "file_repository", f'{uid_file}.svg')
        f = file_repos.get_contextual_file(uid_file)
        # remove svg from list of supported extensions
        fh_set.header["supported_extensions"] = "nef, tiff, tif, jpg, jpeg, gif, png, bmp, raw, pcx, cr2"

        result = ws._compute_file_handling_results(f,
                                                   fh_set,
                                                   file_picking,
                                                   src_file,
                                                   uid_file)
        assert result["location"] == "internal"
        assert not result["representation"]
        assert result["disable"]
        assert result["resolution"] == "dummy"

        # add svg to list of supported extensions
        fh_set.header["supported_extensions"] = "nef, tiff, tif, jpg, jpeg, gif, png, bmp, raw, pcx, cr2, svg"

        result = ws._compute_file_handling_results(f,
                                                   fh_set,
                                                   file_picking,
                                                   src_file,
                                                   uid_file)
        assert result["location"] == "internal"
        assert not result["representation"]
        assert not result["disable"]
        assert result["resolution"] == "low"

    def test__prepare_file_for_export_v2(self, config, urapdb, prepare, shared_datadir, monkeypatch):
        last_call = {}

        def mock_register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disable, file_type):
            nonlocal last_call
            last_call["file_id"] = file_id
            last_call["dst_file"] = dst_file
            last_call["location"] = location
            last_call["resolution"] = resolution
            last_call["disable"] = disable
            last_call["file_type"] = file_type
            return True

        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts()
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")

        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"

        monkeypatch.setattr(FileMakerWorkstation, "_register_fm_image_transfer_file",
                            mock_register_fm_image_transfer_file)
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"] == os.path.join(shared_datadir, "file_repository",
                                                     "cache", "1024x768", "32d4db7e-ef19-4465-90de-5714c413638e.jpg")

        # the svg should be the original file
        uid_file = 'c5107d70-a9c2-4bde-945a-f41c2f11dfd6'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.svg").lower()

    def test__prepare_file_for_export_v2_broken(self, config, urapdb, prepare, shared_datadir, monkeypatch):
        last_call = {}

        def mock_register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disable, file_type):
            nonlocal last_call
            last_call["file_id"] = file_id
            last_call["dst_file"] = dst_file
            last_call["location"] = location
            last_call["resolution"] = resolution
            last_call["disable"] = disable
            last_call["file_type"] = file_type
            return True

        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts()
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")

        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"
        f = file_repos.get_contextual_file(uid_file)
        assert f
        os.remove(f.get())

        monkeypatch.setattr(FileMakerWorkstation, "_register_fm_image_transfer_file",
                            mock_register_fm_image_transfer_file)
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"] == "dummy"
        assert last_call["file_type"] == "broken"

    def test__prepare_file_for_export_v2_max_size(self, config, urapdb, prepare, shared_datadir, monkeypatch):
        last_call = {}

        def mock_register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disable, file_type):
            nonlocal last_call
            last_call["file_id"] = file_id
            last_call["dst_file"] = dst_file
            last_call["location"] = location
            last_call["resolution"] = resolution
            last_call["disable"] = disable
            last_call["file_type"] = file_type
            return True

        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("low_max_size", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts()
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")

        # The jpeg's size is close but lower than 3500 kbytes -
        # the max file size for the file handling set "low_max_size"
        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"

        monkeypatch.setattr(FileMakerWorkstation, "_register_fm_image_transfer_file",
                            mock_register_fm_image_transfer_file)
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "32d4db7e-ef19-4465-90de-5714c413638e.jpg").lower()

        # The NEF is bigger
        uid_file = "21e9156c-c6a2-4229-9d9e-bd712323c4f1"
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"] == "dummy"

        # The SVG is smaller
        uid_file = 'c5107d70-a9c2-4bde-945a-f41c2f11dfd6'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.svg").lower()

    #test
    def test__prepare_file_for_export_v2_contextuals(self, config, urapdb, prepare_contextuals, shared_datadir,
                                                     monkeypatch):
        last_call = {}

        def mock_register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disable, file_type):
            nonlocal last_call
            last_call["file_id"] = file_id
            last_call["dst_file"] = dst_file
            last_call["location"] = location
            last_call["resolution"] = resolution
            last_call["disable"] = disable
            last_call["file_type"] = file_type
            return True

        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts(commit=True)
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")

        # the jpg is context-bound so it should be the original file
        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"

        monkeypatch.setattr(FileMakerWorkstation, "_register_fm_image_transfer_file",
                            mock_register_fm_image_transfer_file)
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "high"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "32d4db7e-ef19-4465-90de-5714c413638e.jpg").lower()

        # the svg should be the original file
        uid_file = 'c5107d70-a9c2-4bde-945a-f41c2f11dfd6'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "high"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.svg").lower()

        # this jpg is not context-bound - a candid - so it should be a dummy
        uid_file = '2dd0dec8-5da6-4eae-a72d-cc4223eec037'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"].lower() == "dummy"

        # this jpg is bound to locus CC-001 - so it should be of "low resolution"
        uid_file = '6ab28932-d8be-4bd8-8b08-b318827dea61'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "6ab28932-d8be-4bd8-8b08-b318827dea61.jpg").lower()

        # this jpg is a relation sketch for CC-001 / CC-002 -
        # record types "locus relation sketch" are suppressed, but
        # at this point the translation method is not hooked up.
        # So this will be included first.

        uid_file = 'ef46cbd6-952b-43d1-afd4-796fb645916f'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "ef46cbd6-952b-43d1-afd4-796fb645916f.png").lower()

        # file picking needs to be reinitialzed
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")
        file_picking.on_translate_record_type_alias = ws._translate_record_types

        uid_file = 'ef46cbd6-952b-43d1-afd4-796fb645916f'
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"].lower() == "dummy"

    @pytest.fixture()
    def prepare_contextuals(self, config, urapdb, shared_datadir):
        # prepare data
        #
        self.set_file_repos_dir(config, shared_datadir)
        assert config.database_name == "urap_test"
        # KioskSQLDb.run_sql_script(os.path.join(test_dir,
        #                                       "create_database_sqls",
        #                                       "create_master_tables.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_records_contextuals_test.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_images_contextuals_test.sql"),
                                  substitute_variables=config._config["config"])
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "file_picking_rule_set_2.sql"))

        for f in [('32d4db7e-ef19-4465-90de-5714c413638e', "32d4db7e-ef19-4465-90de-5714c413638e.JPG"),
                  ('21e9156c-c6a2-4229-9d9e-bd712323c4f1', "21e9156c-c6a2-4229-9d9e-bd712323c4f1.NEF"),
                  ('c5107d70-a9c2-4bde-945a-f41c2f11dfd6', "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.SVG"),

                  ("6ab28932-d8be-4bd8-8b08-b318827dea61", "6ab28932-d8be-4bd8-8b08-b318827dea61.JPG"),
                  ("94a85e29-05f1-4573-9c7a-e13beb222698", "94a85e29-05f1-4573-9c7a-e13beb222698.JPG"),
                  ("2dd0dec8-5da6-4eae-a72d-cc4223eec037", "2dd0dec8-5da6-4eae-a72d-cc4223eec037.JPG"),
                  ("ef46cbd6-952b-43d1-afd4-796fb645916f", "ef46cbd6-952b-43d1-afd4-796fb645916f.PNG")]:
            r = KioskSQLDb.get_first_record_from_sql(f"select filename from images "
                                                    f"where uid = '{f[0]}'")
            assert r["filename"].lower() == os.path.join(shared_datadir, "file_repository", f[1]).lower()

    def test__prepare_file_for_export_v2_tags(self, config, urapdb, prepare_contextuals, shared_datadir,
                                              monkeypatch):
        last_call = {}

        def mock_register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disable, file_type):
            nonlocal last_call
            last_call["file_id"] = file_id
            last_call["dst_file"] = dst_file
            last_call["location"] = location
            last_call["resolution"] = resolution
            last_call["disable"] = disable
            last_call["file_type"] = file_type
            return True

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "file_picking_rule_set_tags.sql"))

        config.file_handling_definition = os.path.join(test_dir,
                                                       "data",
                                                       "config",
                                                       "file_handling_1.yml")
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()
        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts(commit=True)
        file_picking = KioskFilePicking("filemakerworkstation", fid, dsd, recording_group="default")
        file_picking.on_translate_record_type_alias = ws._translate_record_types

        # the file repository processes tags
        file_picking.on_get_files_with_tags = file_repos.get_files_with_tags

        monkeypatch.setattr(FileMakerWorkstation, "_register_fm_image_transfer_file",
                            mock_register_fm_image_transfer_file)

        # this gives one of the two candid images the tag "site-map"
        f = file_repos.get_contextual_file('94a85e29-05f1-4573-9c7a-e13beb222698')
        f.set_tags(["site-map"])
        f.update()

        # this jpg is not context-bound either BUT got the tag "site-maps" - so it should be included with res high
        uid_file = '94a85e29-05f1-4573-9c7a-e13beb222698'
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "high"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "94a85e29-05f1-4573-9c7a-e13beb222698.jpg").lower()
        # the jpg is context-bound so it should be the original file
        uid_file = "32d4db7e-ef19-4465-90de-5714c413638e"

        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "high"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "32d4db7e-ef19-4465-90de-5714c413638e.jpg").lower()

        # the svg should be the original file
        uid_file = 'c5107d70-a9c2-4bde-945a-f41c2f11dfd6'
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "high"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.svg").lower()

        # this jpg is not context-bound - a candid - so it should be a dummy
        uid_file = '2dd0dec8-5da6-4eae-a72d-cc4223eec037'
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"].lower() == "dummy"

        # this jpg is bound to locus CC-001 - so it should be of "low resolution"
        uid_file = '6ab28932-d8be-4bd8-8b08-b318827dea61'
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert not last_call["disable"]
        assert last_call["resolution"] == "low"
        assert last_call["dst_file"].lower() == os.path.join(shared_datadir, "file_repository",
                                                             "6ab28932-d8be-4bd8-8b08-b318827dea61.jpg").lower()

        # this jpg is a relation sketch for CC-001 / CC-002 - locus_relation record types are suppressed,
        # so it should be a dummy
        uid_file = 'ef46cbd6-952b-43d1-afd4-796fb645916f'
        last_call = {}
        assert ws._prepare_file_for_export_v2(file_repos, uid_file,
                                              fh_set,
                                              file_picking)
        assert last_call["location"] == "internal"
        assert last_call["disable"]
        assert last_call["resolution"] == "dummy"
        assert last_call["dst_file"].lower() == "dummy"
        KioskSQLDb.commit()

    def test__remove_contextless_dummy_images(self, config, urapdb, prepare_contextuals):
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    sync.events,
                                    sync.type_repository,
                                    sync)
        ws = FileMakerWorkstation("test_id", "test", recoding_group="default")
        ws.save()
        assert ws.exists()

        fh_set = FileHandlingSet("default", config)
        fid = FileIdentifierCache(dsd)
        fid.build_file_identifier_cache_from_contexts(commit=True)
        KioskSQLDb.execute("insert " + "into test_id.test_id_images select * from public.images")
        KioskSQLDb.execute("insert " + "into test_id.test_id_dayplan select * from public.dayplan")
        KioskSQLDb.execute("insert " + "into test_id.test_id_locus_photo select * from public.locus_photo")
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "test_1_image_transfers.sql"))
        # the Candids are 2dd0dec8-5da6-4eae-a72d-cc4223eec037 and 94a85e29-05f1-4573-9c7a-e13beb222698
        self.assert_record_exists("test_id_images", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid", "test_id")
        self.assert_record_exists("test_id_images", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid", "test_id")
        self.assert_record_exists("test_id_fm_image_transfer", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid_file",
                                  "test_id")
        self.assert_record_exists("test_id_fm_image_transfer", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid_file",
                                  "test_id")
        assert KioskSQLDb.get_record_count(table="test_id_fm_image_transfer",
                                           key_field="uid_file", where='resolution=%s',
                                           params=['dummy'], namespace="test_id") == 7
        assert ws._remove_contextless_dummy_images(KioskSQLDb.get_dict_cursor(), dsd)
        self.assert_record_missing("test_id_images", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid", "test_id")
        self.assert_record_missing("test_id_images", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid", "test_id")
        self.assert_record_missing("test_id_fm_image_transfer", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid_file",
                                   "test_id")
        self.assert_record_missing("test_id_fm_image_transfer", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid_file",
                                   "test_id")
        self.assert_record_exists("test_id_images", "ef46cbd6-952b-43d1-afd4-796fb645916f", "uid", "test_id")
        # rows = KioskSQLDb.get_records("select " + "* from test_id.test_id_fm_image_transfer")
        # pprint(rows)
        assert KioskSQLDb.get_record_count(table="test_id_fm_image_transfer",
                                           key_field="uid_file", namespace="test_id") == 5
        assert KioskSQLDb.get_record_count(table="test_id_images",
                                           key_field="uid", namespace="test_id") == 5

        # this time candid 2dd0dec8-5da6-4eae-a72d-cc4223eec037 gets a file and a resolution
        KioskSQLDb.execute("truncate " + "table test_id.test_id_images;")
        KioskSQLDb.execute("insert into " + "test_id.test_id_images select * from public.images")
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "test_1_image_transfers.sql"))
        KioskSQLDb.execute("update " + "test_id.test_id_fm_image_transfer "
                                      "set filepath_and_name='2dd0dec8-5da6-4eae-a72d-cc4223eec037.jpg',"
                                      "resolution='low' where uid_file = '2dd0dec8-5da6-4eae-a72d-cc4223eec037'")

        assert ws._remove_contextless_dummy_images(KioskSQLDb.get_dict_cursor(), dsd)
        self.assert_record_exists("test_id_images", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid", "test_id")
        self.assert_record_exists("test_id_fm_image_transfer", "2dd0dec8-5da6-4eae-a72d-cc4223eec037", "uid_file",
                                  "test_id")

        self.assert_record_missing("test_id_images", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid", "test_id")
        self.assert_record_missing("test_id_fm_image_transfer", "94a85e29-05f1-4573-9c7a-e13beb222698", "uid_file",
                                   "test_id")
        self.assert_record_exists("test_id_images", "ef46cbd6-952b-43d1-afd4-796fb645916f", "uid", "test_id")
        assert KioskSQLDb.get_record_count(table="test_id_fm_image_transfer",
                                           key_field="uid_file", namespace="test_id") == 6
        assert KioskSQLDb.get_record_count(table="test_id_images",
                                           key_field="uid", namespace="test_id") == 6
