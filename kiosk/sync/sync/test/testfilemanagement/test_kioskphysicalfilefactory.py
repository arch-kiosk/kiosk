import pytest
import os
import logging

from dsd.dsd3singleton import Dsd3Singleton
from kioskphysicalfile import KioskPhysicalFile
from kioskphysicalfilefactory import KioskPhysicalFileFactory
from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from synchronization import Synchronization
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from test.testhelpers import KioskPyTestHelper


class TestKioskPhysicalFileFactory(KioskPyTestHelper):
    @pytest.fixture(scope="module")
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

    def test_get(self, sync, shared_datadir):
        factory = KioskPhysicalFileFactory(sync.type_repository, None)

        source_file = os.path.join(shared_datadir, "492d8872-f119-463b-8704-611fa2d3d04b.NEF")
        assert os.path.isfile(source_file)
        handlers = factory.get(source_file)
        assert handlers
        assert len(handlers) == 1
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowNefFile"

        source_file = os.path.join(shared_datadir, "7D", "7DBD0FAB-1859-4C5B-91B8-DE2BC18550D4.jpg")
        assert os.path.isfile(source_file)
        handlers = factory.get(source_file)
        assert handlers
        assert len(handlers) == 1
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowFile"

        source_file = os.path.join(shared_datadir, "49", "492d8872-f119-463b-8704-611fa2d3d04b.NEF")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "PNG"}
        handlers = factory.get(source_file)
        assert handlers
        assert len(handlers) == 1
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowNefFile"

    def test_get_with_several_handlers(self, sync, shared_datadir):
        assert sync.load_plugins(["heicfilehandling"])

        factory = KioskPhysicalFileFactory(sync.type_repository, None)

        src_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg")
        dst_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg AM_now_a_jpg.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA"]

        assert os.path.isfile(src_file)
        handlers = factory.get(src_file, representation)
        assert handlers
        assert len(handlers) == 2
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowFile"
        handler = handlers[1]
        assert handler.__name__ == "KioskPhysicalHeicFile"

        done = False
        for h_class in handlers:
            h: KioskPhysicalFile = h_class(src_file)

            rc = h.convert_to(representation=representation,
                              target_path=shared_datadir,
                              target_filename_without_extension=os.path.basename(dst_file))
            logging.debug(f"{h.__class__.__name__} returned {rc}")
            done = done or rc

        assert done

    def test_get_sorted_handlers(self, sync, shared_datadir):
        def handler_key(handler: KioskPhysicalFile):
            logging.debug(f"sort: {handler.__name__}")
            if handler.__name__ == "KioskPhysicalPillowFile":
                return 2
            else:
                return 1

        assert sync.load_plugins(["heicfilehandling"])

        factory = KioskPhysicalFileFactory(sync.type_repository, handler_key)

        src_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg")
        dst_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg AM_now_a_jpg.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA"]

        assert os.path.isfile(src_file)
        handlers = factory.get(src_file, representation)
        assert handlers
        assert len(handlers) == 2
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalHeicFile"
        handler = handlers[1]
        assert handler.__name__ == "KioskPhysicalPillowFile"

        done = False
        for h_class in handlers:
            h: KioskPhysicalFile = h_class(src_file)

            rc = h.convert_to(representation=representation,
                              target_path=shared_datadir,
                              target_filename_without_extension=os.path.basename(dst_file))
            logging.debug(f"{h.__class__.__name__} returned {rc}")
            done = done or bool(rc)

        assert done

    def test_load_plugins(self, sync, shared_datadir):

        # here we do not use the sync returned by the fixture because we don't want
        # preloaded plugins.

        sync = Synchronization()

        src_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg")
        dst_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg AM_now_a_jpg.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG"}
        representation.requested_manipulations = ["DROP_EXIF_DATA"]
        assert os.path.isfile(src_file)

        factory = KioskPhysicalFileFactory(sync.type_repository,
                                           priority_func=None)

        handlers = factory.get(src_file, representation)
        assert not handlers

        factory = KioskPhysicalFileFactory(sync.type_repository,
                                           priority_func=None,
                                           plugin_loader=sync)

        handlers = factory.get(src_file, representation)
        assert handlers
        assert len(handlers) == 3
        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowFile"
        handler = handlers[1]
        assert handler.__name__ == "KioskPhysicalHeicFile"
        handler = handlers[2]
        assert handler.__name__ == "KioskPhysicalWebPFile"

        done = False
        for h_class in handlers:
            h: KioskPhysicalFile = h_class(src_file)

            rc = h.convert_to(representation=representation,
                              target_path=shared_datadir,
                              target_filename_without_extension=os.path.basename(dst_file))
            logging.debug(f"{h.__class__.__name__} returned {rc}")
            done = done or rc

        assert done

    def test_auto_format(self, sync, shared_datadir):
        assert sync.load_plugins(["heicfilehandling"])

        factory = KioskPhysicalFileFactory(sync.type_repository, None)

        # src file is a heic!
        src_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg")
        dst_file = os.path.join(shared_datadir, "e4", "e44d93b0-c2f7-4a1c-8686-1e3292277999.jpg AM_now_a_jpg.jpg")
        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "OCX"}
        representation.dest_format = None

        assert os.path.isfile(src_file)
        handlers = factory.get(src_file, representation)
        assert not handlers

        representation = KioskRepresentationType("jpg")
        representation.format_request = {"HEIC": "JPEG"}

        assert os.path.isfile(src_file)
        handlers = factory.get(src_file, representation)
        assert handlers
        assert len(handlers) == 1

        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalHeicFile"

        representation = KioskRepresentationType("jpg")
        representation.format_request = {"*": "JPEG", "HEIC": "JPEG"}

        assert os.path.isfile(src_file)
        handlers = factory.get(src_file, representation)
        assert handlers
        assert len(handlers) == 2

        handler = handlers[0]
        assert handler.__name__ == "KioskPhysicalPillowFile"
        handler = handlers[1]
        assert handler.__name__ == "KioskPhysicalHeicFile"

        done = False
        for h_class in handlers:
            h: KioskPhysicalFile = h_class(src_file)

            rc = h.convert_to(representation=representation,
                              target_filename_without_extension=os.path.basename(dst_file),
                              target_path=shared_datadir)
            logging.debug(f"{h.__class__.__name__} returned {rc}")
            done = done or rc

        assert done
