import os

import pytest
from fileimport import FileImport

import logging
import synchronization
import unittest.mock as mock

from fileimportqrcodefilter.fileimportqrcodefilter import FileImportQRCodeFilter
from filerepository import FileRepository

# import console
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestQRCodeFilter(KioskPyTestHelper):
    sync = None
    file_repository = None
    cfg = None

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file)
        cfg.custom_sync_modules = os.path.join(test_path, "config", "custom")
        cfg.config["custom_sync_modules"] = cfg.custom_sync_modules
        return cfg

    @pytest.fixture(autouse=True)  # scope session gives this fixture priority over module scope
    def init_test(self, cfg, shared_datadir):

        self.sync = synchronization.Synchronization()
        self.file_repository = FileRepository(cfg)
        self.file_import = FileImport(cfg, self.sync)
        self.file_import.file_repository = self.file_repository

        assert self.file_import
        self.file_import._import_filters_sorted = self.file_import.sort_import_filters()
        self.file_import.recursive = False
        cfg.set_temp_dir(shared_datadir)

        assert self.sync

    def test_basic_instantiation(self):
        file_import = self.file_import

        qrcode_filter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        assert qrcode_filter
        qrcode_filter.activate()
        assert qrcode_filter.is_active()

    def test_deactivation(self):
        file_import = self.file_import
        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "EB recognizable even without optimization.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.activate()
        assert qrcode_filter.is_active()
        qrcode_filter.get_file_information({})
        assert not qrcode_filter.is_active()

    def test_deactivation_if_not_strategy(self):
        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "EB recognizable even without optimization.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"recognition_strategy": ""})
        assert qrcode_filter.is_active()
        qrcode_filter.get_file_information({})
        assert not qrcode_filter.is_active()

        qrcode_filter.activate()
        assert qrcode_filter.is_active()
        qrcode_filter.set_filter_configuration_values({"recognition_strategy": "qr_code_sahara"})
        qrcode_filter.get_file_information({})
        assert qrcode_filter.is_active()

    def test_identifier(self):
        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "EB recognizable even without optimization.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})
        context = qrcode_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "EB"

        path_and_file_name = os.path.join(test_path, "images", "EC-002 regcognizable only with optimization.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        context = qrcode_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "EC-002"

    def test_date(self):
        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "EB recognizable even without optimization.jpg")

        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"get_date": True})
        context = qrcode_filter.get_file_information({})
        assert "day" not in context

        path_and_file_name = os.path.join(test_path, "images", "buptap-aad-008.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        context = qrcode_filter.get_file_information({})
        assert "day" in context
        assert context["day"] == 19
        assert context["month"] == 8
        assert context["year"] == 2018

    @mock.patch.object(FileImport, "_add_file_to_repository")
    def test_import_single_file_to_repository(self, mock_add_file_to_repository):
        mock_add_file_to_repository.return_value = True

        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "EB recognizable even without optimization.jpg")
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.set_filter_configuration_values({"get_date": False})
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})

        rc = file_import._import_single_file_to_repository(path_and_file_name)

        assert rc

        test_values = {
            "path_and_filename": path_and_file_name,
            "identifier": "EB",
            "description": "",
            "ts_file": None,
            "modified_by": "sys",
            "tags": []
        }
        mock_add_file_to_repository.assert_called_once_with(**test_values)

    def test_identifier_with_space(self):
        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "identifier with space.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})
        context = qrcode_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "Meghan Test"

    def test_qr_code_data(self):
        file_import = self.file_import

        qrcode_filter: FileImportQRCodeFilter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        path_and_file_name = os.path.join(test_path, "images", "v3_qr_code.jpg")

        qrcode_filter.set_path_and_filename(path_and_file_name)
        qrcode_filter.set_image_manipulation_set("qr_code_sahara")
        qrcode_filter.register_type_repository(self.sync.type_repository, self.sync)
        qrcode_filter.activate()
        qrcode_filter.set_filter_configuration_values({"get_identifier": True})
        context = qrcode_filter.get_file_information({})
        assert "identifier" in context
        assert context["identifier"] == "NA-008"
        assert qrcode_filter.qr_code_data["raw"] == "$V:3$D:NA-008$TS:24.05.2023 14:37:26$T:M"

