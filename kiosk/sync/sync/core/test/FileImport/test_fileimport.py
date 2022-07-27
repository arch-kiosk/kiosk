import datetime
import os
import unittest.mock as mock
from unittest.mock import call

import pytest

import sync_plugins.fileimportstandardfilters.fileimportstandardfilters as stdfilters
import synchronization
from fileimport import FileImport
from filerepository import FileRepository
# import console
from generalstore import generalstorekeys
from kioskcontextualfile import KioskContextualFile
from sync_config import SyncConfig
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from test.testhelpers import KioskPyTestHelper
from userconfig import UserConfig

import zoneinfo

init_done = False
cfg = None

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


#  @pytest.mark.skip
class TestFileImport(KioskPyTestHelper):
    sync = None
    file_repository = None
    cfg = None

    @pytest.fixture(scope="module")
    def cfg(self):
        config = self.get_config(config_file, log_file=log_file)
        return config

    @pytest.fixture()
    def urapdb(self, cfg, shared_datadir):
        return self.get_urapdb(cfg)

    @pytest.fixture(autouse=True)  # scope session gives this fixture priority over module scope
    def init_test(self, shared_datadir, cfg):
        global init_done
        if not init_done:
            # cfg = self.init_app()
            cfg.config["file_repository"] = str(shared_datadir)
            cfg._file_repository = str(shared_datadir)
            cur = self.get_urapdb(cfg)
            assert cur
            cur.close()
            init_done = True

        self.sync: synchronization.Synchronization = synchronization.Synchronization()
        self.file_repository = FileRepository(cfg,
                                              self.sync.events,
                                              self.sync.type_repository,
                                              self.sync)
        assert self.sync

    @pytest.fixture
    def file_import_setup(self, cfg):
        file_import = FileImport(cfg, self.sync)
        file_import.file_repository = self.file_repository
        return file_import

    @pytest.fixture
    def std_configure_filters(self, file_import_setup):
        file_import = file_import_setup

        assert file_import
        file_import._import_filters_sorted = file_import.sort_import_filters()
        file_import.recursive = False

        std_filter = file_import.get_file_import_filter("FileImportStandardValuesFilter")
        assert std_filter
        std_filter.deactivate()

        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        std_filter.activate()
        std_filter.set_filter_configuration_values({"get_identifier_from_filename": True})
        std_filter.set_filter_configuration_values({"get_date_from_file": True})
        assert std_filter

        std_filter = file_import.get_file_import_filter("FileImportStandardFolderFilter")
        std_filter.activate()
        std_filter.set_filter_configuration_values({"get_date_from_folder": True})
        std_filter.set_filter_configuration_values({"get_identifier_from_folder": True})
        assert std_filter

        return file_import

    def test_instantiation(self, file_import_setup):
        file_import = file_import_setup
        file_import.pathname = os.path.join(test_path, "Photography", "8 I 2018")
        file_import.recursive = True
        assert file_import
        assert "FileImportStandardValuesFilter" in file_import.get_file_import_filter_class_names()
        assert "FileImportStandardFolderFilter" in file_import.get_file_import_filter_class_names()
        assert "FileImportStandardFileFilter" in file_import.get_file_import_filter_class_names()

    def test_import(self, file_import_setup):
        file_import = file_import_setup
        assert file_import
        file_import.pathname = os.path.join(test_path, "test_files", "three_files")

        file_import.recursive = True
        file_import._config["file_extensions"] = ["jpg"]
        file_import.execute()
        assert file_import.files_processed == 3

    def test_activate_deactivate_filter(self):
        std_values_filter = stdfilters.FileImportStandardValuesFilter(SyncConfig.get_config())
        std_values_filter.set_filter_configuration({})
        assert not std_values_filter.is_active()

        std_values_filter.activate()
        assert std_values_filter.is_active()

        std_values_filter.deactivate()
        assert not std_values_filter.is_active()

        filename = os.path.join(test_path, "test_files", "three_files", "one.jpg")

        std_values_filter.activate()
        std_values_filter.set_path_and_filename(filename)
        std_values_filter.get_file_information({})

        assert not std_values_filter.is_active()

        std_values_filter.set_standard_values({"identifier": "EC"})
        std_values_filter.activate()
        rc = std_values_filter.get_file_information({})
        assert std_values_filter.is_active()
        assert rc["identifier"] == "EC"

        std_values_filter.set_standard_values({})
        rc = std_values_filter.get_file_information({})
        assert not rc
        assert not std_values_filter.is_active()

    def test_std_values_filter(self):
        filename = os.path.join(test_path, "test_files", "three_files", "one.jpg")

        std_values_filter = stdfilters.FileImportStandardValuesFilter(SyncConfig.get_config())
        std_values_filter.activate()
        std_values_filter.set_path_and_filename(filename)

        std_values_filter.set_standard_values({"identifier": "EC"})
        rc = std_values_filter.get_file_information({})
        assert "identifier" in rc
        assert rc["identifier"] == "EC"

        std_values_filter.set_standard_values({"identifier": "EC", "date": "12.04.2018"})
        rc = std_values_filter.get_file_information({})
        assert "identifier" in rc
        assert rc["identifier"] == "EC"
        assert "date" in rc
        assert rc["date"] == "12.04.2018"

    def test_std_folder_filter_deactivation(self):
        """
              get_date_from_folder: True,
              get_identifier_from_folder: True,
        """
        std_folder_filter = stdfilters.FileImportStandardFolderFilter(SyncConfig.get_config())
        std_folder_filter.activate()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        std_folder_filter.set_path_and_filename(os.path.join(test_path, "import", "EC", "testfile.jpg"))
        rc = std_folder_filter.get_file_information({})
        assert not std_folder_filter.is_active()

        std_folder_filter.activate()
        std_folder_filter.set_filter_configuration_values({"get_date_from_folder": True,
                                                           "get_identifier_from_folder": False})
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()

        std_folder_filter.set_filter_configuration_values({"get_date_from_folder": False,
                                                           "get_identifier_from_folder": False})
        rc = std_folder_filter.get_file_information({})
        assert not std_folder_filter.is_active()

        std_folder_filter.activate()
        std_folder_filter.set_filter_configuration_values({"get_date_from_folder": False,
                                                           "get_identifier_from_folder": True})
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()

    def test_std_folder_filter_identifier(self):
        """
              get_date_from_folder: False,
              get_identifier_from_folder: True,
        """
        std_folder_filter = stdfilters.FileImportStandardFolderFilter(SyncConfig.get_config())
        std_folder_filter.activate()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        std_folder_filter.set_filter_configuration_values({"get_date_from_folder": False,
                                                           "get_identifier_from_folder": True})
        std_folder_filter.set_path_and_filename(os.path.join(test_path, "import", "EC", "testfile.jpg"))

        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "identifier" in rc
        assert rc["identifier"] == "EC"

        std_folder_filter.set_path_and_filename(os.path.join(test_path, "import", "FC", "12.II.18", "EC-001.jpg"))

        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "identifier" in rc
        assert rc["identifier"] == "FC"

        std_folder_filter.set_path_and_filename(os.path.join(test_path, "import", "FC-001", "12.II.18", "EC-001.jpg"))

        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "identifier" in rc
        assert rc["identifier"] == "FC-001"

        std_folder_filter.set_path_and_filename(os.path.join(test_path, "import", "FC-001-1", "12.II.18", "EC-001.jpg"))

        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "identifier" in rc
        assert rc["identifier"] == "FC-001-1"

        std_folder_filter.set_path_and_filename(os.path.join("/", "import", "FC$0011", "12.II.18", "EC-001.jpg"))

        std_folder_filter.register_identifier_evaluator(lambda x: True if x != "import" else False)
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "identifier" not in rc

    def test_std_folder_filter_date_context(self):
        """
              get_date_from_folder: False,
              get_identifier_from_folder: True,
        """
        std_folder_filter = stdfilters.FileImportStandardFolderFilter(SyncConfig.get_config())
        std_folder_filter.activate()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        std_folder_filter.set_filter_configuration_values({"get_date_from_folder": True,
                                                           "get_identifier_from_folder": False})

        std_folder_filter.set_path_and_filename(os.path.join("/", "import", "01.10.2018", "testfile.jpg"))
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "day" in rc and "month" in rc and "year" in rc
        assert rc["day"] == 1 and rc["month"] == 10 and rc["year"] == 2018

        std_folder_filter.set_path_and_filename(os.path.join("/", "import", "2016", "31.XII.", "testfile.jpg"))
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "day" in rc and "month" in rc and "year" in rc
        assert rc["day"] == 31 and rc["month"] == 12 and rc["year"] == 2016

        std_folder_filter.set_path_and_filename(os.path.join("/", "import", "05-XII-2015", "testfile.jpg"))
        rc = std_folder_filter.get_file_information({})
        assert std_folder_filter.is_active()
        assert "day" in rc and "month" in rc and "year" in rc
        assert rc["day"] == 5 and rc["month"] == 12 and rc["year"] == 2015

    def test_std_file_filter_identifier(self):
        """
              get_date_from_folder: False,
              get_identifier_from_folder: True,
        """
        std_file_filter = stdfilters.FileImportStandardFileFilter(SyncConfig.get_config())
        std_file_filter.activate()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        std_file_filter.set_filter_configuration_values({"get_date_from_file": False,
                                                         "get_identifier_from_filename": True})
        std_file_filter.set_path_and_filename(
            os.path.join(test_path, "test_files", "test_files", "EC-002 b in desparate need of optimization"))

        rc = std_file_filter.get_file_information({})
        assert std_file_filter.is_active()
        assert "identifier" in rc
        assert rc["identifier"] == "EC-002"

    def test_std_file_filter_date(self):
        """
              get_date_from_file: True,
              get_identifier_from_filename: False,
        """
        std_file_filter = stdfilters.FileImportStandardFileFilter(SyncConfig.get_config())
        std_file_filter.activate()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        std_file_filter.set_filter_configuration_values({"get_date_from_file": True,
                                                         "get_identifier_from_filename": False})
        std_file_filter.set_path_and_filename(os.path.join(test_path, "test_files", "test_files",
                                                           "EC-002 b in desparate need of optimization.jpg"))

        rc = std_file_filter.get_file_information({})
        assert std_file_filter.is_active()
        assert "day" in rc and "month" in rc and "year" in rc
        assert rc["day"] == 4 and rc["month"] == 7 and rc["year"] == 2019

    def test_build_context_1(self, file_import_setup):
        file_import = file_import_setup
        assert file_import
        file_import._import_filters_sorted = file_import.sort_import_filters()
        std_filter = file_import.get_file_import_filter("FileImportStandardValuesFilter")
        assert std_filter
        std_filter.set_standard_values({"identifier": "EB"})
        std_filter.activate()
        context = file_import.build_context(
            os.path.join(test_path, "test_files", "test_files", "EC-002 b in desparate need of optimization.jpg"))
        assert context
        assert context["import"]
        assert context["identifier"] == "EB"

        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        assert std_filter
        std_filter.activate()
        std_filter.set_filter_configuration_values({"get_identifier_from_filename": True})

        context = file_import.build_context(
            os.path.join(test_path, "test_files", "test_files", "EC-002 b in desparate need of optimization.jpg"))
        assert context
        assert context["import"]
        assert context["identifier"] == "EC-002"

    def test_build_context_from_folders(self, file_import_setup):
        def no_file_one(x: str):
            return x != "file_one"

        file_import = file_import_setup
        assert file_import
        file_import._import_filters_sorted = file_import.sort_import_filters()
        file_import.recursive = True

        std_filter = file_import.get_file_import_filter("FileImportStandardValuesFilter")
        assert std_filter
        std_filter.set_standard_values({"identifier": ""})
        std_filter.deactivate()

        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        std_filter.activate()
        std_filter.set_filter_configuration_values({"get_identifier_from_filename": True})
        std_filter.set_filter_configuration_values({"get_date_from_file": True})
        std_filter.register_identifier_evaluator(no_file_one)
        assert std_filter

        std_filter = file_import.get_file_import_filter("FileImportStandardFolderFilter")
        std_filter.activate()
        std_filter.set_filter_configuration_values({"get_date_from_folder": True})
        std_filter.set_filter_configuration_values({"get_identifier_from_folder": True})
        assert std_filter

        context = file_import.build_context(
            os.path.join(test_path, "test_files", "build_context", "EC", "file_one.jpg"))
        assert context and context["import"] == True
        assert context["identifier"] == "EC" and \
               context["day"] and context["month"] and context["year"]

        context = file_import.build_context(
            os.path.join(test_path, "test_files", "build_context", "EC", "file_one.jpg"))
        assert context and context["import"] == True
        assert context["identifier"] == "EC" and \
               context["day"] and context["month"] and context["year"]

        # no date from file, so the year should come from the folder
        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        std_filter.set_filter_configuration_values({"get_date_from_file": False})
        std_filter.register_identifier_evaluator(lambda x: x != "file_two")
        context = file_import.build_context(
            os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001", "file_two.jpg"))
        assert context and context["import"] == True
        assert context["identifier"] == "EC-001" and \
               "day" not in context and "month" not in context and \
               "year" in context
        assert context["year"] == 2018

        # Folder and File contexts match, File is a collected material
        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        std_filter.set_filter_configuration_values({"get_date_from_file": False})
        context = file_import.build_context(
            os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001", "EC-001-1.jpg"))
        assert context and context["import"] == True
        assert context["identifier"] == "EC-001-1"

    @mock.patch.object(FileImport, "_add_file_to_repository")
    def test_import_single_file_to_repository(self, mock_add_file_to_repository, std_configure_filters):
        mock_add_file_to_repository.return_value = True

        file_import = std_configure_filters
        file_import.modified_by = "lkh"

        # Folder and File contexts match, File is a collected material

        assert file_import._import_single_file_to_repository(
            os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001", "EC-001-1.jpg"))

        test_values = {
            "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001",
                                              "EC-001-1.jpg"),
            "description": "",
            "identifier": "EC-001-1",
            "modified_by": "lkh",
            "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                         tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None),
            "tags": []
        }
        mock_add_file_to_repository.assert_called_once_with(**test_values)

    @mock.patch.object(FileImport, "_add_file_to_repository")
    def test_import_multiple_files_to_repository(self, mock_add_file_to_repository, std_configure_filters):
        mock_add_file_to_repository.return_value = True

        file_import = std_configure_filters

        # Folder and File contexts match, File is a collected material

        file_import.pathname = os.path.join(test_path, "test_files", "build_context", "EC", "2018")

        file_import.recursive = True
        file_import._config["file_extensions"] = ["jpg"]
        file_import.tags = ["-"]

        assert file_import.execute(identifier_evaluator=lambda x: x not in ["file_one", "test", "GG-001-2"])

        test_basis = {
            "description": "",
            "modified_by": "sys",
            "tags": ["-"]
        }

        test_values = [
            {
                "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EB-002",
                                                  "EC-001-1.jpg"),
                "identifier": "EC-001-1",
                "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                             tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EB-002",
                                                  "file_one.jpg"),
                "identifier": "EB-002",
                "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                             tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001",
                                                  "EC-001-1.jpg"),
                "identifier": "EC-001-1",
                "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                             tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001",
                                                  "GG-001-2.jpg"),
                "identifier": "EC-001",
                "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                             tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "build_context", "EC", "2018", "EC-001",
                                                  "test.jpg"),
                "identifier": "EC-001",
                "ts_file": datetime.datetime(2019, 7, 4, 14, 39, 2,
                                             tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            }
        ]
        call_list = []
        for val in test_values:
            test_file = {**test_basis.copy(), **val}
            call_list.append(call(**test_file))

        mock_add_file_to_repository.assert_has_calls(call_list)

    @mock.patch.object(FileRepository, "add_contextual_file")
    def test_import_multiple_files_to_repository_contextual_file(self, mock_add_contextual_file, std_configure_filters,
                                                                 urapdb,
                                                                 monkeypatch):
        def mock__fetch_contexts(sql_instruction, prefix="", namespace=""):
            print("mock__fetch_contexts")
            return []

        monkeypatch.setattr(KioskContextualFile, "_fetch_contexts", mock__fetch_contexts)

        mock_add_contextual_file.return_value = True

        file_import = std_configure_filters

        # Folder and File contexts match, File is a collected material

        file_import.pathname = os.path.join(test_path, "test_files", "build_context", "EC", "2018")

        file_import.recursive = True
        file_import._config["file_extensions"] = ["jpg"]
        file_import.tags = ["-"]
        assert file_import.execute()
        assert mock_add_contextual_file.call_count == 5

    def test_import_user_config(self, file_import_setup, cfg):
        rgs = RedisGeneralStore(cfg)
        assert rgs._check_redis()
        keys = rgs.get_keys(generalstorekeys.gs_key_user_config + "#file_import_test#")
        if keys:
            rgs.delete_keys(keys)
        keys = rgs.get_keys(generalstorekeys.gs_key_user_config + "#file_import_test#")
        assert not keys
        cfg.file_import["file_extensions"] = ["*"]
        user_config = UserConfig(rgs, "file_import_test")
        assert user_config
        file_import = FileImport(cfg, self.sync, user_config=user_config)
        file_import._config["file_extensions"] = ["*"]
        check_user_config = UserConfig(rgs, "file_import_test")
        ucfg = check_user_config.get_config("file_import")
        assert ucfg
        assert ucfg["file_extensions"] == ["*"]
        ucfg["file_extensions"] = ["jpg"]
        assert user_config.init_topic("file_import", ucfg, force_init=True)

        new_user_config = UserConfig(rgs, "file_import_test")
        assert new_user_config
        keys = rgs.get_keys(generalstorekeys.gs_key_user_config + "#file_import_test#")
        assert keys
        assert keys[0] == "kiosk_user_config#file_import_test#file_import"
        file_import = FileImport(cfg, self.sync, user_config=new_user_config)
        assert file_import.file_extensions == ["jpg"]

        file_import.file_repository = self.file_repository
        file_import.pathname = os.path.join(test_path, "test_files", "three_files")

        file_import.recursive = True
        file_import.execute()
        assert file_import.files_processed == 3
