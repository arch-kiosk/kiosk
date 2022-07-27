from dsd.dsd3 import DataSetDefinition, DSDInstructionSyntaxError, DSDUnknownInstruction
from simplefunctionparser import SimpleFunctionParser

import os


class DSDView:
    def __init__(self, dsd: DataSetDefinition):
        """
        instantiates a dsdview object and clones the given dsd
        :param dsd: The underlying data set definition to clone
        """
        assert "config" in dsd._dsd_data.get([])
        self.dsd = dsd.clone()
        self.include_tables = []

    @staticmethod
    def load_view_from_file(path_and_filename: str, loader=None) -> dict:
        """
        loads view instructions from a file and returns them independently of the view.
        They have to be applied with apply_view_instructions.
        :param path_and_filename: path and filename of the instruction set
        :param loader: a loader instance. e.G. DSDYamlLoader would do.
        :return: a dictionary with the instruction set
        """
        if not os.path.isfile(path_and_filename):
            raise FileNotFoundError(f"dsd view {path_and_filename} not found.")

        view_instructions = loader.read_view_file(file_path_and_name=path_and_filename)
        return view_instructions

    def apply_view_instructions(self, instructions: dict):
        """
        applies the instruction set to the dsd. All tables that are not included will be deleted from the dsd.
        As long as no instruction set is applied the full cloned dsd is returned by the view.
        :param instructions: the dictionary with the instructions
        :return: True if successful. Otherwise it would throw exceptions.
        """
        self.include_tables = []
        parser = SimpleFunctionParser()
        for instruction in instructions["tables"]:
            parser.parse(instruction)
            if parser.ok:
                if parser.instruction == "include":
                    self._apply_include(parser.parameters)
                elif parser.instruction == "include_tables_with_instruction":
                    self._apply_include_tables_with_instruction(parser.parameters)
                elif parser.instruction == "include_tables_with_flag":
                    self._apply_include_tables_with_flag(parser.parameters)
                elif parser.instruction == "exclude_tables_with_flag":
                    self._apply_exclude_tables_with_flag(parser.parameters)
                elif parser.instruction == "exclude":
                    self._apply_exclude(parser.parameters)
                elif parser.instruction == "exclude_field":
                    self._apply_exclude_field(parser.parameters)
                elif parser.instruction == "exclude_fields_with_instruction":
                    self._apply_exclude_fields_with_instruction(parser.parameters)
                else:
                    raise DSDUnknownInstruction(
                        f"DSDView.apply_view_instruction: instruction {parser.instruction} unknown.")
            else:
                raise DSDInstructionSyntaxError(
                    f"DSDView.apply_view_instruction: syntax error in instruction {instruction}.")

        self._delete_not_included_tables()
        return True

    def _apply_include(self, parameters: []):
        if parameters[0] == "*":
            self.include_tables = self.dsd.list_tables()
        else:
            self.include_tables = set([*self.include_tables, parameters[0]])

    def _apply_exclude(self, parameters: []):
        if parameters[0] in self.include_tables:
            self.include_tables.remove(parameters[0])

    def _delete_not_included_tables(self):
        tables_to_delete = list(set(self.dsd.list_tables()) - set(self.include_tables))

        for table in tables_to_delete:
            self.dsd.delete_table(table)

    def _apply_include_tables_with_instruction(self, parameters):
        tables = self.dsd.list_tables_with_instructions([parameters[0]])
        self.include_tables.extend(tables)

    def _apply_include_tables_with_flag(self, parameters):
        tables = self.dsd.list_tables_with_flags([parameters[0]])
        self.include_tables.extend(tables)

    def _apply_exclude_tables_with_flag(self, parameters):
        tables = self.dsd.list_tables_with_flags([parameters[0]])
        for t in tables:
            self._apply_exclude([t])

    def _apply_exclude_tables_with_instruction(self, parameters):
        tables = self.dsd.list_tables_with_instructions([parameters[0]])
        for t in tables:
            self._apply_exclude([t])

    def _apply_exclude_field(self, parameters):
        table = parameters[0]
        field = parameters[1]
        self.dsd.delete_field(table, field)

    def _apply_exclude_fields_with_instruction(self, parameters):
        if len(parameters) == 1:
            tables = self.dsd.list_tables()
            instruction = parameters[0]
        else:
            tables = [parameters[0]]
            instruction = parameters[1]

        for table in tables:
            fields = self.dsd.get_fields_with_instructions(table, [instruction])
            for field in fields:
                self.dsd.delete_field(table, field)
