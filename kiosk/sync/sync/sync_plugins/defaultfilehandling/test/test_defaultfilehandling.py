import pytest
import tempfile
import os
import logging

from test.testhelpers import KioskPyTestHelper
from kioskstdlib import get_file_dimensions
from kioskstdlib import get_exif_data

from typerepository import TypeRepository
from kiosksqldb import KioskSQLDb
from shutil import copyfile

from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions
from sync_config import SyncConfig
from synchronization import Synchronization
from filerepository import FileRepository
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from kioskphysicalfile import KioskPhysicalFile, SupportedFileFormat

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestRepresentationType(KioskRepresentationType):
    pass


# @pytest.mark.skip
class TestKioskLogicalFile(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

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

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class.supported_file_formats
        assert len(f_class.supported_file_formats) == 6

        for fmt in f_class.supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            assert fmt.input_extensions
            assert fmt.output_extension

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowNefFile")
        assert f_class.supported_file_formats
        assert len(f_class.supported_file_formats) == 8

        for fmt in f_class.supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            if fmt.id == "NEF" or fmt.id == "CR2":
                assert fmt.input_extensions
                assert not fmt.output_extension
            else:
                assert not fmt.input_extensions
                assert fmt.output_extension


    def test_can_handle(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")

        assert f_class.can_open(file)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.nef")

        assert not f_class.can_open(file)

    def test_can_convert_to(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"JPEG": "PNG"}

        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = TestRepresentationType("SomeJpegs")
        representation.format_request = {"JPEG": "PNG"}

        assert not f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("SomeNefs")
        representation.format_request = {"NEF": "JPEG"}

        assert not f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"JPEG": "PNG"}
        representation.method = "BICUBIC"

        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"JPG": "PNG"}
        representation.method = "JPEG2000"

        assert not f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.dest_format = "PNG"
        representation.format_request = {"JPEG": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION"]
        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"JPEG": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION", "FLIP_HORIZONTAL"]
        assert not f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        representation = KioskRepresentationType("JPEG")
        representation.format_request = {"JPEG": "PNG"}
        representation.required_manipulations = ["FIX_ROTATION"]
        representation.requested_manipulations = ["FLIP_HORIZONTAL"]

        assert f_class.can_convert_to(file, representation)
        assert "FLIP_HORIZONTAL" in representation.get_all_manipulations()
        assert "FIX_ROTATION" in representation.get_all_manipulations()

    def test_downscale_jpg(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        dst_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504_small.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "!"}
        representation.dimensions = KioskRepresentationTypeDimensions(128, 128)

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="c377be85-fa86-4772-ae30-3c0485ce1504_small")
        assert os.path.exists(dst_file)
        d = get_file_dimensions(dst_file)
        assert d[0] <= 128 and d[1] <= 128

    def test_fix_jpg_rotation(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        dst_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504_fixed_rotation.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "!"}
        representation.requested_manipulations = ["FIX_ROTATION"]

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="c377be85-fa86-4772-ae30-3c0485ce1504_fixed_rotation")
        assert os.path.exists(dst_file)

    def test_remove_exif(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPillowFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        dst_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504_noexif.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "!"}
        representation.required_manipulations = ["DROP_EXIF_DATA"]

        logging.debug(f"{self.__class__.__name__}. : {get_exif_data(src_file)['Exif']}")
        assert get_exif_data(src_file)["Exif"]
        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="c377be85-fa86-4772-ae30-3c0485ce1504_noexif")
        assert os.path.exists(dst_file)
        assert not get_exif_data(dst_file)["Exif"]

    def test_nef(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowNefFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.nef")
        dst_file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"NEF": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA", "FIX_ROTATION"]

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="492d8872-f119-463b-8704-611fa2d3d04b")
        assert os.path.exists(dst_file)

    def test_file_attributes(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.jpg")
        dst_file = os.path.join(shared_datadir, "c377be85-fa86-4772-ae30-3c0485ce1504.png")
        representation = KioskRepresentationType("pngs")
        representation.format_request = {"JPEG": "PNG"}

        assert f_class.can_convert_to(src_file, representation)
        file: KioskPhysicalFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="c377be85-fa86-4772-ae30-3c0485ce1504")
        assert os.path.exists(dst_file)
        attr = file.get_file_attributes(False)
        assert attr
        assert attr["height"] == 4016
        assert attr["width"] == 6016
        assert attr["format"] == "JPEG"

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowFile")
        file: KioskPhysicalFile = f_class(src_file)
        attr = file.get_file_attributes()
        assert attr
        assert attr["width"] == 6016
        assert attr["height"] == 4016
        assert attr["format"] == "JPEG"

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowNefFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.nef")
        dst_file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"NEF": "JPEG"}

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="492d8872-f119-463b-8704-611fa2d3d04b")
        assert os.path.exists(dst_file)

        attr = file.get_file_attributes(False)
        assert attr
        assert attr["height"] == 4016
        assert attr["width"] == 6016
        assert attr["format"] == "NEF"

    def test_tif(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "CE-004-7-2 exterior.tif")
        dst_file = os.path.join(shared_datadir, "CE-004-7-2 exterior.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"TIFF": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA", "FIX_ROTATION"]

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="CE-004-7-2 exterior")
        assert os.path.exists(dst_file)

    def test_cr2(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER,
                                                                   "KioskPhysicalPillowNefFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "canon_eos_5d_mark_iii_02.cr2")
        dst_file = os.path.join(shared_datadir, "192d8872-f119-463b-8704-611fa2d3d04b.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"CR2": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA", "FIX_ROTATION"]

        assert f_class.can_convert_to(src_file, representation)
        file = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, target_path=shared_datadir,
                               target_filename_without_extension="192d8872-f119-463b-8704-611fa2d3d04b")
        assert os.path.exists(dst_file)


