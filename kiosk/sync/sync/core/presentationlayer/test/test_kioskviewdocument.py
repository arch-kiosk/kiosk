import os
from io import StringIO, TextIOBase

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from presentationlayer.kioskview import KioskView
from presentationlayer.kioskviewdocument import KioskViewDocument
from presentationlayer.pldloader import PLDLoader
from presentationlayer.presentationlayerdefinition import PresentationLayerDefinition, PLDException
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from uic.uicstream import UICStream, UICKioskFile

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
def_path = os.path.join(test_path, r"def")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


class MockPLDLoader(PLDLoader):
    @classmethod
    def load_pld(cls, pld_name: str, cfg: SyncConfig) -> PresentationLayerDefinition:
        def _filename_resolver(filename: str) -> str:
            return os.path.join(def_path, filename)

        path_and_filename = os.path.join(def_path, pld_name + ".pld")
        pld = PresentationLayerDefinition()
        pld.load(path_and_filename, _filename_resolver)
        return pld


class TestKioskViewDocument(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    @pytest.fixture(scope="module")
    def urapdb(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    @pytest.fixture()
    def uic_tree(self, config):
        uic_stream = UICStream(UICKioskFile.get_file_stream("kiosk_ui_classes.uic"),
                               get_import_stream=UICKioskFile.get_file_stream)
        return uic_stream.tree

    def mock_get_dsd_path(self):
        return def_path

    def mock_load_pld(cls, pld_name: str, cfg: SyncConfig) -> PresentationLayerDefinition:
        def _filename_resolver(filename: str) -> str:
            return os.path.join(def_path, filename)

        path_and_filename = os.path.join(def_path, pld_name + ".pld")
        pld = PresentationLayerDefinition()
        pld.load(path_and_filename, _filename_resolver)
        return pld

    def test_view(self, config, uic_tree, monkeypatch, dsd):
        monkeypatch.setattr(SyncConfig, "get_dsd_path", self.mock_get_dsd_path)

        config._config["glossary"] = {"locus": "context"}
        view = KioskView(config, "test", uic_tree, MockPLDLoader)
        view.record_type = "locus"
        view.identifier_field = "arch_context"
        view.identifier = "CC-001"
        result = view.render()
        assert result["locus.sheet"]["layout_settings"]["ui_elements"]["arch_context"]["element_type"][
                   "text"] == "context"
        assert result == {'compilation': {'groups': {'group_1': {'parts': {'locus.sheet': {'layout': 'locus.sheet',
                                                                                           'position': 1,
                                                                                           'text': 'locus '
                                                                                                   '${arch_context}'}},
                                                                 'type': 'single'}},
                                          'name': 'locus view',
                                          'record_type': 'locus'},
                          'locus.sheet': {'dsd_view': 'dsd_view_kiosk_view.yml',
                                          'fields_selection': 'view',
                                          'layout_settings': {'orchestration_strategy': 'grid',
                                                              'ui_elements': {'arch_context': {
                                                                  'element_type': {'isIdentifier': 'True',
                                                                                   'name': 'TextField',
                                                                                   'text': 'context'},
                                                                  'layout': {'min-height': 1,
                                                                             'min-width': 1}}}},
                                          'record_type': 'locus',
                                          'view_type': 'sheet'}}

    def test_compile(self, config, uic_tree, monkeypatch, dsd, urapdb_with_records):
        monkeypatch.setattr(SyncConfig, "get_dsd_path", self.mock_get_dsd_path)
        monkeypatch.setattr(PLDLoader, "load_pld", self.mock_load_pld)

        config._config["glossary"] = {"locus": "context"}

        assert Dsd3Singleton.get_dsd3()
        doc = KioskViewDocument("locus", "test", "CC-001")
        result = doc.compile()
        assert "kioskview.header" in result
        assert result["kioskview.header"] == {"version": 1}
        assert "compilation" in result
        assert "kioskview.data" in result
        assert "kioskview.dsd" in result
        assert list(result["kioskview.dsd"].keys()) == ["locus"]
        assert "locus.sheet" in result
        # assert result == {}
