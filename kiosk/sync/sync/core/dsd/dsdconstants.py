KEY_TABLE_STRUCTURE = "structure"
KEY_TABLE_MIGRATION = "migration"
KEY_CONFIG = "config"
KEY_FORMAT_VERSION = "format_version"
KEY_CONFIG_IMPORTS = "imports"
KEY_CONFIG_MIGRATION_SCRIPTS = "migration_scripts"
KEY_CONFIG_CONTEXTS = "contexts"
KEY_TABLE_META_DATA = "meta"
KEY_TABLE_CACHE = "_cache"

# system tables are invisible in almost all dsd operations. e.G. list_tables.
KEY_TABLE_FLAG_SYSTEM_TABLE = "system_table"
# not_in_master tables are not regularly created or migrated in the master database
# Such tables only exist for workstations and are migrated and created only in their context
KEY_TABLE_FLAG_NOT_IN_MASTER = "not_in_master"
KEY_TABLE_FLAG_EXPORT_DONT_TRUNCATE = "export_dont_truncate"

# introduced with Kiosk 1.7.59
# in a table marked as "file_list" records are deleted when the assigned image is detached from the record
# if the flag is missing the file reference is set to null instead.
KEY_TABLE_FLAG_FILE_LIST = "file_list"

KEY_TABLE_META_IMPORT_FILTER = "import_filter"
KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION = "sync_ignore_unique_key_violation"
KEY_INSTRUCTION_IDENTIFIER = "identifier"
KEY_INSTRUCTION_REPLFIELD_UUID = "replfield_uuid"
KEY_INSTRUCTION_PRIMARY = "primary"
KEY_INSTRUCTION_REPLFIELD_CREATED = "replfield_created"
KEY_INSTRUCTION_REPLFIELD_MODIFIED = "replfield_modified"
KEY_INSTRUCTION_MODIFIED_WW = "modified_ww"
KEY_INSTRUCTION_MODIFIED_TZ = "modified_tz"
KEY_INSTRUCTION_REPLFIELD_CREATED_BY = "replfield_created_by"
KEY_INSTRUCTION_REPLFIELD_MODIFIED_BY = "replfield_modified_by"
KEY_INSTRUCTION_UID_FILE = "uid_file"
KEY_INSTRUCTION_DESCRIBES_FILE = "describes_file"
KEY_INSTRUCTION_FILE_LOCATION_FOR = "file_location_for"
KEY_INSTRUCTION_FILE_ASSIGNED_TO = "file_assigned_to"
KEY_INSTRUCTION_SKIP_INDEX_ON = "skip_index_on"
