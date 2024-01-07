import datetime
import logging
import typing
from os import path
from pprint import pprint, pformat
from typing import List

import kioskrepllib
from eventmanager import EventManager
from typerepository import TypeRepository

import filerepository
from recordingworkstation import RecordingWorkstation
import kioskstdlib
import workstation
from core.kiosklogicalfile import KioskLogicalFile
from core.sync_constants import UserCancelledError
from core.synchronizationpluginmanager import SynchronizationPluginManager
from core.syncrepositorytypes import TYPE_WORKSTATION
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdconstants import KEY_TABLE_FLAG_SYSTEM_TABLE, KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION
from dsd.dsdview import DSDView
from fileidentifiercache import FileIdentifierCache
from kioskabstractclasses import PluginLoader
from migration.postgresdbmigration import PostgresDbMigration
from sync_config import SyncConfig
from tools.UrapDatabaseIntegrity import UrapDatabaseIntegrity
from kiosksqldb import KioskSQLDb
from kioskstdlib import report_progress
from filerewirerer import FileRewirerer
from databasedrivers import DatabaseDriver

sync_version = '0.9'


#  Workstation = workstation.Workstation


class Synchronization(PluginLoader):

    def __init__(self, options=None):
        # TODO: What's that? USE_TEMP_TABLE?
        self.USE_TEMP_TABLE = False

        self.type_repository = TypeRepository()
        cfg: SyncConfig = SyncConfig.get_config()
        self.plugin_dir = cfg.sync_plugin_directory
        self.autoload_plugins = cfg.autoload_plugins
        self.plugins = SynchronizationPluginManager()
        self.events = EventManager()
        self.debug_mode = ""
        self._files_to_synchronize = []
        self._duplicate_files = 0  # just for testing
        self._rewired_files = 0
        self._table_rewire_files = ""
        self._ignored_files = 0  # this is just for testing purposes.
        if self.autoload_plugins is not None:
            self.load_plugins(self.autoload_plugins)
        if options:
            self.options = options
        else:
            self.options = {}

    @property
    def duplicate_files(self):
        return self._duplicate_files

    @property
    def ignored_files(self):
        return self._ignored_files

    def load_plugins(self, plugins_to_load: List[str]) -> bool:
        """
        load all the plugins in the list.
        :param plugins_to_load: plugins_to_load
        :return: boolean
        :except: can throw all kinds of exceptions
        """
        plugin_manager: SynchronizationPluginManager = self.plugins
        cfg: SyncConfig = SyncConfig.get_config()
        plugin_dir = self.plugin_dir

        project_id = cfg.get_project_id()
        abs_plugins = [plugin for plugin in plugins_to_load if "\\" in plugin or "/" in plugin]
        sync_plugins_to_load = [plugin for plugin in plugins_to_load if plugin not in abs_plugins]
        if project_id:
            plugins_loaded = plugin_manager.load_plugins(plugin_dir, sync_plugins_to_load,
                                                         init_plugin_configuration={"project_id": project_id})
        else:
            plugins_loaded = plugin_manager.load_plugins(plugin_dir, sync_plugins_to_load)

        if abs_plugins:
            for plugin in abs_plugins:
                plugin = cfg.resolve_symbols(plugin)
                plugin_dir = kioskstdlib.get_file_path(plugin)
                plugin = kioskstdlib.get_filename(plugin)
                if project_id:
                    plugins_loaded.extend(plugin_manager.load_plugins(plugin_dir, [plugin],
                                                                      init_plugin_configuration={
                                                                          "project_id": project_id}))
                else:
                    plugins_loaded.extend(plugin_manager.load_plugins(plugin_dir, [plugin]))

        if plugins_loaded:
            rc = plugin_manager.init_app(self, plugins_loaded)

            rc = plugin_manager.plugins_ready(plugins_loaded)
            if rc:
                # for plugin in plugins_loaded:
                #     logging.debug(f"plugin {plugin.name} successfully loaded and initialized.")
                return True
            else:
                logging.error(f"{self.__class__.__name__}.load_plugins: no plugins were triggered by "
                              f"plugin_manager.plugins_ready")
        else:
            logging.error(f"{self.__class__.__name__}.load_plugins: No plugins configured to load "
                          f"from {plugin_dir}")

    @staticmethod
    def empty_master_tables(ask=True, special_tables=False):
        """
                console only: truncates all tables in the UrapSqlDb found in the dsd.

                TODO: redesign and refactor
                TODO: document
        """
        if not ask or input(
                "Are you sure you want to delete all data in the master tables? (type yup for yes)") == "yup":
            try:
                KioskSQLDb.rollback()
            finally:
                pass
            dsd = Dsd3Singleton.get_dsd3()
            for table in dsd.list_tables():
                logging.info("Truncating table " + table)
                if not special_tables and table in ["excavator",
                                                    "locus_types",
                                                    "site",
                                                    "tickets",
                                                    "identification_methods",
                                                    "identifier_lists",
                                                    "qc_flags",
                                                    "qc_rules",
                                                    "repl_dock_reporting",
                                                    "repl_file_picking_rules",
                                                    "collected_material_types",
                                                    "migration_catalog",
                                                    "migration_flags",
                                                    "constants",
                                                    "kiosk_file_cache",
                                                    "kiosk_privilege",
                                                    "kiosk_user",
                                                    "kiosk_workstation",
                                                    "repl_image_resolution",
                                                    "repl_workstation",
                                                    "repl_workstation_file_export",
                                                    "repl_workstation_filemaker"]:
                    logging.info(f"Skipped {table}")
                else:
                    KioskSQLDb.truncate_table(table)
            KioskSQLDb.commit()

    def create_workstation(self, workstation_type_name: str, workstation_id: str, *args, **kwargs):
        """
            Factory method for Workstation objects: Creates and returns a workstation of the given type.

            The type must be registered in the _type_repository as "Workstation"
            If the workstation already exists in the master database, it returns the existing workstation.
            The *args and **kwargs are given to the constructor of the concrete Workstation class.

        ..example:
            # creating a new FileMakerWorkstation with standard file_handling settings:
            ws = create_workstation("FileMakerWorkstation", "default", description="Some iPad")
            ws.save()


        """

        # logging.debug(f"create_workstation: args:{pformat(args)}, \n kwargs:{pformat(kwargs)}")
        if not workstation_type_name:
            logging.error("Synchronization.create_workstation: No name of workstation type given")
            return None

        workstation_type = self.type_repository.get_type(TYPE_WORKSTATION, workstation_type_name)
        if not workstation_type:
            logging.error(
                "Synchronization.create_workstation: The workstation type {} is unknown.".format(workstation_type_name))
            return None

        ws: workstation.Workstation = workstation_type(workstation_id, sync=self, *args, **kwargs)
        return ws

    def get_workstation(self, workstation_type_name: str, workstation_id: str) -> workstation.Workstation:
        """
            returns a workstation if the workstation already exists.
             returns None otherwise
        """
        ws = self.create_workstation(workstation_type_name, workstation_id)
        if ws.exists():
            return ws
        else:
            return None

    def list_workstations(self) -> [workstation.Workstation]:
        """
            :return: list of workstation objects
        """
        workstation_types = [self.type_repository.get_type(TYPE_WORKSTATION, x) for x in
                             self.type_repository.list_types(TYPE_WORKSTATION)]

        result_list = []
        for workstation_type in workstation_types:
            result_list.extend([workstation_type(x) for x in workstation_type.list_workstations()])

        return result_list

    def list_workstation_ids_and_types(self) -> [(str, str)]:
        """
            :return: tuple (str, str): (workstation-id, workstation type name)
        """
        workstation_types = [(self.type_repository.get_type(TYPE_WORKSTATION, x), x) for x in
                             self.type_repository.list_types(TYPE_WORKSTATION)]

        result_list = []
        for workstation_type in workstation_types:
            result_list.extend([(x, workstation_type[1]) for x in workstation_type[0].list_workstations()])

        return result_list

    @staticmethod
    def delete_workstation(ws, console=True):
        """

        :param ws: a Workstation object
        :param console: set to False if this is used outside of a console app
        :return:  True/False

        .. note: presumably rolls back all data that is not committed in one of the data sources
        """
        try:
            if ws:
                if (not console) or input(
                        "Are you sure you want to delete the workstation " + ws.get_id() +
                        " with all its data? (type yup for yes)") == "yup":

                    if ws.delete(commit=True):
                        if console:
                            print("workstation deleted. Please restart console")
                        return True
        except Exception as e:
            logging.error("Exception in delete_workstation" + repr(e))

        return False

    def all_workstations_back(self):
        """
                Checks if all workstations that partake in synchronization are
                in a state that allows for the synchronization to run.

                :returns: True/False

        """
        workstations = self.list_workstations()
        w: workstation.Workstation
        for w in workstations:
            if w.partakes_in_synchronization():
                if not w.ready_for_synchronization():
                    return False

        return True

    def workstations_in_need_of_synchronization(self) -> workstation.Workstation:
        """
                returns a list of workstations in need of synchronization.

                :returns: [Workstation]

        """
        workstations = [x for x in self.list_workstations() if x.needs_synchronization()]

        return workstations

    @staticmethod
    def check_data_integrity():
        """
                runs at the very end (after the commit) of the synchronization process
                but is considered to be part of synchronization from the perspective of kiosk, which means
                that its log entries will be shown in the sync log.
                Can be called independently, just instantiates UrapDatabaseIntegrity and executes
                update_default_fields.

                TODO: redesign and refactor
                TODO: document
        """
        logging.info("checking data integrity")
        dbint = UrapDatabaseIntegrity(SyncConfig.get_config())
        dbint.update_default_fields()

    def synchronize(self, callback_progress=None):
        """
                TODO: redesign and refactor. This is way too long.
                TODO: document
        """

        def interruptable_callback_progress(*args, **kwargs):
            if callback_progress and not callback_progress(*args, **kwargs):
                raise UserCancelledError

        try:
            conf = SyncConfig.get_config()
            successful_run = False  # indicates whether synchronization actually ran and succeeded.

            logging.info(f"************* starting synchronization ************* ")
            c = KioskLogicalFile.get_image_count()
            logging.debug(f"Before synchronization: image count is {c}")

            dsd, dsd_workstation_view, master_dsd = self._get_dsds()
            if not dsd:
                logging.error("Synchronization.synchronize: Could not get a dsd.")
                return False

            self._files_to_synchronize = []

            workstations = self.workstations_in_need_of_synchronization()
            if not workstations:
                logging.warning(
                    ("Synchronization._sync_workstations_to_temptables: Nothing to do, for no workstation is "
                     "currently in mode BACK_FROM_FIELD. Only post-synchronization steps will be taken."))
                ok = True
            else:

                cur = KioskSQLDb.get_dict_cursor()
                if cur is None:
                    logging.error("Synchronization.synchronize: KioskSQLDb.get_cursor() failed")
                    return False

                ok = self._sync_workstations_to_temptables(dsd, callback_progress=interruptable_callback_progress)
                if ok:
                    report_progress(interruptable_callback_progress, progress=100,
                                    topic="_sync_workstations_to_temptables")
                    ok = self._sync_new_records(dsd, callback_progress=interruptable_callback_progress)
                    if ok:
                        report_progress(interruptable_callback_progress, progress=100, topic="_sync_new_records")
                        ok = self._sync_modified_records(dsd, callback_progress=interruptable_callback_progress)
                        if ok:
                            report_progress(interruptable_callback_progress, progress=100,
                                            topic="_sync_modified_records")
                            ok = self._sync_deleted_records(dsd, callback_progress=interruptable_callback_progress)

                if ok:
                    report_progress(interruptable_callback_progress, progress=100, topic="_sync_deleted_records")

                    try:
                        self.update_sync_time()
                    except BaseException as e:
                        logging.error(("Synchronization.synchronize: Exception when calling update_sync_time "
                                       "or at data commit: " + repr(e)))
                        ok = False

                if ok:
                    if conf.use_double_commit:
                        logging.warning("Double commit option is deprecated! Please delete it from kios_config!")

                    ok = self.synchronize_files_v2(callback_progress=interruptable_callback_progress, dsd=master_dsd)
                    if ok:
                        ok = self._sync_change_workstation_states()

                if ok:
                    report_progress(interruptable_callback_progress, progress=100, topic="synchronize_files")
                    logging.info(
                        "Synchronization.synchronize: Workstation states set successfully.")
                    try:
                        KioskSQLDb.commit()
                        successful_run = True
                        logging.info(
                            "Synchronization.synchronize: commit successful.")
                    except BaseException as e:
                        logging.error("Synchronization.synchronize: Exception during commit " + repr(e))
                        logging.error("Synchronization.synchronize: Images and data are probably out of sync. "
                                      "Unless you restore a "
                                      "former backup, please run a housekeeping task, soon.")
                        ok = False

                if not ok:
                    try:
                        KioskSQLDb.rollback()
                        logging.info(
                            "Synchronization.synchronize: data rollback ok")
                    except BaseException as e:
                        logging.error(
                            "Synchronization.synchronize: Exception in data rollback: " + repr(e))

                try:
                    cur.close()
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.synchronize: closing cursor {repr(e)}")

            # we end here no matter of synchronization suceeded or failed or wasn't necessary.
            self.check_data_integrity()

            logging.info("rebuilding file-identifier-cache.")
            fic = FileIdentifierCache(master_dsd)
            fic.build_file_identifier_cache_from_contexts(commit=True)

            logging.info("********** synchronization finished **********")
            logging.info("-")
            report_progress(callback_progress, progress=100,
                            topic="")
            if successful_run:
                try:
                    kioskrepllib.log_repl_event("synchronization", "core synchronization COMPLETED",
                                                "", commit=True)
                    self.fire_event("after_synchronization")
                    logging.info("********** synchronization aftermath finished **********")
                    kioskrepllib.log_repl_event("synchronization", "aftermath COMPLETED",
                                                "", commit=True)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.synchronize: Exception in some hooked in code "
                                  f"at after_synchronization. The main synchronization has been committed, though.")
                    logging.error(f"{self.__class__.__name__}.synchronize: {repr(e)}")
                    kioskrepllib.log_repl_event("synchronization", "aftermath FAILED",
                                                "", commit=True)

            return successful_run
        except BaseException as e:
            logging.error("Synchronization.synchronize: Exception " + repr(e))
            try:
                cur.close()
            except BaseException:
                pass

        try:
            KioskSQLDb.rollback()
            logging.info(
                "Synchronization.synchronize: rollback(2) ok")
        except BaseException as e:
            logging.error(
                "Synchronization.synchronize: Exception in rollback (2): " + repr(e))

        logging.info("********** synchronization aborted **********")
        kioskrepllib.log_repl_event("synchronization", "ABORTED", "", commit=True)
        try:
            fic = FileIdentifierCache(dsd_workstation_view.dsd)
            fic.build_file_identifier_cache_from_contexts()
            logging.info("rebuilding file-identifier-cache ok.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.synchronization: exception when rebuilding file-identifier-cache:"
                          f" {repr(e)}")
        return False

    @staticmethod
    def _get_dsds():
        master_dsd = Dsd3Singleton.get_dsd3()
        if master_dsd is None:
            logging.error("Synchronization._get_dsds: KioskSQLDb.get_dsd() failed")
            return None, None, None

        dsd_workstation_view = DSDView(master_dsd)
        dsd_workstation_view.apply_view_instructions({"config":
                                                          {"format_ver": 3},
                                                      "tables": [
                                                          "include_tables_with_instruction('replfield_uuid')",
                                                          "exclude_fields_with_instruction('no_sync')",
                                                      ]})
        dsd = dsd_workstation_view.dsd
        return dsd, dsd_workstation_view, master_dsd

    # def compare_sql_alchemy_and_psycopg2(self, sql_alchemy_session):
    #     ok = True
    #     c_psycopg = KioskSQLDb.get_first_record_from_sql("select count(uid) from images")[0]
    #     logging.debug(f"images.count according to psycopg2: {c_psycopg}")
    #     c_sqlalchemy = KioskLogicalFile.get_image_count()
    #     logging.debug(f"images.count according to sqlalchemy: {c_sqlalchemy}")
    #
    #     if c_sqlalchemy != c_psycopg:
    #         logging.warning(f"{self.__class__.__name__}.synchronize : sqlalchemy and psycopg "
    #                         f"are not sharing a transaction anymore. ")
    #         return False
    #
    #     c_doublecheck = KioskSQLDb.get_first_record_from_sql("select count(uid) from images")[0]
    #     if c_psycopg != c_doublecheck:
    #         logging.warning(f"{self.__class__.__name__}.synchronize : sqlalchemy and psycopg "
    #                         f"are not sharing a transaction anymore (doublecheck error). "
    #                         f"")
    #         ok = False
    #     return ok

    def fire_event(self, event_name):
        if self.events and event_name:
            logging.debug(f"{self.__class__.__name__}.fire_event: Firing synchronization.{event_name}")
            self.events.fire_event("synchronization", event_name)
        else:
            return False

    def _sync_workstations_to_temptables(self, dsd: DataSetDefinition, callback_progress=None):
        """ makes the workstations insert their records into temporary copies of the main tables.
            The records get an additional workstation-id to be distinguishable. Synchronization will
            run only on these temporary tables. The workstation's insert only new records and records
            that have a modification date later than that in the main-table. The result will be that all
            records of all workstations, different from the main table are in the temporary tables.

            TODO: redesign and refactor
        """
        ok = True
        try:
            workstations = self.workstations_in_need_of_synchronization()
            if not workstations:
                logging.warning(
                    ("Synchronization._sync_workstations_to_temptables: Nothing to do, for no workstation is "
                     "currently in mode BACK_FROM_FIELD. Only post-synchronization steps will be taken."))
                ok = True

            logging.info("********** Comparing workstation data with master database **********")
            tables = dsd.list_tables()
            ctable = 0
            for table in tables:
                if self._create_sync_temp_table(table=table, dsd=dsd):
                    # if dsd.create_table(table, "temp", self.USE_TEMP_TABLE,
                    #                     sync_tools=True):  # Attention! The second parameter needs to be True later, to make the results temporary
                    assert KioskSQLDb.does_temp_table_exist("temp_" + table)

                    for ws in workstations:
                        ws: RecordingWorkstation
                        if not ws.sync_data2temp_table(table):
                            logging.error(
                                "Synchronization.sync_data2temp_table: failed for workstation " + ws.get_id() +
                                " and table " + table)
                            ok = False
                            break
                else:
                    ok = False
                if not ok:
                    break
                else:
                    ctable += 1
                    report_progress(callback_progress, progress=ctable * 100 / len(tables),
                                    topic="_sync_workstations_to_temptables")

        except Exception as e:
            logging.error("Synchronization.sync_data2temp_table: Exception " + repr(e))
            ok = False
        return ok

    def _add_files_to_synchronize(self, cur):
        """ adds every record to the list that will be used at the end of synchronization
            to copy files from workstations to the main repository.

        .. Attention

            it is important that the first column in every record has the workstation-id, followed
            by a column with the field-value that will be used to construct a filename and a column
            that serves as a proxy for the original container field. If the proxy field is empty, no
            file is expected.

        TODO: Refactor and redesign
        """
        r = cur.fetchone()
        while r:
            c = 0
            for f in r:
                if c == 0:
                    workstation_id = f
                else:
                    if c % 2 == 1:  # fields on odd positions are the FILE-attributed fields
                        file_field = f
                    else:  # fields on even positions are the PROXY-attributed fields
                        if f:  # if a proxy field is empty, no file is to be expected
                            if file_field:
                                self._files_to_synchronize.append([workstation_id, file_field])
                            else:
                                raise Exception(
                                    ("Synchronization._add_files_to_synchronize: Error in cursor - "
                                     "file_field is empty in " + str(r)))
                        else:
                            logging.info(
                                "Synchronization._add_files_to_synchronize: Image-record with ID " +
                                file_field + " does not have an actual image (according to an empty proxy)")

                        file_field = None

                c = c + 1

            r = cur.fetchone()

    def synchronize_files_v2(self, callback_progress=None, dsd: DataSetDefinition = None):
        """
                TODO: refactor: Can it be shorter?
                TODO: document
        """

        logging.info("********** Synchronizing files **********")
        if not dsd:
            _, _, dsd = self._get_dsds()

        self._duplicate_files = 0  # this is just for testing purposes.
        self._ignored_files = 0  # this is just for testing purposes.
        if not self._files_to_synchronize:
            logging.info("Synchronization.synchronize_files_v2: Synchronization.synchronize_files: "
                         "Nothing to do, for there are no files to synchronize.")
            return True

        workstation_paths = {}
        conf = SyncConfig.get_config()
        try:
            file_repos = filerepository.FileRepository(conf,
                                                       self.events,
                                                       self.type_repository,
                                                       self)
        except Exception as e:
            logging.error("Synchronization.synchronize_files_v2: Exception when instantiating FileRepository: " +
                          repr(e))
            return False

        c_files = len(self._files_to_synchronize)
        c = 0
        c_warnings = 0

        # todo: This is only necessary if we are talking filemaker. Needs to be more abstract.
        for ws in self.list_workstations():
            workstation_paths[ws.get_id()] = ws.get_and_init_files_dir("import")

        self._init_rewiring_files()

        for workstation_id, identifier in self._files_to_synchronize:
            ok = False
            if identifier:
                if workstation_id in workstation_paths:
                    src_path = workstation_paths[workstation_id]
                    filename = kioskstdlib.get_first_matching_file(src_path, identifier)
                    if filename:
                        logging.debug(f"synchronizing file {filename}")
                        src_file = path.join(src_path, filename)
                        try:
                            contextual_file = file_repos.get_contextual_file(identifier)
                            logging.debug(f"contextual file {contextual_file.uid} initiated.")
                            if contextual_file.upload(src_file,
                                                      override=True,
                                                      keep_image_data=True,
                                                      commit=False):
                                c += 1
                                ok = True
                            else:
                                if contextual_file.last_error == "Duplicate":
                                    if self._deal_with_duplicate(src_file, contextual_file):
                                        c_warnings += 1
                                        c += 1
                                        ok = True

                                if not ok:
                                    if kioskstdlib.try_get_dict_entry(self.options, "ignore_file_issues", False):
                                        self._ignored_files += 1
                                        logging.warning(
                                            f"File {src_file} could not be uploaded to file repository because "
                                            f"of an error. I drop it.")
                                        c_warnings += 1
                                        c += 1
                                        ok = True

                            report_progress(callback_progress, progress=c * 100 / c_files,
                                            topic="synchronize_files")

                        except Exception as e:
                            logging.error("Synchronization.synchronize_files_v2: Exception with file " +
                                          str(src_file) + ": " + repr(e))
                    else:
                        logging.warning(
                            "Synchronization.synchronize_files_v2: No file matching " + str(identifier) +
                            " under " + str(src_path))
                        c += 1
                        c_warnings += 1
                        ok = True
                        report_progress(callback_progress, progress=c * 100 / c_files, topic="synchronize_files")
                else:
                    logging.error(
                        "Synchronization.synchronize_files: synchronize_files: workstation id " +
                        workstation_id + " yields no workstation path")
            else:
                logging.error(
                    "Synchronization.synchronize_files: workstation id " + workstation_id +
                    " is listed without identifier in files_to_synchronize")

            if not ok:
                logging.error("Synchronization.synchronize_files: Something went wrong: workstation " +
                              str(workstation_id) + ", identifier " + str(identifier))

        if not self._rewire_files(dsd=dsd):
            logging.error("Synchronization.synchronize_files: rewiring redundant files went wrong. "
                          "Synchronization must fail. If this persists, try switching off rewiring when synchronizing.")
            return False

        # warnings and errors are spaced out because otherwise they would be interpreted as actual
        # errors or warnings.
        logging.info("Synchronization.synchronize_files: " + str(c) + " of " + str(c_files) +
                     " synchronized, " + str(c_warnings) + " w a r n i n g s, " + str(c_files - c) + " e r r o r s.")
        logging.info("Synchronization.synchronize_files: " + str(self._rewired_files) +
                     " file-references rewired due to redundant file inserts.")

        return bool(c_files == c)

    def _init_rewiring_files(self):
        if kioskstdlib.try_get_dict_entry(self.options, "rewire_duplicates", False):
            if self.debug_mode:
                self._table_rewire_files = "DEBUG_REWIRE_FILES"
                sql = f"CREATE TABLE IF NOT EXISTS \"{self._table_rewire_files}\""
            else:
                self._table_rewire_files = "TEMP_REWIRE_FILES"
                sql = f"CREATE TEMP TABLE IF NOT EXISTS \"{self._table_rewire_files}\""

            sql += " (\"redundant_file_uid\" UUID PRIMARY KEY NOT NULL, " \
                   "\"existing_file_uid\" UUID NOT NULL" \
                   ")"

            KioskSQLDb.execute(sql)
            KioskSQLDb.execute("TRUNCATE " + f"TABLE \"{self._table_rewire_files}\"")

    def _deal_with_duplicate(self, src_file, contextual_file):
        try:
            self._duplicate_files += 1
            if kioskstdlib.try_get_dict_entry(self.options, "rewire_duplicates", False):
                logging.info(
                    f"File {src_file} with uid {contextual_file.uid} could not be uploaded to file repository because "
                    f"the same file is already known as "
                    f"{contextual_file.last_error_details['uid_existing_file']}.")
                return self._add_file_to_rewire(contextual_file.uid,
                                                contextual_file.last_error_details['uid_existing_file'])
            elif kioskstdlib.try_get_dict_entry(self.options, "drop_duplicates", False):
                logging.warning(
                    f"File {src_file} could not be uploaded to file repository because "
                    f"the same file is already known as "
                    f"{contextual_file.last_error_details['uid_existing_file']}. "
                    f"The file will be marked as BROKEN by housekeeping.")
                self._ignored_files += 1
                return True
            else:
                logging.error(f"{self.__class__.__name__}.synchronize_files_v2: "
                              f"{src_file} could not be uploaded to file repository because "
                              f"the same file is already known as "
                              f"{contextual_file.last_error_details['uid_existing_file']}.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._deal_with_duplicate: {repr(e)}")
        return False

    def _add_file_to_rewire(self, redundant_file_uid, existing_file_uid):
        try:
            logging.debug(f"{self.__class__.__name__}._add_file_to_rewire: registering file {redundant_file_uid} "
                          f"to be rewired to {existing_file_uid}")
            KioskSQLDb.execute(f"INSERT " + f" INTO \"{self._table_rewire_files}\" "
                                            f"(\"redundant_file_uid\", \"existing_file_uid\") "
                                            f"VALUES('{redundant_file_uid}', '{existing_file_uid}')")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._add_file_to_rewire : {repr(e)}")
            raise e

    def _rewire_files(self, dsd: DataSetDefinition):
        if kioskstdlib.try_get_dict_entry(self.options, "rewire_duplicates", False):
            cur = KioskSQLDb.execute_return_cursor(f"select * " + f"from "
                                                                  f"{KioskSQLDb.sql_safe_ident(self._table_rewire_files)}")
            self._rewired_files = 0
            try:
                file_rewirerer = FileRewirerer(dsd)
                r = cur.fetchone()
                while r:
                    file_rewirerer.rewire_file(uid_file=r["redundant_file_uid"],
                                               uid_file_rewired=r["existing_file_uid"])
                    self._rewired_files += 1
                    r = cur.fetchone()
                logging.info(f"rewired {self._rewired_files} files.")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._rewire_files: {repr(e)}")
                return False
            finally:
                cur.close()

            # now rewired files can be deleted from the file table.
            sql = "delete " + f"from {KioskSQLDb.sql_safe_ident(dsd.files_table)} " \
                              f"where uid in (" \
                              f"select distinct redundant_file_uid from " \
                              f"{KioskSQLDb.sql_safe_ident(self._table_rewire_files)})"
            try:
                rc = KioskSQLDb.execute(sql)
                logging.info(f"{self.__class__.__name__}._rewire_files: {rc} files removed from {dsd.files_table}")
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._rewire_files: Exception when removing redundant files "
                                f"after they had been successfully rewired: {repr(e)}")
                logging.warning(f"{self.__class__.__name__}._rewire_files: There might be a few files tagged "
                                f"'BROKEN_FILE' in the file repository. Please look at them and remove them manually.")
                logging.debug(f"{self.__class__.__name__}._rewire_files: SQL was {sql}.")

            return True
        else:
            return True

    def _sync_new_records(self, dsd, callback_progress=None):
        """ copies new records from the temporary tables into the main tables
            and deletes them afterwards in the temporary tables, so that they
            are not in the way during the next step. \n
            If a record is listed in the table repl_deleted_uids with a younger
            modification date, it will not be inserted. A warning will be given
            instead.

            TODO: redesign and refactor
            """

        ok = True
        try:
            logging.info("********** Synchronizing new records from all workstations **********")
            tables = dsd.list_tables()
            cur = KioskSQLDb.get_cursor()
            ctable = 0
            for table in tables:
                temp_table = "temp_" + table
                if self._check_reinserting_records(table, cur):
                    # delete records that have once been deleted in a former run
                    # sql = "delete from \"" + temp_table + "\" where \"" + temp_table + "\".\"uid\" in"
                    sql = "update \"" + temp_table + "\" set repl_tag = 2 where \"" + temp_table + "\".\"uid\" in"
                    sql = sql + " ("
                    sql = sql + " SELECT tmp.uid from \"" + temp_table + "\" tmp LEFT OUTER JOIN \"" + table + "\" mdb ON tmp.uid = mdb.uid"
                    sql = sql + " INNER JOIN repl_deleted_uids on tmp.uid = repl_deleted_uids.deleted_uid"
                    sql = sql + " WHERE mdb.uid IS NULL AND NOT tmp.repl_deleted"
                    sql = sql + " and tmp.modified <= repl_deleted_uids.modified"
                    sql = sql + " )"
                    sql = sql + ";"
                    cur.execute(sql)

                sql = "UPDATE \"" + temp_table + "\" set repl_tag = 1 "
                sql = sql + "WHERE \"" + temp_table + "\".\"uid\" IN("
                sql = sql + "SELECT tmp.\"uid\" from \"" + temp_table + "\" tmp "
                sql = sql + " LEFT OUTER JOIN " + table + " mdb ON tmp.\"uid\" = mdb.\"uid\""
                sql = sql + " WHERE mdb.uid IS NULL AND NOT tmp.repl_deleted)"
                sql = sql + " and repl_tag <> 2"
                sql = sql + ";"
                cur.execute(sql)

                if table == dsd.files_table:
                    sql = "select repl_workstation_id "
                    external = dsd.list_fields_with_instruction(table, "FILE_FOR")[0]
                    proxy_field = dsd.get_file_field_reference(table, external)
                    if proxy_field:
                        sql = sql + " ,\"" + external + "\""
                        sql = sql + " ,\"" + proxy_field + "\""
                    else:
                        logging.error("_sync_new_records: no proxy field for " + f)
                        ok = False

                    sql = sql + " from " + temp_table + " where repl_tag = 1"
                    if not ok:
                        return ok

                    cur.execute(sql)
                    self._add_files_to_synchronize(cur)

                sql_insert = f'INSERT INTO "{table}" ('
                sql_select = 'SELECT '
                comma = ""
                for f in dsd.list_fields(table):
                    sql_insert = sql_insert + comma + '"' + f + '"'
                    sql_select = sql_select + comma + 'tmp."' + f + '"'
                    comma = ", "

                sql_insert = sql_insert + ') '
                sql_select = sql_select + ' FROM "' + temp_table + '" tmp '
                sql = sql_insert + sql_select
                sql = sql + " WHERE tmp.\"repl_tag\" = 1;"
                savepoint = ""
                try:
                    # a nicer way to do this would be to check first if there are already any records of the
                    # sort in the destination table instead of provoking a Unique Key Violation. But this here
                    # is a quicker implementation.
                    if dsd.table_has_meta_flag(table, KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION):
                        savepoint = KioskSQLDb.begin_savepoint()
                    cur.execute(sql)
                    if cur.rowcount > 0:
                        if dsd.table_has_meta_flag(table, KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION):
                            KioskSQLDb.commit_savepoint(savepoint)

                        logging.info(
                            str(cur.rowcount) + " new lines inserted from " + temp_table + " into " + table)
                        cur.execute("Delete from repl_deleted_uids where deleted_uid in (select uid from \"" +
                                    temp_table + "\" where \"repl_tag\" = 1);")
                        if cur.rowcount > 0:
                            logging.info(str(cur.rowcount) + " deletions invalidated.")
                        cur.execute("Delete from \"" + temp_table + "\" where \"repl_tag\" > 0")
                        # logging.debug(str(cur.rowcount) + " lines deleted from " + temp_table)
                    else:
                        logging.debug("synchronization._sync_new_records: Table " + table + ": no new records")
                except Exception as e:
                    dsd: DataSetDefinition
                    if repr(e).find("UniqueViolation") == -1 or \
                            not dsd.table_has_meta_flag(table, KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION):
                        logging.error(f"synchronization._sync_new_records: Exception for {table} "
                                      f"in sql-statement {sql} : {repr(e)}")
                        ok = False
                    else:
                        if repr(e).find("UniqueViolation") > -1 and \
                                dsd.table_has_meta_flag(table, KEY_TABLE_FLAG_SYNC_IGNORE_UNIQUE_KEY_VIOLATION):
                            logging.info(f"synchronization._sync_new_records: IGNORED Exception for {table} "
                                         f"in sql-statement {sql} : {repr(e)}")
                            if savepoint:
                                KioskSQLDb.rollback_savepoint(savepoint)

                if not ok:
                    break
                else:
                    ctable += 1
                    report_progress(callback_progress, progress=ctable * 100 / len(tables),
                                    topic="_sync_new_records")

        except Exception as e:
            logging.error("synchronization._sync_new_records: Exception " + repr(e))
            ok = False
        return ok

    def _check_reinserting_records(self, table, cur):
        """If a record is listed in the table repl_deleted_uids with a younger
            modification date then a record about to be inserted, it will not be inserted.
            A warning will be given instead. This is the function to produce these warnings.

            TODO: redesign and refactor
            TODO: document

        """
        reinsertion = False
        temp_table = "temp_" + table
        cur.execute("UPDATE \"" + temp_table + "\" set repl_tag = 0")

        sql = "SELECT tmp.uid from \"" + temp_table + "\" tmp LEFT OUTER JOIN \"" + table + "\" mdb ON tmp.uid = mdb.uid"
        sql = sql + " INNER JOIN repl_deleted_uids on tmp.uid = repl_deleted_uids.deleted_uid"
        sql = sql + " WHERE mdb.uid IS NULL AND NOT tmp.repl_deleted and tmp.modified <= repl_deleted_uids.modified"
        cur.execute(sql)
        recs = cur.fetchall()
        for r in recs:
            reinsertion = True
            logging.info("!Synchronization._check_reinserting_records: Attempt to reinsert records in table \"" +
                         table + "\", record \"" + r[0] + "\": ")

            cur.execute("select * from \"" + temp_table + "\" tmp where tmp.\"uid\"=%s", [r[0]])
            s = ""
            for col in cur.description:
                s = s + "|  %s  |" % col.name

            for r2 in cur.fetchall():
                s = s + "\n"
                comma = ""
                for f in r2:
                    try:
                        s = s + comma + str(f)
                        comma = ", "
                    except Exception as e:
                        pass
            logging.info(s)
        return reinsertion

    def _sync_modified_records(self, dsd, callback_progress=None):
        """ updates those fields of records in a main-table that have been modified
            and are likely to be the newest records.

        .. NOTE::

            This step requires certain preparation to work reliably!
            Most importantly only records that have a later modification date than
            the according records in the master table should be in the temporary table.
            Otherwise it can happen that more recent data in the master table is overridden
            by older data in the temporary table.

        TODO: redesign and refactor

        """
        logging.info("********** Synchronizing modified records from all workstations **********")
        ok = True
        cur = KioskSQLDb.get_cursor()
        exclude_fields = ["modified", "modified_by", "uid", "repl_deleted", "repl_tag", "created"]

        try:
            ctable = 0
            tables = dsd.list_tables()
            for table in tables:
                temp_table = "temp_" + table
                sql = "select count(*) from \"" + temp_table + "\" where \"repl_deleted\" IS DISTINCT FROM True"
                cur.execute(sql)
                r = cur.fetchone()
                if not r or r[0] == 0:
                    logging.debug("table " + table + ": No modifications found -> nothing to do.")
                else:
                    fields = dsd.list_fields(table)
                    for field in fields:
                        if field not in exclude_fields:
                            ok = self._sync_modified_record_field(table, field)
                            if not ok:
                                break
                    if not ok:
                        break
                    else:
                        sql = "with mods as ("
                        sql = sql + " select tmp.\"uid\", tmp.\"repl_workstation_id\", tmp.\"modified\", tmp.\"modified_by\","
                        sql = sql + " row_number() OVER(partition by tmp.\"uid\" order by coalesce(tmp.\"modified\", tmp.\"created\") desc) \"sync_modified_records_nr\""
                        sql = sql + " from \"" + temp_table + "\" tmp"
                        sql = sql + " where NOT COALESCE(tmp.\"repl_deleted\", false)"
                        sql = sql + " )"
                        sql = sql + " update \"" + table + "\" set \"modified\"=upd.\"modified\", \"modified_by\"=upd.\"modified_by\""
                        sql = sql + " from"
                        sql = sql + " ("
                        sql = sql + " select m.\"uid\", m.\"modified\", m.\"modified_by\" from mods m where m.sync_modified_records_nr=1"
                        sql = sql + " ) upd where \"" + table + "\".\"uid\" = upd.\"uid\""
                        cur.execute(sql)
                        if cur.rowcount > 0:
                            logging.info(
                                "Synchronization._sync_modified_records: Table " + table + ": " + str(cur.rowcount) +
                                " records got new modification-dates.")
                        ctable += 1
                        report_progress(callback_progress, progress=ctable * 100 / len(tables),
                                        topic="_sync_modified_records")

            return ok

        except Exception as e:
            logging.error("Synchronization._sync_modified_records: Exception " + repr(e))
            ok = False
        return ok

    def _sync_modified_record_field(self, table, field):
        """
            TODO: redesign and refactor
            TODO: document
        """

        ok = False
        logging.debug("Syncing \"" + table + "\".\"" + "\"" + field + "\"")
        cur = KioskSQLDb.get_cursor()
        try:
            self._check_field_modification(cur, table, field)
            # currently apart from logging them we simply ignore colliding changes and let the newest modification win!

            ok = self._solve_field_modification(cur, table, field)

            return ok

        except Exception as e:
            logging.error("Synchronization._sync_modified_record_field: Exception " + repr(e))
            try:
                cur.close()
            except Exception as e:
                pass

        return ok

    def _check_field_modification(self, cur, table, field):
        """ checks whether there is a collision due to modifications of field-values
            of the same fields in the same record by different workstations. The
            function returns TRUE if a collision is detected, FALSE if not and throws
            Exceptions in case of an error

            TODO: redesign and refactor
        """

        temp_table = "temp_" + table
        collision = False
        cur = KioskSQLDb.get_cursor()

        sql = "SELECT tmp.\"uid\" FROM \"" + temp_table + "\" tmp"
        sql = sql + " INNER JOIN \"" + table + "\" main on tmp.uid = main.uid"
        sql = sql + " WHERE tmp.repl_deleted = false"
        sql = sql + " AND (tmp.\"" + field + "\" is distinct from main.\"" + field + "\" )"
        sql = sql + " GROUP BY tmp.\"uid\""
        sql = sql + " HAVING COUNT(DISTINCT tmp.\"repl_workstation_id\") > 1"
        sql = sql + ";"
        cur.execute(sql)
        for r in cur.fetchall():
            collision = True
            logging.warning(
                "!Synchronization collision in table \"" + table + "\", field \"" + field + "\", record \"" + r[
                    0] + "\": ")
            cur.execute(
                "select * from \"" + temp_table + "\" tmp where tmp.\"repl_deleted\"=false AND tmp.\"uid\"=%s "
                                                  "order by tmp.\"modified\" desc",
                [r[0]])
            s = ""
            for col in cur.description:
                s = s + "|  %s  |" % col.name

            first_row = True
            for r2 in cur.fetchall():
                s = s + "\n"
                if first_row:
                    s = s + "WINS: >"
                    first_row = False

                comma = ""
                for f in r2:
                    try:
                        s = s + comma + str(f)
                        comma = ", "
                    except Exception as e:
                        pass
            logging.info(s)

        return collision

    def _solve_field_modification(self, cur, table, field):
        """ updates field values in a master table from the youngest modification
            that can be found in the temporary table.
            The function returns TRUE if everything was fine, FALSE if not. It catches Exceptions

            TODO: redesign and refactor
            TODO: document
        """

        try:
            temp_table = "temp_" + table
            cur = KioskSQLDb.get_cursor()
            dsd = Dsd3Singleton.get_dsd3()
            file_field = dsd.get_proxy_field_reference(table, field)
            if file_field:
                sql = ""
                sql = sql + "with collisions as ( "
                sql = sql + "SELECT tmp.\"uid\", tmp.\"" + field + "\", tmp.\"" + file_field + "\" \"file_field\", tmp.\"modified\", tmp.\"repl_workstation_id\" \"workstation_id\", "
                sql = sql + "row_number() OVER(PARTITION BY tmp.\"uid\" "
                sql = sql + "ORDER BY COALESCE(tmp.\"modified\", tmp.\"created\") DESC) \"_solve_field_modification_rownr\" "
                sql = sql + "FROM \"" + temp_table + "\" tmp "
                sql = sql + "INNER JOIN \"" + table + "\" main ON tmp.\"uid\" = main.\"uid\" "
                sql = sql + "WHERE COALESCE(tmp.\"repl_deleted\", false) = false "
                sql = sql + "AND (tmp.\"" + field + "\" IS DISTINCT FROM main.\"" + field + "\") "
                sql = sql + ") "
                sql = sql + "select upd.\"workstation_id\" \"workstation_id\", upd.\"file_field\" \"file_id\", upd.\"proxy_field\" \"proxy_field\" "
                sql = sql + "FROM "
                sql = sql + "( "
                sql = sql + "SELECT c.\"uid\", c.\"file_field\" \"file_field\", "
                sql = sql + "c.\"" + field + "\" \"proxy_field\", c.\"workstation_id\" "
                sql = sql + "FROM collisions c "
                sql = sql + "WHERE c.\"_solve_field_modification_rownr\"=1 "
                sql = sql + ") upd inner join \"" + table + "\" on \"" + table + "\".\"uid\" = upd.\"uid\";"
                cur.execute(sql)
                if cur.rowcount > 0:
                    self._add_files_to_synchronize(cur)

            sql = "with collisions as ("
            sql = sql + " SELECT \"tmp\".\"uid\", \"tmp\".\"" + field + "\", \"tmp\".\"modified\","
            sql = sql + " row_number() OVER(PARTITION BY \"tmp\".\"uid\" ORDER BY COALESCE(\"tmp\".\"modified\", \"tmp\".\"created\") DESC) \"_solve_field_modification_rownr\""
            sql = sql + " FROM \"" + temp_table + "\" \"tmp\""
            sql = sql + " INNER JOIN \"" + table + "\" main ON tmp.\"uid\" = main.\"uid\""
            sql = sql + " WHERE COALESCE(tmp.repl_deleted, false) = false"
            sql = sql + " AND (\"tmp\".\"" + field + "\" IS DISTINCT FROM main.\"" + field + "\")"
            sql = sql + ")"
            sql = sql + " UPDATE \"" + table + "\" SET \"" + field + "\"=upd.newval"
            sql = sql + " FROM"
            sql = sql + "("
            sql = sql + " SELECT c.uid, c.\"" + field + "\" newval"
            sql = sql + " FROM collisions c"
            sql = sql + " WHERE c.\"_solve_field_modification_rownr\"=1"
            sql = sql + ") upd where \"" + table + "\".\"uid\" = upd.\"uid\""
            sql = sql + ";"
            cur.execute(sql)
            if cur.rowcount != 0:
                logging.info(table + ": " + str(cur.rowcount) + " changes applied to field " + field)
            return True

        except Exception as e:
            logging.info(
                "Synchronization._solve_field_modification: Exception at table " + str(table) + ", field " +
                str(field) + ": " + repr(e))
            try:
                if cur.sql:
                    logging.info("Exception in _solve_field_modification, sql: " + str(cur.query))
            except:
                pass

        return False

    def _sync_deleted_records(self, dsd, callback_progress=None):
        """ deletes records in a table if the modification date of the
            deleted record is still younger than that in the main table after
            modifications have been processed. That is why it is important that This
            step comes after _sync_modified_records. \nreturns true or false, no exceptions

            TODO: redesign and refactor
            TODO: document
        """
        logging.info("********** Synchronizing deleted records from all workstations **********")
        if kioskstdlib.try_get_dict_entry(self.options, "safe_mode", False):
            logging.info(f"Synchronization._sync_deleted_records: "
                         f"No records will be deleted due to a set safe mode option")

        try:
            cur = KioskSQLDb.get_cursor()

            tables = dsd.list_tables()
            ctable = 0
            for table in tables:
                temp_table = "temp_" + table
                sql = "select count(*) from \"" + temp_table + "\" where \"repl_deleted\" IS NOT DISTINCT FROM True"
                cur.execute(sql)
                r = cur.fetchone()
                if not r or r[0] == 0:
                    logging.debug("table " + table + ": No deleted records found -> nothing to do.")
                else:
                    if kioskstdlib.try_get_dict_entry(self.options, "safe_mode", False):
                        logging.warning(f"Synchronization._sync_deleted_records: "
                                        f"There would be deletions in table {table} but the safe mode prevents "
                                        f"synchronization from deleting anything")
                    else:
                        # first insert uids about to be deleted into the table repl_deleted_uids
                        sql = "insert into \"repl_deleted_uids\"(\"deleted_uid\", \"table\", \"repl_workstation_id\", \"modified\")"
                        sql = sql + " select tmp.\"uid\", '" + table + "' \"table\", tmp.\"repl_workstation_id\", tmp.\"modified\""
                        sql = sql + " from \"" + temp_table + "\" tmp"
                        sql = sql + " inner join \"" + table + "\" main on tmp.\"uid\" = main.\"uid\""
                        sql = sql + " where tmp.\"repl_deleted\" is not distinct from true"
                        sql = sql + " and not tmp.\"uid\" in (select \"deleted_uid\" from \"repl_deleted_uids\")"
                        sql = sql + " and coalesce(main.\"modified\", main.\"created\") < coalesce(tmp.\"modified\", tmp.\"created\")"
                        sql = sql + ";"
                        cur.execute(sql)
                        logging.debug(str(cur.rowcount) + " new deleted uids added to repl_deleted_uids")

                        sql = " delete from \"" + table + "\" where \"" + table + "\".\"uid\" in "
                        sql = sql + "( "
                        sql = sql + " select tmp.\"uid\""
                        sql = sql + " from \"" + temp_table + "\" tmp"
                        sql = sql + " inner join \"" + table + "\" main on tmp.\"uid\" = main.\"uid\""
                        sql = sql + " where tmp.\"repl_deleted\" is not distinct from true"
                        sql = sql + " and coalesce(main.\"modified\", main.\"created\") < coalesce(tmp.\"modified\", tmp.\"created\")"
                        sql = sql + " )"
                        sql = sql + ";"
                        cur.execute(sql)
                        if cur.rowcount > 0:
                            logging.info("Synchronization._sync_deleted_records: " +
                                         str(cur.rowcount) + " rows deleted from " + table)
                ctable += 1
                report_progress(callback_progress, progress=ctable * 100 / len(tables),
                                topic="_sync_deleted_records")

            return True

        except Exception as e:
            logging.error("Synchronization._sync_deleted_records: Exception " + repr(e))
        return False

    def _sync_change_workstation_states(self):
        """
            Sets the workstations that are in state BACK_FROM_FIELD to IDLE

            TODO: redesign and refactor
            TODO: document

        """

        try:
            work_stations = self.workstations_in_need_of_synchronization()
            ok = True
            if work_stations:
                for ws in work_stations:
                    ok = ws.on_synchronized(commit=False)
                    if not ok:
                        logging.error(
                            ("Synchronization._sync_change_workstation_states: Error using "
                             "set_state to IDLE for workstation " + ws.get_id() +
                             " in sync_change_workstation_states."))
                        break
                    else:
                        logging.debug(f"After synchronizaiton: Workstation {ws.get_id()} set back to IDLE")

        except Exception as e:
            logging.error("Synchronization._sync_change_workstation_states: Exception " + repr(e))
            ok = False

        return ok

    @classmethod
    def get_sync_time(cls) -> typing.Union[None, datetime.datetime]:
        """
            Just returns the last sync time if there is one. 
        """

        try:
            sync_time = KioskSQLDb.get_field_value("replication", "id", "sync_time", "ts")
            if not sync_time:
                sync_time = kioskstdlib.str_to_ts(KioskSQLDb.get_field_value("replication", "id", "sync_time", "value"))
        except BaseException as e:
            sync_time = None

        return sync_time

    @staticmethod
    def update_sync_time() -> bool:
        """
            updates the sync time with the current time.
        """

        cur = KioskSQLDb.get_cursor()
        if cur is None:
            logging.error("Synchronization.update_sync_time: KioskSQLDb.get_cursor() failed ")
            return False

        try:

            sql = f'insert into {KioskSQLDb.sql_safe_ident("replication")} (' \
                  f'{KioskSQLDb.sql_safe_ident("id")},' \
                  f'{KioskSQLDb.sql_safe_ident("value")},' \
                  f'{KioskSQLDb.sql_safe_ident("ts")})' \
                  f'VALUES(%(id)s,%(value)s,%(value)s) ' \
                  f'ON CONFLICT ({KioskSQLDb.sql_safe_ident("id")}) ' \
                  f'DO ' \
                  f'update ' \
                  f'set {KioskSQLDb.sql_safe_ident("value")}=%(value)s,' \
                  f'{KioskSQLDb.sql_safe_ident("ts")}=%(value)s'
            # f' where {KioskSQLDb.sql_safe_ident("id")}=%(id)s'

            sync_time = datetime.datetime.now()
            cur.execute(sql,
                        {"id": "sync_time", "value": sync_time})
            return True
        except BaseException as e:
            logging.error(f"Synchronization.update_sync_time: {repr(e)}")
            return False

    def _create_sync_temp_table(self, table, dsd):
        """
            creates a temporary table with the prefix temp_ and
            additional fields needed for synchronization.
            :param table: name of the table definition in the dsd
            :param dsd: the dsd to use.
            :returns: True or False. Exceptions will be caught.
        """
        db_adapter = PostgresDbMigration(dsd=dsd, psycopg2_con=KioskSQLDb.get_con())
        try:
            if db_adapter.create_temporary_table(dsd_table=table, db_table="temp" + "_" + table, sync_tools=True):
                return True
            else:
                logging.error(f"{self.__class__.__name__}._create_sync_temp_table: "
                              f"create_temporary_table failed for table {table}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._create_sync_temp_table: {repr(e)}")

        return False
