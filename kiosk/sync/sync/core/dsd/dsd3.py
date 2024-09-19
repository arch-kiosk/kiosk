import os
import logging
import re
from typing import List

import kioskstdlib
from kioskfiletools import get_file_extension
from dsd.dsdloader import DSDLoader
from dsd.dsdconstants import *
from dsd.dsdstore import DSDStore
from dsd.dsdinmemorystore import DSDInMemoryStore
from simplefunctionparser import SimpleFunctionParser
from copy import deepcopy, copy
from dsd.dsderrors import *
from kiosksqldb import KioskSQLDb
from dicttools import dict_merge


class Join:
    def __init__(self, root_table, related_table, _type="inner", root_field="", related_field="", quantifier="1",
                 root_alias="",
                 related_alias=""):
        self.root_table = root_table
        self.related_table = related_table
        self.type = _type
        self.root_field = root_field
        self.related_field = related_field

        # usually that's 1 as we deal with 1:N relations.
        self.quantifier = quantifier  # how many records does the root table have?

        self.root_alias = ""
        self.related_alias = ""

    def __repr__(self) -> str:
        return f"Join(root_table=\"{self.root_table}\"," \
               f"related_table=\"{self.related_table}\"," \
               f"type=\"{self.type}\"," \
               f"root_field=\"{self.root_field}\"," \
               f"related_field=\"{self.related_field}\"," \
               f"root_alias=\"{self.root_alias}\"," \
               f"related_alias=\"{self.related_alias}\"," \
               f"quantifier=\"{self.quantifier}\")"

    def __eq__(self, other):
        return self.__dict__ == other.__dict__

    def get_sql(self):
        sql = ""
        if self.type not in ["inner", "lookup"]:
            raise DSDJoinError(f"Join._get_sql: join type {self.type} not supported.")
        root_table = self.root_alias if self.root_alias else self.root_table
        related_table = self.related_alias if self.related_alias else self.related_table

        sql += f" inner join"
        sql += (f" {KioskSQLDb.sql_safe_ident(self.related_table)}"
                f"{' as ' + KioskSQLDb.sql_safe_ident(self.related_alias) if self.related_alias else ''}")
        sql += f" on {KioskSQLDb.sql_safe_ident(root_table)}.{KioskSQLDb.sql_safe_ident(self.root_field)}"
        sql += f"="
        sql += f"{KioskSQLDb.sql_safe_ident(related_table)}.{KioskSQLDb.sql_safe_ident(self.related_field)}"

        return sql

    def get_group_by(self):
        return f" group by {KioskSQLDb.sql_safe_ident(self.root_table)}.{KioskSQLDb.sql_safe_ident(self.root_field)} "


class DataSetDefinition:
    """ DataSetDefinition encapsulates the access to the DataSetDefinition file.
        The latter describes which fields and tables are involved in the replication
        and synchronization. It also describes the structure of the synchronization tables
        (shadow tables) and the mapping directives.

        V3: 27.10.2019 LK
    """

    CURRENT_DSD_FORMAT_VERSION = 3

    _dsd_data_types = {
        "VARCHAR": "VARCHAR",
        "TEXT": "TEXT",
        "INT": "INT",
        "INTEGER": "INT",
        "SMALLINT": "SMALLINT",
        "NUMBER": "INT",
        "DECIMAL": "FLOAT",
        "FLOAT": "FLOAT",
        "TIMESTAMP": "TIMESTAMP",
        "DATETIME": "TIMESTAMP",
        "UID": "UUID",
        "UUID": "UUID",
        "BOOLEAN": "BOOLEAN",
        "BOOL": "BOOLEAN",
        "JSON": "JSON",
        "DATE": "DATE",
        "TIME": "TIME",
        "SERIAL": "SERIAL",
        "TZ": "TZ",
    }

    def __init__(self, dsd_store=None):
        # don't forget that all attributes added here might have to be added in .clone()!
        self._default_locations = {}
        self._file_locations = {}
        if not dsd_store:
            dsd_store = DSDInMemoryStore()
        self._dsd_data: DSDStore = dsd_store
        self._loaders = {}
        self.files_table = ""
        self.files_table_filename_field = ""
        self.dsd_root_path = ""
        self.format = self.CURRENT_DSD_FORMAT_VERSION
        self._glossary = None

    @classmethod
    def translate_datatype(cls, data_type):
        """
        translates a data type into a regular data type. Used to catch obsolete data type synonyms.
        :param data_type: a regular or obsolete data type. Case-insensitive.
        :return: a regular data type or ""
        """
        try:
            return cls._dsd_data_types[data_type.upper()].lower()
        except:
            pass
        return ""

    # # ********************************************************
    # #  deprecated stuff
    # # ********************************************************
    # def list_externally_bound_fields(self, table, version=0):
    #     """ returns a list of the fields of a given version of a table definition
    #         in the DataSetDefinition that have a FILE_FOR attribute, which indicates that the
    #         field refers to an external file.
    #
    #         In fact that should only be the images / files table
    #         :todo: This should not be needed any longer!
    #                 Get rid of it when working on the next version of the DSD
    #
    #     """
    #
    #     raise DeprecationWarning("call to DataSetDefinition.list_externally_bound_fields is obsolete.")

    # ********************************************************
    #  end deprecated stuff
    # ********************************************************

    # noinspection PyPep8Naming
    def register_loader(self, file_ext: str, DSDLoaderClass):
        """"""
        self._loaders[file_ext.lower()] = DSDLoaderClass

    def register_glossary(self, glossary):
        self._glossary = glossary

    def assert_raw(self, path: list, key: str = ""):
        """
        checks if a path or a key within a path exists in the raw dsd data.
        :param path: a list of keys
        :param key: an optional key to check in the path
        :return: true or false
        """

        try:
            raw_path = self._dsd_data.get(path)
            if key:
                return key in raw_path
            else:
                return True
        except BaseException as e:
            return False

    def append_field(self, table: str, field: str, instructions: list, version: int = 0) -> None:
        """
        appends a field to a table in the dsd. (This is not permanent).
        If the field is already there, it will be replaced.
        :param table: the table with the field
        :param field: the name of the field
        :param instructions: a list of instructions
        :param version: if not given the field is appended to the current version
        :returns: nothing. But can throw Exceptions.
        """
        version = version if version else self.get_current_version(table)
        self._dsd_data.set([table, KEY_TABLE_STRUCTURE, version, field], instructions)

    @staticmethod
    def get_virtual_fields(raw_dsd: dict):
        """
        adds fields that are not explicitly defined in the dsd file like the tz fields for datatimes and timestamps
        :param raw_dsd: a complete dsd structure
        :return: a dictionary with table: version: fields: parameters to add
        """

        def _append_virtual_fields_to_table(raw_dsd_table: dict):
            new_fields = {}
            for ver in raw_dsd_table:
                if isinstance(ver, int):
                    structure = raw_dsd_table[ver]
                    if isinstance(structure, dict):
                        for field, params in structure.items():
                            try:
                                for param in params:
                                    p = param.lower()
                                    if p.startswith("datatype") and ("datetime" in p or "timestamp" in p):
                                        if ver not in new_fields:
                                            new_fields[ver] = {}
                                        new_fields[ver][field + "_tz"] = ['datatype(TZ)', ]
                                        break
                            except BaseException as e:
                                raise DSDStructuralIssue(f"version {ver} field definition for {field} not correct")
                # else:
                #     raise DSDStructuralIssue(f"numeric version expected, got {ver}")
            return new_fields

        structural_modifications = {}
        for top_level in raw_dsd.keys():
            if top_level not in ['config', 'migration_catalog', 'migration_flags']:
                if 'structure' in raw_dsd[top_level]:
                    try:
                        added_fields = _append_virtual_fields_to_table(raw_dsd[top_level]["structure"])
                        if added_fields:
                            structural_modifications[top_level] = added_fields

                    except DSDStructuralIssue as e:
                        raise DSDStructuralIssue(f"Structural issue detected in table {top_level}: {e}")

        return structural_modifications

    @staticmethod
    def _add_virtual_fields_to_raw_dsd(raw_dsd, virtual_fields):
        for table, structure in virtual_fields.items():
            for ver, fields in structure.items():
                raw_dsd[table]["structure"][ver].update(fields)

    def _read_dsd_data_from_file(self, path_and_filename: str):
        if not os.path.isfile(path_and_filename):
            raise FileNotFoundError
        ext = get_file_extension(path_and_filename).lower()
        if ext in self._loaders:
            loader: DSDLoader = self._loaders[ext]()
            dsddata = loader.read_dsd_file(file_path_and_name=path_and_filename)
            if not self._check_version(dsddata):
                raise DSDWrongVersionError

            return dsddata
        else:
            logging.debug(f"DataSetDefinition._read_dsd_data_from_file: no loader for dsd file {path_and_filename}")
            raise DSDFileError(
                f"DataSetDefinition._read_dsd_data_from_file: no loader for dsd file {path_and_filename}")

    def _check_version(self, dsd_data: dict = None):
        if not dsd_data:
            dsd_data = self._dsd_data.get([])
        if KEY_CONFIG not in dsd_data:
            raise DSDError(f"no {KEY_CONFIG} in dsd_data: {dsd_data}")
        if dsd_data[KEY_CONFIG][KEY_FORMAT_VERSION] != self.CURRENT_DSD_FORMAT_VERSION:
            return False

        return True

    def _resolve_externals(self, dsddata, key_path=[], base_path="", recursion_level=1):
        def _copy_dict_key(d: dict, key_path: []):
            node = d
            for k in key_path:
                node = node[k]
            return deepcopy(node)

        def _get_external_dsd_part(v):
            if not isinstance(v, str):
                return ""
            if not v.startswith("external("):
                return ""
            parser = SimpleFunctionParser()
            parser.parse(v)
            if not parser.ok or parser.instruction != "external":
                return ""
            return parser.parameters[0]

        #
        # start function body
        # 
        if recursion_level > 30:
            raise Exception("DataSetDefinition: Recursion level > 30")

        for k, v in list(dsddata.items()):
            if isinstance(v, dict):
                self._resolve_externals(v, key_path=[*key_path, k], base_path=base_path,
                                        recursion_level=recursion_level + 1)
            else:
                external_dsd_part = _get_external_dsd_part(v)
                if external_dsd_part:
                    external_dsd_part_file = os.path.join(base_path, external_dsd_part)
                    more_dsd_data = self._read_dsd_data_from_file(external_dsd_part_file)

                    key_to_copy = _copy_dict_key(more_dsd_data, [*key_path, k])
                    dsddata[k] = key_to_copy
                    if isinstance(dsddata[k], dict):
                        self._resolve_externals(dsddata[k], base_path=base_path,
                                                key_path=[*key_path, k], recursion_level=recursion_level + 1)

    def append_file(self, path_and_filename: str):

        try:
            dsddata = self._read_dsd_data_from_file(path_and_filename)
            if dsddata:
                rc = self.append(dsddata, os.path.dirname(path_and_filename))
                if rc and not self.dsd_root_path:
                    self.dsd_root_path = os.path.dirname(path_and_filename)
                return rc
            else:
                logging.warning(f"DataSetDefinition.append_file: no data in dsd file {dsddata}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.append_file: "
                          f"Exception when reading dsd file {path_and_filename}: {repr(e)}")
        return False

    def _append_imports(self, dsddata: dict, external_file_path="", recursion_counter=0) -> None:
        if recursion_counter > 5:
            raise DSDError("too deeply nested or presumably cross-referenced import structures in dsd")

        if not dsddata[KEY_CONFIG]:
            raise DSDError(f"{KEY_CONFIG}: key is given but list is empty.")
        if KEY_CONFIG_IMPORTS in dsddata[KEY_CONFIG]:
            if not dsddata[KEY_CONFIG][KEY_CONFIG_IMPORTS]:
                raise DSDError(f"{KEY_CONFIG}/{KEY_CONFIG_IMPORTS}: key is given but list is empty.")

            for file_name in dsddata[KEY_CONFIG][KEY_CONFIG_IMPORTS]:
                try:
                    file_path_and_name = os.path.join(external_file_path, file_name)
                    more_dsd_data: dict = self._read_dsd_data_from_file(file_path_and_name)
                    self._append_imports(dsddata=more_dsd_data, external_file_path=external_file_path,
                                         recursion_counter=recursion_counter + 1)
                    # if KEY_CONFIG in more_dsd_data:
                    # add context definitions
                    if KEY_CONFIG_CONTEXTS in more_dsd_data[KEY_CONFIG]:
                        if KEY_CONFIG_CONTEXTS not in dsddata[KEY_CONFIG]:
                            dsddata[KEY_CONFIG][KEY_CONFIG_CONTEXTS] = {}
                        else:
                            if not isinstance(dsddata[KEY_CONFIG][KEY_CONFIG_CONTEXTS], dict):
                                raise DSDError("dsd3._append_imports encountered a mix up of 'external' "
                                               "and 'import' when importing external context definitions. "
                                               f"Please use the one or the other. File: {file_name}")
                        dsddata[KEY_CONFIG][KEY_CONFIG_CONTEXTS].update(
                            more_dsd_data[KEY_CONFIG][KEY_CONFIG_CONTEXTS])

                    # the rest of the new config needs to be dropped.
                    # more_dsd_data.pop(KEY_CONFIG)
                    if KEY_CONFIG_IMPORTS in more_dsd_data[KEY_CONFIG]:
                        more_dsd_data[KEY_CONFIG].pop(KEY_CONFIG_IMPORTS)
                    more_dsd_data[KEY_CONFIG].pop(KEY_FORMAT_VERSION)
                    dict_merge(dsddata[KEY_CONFIG], more_dsd_data[KEY_CONFIG])
                    more_dsd_data.pop(KEY_CONFIG)
                    dsddata.update(more_dsd_data)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}._append_imports: Exception when appending "
                                  f"{file_name}: {repr(e)}")
                    raise e

    def append(self, dsddata: dict, external_file_path="") -> dict:
        """
        appends dsddata to the current dsd. Checks the dsd version and resolves imports and the like.
        imports and external references in the dsd will only be resolved if external_file_path is given.

        :param dsddata: a dictionary with complete and valid dsd data
        :param external_file_path: the path from which imports are loaded. If not given, imports will be skipped!
        :return: something truish (a not empty dict) or an empty dict (which is falsish)
        """
        if not self._check_version(dsddata):
            raise DSDWrongVersionError
        try:


            if external_file_path:
                self._append_imports(dsddata=dsddata, external_file_path=external_file_path)
                self._resolve_externals(dsddata, base_path=external_file_path)

            #todo time zone: I moved this down here because the _tz fields were not added.
            # But why did that ever work anywhere?
            virtual_fields = self.get_virtual_fields(dsddata)
            if virtual_fields:
                self._add_virtual_fields_to_raw_dsd(dsddata, virtual_fields)

            rc = self._dsd_data.merge([], dsddata)

            if rc:
                if self._identify_files_table() <= 1:
                    return rc
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.append: {repr(e)}")
            raise e
        return {}

    def clone(self):
        new_dsd = self.__class__()
        new_dsd.dsd_root_path = self.dsd_root_path
        new_dsd.files_table = self.files_table
        new_dsd.files_table_filename_field = self.files_table_filename_field
        for ext in self._loaders:
            new_dsd.register_loader(ext, self._loaders[ext])
        dsddata = deepcopy(self._dsd_data.get([]))
        new_dsd.append(dsddata)
        return new_dsd

    def is_table_dropped(self, table_name: str, version=0):
        if not self.table_is_defined(table_name):
            return False

        if version == 0:
            version = self.get_current_version(table_name)
        structure = self._dsd_data.get([table_name, KEY_TABLE_STRUCTURE, version])

        if isinstance(structure, str):
            if structure == "dropped":
                return True
        return False

    def table_is_defined(self, table_name):
        """
        checks if there is a table definition for the table in the dsd.
        It does not matter if the table is a system table or dropped!
        :param table_name: str
        :return: true or false
        """
        return table_name in self._dsd_data.get_keys([])

    def list_tables(self, include_dropped_tables=False, include_system_tables=False, version=0):
        """ returns a list of the tables in the DataSetDefinition. Does not list dropped tables unless the parameter
         calls for it
         :param include_system_tables: includes tables that are flagged as system_table
         :param include_dropped_tables: set to True if dropped tables should be listed as well.
        """
        return list(filter(lambda x: (x != KEY_CONFIG) and
                                     (include_system_tables or
                                      not self.table_has_meta_flag(x, KEY_TABLE_FLAG_SYSTEM_TABLE)) and
                                     (include_dropped_tables or
                                      not self.is_table_dropped(x)),
                           self._dsd_data.get_keys([])))

    def list_tables_with_instructions(self, instructions: list, include_dropped_tables=False):
        """ returns a list of those tables in the DataSetDefinition that have at least one field with
            one of the given instructions.
         :param instructions: list of instructions to search for
         :param include_dropped_tables: set to True if dropped tables should be listed as well.
        """
        if not instructions:
            return []

        tables = self.list_tables(include_dropped_tables=include_dropped_tables)
        return [table for table in tables if self.get_fields_with_instructions(table,
                                                                               required_instructions=instructions)]

    def list_tables_without_instructions(self, instructions: list, include_dropped_tables=False):
        """ returns a list of those tables in the DataSetDefinition that DO NOT have at least one field with
            one of the given instructions.
         :param instructions: list of instructions to search for
         :param include_dropped_tables: set to True if dropped tables should be listed as well.
        """
        if not instructions:
            return []

        tables = self.list_tables(include_dropped_tables=include_dropped_tables)
        return [table for table in tables if not self.get_fields_with_instructions(table,
                                                                                   required_instructions=instructions)]

    def list_tables_with_flags(self, flags: list, include_dropped_tables=False):
        """ returns a list of those tables in the DataSetDefinition that have at least one of the required flags.
         :param flags: list of flags to search for
         :param include_dropped_tables: set to True if dropped tables should be listed as well.
        """
        if not flags:
            return []

        include_system_table = KEY_TABLE_FLAG_SYSTEM_TABLE in flags
        tables = self.list_tables(include_dropped_tables=include_dropped_tables,
                                  include_system_tables=include_system_table)
        return [table for table in tables if set(self.table_has_meta_flag(table, flags))]

    def list_versions(self, table):
        raise DeprecationWarning("list_versions is obsolete!")

    def list_table_versions(self, table) -> []:
        """ returns a list of the versions of a tabledefinition in the DataSetDefinition
            returns an empty list if the table is not defined at all.
        """
        try:
            if not self.table_is_defined(table):
                return []

            return self._dsd_data.get_keys([table, KEY_TABLE_STRUCTURE])
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.list_table_versions: Exception when accessing "
                          f"structure of {table}: {repr(e)}")
            raise DSDError(f"Error in Dataset Definition: Structure of Table {table} not well defined!")

    def get_current_version(self, table):
        """ returns the highest (current) version of the table structure for a table """
        versions = self.list_table_versions(table)
        if versions:
            return max(versions)
        else:
            return DSDError(f"dsd.get_current_version: table {table} has no versions or isn't defined at all")

    def list_fields(self, table, version=0):
        """ returns a list of the fieldnames of a given version of a tabledefinition in the DataSetDefinition.
        :param table: the table in the dsd
        :param version: if not given or set to 0 the most recent version is used """
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        return self._dsd_data.get_keys([table, KEY_TABLE_STRUCTURE, version])

    def omit_fields_by_datatype(self, table, fields, datatype, version=0) -> List:
        """ returns a list of the field names of a given version of a table definition
        that don't have the given datatype.

        :param table: the table in the dsd
        :param fields: list of field names
        :param datatype: the datatype to omit
        :param version: if not given or set to 0 the most recent version is used
        :result: same list as fields except for the fields with the data type
        """
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        dt_fields = self.get_fields_with_datatype(table, datatype, version=version)
        if not dt_fields:
            return fields

        return [f for f in fields if f not in dt_fields]

    def get_table_definition(self, table, version=0) -> dict:
        """ returns the complete definition (of a given version) of a table.
            Instructions stay as text and are not parsed.
        :param table: the table in the dsd.
        :param version: if not given or set to 0 the most recent version is used
        :return: dict: a deep copy of the dsd definition
        """
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        return deepcopy(self._dsd_data.get([table, KEY_TABLE_STRUCTURE, version]))

    def delete_field(self, table, field, version=0) -> None:
        """
        deletes a field from a table in the dsd. (This is not permanent).
        If the field is not there in the first place, that's ok.
        :param table: the table with the field
        :param field: the name of the field
        :param version: if not given the field is removed from the current version
        :returns: nothing. But can throw Exceptions.
        """
        version = version if version else self.get_current_version(table)
        if field in self._dsd_data.get_keys([table, KEY_TABLE_STRUCTURE, version]):
            self._dsd_data.delete([table, KEY_TABLE_STRUCTURE, version, field])

    def get_instruction_parameters(self, table, field_name, requested_instruction, version=0):
        """ returns the parameters of an instruction of a certain field and table
        :param table: the table
        :param field_name: the field
        :param requested_instruction: the instruction
        :param version: the version. 0 for the most recent version.
        :return: a list of parameters. List is empty if there are no parameters.
                 Returns an explicit None if the instruction does not exist.
        """
        result = None
        parser = SimpleFunctionParser()
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        for instruction in self._dsd_data.get([table, KEY_TABLE_STRUCTURE, version, field_name]):
            instruction: str
            if instruction.startswith(requested_instruction):
                parser.parse(instruction)
                if parser.ok:
                    result = parser.parameters
                    break
                else:
                    raise DSDInstructionSyntaxError(instruction)

        return result

    def get_unparsed_field_instructions(self, table, fieldname, version=0) -> list:
        """ returns the list of instructions for a field but does not parse the instructions.
        :param table: the table
        :param fieldname: the field
        :param version: the version. 0 for the most recent version.
        :return: a list of instructions (strings)
        :raises all kinds of exceptions.
        """
        result = {}
        parser = SimpleFunctionParser()
        version = version if version else self.get_current_version(table)
        instructions = self._dsd_data.get([table, KEY_TABLE_STRUCTURE, version, fieldname])
        return copy(instructions)

    def get_field_instructions(self, table, fieldname, version=0, patterns: List[str] = None) -> dict:
        """ returns a dictionary with all the instructions and their parameters for a field
        :param table: the table
        :param fieldname: the field
        :param version: the version. 0 for the most recent version.
        :param patterns: optional. Only instructions that start with one of the patterns are returned
        :return: a dictionary with the instructions as key and a list of parameters as values.
                 The instruction (the key) is lowercase
        :raises all kinds of exceptions.
        :todo this won't work if a field can have the same instruction twice! Not a use case so far...
        :todo test
        """
        result = {}
        parser = SimpleFunctionParser()
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        for instruction in self._dsd_data.get([table, KEY_TABLE_STRUCTURE, version, fieldname]):
            if not patterns or kioskstdlib.str_starts_with_element(instruction, patterns):
                parser.parse(instruction)
                if parser.ok:
                    result[parser.instruction.lower()] = parser.parameters
                else:
                    raise DSDInstructionSyntaxError(instruction)

        return result

    def get_fields_with_instructions(self, table, required_instructions: [] = None, version=0) -> dict:
        """ returns a dictionary with all the fields and
        all the instructions and their parameters for a field. 
        The dictionary values are a dictionary with the instructions as keys pointing to a list of parameters. 
        
        :param table: a table in the dsd
        :param required_instructions: if not empty the method returns
                                      only fields that have at least one of the instructions of this list.
        :param version: the version of table structure in the dsd
        :returns: a dict with the fieldnames as keys pointing to a dictionary if instructions,
                  pointing to a list of parameter values:
                    {fieldname: {instruction: [parameters]}}
        """
        if not required_instructions:
            required_instructions = []

        if self.is_table_dropped(table, version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        version = version if version else self.get_current_version(table)
        result = {}
        fields = self.list_fields(table, version)
        for f in fields:
            instructions = self.get_field_instructions(table, f, version)
            if instructions:
                if required_instructions:
                    for i in required_instructions:
                        if i.lower() in instructions:
                            result[f] = instructions
                            break
                else:
                    result[f] = instructions

        return result

    def get_fields_with_instruction(self, table, requested_instruction: str, version=0) -> list:
        """ returns a list with the names of the fields that have the requested instruction.

        :param table: a table in the dsd
        :param requested_instruction: the instruction
        :param version: the version of table structure in the dsd
        :returns list: list with fields or empty list if no field has the instruction
        :raises: Can throw all kinds of Exception.
        """
        if not requested_instruction:
            raise DSDError("DataSetDefinition.get_fields_with_instruction needs an instruction.")

        return list(self.get_fields_with_instructions(table,
                                                      required_instructions=[requested_instruction],
                                                      version=version).keys())

    def get_fields_with_instruction_and_parameter(self, table, requested_instruction: str,
                                                  requested_parameter_values=None,
                                                  fail_on_many=False, version=0) -> dict:
        """ returns a list with the names of the fields that have the requested instruction and one of the values given
        in requested_parameter_values as the only parameter.

        :param table: a table in the dsd
        :param requested_instruction: the instruction
        :param requested_parameter_values: a list of parameter values. If one of the values is "None",
                an instruction without a parameter matches the request.
                If requested_parameter_values is missing, [None] is the default.
        :param fail_on_many: if set to True (default is False) the method will raise a DSDException
                             if more than one field matches the request.
        :param version: the version of table structure in the dsd
        :returns: a dict with the fieldnames as keys pointing to a dictionary of instructions,
                  pointing to a list of parameter values:
                    {fieldname: {instruction: [parameters]}}
        """
        if not requested_instruction:
            raise DSDError("DataSetDefinition.get_fields_with_instruction needs an instruction.")

        if not requested_parameter_values:
            requested_parameter_values = [None]
        if not isinstance(requested_parameter_values, list):
            requested_parameter_values = [requested_parameter_values]

        fields_and_instructions = self.get_fields_with_instructions(table,
                                                                    required_instructions=[requested_instruction],
                                                                    version=version)
        result = {}
        for f in fields_and_instructions.keys():
            params = fields_and_instructions[f][requested_instruction]
            if len(params) <= 1:
                for requested in requested_parameter_values:
                    if (requested is None and len(params) == 0) \
                            or (len(params) == 1 and requested == params[0]):
                        result[f] = fields_and_instructions[f]
                        break
        if len(result) > 1 and fail_on_many:
            raise DSDSemanticError(f"table {table} has more than one instruction {requested_instruction} of a kind.")

        return result

    def list_fields_of_type(self, table, datatype, version=0):
        """ returns a list of the fields of a given version of a tabledefinition in the DataSetDefinition
        that have the given fieldtype.

        This call is deprecated, use get_fields_with_datatype instead.
        """

        logging.warning(
            "DataSetDefinition.list_fields_of_type. Highly deprecated, please use get_fields_with_datatype instead.")
        if self.is_table_dropped(table_name=table, version=version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")
        return self.get_fields_with_datatype(table, datatype, version)

    def get_fields_with_datatype(self, table, datatype, version=0):
        version = version if version else self.get_current_version(table)
        datatype = self.translate_datatype(datatype)
        fields = self.get_fields_with_instructions(table, ["datatype"], version)
        datatype = datatype.lower()
        fieldlist = list(filter(lambda f: self.translate_datatype(fields[f]['datatype'][0]) == datatype, fields))

        return fieldlist

    def get_field_datatype(self, table, field, version=0) -> str:
        """
        returns the datatype set by the datatype instruction for a field of a table
        :param table: the table
        :param field: the field
        :param version: optional version
        :return: the datatype (in lowercase letters) or ""
                 if not field does not exist or the instruction is missing.

        :changes:
                02.12.2020: now returns only lowercase types.
        """
        fields = self.get_fields_with_instructions(table, ["datatype"], version=version)
        if field in fields:
            return self.translate_datatype(fields[field]['datatype'][0])
        return ""

    def get_modified_field(self, table) -> str:
        """
            returns the field with instruction replfield_modified from the given table of the DSD.
            :param table: the table
            :returns: the field name or ""
        """

        fields = self.get_fields_with_instructions(table, ["replfield_modified"])
        if len(fields) == 1:
            return next(iter(fields.keys()))
        return ""

    def get_uuid_field(self, table, version: int = 0) -> str:
        """
            returns the field with instruction REPLFIELD_UUID from the given table of the DSD.
            :param table: the table
            :param version: optional
            :returns: the field name or ""
        """

        fields = self.get_fields_with_instructions(table, ["replfield_uuid"], version)
        if len(fields) == 1:
            return next(iter(fields.keys()))
        return ""

    def list_fields_with_additional_type(self, table, fieldtype, version=0):
        """ returns a list of the fields of a given version of a tabledefinition in the DataSetDefinition
        that have the given additional fieldtype. The datatype is compared, too, so that the method serves
        the same purpose as list_fields_of_type, but includes additional fieldtypes.

        .. note::

           DEPRECATED!"""

        logging.info("DataSetDefinition.list_fields_with_additional_type: Deprecated, "
                     "please use list_fields_with_instructions instead.")

        if self.is_table_dropped(table_name=table, version=version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        version = version if version else self.get_current_version(table)
        return list(self.get_fields_with_instructions(table, [fieldtype], version).keys())

    def get_proxy_field_reference(self, table, field, version=0, test=False):
        """ returns the field name given by the attribute "PROXY_FOR()" of the given field
            works only in the files table and is a bit of relict.
        
        """

        if table == self.files_table:
            if self.is_table_dropped(table_name=table, version=version):
                raise DSDTableDropped(f"{table}, version {version} dropped.")
            try:
                version = version if version else self.get_current_version(table)
                instructions = self.get_field_instructions(table, field, version)
                if "proxy_for" in instructions:
                    return instructions["proxy_for"][0]
            except Exception as e:
                logging.error("DataSetDefinition.get_proxy_field_reference: Exception " + repr(e))
                if test: raise e

        return ""

    def list_fields_with_instruction(self, table: str, instruction: str) -> []:
        """
        list all fields of a table that have a certain instruction
        :param table:
        :param instruction:
        :return: list of field names, can be empty.
        """
        fields_with_instructions = self.get_fields_with_instructions(table, [instruction])
        return [field for field, _ in fields_with_instructions.items()]

    def list_file_fields(self):
        """ returns a dictionary with tables as keys pointing to an array of fields per table that have the uid_file()
            instruction.
        """
        result = {}
        for t in self.list_tables():
            fields = self.list_fields_with_instruction(t, "uid_file")
            if fields:
                result[t] = fields
        return result

    def get_description_field_for_file_field(self, table, file_field):
        '''
            returns the name of the field(s) that have a describes_file - attribute referring to the given file_field.
            Does not check, whether or not file_field is actually marked as FILE_FIELD in the DSD.
        '''

        file_field = file_field.lower()
        fields = [x for x in self.list_fields_with_additional_type(table, "describes_file")
                  if self.get_attribute_reference(table, x, "describes_file").lower() == file_field]
        return fields

    def get_file_field_reference(self, table, field, version=0):
        """ returns the field name given by the attribute "FILE_FOR()" of the given field 
        """

        if self.is_table_dropped(table_name=table, version=version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        try:
            version = version if version else self.get_current_version(table)
            instructions = self.get_field_instructions(table, field, version)
            return instructions["file_for"][0]
        except Exception as e:
            logging.error("DataSetDefinition.get_file_field_reference: Exception " + repr(e))

        return ""

    def get_field_label(self, table, field, version=0, glossary=None):
        """
        returns the label for a dsd field. It is either set by the "label()" instruction or will simply be
        the name given by the parameter "field".
        :param table: the dsd table
        :param field: field in the dsd table
        :param version: the version of the dsd table
        :param glossary: A KioskGlossary object
        :return: string
        """
        # noinspection PyBroadException
        try:
            if not glossary and self._glossary:
                glossary = self._glossary

            version = version if version else self.get_current_version(table)
            params = self.get_instruction_parameters(table, field, 'label', version)
            if params:
                if glossary:
                    return glossary.get_term(params[0], 1, auto_plural=False)
                else:
                    return params[0]
        except Exception as e:
            pass

        return field.replace("_", " ")

    def get_attribute_reference(self, table, field, attribute, version=0):
        """ returns the value given in brackets of the given attribute of the given field.
            returns \"\" if the field does not have that attribute or whatever else happens 
            .. note::

            DEPRECATED!"""

        logging.info("DataSetDefinition.get_attribute_reference: Deprecated, "
                     "please use get_field_instructions instead.")

        if self.is_table_dropped(table_name=table, version=version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        try:
            version = version if version else self.get_current_version(table)
            instructions = self.get_field_instructions(table, field, version)
            return instructions[attribute][0]
        except Exception as e:
            logging.error("DataSetDefinition.get_attribute_reference: Exception " + repr(e))

        return ""

    def get_instruction_parameters_and_types(self, table, field, instruction, version=0) -> list:
        """ returns a list of tuples of values and types of a given instruction of a given field.
            the tuples consist of (value, type) like this:
            type is "string" if the value is a string e.G. DEFAULT("lkh") or better DEFAULT("'lkh'")
                    the value does not include the parentheses anymore\n
            type is "number" if the value in the instruction's brackets is a number, e.G. DEFAULT("12.2")
            type is "function" if the value in the instruction's brackets is a function e.G. DEFAULT("now()")
            type is "other" if there is a value in brackets but not of any of the distinct types, like DEFAULT(NULL)

            returns an empty list if the instruction does not exist or if it has no parameters.

        """
        version = version if version else self.get_current_version(table)
        if self.is_table_dropped(table_name=table, version=version):
            raise DSDTableDropped(f"{table}, version {version} dropped.")

        parameters = self.get_instruction_parameters(table, field, instruction, version)
        if parameters is None:
            return []

        result = []
        for parameter in parameters:
            reference = re.search(r'^\s*(?P<value>.*?\(.*?\))\s*$', parameter)
            if reference:
                result.append((reference.group("value"), "function"))
                break

            reference = re.search(r'^\s*(?P<value>[\d\.\,]*)\s*$', parameter)
            if reference:
                result.append((reference.group("value"), "number"))
                break

            reference = re.search(r'^\s*"(?P<value>.*?)\s*"$', parameter)
            if reference:
                result.append((reference.group("value"), "string"))
                break

            reference = re.search(r'^\s*\'(?P<value>.*?)\'\s*$', parameter)
            if reference:
                result.append((reference.group("value"), "string"))
                break

            reference = re.search(r'^\s*(?P<value>.*?)\s*$', parameter)
            if reference:
                result.append((reference.group("value"), "other"))
                break

        return result

    def get_attribute_reference_value_and_type(self, table, field, attribute, version=0):
        """ returns the value and the type of a value given in brackets of a given attribute of a given field.

            returns \"string\" if the value in the attribute's brackets has parentheses, e.G. DEFAULT("lkh")
                the value in this case does not include the parentheses anymore\n
            returns \"number\" if the value in the attribute's brackets is a number, e.G. DEFAULT("12.2")
            returns \"function\" if the value in the attribute's brackets is a function e.G. DEFAULT(now())
            returns \"other\" if there is a value in brackets but not of any of the distinct types, like DEFAULT(NULL)
            returns \"\" as value and type if there is not attribute or nothing in brackets 
            .. note::
            D E P R E C A T E D! use get_instruction_parameters_and_types instead
        """

        logging.warning("DataSetDefinition.get_excavation_context_reference: Obsolete, "
                        "Use get_field_instructions instead.")

    def delete_table(self, table):
        """ deletes a whole table definition from the dsd. If the definition did not exist
        in the first place, the result is all the same: the table is gone after this call.  """
        return self._dsd_data.delete([table])

    def find_migration_instruction(self, table, find_instruction: str, version, upgrade=True) -> dict:
        """ returns a certain migration instruction with parameters if it exists in the migration
            section of the given table and version:
            :param table:   the dsd_table name
            :param find_instruction: the instruction to find
            :param version: the version or 0 if the recent version is requested.
            :param upgrade:  Default True. State False if you want to search the downgrade section
            :return: a dictionary with the instruction as key and a list of parameters as value:
                        {"instruction": ["param1", "param2"]
        """
        parser = SimpleFunctionParser()

        direction = "upgrade" if upgrade else "downgrade"

        for instruction in self._dsd_data.get([table, KEY_TABLE_MIGRATION, version, direction]):
            if find_instruction:
                parser.parse(instruction)
                if parser.ok:
                    if parser.instruction == find_instruction:
                        return {parser.instruction: parser.parameters}
                else:
                    raise DSDInstructionSyntaxError(instruction)

        return {}

    def get_migration_instructions(self, table, version, upgrade=True) -> list:
        """ returns a list with parsed migration instructions and their parameters as dicts, like this:
            [{instruction1: [param1, param2]}, {instruction2: [param1, param2]}]
        """
        result = []
        parser = SimpleFunctionParser()

        direction = "upgrade" if upgrade else "downgrade"

        for instruction in self._dsd_data.get([table, KEY_TABLE_MIGRATION, version, direction]):
            parser.parse(instruction)
            if parser.ok:
                result.append({parser.instruction: parser.parameters})
            else:
                raise DSDInstructionSyntaxError(instruction)

        return result

    def get_former_table_names(self, dsd_table: str, version: int = 0) -> list:
        """ returns former names of this table up to the given version (or the recent version)
            The list is sorted from most recent version down to the oldest.
        :param dsd_table: the current name of the table in the dsd (no matter what version)
        :param version: if given, only the names of tables earlier or equal this version are listed
        :returns: a list with tuples: [("dsd_table_name", version)]

        """
        result = []
        if not version:
            version = self.get_current_version(dsd_table)
        if version > 1:
            for ver in range(version, 1, -1):
                instruction = self.find_migration_instruction(dsd_table, "rename_table", version=ver)
                if instruction:
                    result.append((instruction["rename_table"][0], ver))
        return result

    def _identify_files_table(self):
        """
        identifies a new files table (and the filename field) in the current state of the dsd. This will run whenever the dsd is extended.
        :return: number of file tables found. 1 is ok. 0 is none at all. Everything >1 should not happen. The
                 actual files_table can be accessed via attribute self.files_table
        """
        tables = self.list_tables()
        self.files_table = ""
        c = 0
        for table in tables:
            if self.get_fields_with_instructions(table, ["file_for"]):
                c += 1
                if self.files_table:
                    logging.error(f"{self.__class__.__name__}._identify_files_table: There is another files table"
                                  f" called {table}. The first files table found was {self.files_table}")
                else:
                    self.files_table = table
                    filename_fields = self.get_fields_with_instruction(table, "filename")
                    if filename_fields:
                        self.files_table_filename_field = filename_fields[0]
                    else:
                        self.files_table_filename_field = "filename"

        return c

    def table_has_meta_flag(self, table: str, required_flags) -> list:
        """
        checks if a table has a certain meta flag. Use the KEY_TABLE_FLAG_* constants in dsdcontants
        :param table: the table.
        :param required_flags: a single flag or a list of flags
        :return: a list of the required meta-flags the table actually has. Can be empty.
        """
        try:
            if isinstance(required_flags, str):
                required_flags = [required_flags]
            flags = self._dsd_data.get([table, KEY_TABLE_META_DATA, "flags"])
            return list(set(required_flags) & set(flags))
        except KeyError:
            return []
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.table_has_meta_flags: {table}/{KEY_TABLE_META_DATA}/flags threw "
                          f"exception: {repr(e)}")
            raise e

    def get_fork_option(self, table, option):
        """
        returns a specific option from "fork_options" in the meta data of the table
        :param table: the table with the meta data
        :param option: the option under "fork_options"
        :return: a dict (or whatever) with the fork option or None
        """
        try:
            fork_option = self._dsd_data.get([table, KEY_TABLE_META_DATA, "fork_options", option])
            return fork_option
        except KeyError:
            pass
        return None

    def get_import_filter(self, table, databasetype="fm12"):
        """
        returns a database engine specific import filter. Default is filemaker (fm12).
        :param databasetype: an identifier used in the dsd for a certain database engine. Currently we only support
                             Filemaker, which files as "fm12"
        :param table: the table with the meta data
        :return: a where statement (without the key word where) or an empty string.
        :exception: Can throw all kinds of Exceptions, except for KeyError.
        """
        try:
            import_filter = self._dsd_data.get([table, KEY_TABLE_META_DATA, KEY_TABLE_META_IMPORT_FILTER, databasetype])
            return import_filter
        except KeyError:
            pass
        return ""

    def all_precondition_tables_exist(self, script: dict) -> bool:
        """
        checks if all the tables in the precondition list are actually defined in the dsd.
        :param script: a dictionary with the script definition
        :return: True/False
        """
        tables = self.list_tables()
        if "preconditions" in script:
            for table in script["preconditions"].keys():
                if table not in tables:
                    return False
        return True

    def get_migration_scripts(self, project_id, check_precondition_tables=False) -> dict:
        """
        returns the contents of config/migration_scripts from the dsd.
        A script is only included according to disable_projects or enable_projects, if present.
        :param project_id: The current project's id.
        :param check_precondition_tables: if set then a script is only included
                                          if all preconditions refer to tables that actually exist in the dsd.
        :return: a dict with the contents of migration_scripts or an empty dict.
        """
        if KEY_CONFIG_MIGRATION_SCRIPTS in self._dsd_data.get([KEY_CONFIG]):
            all_scripts = self._dsd_data.get([KEY_CONFIG, KEY_CONFIG_MIGRATION_SCRIPTS])
            scripts = {}
            for script_id in all_scripts.keys():
                script = all_scripts[script_id]
                if check_precondition_tables:
                    if not self.all_precondition_tables_exist(script):
                        # logging.debug(f"{self.__class__.__name__}.get_migration_scripts: "
                        #               f"cross-table-migration script {script_id} skipped because "
                        #               f"it refers to at least one table unknown to the dsd.")
                        continue

                if not ("disable_projects" in script and project_id in script["disable_projects"]):
                    if "enable_projects" in script:
                        if project_id in script["enable_projects"]:
                            scripts[script_id] = script
                    # the old "projects" key is still supported
                    elif "projects" in script:
                        if project_id in script["projects"]:
                            scripts[script_id] = script
                    else:
                        scripts[script_id] = script

            return scripts
        else:
            return {}

    def list_context_tables(self) -> list:
        """
        returns the names of all tables that have an identifier.
        :return: list with table names or an empty list
        """
        return self.list_tables_with_instructions(["identifier"])

    def get_context(self, context_name: str) -> dict:
        """
        returns the context definition of the given context
        :param context_name: name of the context.
        :return: a dict with the definition of the context.
        :exception: Throws an DSDError if the context does not exist.
        """
        if KEY_CONFIG_CONTEXTS in self._dsd_data.get([KEY_CONFIG]):
            if context_name not in self._dsd_data.get([KEY_CONFIG, KEY_CONFIG_CONTEXTS]):
                raise DSDError(f"Context {context_name} not defined.")

        return self._dsd_data.get([KEY_CONFIG, KEY_CONFIG_CONTEXTS, context_name])

    def get_context_names(self, context_type: str = "") -> list:
        """
        returns the names of all context definitions of the given type
        :param context_type: qualifies the list of context definition names if given.
        If not given all context definition names will be returned
        :return: list of context definition names depending on context_type
        """
        context_names = []
        if KEY_CONFIG_CONTEXTS in self._dsd_data.get([KEY_CONFIG]):
            if context_type:
                context_names = [ctx_name for ctx_name in self._dsd_data.get([KEY_CONFIG, KEY_CONFIG_CONTEXTS])
                                 if self._dsd_data.get([KEY_CONFIG,
                                                        KEY_CONFIG_CONTEXTS,
                                                        ctx_name,
                                                        "type"]) == context_type]
            else:
                context_names = list(self._dsd_data.get([KEY_CONFIG, KEY_CONFIG_CONTEXTS]))

        return context_names

    def list_default_file_locations(self, refresh=False) -> dict:
        """
        returns a dict with identifier fields mapped to default file locations:

        :return: dict like {table with identifier: (table with file field, file-field)}
        """
        if not self._default_locations or refresh:
            self._default_locations = {}
            tables = self.list_tables_with_instructions([KEY_INSTRUCTION_FILE_LOCATION_FOR])
            for t in tables:
                fields = self.get_fields_with_instructions(t, [KEY_INSTRUCTION_FILE_LOCATION_FOR])
                for f in fields:
                    for param in fields[f][KEY_INSTRUCTION_FILE_LOCATION_FOR]:
                        if param in self._default_locations:
                            logging.warning(f"{self.__class__.__name__}.list_default_file_locations: "
                                            f"{param} has more than one default_file_locations: "
                                            f"{self._default_locations[param]} and {t}")
                        self._default_locations[param] = (t, f)

        return self._default_locations

    def get_default_file_location_for(self, table):
        """
        returns the default file location for an identifier field.
        (well, in fact rather for all the identifier fields of the table)

        :param table: a table with at least one identifier() field.
        :return: the default file location (table, field) for the table if there is one, otherwise an empty tuple
        :exception: raises DSDSemanticError of the table has no identifier() field
        """
        try:
            assert self.get_fields_with_instruction(table, KEY_INSTRUCTION_IDENTIFIER)[0]
        except BaseException as e:
            raise DSDSemanticError(f"{self.__class__.__name__}.get_default_file_location_for: table {table} "
                                   f"has no identifier field.")

        locations = self.list_default_file_locations()
        if table in locations:
            return locations[table]
        else:
            return tuple()

    def list_all_file_locations(self, refresh=False) -> dict:
        """
        returns a dict with tables (only those with at least one identifier field)
        mapped to a list of file locations. This returns all file locations established by
        using either a file_location_for or a file_assigned_to instruction on a file field (uid_file).

        :return: dict like {table with identifier: [(table with uid_file field, uid_file field)]}
        """
        if not self._file_locations or refresh:
            self._file_locations = {}
            tables = self.list_tables_with_instructions([KEY_INSTRUCTION_FILE_LOCATION_FOR])
            tables.extend(self.list_tables_with_instructions([KEY_INSTRUCTION_FILE_ASSIGNED_TO]))
            for t in set(tables):
                fields = self.get_fields_with_instructions(t, [KEY_INSTRUCTION_FILE_LOCATION_FOR,
                                                               KEY_INSTRUCTION_FILE_ASSIGNED_TO])
                for f in fields:
                    instructions = fields[f]
                    if KEY_INSTRUCTION_FILE_LOCATION_FOR in instructions:
                        params = instructions[KEY_INSTRUCTION_FILE_LOCATION_FOR]
                    else:
                        params = instructions[KEY_INSTRUCTION_FILE_ASSIGNED_TO]

                    for param in params:
                        if param in self._file_locations:
                            self._file_locations[param].append((t, f))
                        else:
                            self._file_locations[param] = [(t, f)]

        return self._file_locations

    def get_assigned_file_locations(self, table):
        """
        returns all possible file locations (tables) for an identifier field.
        (well, in fact rather for all the identifier fields of the table)
        Those tables have either a file_location_for or a file_assigned_to instruction on a file field (uid_file).

        :param table: a table with at least one identifier() field.
        :return: a list of tuples (table, field) storing a possible file locations. Otherwise an empty list
        :exception: raises DSDSemanticError of the table has no identifier() field
        """
        try:
            assert self.get_fields_with_instruction(table, KEY_INSTRUCTION_IDENTIFIER)[0]
        except BaseException as e:
            raise DSDSemanticError(f"{self.__class__.__name__}.get_assigned_file_locations: table {table} "
                                   f"has no identifier field.")

        locations = self.list_all_file_locations()
        if table in locations:
            return locations[table]
        else:
            return []

    def list_identifier_fields(self, table: str) -> list:
        """
        returns a list of fields with instruction identifier()
        :param table:
        :return:
        """
        return self.get_fields_with_instruction(table, KEY_INSTRUCTION_IDENTIFIER)

    def get_default_join(self, root_table: str, table: str) -> Join:
        fields = self.get_fields_with_instructions(table, ["join"])
        join: Join = None
        if not fields:
            raise DSDJoinError(f"DataSetDefinition.get_default_join: Table {table} "
                               f"has no default join.")

        for field in fields.keys():
            join_params = fields[field]["join"]
            if join_params[0] == root_table:
                if len(join_params) > 1:
                    if len(join_params) > 2:
                        join = Join(root_table, table, "inner", related_field=field, root_field=join_params[1],
                                    quantifier=join_params[2])
                    else:
                        join = Join(root_table, table, "inner", related_field=field, root_field=join_params[1])
                else:
                    join = Join(root_table, table, "inner", related_field=field, root_field="replfield_uuid()")
            # if join:
            #     break

        if join:
            parser = SimpleFunctionParser()
            parser.parse(join.root_field)
            if parser.ok:
                root_fields = self.get_fields_with_instructions(root_table, [parser.instruction])
                if root_fields:
                    join.root_field = list(root_fields.keys())[0]
                else:
                    raise DSDJoinError(f"DataSetDefinition.get_default_join: Root table {join.root_table} "
                                       f"has no field with instruction {parser.instruction}: "
                                       f"Wrong default join in {table}.")
            else:
                if join.root_field not in self.list_fields(root_table):
                    raise DSDJoinError(f"DataSetDefinition.get_default_join: Root table {join.root_table} "
                                       f"has no field {join.root_field}: "
                                       f"Wrong default join in {table}.")
        else:
            raise DSDJoinError(f"DataSetDefinition.get_default_join: Table {table} "
                               f"has no default join with root table {root_table}.")

        return join

    def list_default_joins(self, include_lookups=False) -> dict:
        """
        returns a dictionary of all joins between tables.

        :returns dict: The key is  the root table.
                       The value is a list of Join instances referring to that root table.
        """
        joins = {}
        tables = self.list_tables_with_instructions(["join"])
        for t in tables:
            fields = self.get_fields_with_instructions(t, ["join"])
            for field in fields:
                try:
                    join = self.get_instruction_parameters(t, field, "join")
                    if join[0] not in joins:
                        joins[join[0]] = []

                    joins[join[0]].append(Join(root_table=join[0],
                                               related_table=t,
                                               _type="inner",
                                               root_field="replfield_uuid()" if len(join) == 1 else join[1],
                                               related_field=field
                                               ))
                except BaseException as e:
                    raise DSDError(f"{self.__class__.__name__}.list_default_joins: Exception processing field "
                                   f"{t}.{field}: {repr(e)}")

        if include_lookups:
            tables = self.list_tables_with_instructions(["lookup"])
            for t in tables:
                fields = self.get_fields_with_instructions(t, ["lookup"])
                for field in fields:
                    try:
                        join = self.get_instruction_parameters(t, field, "lookup")
                        if t not in joins:
                            joins[t] = []
                        joins[t].append(Join(root_table=t,
                                             related_table=join[0],
                                             _type="lookup",
                                             root_field=field,
                                             related_field="replfield_uuid()" if len(join) == 1 else join[1]
                                             ))
                    except BaseException as e:
                        raise DSDError(f"{self.__class__.__name__}.list_default_joins: "
                                       f"Exception processing lookup for field "
                                       f"{t}.{field}: {repr(e)}")

        return joins

    def get_lookup_join(self, root_table: str, table: str) -> Join:
        fields = self.get_fields_with_instructions(root_table, ["lookup"])
        join: Join = None
        if not fields:
            raise DSDJoinError(f"DataSetDefinition.get_lookup_join: Table {table} "
                               f"has no lookup join.")

        for field in fields.keys():
            join_params = fields[field]["lookup"]
            if join_params[0] == table:
                if len(join_params) > 1:
                    if len(join_params) > 2:
                        join = Join(root_table, table, "lookup", root_field=field, related_field=join_params[1],
                                    quantifier=join_params[2])
                    else:
                        join = Join(root_table, table, "lookup", root_field=field, related_field=join_params[1])
                else:
                    join = Join(root_table, table, "lookup", root_field=field, related_field="replfield_uuid()")

        if join:
            parser = SimpleFunctionParser()
            parser.parse(join.related_field)
            if parser.ok:
                related_fields = self.get_fields_with_instructions(join.related_table, [parser.instruction])
                if related_fields:
                    join.related_field = list(related_fields.keys())[0]
                else:
                    raise DSDJoinError(f"DataSetDefinition.get_lookup_join: related table {join.related_table} "
                                       f"has no field with instruction {parser.instruction}: "
                                       f"Wrong lookup join in {root_table}.")
            else:
                if join.related_field not in self.list_fields(join.related_table):
                    raise DSDJoinError(f"DataSetDefinition.get_lookup_join: Related table {join.related_table} "
                                       f"has no field {join.related_field}: "
                                       f"Wrong lookup join in {root_table}.")
        else:
            raise DSDJoinError(f"DataSetDefinition.get_lookup_join: Table {root_table} "
                               f"has no lookup join to table {table}.")

        return join

    def list_root_tables(self):
        """
        a little helper to fetch those tables from the dsd that do not have a join statement
        but DO have an identifier.

        :returns: list of tables or []

        """
        joining_tables = self.list_tables_with_instructions(["join"])
        return [t for t in self.list_tables()
                if t not in joining_tables
                and self.list_fields_with_instruction(t, "identifier")]

    def get_field_or_instructions(self, data_table, field_or_instruction):
        """
        if given an instruction (parses as a valid instruction, so needs at least brackets: () )
        this returns a list of field names which have the instruction.
        If field_or_instruction does not parse, it is considered a field name and if the field exists in the
        table it is returned.
        :param data_table: the table
        :param field_or_instruction: the field or fields with instruction wanted
        :return: a list of field names or [] if the field or instruction cannot be found.
        :exception: throws all kinds of exceptions, e.G. if no field has the requested instruction)
        """
        parser = SimpleFunctionParser()
        parser.parse(field_or_instruction)
        if parser.ok:
            fields = self.get_fields_with_instruction(data_table, parser.instruction)
            if fields:
                return fields
            else:
                return []
        else:
            if field_or_instruction in self.list_fields(data_table):
                return [field_or_instruction]
            else:
                return []

    def pprint(self, key="", width=200) -> str:
        """
        returns a large string with the current dsd settings as they would appear in yaml.

        :param key: if only a certain table of the dsd is requested
        :param width: max-width of each line
        :return:
        """
        return self._dsd_data.pprint(key=key, width=width)

    def get_file_fields_with_description_fields(self):
        """
            returns a nested structure with table as the main-key, unveiling a dictionary with file-fields, pointing to
            their description field.
            A table is only in there if it actually has a file-field with a description. Accordingly, a field is only
            in the dictionary of a table if it actually has a description field.
        """
        result = {}
        fields = self.list_file_fields()
        for t, file_flds in fields.items():
            for file_fld in file_flds:
                try:
                    dsc_fields = self.get_description_field_for_file_field(t, file_fld)
                    if dsc_fields:
                        dsc_fld = self.get_description_field_for_file_field(t, file_fld)[0]
                        if t in result:
                            result[t].append((file_fld, dsc_fld))
                        else:
                            result[t] = [(file_fld, dsc_fld)]
                except Exception as e:
                    logging.error("Exception in DataSetDefinition.get_file_fields_with_description_fields: " + repr(e))

        result["images"] = [("uid", "description"), ("uid", "export_filename")]
        return result

    def get_lookup_joins(self, table: str) -> List[Join]:
        """
        returns Join objects for all lookup joins that a table has to others
        :param table: the root table
        :return: a list of Join objects
        """
        result = []
        fields = self.get_fields_with_instruction(table, "lookup")
        for field in fields:
            lookup_parameters = self.get_instruction_parameters(table, field, "lookup")
            if not (lookup_parameters and len(lookup_parameters) > 0):
                raise DSDError(f"{self.__class__.__name__}.get_lookup_joins: "
                               f"{table} has wrong lookup join in field {field}")

            lookup_table = lookup_parameters[0]
            if not self.table_is_defined(lookup_table):
                raise DSDError(f"{self.__class__.__name__}.get_lookup_joins: "
                               f"{table} has lookup reference to unknown table {lookup_table}")

            parser = SimpleFunctionParser()
            if len(lookup_parameters) == 1:
                lookup_field = "replfield_uuid()"
            else:
                lookup_field = lookup_parameters[1]

            parser.parse(lookup_parameters[1])
            if parser.ok:
                lookup_fields = self.get_fields_with_instruction(lookup_table, parser.instruction)
                if not (lookup_fields and len(lookup_fields) == 1):
                    raise DSDError(f"{self.__class__.__name__}.get_lookup_joins: "
                                   f"{table} has lookup reference to {lookup_table}/{lookup_field} but "
                                   f"the instruction cannot be resolved or belongs to more than one field")
                lookup_field = lookup_fields[0]

            if lookup_field not in self.list_fields(lookup_table):
                raise DSDError(f"{self.__class__.__name__}.get_lookup_joins: "
                               f"{table} has lookup reference to {lookup_table}/{lookup_field} but "
                               f"that field does not exist")

            join = Join(root_table=table, related_table=lookup_table, root_field=field, related_field=lookup_field)
            result.append(join)

        return result

    def table_can_sync(self, table: str, version: int = 0) -> bool:
        """
        checks if a table has a replfield_uuid field.
        :param table: the table
        :param version: optional version (an int)
        :return: true or false
        :raises DSDTableDropped if the table is dropped in the given version and other exceptions
        """
        if self.get_uuid_field(table, version):
            return True

        return False

    def get_tz_type_for_field(self, tablename: str, field_name: str, version: int = 0) -> str:
        """
        checks if a field must be rendered in user's time zone or recording time zone (or default rendering is on).
        Note that field with the "replfield_modified" instruction will always be "u".

        Default is "" -> no type specified or called for

        :param tablename: the table
        :param field_name: the field
        :param version: optional version
        :return: "u" for user's time zone, "r" for recording time zone, "" for not specified
        """
        params = self.get_instruction_parameters(tablename, field_name, "tz_type", version=version)
        u_instructions = self.get_field_instructions(tablename,
                                                     field_name,
                                                     patterns=["replfield_modified", "replfield_created","proxy_for"])
        if params:
            if params[0] in ["r", "u"]:
                if params[0] == "r":
                    if u_instructions:  # and ("replfield_modified" in u_instructions or "proxy_for" in u_instructions):
                        logging.warning(f"{self.__class__.__name__}.get_tz_type_for_field: "
                                        f"The replfield_modified field {tablename}.{field_name} "
                                        f"has a tz_type(r) definition which is ignored.")
                        return "u"
                return params[0]

            raise DSDInstructionValueError(f"field {tablename}.{field_name} "
                                           f"has wrong parameter for instruction 'tz_type'")

        return "u" if u_instructions else ""
