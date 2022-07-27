from migration.tablemigration import _TableMigration
from migration.postgresmigrationinstructions import *
from migration import postgresdbmigration


class _PostgresTableMigration(_TableMigration):
    def _adapter_register_migration_instruction_set(self):
        registry = {}
        AddMigrationInstruction.register(registry)
        DropMigrationInstruction.register(registry)
        RenameMigrationInstruction.register(registry)
        AlterMigrationInstruction.register(registry)
        RenameTableMigrationInstruction.register(registry)
        ExecuteBeforeMigrationMigrationInstruction.register(registry)
        ExecuteAfterMigrationMigrationInstruction.register(registry)
        return registry

    def _adapter_before_table_migration(self):
        return True

    def _adapter_after_table_migration(self, success: bool):
        return True

    def _adapter_execute_pre_migration_sqls(self):
        migration: postgresdbmigration.PostgresDbMigration = self.migration
        for sql in self.pre_migration_sqls:
            migration.execute_sql(sql)

    def _adapter_execute_post_migration_sqls(self):
        migration: postgresdbmigration.PostgresDbMigration = self.migration
        for sql in self.post_migration_sqls:
            migration.execute_sql(sql)

    def _adapter_execute_migration_sqls(self):
        migration: postgresdbmigration.PostgresDbMigration = self.migration
        for sql in self.migration_sqls:
            migration.execute_sql(sql)
