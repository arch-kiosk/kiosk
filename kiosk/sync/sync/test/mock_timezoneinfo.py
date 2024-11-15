# time zone relevant
import pytest

from tz.kiosktimezones import KioskTimeZones


@pytest.fixture()
def mock_kiosk_time_zones(mocker):
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
    mocker.patch.object(KioskTimeZones, "get_time_zone_index",
                        lambda _, iana_name: {
                            'Europe/Berlin': 96554373,
                            'US/Mountain': 27743346,
                            # 'America/New_York': 40079121
                        }[iana_name])
    return mocker
