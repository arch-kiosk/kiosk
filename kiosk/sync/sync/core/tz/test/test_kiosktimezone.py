import os

import pytest

import datetime

import yaml

import kioskdatetimelib
import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskquerystore import KioskQueryStore
from kioskquery.structuredkioskquery import StructuredKioskQuery
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper
from tz.kiosktimezone import KioskTimeZones

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskTimeZone(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def urapdb_without_migration(self, config):
        return self.get_urapdb(config, migration=False)

    @pytest.fixture(scope="module")
    def dsd(self, urapdb_without_migration):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture(scope="module")
    def tz(self, config, urapdb):
        kiosk_tz = KioskTimeZones()
        kiosk_tz.update_local_kiosk_time_zones(os.path.join(config.base_path, r"tools\tz\kiosk_tz.json"))
        return kiosk_tz

    def test_init(self, tz: KioskTimeZones):
        assert tz.get_time_zone_index("UTC") == 0
        assert tz.get_time_zone_index("Europe/Paris") > 0

    def test_kiosk_timestamp_to_display_timestamp(self, tz: KioskTimeZones):
        utc_ts = datetime.datetime(day=1, month=8, year=2024,
                                   hour=21, minute=00, second=00,
                                   tzinfo=datetime.timezone.utc)
        paris_tz = tz.get_time_zone_index("Europe/Paris")
        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, paris_tz) == (
            datetime.datetime(day=1, month=8, year=2024,
                              hour=23,
                              minute=00,
                              second=00), 1
        )
        london_tz = tz.get_time_zone_index("Europe/London")
        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, london_tz) == (datetime.datetime(day=1, month=8,
                                                                                                year=2024,
                                                                                                hour=22,
                                                                                                minute=00,
                                                                                                second=00), 1)
        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, 0) == (datetime.datetime(day=1, month=8, year=2024,
                                                                                        hour=21,
                                                                                        minute=00,
                                                                                        second=00), 1)

        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, None) == (datetime.datetime(day=1, month=8, year=2024,
                                                                                           hour=21,
                                                                                           minute=00,
                                                                                           second=00), 0)

        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, 0, "Europe/Paris") == (datetime.datetime(day=1, month=8,
                                                                                                        year=2024,
                                                                                                        hour=23,
                                                                                                        minute=00,
                                                                                                        second=00), 2)

        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, 0, paris_tz) == (datetime.datetime(day=1, month=8,
                                                                                                  year=2024,
                                                                                                  hour=23,
                                                                                                  minute=00,
                                                                                                  second=00), 2)

        assert tz.kiosk_timestamp_to_display_timestamp(utc_ts, None, "Europe/Paris") == (datetime.datetime(day=1,
                                                                                                           month=8,
                                                                                                           year=2024,
                                                                                                           hour=21,
                                                                                                           minute=00,
                                                                                                           second=00),
                                                                                         0)
