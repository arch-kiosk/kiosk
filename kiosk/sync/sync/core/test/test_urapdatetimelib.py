import pytest
import urapdatetimelib
import datetime
import time

import zoneinfo


class TestDateTimeLib:
    def test_latin_date(self):
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=1, year=2021), no_time=True) == "01.I.2021"
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=12, year=2021), no_time=True) == "01.XII.2021"

    def test_check_urap_date_time(self):
        assert urapdatetimelib.check_urap_date_time(
            "01.03.2023",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=0, minute=0, second=0), '')
        assert urapdatetimelib.check_urap_date_time(
            "01.III.2023",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=0, minute=0, second=0), '')
        assert urapdatetimelib.check_urap_date_time(
            "01 III 2023",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=0, minute=0, second=0), '')

        assert urapdatetimelib.check_urap_date_time(
            "01 III 2023 12:10:23",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=12, minute=10, second=23), '')
        assert urapdatetimelib.check_urap_date_time(
            "01.III.2023 12:10:23",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=12, minute=10, second=23), '')

        assert urapdatetimelib.check_urap_date_time(
            "01.03.2023 12:10:23",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=12, minute=10, second=23), '')

        assert urapdatetimelib.check_urap_date_time(
            "1 III 23 12:10:23",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=12, minute=10, second=23), '')

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
