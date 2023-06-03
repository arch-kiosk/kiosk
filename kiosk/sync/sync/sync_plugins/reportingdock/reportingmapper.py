import copy
import logging
import pprint
import re
from typing import Callable, List, Iterator, Tuple, Union

import kioskstdlib
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from simplefunctionparser import SimpleFunctionParser
from sync_config import SyncConfig
from .reportinglib import *
from core.databasedrivers import DatabaseDriver


class ReportingMapper:
    TYPE_CONST = 1
    TYPE_VAR = 2
    TYPE_LIST = 3
    TYPE_VALUE = 4
    CURRENT_DEF_VERSION = "1.2"

    VALUE_TYPES = [(r"""^'(\#.*)'$""", TYPE_VAR),
                   (r"""^"(\#.*)"$""", TYPE_VAR),
                   (r"""^(\#.*)$""", TYPE_VAR),
                   (r"""^'(.*)'$""", TYPE_CONST),
                   (r"""^"(.*)"$""", TYPE_CONST),
                   (r"""^(.*)$""", TYPE_CONST),
                   ]

    @classmethod
    def check_mapping_definition(cls, mapping_definition):
        if "header" not in mapping_definition:
            raise ReportingException("no header found.")
        if "version" not in mapping_definition["header"] \
                or kioskstdlib.cmp_semantic_version(str(mapping_definition["header"]["version"]), cls.CURRENT_DEF_VERSION) > 0:
            raise ReportingException(f"mapping definition: the mapping definition is not compatible with version "
                                     f"{cls.CURRENT_DEF_VERSION}")

        if "mapping" not in mapping_definition:
            raise ReportingException("no 'mappings' found.")

    def __init__(self, mapping_dict: dict, key_values: dict,
                 on_load_list: Union[Callable[[str, List[str]], Iterator[Tuple]], None],
                 on_render_filename: Union[Callable[[str, str], str], None] = None):
        """

        :param mapping_dict:
        :param key_values:
        :param on_load_list: a callable which gets the table_name and the "columns" list and
                            returns a generator that returns a new row (a tuple with values)
                            on each iteration
        :param on_render_filename: a callback that is called whenever a mapping tries to render
                                   a file's uid into a file name.
        """
        self._mapping_dict = mapping_dict
        self._key_values = key_values
        self._on_load_list = on_load_list
        self._on_render_filename = on_render_filename
        self._check_mapping_dict()
        self._instructions = {
            "append": self._instruction_append,
            "prepend": self._instruction_prepend,
            "set_if_smaller": self._instruction_set_if_smaller,
            "set_if_greater": self._instruction_set_if_greater,
            "has_value": self._instruction_has_value,
            "in": self._instruction_in,
            "lookup": self._instruction_lookup,
            "render_filename": self._instruction_render_filename,
        }

    def _check_mapping_dict(self):
        if not ("header" in self._mapping_dict and
                float(kioskstdlib.try_get_dict_entry(self._mapping_dict["header"], "version",
                                                     "")) <= float(self.CURRENT_DEF_VERSION)):
            raise ReportingException(f"{self.__class__.__name__}._check_mapping_dict: mapping definition does not seem "
                                     f"to have the right version {self.CURRENT_DEF_VERSION}")
        if "mapping" not in self._mapping_dict:
            raise ReportingException(f"{self.__class__.__name__}._check_mapping_dict: mapping definition "
                                     f"has no mapping section.")

    def _get_value_type(self, value_term: str) -> (int, str):
        """
        returns the value_type and the regex - match for a term
        :param value_term: The term
        :return: a tuple consisting of (value-type, match) - both elements can be None.
        """
        if value_term is None:
            return None, None

        value_types = self.VALUE_TYPES

        value_type = None
        m = None

        for vt in value_types:
            m = re.match(vt[0], value_term)
            if m:
                value_type = vt[1]
                break
        return value_type, m

    def _resolve_value_and_type(self, value_term: str) -> (int, str):
        """
        resolves a value expression and to either a constant, a variable or a db-value (or a db-list)
        :param value_term: The term without the outer quotes of a triple quote(so a constant would just be \'constant\'
        :return: a tuple consisting of (value-type, value) - both elements can be None.
        """
        if value_term is None:
            return None, None

        value_type, m = self._get_value_type(value_term)

        if value_type == self.TYPE_CONST:
            return value_type, m.groups(1)[0]

        name = m.groups(1)[0]
        try:
            # might be a variable indeed, so let's try if the whole name, including the #, has a value:
            value = self._get_value(name)
            return self.TYPE_VAR, value
        except KeyError:
            #  it does not, so it is either a db-field or a list. But they are stored without the #
            name = name[1:]

        if "lists" in self._mapping_dict and name in self._mapping_dict["lists"]:
            self._render_list(name)

        try:
            value_term = self._get_value(name)
            return self.TYPE_VALUE, value_term
        except KeyError:
            pass

        return None, None

    def _get_value(self, value_name: str):
        return self._key_values[value_name]

    def _render_list(self, list_name):
        if not self._on_load_list:
            logging.info(f"{self.__class__.__name__}._render_list: no handler to load list {list_name}.")
            return

        list_def = self._mapping_dict["lists"][list_name]
        columns: list = list_def["columns"]
        rows = self._on_load_list(list_name, columns)
        if "column_divider" in list_def:
            new_col = list_def["column_divider"]
        else:
            new_col = '\t'
        if "row_divider" in list_def:
            new_line = list_def["row_divider"]
        else:
            new_line = '\n'

        if "row_prefix" in list_def:
            row_prefix = list_def["row_prefix"]
        else:
            row_prefix = ''

        render_filename = -1
        render_filename_method = "descriptive"
        if "render_filename" in list_def:
            try:
                render_filename = columns.index(list_def["render_filename"])
            except ValueError:
                logging.error(f"{self.__class__.__name__}._render_list: "
                              f"'render_filename' in list '{list_name}' "
                              f"refers to unknown column '{list_def['render_filename']}'")
            if "render_filename_method" in list_def:
                render_filename_method = list_def["render_filename_method"]

        result = ""
        if "heading" in list_def:
            headings = list_def["heading"]
            result += new_col.join([c for c in headings])

        found_rows = 0
        skipped_rows = 0
        skip_row = False
        for r in rows:
            found_rows += 1
            if result and not skip_row:
                result += new_line
            skip_row = False

            if render_filename > -1 and self._on_render_filename:
                r = list(r)
                # logging.debug(f"{self.__class__.__name__}._render_list: r[{render_filename}]={r[render_filename]}")
                # logging.debug(f"{self.__class__.__name__}._render_list: {pprint.pformat(r)}")
                if r[render_filename]:
                    if render_filename_method != "uid":
                        r[render_filename] = self._on_render_filename(r[render_filename], render_filename_method)
                    if not r[render_filename]:
                        logging.info(f"{self.__class__.__name__}._render_list: Could not ascertain a filename for "
                                     f"row {found_rows} of list {list_name}: Row skipped.")
                        skip_row = True
                else:
                    logging.info(f"{self.__class__.__name__}._render_list: No file present "
                                 f"in record {found_rows} of list {list_name}: Row skipped.")
                    skip_row = True

            if skip_row:
                skipped_rows += 1
            else:
                result += row_prefix + new_col.join([str(r[idx]) for idx, c in enumerate(columns)])

        # getting rid of a possible header if no records have been found
        if not found_rows:
            result = ""
        if skipped_rows:
            logging.warning(f"{self.__class__.__name__}._render_list: {skipped_rows} rows of list {list_name} skipped")
        self.add_key_value(list_name, result)

    def add_key_value(self, key, value):
        self._key_values[key] = value

    def _resolve_instruction(self, instruction: str) -> dict:
        """
        dissects an instructional term like "instruction(param1,param2)?then:else and returns
        a dictionary with the details
        :param instruction: the string with the instruction
        :return: a dictionary with the keys instruction, params, then, else (the last two optional, params can be empty)
        """
        instruction_patterns = [
            r"^(.*\(.*\))(\?.*)(:.*)$",  # instruction()?then:else
            r"^(.*\(.*\))(\?.*)$",  # instruction()?then
            r"^(.*\(.*\))(:.*)$",  # instruction():else
            r"^(.*)(\?.*)(:.*)$",  # instruction()?then:else
            r"^(.*)(\?.*)$",  # instruction()?then
            r"^(.*)(:.*)$",  # instruction():else
            r"^(.*)$",  # instruction(parameters) or instruction
        ]

        masking = {r"\&:": "&mask_colon",
                   r"\&(": "&mask_openbracket",
                   r"\&)": "&mask_closingbracket",
                   r"\&?": "&mask_questionmark",
                   }
        for mask, subst in masking.items():
            instruction = instruction.replace(mask, subst)

        m = None
        for pt in instruction_patterns:
            m = re.match(pt, instruction)
            if m:
                break

        if not m:
            return {}

        groups = m.groups()
        result = {}
        parser = SimpleFunctionParser()
        for idx, g in enumerate(groups):
            if idx == 0:
                parser.parse(g)
                if parser.ok:
                    result["instruction"] = parser.instruction.lower()
                    result["params"] = copy.deepcopy(parser.parameters)
                else:
                    if not re.match("^.*\(.*\)$", g):
                        result["instruction"] = g.strip()
                        result["params"] = []
                    else:
                        raise ReportingException(f"{self.__class__.__name__}._resolve_instruction: "
                                                 f"Cannot resolve instruction from {g}.")
            else:
                if idx > 2:
                    raise ReportingException(f"{self.__class__.__name__}._resolve_instruction: "
                                             f"Instruction term {g} has more then three syntactical parts.")

                part = g.strip()
                if part[0] == '?':
                    if "then" in result:
                        raise ReportingException(f"{self.__class__.__name__}._resolve_instruction: "
                                                 f"Instruction term {g} has more than one 'then' part.")
                    result["then"] = part[1:]
                else:
                    if part[0] == ':':
                        if "else" in result:
                            raise ReportingException(f"{self.__class__.__name__}._resolve_instruction: "
                                                     f"Instruction term {g} has more than one 'else' part.")
                        result["else"] = part[1:]

        unmasking = {r"&mask_colon": ":",
                     r"&mask_openbracket": "(",
                     r"&mask_closingbracket": ")",
                     r"&mask_questionmark": "?"
                     }
        for mask, subst in unmasking.items():
            params = result["params"]
            for idx, p in enumerate(params):
                if p and isinstance(p, str):
                    p = p.replace(mask, subst)
                    result["params"][idx] = p

            if "then" in result:
                s = result["then"]
                if s and isinstance(s, str):
                    s = s.replace(mask, subst)
                    result["then"] = s

            if "else" in result:
                s = result["else"]
                if s and isinstance(s, str):
                    s = s.replace(mask, subst)
                    result["else"] = s

        return result

    def map(self) -> dict:
        """
        processes the mapping
        :returns a dict with the target fields as key

        """
        result = {}
        for target_name, mapping in self._mapping_dict["mapping"].items():
            # is it a simple mapping?
            try:
                if isinstance(mapping, str):
                    v = self._simple_mapping(mapping)
                else:
                    v = self._process_transformations(mapping)
                if v is not None:
                    result[target_name] = v
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.map: Mapping onto target {target_name} failed: {repr(e)}")

        return result

    def _simple_mapping(self, mapping: str) -> str:
        value_type, value = self._resolve_value_and_type(mapping)
        if value:
            if isinstance(value, str):
                value = value.strip()
        return value

    def _process_transformations(self, mapping: str) -> str:
        result = None

        for transformation in mapping:
            instruction = self._resolve_instruction(transformation)

            #  check if this is just an instruction
            if "then" in instruction or "else" in instruction \
                    or ("params" in instruction and instruction["instruction"] in self._instructions):
                if instruction["instruction"] in self._instructions:
                    try:
                        result = self._instructions[instruction["instruction"]](result, instruction)
                        if result:
                            result = result.strip()
                    except ReportingVoidTransformation:
                        pass
                else:
                    raise ReportingException(f"Mapping instruction {instruction} unknown.")
            else:
                # that's just a value
                value_type, value = self._resolve_value_and_type(instruction["instruction"])
                if value_type:
                    if value:
                        if isinstance(value, str):
                            value = value.strip()
                    result = value

        return result

    def _instruction_append(self, current_result, instruction):
        new_result = str(current_result) if current_result else ""
        for p in instruction['params']:
            value_type, value = self._resolve_value_and_type(p)
            if value_type and value:
                new_result += value

        if new_result == (current_result if current_result else ""):
            raise ReportingVoidTransformation
        else:
            return new_result

    def _instruction_prepend(self, current_result, instruction):
        lead = ""
        for p in instruction['params']:
            value_type, value = self._resolve_value_and_type(p)
            if value_type and value:
                lead += value

        if not lead:
            raise ReportingVoidTransformation
        else:
            return lead + (str(current_result) if current_result else "")

    def _instruction_set_if_smaller(self, current_result, instruction):
        """
        replaces the current value if the param's value is smaller than the current value.
        If there is a second parameter, that one will be returned if the comparison is true.
        If the current value is empty it will always get replaced.
        If the current value or the parameter's value isn't an integer, this transformation will be skipped
        """
        new_result = str(current_result) if current_result else ""
        if not new_result or new_result.isdigit():
            if len(instruction['params']) > 0:
                p = instruction['params'][0]
                value_type, value = self._resolve_value_and_type(p)
                if str(value).isdigit():
                    if (not new_result.isdigit()) or int(value) < int(new_result):
                        if len(instruction['params']) > 1:
                            return instruction['params'][1]
                        else:
                            return value

        raise ReportingVoidTransformation

    def _instruction_set_if_greater(self, current_result, instruction):
        """
        replaces the current value if the param's value is greater than the current value.
        If there is a second parameter, that one will be returned if the comparison is true.
        If the current value is empty it will always get replaced.
        If the current value or the parameter's value isn't an integer, this transformation will be skipped
        """
        new_result = str(current_result) if current_result else "0"
        if new_result.isdigit():
            if len(instruction['params']) > 0:
                p = instruction['params'][0]
                value_type, value = self._resolve_value_and_type(p)
                if str(value).isdigit():
                    if int(value) > int(new_result):
                        if len(instruction['params']) > 1:
                            return instruction['params'][1]
                        else:
                            return value

        raise ReportingVoidTransformation

    def _instruction_has_value(self, current_result, instruction):
        """
        checks if a term can be resolved with a non-null value without errors.
        :param current_result:
        :param instruction:
        :return: returns the then part if successful (and if given)
                 or the else part if unsuccessful (and else is given)
                 otherwise does not manipulate the current result
        """
        if "params" not in instruction or len(instruction["params"]) > 1:
            raise ReportingException(f"instruction {instruction['instruction']} has wrong number of parameters")
        if "else" not in instruction and "then" not in instruction:
            raise ReportingException(
                f"instruction {instruction['instruction']} needs either a ? or a : part (or both).")

        result_term = ""
        if instruction["params"]:
            input_value = instruction["params"][0]
        else:
            if current_result:
                input_value = f"'{current_result}'"
            else:
                input_value = None

        try:
            value_type, value = self._resolve_value_and_type(input_value)
            if value_type and value:
                if "then" in instruction:
                    result_term = instruction["then"]
                else:
                    raise ReportingVoidTransformation
        except ReportingVoidTransformation as e:
            raise e
        except KeyError:
            pass
        except Exception as e:
            logging.warning(f"Exception in instruction {instruction['instruction']}: {repr(e)}")
        if not result_term:
            if "else" in instruction:
                result_term = instruction["else"]

        value_type, value = self._resolve_value_and_type(result_term)
        if not value_type:
            logging.warning(f"Instruction {instruction['instruction']}: "
                            f"then or else part did not resolve to a proper value.")
        return value

        # raise ReportingVoidTransformation

    def _instruction_in(self, current_result, instruction):
        """
        checks if current_result matches any of the instruction's parameters.
        :param current_result:
        :param instruction:
        :return: returns the then part if successful (and if given)
                 or the else part if unsuccessful (and else is given)
                 otherwise does not manipulate the current result
        """
        if "params" not in instruction or len(instruction["params"]) == 0:
            raise ReportingException(f"instruction {instruction['instruction']} has wrong number of parameters")
        if "else" not in instruction and "then" not in instruction:
            raise ReportingException(
                f"instruction {instruction['instruction']} needs either a ? or a : part (or both).")

        current_result = (current_result if current_result else "").lower()
        found = False
        for p in instruction["params"]:
            if p.lower() == current_result:
                found = True

        value_type = None
        value = current_result

        if found and "then" in instruction:
            value_type, value = self._resolve_value_and_type(instruction["then"])
        else:
            if "else" in instruction:
                value_type, value = self._resolve_value_and_type(instruction["else"])

        if value_type:
            return value
        else:
            raise ReportingVoidTransformation

    def _instruction_lookup(self, current_result, instruction):
        """
        looks up a record in a table of the master database
        :param current_result:
        :param instruction:
        :return: returns the then part if successful (and if given)
                 or the else part if unsuccessful (and else is given)
                 otherwise does not manipulate the current result
        """
        if "params" not in instruction or len(instruction["params"]) != 2:
            raise ReportingException(f"instruction {instruction['instruction']} has wrong number of parameters. "
                                     f"It needs a lookup table and a key field.")
        if "else" not in instruction and "then" not in instruction:
            raise ReportingException(
                f"instruction {instruction['instruction']} needs either a ? or a : part (or both).")

        current_result = (current_result if current_result else "").lower()
        found = False
        lookup_table = KioskSQLDb.sql_safe_namespaced_table(db_table=instruction["params"][0], namespace="")
        key_field = KioskSQLDb.sql_safe_ident(instruction["params"][1])
        then_value = ""
        value_field = ""
        else_value = ""
        if "then" in instruction:
            then_value = instruction["then"]
            if then_value.strip(" '\"")[0] == '#':
                value_field = KioskSQLDb.sql_safe_ident(then_value.strip(" '\"")[1:])

        if value_field:
            # then-value is a field
            sql = "select" + f"{value_field} result from " \
                             f"{lookup_table} where lower({key_field})=%s"
            found = KioskSQLDb.get_field_value_from_sql('result', sql, [current_result])
        else:
            if "then" in instruction:
                # then-value is a constant text
                sql = "select" + f" {DatabaseDriver.quote_value('varchar', self._resolve_value_and_type(then_value)[1])}" \
                                 f" result from " \
                                 f"{lookup_table} where lower({key_field})=%s"
                found = KioskSQLDb.get_field_value_from_sql('result', sql, [current_result])
            else:
                # no then value because only else exists
                sql = "select" + f"'-' result from " \
                                 f"{lookup_table} where lower({key_field})=%s"
                found = KioskSQLDb.get_field_value_from_sql('result', sql, [current_result])
                if found:
                    # record found but no then: Do nothing
                    raise ReportingVoidTransformation

        if found and "then" in instruction:
            return found

        if not found and "else" in instruction:
            return self._resolve_value_and_type(instruction["else"])[1]

        raise ReportingVoidTransformation

    def _instruction_render_filename(self, current_result, instruction):
        """
        turns a valid file-uid into a filename.
        :param current_result:
        :param instruction:
        :return: the filename or ""
        """
        if "params" not in instruction or len(instruction["params"]) != 1:
            raise ReportingException(f"instruction {instruction['instruction']} has wrong number of parameters. "
                                     f"A rendering method is expected.")

        if current_result:
            rendering_method = instruction["params"][0]
            if self._on_render_filename:
                return self._on_render_filename(current_result, rendering_method)
            else:
                raise ReportingException(f"Cannot render a filename because _on_render_filename is not set. "
                                         f"This is a bug, please report it.")
        return ""
