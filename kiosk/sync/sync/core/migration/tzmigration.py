import logging

from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from migration.postgresdbmigration import PostgresDbMigration


class TZMigration:
    def __init__(self, dsd: DataSetDefinition):
        # self.config = config
        self.dsd: DataSetDefinition = dsd
        self.dbAdapter: PostgresDbMigration = PostgresDbMigration(dsd, KioskSQLDb.get_con())

    def run(self) -> bool:
        """
        runs the pre-migration
        :return: boolean if successful (or unnecessary)
        """
        if self.dbAdapter.get_migration_flag("TZMIGRATION") == "ok":
            return True
        try:
            tables = self.dsd.list_tables()
            for table in tables:
                self.migrate_table(table)
            self.dbAdapter.set_migration_flag("TZMIGRATION", "ok")
            KioskSQLDb.commit()
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.run: {repr(e)}")
            try:
                KioskSQLDb.rollback()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.run: Error rolling back transaction ({repr(e)})")
        return False

    def migrate_table(self, table: str):
        c_migrated = 0
        fields = self.dsd.get_fields_with_datatype(table, "TIMESTAMP")
        if fields:
            if KioskSQLDb.does_table_exist(table):
                fields_with_tz = [x[0] for x in KioskSQLDb.get_records(f"""select column_name 
                            from information_schema.columns where table_name = '{table}' 
                            and data_type = 'timestamp with time zone'""")]

                sql = ""
                for field in fields:
                    if field not in fields_with_tz:
                        c_migrated += 1
                        sql += (", " if sql else "ALTER " + f" TABLE \"{table}\" ")
                        sql += f"ALTER COLUMN \"{field}\" TYPE TIMESTAMP WITH TIME ZONE, "
                        sql += f"ADD COLUMN \"{field + '_tz'}\" INTEGER DEFAULT NULL"
                    else:
                        logging.debug(f"{self.__class__.__name__}.migrate_table: field {table}.{field}"
                                      f" is already of type timestamp with time zone")

                if sql:
                    sql += ";"
                    KioskSQLDb.execute(sql)
        return c_migrated
