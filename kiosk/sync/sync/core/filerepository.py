# import time
import logging
import os
import kioskstdlib
import datetime

from eventmanager import EventManager
from typerepository import TypeRepository

from kioskabstractclasses import PluginLoader
from kioskcontextualfile import KioskContextualFile
from kioskfilecache import KioskFileCache
from kiosklogicalfile import KioskLogicalFile
from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from kiosksqldb import KioskSQLDb
from databasedrivers import DatabaseDriver

from dsd.dsd3singleton import Dsd3Singleton

import shutil


class FileRepository:
    def __init__(self, conf: SyncConfig, event_manager: EventManager = None,
                 type_repository: TypeRepository = None,
                 plugin_loader: PluginLoader = None):
        self.conf: SyncConfig = conf
        self.dsd = Dsd3Singleton.get_dsd3()
        self._event_manager: EventManager = event_manager
        self._type_repository: TypeRepository = type_repository
        self._plugin_loader: PluginLoader = plugin_loader

        self.repository_path = conf.get_file_repository(True)
        if not self.repository_path:
            raise Exception("FileRepository can't initiate repository_path")

        self._history_path = os.path.join(self.repository_path, "history")
        if "file_repository_history" in self.conf.config:
            self._history_path = self.conf.resolve_symbols(self.conf.config["file_repository_history"])
        if not self._history_path:
            raise Exception(f"{self.__class__.__name__}.__init__ : history_path no set")

        if not os.path.isdir(self._history_path):
            os.mkdir(self._history_path)

        self._cache_dir = os.path.join(self.repository_path, "cache")
        if "cache" in self.conf.file_repository:
            self._cache_dir = self.conf.resolve_symbols(self.conf.file_repository["cache"])
        else:
            logging.warning(f"file_repository_cache not set: Defaulting to {self._cache_dir}")
        print(self.conf.file_repository)
        if not self._cache_dir:
            raise Exception(f"{self.__class__.__name__}.__init__ : file_repository_cache no set")

        if not os.path.isdir(self._cache_dir):
            os.mkdir(self._cache_dir)

        self._cache_manager: KioskFileCache = KioskFileCache(cache_base_dir=self._cache_dir,
                                                             representation_repository=self._type_repository)

    def get_path(self):
        """
        returns the path of the file repository
        :return: str
        """
        return self.repository_path

    def get_history_path(self):
        """
        returns the path of the file repository history directory
        :return: str
        """
        return self._history_path

    def get_cache_dir(self):
        """
        returns the path of the file repository's cache directory
        :return: str
        """
        return self._cache_dir

    def set_plugin_loader(self, plugin_loader: PluginLoader):
        """
        sets an instance that implements kioskabstractclasses.PluginLoader

        :param plugin_loader: a PluginLoader instance
        """
        self._plugin_loader = plugin_loader

    def set_type_repository(self, type_repository: TypeRepository):
        """
        sets an instance of TypeRepository
        :param type_repository: TypeRepository
        """
        self._type_repository = type_repository

    def set_event_manager(self, event_manager: EventManager):
        """
        sets an EventManager instance to be used as event manager
        :param event_manager:
        """
        self._event_manager = event_manager

    @staticmethod
    def get_thumbnail_types(config):
        """
        returns a dictionary of the representation types defined in config/file_repository/thumbnails

        :return:  {representation_label: representation_id} or {} if there are none
        """
        result = {}

        thumbnail_ids = config.file_repository["thumbnails"]
        for key in thumbnail_ids:
            try:
                result[config.file_repository["representations"][key]["label"]] = key
            except KeyError:
                result[key] = key
        return result

    @staticmethod
    def get_representation_type_details(config, representation_type):
        """
        returns the details of the representation type / thumbnail

        :return:  the exact keys and values from the config for the given representation type
        :exception: throws key error if representation type does not exist
        """
        return config.file_repository["representations"][representation_type]

    def add_contextual_file(self, path_and_filename: str, file: KioskContextualFile,
                            override=False, fire_events=True) -> bool:
        """ Adds / updates (and transfers) a single file to the file repository.

            The md5 hash of the file must not be the same as an existing md5 hash in the database.

            :param path_and_filename: path and filename of the file to be added
                                        as the file referred to by ContextualFile

            :param file: A KioskContextualFile object with these attributes already set:
                         description, context information, modified_by, ts_file, tags,
                         and of course it must have a valid uid.

            :param override: optional. If set an existing file will be replaced.
                             Otherwise the method will fail if there is already a file.

            :param fire_events: optional. If explicitly turned off no event manager events will be fired.
                                This is rather for testing purposes.

            :return: True or False


        """
        logging.info("trying to add file " + path_and_filename + " to repository.")
        try:
            dst_path_and_filename = file.upload(path_and_filename, push_contexts=True, override=override)
            if dst_path_and_filename:
                if self._event_manager and fire_events:
                    try:
                        self._event_manager.fire_event("filerepository", "after_add_file_to_repository",
                                                       file.uid,
                                                       dst_path_and_filename
                                                       )
                    except Exception as e:
                        logging.warning(f"FileRepository.add_contextual_file got an exception when firing "
                                        f"after_add_file_repository: {repr(e)}")
            return dst_path_and_filename
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.add_contextual_file: Exception {repr(e)}.")

    def get_file_repository_filename(self, uid) -> str:
        """
        returns the path to the original file addressed by uid
        :param uid:
        :return: the path or ""
        """
        try:
            ctx_file = self.get_contextual_file(uid)
            return ctx_file.get()
        except:
            pass
        return ""

    def get_file_field_tables(self):
        return self.dsd.list_file_fields()

    def get_files_with_tags(self, tags: [], operator: str) -> [str]:
        """
        returns a list of files, represented by their uids, that have or don't have any of the given tags

        :param tags: a list of tags. [a,b], "=" will return files that have a or b
                                     [a,b], "<>" will return files that have neither a or b
        :param operator: currently ony "=" and "<>"
        :return: a list of file-uids
        :raises: Exception if tag list is empty or operator invalid.
        """
        if len(tags) == 0:
            raise Exception(f"{self.__class__.__name__}.get_files_with_tags: no tags given.")
        sql = "select " + f"""
        {KioskSQLDb.sql_safe_ident('uid')} 
        from {KioskSQLDb.sql_safe_ident(self.dsd.files_table)}"""

        sql_where = ""
        if operator == "=":
            for t in tags:
                if sql_where:
                    sql_where += " or "
                else:
                    sql_where = " where tags is not null and ("
                sql_where += f" \"tags\" ~* '.*{t}.*'"
            sql_where += ")"
        elif operator == "<>" or operator == "!=":
            for t in tags:
                if sql_where:
                    sql_where += " and "
                else:
                    sql_where = " where tags is null or ("
                sql_where += f" \"tags\" !~* '.*{t}.*'"
            sql_where += ")"

        else:
            raise Exception(f"{self.__class__.__name__}.get_files_with_tags: Undefined operator {operator}")

        cur = KioskSQLDb.execute_return_cursor(sql + sql_where)
        try:
            result = []
            r = cur.fetchone()
            while r:
                result.append(r["uid"])
                r = cur.fetchone()
        finally:
            cur.close()
        return result

    def get_files_by_date(self, operator: str, values: [datetime.datetime], date_field: str = "auto") -> [str]:
        """
        returns a list of file-uids of the files that match a certain date comparison

        :param operator: "<": a file applies if its date is before the first value
                         ">": a file applies if its date is after the first value
                         "within": a file applies if its date is >= the first value and >= the last value
                         "!within": a file applies if its date is before the first value or after the last value
        :param values: depending on the operator either one or two datetime.datetime dates
        :param date_field: must match a field name in the dsd for the files table.
                          if not set, "auto" will be used:
                           27.09.2021: If set to "auto",  "coalesce(file_datetime,modified)" will be used
        :except: throws exceptions
        """
        sql = "select " + f"""
        {KioskSQLDb.sql_safe_ident('uid')} 
        from {KioskSQLDb.sql_safe_ident(self.dsd.files_table)}"""
        if date_field == "auto":
            date_field = f"coalesce({KioskSQLDb.sql_safe_ident('file_datetime')}, {KioskSQLDb.sql_safe_ident('modified')})"
        else:
            date_field = KioskSQLDb.sql_safe_ident(date_field)
        sql_where = " where "
        if operator == "<":
            sql_where += f"{date_field} < {DatabaseDriver.date(values[0])}"
        elif operator == ">":
            date: datetime.datetime = values[0]
            date = date + datetime.timedelta(days=1)
            sql_where += f"{date_field} > {DatabaseDriver.date(date)}"
        elif operator == "within":
            date2: datetime.datetime = values[1]
            date2 = date2 + datetime.timedelta(days=1)
            sql_where += f"{date_field} >= {DatabaseDriver.date(values[0])} and " \
                         f"{date_field} <= {DatabaseDriver.date(date2)}"
        elif operator == "!within":
            date2: datetime.datetime = values[1]
            date2 = date2 + datetime.timedelta(days=1)
            sql_where += f"{date_field} < {DatabaseDriver.date(values[0])} or " \
                         f"{date_field} > {DatabaseDriver.date(date2)}"
        else:
            raise Exception(f"{self.__class__.__name__}.get_files_by_date: Undefined operator {operator}")

        sql = sql + sql_where
        cur = KioskSQLDb.execute_return_cursor(sql)
        try:
            result = []
            r = cur.fetchone()
            while r:
                result.append(r["uid"])
                r = cur.fetchone()
        finally:
            cur.close()
        return result

    def get_actual_file_references(self, uid, stop_after_one=False):
        """
        returns a list of tuples (table, field) with table and field referring to
        a database field that has the attribute UID_IMAGE.
        Only those (table/field) tuples are returned
        that have at least one record with the field referencing the given uid.

        :param uid: the uid of an image in the image table.
        :param stop_after_one: bool
        :return: as list of tuples (table, field)
        """
        references = []
        dsd = self.dsd
        file_fields = dsd.list_file_fields()
        for t in file_fields:
            for f in file_fields[t]:
                sql = "select count(*) as c from \"" + t + "\" "
                sql = sql + "where cast(" + f + " as varchar) ilike %s"
                sql = sql + ";"
                cur = KioskSQLDb.get_cursor()
                cur.execute(sql, [uid])
                r = cur.fetchone()
                c = 0
                if r:
                    c = r[0]
                cur.close()
                if c > 0:
                    references.append((t, f))
                    if stop_after_one:
                        break

        return references

    def replace_file_in_repository(self, uid, file_path_and_name, recording_user="sys"):
        """
        replaces a file in the file repository

        :param uid: the uid of the existing file
        :param file_path_and_name: the new file
        :return: true/false. In case of false the last_error of the file is in the second return
        """

        ctx_file = self.get_contextual_file(uid)
        if not ctx_file:
            logging.error(f"{self.__class__.__name__}.replace_file_in_repository: "
                          f"There is no entry with uid {uid} in the file repository. "
                          f"Replacing nothing is not possible. Use add...")
            return False

        current_filename = ctx_file.get()
        if not current_filename:
            logging.warning(f"{self.__class__.__name__}.replace_file_in_repository: No file to replace "
                            f"for uid {uid}. The new file will be accepted, anyhow.")
        ctx_file.ts_file = None
        ctx_file.modified = None
        ctx_file.modified_by = recording_user
        rc = ctx_file.upload(file_path_and_name, override=True)
        return rc, ctx_file.last_error

    def delete_file_from_repository(self, uid, clear_referencing_records=False, commit=False):
        """
            removes a record and its file from the repository. If there is only a record but no file,
            the file will be removed with a warning.
            If the file's record is still referenced by any of the tables in the dsd that have a file-field,
            the process will fail unless clear_referencing_records is set to True.

            23.Feb19: After deletion the uid of the file is added in repl_deleted_uids.
            09.May19: New version with new file management.

        :param commit:  If commit is set to false, the caller needs to commit KioskSQLDb
        :param uid: the file's uid
        :param clear_referencing_records: True if all the fields in all the tables that reference the
                                          image should be set to None
        :return: False if an error occurred
                 -1 if the file's record is still referenced by any other table
                 True if file and record are removed.
        """

        def clear_image_reference(table, field, _uid):
            logging.debug(f"{self.__class__.__name__}.clear_image_reference: "
                          f"Clearing image field {table}.{field}  for image {_uid}")
            KioskSQLDb.execute("update \"{}\" set \"{}\"=null where \"{}\"=%s".format(table, field, field), [_uid])

        #
        # end clear_image_reference
        # ****************************************************************

        # start of main method
        rc = True
        ctx_file = self.get_contextual_file(uid)
        if not ctx_file:
            logging.error(f"{self.__class__.__name__}.delete_file_from_repository: File with uid {uid} does not exist.")
            return False

        ref = self.get_actual_file_references(uid, stop_after_one=False)
        if ref:
            if not clear_referencing_records:
                logging.error(
                    f"{self.__class__.__name__}.delete_file_from_repository: File with uid {uid} "
                    f"cannot be deleted since it is still referenced by {ref}")
                return -1
            else:
                try:
                    for t in ref:
                        clear_image_reference(t[0], t[1], uid)
                    logging.debug(
                        f"{self.__class__.__name__}.delete_file_from_repository: References for file with uid {uid} "
                        f"deleted")
                except Exception as e:
                    logging.error("Exception in clear_image_reference: " + repr(e))
                    rc = False

        if rc:
            rc = False
            if not ctx_file.delete(commit=False):
                logging.error("delete_file_from_repository: record " + uid + " could not be deleted from images")
                try:
                    logging.debug("delete_file_from_repository: rollback of KioskSQLDb")
                    KioskSQLDb.rollback()
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.delete_file_from_repository: "
                                  f"Exception when rolling back: {repr(e)}")
            else:
                try:
                    if commit:
                        KioskSQLDb.commit()
                    rc = True
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.delete_file_from_repository: "
                                  f"Exception when rolling back: {repr(e)}")
        return rc

    def get_thumbnail(self, uid, representation_id):
        """
            returns the path and filename to the given thumbnail of file uid.

        :param uid: The file's uid
        :param representation_id:  the id of the representation
        :return: "" or None if there is no thumbnail, otherwise path and filename of the very one.
        """

        representation_type = KioskRepresentationType(representation_id)
        return self.get_contextual_file(uid).get(representation_type)

    def get_file_fields_with_description_fields(self):
        """
            returns a nested structure with table as the main-key, unveiling a dictionary with file-fields, pointing to
            their description field.
            A table is only in there if it actually has a file-field with a description. Accordingly, a field is only
            in the dictionary of a table if it actually has a description field.
        """
        result = {}
        fields = self.dsd.list_file_fields()
        for t, file_flds in fields.items():
            for file_fld in file_flds:
                try:
                    dsc_fields = self.dsd.get_description_field_for_file_field(t, file_fld)
                    if dsc_fields:
                        dsc_fld = self.dsd.get_description_field_for_file_field(t, file_fld)[0]
                        if t in result:
                            result[t].append((file_fld, dsc_fld))
                        else:
                            result[t] = [(file_fld, dsc_fld)]
                except Exception as e:
                    logging.error("Exception in get_file_fields_with_description_fields: " + repr(e))

        result["images"] = [("uid", "description"), ("uid", "export_filename")]
        return result

    @classmethod
    def get_repository_sub_dir_for_file(cls, repository_base_path, uid_filename: str):
        """
        returns the absolute path (including the sub directory) in which a file would be stored in the file repository.
        Does not check if such a file exists or anything of the sort.
        This does the same as get_repository_path_for_file except that it does not work
        with old_style repositories (which should not exist at all anymore).

        :param uid_filename: the filename of the file (uid as filename with file extension)
        :param repository_base_path: the base path of the file repository
        :return: the hypothetical path and filename
        """

        path = os.path.join(repository_base_path, uid_filename[:2])
        return path

    @classmethod
    def get_repository_filename_in_sub_dir(cls, repository_base_path: str, uid_filename: str, extension="") -> str:
        """
        returns path and filename for a file if it were stored in the file repository.
        Does not check if such a file exists or anything of the sort.
        Does the same thing as get_repository_path_for_file but without support for old_style repositories.

        :param uid_filename: uid as filename with file extension
        :param extension: adds (!) this extension to the file
                 (again: Does not check if something like it exists!)
        :param repository_base_path: the file repository's base path
        :return: the hypothetical path and filename
        """
        filename = uid_filename + "." + extension if extension else uid_filename
        return os.path.join(cls.get_repository_sub_dir_for_file(repository_base_path, uid_filename), filename)

    def get_repository_path_for_file(self, uid, old_style=False):
        """
        returns the path in which a file would be stored in the file repository.
        Does not check if such a file exists or anything of the sort.

        :param uid: unique identifier of the file
        :param old_style: deprecated: only use if files are expected in the file repository's base path
        :return: the hypothetical path and filename
        """
        if old_style:
            return self.get_path()

        path = os.path.join(self.get_path(), uid[:2])
        return path

    def get_repository_filename_and_path(self, uid, extension, old_style=False):
        """
        returns path and filename for a file if it were stored in the file repository.
        Does not check if such a file exists or anything of the sort.

        :param uid: unique identifier of the file
        :param old_style: deprecated: only use if files are expected in the file repository's base path
        :param extension: adds this extension to the file
                 (again: Does not check if something like it exists!)
        :return: the hypothetical path and filename
        """
        filename = uid + "." + extension if extension else uid
        return os.path.join(self.get_repository_path_for_file(uid, old_style=old_style), filename)

    def get_contextual_file(self, uid=None) -> KioskContextualFile:
        """
        Instantiates the KioskContextualFile class.
        :param uid: the uid. If given, an existing contextual file under that uid will be loaded, otherwise
                    a new one will be started. If uid is not given, a new uid is assigned.
        :return: a fully initialized KioskContextualFile class.
        """
        return KioskContextualFile(uid,
                                   cache_manager=self._cache_manager,
                                   file_repository=self,
                                   type_repository=self._type_repository,
                                   plugin_loader=self._plugin_loader)

    def do_housekeeping(self, console=False, progress_handler=None, housekeeping_tasks=[]):
        """
        convenience method that instantiates a Housekeeping object and calls do_housekeeping on it.
        :param console: see Housekeeping.__init__
        :param progress_handler: see Housekeeping.do_housekeepint()
        :param housekeeping_tasks: an array with the names of the tasks that housekeeping should do
        :return: number of files processed
        """
        import housekeeping
        housekeeping: housekeeping.Housekeeping = housekeeping.Housekeeping(self, console)
        return housekeeping.do_housekeeping(progress_handler=progress_handler, housekeeping_tasks=housekeeping_tasks,
                                            file_tasks_only=True)

    def move_files_to_subdirectories(self):
        """ moves files from the file repository's base dir to the appropriate subfolders
            This is only necessary when a kiosk with old style file repository is
            updated to new style
        """

        sql = f"""select uid, filename from {self.dsd.files_table};"""
        cur = KioskSQLDb.execute_return_cursor(sql)
        r = cur.fetchone()
        try:
            while r:
                uid = r["uid"]
                filename = r["filename"]
                extension = kioskstdlib.get_file_extension(filename)
                if not filename or not extension:
                    logging.error(f"{self.__class__.__name__}.move_files_to_subdirectories: "
                                  f"File {uid} has no filename or no extension: {filename}, {extension}")
                else:

                    path_and_filename = self.get_repository_filename_and_path(uid, extension=extension, old_style=True)
                    if os.path.isfile(path_and_filename):
                        new_path_and_filename = self.get_repository_filename_and_path(uid, extension=extension,
                                                                                      old_style=False)
                        path_only = self.get_repository_path_for_file(uid)
                        if not os.path.isdir(path_only):
                            os.mkdir(path_only)
                        if os.path.isdir(path_only):
                            try:
                                shutil.copyfile(path_and_filename, new_path_and_filename)
                                if os.path.isfile(new_path_and_filename):
                                    if path_and_filename != new_path_and_filename:
                                        try:
                                            os.remove(path_and_filename)
                                            logging.info(f"File {path_and_filename} moved to {new_path_and_filename}")
                                        except BaseException as e:
                                            logging.error(f"{self.__class__.__name__}.move_files_to_subdirectories: "
                                                          f"Error when removing file {path_and_filename}: {repr(e)}")
                                    else:
                                        logging.error(f"{self.__class__.__name__}.move_files_to_subdirectories: "
                                                      f"file {path_and_filename} and {new_path_and_filename} are equal?"
                                                      f"That should really not happen.")
                                else:
                                    logging.error(f"{self.__class__.__name__}.move_files_to_subdirectories: "
                                                  f"file {path_and_filename} was not copied to {new_path_and_filename}")
                            except BaseException as e:
                                logging.error(f"{self.__class__.__name__}.move_files_to_subdirectories: "
                                              f"Error when copying file {path_and_filename} to {new_path_and_filename}: "
                                              f"{repr(e)}")
                r = cur.fetchone()
        finally:
            cur.close()

    def export_filename_exists(self, filename: str) -> str:
        """
        returns the uid of the file that has the given "export_filename"
        :param filename: the export_filename
        :return: either the UID of the file or None
        """
        files_table = self.dsd.files_table
        r = KioskSQLDb.get_first_record(files_table, "export_filename", filename)
        if r:
            return r["uid"]
