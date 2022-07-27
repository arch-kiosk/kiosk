import datetime
import logging
import time
import uuid
import os

import pytest

from test.testhelpers import KioskPyTestHelper
from kiosklogger import KioskLogger

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskLogger(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        config = self.get_config(config_file, log_file=log_file)
        return config

    def test_kiosk_logger(self, config):
        with KioskLogger(log_level=logging.WARNING) as kiosk_logger:
            logging.error("blubber")
        assert kiosk_logger.get_log() == ["ERROR: blubber"]

        with KioskLogger(log_level=logging.WARNING) as kiosk_logger:
            logging.error("blubber")
        logging.error("blubber 2")
        assert kiosk_logger.get_log() == ["ERROR: blubber"]

        kiosk_logger = KioskLogger(log_level=logging.WARNING)
        kiosk_logger.install_log_handler()
        logging.error("blubber")
        logging.warning("blubber 2")
        logging.debug("blubber 3")
        kiosk_logger.uninstall_log_handler()
        assert kiosk_logger.get_log() == ["ERROR: blubber", "WARNING: blubber 2"]
