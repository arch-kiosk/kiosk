import kioskstdlib
import re
from kiosksqldb import KioskSQLDb
import datetime
import logging
import os


class FileContextUtils:
    STRING2DATE_RGX = {}
    STRING2IDENTIFIER_RGX = {}

    def __init__(self, project_id):
        self.project_id = project_id

    def register_string2date_rgx(self, keyname, expression):
        rgx = re.compile(expression)
        if rgx:
            self.STRING2DATE_RGX[keyname] = rgx

    def register_string2identifier_rgx(self, keyname, expression):
        rgx = re.compile(expression)
        if rgx:
            self.STRING2IDENTIFIER_RGX[keyname] = rgx

    def get_string2date_rgx(self, keyname):
        if keyname in self.STRING2DATE_RGX:
            return self.STRING2DATE_RGX[keyname]
        else:
            return None

    def get_string2identifier_rgx(self, keyname):
        if keyname in self.STRING2IDENTIFIER_RGX:
            return self.STRING2IDENTIFIER_RGX[keyname]
        else:
            return None

    def init_standard_rgx(self, cfg):
        """
        loads the custom specific module that registers regex strings or tries a fall back module
        :param cfg: a SyncConfig object
        """
        custom_contexts = kioskstdlib.load_custom_module(cfg, "filecontexts",
                                                         subsystem="SYNC",
                                                         method="PREFIX", fallback=True)
        if custom_contexts:
            custom_contexts.register_custom_rgx(self)
            rgx_list = [r for r in list(self.STRING2IDENTIFIER_RGX.values())]
            for r in rgx_list:
                logging.debug(f"filecontextutils.init_standard_rgx: Using regex '{r}'")
        else:
            raise ModuleNotFoundError("init_standard_rgx: Could not load custom filecontexts module")

    def get_identifier_from_string(self, string, regex_patterns=""):
        """
        extracts the identifier from a string
        :param string: the string
        :param regex_patterns: a list of STRING2IDENTIFIER ids to be used. If empty ALL STRING2IDENTIFIER
                                patterns will be used to separate an identifier.
        :returns: the identifier or an empty string

        """
        if regex_patterns:
            rgx_list = [self.get_string2identifier_rgx(r) for r in regex_patterns if
                        r in self.STRING2IDENTIFIER_RGX]
        else:
            rgx_list = [r for r in list(self.STRING2IDENTIFIER_RGX.values())]

        identifier = ""
        if rgx_list:
            for r in rgx_list:
                r_result = re.match(r, string)
                if r_result:
                    identifier = kioskstdlib.get_regex_group_or_default(r_result, "identifier", None)
                    if identifier:
                        break

        return identifier

    def get_description_from_string(self, string):
        """
        searches for a description in the string using the STRING2IDENTIFIER regex patterns.
        :param string: the string to process
        :return: the description (or an empty string)
        """
        description = ""

        rgx_list = [r for r in list(self.STRING2IDENTIFIER_RGX.values())]

        if rgx_list:
            for r in rgx_list:
                r_result = re.match(r, string)
                if r_result:
                    description = kioskstdlib.get_regex_group_or_default(r_result, "description", None)
                    if description:
                        break
        return description

    def get_date_from_string(self, current_dir, regex_patterns):
        latin_numbers = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10,
                         "XI": 11, "XII": 12}
        rgx_list = []
        if regex_patterns:
            rgx_list = [self.get_string2date_rgx(r) for r in regex_patterns if r in self.STRING2DATE_RGX]
        else:
            rgx_list = [r for r in list(self.STRING2DATE_RGX.values())]

        if rgx_list:
            for r in rgx_list:
                try:
                    r_result = re.match(r, current_dir)
                    if r_result:
                        if kioskstdlib.get_regex_group_or_default(r_result, "guess", ""):
                            guessed_date = kioskstdlib.guess_datetime(current_dir)
                            if guessed_date:
                                return guessed_date.day, guessed_date.month, guessed_date.year
                        else:
                            m = kioskstdlib.get_regex_group_or_default(r_result, "month", 0)
                            if str(m) in latin_numbers:
                                m = latin_numbers[m]
                            else:
                                m = int(m)
                            d = int(kioskstdlib.get_regex_group_or_default(r_result, "day", 0))
                            y = int(kioskstdlib.get_regex_group_or_default(r_result, "year", 0))
                            return d, m, y
                except BaseException as e:
                    logging.debug(f"{self.__class__.__name__}._get_date_from_string: non critical exception: {repr(e)}")

        return 0, 0, 0

    def get_date_from_file(self, filename):
        """
        uses the earliest date (modification / creation date) of the file as it is reported by
        the operating system.

        :param filename: path and filename
        :return: datetime.datetime

        """
        ts = None
        try:
            ts = kioskstdlib.get_earliest_date_from_file(filename)
        except Exception as e:
            logging.error(f"FileContextUtils.get_date_from_file: Non fatal exception with file {filename}: {repr(e)}")

        return ts
