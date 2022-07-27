import logging
import yaml

import kioskstdlib
from kioskstdlib import get_file_extension
from kioskstdlib import str_split_and_trim
from sync_config import SyncConfig


class FileHandlingError(Exception):
    pass


def get_file_handling_set(fh_id: str, cfg=None):
    """
    returns a FileHandlingSet instance with the given file handling rule set loaded.
    does not throw exceptions.

    If there is not File handling set under the given fh_id, but a default_set defined,
    that default file handling set will be returned.

    :param fh_id: the id of the file handling rule set
    :param cfg: optional SyncConfig or KioskConfig instance
    :return: either a FileHandlingSet instance or None in case of an error
    """
    if not cfg:
        cfg = SyncConfig.get_config()
    if cfg:
        try:
            file_handling_sets = FileHandlingSet.list_file_handling_sets(cfg)
            if fh_id in file_handling_sets:
                fh_set = FileHandlingSet(fh_id, cfg)
            else:
                default_set = FileHandlingSet.get_default_set(cfg)
                if default_set:
                    fh_set = FileHandlingSet(default_set, cfg)
                else:
                    raise FileHandlingError(f"No file handling set '{fh_id}' and "
                                            f"no default file handling set defined.")
            return fh_set
        except Exception as e:
            logging.error("Exception in get_file_handling_set: " + repr(e))
            return None


class FileHandlingSet:
    EXPECTED_VERSION = 2  # rules now point to representations only

    @classmethod
    def list_file_handling_sets(cls, cfg=None):
        """
        lists all configured file handling sets
        :param cfg: optional. If s config instance isn't given, SyncConfig will provide it.
        :return: a list with the ids of the file handling rule sets
        """
        if not cfg:
            cfg = SyncConfig.get_config()
        if cfg:
            try:
                if not cfg.file_handling_definition:
                    raise Exception(
                        "call to list_file_handling_sets without a file handling definition configured in config.yml")
                with open(cfg.file_handling_definition, "r", encoding='utf8') as ymlfile:
                    yml = yaml.load(ymlfile, Loader=yaml.FullLoader)
                    file_handling_sets = list(yml["file_handling"].keys())
                return file_handling_sets
            except Exception as e:
                logging.error("Exception in list_file_handling_sets" + repr(e))
        return []

    @classmethod
    def get_default_set(cls, cfg=None):
        """
        returns the default file handling set if defined.
        :param cfg: optional. If s config instance isn't given, SyncConfig will provide it.
        :return: the id of the default file handling set or ""
        """
        if not cfg:
            cfg = SyncConfig.get_config()
        if cfg:
            try:
                if not cfg.file_handling_definition:
                    raise Exception(
                        "call to get_default_set without a file handling definition configured in config.yml")
                with open(cfg.file_handling_definition, "r", encoding='utf8') as ymlfile:
                    yml = yaml.load(ymlfile, Loader=yaml.FullLoader)
                    if "default_set" in yml["header"]:
                        return yml["header"]["default_set"]
                    else:
                        return ""
            except Exception as e:
                logging.error("Exception in get_default_set" + repr(e))
        return ""

    def __init__(self, fh_id: str, cfg):
        """
        initializes a FileHandlingSet instance with a distinct rule set from the configuration.
        Checks that some configuration requirements like the version of the file handling config.
        This works only of the file handling set with the fh_id actually exists. Use the function
        get_file_handling_set if you want the default file handling returned.

        :param fh_id: the id of the file handling rule set
        :param cfg: a SyncConfig instance
        """
        if not id or not cfg:
            raise FileHandlingError("call to __init__ with id or cfg parameters set to null")
        if not cfg.file_handling_definition:
            raise FileHandlingError("call to __init__ without a file handling definition configured in config.yml")
        self.id = fh_id
        self.cfg = cfg
        self.max_file_size_kbytes = 0
        self.fh_config = cfg.file_handling_definition
        if not self._load_():
            raise FileHandlingError("File handling set " + fh_id + " could not be loaded from " + self.fh_config)

    def _load_(self):
        """ Loads the file handling definition from the yml-file """
        try:
            with open(self.fh_config, "r", encoding='utf8') as ymlfile:
                yml = yaml.load(ymlfile, Loader=yaml.FullLoader)
                self.file_handling_sets = yml["file_handling"]
                self.fh_definition = yml["file_handling"][self.id]
                self.header = yml["header"]
                if float(self.header["version"]) < self.EXPECTED_VERSION:
                    logging.error(f"{self.__class__.__name__}._load_: File handling definition outdated. "
                                  f"Version {self.header['version']} < {self.EXPECTED_VERSION}")
                    return False
                if "max_file_size_kbytes" in self.header:
                    self.max_file_size_kbytes = int(self.header["max_file_size_kbytes"])
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._load_: {repr(e)}")
        return False

    def get_supported_file_extensions(self):
        """
        returns a list of file extensions that are supported by file handling.
        files with an extension not in this list will be handled with a dummy representation

        :return: a list with supported file extensions
        """
        str_ext = self.header["supported_extensions"]
        if str_ext:
            return str_split_and_trim(str_ext, ",")
        return []

    def is_file_type_supported(self, filename):
        """
        convenience method that checks if a filename's extension is in the list of
        supported file extensions.
        unsupported files will be handled with a dummy representation

        :param filename: path and filename. The file itself does not have to exist, it will not be opened or checked.
        :return: True or False, does not throw exceptions
        """
        try:
            ext = get_file_extension(filename).lower()
            return ext in self.get_supported_file_extensions()
        except Exception as e:
            logging.error("Exception in is_file_type_supported: " + repr(e))
        return False

    def get_file_handling(self, filename, width, height, resolution) -> dict:
        """ depending on file-type and dimensions of the
            actual physical file and a
            requested resolution this
            determines storage-location, representation
            and whether or not a file should be modifiable.
            Used in fork by recordingworkstation._prepare_file_for_export_v2.

        :param filename: the file, perhaps including the path
        :param width: the width of the image in pixel.
        :param height: the height of the image in pixel.
        :param resolution:  points to the subkey that is responsible for the requested
                            file resolution. Often something like "high" or "low" but can be anything as long as
                            the file handling rule knows it.
                            if set to "dummy" and NO resolution "dummy" is addressed by the rule set, the result
                            will be {"location": "internal", "disable": False, "representation": "dummy"}

        :returns:  {} if it fails. Otherwise a dictionary with these keys:
                   "location": str. either "internal" or "external"
                   "disable": boolean. sets whether a recording system should disallow modification of the image
                   "representation": str. The id of a file representation to use for this file.

                                      If representation is set to the string "none", no representation
                                      will be used at all. Instead the original file will represent itself, so to speak.
                                      This is also the default if the matching rule does not set a representation

                                      If representation is set to the string "dummy",
                                      no representation will be used. Instead the target recording system is supposed
                                      to show a dummy representation. This is the default if the resolution parameter
                                      is set to "dummy" and no rule set is defined for resolution "dummy"

        """
        ext = get_file_extension(filename).lower()
        result = {"location": "internal", "disable": False, "representation": "none"}
        pixel_size = width * height
        try:
            # it isn't encouraged but I keep it possible to have "dummy" addressed by a rule set
            if resolution not in self.fh_definition:
                return self._missing_resolution(result, resolution)

            fh_rules = self.fh_definition[resolution]
            if not fh_rules:
                raise FileHandlingError(f"Resolution {resolution} has an empty definition in file handling definition.")

            rule = self._get_matching_file_handling_rule(ext, pixel_size, fh_rules)
            if rule:
                try:
                    result = self._get_results_from_rule(resolution, result, fh_rules[rule]["storage"])
                except BaseException:
                    raise FileHandlingError(f"File handling rule {resolution}/{rule} "
                                            f"has an empty or invalid storage section in file handling definition.")
            else:
                logging.warning(f"get_file_handling: No rule seems to apply for file " + filename + ". Using a dummy.")
                return self._missing_resolution(result, "dummy")

        except Exception as e:
            logging.error(f"{self.__class__.__name__}.get_file_handling: {repr(e)}")
            return {}

        return result

    @classmethod
    def _missing_resolution(cls, result: dict, resolution):
        if resolution == "dummy":
            result["representation"] = "dummy"
            result["disable"] = True
            return result
        else:
            logging.error("get_file_handling: Resolution " + resolution + " not in file handling definition.")
            return {}

    def _get_results_from_rule(self, resolution: str, result: dict, storage) -> dict:
        if "location" in storage:
            result["location"] = storage["location"]
        if "representation" in storage:
            result["representation"] = storage["representation"]
        if "disabled" in storage:
            result["disabled"] = storage["disabled"].lower() == "true"
        if result["representation"].lower() == "dummy":
            result = self._missing_resolution(result, "dummy")
        else:
            if "max_file_size_kbytes" in storage:
                result["max_file_size_kbytes"] = int(storage["max_file_size_kbytes"])
            elif self.get_max_file_size_from_resolution(resolution):
                result["max_file_size_kbytes"] = self.get_max_file_size_from_resolution(resolution)
            elif self.max_file_size_kbytes:
                result["max_file_size_kbytes"] = self.max_file_size_kbytes
        return result

    def get_max_file_size_from_resolution(self, resolution: str) -> int:
        """
        returns the max_file_size_kbytes setting from the resolution settings, if any.
        :param resolution: str the id of the resolution
        :return: the max_file_size_kbytes setting or 0
        """
        if resolution in self.fh_definition:
            if "settings" in self.fh_definition[resolution]:
                if "max_file_size_kbytes" in self.fh_definition[resolution]["settings"]:
                    return int(self.fh_definition[resolution]["settings"]["max_file_size_kbytes"])
        return 0

    @staticmethod
    def _get_matching_file_handling_rule(ext, bitsize, fh_rules) -> str:
        """
        Finds the right rule to use for the given file type and dimensions
        :param ext: the file's file extension serves as its file type
        :param bitsize: just the number of pixels an image has. Can be 0.
        :param fh_rules: the file handling rules from which to choose
        :return: the id of the rule that applies or "" if no rule applies.
        """
        ext_rules = []  # rules with filter/extensions
        non_ext_rules = []  # rules without filter / extension

        for r in fh_rules:
            if fh_rules[r] and "filter" in fh_rules[r]:
                if "extensions" in fh_rules[r]["filter"]:
                    extensions = str_split_and_trim(str(fh_rules[r]["filter"]["extensions"]).lower())
                    if ext in extensions:
                        ext_rules.append(r)
                    else:
                        if "all" in extensions:
                            non_ext_rules.append(r)
                else:
                    non_ext_rules.append(r)
            else:
                non_ext_rules.append(r)

        if ext_rules:
            rule_sets = [ext_rules, non_ext_rules]
        elif non_ext_rules:
            rule_sets = [non_ext_rules]
        else:
            rule_sets = []

        if not rule_sets:
            logging.info("no ext or default rules found for " + ext)

        highest_max_scale = 0
        scale_rule = ""
        non_scale_rule = ""
        # select the smallest max_scale the file exceeds:
        for rules in rule_sets:
            for r in rules:
                if fh_rules[r] and "filter" in fh_rules[r]:
                    if "max_scale" in fh_rules[r]["filter"]:
                        rule_size = str_split_and_trim(fh_rules[r]["filter"]["max_scale"])
                        if len(rule_size) == 2:
                            max_scale = int(rule_size[0]) * int(rule_size[1])
                            if bitsize > max_scale:  # file needs to be shrunk to max_scale
                                # but only if this rule's max_scale is
                                # higher than the max_scale of a former rule that already applied
                                if highest_max_scale == 0 or max_scale > highest_max_scale:
                                    highest_max_scale = max_scale
                                    scale_rule = r
                        else:
                            logging.error("The max_scale attribute of filter-rule " + fh_rules[r]["filter"][
                                "max_scale"] + " is not correct.")
                    else:
                        if non_scale_rule:
                            logging.warning("The rules " + non_scale_rule + " and " + r + " are redundant.")
                        non_scale_rule = r
                else:
                    if non_scale_rule:
                        logging.warning("The rules " + non_scale_rule + " and " + r + " are redundant.")
                    non_scale_rule = r

            if non_scale_rule or scale_rule:
                break
            else:
                logging.debug(
                    "No extension-specific filter for " + ext + " found: Trying to fall back on default filter")

        if scale_rule:
            rule = scale_rule
        else:
            rule = non_scale_rule
        return rule
