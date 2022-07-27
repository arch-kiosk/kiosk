from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from core.databasedrivers import dsd2database_datatype, DatabaseDriver


class SqlFieldFormatterError(Exception):
    pass


def register_formatters(dsd, context):
    context.register_output_formatter("datetime", SqlFieldFormatterDateTime(dsd))
    context.register_output_formatter("isempty", SqlFieldFormatterIsEmpty(dsd))
    context.register_output_formatter("lookup_type", SqlFieldFormatterLookupType(dsd))
    context.register_output_formatter("dsd_type", SqlFieldFormatterDsdType(dsd))


class SqlFieldFormatter:
    def __init__(self, dsd: DataSetDefinition):
        self._dsd = dsd
        pass

    def __call__(self, src_table_name: str,
                 src_field_name: str,
                 parameters: list,
                 default_value=None) -> (any, str):
        """
        returns the database-specific sql that renders a field so that it meets a requested format.
        :param src_table_name:
        :param src_field_name:
        :param parameters: parameters that specify the formatting
        :param default_value: if given, this will be used instead of src_table and src_field_name
        :return: returns a tuple with the rendered sql and the lowercase dsd data type the field will have
        """
        raise NotImplementedError


class SqlFieldFormatterDateTime(SqlFieldFormatter):

    def __call__(self, src_table_name: str,
                 src_field_name: str,
                 parameters: list,
                 default_value=None) -> (any, str):
        """
        returns the database-specific sql that renders a field so that it meets a requested datetime format.

        :param src_table_name:
        :param src_field_name:
        :param parameters: a list with one element that can be either a dsd datatype
               or one of these fix formats "year", "day", "month"
               or a "!" followed by an individual database-specific datetime format, like "DDMMYYY" or "DDD" etc.
        :param default_value: if given, this will be used instead of src_table and src_field_name
        :return: returns a tuple with the rendered sql and the lowercase dsd data type the field will have
                    when selected this way. E.g. if "year" is used as a parameter, the data type will be "int".
        """
        if len(parameters) != 1:
            raise SqlFieldFormatterError("SqlFieldFormatterDateTime: Wrong number of parameters given: "
                                         f"{len(parameters)} instead of 1")

        data_format = ""
        database_type = ""
        use_default_value = (default_value is not None)
        # if use_default_value:
        #     default_value:str
        #     if default_value.lower() == "null"

        dsd_data_type = DataSetDefinition.translate_datatype(parameters[0])
        if dsd_data_type:
            data_format = dsd_data_type
            database_type = dsd2database_datatype(dsd_data_type)
            if not database_type:
                raise SqlFieldFormatterError(f"SqlFieldFormatterDateTime: dsd type \"{dsd_data_type}\" "
                                             f"does not correspond to any database-specific data type.")
        if data_format:
            if database_type:
                if use_default_value:
                    result = f"{default_value}::{database_type}"
                else:
                    result = f"{KioskSQLDb.sql_safe_ident(src_table_name)}." \
                             f"{KioskSQLDb.sql_safe_ident(src_field_name)}::{database_type}"
                result_type = data_format
            else:
                raise SqlFieldFormatterError(f"SqlFieldFormatterDateTime: dsd data type \"{data_format}\" "
                                             f"unsupported here.")
        else:
            data_format = parameters[0].lower()
            if data_format in ["year", "day", "month"]:
                if use_default_value:
                    result = f"{default_value}::int"
                else:
                    result = f"extract({data_format.upper()} from {KioskSQLDb.sql_safe_ident(src_table_name)}." \
                             f"{KioskSQLDb.sql_safe_ident(src_field_name)})::int"
                result_type = "int"
            elif data_format.startswith("!"):
                if use_default_value:
                    result = f"{default_value}::varchar"
                else:
                    result = f"to_char({KioskSQLDb.sql_safe_ident(src_table_name)}." \
                             f"{KioskSQLDb.sql_safe_ident(src_field_name)},'{parameters[0][1:]}')"
                result_type = "varchar"
            else:
                raise SqlFieldFormatterError(f"SqlFieldFormatterDateTime: format \"{data_format}\" unknown.")

        return result, result_type


class SqlFieldFormatterIsEmpty(SqlFieldFormatter):

    def __call__(self, src_table_name: str,
                 src_field_name: str,
                 parameters: list,
                 default_value=None) -> (any, str):
        """
        returns the database-specific sql that returns a boolean value
        depending on whether or not the source field has a value

        :param src_table_name:
        :param src_field_name:
        :param parameters: a list with one element that can be either a dsd datatype
               or one of these fix formats "year", "day", "month"
               or a "!" followed by an individual database-specific datetime format, like "DDMMYYY" or "DDD" etc.
        :param default_value: if given, this will be used instead of src_table and src_field_name.
                Must be either True or False.
        :return: returns a tuple with the rendered sql and the lowercase dsd data type BOOL
        """

        data_format = ""
        database_type = ""
        use_default_value = (default_value is not None)

        data_format = "bool"
        if use_default_value:
            if default_value.lower() == "true" or default_value.lower() == "false":
                result = default_value.lower()
            else:
                result = "null"
        else:
            result = f"coalesce({KioskSQLDb.sql_safe_ident(src_table_name)}." \
                     f"{KioskSQLDb.sql_safe_ident(src_field_name)}::text,'') = ''"

        return result, "bool"


class SqlFieldFormatterLookupType(SqlFieldFormatter):

    def __call__(self, src_table_name: str,
                 field_or_instruction: str,
                 parameters: list,
                 default_value=None) -> (any, str):
        """
        returns the database-specific sql that returns a properly quoted default value according to a type
        taken from the dsd. If instead of a default value a proper src_table_name/src_field_name is given
        the formatter renders the field as usual and returns the dsd type.

        :param src_table_name: if given no default value is expected
        :param field_or_instruction: the field name of the source field. If a default_value is given, this can also be
                                     an instruction instead of a field.
        :param parameters: a list with one element: the dsd table in which to look up the field src_field_name if
                           a default_value is given.

        :param default_value: if given, this will be used instead of src_table and src_field_name.
               if a default_value is given, no src_field_name is expected.
        :return: returns a tuple with the rendered sql and the lowercase dsd data type BOOL
        :except: Can raise a variety of exceptions. e.g. if a src_field_name AND a default_value are given.
        """

        data_format = ""
        database_type = ""
        use_default_value = (default_value is not None)

        if use_default_value and src_table_name:
            raise SqlFieldFormatterError(f"SqlFieldFormatterLookupType: a default value and a source table are given:"
                                         f"{default_value}/{src_table_name}. That is ambiguous.")
        if src_table_name:
            data_type = self._dsd.get_field_datatype(src_table_name, field_or_instruction)
            if not data_type:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterLookupType: Lookup table {parameters[0]} has no data type for field "
                    f"{field_or_instruction}.")
            result = f"{KioskSQLDb.sql_safe_ident(src_table_name)}." \
                     f"{KioskSQLDb.sql_safe_ident(field_or_instruction)}"
        else:
            if len(parameters) < 1:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterLookupType: no lookup table given for default value "
                    f"{default_value}.")
            lookup_table = parameters[0]
            src_field_names = self._dsd.get_field_or_instructions(lookup_table, field_or_instruction)
            if not src_field_names:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterLookupType: Lookup table {parameters[0]} has no field or instruction "
                    f"{field_or_instruction}.")
            src_field_name = src_field_names[0]  # yes, if there is more than one, I don't care here.
            data_type = self._dsd.get_field_datatype(parameters[0], src_field_name)
            if not data_type:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterLookupType: Lookup table {parameters[0]} has no data type for field "
                    f"{src_field_name}.")

            result = f"{DatabaseDriver.quote_value(data_type, default_value)}"

        return result, data_type


class SqlFieldFormatterDsdType(SqlFieldFormatter):

    def __call__(self, src_table_name: str,
                 field_or_instruction: str,
                 parameters: list,
                 default_value=None) -> (any, str):
        """
        returns the database-specific sql that returns a properly quoted default value according to a static dsd type
        If instead of a default value a proper src_table_name/src_field_name is given the formatter renders the field
        as usual and returns the proper dsd type.

        :param src_table_name: if given no default value is expected
        :param field_or_instruction: the field name of the source field. If a default_value is given, this can also be
                                     an instruction instead of a field.
        :param parameters: a list with one element: the dsd table in which to look up the field src_field_name if
                           a default_value is given.

        :param default_value: if given, this will be used instead of src_table and src_field_name.
               if a default_value is given, no src_field_name is expected.
        :return: returns a tuple with the rendered sql and the lowercase dsd data type BOOL
        :except: Can raise a variety of exceptions. e.g. if a src_field_name AND a default_value are given.
        """

        data_format = ""
        database_type = ""
        use_default_value = (default_value is not None)

        if use_default_value and src_table_name:
            raise SqlFieldFormatterError(f"SqlFieldFormatterDsdType: a default value and a source table are given:"
                                         f"{default_value}/{src_table_name}. That is ambiguous.")
        if src_table_name:
            data_type = self._dsd.get_field_datatype(src_table_name, field_or_instruction)
            if not data_type:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterDsdType: Lookup table {parameters[0]} has no data type for field "
                    f"{field_or_instruction}.")
            result = f"{KioskSQLDb.sql_safe_ident(src_table_name)}." \
                     f"{KioskSQLDb.sql_safe_ident(field_or_instruction)}"
        else:
            if len(parameters) < 1:
                raise SqlFieldFormatterError(
                    f"SqlFieldFormatterDsdType: no data type given for default value "
                    f"{default_value}.")
            data_type = parameters[0]

            result = f"{DatabaseDriver.quote_value(data_type, default_value)}"

        return result, data_type
