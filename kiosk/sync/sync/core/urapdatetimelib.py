import datetime
import time
import logging
import re

latin_months = {"I": "01", "II": "02", "III": "03", "IV": "04", "V": "05", "VI": "06",
                "VII": "07", "VIII": "08", "IX": "09", "X": "10", "XI": "11", "XII": "12"}

arabic_month_to_latin = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]


def latin_date(ts, no_time=False):
    """generates a string representation of the given timestamp (string or datetime.datetime) in the
    format DD.XX.YYYY HH:MM:SS with XX being the latin transcription of the month

    """
    if not ts:
        return ""

    try:
        if type(ts) is not datetime.datetime:
            ts = check_urap_date_time(ts, True)
    except Exception as e:
        logging.error("Exception in latin_date with date {} {}" % [ts, repr(e)])
        return ""

    latin_month = arabic_month_to_latin[ts.month - 1]
    if no_time:
        s = ts.strftime("%d." + latin_month + ".%Y")
    else:
        s = ts.strftime("%d." + latin_month + ".%Y %H:%M:%S")
    return s


def check_urap_date_time(str_ts, allow_date_only=False) -> tuple:
    """checks whether or not str_ts contains a valid date/time statement.
       If allow_date_only is False, the time part is expected.

       function returns (a datetimestamp, "") if the date_str is valid. Otherwise None, message

    ..note:

        a valid urap date is either in the format YYYY-MM-DD TT:MM:SS or in the format
        DD.MM.YYYY TT:MM:SS, with MM being a latin month.
        If it is latin months, MM is actually M or MM.
        Time, if needed at all, may or may not have seconds.

    """
    ts_date = None

    ts_parts = str_ts.rsplit(" ", 1)
    if (len(ts_parts) < 2) and (not allow_date_only):
        return None, "Date and time are expected in the format MM.DD.YYYY HH:MM:SS"

    date_part = ts_parts[0].strip()

    rx_latin_date = re.compile(r"^(?P<day>\d{2}).(?P<latin_month>[IVX]{1,4}).(?P<year>\d{4})$")
    p = rx_latin_date.match(date_part)
    if not p:
        rx_latin_date = re.compile(r"^(?P<day>\d{2}) (?P<latin_month>[IVX]{1,4}) (?P<year>\d{4})$")
        p = rx_latin_date.match(date_part)
    if p:
        latin_month = p.group("latin_month")
        if latin_month and latin_month in latin_months:
            date_part = "%s-%s-%s" % (p.group("year"), latin_months[latin_month], p.group("day"))

    rx_german_date = re.compile(r"^(?P<day>\d{1,2})\.(?P<month>\d{1,2})\.(?P<year>\d{4})$")
    p = rx_german_date.match(date_part)
    if p:
        date_part = "%s-%s-%s" % (p.group("year"), p.group("month"), p.group("day"))

    rx_us_date = re.compile(r"^(?P<month>\d{1,2})/(?P<day>\d{1,2})/(?P<year>\d{4})$")
    p = rx_us_date.match(date_part)
    if p:
        date_part = "%s-%s-%s" % (p.group("year"), p.group("month"), p.group("day"))

    if re.match(r"^\d{4}-[01]?\d-\d{2}$", date_part):
        # might be a date in YYYY-MM-DD
        try:
            ts_date = datetime.datetime.strptime(date_part, '%Y-%m-%d')
        except Exception as e:
            logging.info("Exception in check_urap_date_time: " + repr(e))
            # ok, apparently that is not a valid date
            return None, date_part + " is not a valid date in the format YYYY-MM-DD"

    if ts_date:
        if len(ts_parts) == 2:
            time_part = ts_parts[1].strip()
            try:
                ts_time = datetime.time(*time.strptime(time_part, "%H:%M:%S")[3:6])
            except Exception as e:
                logging.info("Exception in check_urap_date_time: " + repr(e))
                try:
                    ts_time = datetime.time(*time.strptime(time_part, "%H:%M")[3:6])
                except Exception as e:
                    logging.info("Exception in check_urap_date_time: " + repr(e))
                    return None, time_part + " is not a valid time in format HH:MM[:SS]"
            ts_date = datetime.datetime.combine(ts_date, ts_time)
    if ts_date:
        return ts_date, ""
    else:
        return ts_date, str_ts + " is not a valid date and time"


def remove_prefix(text, prefix):
    if text.startswith(prefix):
        return text[len(prefix):]
    return text


def guess_datetime(str_datetime):
    """
       Guesses a correct date (and time, if part of it) from the given string.
       returns None or a valid date.

    :param str_datetime: a string with a date or date and time
    :return: None or valid datetime.datetime
    """
    result_date, msg = check_urap_date_time(str_datetime, allow_date_only=True)
    if not result_date:
        return None
    else:
        return result_date


def local_time_offset(t=None):
    """Return offset of local zone from GMT, either at present or at time t."""
    # python2.3 localtime() can't take None
    if t is None:
        t = time.time()
    if time.localtime(t).tm_isdst and time.daylight:
        return int(-time.altzone / 60 / 60)
    else:
        return int(-time.timezone / 60 / 60)


def local_time_offset_str(gmt_time_zone: str = "") -> str:
    """
    :param gmt_time_zone: a string consisting of hour and minute like "12" or "12:00" or "-12:00".
                          "GMT+12:00" is also accepted, as is "UTC+12:00"
    :returns: str of the format {-}00:00:00
    """
    mm = 0
    if gmt_time_zone:
        try:
            gmt_time_zone = gmt_time_zone.upper()
            gmt_time_zone = remove_prefix(gmt_time_zone, "GMT")
            gmt_time_zone = remove_prefix(gmt_time_zone, "UTC")
            gmt_time_zone = remove_prefix(gmt_time_zone, "+")

            tz = gmt_time_zone.split(":")
            hh = int(tz[0])
            if len(tz) > 1:
                mm = int(tz[1])
        except BaseException as e:
            logging.error(f"kioskstdlib.local_time_offset_str : {repr(e)}")
            raise e
    else:
        hh = local_time_offset()
        mm = 0

    # This is somehow necessary because "{:02d}:{:02d}:00" returns -2:00 when the first parameter is -2
    if hh >= 0:
        return "{:02d}:{:02d}:00".format(hh, mm)
    else:
        return "-{:02d}:{:02d}:00".format(hh * -1, mm)


def extend_local_timezone(dt: datetime.datetime):
    """
    adds the local timezone to a datetime if it has not timezone information.

    :param dt:
    :return: the datetime with either its original timezone or the added local timezone
    """
    if not dt.tzinfo:
        return dt.astimezone()
    else:
        return dt


def local_datetime_to_utc(tz_datetime: datetime.datetime):
    """
    returns the utc time for a datetime. If tz_datetime
    does not have a timezone, it will be regarded as local time.

    This might be prone to daylightsaving issues.

    :param tz_datetime: the datetime
    :return: utc datetime
    """
    tz_datetime = extend_local_timezone(tz_datetime)
    utc_datetime = tz_datetime.astimezone(tz=datetime.timezone.utc)
    return utc_datetime


def utc_to_local_datetime(utc_datetime: datetime.datetime):
    """
    returns the local datetime (including timezone) of a utc datetime.

    :param utc_datetime: the utc datetime. Must provide UTC timezone.
    :return: the local time, including the local timezone
    :raises: ValueError if utc_datetime does not have utc timezone
    """
    if not utc_datetime.tzinfo:
        raise ValueError(f"utc_to_local_datetime: {utc_datetime} does not have timezone info.")
    if utc_datetime.tzinfo != datetime.timezone.utc:
        raise ValueError(f"utc_to_local_datetime: {utc_datetime} is not UTC.")
    return utc_datetime.astimezone()


def utc_datetime_since_epoch(dt: datetime.datetime = None):
    """
    returns the milliseconds since epoch for a utc-time or for the current utc time.
    :param dt: if not give, function returns a value based on the current utc datetime
    :return: milliseconds
    """
    if not dt:
        dt = datetime.datetime.now(tz=datetime.timezone.utc)
    if dt.tzinfo != datetime.timezone.utc:
        raise ValueError(f"utc_datetime_since_epoch: {dt} must be in UTC!")
    epoch = datetime.datetime.fromtimestamp(0, tz=datetime.timezone.utc)
    return (dt - epoch).total_seconds() * 1000.0


def js_to_python_utc_datetime_str(utc_datetime_str):
    """
    python does not handle utc-strings ending on "Z". This converts them into
    +00:00 utc strings. Works only if it is sure that the input is in utc time!

    :param utc_datetime_str: A UTC datetime with GMT+00:00
    :return: a python readable UTC datetime.
    """
    if utc_datetime_str[-1] == "Z":
        return str(utc_datetime_str).replace('Z', '+00:00')
    else:
        return utc_datetime_str
