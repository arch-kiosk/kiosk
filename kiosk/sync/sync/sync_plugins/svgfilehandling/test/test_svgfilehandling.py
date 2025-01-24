import logging
import os
import pytest
import filecmp
from xml.dom.minidom import getDOMImplementation, parse, parseString, Document

import sys
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions

from sync_config import SyncConfig
from synchronization import Synchronization
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from kioskphysicalfile import KioskPhysicalFile, SupportedFileFormat
from kioskphysicalimagefile import KioskPhysicalImageFile
from test.testhelpers import KioskPyTestHelper
from kioskstdlib import get_file_dimensions
from core.kioskphysicalfile import FILE_ATTR_HEIGHT, FILE_ATTR_WIDTH, FILE_ATTR_FORMAT
from ..kiosksvg import KioskSVG

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestSvgFileHandling(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def sync(self, cfg, shared_datadir):

        cfg.config["database_name"] = "urap_test"  # just to make extra sure!
        cfg.config["file_repository"] = shared_datadir

        sync = Synchronization()
        assert sync.load_plugins(["svgfilehandling"])
        return sync

    def test_open_and_save(self, cfg, shared_datadir):
        svg = KioskSVG()
        assert svg
        src_file = os.path.join(shared_datadir, "svg.svg")
        assert svg.open(src_file)

        dst_file = os.path.join(shared_datadir, "dst_svg.svg")
        assert not os.path.isfile(dst_file)
        assert svg.save(dst_file)
        assert os.path.isfile(dst_file)

    def test_set_dimensions(self, cfg, shared_datadir):
        svg = KioskSVG()
        assert svg

        assert svg.open(os.path.join(shared_datadir, "svg.svg"))
        assert not os.path.isfile(os.path.join(shared_datadir, "dst_svg.svg"))
        dst_file = os.path.join(shared_datadir, "dst_svg.svg")
        assert svg.set_dimensions(128, 128)
        assert svg.save(dst_file)
        assert os.path.isfile(dst_file)

        assert svg.open(dst_file)
        svg: Document = svg.src_svg
        assert svg
        parent_svg = svg.getElementsByTagName("svg")[0]
        assert parent_svg
        assert parent_svg.attributes
        assert parent_svg.attributes["width"].value == "128px"
        assert parent_svg.attributes["height"].value == "128px"

    def test_set_dimensions_again(self, cfg, shared_datadir):
        svg = KioskSVG()
        assert svg

        assert svg.open(os.path.join(shared_datadir, "svg.svg"))
        assert not os.path.isfile(os.path.join(shared_datadir, "dst_svg.svg"))
        dst_file = os.path.join(shared_datadir, "svg_128x128.svg")
        assert svg.set_dimensions(128, 128)
        assert svg.save(dst_file)
        svg.close()
        assert os.path.isfile(dst_file)

        assert svg.open(dst_file)
        assert svg.width == "128px"
        assert svg.height == "128px"
        assert svg.set_dimensions(64, 64)
        new_dst_file = os.path.join(shared_datadir, "svg_64x64.svg")
        assert svg.save(new_dst_file)
        svg.close()

        assert svg.open(new_dst_file)
        assert svg.width == "64px"
        assert svg.height == "64px"

        # Let's test that there is really only one parent_svg in the new_dst_svg:
        svg_tag: Document = svg.src_svg
        assert svg_tag
        elements = svg_tag.getElementsByTagName("svg")
        c_parent_svgs = 0
        for element in elements:
            if element.hasAttribute("id"):
                if element.getAttribute("id") == "parent_svg":
                    c_parent_svgs += 1

        assert c_parent_svgs == 1
        svg.close()

    def test_set_dimensions_when_svg_has_dimensions(self, cfg, shared_datadir):
        svg = KioskSVG()
        assert svg

        assert svg.open(os.path.join(shared_datadir, "svg_with_dimensions.svg"))
        assert not os.path.isfile(os.path.join(shared_datadir, "dst_svg.svg"))
        dst_file = os.path.join(shared_datadir, "svg_128x128.svg")
        assert svg.set_dimensions(128, 128)
        assert svg.save(dst_file)
        svg.close()
        assert os.path.isfile(dst_file)

        assert svg.open(dst_file)
        assert svg.width == "128px"
        assert svg.height == "128px"
        assert svg.set_dimensions(64, 64)
        new_dst_file = os.path.join(shared_datadir, "svg_64x64.svg")
        assert svg.save(new_dst_file)

        #  let's test if the inner svg has the correct dimensions
        svg_tag: Document = svg.src_svg
        assert svg_tag
        elements = svg_tag.getElementsByTagName("svg")
        inner_svg = elements[0]
        assert inner_svg.getAttribute("width") == "64px"
        assert inner_svg.getAttribute("height") == "64px"
        svg.close()

    def test_read_attributes(self, cfg, shared_datadir):
        svg = KioskSVG()
        assert svg

        assert svg.open(os.path.join(shared_datadir, "svg_with_width.svg"))
        assert svg.width == "256px"
        assert svg.height == "256px"
        svg.close()

        assert svg.open(os.path.join(shared_datadir, "svg.svg"))
        assert svg.width == ""
        assert svg.height == ""
        assert svg.set_dimensions(64, 64)
        assert svg.width == "64px"
        assert svg.height == "64px"
        svg.close()

    def test_svg_plugin_init(self, sync: Synchronization):
        assert sync
        assert sync.type_repository
        assert sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")

    def test_file_formats(self, sync: Synchronization):
        cfg = SyncConfig.get_config()
        assert cfg.file_formats
        assert "SVG" in cfg.file_formats

        f_class: KioskPhysicalFile = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class.supported_file_formats
        assert len(f_class.supported_file_formats) == 1
        for fmt in f_class.supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            if fmt.id == "SVG":
                assert fmt.input_extensions
                assert fmt.output_extension
            else:
                assert False, "There should only be SVG in here"

    def test_can_handle(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class

        file = os.path.join(shared_datadir, "svg.svg")
        assert f_class.can_open(file)

        file = os.path.join(shared_datadir, "test_jpg.jpg")
        assert not f_class.can_open(file)

    def test_can_convert_to(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class

        file = os.path.join(shared_datadir, "svg.svg")
        representation = KioskRepresentationType("scaledsvg")
        representation.format_request = {"SVG": "SVG"}

        assert f_class.can_convert_to(file, representation)

        file = os.path.join(shared_datadir, "svg.svg")
        representation = KioskRepresentationType("scaledsvg")
        representation.format_request = {"SVG": "JPEG"}

        assert not f_class.can_convert_to(file, representation)

    def test_open(self, sync: Synchronization, shared_datadir):
        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "svg.svg")

        file: KioskPhysicalImageFile = f_class(src_file)
        img = file._open_image()
        assert img
        assert file._file_attributes[FILE_ATTR_FORMAT] == "SVG"
        img.close()

    def test_convert_to(self, sync: Synchronization, shared_datadir):

        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "svg.svg")
        dst_file = os.path.join(shared_datadir, "svg_scaled.svg")
        representation = KioskRepresentationType("scaledsvg")
        representation.format_request = {"SVG": "SVG"}
        representation.dimensions = KioskRepresentationTypeDimensions(64, 64)

        file: KioskPhysicalImageFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "svg_scaled", shared_datadir)
        assert os.path.exists(dst_file)

        svg = KioskSVG()
        svg.open(dst_file)
        assert svg.width == "64px"
        assert svg.height == "64px"
        svg.close()

    def test_convert_to_troublesome_svg(self, sync: Synchronization, shared_datadir):

        cfg = SyncConfig.get_config()

        f_class = sync.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, "KioskPhysicalSvgFile")
        assert f_class

        src_file = os.path.join(shared_datadir, "406521555-cc860253-169d-4e7a-93a0-c8b7c83288ba.svg")
        dst_file = os.path.join(shared_datadir, "406521555-cc860253-169d-4e7a-93a0-c8b7c83288ba_scaled.svg")
        representation = KioskRepresentationType("scaledsvg")
        representation.format_request = {"SVG": "SVG"}
        representation.dimensions = KioskRepresentationTypeDimensions(64, 64)

        file: KioskPhysicalImageFile = f_class(src_file)
        assert not os.path.exists(dst_file)
        assert file.convert_to(representation, "406521555-cc860253-169d-4e7a-93a0-c8b7c83288ba_scaled", shared_datadir)
        assert os.path.exists(dst_file)

        svg = KioskSVG()
        svg.open(dst_file)
        assert svg.width == "64px"
        assert svg.height == "64px"
        svg.close()
