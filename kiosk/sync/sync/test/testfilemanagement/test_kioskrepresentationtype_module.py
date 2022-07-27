from collections import OrderedDict

import pytest
import tempfile
import os
import logging

from dsd.dsd3singleton import Dsd3Singleton
from sync_config import SyncConfig
from uuid import uuid4

from kioskrepresentationtype import KioskRepresentationType, \
    KioskRepresentations, KioskRepresentationTypeDimensions
from test.testhelpers import KioskPyTestHelper


class TestRepresentationTypeModule(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file="config_kiosk_imagemanagement.yml")

    def test_init_kioskrepresentations(self, cfg):
        config = KioskRepresentations._get_file_repository_config()
        assert "auto_representations" in config
        assert "small" in config["auto_representations"]
        assert "medium" in config["auto_representations"]

    def test_get_representation_info_from_config(self, cfg):
        info = KioskRepresentations.get_representation_info_from_config("small")
        assert info
        assert info["format_request"] == {"*": "!", "NEF": "JPEG", "HEIC": "JPEG"}
        assert info["dimensions"] == "128,128"

        dimensions = KioskRepresentations.get_dimensions_from_representation_info(info)
        assert dimensions
        assert dimensions.width == 128
        assert dimensions.height == 128

    def test_instantiate_representation(self, cfg):
        representation: KioskRepresentationType = \
            KioskRepresentations.instantiate_representation_from_config("master")
        assert representation
        assert representation.dimensions.width == 4000
        assert representation.dimensions.height == 2000
        assert representation.format_request == KioskRepresentations.get_standard_format_request("default")

    def test_get_ordered_representation_ids(self, cfg, monkeypatch):
        unorderd_ids = OrderedDict()

        def unordered_ids(cfg=None):
            return list(unorderd_ids.keys())

        def inherits(cfg=None, _id=""):
            try:
                return unorderd_ids[_id]
            except KeyError:
                return ""

        monkeypatch.setattr(KioskRepresentations, "get_representation_ids", unordered_ids)
        monkeypatch.setattr(KioskRepresentations, "_inherits", inherits)

        unorderd_ids = {"C": "", "B": "C"}

        assert KioskRepresentations.get_representation_ids() == ["C", "B"]
        assert not KioskRepresentations._inherits(None, "C")
        assert KioskRepresentations._inherits(None, "B") == "C"

        unorderd_ids = {"G": "F", "E": "G", "F": "A", "A": ""}
        assert KioskRepresentations.get_representation_ids() == ["G", "E", "F", "A"]

        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"F": "A", "E": "G", "A": "", "G": "F"}
        assert KioskRepresentations.get_representation_ids() == ["F", "E", "A", "G"]

        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"F": "A", "E": "G", "G": "F", "A": ""}  # F, E, G, A
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"F": "A", "G": "F", "E": "G", "A": ""}  # F, G, E, A
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"G": "F", "E": "G", "A": "", "F": "A"}  # G, E, A, F
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"E": "G", "A": "", "F": "A", "G": "F"}  # E, A, F, G
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"A": "", "F": "A", "G": "F", "E": "G"}  # A, F, G, E
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"E": "G", "G": "F", "F": "A", "A": ""}  # E, G, F, A
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "F", "G", "E"]

        unorderd_ids = {"E": "", "G": "", "F": "", "A": "E"}  # E=>, G=>, F=>, A=>E
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["E", "G", "F", "A"]

        unorderd_ids = {"E": "A", "G": "", "F": "", "A": ""}  # E=>A, G=>, F=>, A=>""
        ordered_ids = KioskRepresentations.get_ordered_representation_ids()
        assert ordered_ids == ["A", "G", "F", "E"]

        unorderd_ids = {"E": "A", "G": "", "F": "", "A": ""}  # E=>A, G=>, F=>, A=>""
        ordered_ids = KioskRepresentations.get_ordered_representation_ids( \
            filter_by_representation_ids=["E", "F"])
        assert ordered_ids == ["A", "F", "E"]

        unorderd_ids = {"E": "A", "G": "", "F": "", "A": ""}  # E=>A, G=>, F=>, A=>""
        ordered_ids = KioskRepresentations.get_ordered_representation_ids( \
            filter_by_representation_ids=["E"])
        assert ordered_ids == ["A", "E"]

        unorderd_ids = {"E": "A", "G": "", "F": "", "A": ""}  # E=>A, G=>, F=>, A=>""
        ordered_ids = KioskRepresentations.get_ordered_representation_ids( \
            filter_by_representation_ids=["A"])
        assert ordered_ids == ["A"]

        unorderd_ids = {"E": "A", "G": "E", "F": "G", "A": ""}  # E=>A, G=>, F=>, A=>""
        ordered_ids = KioskRepresentations.get_ordered_representation_ids( \
            filter_by_representation_ids=["F"])
        assert ordered_ids == ["A", "E", "G", "F"]

    def test_get_ordered_representation_ids_no_mock(self, cfg):
        assert KioskRepresentations.get_representation_ids() == ["small", "medium", "master", "fix_rotation",
                                                                 "master_1", "master_2", "many_masters"]
        assert KioskRepresentations.get_ordered_representation_ids()[0] == "master"
        auto_representations = KioskRepresentations._get_auto_representations()
        assert set(auto_representations) == set(["medium", "small"])
        assert set(KioskRepresentations.get_ordered_representation_ids(auto_representations)) == set(
            ["master", "small", "medium"])
        assert KioskRepresentations.get_ordered_representation_ids(auto_representations)[0] == "master"
        assert set(["master", "medium", "small"]) == set(KioskRepresentations.get_auto_representations())
        assert KioskRepresentations.get_auto_representations()[0] == "master"
