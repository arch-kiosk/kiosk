import pytest
import urapdatetimelib
import datetime
import time

import zoneinfo

class TestDateTimeLib:
    def test_latin_date(self):
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=1, year=2021), no_time=True) == "01.I.2021"
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=12, year=2021), no_time=True) == "01.XII.2021"

    def test_local_datetime_to_utc(self):
        test_array = [
            (
                datetime.datetime(day=1, month=1, year=2021, hour=23, minute=12, second=10,
                                  tzinfo=zoneinfo.ZoneInfo("US/Eastern")),
                datetime.datetime(day=2, month=1, year=2021, hour=4, minute=12, second=10,
                                  tzinfo=datetime.timezone.utc)
            ),
            (
                datetime.datetime(day=31, month=12, year=2020, hour=23, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("US/Eastern")),
                datetime.datetime(day=1, month=1, year=2021, hour=4, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc)
            ),
            (
                datetime.datetime(day=1, month=1, year=2021, hour=23, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("Europe/Paris")),
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc),
            ),
            (
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("Europe/London")),
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc),
            )
        ]
        for t in test_array:
            d1 = urapdatetimelib.local_datetime_to_utc(t[0])
            d2 = t[1]
            if urapdatetimelib.utc_datetime_since_epoch(d1) != urapdatetimelib.utc_datetime_since_epoch(d2):
                assert False, f"{d1} != {d2}"

    def test_utc_to_local_datetime(self):
        test_array = [
            (
                datetime.datetime(day=2, month=1, year=2021, hour=4, minute=12, second=10,
                                  tzinfo=datetime.timezone.utc),
                datetime.datetime(day=1, month=1, year=2021, hour=23, minute=12, second=10,
                                  tzinfo=zoneinfo.ZoneInfo("US/Eastern")),

            ),
            (
                datetime.datetime(day=1, month=1, year=2021, hour=4, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc),
                datetime.datetime(day=31, month=12, year=2020, hour=23, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("US/Eastern")),
            ),
            (
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc),
                datetime.datetime(day=1, month=1, year=2021, hour=23, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("Europe/Paris")),
            ),
            (
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=datetime.timezone.utc),
                datetime.datetime(day=1, month=1, year=2021, hour=22, minute=59, second=59,
                                  tzinfo=zoneinfo.ZoneInfo("Europe/London")),
            )
        ]
        for t in test_array:
            d1 = urapdatetimelib.utc_to_local_datetime(t[0])
            d2 = t[1].astimezone()
            if d1 != d2:
                assert False, f"{d1} != {d2}"

    def test_js_to_python_utc_datetime_str(self):
        assert urapdatetimelib.js_to_python_utc_datetime_str("2021-01-15T02:40:40.655Z") == "2021-01-15T02:40:40.655+00:00"

