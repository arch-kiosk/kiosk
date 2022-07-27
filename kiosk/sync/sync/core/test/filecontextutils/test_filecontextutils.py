import pytest
import tempfile
import os
import logging
import datetime

import kioskstdlib
from collections import namedtuple
from filecontextutils import FileContextUtils
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


# @pytest.mark.skip
class TestFileContextUtils(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def fcu(self):
        cfg = self.get_config(config_file=config_file, log_file=log_file)
        assert cfg
        if cfg.get_configfile():
            print("Using configuration in " + cfg.get_configfile())
        else:
            logging.warning("No configuration file given.")

        fcu = FileContextUtils("urap")
        fcu.init_standard_rgx(cfg)
        return fcu

    def test_get_identifier_from_string(self, fcu):
        assert fcu.get_identifier_from_string("  anidentifier a description   ") == "anidentifier"

    def test_get_description_from_string(self, fcu):
        assert fcu.get_description_from_string("  anidentifier a description   ") == "a description"
