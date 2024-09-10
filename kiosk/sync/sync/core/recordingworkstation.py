import datetime
import logging

from werkzeug import datastructures

import kioskstdlib
from core.filepicking.kioskfilepicking import KioskFilePicking
from core.workstation import Dock
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from filehandlingsets import get_file_handling_set, FileHandlingSet
from fileidentifiercache import FileIdentifierCache
from filerepository import FileRepository
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentationTypeDimensions
from kiosksqldb import KioskSQLDb
from kioskstdlib import report_progress
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from statemachine import StateTransition
from sync_config import SyncConfig

# todo: take it from the dsd
FILES_TABLE_NAME = "images"


# noinspection PyAbstractClass
class RecordingWorkstation(Dock):
    """
        todo: document
    """

    IDLE = "IDLE"
    READY_FOR_EXPORT = "READY_FOR_EXPORT"
    BACK_FROM_FIELD = "BACK_FROM_FIELD"

    # @classmethod
    # def get_workstation_type(cls):
    #     raise NotImplementedError

    def init_state_machine(self):
        super().init_state_machine()
        self.state_machine.add_transition(self.IDLE, StateTransition("FORK", self.READY_FOR_EXPORT, None, self.fork))
        self.state_machine.add_transition(self.READY_FOR_EXPORT,
                                          StateTransition("FORK", self.READY_FOR_EXPORT, None, self.fork,
                                                          failed_state=self.IDLE))

    @classmethod
    def register_states(cls):
        super().register_states()
        cls.STATE_NAME.update(
            {
                0: cls.IDLE,
                1: cls.READY_FOR_EXPORT,
                3: cls.BACK_FROM_FIELD
            })

    def __init__(self, workstation_id, description="", sync=None, *args, **kwargs):
        """
           recording_group must be provided by kwargs or default values
           will be fetched from the configuration.

        :params see base class
        """
        self.c_file_registered = 0

        super().__init__(workstation_id, description, sync=sync, *args, **kwargs)

    @property
    def file_handling(self):
        """
        this is a deprecated method for legacy purposes. file_handling is now recording_group.
        This method will be dropped as soon as no caller uses file_handling anymore.
        :return: a string
        """
        logging.debug(f"{self.__class__.__name__}.file_handling: call to deprecated property. "
                      f"Use recording group. ")
        return self.recording_group

    @file_handling.setter
    def file_handling(self, value):
        """
        this is a deprecated method for legacy purposes. file_handling is now recording_group.
        This method will be dropped as soon as no caller uses file_handling anymore.
        Anyhow: Use self.set_recording_group() if you want to change the recording group and persist it.
        :param value: the recording group to set.
        """
        logging.debug(f"{self.__class__.__name__}.file_handling: call to deprecated setter. "
                      f"Use recording group. ")
        self.recording_group = value

    def get_file_handling(self):
        """
        this is a deprecated method for legacy purposes. file_handling is now recording_group.
        This method will be dropped as soon as no caller uses file_handling anymore.
        Anyhow: Use self.set_recording_group() if you want to change the recording group and persist it.
        """
        logging.debug(f"{self.__class__.__name__}.get_file_handling: call to deprecated method. "
                      f"Use recording group. ")
        return self.get_recording_group()

    def _on_create_workstation(self, cur):
        """

        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """

        KioskSQLDb.drop_table_if_exists(self._id + "_fm_image_transfer", self._db_namespace.lower())
        table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace.lower(),
                                                          db_table=self._id + "_fm_image_transfer")
        sql = f"create table {table_name}("
        sql += "id serial NOT NULL, "
        sql += "uid_file uuid NOT NULL, "
        sql += "filepath_and_name varchar NOT NULL, "
        sql += "location varchar NOT NULL DEFAULT 'internal', "
        sql += "resolution varchar NOT NULL, "
        sql += "disabled boolean NOT NULL, "
        sql += "file_type varchar, "
        sql += "file_size decimal "
        sql += ");"
        cur.execute(sql)

    def _on_delete_workstation(self, cur, migration):
        if self._db_namespace:
            migration.drop_table(self._id + "_fm_image_transfer", namespace=self._db_namespace)

    def _get_tables_to_delete(self, workstation_dsd):
        tables = super()._get_tables_to_delete(workstation_dsd)
        tables.append("fm_image_transfer")
        tables.append("fm_repldata_transfer")
        return tables

    def get_fork_time(self):
        """
            returns the fork time without milliseconds or time zone

            Note: Although the fork time is coming back without a time zone, expect it to be in
            the time zone that was set for the user (the dock's user time zone) on export.

            :returns a datetime without microseconds and time zone or None
        """
        fork_time = self._get_workstation_attribute_from_db("fork_time")
        return fork_time.replace(microsecond=0, tzinfo=None) if fork_time else fork_time

    def get_fork_sync_time(self):
        """
            return the utc fork sync time for the workstation

            Note: Although the fork sync time is coming back without a time zone, expect it to be in
            the time zone that was set for the user (the dock's user time zone) on export.

            :returns a datetime without microseconds and time zone or None
        """
        ts: datetime.datetime = self._get_workstation_attribute_from_db("fork_sync_time")
        return ts.replace(microsecond=0, tzinfo=None) if ts else ts

    def get_recording_group(self):
        """
            returns the workstation's recording group as stored in the database
        """
        return self._get_workstation_attribute_from_db("recording_group")

    def set_recording_group(self, recording_group, commit=True):
        """sets and persists a recording_group for the workstation

        .. note::

            does not work if there is no file handling set defined under the name of the
            recording group!

        """
        if not get_file_handling_set(recording_group):
            logging.error(f"{self.__class__.__name__}.set_recording_group: Cannot update RecordingWorkstation "
                          f"because there is no file handling set defined"
                          f" for recording group {self.recording_group}")
            return False
        cur = None
        try:
            cur = KioskSQLDb.get_cursor()
            cur.execute('UPDATE "repl_workstation" SET recording_group = %s where id=%s',
                        [recording_group, self._id])
            cur.close()
            if commit:
                KioskSQLDb.commit()
            return True
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.set_recording_group: "
                          f"Exception: recording_group cannot be set to {recording_group} "
                          f"for workstation {self._id}: {repr(e)}")
            try:
                if cur:
                    cur.close()
            except:
                pass
        return False

    def _replace_table_data(self, cur, dsd: DataSetDefinition, src_table, dst_table):
        """ Replaces the data in table dst_table with the data in table src_table.
            The data in dst_table will be deleted first. cur must be a cursor to the
            database.

        .. note:

            does catch exceptions, returns true or false.

            todo: refactor Move to UrapDb or to UrapDsd?
            todo: since this works only with dsd tables and fields, perhaps change name
            todo: use proper sql_safe_namespaced_table / sql_safe_ident

        """
        try:
            # we have a truncate here. That can cause a blocking database!
            # can I work with a timeout here and in case of failure use delete *?
            cur.execute(f'TRUNCATE TABLE {dst_table}')
            sql_insert = f'INSERT INTO {dst_table} ('
            sql_select = 'SELECT '
            comma = ""
            for f in dsd.list_fields(src_table):
                sql_insert = sql_insert + comma + '"' + f + '"'
                sql_select = sql_select + comma + '"' + f + '"'
                comma = ", "
            sql_insert = sql_insert + ') '
            sql_select = sql_select + ' FROM "' + src_table + '"'

            where_option = dsd.get_fork_option(src_table, "where")
            if where_option:
                logging.info("using where option for table {}: {}".format(src_table, where_option))
                sql_select += " where " + where_option

            sql_select += ';'
            try:
                cur.execute(sql_insert + sql_select)
                logging.info("\n " + str(cur.rowcount) + " lines copied from " + src_table + " to " + dst_table)
                return True
            except Exception as e:
                logging.error("Exception in _replace_table_data for table " + dst_table + " in sql-statement %s: %s" % (
                    cur.query, repr(e)))
        except Exception as e:
            logging.error(f"Exception in _replace_table_data for workstation {self._id}: {repr(e)}")
        return False

    # *******************************************************************
    # ***********                synchronization              ***********
    # *******************************************************************

    def sync_data2temp_table(self, table):
        """
            .. note:


            todo: documentation
            todo: redesign
            todo: refactor!

        """
        dsd = self._get_workstation_dsd()
        logging.debug("Workstation " + self._id + ": transferring sync data to temporary table temp_" + table)
        try:
            cur = KioskSQLDb.get_cursor()
            temp_table = "temp_" + table
            ws_table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                            db_table=self._id + "_" + table)
            #  This should not really be necessary, but when it comes to synchronization, I am rather overly careful
            sql_delete = "delete " + f"from \"{temp_table}\" where repl_workstation_id=%s;"
            cur.execute(sql_delete, [self._id])

            sql_insert = f"INSERT " + f"INTO \"{temp_table}\" ("
            sql_select = 'SELECT '
            comma = ""
            for f in dsd.list_fields(table):
                sql_insert = sql_insert + comma + '"' + f + '"'
                sql_select = sql_select + comma + 'ws."' + f + '"'
                comma = ", "

            sql_insert = sql_insert + comma + '"repl_deleted"'
            sql_insert = sql_insert + comma + '"repl_workstation_id"'
            sql_select = sql_select + comma + 'ws."repl_deleted"'
            sql_select = sql_select + comma + "\'" + self._id + "\'"
            sql_insert = sql_insert + ') '
            sql_select = sql_select + ' FROM ' + ws_table + ' ws '

            sql = ""
            try:
                # first we add records that are new
                sql = sql_insert + sql_select
                sql = sql + "LEFT OUTER JOIN \"" + table + "\" mdb ON ws.\"uid\" = mdb.\"uid\" "
                sql = sql + "WHERE mdb.\"uid\" IS NULL AND NOT ws.\"repl_deleted\""
                sql = sql + ";"
                cur.execute(sql)
                if cur.rowcount:
                    logging.info(f"{ws_table}: {str(cur.rowcount)} new lines inserted")
                ok = True
            except Exception as e:
                logging.error("RecordingWorkstation.sync_data2temp_table: Exception when adding new records to table " +
                              ws_table + " in sql-statement " + sql + ": " + repr(e))
                ok = False

            try:
                # now we add records that are younger than those in the master-Model and have not been deleted
                sql = sql_insert + sql_select
                sql = sql + "INNER JOIN \"" + table + "\" mdb ON ws.\"uid\" = mdb.\"uid\" "
                sql = sql + "WHERE COALESCE(mdb.\"modified\", mdb.\"created\") < "
                sql = sql + "COALESCE(ws.\"modified\", ws.\"created\") AND NOT ws.\"repl_deleted\""
                sql = sql + ";"
                cur.execute(sql)
                if cur.rowcount:
                    logging.info(f"{ws_table}: {str(cur.rowcount)} modified lines.")
            except Exception as e:
                logging.error(("RecordingWorkstation.sync_data2temp_table: Exception when adding younger "
                               "records to table " + ws_table + " in sql-statement " + sql + ": " + repr(e)))
                ok = False

            try:
                # now we add records that have been deleted in the workstation after
                # the modification date in the master-Model
                sql = sql_insert + sql_select
                sql = sql + "INNER JOIN \"" + table + "\" mdb ON ws.\"uid\" = mdb.\"uid\" "
                sql = sql + "WHERE COALESCE(mdb.\"modified\", mdb.\"created\") < COALESCE(ws.\"modified\", ws.\"created\") AND ws.\"repl_deleted\""
                sql = sql + ";"
                cur.execute(sql)
                if cur.rowcount:
                    logging.info(f"{ws_table}: {str(cur.rowcount)} deleted lines.")
            except Exception as e:
                logging.error(("RecordingWorkstation.sync_data2temp_table: Exception when adding deleted "
                               "records to table " + ws_table + " in sql-statement " + sql + ": " + repr(e)))
                ok = False

            return ok
        except Exception as e:
            logging.error(("RecordingWorkstation.sync_data2temp_table: Exception " + repr(e)))
            ok = False
        return ok

    def partakes_in_synchronization(self):
        """
            signals to the synchronization process whether this workstation is taking part
            in synchronization.

            :returns true/false

        """
        return True

    # *******************************************************************
    # ********                  fork                         ************
    # *******************************************************************

    def fork(self):
        """forks the data in the master database and all the files needed by a workstation
        by creating a copy of it in
        the shadow tables of the given workstation. Afterward the workstation will
        turn to state "READY_FOR_EXPORT" \n

        :return: True or False, commits the data or makes a rollback

        """

        logging.info("Forking work station " + self.get_id())
        logging.info("rebuilding file-identifier-cache " + self.get_id())
        fic = FileIdentifierCache(self._get_workstation_dsd())
        fic.build_file_identifier_cache_from_contexts()

        self.c_file_registered = 0
        if self.load_workstation_tables():
            if not report_progress(self.callback_progress, progress=10):
                return False

            if self.prepare_file_export_v2(self.callback_progress):
                if not report_progress(self.callback_progress, progress=90):
                    return False
                logging.info(f"{self.__class__.__name__}.fork: {self.c_file_registered} "
                             f"calls to _register_fm_image_transfer_file")
                KioskSQLDb.commit()
                report_progress(self.callback_progress, progress=100)
                return True
            else:
                logging.error(f"RecordingWorkstation.fork: prepare_file_export failed for workstation {self.get_id()}")
        else:
            logging.error(
                f"RecordingWorkstation.fork: load_workstation_tables failed for workstation {self.get_id()}")
        try:
            KioskSQLDb.rollback()
            logging.info(f"RecordingWorkstation.fork: rollback successful")
        except Exception as e:
            logging.error(f"RecordingWorkstation.fork: Exception when rolling back {repr(e)} ")

        return False

    def load_workstation_tables(self):
        """ loads current master-data into the workstation's shadow tables
            within the master-Model. If there is data in the workstation's
            shadow tables, it will be deleted first. \n
            returns True or False

        """

        from synchronization import Synchronization

        cur = KioskSQLDb.get_cursor()
        if cur is None:
            logging.error("KioskSQLDb.get_cursor() failed in load_workstation_tables()")
            return False

        dsd = self._get_workstation_dsd()
        if dsd is None:
            logging.error("KioskSQLDb.get_dsd() failed in load_workstation_tables()")
            return False

        migration = Migration(dsd, PostgresDbMigration(dsd, KioskSQLDb.get_con()),
                              SyncConfig.get_config().get_project_id())
        try:
            if not migration.migrate_dataset(self._id + "_", self._id.lower()):
                logging.error(f"{self.__class__.__name__}.load_workstation_tables: "
                              f"Error migrating workstation dataset for workstation {self._id}.")
                return False
            else:
                logging.info(f"{self.__class__.__name__}.load_workstation_tables: "
                             f"Migrated workstation dataset for workstation {self._id} successfully.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.load_workstation_tables: Migration threw exception {repr(e)}")
            logging.error(f"{self.__class__.__name__}.load_workstation_tables: Perhaps you had better  "
                          f"delete and recreate this workstation.")
            return False

        tables = dsd.list_tables()
        try:
            ok = True
            for table in tables:
                dst_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                      db_table=self._id + "_" + table)
                if not self._replace_table_data(cur, dsd, table, dst_table_name):
                    logging.error("_replace_table_data failed for table " + dst_table_name)
                    ok = False
                    break
            if ok:
                fork_sync_time = Synchronization.get_sync_time()
                # fork_sync_time = KioskSQLDb.get_field_value("replication", "id", "sync_time", "value")
                cur.execute(f'update ' + f'"repl_workstation" set "fork_time" = %s, "fork_sync_time" = %s '
                                         f'where "id" = %s',
                            [kioskstdlib.get_utc_now(no_tz_info=True, no_ms=True), fork_sync_time, self._id])
                KioskSQLDb.commit()
                cur.close()
                return True
        except Exception as e:
            KioskSQLDb.rollback()
            logging.error("exception in load_workstation_tables: " + repr(e))
            try:
                cur.close()
            except Exception:
                pass
        return False

    def prepare_file_export_v2(self, callback_progress=None) -> bool:
        """ Makes sure that the file representations needed
            by this workstation are available later when it will come to
            exporting to the workstation.

            :return: boolean, does not throw exceptions.
        """
        try:
            if not self._sync:
                logging.error(f"{self.__class__.__name__}.prepare_file_export: "
                              f"No sync instance assigned to workstation.")
                return False

            recording_group = self.get_recording_group()
            fh_set = get_file_handling_set(recording_group, SyncConfig.get_config())
            if not fh_set:
                logging.debug(f"{self.__class__.__name__}.prepare_file_export: "
                              f"file handling set could not be acquired.")
                return False

            cur_fm_image_transfer = None
            san_fm_image_transfer = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                         db_table=f"{self._id}_fm_image_transfer")
            ok = False
            try:
                cur_fm_image_transfer = KioskSQLDb.get_dict_cursor()
                # todo: there is another truncate that might block the database
                cur_fm_image_transfer.execute(f"TRUNCATE TABLE {san_fm_image_transfer};")
                c = KioskSQLDb.get_record_count(f"{self._id}_fm_image_transfer", "id", namespace=self._db_namespace)
                if c != 0:
                    raise Exception(f"{san_fm_image_transfer} has records. Truncate must have failed.")

                if self._prepare_files_table_for_file_export_v2(cur_fm_image_transfer, fh_set,
                                                                callback_progress=callback_progress):
                    ok = True

                else:
                    logging.error(
                        "error in prepare_file_export: _prepare_files_table_for_file_export failed")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.prepare_file_export:"
                              f" Exception before preparing files table{repr(e)}")

            try:
                if cur_fm_image_transfer:
                    cur_fm_image_transfer.close()
            except BaseException:
                pass

            return ok
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.prepare_file_export: "
                          f"Exception in prepare_file_export:" + repr(e))

        return False

    def _check_fm_transfer_table_record_count(self, line_no="0"):
        c = KioskSQLDb.get_record_count(f"{self._id}_fm_image_transfer", "id", namespace=self._db_namespace)
        if c != self.c_file_registered:
            raise Exception(f"{self._id}_fm_image_transfer has too many records in line {line_no}: "
                            f"{c} instead of {self.c_file_registered}")

    def _translate_record_types(self, requested_alias: str) -> str:
        """
        returns the record_type defined for the alias or - if this is no alias - the alias itself.
        :param requested_alias: an alias (or a record type, which will be returned)
        :return: the record_type for the alias (or the given alias is supposed to be a record type)
        """
        cfg = SyncConfig.get_config()
        record_types = cfg.file_repository["recording_context_aliases"]
        for _type, alias in record_types.items():
            if alias.lower() == requested_alias.lower():
                return _type
        return requested_alias

    def _prepare_files_table_for_file_export_v2(self,
                                                cur,
                                                fh_set: FileHandlingSet,
                                                callback_progress=None) -> bool:
        """
            walks through the workstation's files table (which has all the files that should go to the workstation)
            and calls _prepare_file_for_export on every single file.
            It also prepares the file picking rules.

            :param cur: cursor of the database
            :param fh_set: FileHandlingSet instance: the file handling set for this workstation
            :param callback_progress: callback function to report progress
            :return:
            :return boolean, does not throw exceptions
        """
        ok = True
        try:
            c_records = 0
            # what the heck is that? That must be an old check from times when there was trouble around here.
            self._check_fm_transfer_table_record_count("Line 869")

            ws_files_table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                  db_table=f"{self._id}_{FILES_TABLE_NAME}")

            file_repos = FileRepository(SyncConfig.get_config(),
                                        self._sync.events,
                                        self._sync.type_repository,
                                        self._sync)
            if callback_progress:
                c_records = kioskstdlib.null_val(
                    KioskSQLDb.get_field_value_from_sql("c", f"select count(*) c from {ws_files_table}"), 0)

            master_dsd = Dsd3Singleton.get_dsd3()
            fid = FileIdentifierCache(master_dsd)
            file_picking_rules = self._fork_get_file_picking(file_repos, fid, master_dsd)
            #  We want to prepare only those files that are referenced by a record that has been
            #  actually exported to the device. files_table is querying the workstation-specific files table
            #  and not the master database's.
            cur.execute(f"select * from {ws_files_table}")
            c = 0
            r = cur.fetchone()
            while r:
                c += 1
                if callback_progress:
                    progress = int(c * 100 / c_records)  # cannot lead to div/0
                    if not report_progress(callback_progress, progress,
                                           "_prepare_files_table_for_file_export_v2:" + self._id + "_" +
                                           FILES_TABLE_NAME):
                        return False
                uid_file = r["uid"]
                ok = self._prepare_file_for_export_v2(file_repos,
                                                      uid_file,
                                                      fh_set, file_picking_rules)
                if ok:
                    r = cur.fetchone()
                else:
                    logging.error(f"{self.__class__.__name__}._prepare_files_table_for_file_export_v2:"
                                  f"File {r['uid']} could not be prepared.")
                    break
            if ok:
                self._check_fm_transfer_table_record_count("Line 907")
                ok = self._remove_contextless_dummy_images(cur, dsd=master_dsd)

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._prepare_files_table_for_file_export_v2:"
                          f" {repr(e)}")
            ok = False
        return ok

    def _fork_get_file_picking(self, file_repos, fid: FileIdentifierCache, master_dsd) -> KioskFilePicking:
        """
        Initializes the file picking for fork and returns it.
        :param file_repos: a file repository instance
        :return: a KioskFilePicking instance
        """
        file_picking_rules = KioskFilePicking(self.get_workstation_type(), fid, master_dsd, self.recording_group)
        file_picking_rules.on_get_files_with_tags = file_repos.get_files_with_tags
        file_picking_rules.on_get_files_by_date = file_repos.get_files_by_date
        file_picking_rules.on_translate_record_type_alias = self._translate_record_types
        return file_picking_rules

    def _prepare_file_for_export_v2(self,
                                    file_repos: FileRepository,
                                    uid_file,
                                    fh_set: FileHandlingSet,
                                    file_picking: KioskFilePicking) -> bool:
        """ prepares a single file representation that will represent the file in the workstation.
            meant to be called only by _prepare_files_table_for_file_export_v2.

        :param file_repos: a file repository instance
        :param uid_file:  the uid if the file
        :param fh_set: a FileHandlingSet instance
        :param file_picking: a properly initialized KioskFilePicking instance

        :return: True/False, should not throw exceptions
        """
        try:
            cfg = SyncConfig.get_config()
            f, src_file = self._get_file_and_filename(cfg, file_repos, uid_file)
            if src_file == "dummy":
                file_type = "broken"
            else:
                file_type = kioskstdlib.get_file_extension(src_file)
            # #151: This is done now via file handling.
            # if kioskstdlib.get_file_extension(filename).lower() in ["mov", "avi", "mpeg", "mpg"]:
            #     logging.warning(f"{self.__class__.__name__}._prepare_file_for_export: "
            #                     f"file {uid_file} is a video and will be skipped.")
            #     return True
            file_handling_results = self._compute_file_handling_results(f,
                                                                        fh_set,
                                                                        file_picking,
                                                                        src_file,
                                                                        uid_file)
            logging.debug(f"{self.__class__.__name__}._prepare_file_for_export_v2: "
                          f"file handling results for file {uid_file}: {file_handling_results}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._prepare_file_for_export_v2(1): {repr(e)}")
            return False

        try:
            if file_handling_results["representation"] or file_handling_results["resolution"] != "dummy":
                cache_file = f.get(file_handling_results["representation"], True)
                if cache_file:
                    if "max_file_size_kbytes" in file_handling_results:
                        max_file_size = int(file_handling_results["max_file_size_kbytes"]) * 1024
                        if max_file_size and kioskstdlib.get_file_size(cache_file) > max_file_size:
                            cache_file = "dummy"
                            file_handling_results["location"] = "internal"
                            file_handling_results["resolution"] = "dummy"
                            file_handling_results["disable"] = True
                else:
                    cache_file = "dummy"
                    logging.warning(f"{self.__class__.__name__}._prepare_file_for_export_v2: "
                                    f"f.get returned no cache file for file {uid_file}")
                    logging.info(f"{self.__class__.__name__}._prepare_file_for_export_v2: "
                                 f"file_handling_results: {file_handling_results['representation']}")
            else:
                cache_file = "dummy"

            if cache_file:
                if cache_file != "dummy":
                    logging.debug(f"using "
                                  f"{'raw' if not file_handling_results['representation'] else file_handling_results['representation'].unique_name}"
                                  f" representation {cache_file}")
                ok = self._register_fm_image_transfer_file(uid_file, cache_file,
                                                           file_handling_results["location"],
                                                           file_handling_results["resolution"],
                                                           file_handling_results["disable"],
                                                           file_type,
                                                           file_handling_results["representation"])
                return ok
            else:
                logging.error(f"{self.__class__.__name__}._prepare_file_for_export_v2: "
                              f"no representation for file {uid_file}. File can't be prepared for workstation.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._prepare_file_for_export_v2(2): {repr(e)}")
        return False

    def _compute_file_handling_results(self, f, fh_set, file_picking, src_file, uid_file) -> dict:
        """
        subroutine of _prepare_file_for_export_v2: figures out how to actually handle the file.
        This does most of the work.

        :param f: the contextual file that manages the file
        :param fh_set: The file handling set for this recording group.
        :param file_picking: The file picking rules for this workstation type and recording group
        :param src_file: the filename, which can be "dummy"!
        :param uid_file: the uid of the file
        :return: if the src_file is "dummy" or the file type is not supported, the result will be the dummy default
                 "location": "internal","representation": None, "disable": False,"resolution": "dummy"
                 Otherwise the keys will be set to the results from file picking and file handling
        """
        result = {"location": "internal",
                  "representation": None,
                  "disable": True,
                  "resolution": "dummy"}

        if src_file != "dummy":
            if not fh_set.is_file_type_supported(src_file):
                logging.info(f"{self.__class__.__name__}._prepare_file_for_export_v2file: "
                             f"file {kioskstdlib.get_filename(src_file)} "
                             f"not prepared for workstation because file extension is not supported by file handling.")
            else:
                dimensions = self._get_file_dimensions(f, src_file)
                fp_rule = file_picking.get_file_picking_rule(uid_file)
                if not fp_rule:
                    raise Exception(f"No file picking rule for file {uid_file}. Don't know how to handle this file.")

                fh_rule = fh_set.get_file_handling(src_file, width=dimensions.width, height=dimensions.height,
                                                   resolution=fp_rule.resolution)
                if fh_rule:
                    representation = KioskRepresentationType.from_file_handling_rule(fh_rule)
                else:
                    raise Exception(f"No file handling rule for file {uid_file} and resolution {fp_rule.resolution}")

                if representation:
                    if "DROP_EXIF_DATA" not in representation.get_all_manipulations():
                        if "DROP_EXIF_DATA" not in representation.get_inherited_manipulations():
                            logging.warning(f"{self.__class__.__name__}._prepare_file_for_export_v2:"
                                            f"{representation.unique_name} nor its masters apply DROP_EXIF_DATA. "
                                            f"If the filemaker export or filemaker slows down unusually, "
                                            f"that might be the reason.")
                else:
                    if fp_rule.resolution != "dummy":
                        location = kioskstdlib.try_get_dict_entry(fh_rule, "location", "", null_defaults=True).lower()
                        # if the rule has a storage attribute (in other words: The rule is a correct rule)
                        # the original file is going to be used. No representation is necessary.
                        if not location:
                            raise Exception(f"No representation can be inferred from rule for file "
                                            f"{src_file} and workstation {self._id}. The rule might be corrupt.")

                result["location"] = fh_rule["location"]
                result["representation"] = representation
                result["disable"] = fp_rule.disable_changes
                result["resolution"] = fp_rule.resolution
                if "max_file_size_kbytes" in fh_rule:
                    result["max_file_size_kbytes"] = fh_rule["max_file_size_kbytes"]

        return result

    def _get_file_dimensions(self, f, src_file: str) -> KioskRepresentationTypeDimensions:
        """
        subroutine of _prepare_file_for_export_v2. determines the file's dimensions if possible.
        Don't call with a file that is not supported by file handling!
        :param f:
        :param src_file:
        :return: KioskRepresentationDimensions
        """
        dimensions = f.get_file_attributes(True)
        if "width" in dimensions and "height" in dimensions:
            dimensions = KioskRepresentationTypeDimensions(dimensions["width"], dimensions["height"])
        else:
            dimensions = KioskRepresentationTypeDimensions(0, 0)
            logging.info(
                f"{self.__class__.__name__}._prepare_file_for_export/_get_file_dimensions: "
                f"Cannot get dimensions for file {src_file}")

        return dimensions

    def _get_file_and_filename(self, cfg, file_repos, uid_file) -> (object, str):
        """
        subroutine of _prepare_file_for_export_v2. determines the filename and the contextual file
        :param cfg:
        :param file_repos:
        :param uid_file:
        :return: contextual file instance, filename: str.
                 filename is "dummy" if the file is broken and broken files are accepted
        :raises Exception
        """
        ignore_missing_files = cfg.ignore_missing_files
        f = file_repos.get_contextual_file(uid_file)
        if not f:
            raise Exception(f"cannot acquire contextual file from repository for file {uid_file}.")
        if f.file_exists():
            filename = f.get()
        else:
            if ignore_missing_files:
                logging.info(f"{self.__class__.__name__}._prepare_file_for_export/_get_file_and_filename: "
                             f"contextual file {uid_file} broken. Dummy will be used.")
                filename = "dummy"
            else:
                raise Exception(f"contextual file {uid_file} is broken.")
        return f, filename

    def _register_fm_image_transfer_file(self, file_id, dst_file, location, resolution, disabled, file_type,
                                         representation):
        """ Writes the details of a prepared image to the workstation's table _fm_image_transfer.
            sub-routine of _prepare_file_for_export_v2
            :returns True or False,
            :raises: suppresses Exceptions.
        """
        try:
            representation_name = representation.unique_name if representation else ""
            combined_resolution = "dummy" if resolution == "dummy" else representation_name

            self.c_file_registered = self.c_file_registered + 1
            if dst_file != "dummy":
                file_size = kioskstdlib.get_file_size(dst_file)
            else:
                file_size = 0
            cur = KioskSQLDb.get_dict_cursor()
            san_fm_image_transfer = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                         db_table=f"{self._id}_fm_image_transfer")
            sql = f"INSERT INTO {san_fm_image_transfer}"
            sql += "(uid_file, filepath_and_name, location, resolution, disabled, file_type, file_size) "
            sql += "VALUES(%s,%s,%s,%s,%s,%s, %s); "
            cur.execute(sql, [file_id, dst_file, location, combined_resolution, disabled, file_type, file_size])
            cur.close()
            return True

        except Exception as e:
            logging.error(f"{self.__class__.__name__}._register_fm_image_transfer_file: {repr(e)} ")
        return False

    def _remove_contextless_dummy_images(self, cur, dsd: DataSetDefinition):
        """
        removes the images from the workstation's file and file_transfer table that get a dummy representation
        AND are not bound to a context.

        :param cur: a cursor
        :param dsd: the workstation or master dsd (doesn't matter)
        :return: true or false
        """
        san_file_transfer_table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                                       db_table=f"{self._id}_fm_image_transfer")
        san_image_table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace,
                                                               db_table=f"{self._id}_{dsd.files_table}")
        san_temp_table = KioskSQLDb.sql_safe_ident("_remove_contextless_dummy_images")
        # cache_sql = fid.get_cache_sql(fields=["data"])
        sql_create = "CREATE " + \
                     f"""TEMP TABLE{san_temp_table}(
                            uid_file UUID NOT NULL) 
                      """
        sp = KioskSQLDb.begin_savepoint(savepoint_name="_remove_contextless_dummy_images")

        try:
            cur.execute(sql_create)

            file_fields = dsd.list_file_fields()
            sql = ""
            for t in file_fields.keys():
                table = KioskSQLDb.sql_safe_namespaced_table(namespace=self._db_namespace, db_table=f"{self._id}_{t}")
                for f in file_fields[t]:
                    try:
                        sql = "insert " + f"into {san_temp_table}(\"uid_file\") "
                        sql += "select " + f"t.{f} from {table} t "
                        sql += f"inner join {san_file_transfer_table} tr "
                        sql += f"on t.{f} = tr.uid_file "
                        sql += f"where tr.filepath_and_name = 'dummy'"
                        cur.execute(sql)
                        # logging.debug(f"{self.__class__.__name__}._remove_contextless_dummy_images: "
                        #               f"inserted {cur.rowcount} from {table}")
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}._remove_contextless_dummy_images: "
                                      f"Exception when inserting {t} into temp table: {repr(e)}")
                        logging.error(f"{self.__class__.__name__}._remove_contextless_dummy_images: "
                                      f"sql was {sql}")
                        raise e

            # temp table has all file uids that are used somewhere in the recording data but
            # meant to be dummies. All files meant to be dummies that are NOT in the temp table
            # are superfluous in the recording. Hence they can be deleted:

            sql_delete = "select distinct tr.uid_file"
            sql_delete += f""" 
                from {san_file_transfer_table} tr left outer join
                {san_temp_table} tmp on tr.uid_file = tmp.uid_file where tmp.uid_file is null
                and tr.filepath_and_name = 'dummy'
                """

            cur.execute("delete " + f"from {san_image_table} "
                                    f"where {KioskSQLDb.sql_safe_ident('uid')} "
                                    f"in ({sql_delete})")
            # logging.debug(f"{self.__class__.__name__}._remove_contextless_dummy_images: "
            #               f"removed {cur.rowcount} from {san_image_table}")

            cur.execute(f"delete " + f"from {san_file_transfer_table} "
                                     f"where {KioskSQLDb.sql_safe_ident('uid_file')} "
                                     f"in ({sql_delete})")
            # logging.debug(f"{self.__class__.__name__}._remove_contextless_dummy_images: "
            #               f"removed {cur.rowcount} from {san_file_transfer_table}")

            cur.execute(f"drop table if exists {san_temp_table}")
            KioskSQLDb.commit_savepoint(sp)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._remove_contextless_dummy_images: {repr(e)}")
            return False
        finally:
            if KioskSQLDb.in_error_state():
                KioskSQLDb.rollback_savepoint(sp)

    def _on_synchronized(self) -> bool:
        """
        called after synchronization was successful and the workstation transitions from BACK_FROM_FIELD to IDLE.
        Should return False only in extremely severe cases since the synchronization process has been successful at this
        point and it is rather important that the workstation transitions to IDLE.
        """
        return True

    def upload_file(self, file: datastructures.FileStorage) -> bool:
        """
        after a new file has been uploaded this is called on the workstation to do something with the
        uploaded file. Usually it just saves it somewhere.
        :param file: werkzeug.datastructures.FileStorage. call .save to save the file.
        :returns boolean.
        todo: this would not apply to a workstation that does not upload files.
              So I think it belongs to FileMakerWorkstation, where it is implemented.
        """
        raise NotImplementedError
