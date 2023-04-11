import logging
import re

from dsd.dsd3 import DataSetDefinition
from dsd.dsderrors import *
from migration.tablemigration import _TableMigration


class DatabaseMigration:

    def __init__(self, dsd: DataSetDefinition, migration_catalog_name="migration_catalog",
                 migration_flags_name="migration_flags"):
        self.migration_catalog_name = migration_catalog_name
        self.migration_flags_name = migration_flags_name
        self.dsd: DataSetDefinition = dsd
        self._field_instruction_set = {}
        self._adapter_register_field_instruction_set()
        self._field_attributes = []
        self.variable_pattern = r"\{(.+?)\}"
        self.regex_variable_pattern = re.compile(self.variable_pattern)
        self.table_pattern = r"\{\{(.+?)\}\}"
        self.regex_table_pattern = re.compile(self.table_pattern)

    @classmethod
    def _adapter_get_table_migration_class(cls):
        raise NotImplementedError

    def _adapter_register_field_instruction_set(self):
        raise NotImplementedError

    def sql_safe_ident(self, identifier: str):
        """
        returns a sanitized and properly quoted sql identifier (table names, field names etc.).
        Does the same things like KioskSQLDb.sql_safe_namespaced_table.
        This here uses the internal connection object.

        :param identifier: identifier that has to be sanitized and quoted
        :return: the sanitized and quoted identifier
        """
        raise NotImplementedError

    def sql_safe_namespaced_table(self, namespace: str, db_table: str):
        """
        returns a sanitized and properly quoted table name. If a namespace is not "",
        a schema name will be set in front of the tablename. Does the same things like
        KioskSQLDb.sql_safe_namespaced_table. This here uses the internal connection object.

        :param namespace: the schema name
        :param db_table: the table name
        :return:
        """
        raise NotImplementedError

    @staticmethod
    def _adapter_get_now_str():
        raise NotImplementedError

    def substitute_variables(self, line: str, prefix="", namespace=""):
        """
        replaces variables enclosed in curly brackets: Like {NOW} is substituted with the
        current date and time.

        currently supports only {NOW}

        :param line: The line
        :param prefix: if the variable results in a table, a prefix might be needed
        :param namespace: if the variable results in a table, a namespace might be needed
        :return: the new line
        """
        match_iter = self.regex_variable_pattern.finditer(line)
        substitution = {}
        for match in match_iter:
            match_str = match.group(0)
            variable = match.group(1)
            if variable == 'NOW':
                substitution[match_str] = self._adapter_get_now_str()

        new_line = line
        for subst in substitution.keys():
            new_line = new_line.replace(subst, substitution[subst])
        return new_line

    def schematize_curly_tables(self, line: str, prefix="", namespace=""):
        """
        interprets text in double curly brackets as a table and replaces it with a sanitized and quoted version.
        if namespace is not empty, the table statement will also be added the namespace.

        :param line: The line with table statements in double curly brackets
        :param prefix: a prefix will be placed in front of the table's name.
        :param namespace: a namespace or an empty string
        :return: the new line
        """
        match_iter = self.regex_table_pattern.finditer(line)
        substitution = {}
        for match in match_iter:
            match_str = match.group(0)
            table = match.group(1)
            db_table = prefix + table
            new_table = self.sql_safe_namespaced_table(namespace=namespace, db_table=db_table)
            substitution[match_str] = new_table

        new_line = line
        for subst in substitution.keys():
            new_line = new_line.replace(subst, substitution[subst])
        return new_line

    def get_table_structure_version(self, db_table, namespace=""):
        """ returns the currently in the database instantiated version of the table.
            returns 0 if the table does not exist at all and -1 if an error occured. 

            : note: if the migration catalog does not exist it will be created.
            : note: also this looks only for tables in the database not for dsd-table names. Although
                    these are often the same, that is rather accidental and not true e.G. for workstation tables.
        """
        if not self._adapter_table_exists(self.migration_catalog_name):
            if not self._create_table(dsd_table=self.migration_catalog_name, db_table=self.migration_catalog_name):
                logging.error(f"Migration Catalog could not be created and initialized.")
                return -1
        if not self._adapter_table_exists(self.migration_flags_name):
            if not self._create_table(dsd_table=self.migration_flags_name, db_table=self.migration_flags_name):
                logging.error(f"Migration flags table could not be created and initialized.")
                return -1

        return self._adapter_get_table_structure_version(db_table, namespace=namespace)

    def get_tables_and_versions(self, only_prefix="", namespace="") -> dict:
        """ returns the instantiated tables, their dsd names and version.
        :param only_prefix: only tables with a given prefix are returned
        :param namespace: only tables of a a given namespace are returned
        :return dict with the tablename as key and a Tuple (dsd-table, version) as value
        """
        if not self._adapter_table_exists(self.migration_catalog_name):
            return []

        return self._adapter_get_tables_and_versions(only_prefix, namespace)

    def execute_sql(self, sql, params: list = None):
        """ Executes an sql statement with parameters
        : returns : number of affected records
        : exceptions: lets all exceptions through
        """
        raise NotImplementedError

    def _adapter_fix_migration_catalog(self, old_dsd_table="", new_dsd_table=""):
        """ changes all occurrences of old_dsd_table to new_dsd_table. Used when a dsd-table is renamed.

            : note: The migration catalog must exist
        """
        raise NotImplementedError

    def _adapter_get_database_table_field_names(self, table_name: str, namespace: str = "") -> list:
        """
        returns a list with the field names of an existing table in the database
        :param table_name: the name of the table
        """
        raise NotImplementedError

    def _create_table(self, dsd_table, db_table, version=0, namespace="", temporary=False, sync_tools=False):
        """creates a table in the given version from the dsd. Does not check if the table already exists.
        :param dsd_table: The name of the table definition in the dsd
        :param db_table: The name of the table in the database.
        :param version: The version of the dsd table definition to use. if 0 the current version is going to be used.
        :param temporary: create a temp table
        :sync_tools: suppresses the primary and unique definitions in the dsd and adds other features needed
                     only within the synchronization process. Default is false.
        :returns: false if some known error occurs, can throw exceptions for other errors """
        if dsd_table in self.dsd.list_tables(include_system_tables=True):
            if version == 0:
                version = self.dsd.get_current_version(dsd_table)
            if version in self.dsd.list_versions(dsd_table):
                if self._adapter_create_table(dsd_table=dsd_table, db_table=db_table,
                                              version=version, namespace=namespace, sync_tools=sync_tools,
                                              temporary=temporary):
                    if not (sync_tools or temporary):
                        return self._adapter_insert_table_structure_version(dsd_table=dsd_table,
                                                                            db_table=db_table, version=version,
                                                                            namespace=namespace)
                    else:
                        return True
            else:
                logging.error(f"DatabaseMigration.create_table: no structure for table {dsd_table}, version {version}")
        else:
            logging.error(f"DatabaseMigration.create_table: no structure for table {dsd_table}")
        return False

    def create_table(self, dsd_table: str, version=0, namespace="", db_table="", sync_tools=False):
        """creates a table in the given version from the dsd. Makes sure that the table does not exist already.
        :param dsd_table: The name of the table definition in the dsd
        :param db_table: The name of the table in the database. If not given, dsd_table will be used.
        :param version: The version of the dsd table structure to use
        :param namespace: If the table is in a namespace other than public.
        :param sync_tools: suppresses the primary and unique definitions in the dsd and adds other features needed
                     only within the synchronization process. Default is false.
        :returns: false if some known error occurs, can throw exceptions for other errors """

        if not db_table:
            db_table = dsd_table

        if self._adapter_table_exists(db_table):
            logging.error(f"DatabaseMigration.create_table: attempt to create existing table {db_table}.")
            return False

        return self._create_table(dsd_table=dsd_table, db_table=db_table,
                                  namespace=namespace, version=version,
                                  sync_tools=sync_tools)

    def create_temporary_table(self, dsd_table: str, version=0, db_table="", sync_tools=False):
        """creates a temporary table in the given version from the dsd. 
        :param dsd_table: The name of the table definition in the dsd
        :param db_table: The name of the table in the database. If not given, dsd_table will be used.
        :param version: The version of the dsd table structure to use
        :param sync_tools: suppresses the primary and unique definitions in the dsd and adds other features needed
                     only within the synchronization process. Default is false.
        :returns: false if some known error occurs, can throw exceptions for other errors """

        if not db_table:
            db_table = dsd_table

        return self._create_table(dsd_table=dsd_table, db_table=db_table,
                                  version=version,
                                  sync_tools=sync_tools, temporary=True)

    def set_table_structure_version(self, db_table, dsd_table, version, namespace=""):
        if self._adapter_exists_in_catalog(db_table, namespace):
            return self._adapter_update_table_structure_version(db_table=db_table, dsd_table=dsd_table,
                                                                version=version, namespace=namespace)
        else:
            return self._adapter_insert_table_structure_version(db_table=db_table, dsd_table=dsd_table,
                                                                version=version, namespace=namespace)

    def _adapter_exists_in_catalog(self, db_table, namespace=""):
        """ checks if a table exists in the migration catalog (does not check the database)
            :returns: boolean.
        """
        raise NotImplementedError

    def _adapter_table_exists(self, table, namespace=""):
        """ checks if a table actually exists in the database (does not check the migration catalog) 
            :returns: boolean.
        """
        raise NotImplementedError

    def _adapter_create_table(self, dsd_table, db_table, version=0, namespace="", temporary=False, sync_tools=False):
        """ creates a table in the database based on instructions in the dsd. 
            :param dsd_table: The name of the table definition in the dsd
            :param db_table: The name of the table in the database.
            :param version: The version of the dsd table definition to use. if 0 the current version is going to be used.
            :param temporary: create a temp table
            :sync_tools: suppresses all primary and unique definitions in the dsd and adds other features needed
                         only within the synchronization process. Default is false.
            :returns: True if okay, otherwise exceptions will be thrown
        """
        raise NotImplementedError

    def _adapter_get_table_structure_version(self, table, namespace=""):
        """ returns the currently in the database instantiated version of the table.
            returns 0 if the table does not exist at all and -1 if an error occured. 

            : note: expects an existing migration catalog
        """
        raise NotImplementedError

    def _adapter_update_table_structure_version(self, db_table, dsd_table, version, namespace=""):
        """ Sets an updated version for a table in the migration catalog. Works only if the table is already registered 
            in the migration catalog!
            :param db_table: name of the table in the database
            :param dsd_table: name of the underlying table definition
            :param version: currently manifest version of the table structure
            :returns: bool
        """
        raise NotImplementedError

    def _adapter_insert_table_structure_version(self, db_table, dsd_table, version, namespace=""):
        """ Sets a (new) version for a table in the migration catalog. 
            Won't work if the table is already registered in the migration catalog!
            :param db_table: name of the table in the database
            :param dsd_table: name of the underlying table definition
            :param version: currently manifest version of the table structure
            :returns: bool
        """
        raise NotImplementedError

    def _adapter_get_tables_and_versions(self, only_prefix, namespace):
        """ returns the instantiated tables, their dsd names and version.
            Expects a migration catalog to exist.
            Abstract, needs to be implemented by adapter class.

        :param only_prefix: only tables with a given prefix are returned
        :param namespace: only tables of a a given namespace are returned
        :return dict with the tablename as key and a Tuple (dsd-table, version) as value
        """
        raise NotImplementedError

    def _process_migrate_instruction(self, instruction: str, field_name: str, old_params: [], new_params: []):
        """
            simply forwards the call to a specific migration instruction to the registered class for the instruction. 
            Unlike _process_create_instruction this does not check if the instruction is a registered instruction.
            :param instruction: the instruction being called
            :param field_name: the field for which the instruction has to be executed
            :param old_params: the parameters before migration
            :param new_params: the requested parameters after migration

            :returns: a list of lines that alter the table (in postgres e.G. for an ALTER TABLE statement)

        """
        return self._field_instruction_set[instruction].execute_during_migration(field_name, old_params, new_params)

    def _process_drop_instruction(self, instruction: str, field_name: str, old_params):
        """
            simply forwards the call to a specific migration instruction to the registered class for the instruction. 
            Unlike _process_create_instruction this does not check if the instruction is a registered instruction.
            :param instruction: the instruction being called
            :param field_name: the field for which the instruction has to be executed
            :param old_params: the parameters before migration

            :returns: a list of lines that alter the table (in postgres e.G. for an ALTER TABLE statement)

        """
        return self._field_instruction_set[instruction].execute_drop(field_name, old_params)

    def _process_create_instruction(self, instruction: str, field_name: str, instructions: {}, required: bool = False):
        """
            Forwards the call to a specific migration instruction to the registered class for that instruction. 
            Checks if the instruction is a known instruction and if it is in the requested instructions at all. 
            The latter is important because the method is called for all available instructions in the instruction set 
            no matter if they have been requested for a field or not (that way we establish a specific order)

            :param instruction: the instruction being called
            :param field_name: the field for which the instruction has to be executed
            :param instructions: All instructions requested for the field
            :param required: If an instruction is requested but not in the field instructions set provided by
                             the db adapter, an exception is fired IF and only if required is explicitly set to True.
            :returns: a list of text parts that create the field attribute
                      (in postgres e.G. for a CREATE TABLE statement)
        """
        if instruction in instructions:
            if instruction in self._field_instruction_set:
                return self._field_instruction_set[instruction].execute_during_creation(field_name,
                                                                                        instructions[instruction])
            else:
                raise InstructionRequiredError(f"PostgresDbMigraton._process_create_instruction: "
                                               f"{instruction} not supported by migration adapter")
        else:
            if required:
                raise InstructionRequiredError(f"PostgresDbMigraton._process_create_instruction: "
                                               f"{instruction} missing in dsd field definition")
            else:
                return ""

    def drop_table(self, db_table, namespace=""):
        if self._adapter_drop_table(db_table, namespace=namespace):
            return self._adapter_delete_from_migration_catalog(db_table, namespace=namespace)
        else:
            return False

    def _adapter_drop_table(self, db_table, namespace=""):
        """
        drops a table from the database. Does not eliminate the corresponding table in the migration_catalog!
        : returns: bool
        """
        raise NotImplementedError

    def delete_from_migration_catalog(self, db_table, namespace=""):
        """
        deletes a record from the migration_catalog!
        :returns: bool
        """
        return self._adapter_delete_from_migration_catalog(db_table, namespace)

    def _adapter_delete_namespace(self, prefix, namespace):
        """
        deletes a namespace with all tables from the database and from the migration catalog.
        Both prefix and namespace are necessary to remove records from the migration tables
        :param prefix: the prefix
        :param namespace: the namespace
        :returns: bool
        """
        raise NotImplementedError

    def _adapter_delete_from_migration_catalog(self, db_table, namespace=""):
        """
        deletes a record from the migration_catalog!
        :returns: bool
        """
        raise NotImplementedError

    def _append_field_attribute(self, attributes, append_to: []):
        """appends an attribute to the current list of field attributes only if it isn't already in there."""

        if not attributes:
            return

        if not isinstance(attributes, list):
            attributes = [attributes]

        for attr in attributes:
            if attr not in append_to:
                append_to.append(attr)

    def get_sql_lines(self, root_path, sql_instruction, prefix="", namespace=""):
        """
        returns either sql statements from a file given by sql_instructions or the sql_instruction itself.
        All sql statements can have {{ table }} notation. Tables in double curly brackets will be replaced by
        properly sanitized and - if namespace is given - schematized.
        :param root_path: A folder in which files are expected.
        :param sql_instruction: either the instruction itself or a filename ending on ".sql".
        :param prefix: if given all tables are expected to have this prefix
                       if they are written in double curly brackets
        :param namespace: if given all tables are expected to be in this namespace
                          if they are written in double curly brackets.
        :return: an sql script or statement. Raises Exception in case of errors.
        """
        return self._adapter_get_sql_lines(root_path, sql_instruction, prefix=prefix, namespace=namespace)

    def _adapter_get_sql_lines(self, root_path, sql_instruction, prefix="", namespace=""):
        """
            abstract adapter implementation of get_sql_lines
        """
        raise NotImplementedError

    def delete_namespace(self, prefix, namespace):
        """
        deletes a namespace with all tables from the database and from the migration catalog.
        Both prefix and namespace are necessary to remove records from the migration tables
        :param prefix: the prefix
        :param namespace: the namespace
        :returns: bool
        """
        return self._adapter_delete_namespace(prefix=prefix, namespace=namespace)

    def migrate_table(self, dsd_table, version=0, prefix="", namespace="", one_step_only=False):
        """ migrates a single table from its current version (if it exists at all) to the given version. 
            :param dsd_table: The name of the table definition in the dsd
            :param prefix: the table name in the database is built by prefix + dsd_table
            :param version: The version of the dsd table definition to use. if 0 the current version
                            is going to be used.
            :param namespace: if the table is organized in a namespace.
            :param one_step_only: if the table is off several versions, it will be lifted only by one.
                                  This is important so that tables of the same generation are lifted
                                  synchronously.
            :returns: A tuple with the version successfully reached and the highest version in the dsd.
                      In case of errors exceptions will be thrown

        """

        def _get_most_recent_former_table_version():
            """
            finds the most recent dsd table structure of the table to be migrated in the database.
            :return: the version and former dsd name of the version of the dsd structure that is manifest in the database
                     In other words if the result is 1, "old_name" then there is a table "old_name" in the database that
                     has the structure of version 1 of the dsd-table which is now called dsd_table.
            """
            former_tables = self.dsd.get_former_table_names(dsd_table=dsd_table, version=version)
            # Because former tables is ordered according to the version, the for starts with the highest version found
            for former_table in former_tables:
                former_dsd_table = former_table[0]
                prefixed_db_table = prefix + former_dsd_table
                current_db_table_version = self.get_table_structure_version(prefixed_db_table, namespace=namespace)
                if current_db_table_version:
                    return current_db_table_version, former_dsd_table

            return 0, ""

        # *************************************************
        # method body
        # *************************************************
        most_recent_version = self.dsd.get_current_version(dsd_table)
        if not version:
            version = most_recent_version

        prefixed_db_table = prefix + dsd_table

        current_db_table_version = self.get_table_structure_version(prefixed_db_table, namespace=namespace)
        if current_db_table_version == -1:
            raise Exception(f"DatabaseMigration.migrate_table: "
                            f"Get_table_structure_version reported an error. Table is \"{prefixed_db_table}\".")
        if not current_db_table_version:
            # one reason why no table version can be found is that the table has been renamed
            # so let's get name and instantiated dsd structure version of the table in the db
            current_db_table_version, old_dsd_table = _get_most_recent_former_table_version()
            if current_db_table_version:
                # we have a renamed table here. So first of all the dsd name needs to be fixed in the migration catalog
                self._adapter_fix_migration_catalog(old_dsd_table=old_dsd_table, new_dsd_table=dsd_table)
                prefixed_db_table = prefix + old_dsd_table

        if not current_db_table_version:
            # still no table version, so there is really no table
            # but it could have been deleted, so let's check that first
            if self.dsd.is_table_dropped(dsd_table, version):
                return tuple((version, most_recent_version))
            else:
                if one_step_only:
                    version = 1
                rc = self.create_table(dsd_table=dsd_table, version=version,
                                       db_table=prefixed_db_table, namespace=namespace)
                return tuple((version, most_recent_version))

        # check if there is anything to do at all
        if current_db_table_version == most_recent_version:
            return tuple((current_db_table_version, most_recent_version))

        # migration is necessary.
        if current_db_table_version < version:
            if one_step_only:
                version = current_db_table_version + 1
            r = range(current_db_table_version + 1, version + 1)
        else:
            if one_step_only:
                version = current_db_table_version - 1
            r = range(current_db_table_version, version, -1)

        rc = tuple()
        for ver in r:
            if current_db_table_version < version:
                from_version = ver - 1
                to_version = ver
            else:
                from_version = ver
                to_version = ver - 1

            table_migration: _TableMigration = \
                self._adapter_get_table_migration_class()(migration=self,
                                                          dsd_table=dsd_table,
                                                          from_version=from_version,
                                                          to_version=to_version,
                                                          prefix=prefix,
                                                          namespace=namespace)
            if not table_migration.execute():
                raise Exception(f"DatabaseMigration.migrate_table: "
                                f"_adapter_get_table_migration_class failed. Table is \"{prefixed_db_table}\".")
            else:
                rc = (to_version, most_recent_version)

        return rc

    def reverse_engineer_table(self, dsd, dsd_table: str, namespace="", prefix="", current_version_only=True) -> bool:
        """
        checks if the table already exist in the database and adds it to the migration_catalog if
        it has the most recent structure defined in the dsd.
        :param dsd: can be a different dsd (from a view) than the Migration class's dsd.
        :param dsd_table: the name of the table to analyse and add to the migration catalog
        :param namespace: should the table be in a namespace
        :param prefix: should the table name need a prefix
        :param current_version_only: If set to false the method will try to reverse-engineer
                any of the versions in the dsd
        :return: False means that the table was indeed in need of being reverse engineered
                 but that failed, e.g. because the table's did not comply with the dsd.
                 Returns true if the table did not need to be reverse engineered
                 (because it did neither exists as a table nor in migration catalog or
                  because it is already registered in the migration catalog. Note that it does not matter
                  if the version in the catalog matches the version of the table. If it exists in the
                  catalog, it counts as successful.)
                 Also returns true if the reverse engineering was successful.
        """

        prefixed_db_table = prefix + dsd_table
        if self._adapter_exists_in_catalog(prefixed_db_table, namespace):
            logging.info(f"{prefixed_db_table} exists in catalog")
            return True
        if not self._adapter_table_exists(prefixed_db_table, namespace):
            logging.info(f"table {prefixed_db_table} does not exist")
            return True

        if current_version_only:
            versions = [dsd.get_current_version(dsd_table)]
            logging.debug(f"{self.__class__.__name__}.reverse_engineer_table: "
                          f"Table {prefixed_db_table}: checking only current version {versions[0]}.")
        else:
            versions: list = dsd.list_table_versions(dsd_table)
            versions.sort(reverse=True, key=lambda x: int(x))
            logging.debug(f"{self.__class__.__name__}.reverse_engineer_table: "
                          f"Table {prefixed_db_table} comes as versions {versions}.")
        match = False
        for version in versions:
            dsd_fields = dsd.list_fields(dsd_table, version)
            table_fields = self._adapter_get_database_table_field_names(prefixed_db_table, namespace=namespace)
            match = True
            for field in dsd_fields:
                if field not in table_fields:
                    logging.debug(f"{self.__class__.__name__}.reverse_engineer_table: "
                                  f"dsd field {field} not in version {version} of table {prefixed_db_table}")
                    match = False
                    break
            if match:
                break

        if match:
            # table exists and complies with the required structure
            logging.info(f"{self.__class__.__name__}.reverse_engineer_table: "
                         f"Table {prefixed_db_table} matches version {version} in dsd.")
            return self._adapter_insert_table_structure_version(prefixed_db_table, dsd_table, version, namespace)
        else:
            logging.error(f"{self.__class__.__name__}.reverse_engineer_table: "
                          f"dsd field {field} not in table {prefixed_db_table}")

        return False

    def get_migration_flag(self, flag_name) -> str:
        """
        returns the value of a migration flag from the database.
        :param flag_name: the name of the flag
        :return: the value or None if the flag does not exist.
        """
        raise NotImplementedError

    def set_migration_flag(self, flag_name: str, value: str) -> bool:
        """
        sets a migration flag to the given value in the database.
        :param flag_name: the name of the flag
        :param value: the value
        :return: True or False. Should not throw exceptions.
        """
        raise NotImplementedError
