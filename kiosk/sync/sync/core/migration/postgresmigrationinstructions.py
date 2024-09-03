from migration import postgresdbmigration
from migration.migrationinstruction import MigrationInstruction
from migration.tablemigration import _TableMigration
from dsd.dsderrors import *


class AddMigrationInstruction(MigrationInstruction):
    @classmethod
    def register(cls, registry: {}):
        registry["add"] = cls

    @classmethod
    def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
        # table_migration: postgrestablemigration._PostgresTableMigration
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration
        table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                         db_table=table_migration.db_table)
        sql = f"ALTER TABLE {table_name} "

        field_name = parameters[0]
        instructions = table_migration.migration.dsd.get_field_instructions(table=table_migration.dsd_table,
                                                                            fieldname=field_name,
                                                                            version=table_migration.to_version)
        field_attributes = []
        migration.process_create_instructions(field_name, instructions, field_attributes)

        sql += f"ADD COLUMN {migration.sql_safe_ident(field_name)} "
        sql += " ".join(field_attributes)

        if field_attributes[0] == "TIMESTAMP WITH TIME ZONE":
            sql += f",ADD COLUMN {migration.sql_safe_ident(field_name + '_tz')} INTEGER DEFAULT NULL"

        return [sql]


class AlterMigrationInstruction(MigrationInstruction):
    @classmethod
    def register(cls, registry: {}):
        registry["alter"] = cls

    @classmethod
    def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration

        table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                         db_table=table_migration.db_table)
        sql_alter = f"ALTER TABLE {table_name}"
        sql = ""
        field_name = parameters[0]

        new_field_instructions = table_migration.migration.dsd.get_field_instructions(
            table=table_migration.dsd_table,
            fieldname=field_name,
            version=table_migration.to_version)

        try:
            old_field_instructions = table_migration.migration.dsd.get_field_instructions(
                table=table_migration.dsd_table,
                fieldname=field_name,
                version=table_migration.from_version)
        except KeyError:
            old_field_instructions = {}

        changed_field_instructions = cls._get_modified_field_instructions(old_field_instructions,
                                                                          new_field_instructions)
        alter_table_lines = []
        migration.process_migrate_instructions(field_name, old_field_instructions, changed_field_instructions,
                                               alter_table_lines)
        if alter_table_lines:
            sql = ", ".join([sql, *alter_table_lines]) if sql else ", ".join(alter_table_lines)

        added_field_instructions = cls._get_new_field_instructions(old_field_instructions, new_field_instructions)
        alter_table_lines = []
        migration.process_migrate_instructions(field_name, old_instructions=[],
                                               new_instructions=added_field_instructions,
                                               alter_lines=alter_table_lines)
        if alter_table_lines:
            sql = ", ".join([sql, *alter_table_lines]) if sql else ", ".join(alter_table_lines)

        dropped_field_instructions = cls._get_dropped_field_instructions(old_field_instructions, new_field_instructions)
        alter_table_lines = []
        migration.process_drop_instructions(field_name, dropped_field_instructions, alter_table_lines)
        if alter_table_lines:
            sql = ", ".join([sql, *alter_table_lines]) if sql else ", ".join(alter_table_lines)
        if sql:
            sql = sql_alter + " " + sql
        return [sql]

    @classmethod
    def _get_new_field_instructions(cls, old_field_instructions, new_field_instructions):
        """returns a dictionary with those field instructions (and their parameters) 
           that exist in new_field_instructions but not in old_field_instructions. 
        """
        result = {}
        old_field_instructions_names = list(old_field_instructions.keys())
        for instruction in new_field_instructions.keys():
            if instruction not in old_field_instructions_names:
                result[instruction] = list(new_field_instructions[instruction])

        return result

    @classmethod
    def _get_modified_field_instructions(cls, old_field_instructions, new_field_instructions):
        """returns a dictionary with those field instructions (and their parameters) 
           that exist both in old_field_instructions and new_field_instructions 
           but differently. 
        """
        result = {}
        old_field_instructions_names = list(old_field_instructions.keys())
        for instruction in new_field_instructions.keys():
            if instruction in old_field_instructions_names:
                new_params = new_field_instructions[instruction]
                old_params = old_field_instructions[instruction]
                if len(new_params) != len(old_params):
                    result[instruction] = list(new_params)
                    continue
                for i in range(0, len(new_params)):
                    if new_params[i] != old_params[i]:
                        result[instruction] = list(new_params)
                        break

        return result

    @classmethod
    def _get_dropped_field_instructions(cls, old_field_instructions, new_field_instructions):
        """ returns a dictionary with those field instructions that exist in old_field_instructions 
            but not in new_field_instructions. The old parameters of the dropped field instructions 
            are accessible as the dictionary value.
        """
        result = {}
        new_field_instructions_names = list(new_field_instructions.keys())
        for instruction in old_field_instructions.keys():
            if instruction not in new_field_instructions_names:
                result[instruction] = old_field_instructions[instruction]

        return result


class DropMigrationInstruction(MigrationInstruction):
    @classmethod
    def register(cls, registry: {}):
        registry["drop"] = cls

    @classmethod
    def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
        # table_migration: postgrestablemigration._PostgresTableMigration
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration
        if parameters[0] == "*":
            table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                             db_table=table_migration.db_table)
            sql = f"DROP TABLE {table_name}"
            return [sql]

        table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                         db_table=table_migration.db_table)
        sql = f"ALTER TABLE {table_name} "
        field_name = parameters[0]

        try:
            old_field_instructions = table_migration.migration.dsd.get_field_instructions(
                table=table_migration.dsd_table,
                fieldname=field_name,
                version=table_migration.from_version)
        except KeyError:
            raise DSDInstructionValueError(
                f"Cannot drop field {field_name} from version {table_migration.from_version}.")

        sql += f"DROP COLUMN {migration.sql_safe_ident(field_name)}"
        if table_migration.migration.dsd.translate_datatype(
                old_field_instructions["datatype"][0]).lower() == "timestamp":
            sql += f",DROP COLUMN {migration.sql_safe_ident(field_name + '_tz')}"

        return [sql]


class RenameMigrationInstruction(MigrationInstruction):
    @classmethod
    def register(cls, registry: {}):
        registry["rename"] = cls

    @classmethod
    def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
        # table_migration: postgrestablemigration._PostgresTableMigration
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration

        table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                         db_table=table_migration.db_table)
        sql = f"ALTER TABLE {table_name} "
        old_field_name = parameters[0]
        new_field_name = parameters[1]

        sql += f"RENAME COLUMN {migration.sql_safe_ident(old_field_name)} TO {migration.sql_safe_ident(new_field_name)}"

        try:
            old_field_instructions = table_migration.migration.dsd.get_field_instructions(
                table=table_migration.dsd_table,
                fieldname=old_field_name,
                version=table_migration.from_version)
        except KeyError:
            raise DSDInstructionValueError(f"Cannot rename field {old_field_name} from version "
                                           f"{table_migration.from_version}. There is no such field!")

        if table_migration.migration.dsd.translate_datatype(
                old_field_instructions["datatype"][0]).lower() == "timestamp":
            sql += (f",RENAME COLUMN {migration.sql_safe_ident(old_field_name + '_tz')} "
                    f"TO {migration.sql_safe_ident(new_field_name + '_tz')}")

        return [sql]


# class DropTableMigrationInstruction(MigrationInstruction):
#     @classmethod
#     def register(cls, registry: {}):
#         registry["drop"] = cls
#
#     @classmethod
#     def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
#         # table_migration: postgrestablemigration._PostgresTableMigration
#         migration: postgresdbmigration.PostgresDbMigration = table_migration.migration
#         if parameters[0] == "*":
#             table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
#                                                              db_table=table_migration.db_table)
#             sql = f"DROP TABLE {table_name}"
#             return [sql]
#
#         table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
#                                                          db_table=table_migration.db_table)
#         sql = f"ALTER TABLE {table_name} "
#         field_name = parameters[0]
#
#         sql += f"DROP COLUMN {migration.sql_safe_ident(field_name)}"
#
#         return [sql]


class RenameTableMigrationInstruction(MigrationInstruction):
    @classmethod
    def register(cls, registry: {}):
        registry["rename_table"] = cls

    @classmethod
    def create_sql_instructions(cls, table_migration: _TableMigration, parameters: []):
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration
        old_table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                             db_table=table_migration.prefix + parameters[0])

        new_table_name = migration.sql_safe_ident(table_migration.prefix + parameters[1])

        sql = f"ALTER TABLE {old_table_name} RENAME TO {new_table_name}"
        table_migration.new_db_table_name = parameters[1]
        table_migration.old_db_table_name = parameters[0]
        return [sql]


class __ExecuteSqlScriptMigrationInstruction(MigrationInstruction):
    instruction_name = ""

    @classmethod
    def register(cls, registry: {}):
        registry[cls.instruction_name] = cls

    @classmethod
    def _get_sql_migration_lines(cls, table_migration: _TableMigration, parameters: []):
        migration: postgresdbmigration.PostgresDbMigration = table_migration.migration
        table_name = migration.sql_safe_namespaced_table(namespace=table_migration.namespace,
                                                         db_table=table_migration.db_table)
        if len(parameters) == 0 or not parameters[0]:
            raise Exception(f"{cls.instruction_name} with no sql-filename or sql-statement given "
                            f"in migration for table {table_name}")
        return migration.get_sql_lines(migration.dsd.dsd_root_path,
                                       parameters[0],
                                       prefix=table_migration.prefix,
                                       namespace=table_migration.namespace)


class ExecuteBeforeMigrationMigrationInstruction(__ExecuteSqlScriptMigrationInstruction):
    instruction_name = "execute_before_migration"

    @classmethod
    def create_pre_migration_instructions(cls, *args, **kwargs):
        return [cls._get_sql_migration_lines(*args, **kwargs)]


class ExecuteAfterMigrationMigrationInstruction(__ExecuteSqlScriptMigrationInstruction):
    instruction_name = "execute_after_migration"

    @classmethod
    def create_post_migration_instructions(cls, *args, **kwargs):
        return [cls._get_sql_migration_lines(*args, **kwargs)]
