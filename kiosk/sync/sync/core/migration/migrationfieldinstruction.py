import logging
from dsd.dsderrors import *


class MigrationFieldInstruction:
    @classmethod
    def register(cls, migration_set: {}):
        raise NotImplementedError

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        raise DSDFeatureNotSupported(
            f"{cls.__name__}.execute_during_creation: instruction does not support creation (field {field_name}).")

    @classmethod
    def execute_during_migration(cls, field_name, old_parameters: [], new_parameters: []):
        raise DSDFeatureNotSupported(
            f"{cls.__name__}.execute_during_migration: instruction does not support migration (field {field_name}).")

    @classmethod
    def execute_drop(cls, field_name, old_parameters: []):
        raise DSDFeatureNotSupported(
            f"{cls.__name__}.execute_drop: instruction does not support dropping (field {field_name}).")
