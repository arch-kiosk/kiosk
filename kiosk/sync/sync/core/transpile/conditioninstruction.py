from sqlsafeident import SqlSafeIdentMixin
from contextmanagement.contexttypeinfo import ContextTypeInfo


class ConditionInstruction:
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        raise NotImplementedError
