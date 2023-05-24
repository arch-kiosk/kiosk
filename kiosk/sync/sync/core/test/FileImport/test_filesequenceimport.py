import datetime
import os
import unittest.mock as mock
from unittest.mock import call

import pytest

import kioskstdlib
import sync_plugins.fileimportstandardfilters.fileimportstandardfilters as stdfilters
import synchronization
from filesequenceimport import FileSequenceImport
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

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


#  @pytest.mark.skip
class TestFileSequenceImport(KioskPyTestHelper):
    sync = None
    file_repository = None

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
        file_import = FileSequenceImport(cfg, self.sync)
        file_import.file_repository = self.file_repository
        return file_import

    def test_init(self, cfg):
        with pytest.raises(Exception, match='method'):
            file_import = FileSequenceImport(cfg, self.sync, method="upload")

        assert FileSequenceImport(cfg, self.sync)

    @pytest.fixture
    def file_import_setup(self, cfg):
        file_import = FileSequenceImport(cfg, self.sync)
        file_import.file_repository = self.file_repository
        return file_import

    def test_instantiation(self, file_import_setup):
        file_import = file_import_setup
        assert file_import
        assert "FileImportStandardValuesFilter" not in file_import.get_file_import_filter_class_names()
        assert "FileImportStandardFolderFilter" not in file_import.get_file_import_filter_class_names()
        assert "FileImportStandardFileFilter" in file_import.get_file_import_filter_class_names()
        assert "FileImportQRCodeFilter" in file_import.get_file_import_filter_class_names()
        assert "FileImportExifFilter" in file_import.get_file_import_filter_class_names()

    def test_filters(self, file_import_setup):
        file_import = file_import_setup

        assert file_import
        file_import._import_filters_sorted = file_import.sort_import_filters()
        file_import.recursive = False

        std_filter = file_import.get_file_import_filter("FileImportStandardFileFilter")
        assert std_filter
        assert std_filter.get_filter_configuration()["get_identifier_from_filename"]
        assert std_filter.get_filter_configuration()["get_date_from_file"]

        std_filter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        assert std_filter
        assert std_filter.get_filter_configuration()["get_identifier"]
        assert std_filter.get_filter_configuration()["get_date"]

        std_filter = file_import.get_file_import_filter("FileImportExifFilter")
        assert std_filter
        assert not std_filter.get_filter_configuration()["get_context_from_exif"]
        assert not std_filter.get_filter_configuration()["get_description_from_exif"]
        assert std_filter.get_filter_configuration()["get_date_from_exif"]

    def test__get_sorted_files(self, file_import_setup):
        p = os.path.join(test_path, "test_files", "sort_files")
        content = [os.path.join(p, x) for x in os.listdir(p)]
        file_import_setup.sort_sequence_by = file_import_setup.SEQUENCE_SORT_OPTIONS["NUMERICAL_FILENAME"]
        files = [kioskstdlib.get_filename(x) for x in file_import_setup._get_sorted_files(content)]
        assert files == ['DSC_0148.jpg', 'DSC_0155.NEF', 'DSC_0253.NEF', 'DSC_0802.NEF', 'buptap-aad-1008.jpg']

        p = os.path.join(test_path, "test_files", "test_files")
        content = [os.path.join(p, x) for x in os.listdir(p)]
        file_import_setup.sort_sequence_by = file_import_setup.SEQUENCE_SORT_OPTIONS["FILE_CREATION_TIME"]
        files = [kioskstdlib.get_filename(x) for x in file_import_setup._get_sorted_files(content)]
        assert files == ['buptap-aad-008.jpg',
                         'buptap-aad-008-optimized.jpg',
                         'EC-002 optimized.jpg',
                         'EC-002 regcognizable only with optimization.jpg',
                         'DSC_0802.NEF',
                         'EB recognizable even without optimization.jpg',
                         'EB unrecognizable due to bad perspective - not optimized.jpg',
                         'EB unrecognizable due to bad perspective - optimized.jpg',
                         'EC-002 b in desparate need of optimization.jpg',
                         'EC-002 b perfectly optimized.jpg']
