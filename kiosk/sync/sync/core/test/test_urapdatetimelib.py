import pytest
import urapdatetimelib
import datetime
import time

import zoneinfo


class TestDateTimeLib:
    def test_latin_date(self):
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=1, year=2021), no_time=True) == "01.I.2021"
        assert urapdatetimelib.latin_date(datetime.datetime(day=1, month=12, year=2021), no_time=True) == "01.XII.2021"

    def test_guess_latin_date(self):
        okay_tests = [
            ("01 I 2023", "2023-01-01"),
            ("01.I.2023", "2023-01-01"),
            ("01I2023", "2023-01-01"),
            ("1 I 2023", "2023-01-01"),
            ("1.I.2023", "2023-01-01"),
            ("1I2023", "2023-01-01"),
            ("31 XII 2023", "2023-12-31"),
            ("31.XII.2023", "2023-12-31"),
            ("31XII2023", "2023-12-31"),
            ("31 XII 23", "2023-12-31"),
            ("31.XII.23", "2023-12-31"),
            ("31XII23", "2023-12-31"),
            ("31 XII 73", "1973-12-31"),
            ("31.XII.73", "1973-12-31"),
            ("31XII73", "1973-12-31"),
            ("28I73", "1973-01-28"),
            ("28II73", "1973-02-28"),
            ("28III73", "1973-03-28"),
            ("28IV73", "1973-04-28"),
            ("28V73", "1973-05-28"),
            ("28VI73", "1973-06-28"),
            ("28VII73", "1973-07-28"),
            ("28VIII73", "1973-08-28"),
            ("28IX73", "1973-09-28"),
            ("28X73", "1973-10-28"),
            ("28XI73", "1973-11-28"),
            ("28XII73", "1973-12-28"),
        ]
        for test in okay_tests:
            assert urapdatetimelib.guess_latin_date(test[0]) == test[1], f"error testing {test[0]}"

        not_okay_tests = [
            "I 2023",
            "XII 2023",
        ]
        for test in not_okay_tests:
            assert urapdatetimelib.guess_latin_date(test) == "", (f"error testing"
                                                                  f" {test[0]}: Should not have returned anything!")

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
        assert urapdatetimelib.check_urap_date_time(
            "1III23",
            allow_date_only=True) == (datetime.datetime(day=1, month=3, year=2023,
                                                        hour=0, minute=0, second=0), '')
        assert urapdatetimelib.check_urap_date_time(
            "1XIII23",
            allow_date_only=True) == (None, '1XIII23 is not a valid date and time')

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

    def test_interpolate_year(self):
        current_year = datetime.datetime.now().year - 2000
        assert urapdatetimelib.interpolate_year(1900) == 1900
        assert urapdatetimelib.interpolate_year(00) == 2000
        assert urapdatetimelib.interpolate_year(current_year) == current_year + 2000
        assert urapdatetimelib.interpolate_year(current_year+1) == current_year + 2000+1
        assert urapdatetimelib.interpolate_year(current_year+2) == current_year + 2000+2
        assert urapdatetimelib.interpolate_year(current_year+3) == current_year + 2000+3
        assert urapdatetimelib.interpolate_year(current_year+4) == current_year + 1900+4
        assert urapdatetimelib.interpolate_year(current_year+4+2000) == current_year+4+2000
