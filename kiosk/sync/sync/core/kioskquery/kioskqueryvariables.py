import copy

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import *
from simplefunctionparser import SimpleFunctionParser
from databasedrivers import DatabaseDriver


class KioskQueryVariables:
    def __init__(self, variable_definitions: dict):
        self._variables = {}
        self._variable_definitions = self._parse_variable_definitions(variable_definitions)

    def _parse_dsd_instruction(self, vname: str, cmd: str):
        parser = SimpleFunctionParser()
        parser.parse(cmd)
        if not parser.ok:
            raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                      f"syntax error when parsing dsd instruction: {cmd}.")
        if len(parser.parameters) not in [1, 2]:
            raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                      f"dsd instruction requires one or two parameters {cmd}.")

        dsd_table = parser.parameters[0]
        dsd_field = vname
        if len(parser.parameters) == 2:
            dsd_field = parser.parameters[1]

        dsd = Dsd3Singleton.get_dsd3()
        field_instructions = dsd.get_unparsed_field_instructions(dsd_table, dsd_field)
        field_instructions.append(f"dsd_table({dsd_table})")
        field_instructions.append(f"dsd('{dsd_table}','{dsd_field}')")
        return field_instructions

    def _parse_variable_declaration(self, vname: str, decl: list):
        result = {}
        field_instructions = {}
        parser = SimpleFunctionParser()

        if isinstance(decl, str):
            decl = [decl]

        for cmd in decl:
            if "dsd(" in cmd:
                field_instruction_list = self._parse_dsd_instruction(vname, cmd)
                for f in field_instruction_list:
                    key = parser.get_instruction_name_only(f)
                    if not key:
                        raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                                  f"syntax error in dsd field instruction bound by {cmd}.")
                    field_instructions[key.lower()] = f

        # at this point all the dsd instructions are in field_instructions.
        for cmd in decl:
            instruction = parser.get_instruction_name_only(cmd)
            if not instruction:
                raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                          f"syntax error in declaration {decl}.")

            if instruction == "datatype":
                # datatype is not supposed to override the datatype set by the dsd (if any)
                if "datatype" not in field_instructions.keys():
                    field_instructions["datatype"] = cmd
            else:
                if instruction != "dsd":
                    field_instructions[instruction] = cmd

        # at this point we have the datatype of the dsd and all the dsd instructions overridden with the
        # variable-specific instructions
        if "datatype" not in field_instructions.keys():
            raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                      f"no datatype for variable in {decl}.")

        parser.parse(field_instructions["datatype"])
        if not parser.ok or len(parser.parameters) != 1:
            raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                      f"syntax error in datatype instruction resulting from {decl}.")

        result["datatype"] = parser.parameters[0].lower()
        result["instructions"] = list(field_instructions.values())

        return result

    def _parse_variable_definitions(self, base_definitions: dict) -> dict:
        result = {}
        for vname, decl in base_definitions.items():
            result[vname] = self._parse_variable_declaration(vname, decl)
        return result

    def has_variable_declaration(self, key: str):
        return key in self._variable_definitions

    def has_variable(self, key: str):
        return key in self._variables

    def set_variable(self, key: str, value):
        key = key.lower()
        if key not in self._variable_definitions:
            raise KioskQueryException(f"{self.__class__.__name__}.set_variable: Variable {key} "
                                      f"not declared in reporting definition")
        if self.get_variable_type(key) in ["date", "datetime", "time", "timestamp"]:
            try:
                kioskstdlib.str_to_iso8601(value)
            except ValueError:
                raise KioskQueryException(f"{self.__class__.__name__}.set_variable: attempt to set variable {key} "
                                          f"with a date {value} that does not comply with iso-8601.")

        self._variables[key] = value

    def get_variable_type(self, key: str):
        """
        returns the dsd type of a variable.
        :param key: the variable name
        :return: the lowercase type
        """
        if key not in self._variable_definitions:
            raise KioskQueryException(f"{self.__class__.__name__}.get_variable_raw: Variable {key} "
                                      f"not declared in reporting definition")
        return self._variable_definitions[key]["datatype"]

    def get_variable_raw(self, key: str):
        if key not in self._variable_definitions:
            raise KioskQueryException(f"{self.__class__.__name__}.get_variable_raw: Variable {key} "
                                      f"not declared in reporting definition")
        return self._variables[key]

    def get_variable_sql(self, key):
        if key not in self._variable_definitions:
            raise KioskQueryException(f"{self.__class__.__name__}.get_variable_sql: Variable {key} "
                                      f"not declared in reporting definition")
        data_type = DatabaseDriver.convert_dsd_datatype(self._variable_definitions[key]["datatype"])
        if "is_list" in self._variable_definitions[key]:
            return self.get_list_variable_sql(data_type, self._variables[key])
        else:
            return DatabaseDriver.quote_value(data_type, self._variables[key])

    @staticmethod
    def get_list_variable_sql(data_type: str, list_value: list):
        sql_list = []
        for value in list_value:
            sql_list.append(DatabaseDriver.quote_value(data_type, value))
        return ",".join(sql_list)

    def get_variables_dict(self):
        return self._variables

    def get_variable_definitions(self):
        result = {}
        for k, v in self._variable_definitions.items():
            result[k] = copy.copy(v["instructions"])
        return result

    def add_constants(self, settings: dict):
        for key, value in settings.items():
            is_list = False
            if isinstance(value, list):
                is_list = True
                datatype_value = value[0]
            else:
                datatype_value = value

            if isinstance(datatype_value, str):
                datatype = 'varchar'
            elif isinstance(datatype_value, int):
                datatype = 'int'
            elif isinstance(datatype_value, float):
                datatype = 'float'
            else:
                raise KioskQueryException(f"{self.__class__.__name__}.add_constant: "
                                          f"datatype undeterminable for constant setting {key} ")

            self._variable_definitions[key] = {"datatype": datatype}
            if is_list:
                self._variable_definitions[key]["is_list"] = True

            self._variables[key] = value
