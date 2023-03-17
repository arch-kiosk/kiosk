from simplegrammartree import SimpleGrammarTree, and_or_node
from simplefunctionparser import SimpleFunctionParser
from .conditioninstruction import ConditionInstruction
from sqlsafeident import SqlSafeIdentMixin
from contextmanagement.contexttypeinfo import ContextTypeInfo


class TranspileError(Exception):
    pass


class SimpleTranspiler:

    def __init__(self, db: SqlSafeIdentMixin):
        self._conjunction_method = and_or_node
        self._instructions = {}
        # noinspection PyTypeChecker
        self._gt: SimpleGrammarTree = None
        self.parser = SimpleFunctionParser()
        self._register_instructions()
        # noinspection PyTypeChecker
        self._type_info: ContextTypeInfo = None
        self._output_field_information = {}
        self._db = db

    @property
    def type_info(self) -> ContextTypeInfo:
        return self._type_info

    @type_info.setter
    def type_info(self, type_info: ContextTypeInfo):
        self._type_info = type_info

    @property
    def output_field_information(self) -> dict:
        return self._output_field_information

    @output_field_information.setter
    def output_field_information(self, output_field_information: dict):
        self._output_field_information = output_field_information

    def _register_instructions(self):
        raise NotImplementedError

    def _register_instruction(self, instruction: str, evaluator: ConditionInstruction.__class__):
        self._instructions[instruction] = evaluator

    def _register_conjunction_method(self, conjunction_method):
        self._conjunction_method = conjunction_method

    def _eval_instruction(self, value):
        self.parser.parse(value)
        if self.parser.ok:
            for instruction in self._instructions.keys():
                instruction: str
                if self.parser.instruction == instruction.lower():
                    return self._instructions[instruction].eval(self._db,
                                                                self._type_info,
                                                                self._output_field_information,
                                                                *self.parser.parameters)
            raise TranspileError(f"Instruction {value} cannot be evaluated.")
        else:
            raise TranspileError(f"Instruction {value} cannot be parsed.")

    def run(self, input_dict: dict):
        self._gt = SimpleGrammarTree(self._eval_instruction, self._conjunction_method)
        self._gt.set_tree(input_dict)
        self._gt.run()
        return self._gt.result
