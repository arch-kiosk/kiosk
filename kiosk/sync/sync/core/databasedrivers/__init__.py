from .postgres import POSTGRES_DATATYPE_CONVERSIONS as DATATYPE_CONVERSIONS
from .postgres import Postgres as DatabaseDriver


def dsd2database_datatype(dsd_datatype: str) -> str:
    """
    returns the lowercase sql-specific data type that corresponds with the dsd data type.
    :param dsd_datatype: the dsd data type. Case-insensitive.
    :return: the database specific type or ""
    """
    try:
        return DATATYPE_CONVERSIONS[dsd_datatype.upper()].lower()
    except:
        return ""
