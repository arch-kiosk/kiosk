from contextmanagement.contexttypeinfo import ContextTypeInfo
from databasedrivers.postgres import Postgres
from sqlsafeident import SqlSafeIdentMixin
from .conditioninstruction import ConditionInstruction


class PostgresConditionInstruction(ConditionInstruction):
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        raise NotImplementedError

    @staticmethod
    def _quote_value(type_info, field, value):
        if type_info:
            data_type = type_info.get_type(field).upper()
        else:
            data_type = ""
        return Postgres.quote_value(data_type, value)


class Equals(PostgresConditionInstruction):
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        if field in output_field_information:
            field = output_field_information[field]["source_field"]
        value = cls._quote_value(type_info, field, args[0])
        return f"{db.sql_safe_ident(field)}={value}"


class IsNotNull(PostgresConditionInstruction):
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        if field in output_field_information:
            field = output_field_information[field]["source_field"]
        return f"{db.sql_safe_ident(field)} is not null"


class IsNull(PostgresConditionInstruction):
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        if field in output_field_information:
            field = output_field_information[field]["source_field"]
        return f"{db.sql_safe_ident(field)} is null"


class Range(PostgresConditionInstruction):
    @classmethod
    def eval(cls, db: SqlSafeIdentMixin, type_info: ContextTypeInfo, output_field_information: dict, field: str, *args):
        if field in output_field_information:
            field = output_field_information[field]["source_field"]
        value1 = cls._quote_value(type_info, field, args[0])
        value2 = cls._quote_value(type_info, field, args[1])

        return f"({db.sql_safe_ident(field)}>={value1} and {db.sql_safe_ident(field)}<={value2})"
