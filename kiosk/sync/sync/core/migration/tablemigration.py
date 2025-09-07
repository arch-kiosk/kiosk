from migration import databasemigration
from dsd.dsderrors import *


class _TableMigration:
    def __init__(self, migration, dsd_table, from_version, to_version, prefix="", namespace=""):
        self.dsd_table = dsd_table
        self.from_version = from_version
        self.to_version = to_version
        self.prefix = prefix
        self.db_table = self.prefix + self.dsd_table
        self.namespace = namespace
        self.migration: databasemigration.DatabaseMigration = migration
        self.migration_instruction_set = self._adapter_register_migration_instruction_set()
        self.migration_instructions = []
        self.migration_sqls = []
        self.pre_migration_sqls = []
        self.post_migration_sqls = []
        self.new_db_table_name = ""
        self.old_db_table_name = ""

    def execute(self):
        """
            executes the table migration. Let's all kinds of exceptions through
        """
        success = False
        self._adapter_before_table_migration()
        try:
            success = self._migrate_table()
        finally:
            self._adapter_after_table_migration(success)

        return success

    def _migrate_table(self):
        """ 
            migrates a single table from one version to the next higher (or lower) one. Don't call directly,
            use migrate_table instead.
            :returns: True if okay, otherwise exceptions will be thrown
        """

        try:
            if self.to_version > self.from_version:
                self.migration_instructions = self.migration.dsd.get_migration_instructions(self.dsd_table,
                                                                                            version=self.to_version)
            else:
                self.migration_instructions = self.migration.dsd.get_migration_instructions(self.dsd_table,
                                                                                            version=self.from_version,
                                                                                            upgrade=False)
        except KeyError as e:
            if "migration" in repr(e):
                raise KeyError(f"When migrating table '{self.db_table}' from {self.from_version} to {self.to_version} "
                               f"no migration instructions where found.")
            raise e

        self.migration_sqls = []
        self.pre_migration_sqls = []
        self.post_migration_sqls = []

        self.new_db_table_name = ""
        for instruction_definition in self.migration_instructions:
            instruction = list(instruction_definition.keys())[0].lower()
            instruction_parameters = instruction_definition[instruction]
            if instruction in self.migration_instruction_set:
                migration_instruction_class = self.migration_instruction_set[instruction]
                self.pre_migration_sqls.extend(
                    migration_instruction_class.create_pre_migration_instructions(self, instruction_parameters))

                self.migration_sqls.extend(
                    migration_instruction_class.create_sql_instructions(self, instruction_parameters))

                self.post_migration_sqls.extend(
                    migration_instruction_class.create_post_migration_instructions(self, instruction_parameters))

            else:
                raise DSDUnknownInstruction(f"Migration instruction {instruction}")

        self._adapter_execute_pre_migration_sqls()
        self._adapter_execute_migration_sqls()
        self._adapter_execute_post_migration_sqls()
        if not self.old_db_table_name:
            self.migration.set_table_structure_version(db_table=self.prefix + self.dsd_table,
                                                       dsd_table=self.dsd_table,
                                                       version=self.to_version, namespace=self.namespace)
        else:
            # the table has been renamed. Delete the old entry first
            self.migration.delete_from_migration_catalog(db_table=self.prefix + self.old_db_table_name,
                                                         namespace=self.namespace)
            # the table has been renamed. Insert the new one
            self.migration.set_table_structure_version(db_table=self.prefix + self.new_db_table_name,
                                                       dsd_table=self.dsd_table,
                                                       version=self.to_version, namespace=self.namespace)

        return True

    def _adapter_register_migration_instruction_set(self):
        raise NotImplementedError

    def _adapter_before_table_migration(self):
        return True

    def _adapter_after_table_migration(self, success: bool):
        return True

    def _adapter_execute_pre_migration_sqls(self):
        raise NotImplementedError

    def _adapter_execute_migration_sqls(self):
        raise NotImplementedError

    def _adapter_execute_post_migration_sqls(self):
        raise NotImplementedError
