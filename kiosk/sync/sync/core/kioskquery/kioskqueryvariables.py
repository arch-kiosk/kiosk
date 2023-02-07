import copy

import kioskstdlib
from kioskquery.kioskquerylib import *
from simplefunctionparser import SimpleFunctionParser
from databasedrivers import DatabaseDriver


class KioskQueryVariables:
    def __init__(self, variable_definitions: dict):
        self._variable_definitions = copy.deepcopy(variable_definitions)
        self._variables = {}
        self._parse_variable_definitions()

    def _parse_variable_declaration(self, decl):
        result = {}
        if isinstance(decl, str):
            decl = [decl]

        for cmd in decl:
            parser = SimpleFunctionParser()
            parser.parse(cmd)
            if not parser.ok:
                raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                          f"syntax error in declaration {decl}.")
            if parser.instruction == "datatype":
                result["datatype"] = parser.parameters[0].lower()
            else:
                raise KioskQueryException(f"{self.__class__.__name__}._parse_variable_declaration: "
                                          f"syntax error in declaration {decl}: "
                                          f"unknown instructon {parser.instruction}.")

        return result

    def _parse_variable_definitions(self):
        for vname, decl in self._variable_definitions.items():
            self._variable_definitions[vname] = self._parse_variable_declaration(decl)

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
        return self._variable_definitions

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
