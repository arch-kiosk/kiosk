import logging
import os.path
import re
from io import TextIOBase
from typing import Callable

import kioskstdlib
from kioskstdlib import get_file_path

from dicttools import dict_merge
from sync_config import SyncConfig
from uic.uictree import UICTree, UICError

import yaml

CURRENT_MAX_FILE_VERSION = 1


class UICKioskFile:
    @staticmethod
    def get_file_stream(subpath_and_filename: str, base_path=""):
        subpath_and_filename = kioskstdlib.get_secure_windows_sub_path(subpath_and_filename)
        cfg = SyncConfig.get_config()
        if base_path == "":
            base_path = os.path.join(cfg.base_path, "config")
        if base_path == "":
            raise UICError(f"UICKioskFile.get_file_stream: configuration not available.")
        path_and_filename = os.path.join(base_path, cfg.resolve_symbols(subpath_and_filename))
        if os.path.isfile(path_and_filename):
            return open(path_and_filename, "r")
        else:
            raise UICError(f"UICKioskFile.get_file_stream: file {path_and_filename} does not exist.")


class UICStream:
    src_regex_selectors = r"""\s*(?P<selector>.+?)((?P<operator>\|\||\&\&)|$)"""

    def __init__(self, stream: TextIOBase, mutable_uic_tree: UICTree = None,
                 get_import_stream: Callable[[str], TextIOBase] = None):
        try:
            self._stream = stream
            self.regex_selectors = re.compile(self.src_regex_selectors)
            self._header = {}
            self._get_import_stream = get_import_stream
            self._tree = mutable_uic_tree if mutable_uic_tree else UICTree()
            self.read()
        finally:
            try:
                stream.close()
            except BaseException:
                pass

    def read(self):
        def _deal_with_yaml_block():
            nonlocal apply_to_all
            if selectors:
                for selector in selectors:
                    if selector == 'header':
                        apply_to_all = self._parse_header(yaml_block, c)
                    else:
                        self._parse_block(selector, yaml_block, c)

        yaml_block = ""
        selectors = []
        last_line_was_selector = False
        apply_to_all = ""
        # s = self._stream.readline()
        c = 0
        for s in iter(self._stream):
            c += 1
            s_stripped = s.strip()
            if s_stripped:
                if s_stripped[0] == '#':
                    if last_line_was_selector:
                        selectors.append(s_stripped[1:].lstrip().lower() + apply_to_all)
                    else:
                        _deal_with_yaml_block()
                        selectors = []
                        yaml_block = ""
                        selectors.append(s_stripped[1:].lstrip().lower() + apply_to_all)
                        last_line_was_selector = True
                else:
                    if not selectors:
                        raise UICError(f"{self.__class__.__name__}.read: "
                                       f"Block start without active selector in line {c}")
                    else:
                        last_line_was_selector = False
                        yaml_block = yaml_block + s

            # s = self._stream.readline()

        if yaml_block:
            _deal_with_yaml_block()
        else:
            raise UICError(f"{self.__class__.__name__}.read: "
                           f"YAML block without active selector ends in line {c}")

    @staticmethod
    def _get_yaml_dict(yaml_block):
        return yaml.load(yaml_block, yaml.SafeLoader)

    @property
    def tree(self):
        return self._tree

    def _parse_block(self, selector: str, yaml_block: str, line: int) -> str:
        if not yaml_block.strip():
            raise UICError(f"{self.__class__.__name__}._parse_block: "
                           f"Empty YAML Block before line {line - 1}")

        if not self._header:
            raise UICError(f"{self.__class__.__name__}.parse_block: "
                           f"Missing header before line {line - 1}")
        try:
            yaml_block = self._get_yaml_dict(yaml_block)
            self._parse_selector(selector, yaml_block)
        except BaseException as e:
            raise UICError(f"{self.__class__.__name__}.parse_block: "
                           f"Error parsing yaml block before line {line - 1}: {repr(e)}")

        return ""

    def _parse_selector(self, selector, yaml_block):
        tokenized_selectors = self._tree.parse_selector(selector)
        for t_s in tokenized_selectors:
            self._tree.add_data_chunk(t_s, yaml_block)

    def _parse_header(self, yaml_block, line) -> str:
        """
        checks the header, conducts the imports
        and returns a uic literals string that will be applied
        to all selectors in the current stream
        :return: str
        """
        if self._header:
            raise UICError(f"{self.__class__.__name__}.parse_block: duplicate header in line {line - 1}")
        try:
            self._header = self._get_yaml_dict(yaml_block)
        except BaseException as e:
            raise UICError(f"{self.__class__.__name__}.parse_block: "
                           f"Error parsing yaml block before line {line - 1}: {repr(e)}")

        if not self._header:
            raise UICError(f"{self.__class__.__name__}._parse_header: "
                           f"Error parsing header: No header.")
        if "version" not in self._header or not (1 <= int(self._header["version"]) <= CURRENT_MAX_FILE_VERSION):
            raise UICError(f"{self.__class__.__name__}._parse_header: "
                           f"Error parsing header: wrong file version. Allowed is 1 to "
                           f"{CURRENT_MAX_FILE_VERSION}")
        if "imports" in self._header:
            self._do_imports()

        if "apply_uic_literals" in self._header:
            apply_to_all: str = self._header["apply_uic_literals"].strip()
            apply_to_all = " " + (apply_to_all if apply_to_all.startswith(("&&", "||")) else "&& " + apply_to_all)
            return apply_to_all
        else:
            return ""

    def _do_imports(self):
        # something like this:
        # file = get the text stream from a callback
        # if there is no file, it depends on optional/required
        # if there is a file, create a new UICStream instance with the text stream and the current this._tree
        # the latter will make sure that the last of the same rule processed will win.
        if not self._get_import_stream:
            raise UICError(f"{self.__class__.__name__}._do_imports: Found imports section "
                           f"but no callback for imports is available.")
        imports = self._header["imports"]
        optional = []
        required = []
        if "required" in imports or "optional" in imports:
            try:
                required = imports["required"]
            except KeyError:
                pass
            try:
                optional = imports["optional"]
            except KeyError:
                pass
        else:
            required = imports

        for r in required:
            try:
                iostream = self._get_import_stream(r)
                UICStream(iostream, self._tree, self._get_import_stream)
            except BaseException as e:
                raise UICError(f"{self.__class__.__name__}._do_imports: Error loading UIC import "
                               f"'{r}': {repr(e)}")

        for r in optional:
            try:
                iostream = self._get_import_stream(r)
                UICStream(iostream, self._tree, self._get_import_stream)
            except BaseException as e:
                logging.info(f"{self.__class__.__name__}._do_imports: Missing optional UIC import "
                             f"'{r}': {repr(e)}")
