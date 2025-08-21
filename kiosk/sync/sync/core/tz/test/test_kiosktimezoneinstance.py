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
from tz.kiosktimezones import KioskTimeZones
from tz.kiosktimezoneinstance import KioskTimeZoneInstance

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskTimeZoneInstance(KioskPyTestHelper):
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

    @pytest.fixture()
    def mock_kiosk_time_zones(self, mocker):
        mocker.patch.object(KioskTimeZones, "get_time_zone_info",
                            lambda _, tz_index: {
                                None: None,
                                96554373: [96554373, 'Central European Time (Europe/Berlin)',
                                           'Europe/Berlin', True,
                                           1720205986],
                                27743346: [27743346, 'Mountain Time (US/Mountain)',
                                           'US/Mountain', False, 1720205986
                                           ],
                            }[tz_index])
        return mocker

    def test_init(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        assert not kti.user_tz_iana_name
        assert not kti.user_tz_long_name

        kti.user_tz_index = 96554373
        assert kti.user_tz_iana_name == "Europe/Berlin"
        kti.user_tz_index = 27743346
        assert kti.user_tz_iana_name == "US/Mountain"

        kti.user_tz_index = 96554373
        assert kti.user_tz_iana_name == "Europe/Berlin"


    def test_user_dt_to_utc_dt(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        kti.user_tz_index = 96554373
        dt = None
        assert kti.user_dt_to_utc_dt(dt) is None
        dt = datetime.datetime.fromisoformat("20240819T15:00:00")
        assert kti.user_dt_to_utc_dt(dt) == datetime.datetime.fromisoformat("20240819T13:00:00")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00Z")
        assert kti.user_dt_to_utc_dt(dt) == datetime.datetime.fromisoformat("20240819T13:00:00")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00+02")
        assert kti.user_dt_to_utc_dt(dt) == datetime.datetime.fromisoformat("20240819T13:00:00")

    def test_utc_dt_to_user_dt(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        kti.user_tz_index = 27743346  # Mountain time
        dt = None
        assert kti.utc_dt_to_user_dt(dt) is None
        dt = datetime.datetime.fromisoformat("20240819T15:00:00")
        assert kti.utc_dt_to_user_dt(dt) == datetime.datetime.fromisoformat("20240819T09:00:00")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00Z")
        assert kti.utc_dt_to_user_dt(dt) == datetime.datetime.fromisoformat("20240819T09:00:00")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00+02")
        assert kti.utc_dt_to_user_dt(dt) == datetime.datetime.fromisoformat("20240819T09:00:00")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00,500")
        assert kti.utc_dt_to_user_dt(dt) == datetime.datetime.fromisoformat("20240819T09:00:00,500")
        dt = datetime.datetime.fromisoformat("20240819T15:00:00,500")
        assert kti.utc_dt_to_user_dt(dt, drop_ms=True) == datetime.datetime.fromisoformat("20240819T09:00:00")

    def test_utc_dt_to_tz_dt(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        dt = None
        assert kti.utc_dt_to_tz_dt(dt, 27743346) is None
        dt = datetime.datetime.fromisoformat("20240819T15:00:00")
        with pytest.raises(Exception):
            kti.utc_dt_to_tz_dt(dt, 123)
        assert kti.utc_dt_to_tz_dt(dt, 27743346) == datetime.datetime.fromisoformat("20240819T09:00:00")


    def test_clone(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        kti.user_tz_index = 96554373
        assert kti.user_tz_iana_name == "Europe/Berlin"
        kti2 = kti.clone()
        assert kti2.user_tz_iana_name == "Europe/Berlin"
        kti2.user_tz_index = None
        assert kti.user_tz_iana_name == "Europe/Berlin"

        kti2.user_tz_index = 27743346
        assert kti2.user_tz_iana_name == "US/Mountain"

    def test_get_tz_offset(self, mock_kiosk_time_zones):
        kti = KioskTimeZoneInstance(KioskTimeZones())
        kti.user_tz_index = 96554373
        assert kti.user_tz_iana_name == "Europe/Berlin"
        assert kti.get_tz_offset(datetime.datetime.fromisoformat("20240801T00:00:00+00")) == "02:00:00"

        kti.user_tz_index = 27743346
        assert kti.user_tz_iana_name == "US/Mountain"
        assert kti.get_tz_offset(datetime.datetime.fromisoformat("20240801T00:00:00+00")) == "-06:00:00"
