from .simpletranspiler import SimpleTranspiler
from .sqlconditions import *


class SqlConditionTranspiler(SimpleTranspiler):
    def _register_instructions(self):
        self._register_instruction("equals", Equals)
        self._register_instruction("range", Range)
        self._register_instruction("inrange", Range)
        self._register_instruction("isnull", IsNull)
        self._register_instruction("isnotnull", IsNotNull)
