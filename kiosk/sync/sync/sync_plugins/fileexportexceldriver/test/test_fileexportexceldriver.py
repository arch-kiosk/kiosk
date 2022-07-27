import datetime
import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from sync_plugins.simpleqcengine.pluginsimpleqcengine import SimpleQCEngine, QCError
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileExportExcelDriver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.mark.skip
    def test_init(self, db):
        """
        :todo: Test missing
        :param db:
        """
        assert False, "Todo: Test missing"

