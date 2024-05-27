import os
from io import StringIO, TextIOBase

import pytest

from presentationlayer.kioskview import KioskView
from presentationlayer.pldloader import PLDLoader
from presentationlayer.presentationlayerdefinition import PresentationLayerDefinition, PLDException
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from uic.uicstream import UICStream, UICKioskFile
from unittest.mock import Mock, patch

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
def_path = os.path.join(test_path, r"def")


# Mocking the PresentationLayerDefinition class
class TestPLDLoader(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    @pytest.fixture()
    def uic_tree(self, config):
        uic_stream = UICStream(UICKioskFile.get_file_stream("kiosk_ui_classes.uic"),
                               get_import_stream=UICKioskFile.get_file_stream)
        return uic_stream.tree

    def mock_get_dsd_path(self):
        return def_path

    def test_init(self, config, monkeypatch):
        def new_load_method(self, pld_path_and_filename, filename_resolver):
            self.pld_path_and_filename = pld_path_and_filename

        def patched_isfile(args, **kwargs):
            if "custom" in args and "_cm" in args:
                return True
            return False

        with patch('os.path.isfile', patched_isfile):
            PresentationLayerDefinition.load = new_load_method

            loader = PLDLoader()
            pld = loader.load_pld(pld_name="_cm", cfg=config)
            assert pld.pld_path_and_filename
            assert "custom" in pld.pld_path_and_filename

            pld = loader.load_pld(pld_name="general", cfg=config)
            assert pld.pld_path_and_filename
            assert "custom" not in pld.pld_path_and_filename
