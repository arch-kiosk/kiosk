import os
import zoneinfo
from pprint import pprint
from typing import Tuple, List, Set
from babel import dates
import re
import hashlib


class KioskTimeZones:
    def __init__(self, iana_backward_file: str):
        self.iana_backward_file = iana_backward_file
        self.deprecated_aliases: Set = set()

    def read_deprecated_aliases(self) -> Set[str]:
        """
        Reads and extracts deprecated aliases from the 'backward' IANA file given in the constructor.
        The backward file is part of the IANA's database at https://www.iana.org/time-zones. Just download
        the data only distribution and fish the backward file out of the archive.
        Usually Kiosk keeps that file under tools\tz

        :return: A set of deprecated aliases extracted from the file.
        """
        if not self.deprecated_aliases:
            if not self.iana_backward_file:
                raise Exception(f"read_deprecated_aliases needs path and filename of the 'backward' IANA file.")
            if not os.path.isfile(self.iana_backward_file):
                raise Exception(f"the file {self.iana_backward_file} does not exist")
            with open("backward", "r") as fp:
                for line_full in fp:
                    line = line_full.strip()
                    if not line.startswith("Link\t"):
                        continue
                    result = re.split("\t+", line, maxsplit=3)
                    _link, _dest, source, *_ = result
                    self.deprecated_aliases.add(source)

        return self.deprecated_aliases

    def generate_time_zones(self) -> List[Tuple[int, str, str, bool]]:
        """
        Generate and list all available time zones with their human-readable names and full names.

        :return: A list of tuples containing a stable integer hash (not random), human-readable name,
                  IANA time zone name and a deprecation flag for each time zone.

                  Note that the hash is not necessarily, but most likely unique,
                  show the human-readable name but use the IANA time zone name

        :raises all kinds of exceptions
        """

        tz_array: List[Tuple[int, str, str, bool]] = []
        self.read_deprecated_aliases()

        for tz in zoneinfo.available_timezones():
            deprecated = tz not in self.deprecated_aliases
            try:
                tz_human = dates.get_timezone_name(dt_or_tzinfo=dates.get_timezone(tz), locale="en_US")
                if tz_human.find("Unknown Region") == -1:
                    tz_full = f"{tz_human} ({tz.replace('_', ' ')})"
                    tz_array.append(
                        (int(hashlib.md5(tz_full.encode("utf-8"), usedforsecurity=False).hexdigest(), 16),
                         tz_full,
                         tz,
                         deprecated))
            except BaseException as e:
                tz_array.append(
                    (int(hashlib.md5(tz.encode("utf-8"), usedforsecurity=False).hexdigest(), 16),
                     tz,
                     tz,
                     deprecated))
        return tz_array


