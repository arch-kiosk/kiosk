class MigrationInstruction:
    @classmethod
    def register(cls, registry: {}):
        raise NotImplementedError

    @classmethod
    def create_sql_instructions(cls, dsd, parameters):
        return []

    @classmethod
    def create_post_migration_instructions(cls, dsd, parameters):
        return []

    @classmethod
    def create_pre_migration_instructions(cls, dsd, parameters):
        return []
