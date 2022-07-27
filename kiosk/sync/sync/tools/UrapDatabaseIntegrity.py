import logging

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from datetime import datetime


class UrapDatabaseIntegrity:
    def __init__(self, conf):
        self.conf = conf
        self.dsd = Dsd3Singleton.get_dsd3()

    def update_default_fields(self):
        auto_commit = None
        try:
            auto_commit = KioskSQLDb.get_autocommit()
            KioskSQLDb.set_autocommit(True)
            cur = KioskSQLDb.get_cursor()
            for table in self.dsd.list_tables():
                flds = self.dsd.list_fields_with_instruction(table, "default")
                # flds = self.dsd.list_fields_with_additional_type(table, "default")
                if flds:
                    for f in flds:
                        sql = "update " + table + " SET "
                        err = False
                        sql_value = ""
                        default_parameters = self.dsd.get_instruction_parameters_and_types(table, f, "default")
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
                                        if a_type == "function":
                                            sql += f"\"{f}\"" + f"={sql_value}"
                                            sql += " where " + f"\"{f}\"" + " is null"
                                            cur.execute(sql)
                                        else:
                                            sql += f"\"{f}\"" + "=%s"
                                            sql += " where " + f"\"{f}\"" + " is null"
                                            cur.execute(sql, [sql_value])
                                        if cur.rowcount:
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
            return f"'{datetime.now().isoformat()}'"

        return ""
