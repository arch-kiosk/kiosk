import datetime
import pprint

import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from sync_plugins.fileexportjsondriver.embeddedjsongenerator import SQL2EmbeddedJSON

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestEmbeddedJsonGenerator(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def dsd(self, config):
        return self.get_dsd(config)

    def test_init(self, config, dsd):
        """
        :todo: Test missing
        :param db:
        """
        gen = SQL2EmbeddedJSON(config, dsd)
        assert gen
        sqls = gen.generate_nested_sqls()
        assert len(sqls) == 4
        pprint.pprint(sqls[0])
        assert sqls == ""
