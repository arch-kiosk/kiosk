import logging
from typing import Tuple
from warnings import catch_warnings

from parse import parse

import kioskstdlib
from kioskstdlib import try_get_dict_entry

from sync_config import SyncConfig

MANIPULATION_FIX_ROTATION = "FIX_ROTATION"
MANIPULATION_DROP_EXIF_DATA = "DROP_EXIF_DATA"
MANIPULATION_AUTO_WHITE_BALANCE = "AUTO_WHITE_BALANCE"


class KioskRepresentationTypeDimensions:
    def __init__(self, width=0, height=0):
        self.width = int(width)
        self.height = int(height)

    def from_string(self, s: str):
        """
        sets width and height from a comma separated string like "120,130".
        Format must be width,height
        :param s: the string

        :todo: write test
        """
        dimension_tuple = parse('{},{}', s).fixed
        self.width = int(dimension_tuple[0])
        self.height = int(dimension_tuple[1])


class KioskRepresentationType:
    def __init__(self, unique_name: str):  # deleted:, output_file_extension=""
        self.unique_name: str = unique_name
        # self.output_file_extension = output_file_extension
        self.dimensions: KioskRepresentationTypeDimensions = None
        # self.dest_format = None
        self.format_request = {"*": "*"}
        self.method = None
        self.label = ""
        self.required_manipulations = []
        self.requested_manipulations = []
        self.inherits = ""

    def get_all_manipulations(self):
        return list(set([*self.required_manipulations, *self.requested_manipulations]))

    @classmethod
    def from_file_handling_rule(cls, rule: dict):
        """
        Turns a file resolution rule into a representation.
        works only with rules that state a representation under representation_id:


        :param   rule: a dict as returned by FileHandlingSet.get_file_handling
                 It needs file handling rules version >= 1.1 which point to a representation
        :return: a KioskRepresentationType instance or None if it is not possible to
                 infer one from the rule.

        todo: write tests.
        """

        representation = None

        if "representation" in rule:
            representation_id = rule["representation"]
            if representation_id.lower() == "none":
                representation = None
            else:
                try:
                    representation = KioskRepresentations.instantiate_representation_from_config(
                        representation_id=representation_id)
                except BaseException as e:
                    if "not defined" in repr(e):
                        representation = None
                    else:
                        raise e

                if not representation:
                    if representation_id == "dummy":
                        return None
                    else:
                        raise Exception(f"Representation {representation_id} "
                                        f"could not be instantiated in KioskRepresentationType.from_file_handling_rule")
                else:
                    return representation
        else:
            logging.error(f"{cls.__name__}.from_file_handling_rule: rule is "
                          f"outdated does not point to a representation: {rule}")
        return None

    def get_requested_output_format(self, src_format: str) -> str:
        """
        calculates the requested destination format due to the representation's format_request

        :param src_format: The format of the source file
        :return: "": No format can be derived from the rules and the given source format
                 "*": Any format is ok, preferably the source format.
                 "<specific format>": The requested target format for the representation
        """
        if not src_format:
            return None
        src_format = src_format.upper()
        fmt = ""
        if src_format in self.format_request:
            fmt = self.format_request[src_format].upper()
        else:
            if "*" in self.format_request:
                fmt = self.format_request["*"].upper()

        if fmt == "!":
            return src_format
        else:
            return fmt

    def get_inherited_manipulations(self) -> []:
        """
        returns all the requested and required manipulations of all the inherited
        representations.

        :return: list with all inherited manipulations
        """
        return KioskRepresentations.get_master_manipulations(self.inherits)

    def get_specific_manipulations(self, required=True, requested=True) -> []:
        """
        returns all the requested or required manipulations that are specific of this representations.
        Specific manipulations are those that are not present in any of the inherited masters.
        The parameters decide if the method returns required_manipulations, requested_manipulations or both.
        However, it will always check them against ALL inherited manipulations.

        :param required: If True (default) the method will include required manipulations
        :param requested: IF True (default) the method will include requested manipulations

        :return: list with manipulations
        """
        if required:
            manipulations = set(self.required_manipulations)
        else:
            manipulations = set()
        if requested:
            manipulations = manipulations.union(self.requested_manipulations)
        specific_manipulations = manipulations.difference(set(self.get_inherited_manipulations()))

        return list(specific_manipulations)


class KioskRepresentations:
    @staticmethod
    def _get_file_repository_config(cfg: SyncConfig = None) -> dict:
        rc = {}
        if not cfg:
            cfg = SyncConfig.get_config()
        if cfg.has_key("file_repository"):
            rc = cfg.file_repository

        return rc

    @classmethod
    def _get_auto_representations(cls):
        """
        returns the list of auto_representation ids as they are listed in the config, that is
        UNSORTED! Use get_auto_representations if you want them sorted by inheritance and extended by
        master representations that are the basis for the auto representations.

        :return: unordered list of auto representations or []
        """
        file_repos_cfg = cls._get_file_repository_config()
        if "auto_representations" in file_repos_cfg:
            return file_repos_cfg["auto_representations"]
        else:
            return []

    @classmethod
    def get_auto_representations(cls):
        """
        get the ids from file_repository/representations/auto_representations in the order
        of inheritance and with the underlying base representations leading the list.
        Representations should be created in the order of that list!

        :return: see above. a list or []
        """

        auto_representations = cls._get_auto_representations()
        if auto_representations:
            return cls.get_ordered_representation_ids(
                filter_by_representation_ids=auto_representations
            )
        else:
            return []

    @classmethod
    def get_representation_info_from_config(cls, representation_id) -> dict:
        file_repos_cfg = cls._get_file_repository_config()
        if "representations" in file_repos_cfg:
            if representation_id in file_repos_cfg["representations"]:
                return file_repos_cfg["representations"][representation_id]
        return {}

    @classmethod
    def get_representation_labels_and_ids(cls, config: SyncConfig = None) -> list:
        """
        returns a list of (label, id) tuples of representations order by label.
        Representations that don't have a lable are skipped
        :param config: a Config object if on hand
        :return: list of tuples (label, id)
        """
        config = cls._get_file_repository_config(config)
        ids = cls.get_representation_ids(cfg_file_repos=config)
        result = []
        for r_id in ids:
            if "label" in config["representations"][r_id]:
                result.append((config["representations"][r_id]["label"], r_id))
        result.sort(key=lambda x: x[1])
        return result

    @classmethod
    def get_viewer_representations(cls, file_type: str, config: SyncConfig = None) -> list[Tuple[str, str, int]]:
        """
        returns a list of triplets (label, id, viewer_option) of representations ordered by label.
        The first entry is always ("original file", "original", ...)
        The viewer_option is a bit-combination
        and defines where the representation can be offered for the particular file type:
            Bit 1 - offer for download
            Bit 2 - offer for opening in new window

        Only representations with a label are returned

        :param config: SyncConfig
        :return: list of triplets
        """
        download_resolutions = []
        open_resolutions = []
        try:
            accessible_files = config.file_repository["viewer_options"]["accessible_files"]
            try:
                download_resolutions = accessible_files["*"]["download_resolutions"]
            except:
                pass

            try:
                open_resolutions: list = accessible_files["*"]["open_resolutions"]
                if "original" in open_resolutions:
                    open_resolutions.remove("original")
            except:
                pass

        except BaseException as e:
            pass

        try:
            accessible_files = config.file_repository["viewer_options"]["accessible_files"]
            try:
                download_resolutions = accessible_files[file_type]["download_resolutions"]
            except:
                pass

            try:
                open_resolutions: list = accessible_files[file_type]["open_resolutions"]
            except:
                pass

        except BaseException as e:
            pass

        if download_resolutions and "original" not in download_resolutions:
            download_resolutions.append("original")

        return [(x[0],
                x[1], (not download_resolutions or x[1] in download_resolutions) | \
                      ((not open_resolutions and x[1] != "original") or x[1] in open_resolutions) << 1
                ) for x in [("original file","original"), *cls.get_representation_labels_and_ids(config)]]


    # @classmethod
    # def get_viewer_new_tab_res(cls, file_type: str, config: SyncConfig = None) -> list[Tuple[str, str, int]]:

    @classmethod
    def instantiate_representation_from_config(cls, representation_id) -> KioskRepresentationType:
        representation_info = cls.get_representation_info_from_config(representation_id)
        if not representation_info:
            raise Exception(f"representation {representation_id} not defined in config.")

        fmt_request = kioskstdlib.try_get_dict_entry(representation_info, "format_request", {})
        if isinstance(fmt_request, str):
            fmt_request = cls.get_standard_format_request(fmt_request)

        if not fmt_request:
            raise Exception(f"format request not given with representation {representation_id} in config.")

        method = kioskstdlib.try_get_dict_entry(representation_info, "method", None)
        inherits = kioskstdlib.try_get_dict_entry(representation_info, "inherits", None)
        label = kioskstdlib.try_get_dict_entry(representation_info, "label", None)
        requested_manipulations = kioskstdlib.uppercase_elements(
            kioskstdlib.try_get_dict_entry(representation_info,
                                          "requested_manipulations", []))
        required_manipulations = kioskstdlib.uppercase_elements(
            kioskstdlib.try_get_dict_entry(representation_info,
                                          "required_manipulations",
                                           []))

        representation_dimensions: KioskRepresentationTypeDimensions = None
        dimensions = cls.get_dimensions_from_representation_info(representation_info)
        if dimensions:
            representation_dimensions = dimensions

        representation = KioskRepresentationType(representation_id)
        representation.format_request = fmt_request
        representation.dimensions = representation_dimensions
        representation.method = method
        representation.inherits = inherits
        representation.label = label
        representation.requested_manipulations = requested_manipulations
        representation.required_manipulations = required_manipulations

        return representation

    @classmethod
    def get_representation_ids(cls, cfg_file_repos=None, viewer_representations=False) -> []:
        if not cfg_file_repos:
            cfg_file_repos = cls._get_file_repository_config()

        return [x for x in cfg_file_repos["representations"]
                if not viewer_representations or "label" in cfg_file_repos["representations"][x] ]

    @classmethod
    def get_master_representation(cls, cfg_file_repos=None) -> str:
        """
        returns the fullscreen representation via direct call of get_fullscreen_representation
        :param cfg_file_repos: optional file_repository config (SyncConfig["file_repository"])
        :return: representation id
        """
        return cls.get_fullscreen_representation(cfg_file_repos)

    @classmethod
    def get_fullscreen_representation(cls, cfg_file_repos=None) -> str:
        """
        returns the fullscreen representation
        :param cfg_file_repos: optional file_repository config (SyncConfig["file_repository"])
        :return: representation id
        """
        if not cfg_file_repos:
            cfg_file_repos = cls._get_file_repository_config()

        repr_id = kioskstdlib.try_get_dict_entry(cfg_file_repos,"fullscreen_representation", "master", True)
        return repr_id

    @classmethod
    def get_dimensions_from_representation_info(cls, representation_info):
        """
        get dimensions from a representation information of the config file.
        The representation info has to be a result of a subsequent call to
        get_representation_info_from_config

        :param representation_info: the representation information
                    as returned by get_representation_info_from_config
        :return: None if no dimensions are given or an instance of
                 KioskRepresentationTypeDimensions.
        """
        str_dimensions = kioskstdlib.try_get_dict_entry(representation_info, "dimensions", "")
        if str_dimensions:
            dimension_tuple = parse('{},{}', str_dimensions).fixed
            return KioskRepresentationTypeDimensions(int(dimension_tuple[0]),
                                                     int(dimension_tuple[1]))
        return ()

    @classmethod
    def get_closest_dimension(cls, width, height, viewer_representations=True):
        pixels = max(width,height)
        representations = list(map(lambda repr_dim: (repr_dim[0], min(repr_dim[1].height, repr_dim[1].width)
                                if repr_dim[1] else 0),
                              [(repr_id, cls.get_dimensions_from_representation_info(
                                                cls.get_representation_info_from_config(repr_id)))
                                for repr_id in cls.get_representation_ids(viewer_representations=viewer_representations)]))
        representations.sort(key=lambda r_dim: r_dim[1],reverse=True)
        last_repr_dim = cls.get_fullscreen_representation()
        for repr_dim in representations:
            if repr_dim[1] < pixels:
                break
            else:
                last_repr_dim = repr_dim[0]
        return last_repr_dim

    @classmethod
    def _inherits(cls, cfg, _id):
        return try_get_dict_entry(cfg["representations"][_id], "inherits", "")

    @classmethod
    def get_ordered_representation_ids(cls, filter_by_representation_ids=[]):
        file_repos_cfg = cls._get_file_repository_config()
        all_representations = cls.get_representation_ids(file_repos_cfg)
        if filter_by_representation_ids:
            ordered_representations = filter_by_representation_ids.copy()
        else:
            ordered_representations = all_representations

        idx = 0
        while idx < len(ordered_representations):
            r_id = ordered_representations[idx]
            inherits = cls._inherits(file_repos_cfg, r_id)
            if inherits:
                try:
                    if filter_by_representation_ids and inherits not in ordered_representations:
                        if inherits in all_representations:
                            ordered_representations.append(inherits)

                    idx_inherits = ordered_representations.index(inherits)
                    if idx_inherits > idx:
                        ordered_representations[idx], ordered_representations[idx_inherits] = \
                            ordered_representations[idx_inherits], ordered_representations[idx]
                        continue
                except ValueError:
                    logging.error(f"{cls.__name__}.get_ordered_representation: {r_id} inherits unknown {inherits}")
                    return None
            idx = idx + 1

        return ordered_representations

    @classmethod
    def get_standard_format_request(cls, fmt_request_id):
        config = SyncConfig.get_config()
        return config.file_repository["standard_format_requests"][fmt_request_id]

    @classmethod
    def get_master_manipulations(cls, first_master: str) -> []:
        """
        returns all the requested and required manipulations of the given master and its masters

        :return: list with all inherited manipulations
        """
        config = SyncConfig.get_config()
        master = first_master
        endless_protection = 0
        requested = set()
        required = set()

        while master:
            endless_protection += 1
            if endless_protection > 10:
                logging.error(f"{cls.__name__}.get_inherited_manipulations: Endless protection had to step in.")
                break

            r_info = cls.get_representation_info_from_config(master)
            if r_info:
                master = kioskstdlib.try_get_dict_entry(r_info, "inherits", "")
                new_requested = kioskstdlib.uppercase_elements(
                    kioskstdlib.try_get_dict_entry(r_info, "requested_manipulations", [])
                )
                for m in new_requested:
                    requested.add(m)
                new_required = kioskstdlib.uppercase_elements(
                    kioskstdlib.try_get_dict_entry(r_info, "required_manipulations", [])
                )
                for m in new_required:
                    required.add(m)
            else:
                break

        return list(requested.union(required))
