import datetime

import kioskstdlib

""" translation map of fieldtypes in the DataSetDefinition to postgres fields """
POSTGRES_DATATYPE_CONVERSIONS = {
    "VARCHAR": "VARCHAR",
    "INT": "INTEGER",
    "INTEGER": "INTEGER",
    "NUMBER": "INTEGER",
    "SMALLINT": "SMALLINT",
    "BIGINT": "BIGINT",
    "FLOAT": "NUMERIC",
    "DECIMAL": "NUMERIC",
    "TEXT": "TEXT",
    "TIMESTAMP": "TIMESTAMP",
    "DATETIME": "TIMESTAMP",
    "REPLFIELD_CREATED": "TIMESTAMP",
    "REPLFIELD_MODIFIED": "TIMESTAMP",
    "REPLFIELD_UUID": "UUID",
    "REPLFIELD_MODIFIED_BY": "VARCHAR",
    "UID": "UUID",
    "UUID": "UUID",
    "BOOLEAN": "BOOLEAN",
    "BOOL": "BOOLEAN",
    "JSON": "JSONB",
    "DATE": "DATE",
    "TIME": "TIME",
    "SERIAL": "SERIAL",
}


class Postgres:
    @staticmethod
    def convert_dsd_datatype(dsd_data_type):
        return POSTGRES_DATATYPE_CONVERSIONS[dsd_data_type.upper()]

    @staticmethod
    def quote_value(data_type, value):
        """
        returns a value properly quoted and formatted so that it can be used in a postgres sql.
        :param data_type: a postgres type (use convert_dsd_datatype to convert dsd types to sql types)
        :param value:
        :return:
        """
        data_type = data_type.upper()
        if data_type and not (isinstance(value, str) and value.lower() == "null"):
            if data_type in ["VARCHAR", "TEXT", "UID", "UUID"]:
                # value: str
                # new_value = value.replace("'", "\\'")
                return f"$${value}$$"
            elif data_type in ["TIMESTAMP", "DATE", "DATETIME", "TIME"]:
                try:
                    if kioskstdlib.str_to_iso8601(value):
                        return f"\'{value}\'"
                except ValueError as e:
                    raise ValueError(f"PostgresConditionInstruction._quote_value: {value} "
                                     f"is not a valid is8601 timestamp: {repr(e)}")
        return f"{value}"

    @staticmethod
    def wildcard(value: str, leading=True, trailing=True):
        """
        returns the value as a pattern that can be used for pattern matching
        e.g. the value "something" would come out as "%something%" for postgres.
        :param value: the value without wildcards or quotes!
        :param leading: bool
        :param trailing: bool
        :return: a pattern without quotes
        """
        if leading:
            value = "%" + value
        if trailing:
            value = value + "%"
        return value

    @classmethod
    def case_insensitive_comparison(cls, wild_carded_value):
        """
        returns the a sql statement to include in a where statement that does a case-insensitive pattern comparison.
        e.g. the value "something" would turn out as "ILIKE '%something%'" for postgres
        :param wild_carded_value:
        :return: a complete pattern comparison statement, including proper quotation
        """
        return f"ILIKE {cls.quote_value('VARCHAR', wild_carded_value)}"

    @classmethod
    def date(cls, value: datetime.datetime) -> str:
        """
        returns a properly quoted and formatted sql date.
        :param value: datetime.datetime. Only uses the date part of datetime
        :return: a string with the sql date expression
        """


        return f"'{kioskstdlib.iso8601_to_str(value.date())}'"

