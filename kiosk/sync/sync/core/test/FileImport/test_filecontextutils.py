import filecontextutils
from custom import default_filecontexts
from test.testhelpers import KioskPyTestHelper
import pytest
import os

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileContextUtils(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def cfg(self):
        config = self.get_config(config_file, log_file=log_file)
        return config

    def test_get_date_from_string(self, cfg):
        fu = filecontextutils.FileContextUtils("test")
        fu.init_standard_rgx(cfg)
        assert fu.get_date_from_string("01.01.2022", "") == (1, 1, 2022)
        assert fu.get_date_from_string("1I22", "") == (1, 1, 2022)
