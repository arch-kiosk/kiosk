from __future__ import annotations

import copy
from typing import Union
import datetime
import kioskdatetimelib

from tz.kiosktimezones import KioskTimeZones


class KioskTimeZoneInstance:
    """
    A class representing time zone information for an instance of user-tz and recording-tz
    Used to cache and transfer time zone information of a certain pair of time zones
    between systems, classes and methods
    """

    def __init__(self, kiosk_time_zones: KioskTimeZones, recording_tz_index: int = None, user_tz_index: int = None):
        self._kiosk_time_zones = kiosk_time_zones
        self._user_tz_index: int = Union[int | None]
        self._user_tz_iana_name: Union[str | None] = None
        self._user_tz_long_name: Union[str | None] = None

        self._recording_tz_index: Union[int | None] = None
        self._recording_tz_iana_name: Union[str | None] = None
        self._recording_tz_long_name: Union[str | None] = None

        self.recording_tz_index = recording_tz_index
        self.user_tz_index = user_tz_index

    def clone(self) -> KioskTimeZoneInstance:
        """
        :return: a shallow copy of the current instance.
        """
        new_tz = copy.copy(self)
        new_tz._kiosk_time_zones = self._kiosk_time_zones
        return new_tz

    @property
    def recording_tz_index(self):
        return self._recording_tz_index if self._recording_tz_index else self._user_tz_index

    @recording_tz_index.setter
    def recording_tz_index(self, tz_index):
        if tz_index is not None:
            tz_info = self._kiosk_time_zones.get_time_zone_info(tz_index)
            if tz_info:
                self._recording_tz_index = tz_index
                self._recording_tz_iana_name = tz_info[2]
                self._recording_tz_long_name = tz_info[1]
            else:
                raise Exception(f"Can't set recording tz index: There is no Kiosk Time Zone for tz_index {tz_index}")
        else:
            self._recording_tz_index = None
            self._recording_tz_iana_name = None
            self._recording_tz_long_name = None

    @property
    def user_tz_index(self):
        return self._user_tz_index

    @user_tz_index.setter
    def user_tz_index(self, tz_index):
        if tz_index is not None:
            tz_info = self._kiosk_time_zones.get_time_zone_info(tz_index)
            if tz_info:
                self._user_tz_index = tz_index
                self._user_tz_iana_name = tz_info[2]
                self._user_tz_long_name = tz_info[1]
            else:
                raise Exception(f"Can't set user tz index: There is no Kiosk Time Zone for tz_index {tz_index}")

        else:
            self._user_tz_index = None
            self._user_tz_iana_name = None
            self._user_tz_long_name = None

    @property
    def recording_tz_iana_name(self):
        return self._recording_tz_iana_name if self._recording_tz_index else self._user_tz_iana_name

    @property
    def user_tz_iana_name(self):
        return self._user_tz_iana_name

    @property
    def recording_tz_long_name(self):
        return self._recording_tz_long_name if self._recording_tz_index else self._user_tz_long_name

    @property
    def user_tz_long_name(self):
        return self._user_tz_long_name

    def user_dt_to_utc_dt(self, user_dt: Union[datetime.datetime | None]):
        """
        interprets dt as a datetime of the user time zone and returns a utc datetime
        :param user_dt: a datetime in terms of the user time zone
        :return: a utc date time without a time zone part. None if user_dt is not a datetime or None.
        """
        if not user_dt or not isinstance(user_dt, datetime.datetime):
            return user_dt

        dt_from = user_dt.replace(tzinfo=None)
        return kioskdatetimelib.time_zone_ts_to_utc(dt_from, self.user_tz_iana_name)

    def recording_dt_to_utc_dt(self, recording_dt: Union[datetime.datetime | None]):
        """
        interprets dt as a datetime of the recording time zone and returns a utc datetime
        :param recording_dt: a datetime in terms of the recording time zone
        :return: a utc date time without a time zone part. None if recording_dt is not a datetime or None.
        """
        if not recording_dt or not isinstance(recording_dt, datetime.datetime):
            return recording_dt

        dt_from = recording_dt.replace(tzinfo=None)
        return kioskdatetimelib.time_zone_ts_to_utc(dt_from, self.recording_tz_iana_name)

    def utc_dt_to_tz_dt(self, utc_dt: Union[datetime.datetime, None], tz: Union[str | int], drop_ms=True):
        """
        expects utc_dt as a utc datetime and returns that time in terms of the tz_iana_name time zone
        :param utc_dt: a utc datetime (with or without tzinfo)
        :param tz: either the IANA name of the target time zone or a Kiosk tz index
        :param drop_ms: drop the milliseconds from the datetime. That's the default
        :return: new datetime with tzinfo.
        """
        if not utc_dt or not isinstance(utc_dt, datetime.datetime):
            return utc_dt

        if tz is not None and (isinstance(tz, int) or str(tz).isnumeric()):
            tz_info = self._kiosk_time_zones.get_time_zone_info(int(tz))
            if tz_info:
                tz_info = tz_info[2]
            else:
                raise KeyError(f"utc_dt_to_tz_dt wasn't able to get a iana time zone for tz index {tz}")
        else:
            tz_info = tz

        dt_from = utc_dt.replace(tzinfo=None)
        if drop_ms:
            dt_from = dt_from.replace(microsecond=0)

        return kioskdatetimelib.utc_ts_to_timezone_ts(dt_from, tz_info)

    def utc_dt_to_user_dt(self, utc_dt: Union[datetime.datetime, None], drop_ms: bool = True):
        """
        interprets dt as a utc datetime returns a datetime in terms of the user's time zone BUT without a tz_info!
        :param utc_dt: a utc datetime
        :param drop_ms: drop the milliseconds from the datetime. That's the default
        :return: a date time without a time zone part. None if utc_dt is not a datetime or None.
        """
        return self.utc_dt_to_tz_dt(utc_dt, self.user_tz_iana_name, drop_ms=drop_ms)
        # # if not utc_dt or not isinstance(utc_dt, datetime.datetime):
        # #     return utc_dt
        #
        # dt_from = utc_dt.replace(tzinfo=None)
        # return kioskdatetimelib.utc_ts_to_timezone_ts(dt_from, self.user_tz_iana_name)

    def utc_dt_to_recording_dt(self, utc_dt: Union[datetime.datetime, None], drop_ms: bool = True):
        """
        interprets dt as a utc datetime returns a datetime in terms of the recording time zone BUT without a tz_info!

        Note that this is using the user tz if there is no recording tz!

        :param utc_dt: a utc datetime
        :param drop_ms: drop the milliseconds from the datetime. That's the default
        :return: a date time without a time zone part. None if utc_dt is not a datetime or None.
        """
        return self.utc_dt_to_tz_dt(utc_dt, self.recording_tz_iana_name, drop_ms=drop_ms)
        # if not utc_dt or not isinstance(utc_dt, datetime.datetime):
        #     return utc_dt
        #
        # dt_from = utc_dt.replace(tzinfo=None)
        # return kioskdatetimelib.utc_ts_to_timezone_ts(dt_from, self.recording_tz_iana_name)