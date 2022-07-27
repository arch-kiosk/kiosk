import pytest
import os
import logging

from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from synchronization import Synchronization
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from kioskfileconverter import KioskFileConverter
from test.testhelpers import KioskPyTestHelper


# @pytest.mark.skip
class TestKioskFileConverter(KioskPyTestHelper):

    @pytest.fixture()
    def cfg(self):
        # not using , test_config_file="config_kiosk_imagemanagement.yml"
        return self.get_standard_test_config(__file__)

    @pytest.fixture()
    def sync(self, cfg, shared_datadir):
        cfg.config["database_name"] = "urap_test"  # just to make extra sure!
        cfg.config["file_repository"] = shared_datadir

        sync = Synchronization()
        assert sync.load_plugins(["defaultfilehandling"])
        return sync

    def test_init(self, sync: Synchronization):
        assert sync
        assert sync.type_repository
        assert sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowNefFile")
        cfg = SyncConfig.get_config()
        assert cfg.file_formats
        assert "JPEG" in cfg.file_formats
        assert "jpg" in cfg.file_formats["JPEG"]["extensions"]
        assert "NEF" in cfg.file_formats

        fc = KioskFileConverter(sync.type_repository, sync.load_plugins)
        assert fc

    def test_convert(self, cfg, sync: Synchronization, shared_datadir):
        jpg_file = os.path.join(self.test_path, "data", "5d07ae04-818a-4b1e-ba7f-2c4f4fc8e343.jpg")
        png_file = os.path.join(self.test_path, "data", "f9b51538-1ba4-40f3-be30-b372471dcb34.png")
        nef_file = os.path.join(self.test_path, "data", "492d8872-f119-463b-8704-611fa2d3d04b.NEF")

        fc = KioskFileConverter(sync.type_repository, sync.load_plugins)
        assert fc
        representation = KioskRepresentationType("Tojpg")
        representation.format_request = {"*": "JPEG"}
        dst_file = fc.convert(jpg_file, representation, shared_datadir)
        assert dst_file
        assert os.path.isfile(dst_file)

        dst_file = fc.convert(png_file, representation, shared_datadir)
        assert dst_file
        assert os.path.isfile(dst_file)

        dst_file = fc.convert(nef_file, representation, shared_datadir)
        assert dst_file
        assert os.path.isfile(dst_file)
        logging.info(f"{nef_file} converted to {dst_file}")
