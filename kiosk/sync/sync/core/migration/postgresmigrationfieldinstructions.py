import logging

from migration.migrationfieldinstruction import MigrationFieldInstruction
from dsd.dsderrors import *
from core.databasedrivers import DATATYPE_CONVERSIONS


# ****************************************************
# datatype
# ****************************************************
class MiPgDataType(MigrationFieldInstruction):
    _postgres_datatype_conversions = DATATYPE_CONVERSIONS

    @classmethod
    def register(cls, migration_set: {}):
        migration_set["datatype"] = cls

    @classmethod
    def _get_sql_datatype(cls, parameters):
        dtype = parameters[0].upper()
        if dtype not in cls._postgres_datatype_conversions:
            return ""

        dtype = cls._postgres_datatype_conversions[dtype]
        if len(parameters) == 2:
            return f"{dtype}({parameters[1]})"
        else:
            return f"{dtype}"

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        result = cls._get_sql_datatype(parameters)
        if not result:
            raise DSDDataTypeError(f"MiPgDataType.execute_during_creation:"
                                   f"Unknown datatype {parameters[0]} for field {field_name}.")
        else:
            return result

    @classmethod
    def execute_during_migration(cls, field_name, old_parameters: [], new_parameters: []):
        datatype = cls._get_sql_datatype(new_parameters)
        if not datatype:
            raise DSDDataTypeError(f"MiPgDataType.execute_during_migration:"
                                   f"Unknown datatype {new_parameters[0]} for field {field_name}.")
        old_datatype = cls._get_sql_datatype(old_parameters)
        if datatype.upper() == "TIMESTAMP WITH TIME ZONE" or old_datatype.upper() == "TIMESTAMP WITH TIME ZONE":
            raise DSDDataTypeError(f"MiPgDataType.execute_during_migration:"
                                   f"Data type timestamp cannot be used in an alter migration. (field: {field_name})")

        # potential security risk, I know. But how to get the bloody psycopg sanitizing in here, I do not know.
        using = ""
        if datatype == "UUID":
            using = f" using {field_name}::uuid"
        # todo #: This does not work if the default value has to be turned to INTEGER as well!
        if datatype == "INTEGER":
            using = f" using {field_name}::INTEGER"
        return [f"ALTER \"{field_name}\" TYPE {datatype}{using}"]


# ****************************************************
# unique
# ****************************************************
class MiPgUnique(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["unique"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return f"UNIQUE"

    @classmethod
    def execute_during_migration(cls, field_name, old_parameters: [], new_parameters: []):
        return [f"ADD CONSTRAINT {field_name}_unique UNIQUE({field_name})"]


# ****************************************************
# not_null
# ****************************************************
class MiPgNotNull(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["not_null"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return f"NOT NULL"

    @classmethod
    def execute_during_migration(cls, field_name, old_parameters: [], new_parameters: []):
        return [f"ALTER \"{field_name}\" SET NOT NULL"]

    @classmethod
    def execute_drop(cls, field_name, old_parameters: []):
        return [f"ALTER \"{field_name}\" DROP NOT NULL"]


# ****************************************************
# primary
# ****************************************************
class MiPgPrimary(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["primary"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return f"PRIMARY KEY"


# ****************************************************
# default
# ****************************************************
class MiPgDefault(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["default"] = cls

    @classmethod
    def _check_default_value(cls, field_name, default_value: str) -> str:
        if default_value.lower() == "'null'":
            logging.debug(f"{cls.__name__}._check_default_value: MiPgDefault.execute_during_creation:"
                         f"Encountered a single-quoted 'null' for field {field_name}. "
                         f"This is discouraged because it can be ambiguous. If you want the "
                         f"text null here, use $$null$$. Here it will be assumed you wanted null")
            return 'null'

        if default_value.lower().strip("'") == "$$null$$":
            default_value = "'" + default_value.strip("'$") + "'"

        return default_value

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        default_value = cls._check_default_value(field_name, parameters[0])

        return f"DEFAULT {default_value}"

    @classmethod
    def execute_during_migration(cls, field_name, old_parameters: [], new_parameters: []):
        default_value = cls._check_default_value(field_name, new_parameters[0])
        return [f"ALTER \"{field_name}\" SET DEFAULT {default_value}"]

    @classmethod
    def execute_drop(cls, field_name, old_parameters: []):
        return [f"ALTER \"{field_name}\" DROP DEFAULT"]


# ****************************************************
# uuid_key
# ****************************************************
class MiPgUuidKey(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["uuid_key"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return [MiPgUnique.execute_during_creation(field_name, parameters),
                MiPgPrimary.execute_during_creation(field_name, parameters),
                MiPgNotNull.execute_during_creation(field_name, parameters),
                MiPgDefault.execute_during_creation(field_name, ["gen_random_uuid()"])
                ]


# ****************************************************
# replfield_created
# ****************************************************
class MiPgReplfieldCreated(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["replfield_created"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return [
            MiPgNotNull.execute_during_creation(field_name, parameters),
        ]


# ****************************************************
# replfield_uuid
# ****************************************************
class MiPgReplfieldUuid(MigrationFieldInstruction):
    @classmethod
    def register(cls, migration_set: {}):
        migration_set["replfield_uuid"] = cls

    @classmethod
    def execute_during_creation(cls, field_name, parameters):
        return [
            MiPgUnique.execute_during_creation(field_name, parameters),
            MiPgPrimary.execute_during_creation(field_name, parameters),
            MiPgNotNull.execute_during_creation(field_name, parameters),
            MiPgDefault.execute_during_creation(field_name, ["gen_random_uuid()"])
        ]
