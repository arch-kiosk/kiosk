from time import sleep

import pytest
from pathlib import Path
import os

from pluggableflaskapp import PluggableFlaskApp
from plugins.filerepositoryplugin.filerepositorylib import get_pagination

from test.testhelpers import KioskPyTestHelper
from kioskappfactory import KioskAppFactory
import kioskglobals
from kiosksqldb import KioskSQLDb

from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
kiosk_root_path = Path(test_path).parent.parent.parent

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileRepositoryLib(KioskPyTestHelper):
    @pytest.fixture(scope='module')
    def cfg(self):
        cfg = self.get_standard_test_config(__file__, test_config_file=config_file)
        return cfg

    @pytest.fixture
    def kiosk_app(self, cfg):
        print(f"config_file: {config_file}, root_path: {kiosk_root_path}")
        cur = self.get_urapdb(cfg)
        cur.close()
        kiosk_app = KioskAppFactory.create_app(config_file, root_path=kiosk_root_path)
        kiosk_app.config["TESTING"] = True
        assert "emergency_mode" not in kiosk_app.config
        KioskSQLDb.truncate_table("kiosk_filemanager_directories")
        yield kiosk_app

    @pytest.fixture
    def test_client(self, kiosk_app):
        with kiosk_app.test_client() as client:
            with kiosk_app.app_context():
                yield client

    def test_get_pagination(self):

        #page 0 of 5
        test_range = [1, 2, 3, 4, 5]

        print(test_range)
        assert get_pagination(0, 5) == test_range

        #page 3 of 5
        test_range = [1, 2, 3, 4, 5]
        print(test_range)
        assert get_pagination(3, 5) == test_range

        #page 5 of 5
        test_range = [1, 2, 3, 4, 5]
        print(test_range)
        assert get_pagination(5, 5) == test_range

        #page 0 of 19
        test_range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19]

        print(test_range)
        assert get_pagination(0, 19) == test_range

        #page 5 of 19
        test_range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19]

        print(test_range)
        assert get_pagination(5, 19) == test_range

        #page 10 of 19
        test_range = [1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19]

        print(test_range)
        assert get_pagination(10, 19) == test_range

        #page 12 of 19
        test_range = [1, 8, 9, 10, 11, 12, 13, 14, 15,16, 17, 19]

        print(test_range)
        assert get_pagination(12, 19) == test_range

        #page 13+ of 19
        test_range = [1, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

        print(test_range)
        for x in [13,19]:
            assert get_pagination(x, 19) == test_range

        #page 13 of 39
        test_range = [1, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 30, 39]

        print(test_range)
        assert get_pagination(13, 39) == test_range

        #page 13 of 49
        test_range = [1, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20,30,40,49]

        print(test_range)
        assert get_pagination(13, 49) == test_range

        #page 27 of 43
        test_range = [1, 2, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 43]

        print(test_range)
        assert get_pagination(27, 43) == test_range

        #page 1 of 1
        test_range = [1]

        print(test_range)
        assert get_pagination(1, 1) == test_range
