import os

import pytest
import logging

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper

from fts.ftsdsd import FTSDSD

test_path = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFTSDSD(KioskPyTestHelper):

    @pytest.fixture(scope="function")
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file="test_kiosk_config.yml")

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="function")
    def dsd(self, cfg):
        Dsd3Singleton.release_dsd3()
        return self.get_dsd(cfg)

    def test_init(self, dsd):
        fts_dsd = FTSDSD(dsd)
        assert fts_dsd

    def test_fts_dsd(self, dsd):
        fts_dsd = FTSDSD(dsd).dsd
        assert "fts" in fts_dsd.list_fields("locus")
        assert "fts" not in fts_dsd.list_fields("kiosk_user")
