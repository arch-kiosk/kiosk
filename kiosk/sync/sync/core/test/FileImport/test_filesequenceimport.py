import datetime
import os
import unittest.mock as mock
from unittest.mock import call

from dateutil import relativedelta

import pytest

import kioskstdlib
import sync_plugins.fileimportstandardfilters.fileimportstandardfilters as stdfilters
import synchronization
from fileimport import FileImport
from filesequenceimport import FileSequenceImport
from filerepository import FileRepository
# import console
from generalstore import generalstorekeys
from kioskcontextualfile import KioskContextualFile
from sync_config import SyncConfig
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from test.testhelpers import KioskPyTestHelper
from test.mock_timezoneinfo import mock_kiosk_time_zones
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

    @pytest.fixture(scope="module")
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
        file_import_setup.sort_sequence_by = "FILE_NUM_PART"
        files = [kioskstdlib.get_filename(x) for x in file_import_setup._get_sorted_files(content)]
        assert files == ['DSC_0148.jpg', 'DSC_0155.NEF', 'DSC_0253.NEF', 'DSC_0802.NEF', 'buptap-aad-1008.jpg']

        p = os.path.join(test_path, "test_files", "test_files")
        content = [os.path.join(p, x) for x in os.listdir(p)]

        file_import_setup.sort_sequence_by = "FILE_CREATION_TIME"
        dt_base = datetime.datetime.now().replace(year=2010)
        for file in ['buptap-aad-008.jpg',
                     'buptap-aad-008-optimized.jpg',
                     'DSC_0802.NEF',
                     'EC-002 b in desparate need of optimization.jpg',
                     'EC-002 b perfectly optimized.jpg',
                     'EC-002 optimized.jpg',
                     'EC-002 regcognizable only with optimization.jpg',
                     'EB unrecognizable due to bad perspective - not optimized.jpg',
                     'EB unrecognizable due to bad perspective - optimized.jpg',
                     'EB recognizable even without optimization.jpg',
                     ]:
            path_and_filename = os.path.join(p, file)
            dt_base += datetime.timedelta(days=1)
            kioskstdlib.set_file_date_and_time(path_and_filename, dt_base)

        files = [kioskstdlib.get_filename(x) for x in file_import_setup._get_sorted_files(content)]
        assert files == ['buptap-aad-008.jpg',
                         'buptap-aad-008-optimized.jpg',
                         'DSC_0802.NEF',
                         'EC-002 b in desparate need of optimization.jpg',
                         'EC-002 b perfectly optimized.jpg',
                         'EC-002 optimized.jpg',
                         'EC-002 regcognizable only with optimization.jpg',
                         'EB unrecognizable due to bad perspective - not optimized.jpg',
                         'EB unrecognizable due to bad perspective - optimized.jpg',
                         'EB recognizable even without optimization.jpg',
                         ]

    def test_get_context_from_qr_code(self, file_import_setup):
        file_import = file_import_setup
        p = os.path.join(test_path, "test_files", "sequence_files")
        f = os.path.join(p, "v3_qr_code.jpg")

        file_filter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        assert file_filter
        assert file_filter.get_filter_configuration()["get_identifier"]
        assert file_filter.get_filter_configuration()["get_date"]
        assert file_filter.is_active()
        file_filter.set_filter_configuration_values({"recognition_strategy": "qr_code_sahara"})
        context = file_import_setup.get_context_from_qr_code(f)
        assert context == {'day': 24, 'identifier': 'NA-008', 'month': 5, 'year': 2023}

        f = os.path.join(p, "Context NA Single Shot.jpg")
        context = file_import_setup.get_context_from_qr_code(f)
        assert context == {'import': False}

        f = os.path.join(p, test_path, "test_files", "sequence_files", "DSC_0148.jpg")
        context = file_import_setup.get_context_from_qr_code(f)
        assert not context

    @mock.patch.object(FileRepository, "add_contextual_file")
    def test_import_sequence_to_repository(self, mock_add_contextual_file, file_import_setup,
                                           monkeypatch, mock_kiosk_time_zones):
        def mock__fetch_contexts(sql_instruction, prefix="", namespace=""):
            print("mock__fetch_contexts")
            return []

        monkeypatch.setattr(KioskContextualFile, "_fetch_contexts", mock__fetch_contexts)

        mock_add_contextual_file.return_value = True

        file_import = file_import_setup
        file_filter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        assert file_filter
        assert file_filter.get_filter_configuration()["get_identifier"]
        assert file_filter.get_filter_configuration()["get_date"]
        assert file_filter.is_active()

        files = ["v3_qr_code.jpg", "this should be impoted.jpg", "v3_qr_code - end.jpg", "Context NA Single Shot.jpg"]

        dt_base = datetime.datetime.now().replace(year=2010)
        p = os.path.join(test_path, "test_files", "sequence_files")
        for file in files:
            path_and_filename = os.path.join(p, file)
            dt_base += datetime.timedelta(days=1)
            kioskstdlib.set_file_date_and_time(path_and_filename, dt_base)

        file_import.pathname = p

        file_import.recursive = False
        file_import.tz_index = 96554373
        file_import._config["file_extensions"] = ["jpg"]
        file_import.tags = ["-"]
        file_import.set_from_dict({
            "sort_sequence_by": "FILE_CREATION_TIME",
            "image_manipulation_set": "qr_code_sahara",

        })
        assert file_import.execute()
        assert mock_add_contextual_file.call_count == 1

    @mock.patch.object(FileImport, "_add_file_to_repository")
    def test_import_multiple_files_to_repository(self, mock_add_file_to_repository, file_import_setup,
                                                 mock_kiosk_time_zones):
        mock_add_file_to_repository.return_value = True

        file_import = file_import_setup
        file_filter = file_import.get_file_import_filter("FileImportQRCodeFilter")
        assert file_filter
        assert file_filter.get_filter_configuration()["get_identifier"]
        assert file_filter.get_filter_configuration()["get_date"]
        assert file_filter.is_active()

        file_import.pathname = os.path.join(test_path, "test_files", "sequence_files_2")

        file_import.recursive = True
        file_import.tz_index = 96554373
        file_import._config["file_extensions"] = ["jpg"]
        file_import.tags = ["-"]
        file_import.set_from_dict({
            "sort_sequence_by": "FILE_NUM_PART",
            "image_manipulation_set": "qr_code_sahara",
        })

        assert file_import.execute(identifier_evaluator=lambda x: True)

        test_basis = {
            "description": "",
            "modified_by": "sys",
            "tags": ["-"],
            "accept_duplicates": True,
            'tz_index': 96554373
        }

        test_values = [
            {
                "path_and_filename": os.path.join(test_path, "test_files", "sequence_files_2",
                                                  "003_import.jpg"),
                "identifier": "NA-008",
                # "ts_file": datetime.datetime(2023, 5, 25, 1, 9, 50,
                #                              tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "sequence_files_2",
                                                  "004_import.jpg"),
                "identifier": "NA-008",
                # "ts_file": datetime.datetime(2023, 5, 25, 1, 9, 50,
                #                              tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "sequence_files_2",
                                                  "005_import.jpg"),
                "identifier": "NA-008",
                # "ts_file": datetime.datetime(2023, 5, 25, 1, 9, 50,
                #                              tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "sequence_files_2", "sequence_3",
                                                  "002_import.jpg"),
                "identifier": "NA-008",
                # "ts_file": datetime.datetime(2023, 5, 25, 2, 6, 54,
                #                              tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
            {
                "path_and_filename": os.path.join(test_path, "test_files", "sequence_files_2", "sequence_3",
                                                  "003_import.jpg"),
                "identifier": "NA-008",
                # "ts_file": datetime.datetime(2023, 5, 25, 2, 6, 54,
                #                              tzinfo=zoneinfo.ZoneInfo("US/Eastern")).astimezone().replace(tzinfo=None)
            },
        ]
        call_list = []
        for val in test_values:
            test_file = {**test_basis.copy(), **val}
            test_file["ts_file"] = kioskstdlib.get_earliest_date_from_file(test_file["path_and_filename"]).replace(
                microsecond=0)
            call_list.append(call(**test_file))

        mock_add_file_to_repository.assert_has_calls(call_list)

