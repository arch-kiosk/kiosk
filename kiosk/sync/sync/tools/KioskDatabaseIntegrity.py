import logging
from logging import warning

from wtforms.validators import length

import kioskdatetimelib
from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from datetime import datetime


class KioskDatabaseIntegrity:
    def __init__(self, conf):
        self.conf = conf
        self.dsd = Dsd3Singleton.get_dsd3()

    def ensure_database_integrity(self):
        self.update_default_fields()
        self.update_modified_ww_fields()

    def update_default_fields(self):
        auto_commit = None
        log_lines = 0
        try:
            auto_commit = KioskSQLDb.get_autocommit()
            KioskSQLDb.set_autocommit(True)
            cur = KioskSQLDb.get_cursor()
            for table in self.dsd.list_tables():
                flds = self.dsd.list_fields_with_instruction(table, "default")
                # flds = self.dsd.list_fields_with_additional_type(table, "default")
                modified_field = self.dsd.get_modified_field(table)
                if flds:
                    for f in flds:
                        sql = "update " + table + " SET "
                        err = False
                        sql_value = ""
                        default_parameters = self.dsd.get_instruction_parameters_and_types(table, f, "default")
                        data_type = self.dsd.get_field_datatype(table, f)
                        if default_parameters:
                            v, a_type = default_parameters[0]
                            if a_type:
                                if a_type in ["string", "number", "other"]:
                                    sql_value = v
                                elif a_type == "function":
                                    sql_value = self._get_functional_default_parameter(a_type, v)
                                    if not sql_value:
                                        logging.warning(
                                            f"Database Integrity Check: "
                                            f"DEFAULT option {v} for " + table + "." + f + " is not supported. ")
                                        err = True
                                        continue
                                if not err and sql_value:
                                    try:
                                        # time zone relevance
                                        if a_type == "function":
                                            sql += f"\"{f}\"" + f"={sql_value} "
                                            if modified_field and f == modified_field:
                                                sql += f",\"{f}_ww\"" + f"={sql_value} "
                                                sql += f",\"{f}_tz\"" + f"=0 "
                                            sql += " where " + f"\"{f}\"" + " is null"
                                            cur.execute(sql)
                                        else:
                                            sql += f"\"{f}\"" + "=%s"
                                            values = [sql_value]
                                            if modified_field and f == modified_field:
                                                sql += f",\"{f}_ww\"" + f"={sql_value}"
                                                sql += f",\"{f}_tz\"" + f"=0 "
                                                values.append(sql_value)
                                            sql += " where " + f"\"{f}\"" + " is null"
                                            cur.execute(sql, values)
                                        if cur.rowcount:
                                            log_lines+=1
                                            if log_lines == 50:
                                                logging.warning("Database Integrity Check: "
                                                                "Too many default values have been mended "
                                                                "to report them all. Logging stops here.")
                                            if log_lines < 50:
                                                if data_type.startswith("timestamp"):
                                                    logging.warning(
                                                        "Database Integrity Check: {} default values "
                                                        "set to {} in {}.{} \n"
                                                        "NOTE that this is a {} field that is now "
                                                        "populated with utc time stamps".format(cur.rowcount, sql_value, table, f, data_type)
                                                    )
                                                else:
                                                    logging.info(
                                                        "Database Integrity Check: {} default values "
                                                        "set to {} in {}.{}".format(cur.rowcount, sql_value, table, f))
                                        KioskSQLDb.commit()
                                    except Exception as e:
                                        logging.warning(f"A non-critical issue occurred when checking default "
                                                        f"values for {table}.{f}: {repr(e)}")
                                        try:
                                            KioskSQLDb.rollback()
                                        except:
                                            pass
        finally:
            if auto_commit is not None:
                KioskSQLDb.set_autocommit(auto_commit)


    @staticmethod
    def _get_functional_default_parameter(parameter_type, value: str):
        if value.lower().strip() == "gen_random_uuid()":
            return "gen_random_uuid()"
        if value.lower().strip() == "now()":
            # time zone relevance
            return f"'{kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True).isoformat()}'"

        return ""


    def update_modified_ww_fields(self):
        """
        updates all fields of a table that have a modified_ww instruction and are null
        with the value of the modified field. The modified_tz field must be null as well.

        can raise an Exception
        """
        auto_commit = None
        try:
            auto_commit = KioskSQLDb.get_autocommit()
            KioskSQLDb.set_autocommit(True)
            cur = KioskSQLDb.get_cursor()
            for table in self.dsd.list_tables():
                flds = self.dsd.list_fields_with_instruction(table, "modified_ww")
                if flds:
                    if len(flds) == 1:
                        err = False
                        modified_ww_field = KioskSQLDb.sql_safe_ident(flds[0])
                        modified_field = self.dsd.get_modified_field(table)
                        flds = self.dsd.list_fields_with_instruction(table, "modified_tz")
                        if len(flds) == 1:
                            modified_tz_field = KioskSQLDb.sql_safe_ident(flds[0])
                            if modified_field:
                                sql = f"update {KioskSQLDb.sql_safe_ident(table)} "
                                sql += f"SET {modified_ww_field}={KioskSQLDb.sql_safe_ident(modified_field)}::timestamp "
                                sql += f"WHERE {modified_ww_field} is null and {modified_tz_field} is null"
                                try:
                                    cur.execute(sql)
                                except BaseException as e:
                                    logging.warning(f"{self.__class__.__name__}.update_modified_ww_fields: Error when "
                                                    f"checking modified_ww field {table}.{modified_ww_field}: {repr(e)}")
                                    raise e
                            else:
                                logging.warning(f"{self.__class__.__name__}.update_modified_ww_fields: "
                                                f"table {table} has a field with a modified_ww instruction but no modified "
                                                f"field itself. That's not okay. Check the DSD!")
                        else:
                            logging.warning(f"{self.__class__.__name__}.update_modified_ww_fields: "
                                          f"table {table} has either no or more than one field with a modified_zw instruction. "
                                          f"That's not okay. Check the DSD!")
                    else:
                        logging.warning(f"{self.__class__.__name__}.update_modified_ww_fields: "
                                      f"table {table} has more than one field with a modified_ww instruction. "
                                      f"That's not okay. Check the DSD!")

        finally:
            if auto_commit is not None:
                KioskSQLDb.set_autocommit(auto_commit)
