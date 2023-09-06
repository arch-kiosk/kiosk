import os
from io import StringIO, TextIOBase

import pytest

from presentationlayer.kioskview import KioskView
from presentationlayer.pldloader import PLDLoader
from presentationlayer.presentationlayerdefinition import PresentationLayerDefinition, PLDException
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from uic.uicstream import UICStream, UICKioskFile

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
def_path = os.path.join(test_path, r"def")


class MockPLDLoader(PLDLoader):
    @classmethod
    def load_pld(cls, pld_name: str, cfg: SyncConfig) -> PresentationLayerDefinition:
        def _filename_resolver(filename: str) -> str:
            return os.path.join(def_path, filename)

        path_and_filename = os.path.join(def_path, pld_name + ".pld")
        pld = PresentationLayerDefinition()
        pld.load(path_and_filename, _filename_resolver)
        return pld


class TestKioskView(KioskPyTestHelper):
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

    def test_init(self, config, uic_tree, monkeypatch, dsd):
        monkeypatch.setattr(SyncConfig, "get_dsd_path", self.mock_get_dsd_path)
        config._config["glossary"] = {"locus": "context"}
        view = KioskView(config, "test", uic_tree, MockPLDLoader)
        view.record_type = "locus"
        view.identifier_field = "arch_context"
        view.identifier = "CC-001"
        result = view.render()
        assert result["locus.sheet"]["layout_settings"]["ui_elements"]["arch_context"]["element_type"][
                   "text"] == "context"
        assert result == {}
