import logging
import os
import pytest
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions

from sync_config import SyncConfig
from synchronization import Synchronization
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from kioskphysicalfile import KioskPhysicalFile, SupportedFileFormat
from kioskphysicalimagefile import KioskPhysicalImageFile
from test.testhelpers import KioskPyTestHelper
from kioskstdlib import get_file_dimensions
from core.kioskphysicalfile import FILE_ATTR_HEIGHT, FILE_ATTR_WIDTH, FILE_ATTR_FORMAT

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


# @pytest.mark.skip
class TestPdfFileHandling(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture()
    def sync(self, cfg, shared_datadir):

        cfg.config["database_name"] = "urap_test"  # just to make extra sure!
        cfg.config["file_repository"] = shared_datadir

        sync = Synchronization()
        assert sync.load_plugins(["pdffilehandling"])
        return sync

    def test_init(self, sync: Synchronization):
        assert sync
        assert sync.type_repository
        assert sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")

    def test_file_formats(self, sync: Synchronization):
        cfg = SyncConfig.get_config()
        assert cfg.file_formats
        assert "PDF" in cfg.file_formats

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class.supported_file_formats
        assert len(f_class.supported_file_formats) == 4
        for fmt in f_class.supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            if fmt.id == "PDF":
                assert fmt.input_extensions
                assert not fmt.output_extension
            elif fmt.id in ["JPEG", "BMP", "PNG"]:
                assert not fmt.input_extensions
                assert fmt.output_extension

    def test_can_handle(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class

        file = os.path.join(shared_datadir, "test_pdf.pdf")
        assert f_class.can_open(file)

        file = os.path.join(shared_datadir, "test_jpg.jpg")
        assert not f_class.can_open(file)

    def test_can_convert_to(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class

        file = os.path.join(shared_datadir, "test_pdf.pdf")
        representation = KioskRepresentationType("jpegformat")
        representation.format_request = {"PDF": "JPEG"}

        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "test_jpg.jpg")
        representation = KioskRepresentationType("jpegformat")
        representation.format_request = {"JPEG": "JPEG"}

        assert not f_class.can_convert_to(file, representation)

    def test_open(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "test_pdf.pdf")

        file: KioskPhysicalImageFile = f_class(src_file)
        img = file._open_image()
        assert img
        assert file._file_attributes[FILE_ATTR_FORMAT] == "PDF"
        img.close()

    def test_downscale_single_page_pdf(self, sync: Synchronization, shared_datadir):

        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "test_pdf.pdf")
        dst_file = os.path.join(shared_datadir, "test_pdf_downscaled.jpg")
        representation = KioskRepresentationType("jpegformat")
        representation.format_request = {"PDF": "JPEG"}
        representation.dimensions = KioskRepresentationTypeDimensions(128, 128)

        file: KioskPhysicalImageFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "test_pdf_downscaled", shared_datadir)
        assert os.path.exists(dst_file)
        d = get_file_dimensions(dst_file)
        assert d[0] <= 128 and d[1] <= 128

    def test_downscale_double_page_pdf(self, sync: Synchronization, shared_datadir):

        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalPdfFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "two_pages.pdf")
        dst_file = os.path.join(shared_datadir, "two_pages_downscaled.jpg")
        representation = KioskRepresentationType("jpegformat")
        representation.format_request = {"PDF": "JPEG"}
        representation.dimensions = KioskRepresentationTypeDimensions(128, 128)

        file: KioskPhysicalImageFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "two_pages_downscaled", shared_datadir)
        assert os.path.exists(dst_file)
        d = get_file_dimensions(dst_file)
        assert d[0] <= 128 and d[1] <= 128
