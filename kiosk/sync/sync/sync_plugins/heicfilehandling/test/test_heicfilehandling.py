import logging
import os

import pytest
from wand.image import Image

from kioskphysicalfile import KioskPhysicalFile, SupportedFileFormat
from kioskphysicalimagefile import KioskPhysicalImageFile
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions
from sync_config import SyncConfig
from synchronization import Synchronization
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from test.testhelpers import KioskPyTestHelper
from kioskstdlib import get_exif_data
from kioskstdlib import get_file_dimensions

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestHeicFileHandling(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)
    # @pytest.fixture(scope="module")
    # def cfg(self):
    #     cfg = SyncConfig.get_config({"config_file": config_file})
    #
    #     # Initialize logging and settings
    #     logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    #     logger = logging.getLogger()
    #     logger.setLevel(logging.DEBUG)
    #
    #     if not cfg.do_log_to_screen():
    #         logger.handlers = []
    #
    #     if cfg.get_logfile():
    #         ch = logging.FileHandler(filename=cfg.get_logfile())
    #         ch.setLevel(logging.DEBUG)
    #         formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
    #         ch.setFormatter(formatter)
    #         logger.addHandler(ch)
    #         logging.info("Logging....")
    #
    #     return cfg

    @pytest.fixture()
    def sync(self, cfg, shared_datadir):

        cfg.config["database_name"] = "urap_test"  # just to make extra sure!
        cfg.config["file_repository"] = shared_datadir

        sync = Synchronization()
        assert sync.load_plugins(["heicfilehandling"])
        return sync

    def test_init(self, sync: Synchronization):
        assert sync
        assert sync.type_repository
        assert sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        cfg = SyncConfig.get_config()
        assert cfg.file_formats
        assert "HEIC" in cfg.file_formats
        assert "jpg" in cfg.file_formats["HEIC"]["extensions"]
        assert "heic" in cfg.file_formats["HEIC"]["extensions"]
        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class.supported_file_formats
        assert len(f_class.supported_file_formats) == 8
        for fmt in f_class.supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            if fmt.id == "HEIC":
                assert fmt.input_extensions
                assert not fmt.output_extension
            elif fmt.id == "JPEG":
                assert not fmt.input_extensions
                assert fmt.output_extension




    def test_wand(self, shared_datadir):
        filename = os.path.join(shared_datadir, 'Photo 7-7-2018 10.08.05 AM.jpg')
        with Image(filename=filename, format='HEIC') as img:
            logging.debug(f"{self.__class__.__name__}. : {img.format}")
            assert img
            assert img.format == "HEIC"

    def test_can_handle(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        assert f_class.can_open(file)

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.19 AM.heic")
        assert f_class.can_open(file)

        file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.NEF")
        assert not f_class.can_open(file)

    def test_can_convert_to(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"HEIC": "PNG"}

        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"HEIC": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION"]
        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"*": "!", "HEIC": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION", "FLIP_HORIZONTAL"]
        assert not f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"*": "!", "HEIC": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION"]
        representation.requested_manipulations = ["FLIP_HORIZONTAL"]

        assert f_class.can_convert_to(file, representation)
        assert "FLIP_HORIZONTAL" in representation.get_all_manipulations()
        assert "FIX_ROTATION" in representation.get_all_manipulations()

    def test_downscale_heic(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM - downscaled.png")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG", "HEIC": "PNG"}
        representation.dimensions = KioskRepresentationTypeDimensions(128, 128)

        assert f_class.can_convert_to(src_file, representation)
        file: KioskPhysicalImageFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.08.05 AM - downscaled", shared_datadir)
        assert os.path.exists(dst_file)
        d = get_file_dimensions(dst_file)
        assert d[0] <= 128 and d[1] <= 128

        representation.format_request = {"*": "JPEG"}
        representation.method = "BICUBIC"
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM - bicubic.jpg")
        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.08.05 AM - bicubic", shared_datadir)
        assert os.path.exists(dst_file)
        d = get_file_dimensions(dst_file)
        assert d[0] <= 128 and d[1] <= 128

    def test_remove_exif(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.36 AM.jpg")
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.36 AM - exif.jpg")
        assert os.path.exists(src_file)
        assert not os.path.exists(dst_file)

        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}
        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.09.36 AM - exif", shared_datadir)

        assert os.path.exists(dst_file)
        assert get_exif_data(dst_file)["Exif"]

        representation.required_manipulations = ["DROP_EXIF_DATA"]
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.36 AM - no exif.jpg")
        assert not os.path.exists(dst_file)
        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.09.36 AM - no exif", shared_datadir)

        assert os.path.exists(dst_file)
        assert not get_exif_data(dst_file)["Exif"]

    # does not seem to be necessary anymore. Wait until we have a proper test image....
    @pytest.mark.skip
    def test_fix_jpg_rotation(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.36 AM.jpg")
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.09.36 AM - rotate.jpg")

        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}
        representation.required_manipulations = ["FIX_ROTATION", "DROP_EXIF_DATA"]

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.09.36 AM - rotate", shared_datadir)
        assert os.path.exists(dst_file)

    def test_get_attributes(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalHeicFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM.jpg")
        dst_file = os.path.join(shared_datadir, "Photo 7-7-2018 10.08.05 AM - real jpg now.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, "Photo 7-7-2018 10.08.05 AM - real jpg now", shared_datadir)
        assert os.path.exists(dst_file)

        attr = file.get_file_attributes(False)
        assert attr
        assert attr["width"] == 4032
        assert attr["height"] == 3024
        assert attr["format"] == "HEIC"
