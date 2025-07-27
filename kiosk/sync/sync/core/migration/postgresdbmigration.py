# todo time zone simpliciation (done)
import logging
import sys
import os
import datetime

from migration.databasemigration import DatabaseMigration
import psycopg2
import psycopg2.extras
import psycopg2.extensions
import psycopg2.errors
import psycopg2.sql
from migration.postgrestablemigration import _PostgresTableMigration
from kioskstdlib import get_file_extension

from migration.postgresmigrationfieldinstructions import *


class PostgresDbMigration(DatabaseMigration):

    def __init__(self, dsd, psycopg2_con, migration_catalog_name="migration_catalog"):
        super().__init__(dsd, migration_catalog_name)
        self._con = psycopg2_con

    def sql_safe_ident(self, identifier: str):
        """
        returns a sanitized and properly quoted sql identifier (table names, field names etc.).
        Does the same things like KioskSQLDb.sql_safe_namespaced_table.
        This here uses the internal connection object.

        :param identifier: identifier that has to be sanitized and quoted
        :return: the sanitized and quoted identifier
        """
        return psycopg2.sql.Identifier(identifier).as_string(self._con)

    def sql_safe_namespaced_table(self, namespace: str, db_table: str):
        """
        returns a sanitized and properly quoted table name. If a namespace is not "",
        a schema name will be set in front of the tablename. Does the same things like
        KioskSQLDb.sql_safe_namespaced_table. This here uses the internal connection object.

        :param namespace: the schema name
        :param db_table: the table name
        :return:
        """
        if namespace:
            return f"{psycopg2.sql.Identifier(namespace).as_string(self._con)}." \
                   f"{psycopg2.sql.Identifier(db_table).as_string(self._con)}"
        else:
            return f"{psycopg2.sql.Identifier(db_table).as_string(self._con)}"

    def _adapter_register_field_instruction_set(self):
        MiPgDataType.register(self._field_instruction_set)
        MiPgUnique.register(self._field_instruction_set)
        MiPgNotNull.register(self._field_instruction_set)
        MiPgPrimary.register(self._field_instruction_set)
        MiPgUuidKey.register(self._field_instruction_set)
        MiPgReplfieldCreated.register(self._field_instruction_set)
        MiPgReplfieldUuid.register(self._field_instruction_set)
        MiPgDefault.register(self._field_instruction_set)

    def _get_dict_cursor(self):
        """ returns a dict cursor, which means that field-values cannot only be
            accessed by index but also by field-name. See "get_cursor" for more details.
        """
        return self._con.cursor(cursor_factory=psycopg2.extras.DictCursor)

    @staticmethod
    def _begin_savepoint(cursor, savepoint_name: str):
        cursor.execute(f"SAVEPOINT {savepoint_name}")

    @staticmethod
    def _commit_savepoint(cursor, savepoint_name: str):
        cursor.execute(f"RELEASE SAVEPOINT {savepoint_name}")

    @staticmethod
    def _rollback_savepoint(cursor, savepoint_name: str):
        cursor.execute(f"ROLLBACK TO SAVEPOINT {savepoint_name}")

    def execute_sql(self, sql, params: list = None):
        """ Executes an sql statement with parameters
        : returns : number of affected records
        : exceptions: lets all exceptions through
        """
        if not params:
            params = []

        cur = self._get_dict_cursor()
        try:
            cur.execute(sql, params)
            # print(cur.query)
            rc = cur.rowcount
        except BaseException as e:
            logging.error(f"PostgresMigration.execute_sql: Exception {repr(e)}, query:{cur.query}")
            raise e
        finally:
            cur.close()

        return rc

    def _adapter_get_table_structure_version(self, db_table, namespace=""):
        ver = -1
        cur = self._get_dict_cursor()
        try:
            params = [db_table, namespace]
            cur.execute(f"select \"version\" from {self.sql_safe_ident(self.migration_catalog_name)}"
                        f" where \"table\"=%s and namespace=%s", params)
            r = cur.fetchone()
            if r:
                ver = r["version"]
            else:
                ver = 0
        except BaseException as e:
            logging.error(f"PostgresMigration._adapter_get_table_structure_version: "
                          f"Exception when querying migration catalog: {repr(e)}")
        finally:
            cur.close()

        return ver

    def _adapter_exists_in_catalog(self, db_table, namespace=""):
        """ checks if a table exists in the migration catalog (does not check the database)
            :returns: boolean.
        """
        rc = False
        cur = self._get_dict_cursor()
        try:
            params = [db_table, namespace]
            cur.execute(f"select \"version\" from {self.sql_safe_ident(self.migration_catalog_name)}"
                        f" where \"table\"=%s and namespace=%s", params)
            r = cur.fetchone()
            if r:
                rc = True
        except BaseException as e:
            logging.error(f"PostgresMigration._adapter_exists_in_catalog: "
                          f"Exception when querying migration catalog: {repr(e)}")
        finally:
            cur.close()

        return rc

    def _adapter_table_exists(self, table, namespace=""):
        """ checks if a table actually exists in the database (does not check the migration catalog) 
            :returns: boolean.
        """
        cur = self._get_dict_cursor()
        try:
            cur.execute(f"SELECT to_regclass('{self.sql_safe_namespaced_table(namespace, table)}')")
            r = cur.fetchone()
            result = bool(r[0])
        except BaseException as e:
            logging.error(f"PostgresMigration._adapter_table_exists: "
                          f"Exception {repr(e)}")
            raise e

        finally:
            cur.close()

        return result

    def process_create_instructions(self, field_name: str, instructions: {}, field_attributes: []):
        field_attributes.clear()

        self._append_field_attribute(
            self._process_create_instruction("datatype", field_name, instructions, required=True),
            append_to=field_attributes)
        for instruction in ["primary", "not_null", "unique", "default", "uuid_key", "replfield_uuid",
                            "replfield_created"]:
            self._append_field_attribute(self._process_create_instruction(instruction, field_name, instructions),
                                         append_to=field_attributes)

    def process_migrate_instructions(self, field_name: str, old_instructions: {}, new_instructions: {},
                                     alter_lines: []):
        alter_lines.clear()

        for instruction in self._field_instruction_set.keys():
            if instruction in new_instructions:
                if instruction in old_instructions:
                    old_params = old_instructions[instruction]
                else:
                    old_params = []
                new_params = new_instructions[instruction]
                result_lines = self._process_migrate_instruction(instruction, field_name, old_params, new_params)
                alter_lines.extend(result_lines)

    def process_drop_instructions(self, field_name: str, dropped_instructions: {}, alter_lines: []):
        alter_lines.clear()

        for instruction in self._field_instruction_set.keys():
            if instruction in dropped_instructions.keys():
                params = dropped_instructions[instruction]
                result_lines = self._process_drop_instruction(instruction, field_name, params)
                alter_lines.extend(result_lines)

    def _adapter_create_schema(self, namespace: str):
        """
            creates a schema if it does not already exist.
            :returns: the schema name
        """
        self.execute_sql(
            psycopg2.sql.SQL("CREATE SCHEMA IF NOT EXISTS {0}").format(psycopg2.sql.Identifier(namespace)))
        return namespace

    def _adapter_create_table(self, dsd_table, db_table, version=0, namespace="", temporary=False, sync_tools=False):
        """ creates a table in the database based on instructions in the dsd. 
            :param dsd_table: The name of the table definition in the dsd
            :param db_table: The name of the table in the database.
            :param version: The version of the dsd table definition to use.
                            if 0 the current version is going to be used.
            :param temporary: create a temp table
            :sync_tools: suppresses all primary and unique definitions in the dsd and adds other features needed
                         only within the synchronization process. Default is false.
            :returns: True if okay, otherwise exceptions will be thrown
        """
        sql_fields = []
        fields = self.dsd.get_fields_with_instructions(dsd_table, version=version)

        if namespace and temporary:
            raise Exception(
                f"PostgresDbMigration._adapter_create_table: A temporary table cannot have a schema: {db_table}")
        if namespace:
            self._adapter_create_schema(namespace)

        # this could go somehow to the super class since it is not database specific
        if self.dsd.get_fields_with_instructions(dsd_table, ["replfield_uuid"], version):
            fields["repl_deleted"] = {"datatype": ["BOOLEAN"], "default": ["False"]}
            fields["repl_tag"] = {"datatype": ["INTEGER"], "default": ["NULL"]}

        if sync_tools:
            fields["repl_workstation_id"] = {"datatype": ["VARCHAR"], "not_null": []}

        # add tz fields
        tz_fields = []
        for field_name, field_params in fields.items():
            if ("datatype" in field_params.keys() and
                self.dsd.translate_datatype(field_params["datatype"][0]) == "timestamp" and
                    "replfield_modified" in field_params.keys()):
                tz_fields.append(field_name)

        for f in tz_fields:
            fields[f + "_tz"] = {"datatype": ["TZ"], "default": ["NULL"]}
            fields[f + "_ww"] = {"datatype": ["timestamp"], "default": ["NULL"]}

        primary_key_field = ""
        for field_name in fields.keys():
            try:
                self.process_create_instructions(field_name, fields[field_name],
                                                 field_attributes=self._field_attributes)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._adapter_create_table: Error when creating table {db_table}:")
                raise e

            if "PRIMARY KEY" in self._field_attributes:
                primary_key_field = field_name
            if sync_tools:
                for attr in ["UNIQUE", "PRIMARY KEY"]:
                    try:
                        self._field_attributes.remove(attr)
                    except ValueError:
                        pass

            sql_field = f"{self.sql_safe_ident(field_name)} {' '.join(self._field_attributes)}"
            sql_fields.append(sql_field)

        sql_field_lines = ",".join(sql_fields)
        if sync_tools:
            sql_field_lines = ",".join([sql_field_lines, f"CONSTRAINT \"PK_{db_table}_SYNC\" "
                                                         f"PRIMARY KEY ({self.sql_safe_ident(primary_key_field)},"
                                                         f"\"repl_workstation_id\")"])
        sql_temp_1 = ""
        sql_temp_2 = ""
        if temporary:
            sql_temp_1 = "TEMP "
            if sync_tools:
                sql_temp_2 = " ON COMMIT DROP"
        sql = f"CREATE {sql_temp_1}TABLE {self.sql_safe_namespaced_table(namespace, db_table)}" \
              f"({sql_field_lines}){sql_temp_2};"
        try:
            self.execute_sql(sql)
        except BaseException as e:
            err_type, err_obj, traceback = sys.exc_info()
            if repr(err_type).find("psycopg2.errors.UndefinedFunction") >= 0 and repr(err_obj).find(
                    "gen_random_uuid") >= 0:
                self._con.rollback()
                self.execute_sql("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
                self._con.commit()
                raise Exception("Database was not properly set up. Fix applied, please try again.")
            else:
                raise e
        return True

    def _adapter_update_table_structure_version(self, db_table, dsd_table, version, namespace=""):
        """ Sets an updated version for a table in the migration catalog. Works only if the table is already registered 
            in the migration catalog!
            :param db_table: name of the table in the database
            :param dsd_table: name of the underlying table definition
            :param version: currently manifest version of the table structure
            :param namespace: use if the db_table is organized in a namespace.
            :returns: bool
        """
        params = [version, dsd_table, db_table, namespace]
        sql = f"UPDATE \"{self.migration_catalog_name}\" "
        sql += f"SET \"version\"=%s, \"table_definition\"=%s where \"table\"=%s and \"namespace\"=%s;"
        return self.execute_sql(sql, params) == 1

    def _adapter_fix_migration_catalog(self, old_dsd_table="", new_dsd_table=""):
        """ changes all occurrences of old_dsd_table to new_dsd_table. Used when a dsd-table is renamed.

            : note: The migration catalog must exist
        """
        params = [new_dsd_table, old_dsd_table]
        sql = f"UPDATE \"{self.migration_catalog_name}\" "
        sql += f"SET \"table_definition\"=%s where \"table_definition\"=%s;"
        return self.execute_sql(sql, params)

    def _adapter_insert_table_structure_version(self, db_table, dsd_table, version, namespace=""):
        """ Sets a (new) version for a table in the migration catalog. 
            Won't work if the table is already registered in the migration catalog!
            :param db_table: name of the table in the database
            :param dsd_table: name of the underlying table definition
            :param version: currently manifest version of the table structure
            :param namespace: use if the db_table is organized in a namespace.
            :returns: bool
        """
        sql = f"INSERT " + f"INTO \"{self.migration_catalog_name}" \
              f"\"(\"table\", \"table_definition\", \"version\", \"namespace\") "
        sql += "VALUES(%s, %s, %s, %s);"
        return self.execute_sql(sql, [db_table, dsd_table, version, namespace]) == 1

    def _adapter_drop_table(self, db_table, namespace=""):
        """
        drops a table from the database. Does not eliminate the corresponding table in the migration_catalog!
        : returns: bool, does not raise any Exceptions. Returns True if table did not exist to begin with. 
        """
        sql = f"DROP TABLE IF EXISTS{self.sql_safe_namespaced_table(namespace, db_table)};"
        try:
            self.execute_sql(sql)
            return True
        except BaseException as e:
            logging.error(f"postgresdbmigration._adapter_drop_table: Exception {repr(e)}")

        return False

    def _adapter_delete_from_migration_catalog(self, db_table, namespace=""):
        """
        deletes a record from the migration_catalog! 
        :returns: bool. Succeeds if record did not exist to begin with.
        """

        sql = f"delete " + f"from {self.sql_safe_ident(self.migration_catalog_name)} where \"table\"=%s and " \
                           f"\"namespace\"=%s "
        try:
            self.execute_sql(sql, [db_table, namespace])
            return True
        except BaseException as e:
            logging.error(f"postgresdbmigration._adapter_delete_from_migration_catalog: Exception {repr(e)}")

        return False

    def _adapter_delete_namespace(self, prefix, namespace):
        """
        deletes a namespace with all tables from the database and from the migration catalog.
        Both prefix and namespace are necessary to remove records from the migration tables
        :param prefix: the prefix
        :param namespace: the namespace
        :returns: bool
        """

        try:
            self.execute_sql(f"delete " +
                             f"from {self.sql_safe_ident(self.migration_catalog_name)}"
                             f" where namespace=%s", [namespace])
            self.execute_sql(f"delete " +
                             f"from {self.sql_safe_ident(self.migration_flags_name)}"
                             f" where \"flag\" like %s ESCAPE''", [f"{prefix}_{namespace}%"])
            self.execute_sql(f"DROP SCHEMA IF EXISTS"
                             f"{self.sql_safe_ident(namespace)}"
                             f" CASCADE")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._adapter_delete_namespace : {repr(e)}")
        return False

    @classmethod
    def _adapter_get_table_migration_class(cls):
        return _PostgresTableMigration

    def _adapter_get_database_table_field_names(self, table_name: str, namespace: str = "") -> list:
        """
        returns a list with the field names of an existing table. Does not use the dsd but the table structure itself.
        :param table_name: the name of the table.
        :param namespace: the namespace if needed.
        :returns: list of names or an empty list in case of an error
        """
        try:
            cur = self._get_dict_cursor()
            cur.execute(f"select * from {self.sql_safe_namespaced_table(namespace, table_name)} limit 0")
            cols = [desc[0] for desc in cur.description]
            return cols
        finally:
            try:
                cur.close()
            except:
                pass
        return []

    def _adapter_get_tables_and_versions(self, only_prefix, namespace):
        """ returns the instantiated tables, their dsd names and version.
            Expects a migration catalog to exist.

        :param only_prefix: only tables with a given prefix are returned
        :param namespace: only tables of a a given namespace are returned
        :return dict with the tablename as key and a Tuple (dsd-table, version) as value
        """
        result = {}
        cur = self._get_dict_cursor()
        try:
            params = [namespace]
            cur.execute(f"select " + f" \"table\", \"table_definition\", \"version\" from "
                        f"{self.sql_safe_ident(self.migration_catalog_name)}"
                        f" where namespace=%s", params)
            r = cur.fetchone()
            while r:
                table_name: str = r["table"]
                if (not only_prefix) or (table_name.startswith(only_prefix)):
                    result[table_name] = (r["table_definition"], r["version"])
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"PostgresMigration._adapter_get_tables_and_versions: "
                          f"Exception when querying migration catalog: {repr(e)}")
            raise e
        finally:
            cur.close()

        return result

    def _adapter_move_tables(self, prefix, current_namespace, new_namespace, commit=True):
        tables = self._adapter_get_tables_and_versions(prefix, namespace=current_namespace)
        result = False
        try:
            sql = f"create schema if not exists {self.sql_safe_ident(new_namespace)}"
            self.execute_sql(sql)
            for table in tables.keys():
                if not self._move_table_to_namespace(table, old_namespace=current_namespace,
                                                     new_namespace=new_namespace):
                    raise Exception(f"_move_table_to_namespace returned False for table {table}.")
            if commit:
                self._con.commit()
            result = True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._adapter_move_tables: {repr(e)}")
            if commit:
                self._con.rollback()

        return result

    # todo time zone simplified: What to do here?
    @staticmethod
    def _adapter_get_now_str():
        return f"'{datetime.datetime.now().isoformat()}'"

    def _adapter_get_sql_lines(self, root_path, sql_instruction, prefix="", namespace=""):
        """
        returns either sql statements from a file given by sql_instructions or the sql_instruction itself.
        All sql statements can have {{ table }} notation. Tables in double curly brackets will be replaced by
        properly sanitized and - if namespace is given - schematized.
        :param root_path: A folder in which files are expected.
        :param sql_instruction: either the instruction itself or a filename ending on ".sql".
        :param namespace: if given all tables are expected to be in this namespace
                          if they are written in double curly brackets.
        :return: an sql script. Raises Exception in case of errors.
        """
        if not sql_instruction:
            raise Exception(f"{self.__class__.__name__}._adapter_get_sql_lines:"
                            f"No sql-filename or sql-statement given.")

        if get_file_extension(sql_instruction) == "sql":
            sql_filename = sql_instruction
            sql_filename = os.path.join(root_path, sql_filename)
            if not os.path.isfile(sql_filename):
                raise Exception(f"{self.__class__.__name__}._adapter_get_sql_lines:"
                                f"Error in sql_instruction '{sql_instruction}':"
                                f"file {sql_filename} does not exist.")
            with open(sql_filename) as f:
                lines = f.read().splitlines()

            sql_script: str = ""
            for _ in range(0, len(lines)):
                line = lines[_]
                line, warnings = self.substitute_variables(line)
                if warnings and "NOW" in warnings:
                    logging.warning(f"{self.__class__.__name__}._adapter_get_sql_lines: "
                                  f"using the {'NOW'} variable is discouraged for migration scripts "
                                  f"because of potential time zone issues. sql_instruction: {sql_instruction}")

                sql_script = "\n".join([sql_script, self.schematize_curly_tables(line=line,
                                                                                 prefix=prefix,
                                                                                 namespace=namespace)])
        else:
            lines, warnings = self.substitute_variables(sql_instruction)
            if warnings and "NOW" in warnings:
                logging.warning(f"{self.__class__.__name__}._adapter_get_sql_lines: "
                                f"using the {'NOW'} variable is discouraged for migration scripts "
                                f"because of potential time zone issues. sql_instruction: {sql_instruction}")

            sql_script = self.schematize_curly_tables(lines, prefix=prefix, namespace=namespace)

        return sql_script

    def _move_table_to_namespace(self, db_table: str, old_namespace: "", new_namespace: ""):
        src_table = self.sql_safe_namespaced_table(old_namespace, db_table)

        sql = f"alter table {src_table} SET SCHEMA {self.sql_safe_ident(new_namespace)}"
        self.execute_sql(sql)
        sql = f"update {self.sql_safe_ident(self.migration_catalog_name)} set namespace = '{new_namespace}' " \
              f"where \"table\"=%s and \"namespace\"=%s"
        params = [db_table, old_namespace]
        return self.execute_sql(sql, params)

    def get_migration_flag(self, flag_name) -> str:
        """
        returns the value of a migration flag from the database.
        :param flag_name: the name of the flag
        :return: the value or None if the flag does not exist.
        """
        sql = "select " + f"value from migration_flags where flag='{flag_name}'"
        value = None
        cur = self._get_dict_cursor()
        try:
            cur.execute(sql)
            r = cur.fetchone()
            if r:
                value = r["value"]
        except BaseException as e:
            pass
        finally:
            cur.close()
        return value

    def set_migration_flag(self, flag_name: str, value: str) -> bool:
        """
        sets a migration flag to the given value in the database.
        :param flag_name: the name of the flag
        :param value: the value
        :return: True or False. Should not throw exceptions.
        """

        sql = "update " + f" migration_flags set value = '{value}' where flag='{flag_name}'"
        cur = self._get_dict_cursor()
        result = True
        # self._begin_savepoint(cur, "set_migration_flag")
        try:
            cur.execute(sql)
            if cur.rowcount == 0:
                sql = "insert " + f"into migration_flags(flag, value) values('{flag_name}', '{value}')"
                cur.execute(sql)
        except BaseException as e:
            result = False
            # self._rollback_savepoint(cur, "set_migration_flag")
            # print(repr(e))
            logging.error(f"{self.__class__.__name__}.set_migration_flag: {repr(e)}")
        finally:
            cur.close()

        return result
