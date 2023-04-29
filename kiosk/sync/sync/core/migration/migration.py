from dsd.dsd3 import DataSetDefinition
from dsd.dsdview import DSDView
from migration.databasemigration import DatabaseMigration
from sync_config import SyncConfig
import logging


class Migration:

    def __init__(self, dsd: DataSetDefinition, db_adapter: DatabaseMigration, project_id: str = ""):
        self._dsd: DataSetDefinition = dsd
        self._db_adapter: DatabaseMigration = db_adapter
        self._self_check = False
        self._project_id = project_id
        # noinspection PyTypeChecker
        self.reverse_engineering_view: DSDView = None
        # noinspection PyTypeChecker
        self.re_workstation_view: DSDView = None
        self._ctm_status = {}
        if not self._project_id:
            self._project_id = SyncConfig.get_config().get_project_id()

    def delete_namespace(self, prefix, namespace):
        """ removes tables of the namespace and the namespace from the database
            and clears up migration records
        """
        if not self._self_check:
            self.self_check()
        self._db_adapter.delete_namespace(prefix, namespace)


    def migrate_dataset(self, prefix="", namespace=""):
        """
        Migrates the current database to the recent structure defined by the dsd.
        Skips tables flagged as "system_table.

        :param prefix: table names are built by prefix + dsd_tablename
        :param namespace: tables are kept in a certain namespace
        :returns: True/False. Can throw Exception if an endless loop has to be aborted.
        """
        iteration = 1
        if not self.check_cross_table_migration_flags(prefix=prefix, namespace=namespace):
            logging.error(f"{self.__class__.__name__}.migrate_datatable: Cross table migration failed.")
            return False
        else:
            logging.info(
                f"{self.__class__.__name__}.migrate_datatable: Cross table migration has been prepared successfully")

        while True:
            continue_migration = False
            for table_name in self._dsd.list_tables(include_dropped_tables=True):
                try:
                    rc = self.migrate_datatable(dsd_table=table_name,
                                                prefix=prefix,
                                                namespace=namespace,
                                                one_step_only=True
                                                )
                    if not rc:
                        return False
                    else:
                        logging.debug(f"{self.__class__.__name__}.migrate_dataset: "
                                      f"{namespace}.{prefix}{table_name} at version {rc[0]} of {rc[1]}.")
                        if rc[0] < rc[1]:
                            continue_migration = True
                    # self.run_cross_table_migration(prefix=prefix, namespace=namespace)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.migrate_dataset: Error migrating table '{table_name}':"
                                  f" {repr(e)}")
                    raise e

            if continue_migration:
                iteration = iteration + 1
                if iteration > 100:
                    logging.debug(f"{self.__class__.__name__}.migrate_dataset: "
                                  f"Migration seems to be stuck in an endless loop. Aborted.")
                    raise Exception(f"{self.__class__.__name__}.migrate_dataset: "
                                    f"Migration seems to be stuck in an endless loop. Aborted.")
            else:
                break

        return self.check_cross_table_migration_flags(namespace=namespace, prefix=prefix)

    def self_check(self):
        """
        Makes sure that the requirements for the migration system itself are properly prepared.
        Does not migrate!
        :returns: self._self_check, which is True if the method succeeds. Otherwise it throws an Exception anyway.
                  So don't check for false!
        """
        try:
            self._self_check = False
            if self._db_adapter.get_table_structure_version(self._db_adapter.migration_catalog_name) > 0 \
                    and self._db_adapter.get_table_structure_version(self._db_adapter.migration_flags_name) > 0:
                self._self_check = True
            else:
                raise Exception(f"table structure version of either {self._db_adapter.migration_catalog_name}"
                                f"ir {self._db_adapter.migration_flags_name} is 0")

        except BaseException as e:
            raise Exception(f"{self.__class__.__name__}.migrate_datatable: "
                            f"An error occurred during self check: {repr(e)}")
        return self._self_check

    def migrate_datatable(self, dsd_table: str, version=0, prefix="", namespace="", one_step_only=False):
        """
        Migrates a certain table in the current database to the newest (or given version) of the dsd.
        Does not check any table flags!

        :param dsd_table: the name of the table definition
        :param version: if 0 the most recent version in the dsd is taken, otherwise the given version
        :param prefix: table names are built by prefix + dsd_tablename
        :param one_step_only: if the table is off several versions, it will be lifted only by one.
                              This is important so that tables of the same generation are lifted
                              synchronously.
        :param namespace: tables are kept in a certain namespace
        :returns: True/False. Can throw all kinds of Exception in case of errors.
        """
        if not self._self_check:
            self.self_check()
        self.save_cross_table_migration_status(prefix=prefix, namespace=namespace)
        rc = self._db_adapter.migrate_table(dsd_table=dsd_table,
                                            version=version,
                                            prefix=prefix,
                                            namespace=namespace,
                                            one_step_only=one_step_only)
        if self.run_cross_table_migration(prefix=prefix, namespace=namespace):
            if self.check_cross_table_migration_flags(namespace=namespace, prefix=prefix,
                                                      exclude_on_options=["after_table_migration"]):
                return rc

        return tuple()

    def reverse_engineer_dataset(self, namespace="", prefix="", current_version_only=True) -> bool:
        """
        checks which dsd tables already exist in the database and adds them to the migration_catalog if
        they have the structure of the current dsd table.
        # :param include_workstation_tables: if set the tables of all registered workstations are reverse engineered,
                                                too.
        :param namespace: if a schema is used, state it.
        :param prefix: if the tables of the dataset need a prefix, this is the one.
        :param current_version_only: if set to False a table is checked against all the versions in the dsd, not only the
                                        current version.
        :return True or False
        """
        dsd = self._dsd if not self.reverse_engineering_view else self.reverse_engineering_view.dsd
        for table_name in dsd.list_tables():
            if not self.reverse_engineer_datatable(dsd, table_name=table_name, namespace=namespace, prefix=prefix,
                                                   current_version_only=current_version_only):
                logging.error(f"{self.__class__.__name__}.reverse_engineer_dataset: failed at table {table_name}.")
                return False

        return True

    def reverse_engineer_datatable(self, dsd: DataSetDefinition, table_name: str, namespace="", prefix="",
                                   current_version_only=True) -> bool:
        """
        checks if the table already exist in the database and adds them to the migration_catalog if
        it has the most recent structure defined in the dsd.

        :return True or False
        """

        if not self._self_check:
            self.self_check()

        return self._db_adapter.reverse_engineer_table(dsd, dsd_table=table_name, namespace=namespace, prefix=prefix,
                                                       current_version_only=current_version_only)

    def set_reverse_engineering_view(self, master_view):
        self.reverse_engineering_view = master_view

    def save_cross_table_migration_status(self, prefix="", namespace="", check_precondition_tables=True):
        """
        saves name and version of all tables referred to by at least one precondition
        in the private attribute _ctm_status. Must be called somewhere before run_cross_table_migration
        since it is the preparation for that method. This is only useful paired with run_cross_table_migration.

        :param check_precondition_tables: only for testing purposes. If false preconditions can apply to
                                          tables that are not defined in the dsd.
        :param prefix: if the actual table needs a prefix before the dsd-table name
        :param namespace: if the actual table is in a namespace
        """
        ctms = self._dsd.get_migration_scripts(self._project_id,
                                               check_precondition_tables=check_precondition_tables)
        self._ctm_status = {}
        for ctm in ctms.values():
            if "preconditions" in ctm:
                for table in ctm["preconditions"].keys():
                    self._ctm_status[table] = self._db_adapter.get_table_structure_version(prefix + table,
                                                                                           namespace=namespace)

    def run_cross_table_migration(self, prefix="", namespace="", check_precondition_tables=True):
        """
        Checks all the cross-table migration entries in the dsd after a table has been migrated.
        Checks whether a precondition set is now fully met and if that is due to a change in table versions
        since the last call to save_cross_table_migration_status. These two methods come as a pair!
        This Will not run cross table migrations that use flags!

        19.IX.2022: If there is a namespace the script will not run unless the option "run_on_forked_datasets" is set


        :param prefix: if the actual table needs a prefix before the dsd-table name
        :param namespace: if the actual table is in a namespace. Also used to substitute tables in double curly brackets
                          with a properly sanitized and schematized table identifier, if such a thing can be found in
                          the sql migration lines.
        :param check_precondition_tables: only for testing purposes. If false preconditions can apply to
                                          tables that are not defined in the dsd.
        :returns: True/False
        """
        ctms = self._dsd.get_migration_scripts(self._project_id, check_precondition_tables=check_precondition_tables)

        try:
            for ctm_name in ctms.keys():
                ctm = ctms[ctm_name]
                if "flags" not in ctm:
                    if self._ctm_preconditions_met(ctm_name, ctm, prefix, namespace):
                        logging.debug(f"{self.__class__.__name__}.run_cross_table_migration: preconditions for "
                                      f"{ctm_name} met.")

                        execute_script = True
                        if namespace:
                            if "options" in ctm and "run_on_forked_datasets" in ctm["options"]:
                                logging.debug(f"{self.__class__.__name__}.run_cross_table_migration: "
                                              f"{ctm_name} executes on forked data "
                                              f"due to option 'run_on_forked_datasets'")
                            else:
                                execute_script = False

                        if execute_script:
                            if not self._run_cross_table_migration(ctms[ctm_name]["migration"],
                                                                   prefix=prefix, namespace=namespace):
                                logging.error(
                                    f"{self.__class__.__name__}.run_cross_table_migration: cross-table-migration "
                                    f"{ctm_name} failed.")
                                return False
                            else:
                                logging.debug(
                                    f"{self.__class__.__name__}.run_cross_table_migration: cross-table-migration "
                                    f"{ctm_name} succeeded.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.run_cross_table_migration: Exception {repr(e)}")
            return False

        return True

    def _ctm_preconditions_met(self, ctm_name, ctm, prefix="", namespace="", ignore_change=False):
        """
        checks if the preconditions of a single set of preconditions are met. If ignore_change is not set
        it will be checked if the preconditions are met due to a change in table version since the last call to
        save_cross_table_migration_status.
        Only used within run_cross_table_migration and check_cross_table_migration_flags.

        :param ctm_name: the name of the cross-table migration definition in the dsd under config/migration_scripts
        :param ctm: the contents of the cross-table migration definition
        :param prefix: if the actual table needs a prefix before the dsd-table name
        :param namespace: if the actual table is in a namespace. Also used to substitute tables in double curly brackets
                          with a properly sanitized and schematized table identifier, if such a thing can be found in
                          the sql migration lines.
        :param ignore_change: optional. If set the method will NOT check if a met precondition has changed.
        :returns: True/False, can raise Exception if a dropped table is part of a precondition
        """
        changed = False
        ready = True

        if "preconditions" not in ctm:
            return ignore_change

        for table in ctm["preconditions"].keys():
            expected = int(ctm["preconditions"][table])
            current = int(self._db_adapter.get_table_structure_version(prefix + table, namespace=namespace))
            if current == 0:
                if self._dsd.is_table_dropped(table):
                    raise Exception(f"{self.__class__.__name__}._ctm_preconditions_met:"
                                    f"Table {table} is dropped. Precondition {ctm_name} is invalid. Please review "
                                    f"this precondition in the dataset definition.")

            if ignore_change:
                if current < expected:
                    ready = False
                    break
            else:
                if current == expected:
                    if self._ctm_status[table] < current:
                        changed = True
                else:
                    ready = False
                    break
        if ready:
            if ignore_change or changed:
                # all preconditions are met AND at least one of the preconditions was not when
                # save_cross_table_migration_status was last called.
                return True

        return False

    def _run_cross_table_migration(self, sql_instruction, prefix="", namespace=""):
        """
        Runs the sql migration after preconditions have been met.
        :param sql_instruction: either the instruction itself or a filename ending on ".sql".
        :param namespace: if given all tables are expected to be in this namespace
                          if they are written in double curly brackets.
        :return: True or False. Does not throw but logs Exceptions.
        """
        try:
            sql_lines = self._db_adapter.get_sql_lines(self._dsd.dsd_root_path, sql_instruction,
                                                       prefix=prefix, namespace=namespace)
            self._db_adapter.execute_sql(sql_lines)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._run_cross_table_migration: {repr(e)}")
            return False

    def check_cross_table_migration_flags(self, prefix="", namespace="", exclude_on_options=None):
        """
        Checks all the cross-table migration scripts that use flags.
        If one of them has its preconditions met but not the flag it is executed.

        19.IX.2022: If there is a namespace the script will be skipped unless the option "run_on_forked_datasets" is set

        :param prefix: if the actual table needs a prefix before the dsd-table name
        :param namespace: if the actual table is in a namespace. Also used to substitute tables in double curly brackets
                          with a properly sanitized and schematized table identifier, if such a thing can be found in
                          the sql migration lines.
        :param exclude_on_options: list of options. If any of these options is listed in the "options" key of the
                                   cross-table-migration entry in the dsd, the migration is postponed.
        :returns: True/False
        """
        if exclude_on_options is None:
            exclude_on_options = []

        if not self._self_check:
            assert self.self_check()

        ctms = self._dsd.get_migration_scripts(self._project_id)

        ctm_name = "?"
        try:
            for ctm_name in ctms.keys():
                ctm = ctms[ctm_name]
                if "flags" in ctm:
                    if self._ctm_preconditions_met(ctm_name, ctm, prefix=prefix, namespace=namespace,
                                                   ignore_change=True):
                        if not self._ctm_all_flags_set(ctm, prefix + namespace):
                            if "options" in ctm and exclude_on_options:
                                if set(exclude_on_options).intersection(set(ctm["options"])):
                                    logging.debug(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                                                  f"{ctm_name} skipped due to set options")
                                    continue

                            if namespace:
                                if "options" in ctm and "run_on_forked_datasets" in ctm["options"]:
                                    logging.debug(f"{self.__class__.__name__}.run_cross_table_migration: "
                                                  f"{ctm_name} executes on forked data "
                                                  f"due to option 'run_on_forked_datasets'")
                                else:
                                    continue
                            else:
                                logging.debug(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                                              f"preconditions for {ctm_name} met and at least one flag is not up.")

                            if not self._run_cross_table_migration(ctms[ctm_name]["migration"],
                                                                   prefix=prefix, namespace=namespace):
                                logging.error(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                                              f"cross-table migration "
                                              f"{ctm_name} failed.")
                                return False
                            else:
                                logging.info(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                                             f"cross-table migration "
                                             f"{ctm_name} succeeded.")
                                if not self._ctm_set_up_all_flags(ctm, prefix + namespace):
                                    logging.error(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                                                  f"_ctm_set_up_all_flags failed.")
                                    return False
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.check_cross_table_migration_flags: "
                          f"Exception when processing {ctm_name}: {repr(e)}")
            return False

        return True

    def _ctm_all_flags_set(self, ctm, dataset_id=""):
        """
        checks if all the migration flags of a cross table migration are set up.
        :param ctm: the definition of the cross table migration
        :param dataset_id: Some id that distinguishes the current dataset from the master dataset
                           and all other datasets.
                           used for forked datasets (workstation tables). Leave empty for the master dataset.
        :return: True if all are up (or none are expected), False if at least one is not up.
        """
        if dataset_id:
            dataset_id += "_"

        if ctm["flags"]:
            for flag in ctm["flags"].keys():
                current_flag = self._db_adapter.get_migration_flag(dataset_id + flag)
                if str(current_flag) != str(ctm["flags"][flag]):
                    return False
        return True

    def _ctm_set_up_all_flags(self, ctm, dataset_id=""):
        """
        sets up all migration flags of a cross table migration.
        :param ctm: the definition of the cross table migration
        :param dataset_id: Some id that distinguishes the current dataset from the master dataset
                           and all other datasets.
                           used for forked datasets (workstation tables). Leave empty for the master dataset.
        :return: True if succeeded
        """
        try:
            if ctm["flags"]:
                if dataset_id:
                    dataset_id += "_"
                for flag in ctm["flags"].keys():
                    if not self._db_adapter.set_migration_flag(dataset_id + flag, ctm["flags"][flag]):
                        return False
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._ctm_set_up_all_flags: {repr(e)}")
            return False

        return True
