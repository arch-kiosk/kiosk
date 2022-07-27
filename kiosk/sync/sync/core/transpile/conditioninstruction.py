from sqlsafeident import SqlSafeIdentMixin

class ConditionInstruction:
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, key: str, field: str, *args):
        raise NotImplementedError
