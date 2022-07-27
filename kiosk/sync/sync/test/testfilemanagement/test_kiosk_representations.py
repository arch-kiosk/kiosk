import logging
import os
from collections import OrderedDict

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from kioskrepresentationtype import KioskRepresentationType, \
    KioskRepresentations, \
    MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_kiosk_imagemanagement.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")



# @pytest.mark.skip
class TestKioskRepresentations(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file=config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def config(self, cfg):
        return cfg

    @pytest.fixture()
    def kiosk_db(self, cfg, shared_datadir):
        # cfg = SyncConfig.get_config({"config_file": config_file})
        assert cfg
        cfg.database_name = "urap_test"
        cfg.config["file_repository"] = shared_datadir
        cfg._file_repository = shared_datadir
        KioskSQLDb.close_connection()
        return KioskSQLDb.get_dict_cursor()

    @pytest.fixture()
    def db(self, kiosk_db, shared_datadir):
        kiosk_db.execute("truncate table images;")
        kiosk_db.execute("truncate table kiosk_file_cache;")
        kiosk_db.commit()

        KioskSQLDb.run_sql_script(os.path.join(shared_datadir,
                                              "insert_file_records.sql"))
        KioskSQLDb.run_sql_script(os.path.join(shared_datadir,
                                              "create_archaeological_context_data.sql"))
        kiosk_db.commit()
        return kiosk_db

    def test_representations(self, config):
        file_repos_config = KioskRepresentations._get_file_repository_config()
        print(file_repos_config)
        assert file_repos_config
        assert file_repos_config["representations"]
        assert file_repos_config["auto_representations"]
        assert file_repos_config["thumbnails"]

        auto_representations = KioskRepresentations._get_auto_representations()
        assert auto_representations
        assert auto_representations == ['medium', 'small']

        representations = KioskRepresentations.get_representation_ids()
        assert len(representations) == 7
        assert "small" in representations
        assert "medium" in representations
        assert "master" in representations

        representation: KioskRepresentationType = KioskRepresentations.instantiate_representation_from_config('small')
        dict1 = OrderedDict(representation.format_request)
        assert dict1 == OrderedDict({"*": "!", "NEF": "JPEG", "HEIC": "JPEG"})
        # assert representation.output_file_extension == "jpg"
        assert representation.format_request == {"*": "!", "NEF": "JPEG", "HEIC": "JPEG"}
        assert representation.dimensions
        assert representation.dimensions.width == 128
        assert representation.dimensions.height == 128
        assert representation.label == "small thumbnail"
        assert representation.inherits == "master"

    def test_get_output_format(self, config):
        representation: KioskRepresentationType = KioskRepresentations.instantiate_representation_from_config('small')
        assert representation
        assert representation.format_request == {"*": "!", "NEF": "JPEG", "HEIC": "JPEG"}
        assert representation.get_requested_output_format("PNG") == "PNG"
        assert representation.get_requested_output_format("BMP") == "BMP"
        assert representation.get_requested_output_format("JPEG") == "JPEG"
        assert representation.get_requested_output_format("NEF") == "JPEG"
        assert representation.get_requested_output_format("HEIC") == "JPEG"

    def test_get_standard_output_format(self, config):
        representation: KioskRepresentationType = KioskRepresentations.instantiate_representation_from_config('master')
        assert representation
        assert representation.format_request == {"*": "JPEG", "PNG": "!", "NEF": "JPEG", "HEIC": "JPEG"}
        assert representation.get_requested_output_format("PNG") == "PNG"
        assert representation.get_requested_output_format("JPEG") == "JPEG"
        assert representation.get_requested_output_format("NEF") == "JPEG"
        assert representation.get_requested_output_format("HEIC") == "JPEG"
        assert representation.get_requested_output_format("BMP") == "JPEG"

        representation: KioskRepresentationType = KioskRepresentations.instantiate_representation_from_config('medium')
        assert representation
        assert representation.get_requested_output_format("PNG") == "PNG"
        assert representation.get_requested_output_format("JPEG") == "JPEG"
        assert representation.get_requested_output_format("NEF") == "JPEG"
        assert representation.get_requested_output_format("HEIC") == "JPEG"
        assert representation.get_requested_output_format("BMP") == "PNG"

    def test_manipulations(self, config):
        representation: KioskRepresentationType = \
            KioskRepresentations.instantiate_representation_from_config("fix_rotation")

        assert MANIPULATION_FIX_ROTATION in representation.required_manipulations
        assert MANIPULATION_DROP_EXIF_DATA not in representation.required_manipulations

        assert MANIPULATION_DROP_EXIF_DATA in representation.requested_manipulations
        assert MANIPULATION_FIX_ROTATION not in representation.requested_manipulations

        assert MANIPULATION_DROP_EXIF_DATA in representation.get_all_manipulations()
        assert MANIPULATION_FIX_ROTATION in representation.get_all_manipulations()

    def test_get_inherited_manipulations(self, config):
        representation: KioskRepresentationType = \
            KioskRepresentations.instantiate_representation_from_config("many_masters")
        assert representation
        master_manipulations = KioskRepresentations.get_master_manipulations(representation.inherits)
        assert master_manipulations
        assert MANIPULATION_DROP_EXIF_DATA in master_manipulations
        assert MANIPULATION_FIX_ROTATION in master_manipulations
        assert "DOSOMETHING" in master_manipulations
        assert "DOSOMETHINGELSE" in master_manipulations

        master_manipulations = representation.get_inherited_manipulations()
        assert master_manipulations
        assert MANIPULATION_DROP_EXIF_DATA in master_manipulations
        assert MANIPULATION_FIX_ROTATION in master_manipulations
        assert "DOSOMETHING" in master_manipulations
        assert "DOSOMETHINGELSE" in master_manipulations

    def test_get_specific_manipulations(self, config):
        representation: KioskRepresentationType = \
            KioskRepresentations.instantiate_representation_from_config("many_masters")
        assert representation
        specifics = representation.get_specific_manipulations()
        for x in ["MYOWNMANIPULATION", "MYOWNMANIPULATION2"]:
            assert x in specifics

        assert representation.get_specific_manipulations(required=False) == ["MYOWNMANIPULATION"]
        assert ["MYOWNMANIPULATION2"] not in representation.get_specific_manipulations(required=False)
        assert representation.get_specific_manipulations(requested=False) == ["MYOWNMANIPULATION2"]
        assert ["MYOWNMANIPULATION1"] not in representation.get_specific_manipulations(required=True)

