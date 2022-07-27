import datetime
import os

import pytest
from fileimport import FileImport

import logging
import synchronization
from fileimportexiffilter.fileimportexiffilter import FileImportExifFilter
import unittest.mock as mock

from filerepository import FileRepository

# import console
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestExifFilter(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture()
    def sync(self, cfg):
        sync = synchronization.Synchronization()
        assert sync
        return sync

    @pytest.fixture
    def file_repository(self, cfg):
        file_repository = FileRepository(cfg)
        assert file_repository
        return file_repository

    @pytest.fixture
    def file_import(self, cfg, sync):
        file_import = FileImport(cfg, sync)
        file_import.file_repository = self.file_repository
        return file_import

    @pytest.fixture
    def std_configure_filters(self, file_import):
        assert file_import
        file_import._import_filters_sorted = file_import.sort_import_filters()
        file_import.recursive = False

        exif_filter = file_import.get_file_import_filter("FileImportExifFilter")
        assert exif_filter
        exif_filter.deactivate()

        return file_import

    def test_activate_deactivate_filter(self, std_configure_filters):
        file_import = std_configure_filters

        exif_filter = file_import.get_file_import_filter("FileImportExifFilter")
        assert not exif_filter.is_active()

        exif_filter.activate()
        assert exif_filter.is_active()

        exif_filter.deactivate()
        assert not exif_filter.is_active()

        exif_filter.activate()
        assert exif_filter.is_active()

        # these files do not exist, but that does not matter for FileImportStandardFolderFilter
        # without any filter configuration set, the filter should deactivate itself
        exif_filter.set_path_and_filename(r"c:\import\EC\testfile.jpg")
        rc = exif_filter.get_file_information({})
        assert not exif_filter.is_active()

    def test_get_identifier(self, std_configure_filters):
        file_import = std_configure_filters

        exif_filter: FileImportExifFilter = file_import.get_file_import_filter("FileImportExifFilter")
        exif_filter.set_filter_configuration_values({"get_context_from_exif": True})
        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0148.jpg")
        context = exif_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "EB"

        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0155.nef")
        context = exif_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "EC001"

    def test_get_excavation_date(self, std_configure_filters):
        file_import = std_configure_filters

        exif_filter: FileImportExifFilter = file_import.get_file_import_filter("FileImportExifFilter")
        exif_filter.set_filter_configuration_values({"get_date_from_exif": True})
        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0148.jpg")
        context = exif_filter.get_file_information({})
        assert "day" in context and "month" in context and "year" in context
        assert context["day"] == 8
        assert context["month"] == 12
        assert context["year"] == 2017

        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0253.NEF")
        context = exif_filter.get_file_information({})
        assert "day" in context and "month" in context and "year" in context
        assert context["day"] == 15
        assert context["month"] == 12
        assert context["year"] == 2017

    def test_get_description(self, std_configure_filters):
        file_import = std_configure_filters

        exif_filter: FileImportExifFilter = file_import.get_file_import_filter("FileImportExifFilter")
        exif_filter.set_filter_configuration_values({"get_description_from_exif": True})
        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0148.jpg")
        context = exif_filter.get_file_information({})
        assert "description" in context
        assert context["description"] == "EB"

        exif_filter.path_and_filename = os.path.join(test_path, "test_files", "DSC_0155.nef")
        context = exif_filter.get_file_information({})
        assert context["description"] == "EC001"

    @mock.patch.object(FileImport, "_add_file_to_repository")
    def test_import_single_file_to_repository(self, mock_add_file_to_repository, std_configure_filters):
        mock_add_file_to_repository.return_value = True

        file_import = std_configure_filters
        exif_filter: FileImportExifFilter = file_import.get_file_import_filter("FileImportExifFilter")
        exif_filter.set_filter_configuration_values({"get_description_from_exif": True})
        exif_filter.set_filter_configuration_values({"get_date_from_exif": True})
        exif_filter.set_filter_configuration_values({"get_context_from_exif": True})
        exif_filter.activate()
        assert file_import.get_file_import_filter("FileImportExifFilter").is_active()
        # exif_filter.path_and_filename = os.path.join(test_path, "test_files","exif_files\DSC_0148.jpg")

        rc = file_import._import_single_file_to_repository(os.path.join(test_path, "test_files", "DSC_0148.jpg"))

        assert rc

        test_values = {
            "path_and_filename": os.path.join(test_path, "test_files", "DSC_0148.jpg"),
            "identifier": "EB",
            "description": "EB",
            "ts_file": datetime.datetime(2017, 12, 8, 0, 0),
            "modified_by": "sys",
            "tags": []
        }
        mock_add_file_to_repository.assert_called_once_with(**test_values)
