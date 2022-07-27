import datetime
import kioskstdlib

import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from core.orm.dsdtable import DSDTable
from test.testhelpers import KioskPyTestHelper
from core.qualitycontrol.qcengine import QCEngine
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb
from uuid import UUID, uuid4

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestDSDTable(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def db_with_data(self, config, db):
        KioskSQLDb.run_sql_script(sql_data)
        return db

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture()
    def empty_flags(self, db):
        KioskSQLDb.truncate_table("qc_flags")
        return db

    def test_init(self, dsd, config, db):
        test_uid = str(uuid4())
        table = DSDTable(dsd, "unit")
        table.uid = test_uid
        table.id = 1
        table.name = "my name"
        table.created = datetime.datetime.now()
        table.modified = datetime.datetime.now()
        table.modified_by = "sys"
        table.add(commit=True)

        new_table = DSDTable(dsd, "unit")
        assert new_table.get_one("uid=%s", [test_uid])
        assert new_table.id == 1
        assert new_table.name == "my name"
