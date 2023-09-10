import datetime
import logging
import os
import shutil
import uuid
from os.path import basename

from qualitycontrol.qualitycontrol import run_quality_control
import kioskstdlib
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from contextmanagement.identifiercache import IdentifierCache
from contextmanagement.localcontextlist import LocalContextList
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdconstants import *
from dsd.dsderrors import DSDJoinError
from fileidentifiercache import FileIdentifierCache
from kioskabstractclasses import PluginLoader
from kioskfilesmodel import KioskFilesModel
from kiosklogicalfile import KioskLogicalFile
from kiosksqldb import KioskSQLDb


class KioskContextualFile(KioskLogicalFile):
    def __init__(self, uid, cache_manager=None, file_repository=None,
                 type_repository=None, plugin_loader: PluginLoader = None, test_mode=False,
                 fic=None, dsd=None):

        # self.data = None
        # self.data: KioskFilesModel

        self.description = None
        self.export_filename = None
        self.modified_by = None
        self.modified = None
        self.modified: datetime.datetime
        self.ts_file = None
        self.ts_file: datetime.datetime
        self.image_proxy = None
        self._tags: list = []
        self._last_error = ""
        self._last_error_details = {}
        self._fic = fic  # file-identifier-cache
        self._contexts = LocalContextList(self._fetch_contexts)
        self._dsd = dsd if dsd else Dsd3Singleton.get_dsd3()
        # prevents the file_datetime to be set to now() when modifying an image record.
        # In General we don't want to set the file_datetime to the current date implicitly
        self.dont_set_file_datetime = True

        if not uid:
            uid = str(uuid.uuid4())

        super().__init__(uid,
                         cache_manager=cache_manager,
                         file_repository=file_repository,
                         type_repository=type_repository,
                         plugin_loader=plugin_loader,
                         test_mode=test_mode)

        self._load_from_record()

    @property
    def last_error(self):
        return self._last_error

    @property
    def last_error_details(self):
        return self._last_error_details

    @property
    def uid(self):
        return self._uid

    @property
    def contexts(self) -> LocalContextList:
        return self._contexts

    def set_tags(self, tags):
        """Here tags is a list of strings that will be added as tags in the tag-field of the image. Be aware that those
            tags will be stored in one field, comma separated but enclosed in double quotation marks!
            Replaces the current tag list entirely! """
        self._tags = tags

    def get_tags(self):
        """Here tags is a list of strings that will be added as tags in the tag-field of the image. Be aware that those
            tags will be stored in one field, comma separated but enclosed in double quotation marks!"""
        return self._tags

    @staticmethod
    def get_tags_from_csv(csv):
        if csv:
            return [x.strip().strip('"').strip() for x in csv.split(",")]
        return []

    def get_csv_tags(self):
        """
        returns the tags as a comma separated value string.
        Every tag is wrapped in double quotes.
        09.XII.2019: Trailing or Leading spaces around the tag will be discarded.
        """
        tag_string = None
        if self._tags:
            tag_string = ""
            comma = ""
            for tag in self._tags:
                tag_string += comma + "\"" + tag.strip() + "\""
                comma = ","

        return tag_string

    def _get_uid_from_hash(self, md5_hash=None, path_and_filename=None):
        """
        returns the uid of the file in the file repository that results in the given md5 hash or None.
        :param md5_hash: optional. Only used, if path_and_filename is not given.
        :param path_and_filename: optional. If not given, md5_hash is expected.
        :return: uid of the file or None.
        :exception: raises an Exceptions if something goes wrong.
        """
        if not md5_hash and not path_and_filename:
            raise AttributeError("KioskContextualFile._get_uid_from_hash: hash or path_and_filename needed.")

        if path_and_filename:
            md5_hash = kioskstdlib.get_file_hash(path_and_filename)
            if not md5_hash:
                raise Exception(f"No hash could be computed for file {path_and_filename}")

        kfm = KioskFilesModel()
        if kfm.get_one("md5_hash=%s", [md5_hash]):
            return str(kfm.uid)
        else:
            return None

    def _load_from_record(self, r=None):
        if not r:
            r = self._get_file_record()
        else:
            self._file_record = r

        if self._file_record:
            self._record_to_data()

    def _record_to_data(self):
        self.modified = self._file_record.modified
        self.modified_by = self._file_record.modified_by
        self._tags = self.get_tags_from_csv(self._file_record.tags)
        self.description = self._file_record.description
        self.export_filename = self._file_record.export_filename
        self.ts_file = self._file_record.file_datetime
        self.image_proxy = self._file_record.img_proxy

    def _data_to_record(self, md5_hash,
                        r: KioskFilesModel, set_modified=True):
        if set_modified:
            r.modified = datetime.datetime.now() if not self.modified else self.modified
            r.modified_by = "sys" if not self.modified_by else self.modified_by
            self.modified_by = r.modified_by
        else:
            r.modified = self.modified
            r.modified_by = self.modified_by
            r.file_datetime = self.ts_file
            r.img_proxy = self.image_proxy

        if self.dont_set_file_datetime:
            r.file_datetime = self.ts_file
        else:
            r.file_datetime = datetime.datetime.now() if not self.ts_file else self.ts_file
        r.md5_hash = md5_hash
        r.tags = self.get_csv_tags()
        r.description = self.description
        r.export_filename = self.export_filename
        r.uid = self._uid

    def file_hash_exists(self, src_path_and_filename: str) -> bool:
        """
        Checks if there is already a hash in the files table that is similar to the given file's hash.

        :param src_path_and_filename: str
        :return: boolean
        :exception: can raise Exceptions, raises an Exception if no hash can be created for the given file.
        """
        md5_hash = kioskstdlib.get_file_hash(src_path_and_filename)
        if md5_hash:
            uid_hash = self._get_uid_from_hash(md5_hash=md5_hash)
            logging.debug(f"{self.__class__.__name__}.file_hash_exists : "
                          f"_get_uid_from_hash returned {uid_hash}, {md5_hash}")
            if uid_hash:
                return True
            else:
                return False
        else:
            raise Exception(f"{self.__class__.__name__}.file_hash_exists: "
                            f"Can't create a hash for file {src_path_and_filename}")


    def upload(self, src_path_and_filename: str,
               override: bool = False,
               backup_old: bool = True,
               no_auto_representations=False,
               commit=True,
               keep_image_data=False,
               push_contexts=False):
        """
        uploads a file from outside of the file repository
        into the file repository under the uid set at __init__.

        Can be used to add a new file or to upload a new version of an existing file.

        Sets proxy value and modified timestamps only if not given, e.G. when
        a contextual file is being created for the first time.

        Which means it is a caller's responsibility to set those attributes
        when a file is updated.

        modified_by has to be set by the caller always if it should be updated.

        The created timestamp is set automatically.

        if a file with the same hash already exists, this returns "None" and last_error will be set to
        "Duplicate". The uid of the existing file is stored in last_error_details["uid_existing_file"]

        :param src_path_and_filename: the file to upload
        :param override: Optional. Set to True if an existing file should be replaced
        :param backup_old: Optional. Set to False if an existing file should not be saved before replacing it.
        :param no_auto_representations: optional and rather for testing: does not create auto representations
                                        after uploading a new or updated file.
        :param keep_image_data: set to True if the current record for this file already contains the most recent data.
                                Otherwise the image-proxy field will be changed!
        :param push_contexts: if set, successfully pushing the contexts is part of an upload or otherwise makes it fail.
        :param commit: set to False if this runs within a larger transaction


        :return: path and filename of the file in the file repository or None, if an error occurred.
                 If the result is none, the property "last_error" is set to one of these strings:
                 "Unknown identifier", "Duplicate", "Exception"

        todo: It is long. Can it be refactored?
        """

        if not os.path.isfile(src_path_and_filename):
            logging.error(f"{self.__class__.__name__}.upload : File {src_path_and_filename} not found.")
            return None

        current_file = self.get()
        if current_file and not override:
            logging.error(f"{self.__class__.__name__}.upload : File with uid {self._uid} already in file repository."
                          f"Override parameter not set.")
            return None

        md5_hash = kioskstdlib.get_file_hash(src_path_and_filename)
        if md5_hash:
            uid_hash = self._get_uid_from_hash(md5_hash=md5_hash)
            logging.debug(f"{self.__class__.__name__}.upload : _get_uid_from_hash returned {uid_hash}, {md5_hash}")
            if uid_hash:
                if uid_hash != self._uid:
                    self._last_error = "Duplicate"
                    self._last_error_details = {
                        "uid_existing_file": uid_hash,
                    }
                    logging.error(f"{self.__class__.__name__}.upload: "
                                  f"The repository file \"{uid_hash}\" is identical to the import"
                                  f" candidate {src_path_and_filename}. It is not allowed to import a duplicate.")
                    logging.error(f"{self.__class__.__name__}.upload: "
                                  f"md5 hash is {md5_hash}")
                    return None
        else:
            logging.warning(f"KioskContextualFile.upload: md5 hash could not be created for {src_path_and_filename}")

        ext = kioskstdlib.get_file_extension(src_path_and_filename)

        dst_path_and_filename = self._file_repository.get_repository_filename_and_path(self._uid, ext)
        dst_filename = kioskstdlib.get_filename(dst_path_and_filename)
        r: KioskFilesModel = self._get_file_record()
        is_new = False
        if not r:
            r = KioskFilesModel()
            r.created = datetime.datetime.now()
            is_new = True

        try:
            # todo: refactor. This is done by set_filename
            r.filename = dst_filename
            if not keep_image_data:
                r.img_proxy = datetime.datetime.now()

            self._data_to_record(md5_hash, r)
            if is_new:
                r.add()
            else:
                r.update()
            if push_contexts:
                if not self.push_contexts(commit_on_change=False):
                    if not self._last_error:
                        self._last_error = "Unknown identifier"
                    raise Exception("push_contexts failed.")
        except BaseException as e:
            if not self._last_error:
                self._last_error = "Exception"
            logging.error(f"{self.__class__.__name__}.upload() : Exception "
                          f"when adding or updating {self._uid}: {repr(e)}")
            if commit:
                logging.error(f"{self.__class__.__name__}.upload: rollback 1")
                KioskSQLDb.rollback()
            return None

        try:
            if current_file:
                if backup_old:
                    if not self._archive_file():
                        raise Exception("The current file could not be archived, so replacing it would not be safe.")
                try:
                    # that's necessary because the file could have a different extension than the new one
                    os.remove(current_file)
                except FileNotFoundError as e:
                    pass
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.upload: Error deleting old file {current_file}: {repr(e)}")
                    raise e

            directory = kioskstdlib.get_file_path(dst_path_and_filename)
            if not os.path.isdir(directory):
                os.mkdir(directory)
            try:
                shutil.copyfile(src_path_and_filename, dst_path_and_filename)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.upload: Error when copying {src_path_and_filename} "
                              f"to {dst_path_and_filename}: {repr(e)}")
                raise e

            self._file_repository_file = ""
            self._load_from_record()
            self.invalidate_cache()
            if commit:
                KioskSQLDb.commit()
            if not no_auto_representations:
                if not self.create_auto_representations():
                    if self._test_mode:
                        logging.error(f"{self.__class__.__name__}.upload: Test mode error. "
                                      f"Representation could not be created!")
                        if commit:
                            KioskSQLDb.commit()
                        return None
            if commit:
                KioskSQLDb.commit()
            if self._fic:
                self._fic.update_file(self.uid, commit=commit)
            return dst_path_and_filename

        except BaseException as e:
            self._last_error = "Exception"
            logging.error(f"{self.__class__.__name__}.upload : "
                          f"Copying {src_path_and_filename} to {dst_path_and_filename}"
                          f"caused Exception {repr(e)}")
            if commit:
                logging.error(f"{self.__class__.__name__}.upload: rollback 2")
                KioskSQLDb.rollback()

        return None

    def _archive_file(self):
        """
           archives the current main file to the history directory,
           but does not delete it at the source.
           :return returns True if the process was successful or the file did not exist.
                    In case of an exception False is returned

        """
        current_file = ""
        try:
            current_file = self.get()
            if os.path.exists(current_file):
                backup_directory = self._file_repository.get_history_path()
                backup_file = kioskstdlib.get_valid_filename(f"{datetime.datetime.now()}_{basename(current_file)}")
                shutil.copyfile(current_file, os.path.join(backup_directory, backup_file))
                logging.debug(f"{self.__class__.__name__}._archive_file : file {current_file} "
                              f"saved as {os.path.join(backup_directory, backup_file)}")
            else:
                logging.warning(f"{self.__class__.__name__}._archive_file: file {current_file} could not be archived"
                                f"because it does not exist.")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._archive_file: file {current_file} "
                          f"could not be archived: {repr(e)}")
        return False

    def update(self, commit=True, set_modified=True):
        """
        updates a file record without uploading a file. Does not process contexts changes, currently.
        :param commit: If set to False, no commit will be triggered. Otherwise a general commit will be done.
        :param set_modified: If set to False, the modified timestamp will NOT be actualized.
                             Otherwise that's standard for update. BUT NOT FOR UPLOAD!

        :return: True / False. Can throw exceptions.
        """
        r: KioskFilesModel = self._get_file_record()
        if not r:
            logging.error(f"{self.__class__.__name__}.update: no record loaded.")
            return False

        if set_modified:
            self.modified = None  # to be consistent it will be set in _data_to_record
        self._data_to_record(r.md5_hash, r, set_modified=set_modified)
        if r.update():
            if commit:
                KioskSQLDb.commit()
            return True
        else:
            logging.error(f"{self.__class__.__name__}.update(): r.update failed.")

        return False

    def ensure_md5_hash(self, commit: bool = True) -> bool:
        """
        checks if a file has a md5 hash and tries to create one if it is not the case.
        Note that if save is False, a subsequent call to update() will drop the calculated hash again!

        :param commit: if set to True, a commit will be executed.

        """
        if not self._file_record:
            self._load_from_record()
        if self._file_record:
            if self._file_record.md5_hash:
                return True

            logging.debug(f"{self.__class__.__name__}.ensure_md5_hash: updating hash for {self.uid}")
            filepath_and_name = self.get()
            if filepath_and_name:
                file_hash = kioskstdlib.get_file_hash(filepath_and_name)
                if file_hash:
                    self._file_record: KioskFilesModel
                    self._file_record.md5_hash = file_hash
                    savepoint = "ensure_md5_hash"
                    KioskSQLDb.begin_savepoint(savepoint)
                    try:
                        if self._file_record.update():
                            KioskSQLDb.commit_savepoint(savepoint)
                            if commit:
                                KioskSQLDb.commit()
                                self._load_from_record()
                                if not self._file_record.md5_hash:
                                    logging.error(f"{self.__class__.__name__}.ensure_md5_hash: "
                                                  f"hash for {self.uid} was not saved")
                            return True
                        else:
                            logging.error(f"{self.__class__.__name__}.ensure_md5_hash: _file_record.update failed.")
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.ensure_md5_hash: Exception {repr(e)}")

                    try:
                        logging.error(f"{self.__class__.__name__}.ensure_md5_hash(): rollback to savepoint")
                        KioskSQLDb.rollback_savepoint(savepoint)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.ensure_md5_hash: rollback failed: {repr(e)}")
                    self._load_from_record()
                else:
                    logging.error(f"{self.__class__.__name__}.ensure_md5_hash: "
                                  f"{filepath_and_name} could not be hashed.")
            else:
                logging.error(f"{self.__class__.__name__}.ensure_md5_hash: no file for {self.uid}.")
        else:
            logging.error(f"{self.__class__.__name__}.ensure_md5_hash: data for {self.uid} cannot be queried.")

        return False

    def ensure_file_attributes(self, commit: bool = True) -> bool:
        """
        makes sure that a file has proper file attributes stored.
        :return: False if the file attributes are not available and could not be ascertained.
        """
        if not self._file_record:
            self._load_from_record()
        if self._file_record:
            savepoint = "ensure_file_attributes"
            try:
                KioskSQLDb.begin_savepoint(savepoint)
                if self.get_file_attributes(force_it=True):
                    KioskSQLDb.commit_savepoint(savepoint)
                    if commit:
                        KioskSQLDb.commit()
                    return True
                else:
                    logging.error(f"{self.__class__.__name__}.ensure_file_attributes: get_file_attributes failed.")
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.ensure_file_attributes: Exception {repr(e)}")

            try:
                logging.debug(f"{self.__class__.__name__}.ensure_file_attributes(): rollback to savepoint")
                KioskSQLDb.rollback_savepoint(savepoint)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.ensure_file_attributes: rollback failed: {repr(e)}")

            self._load_from_record()

        return False

    def add_tag(self, tag: str, save: bool = False):
        """
        adds a tag to the file tags if it does not already exist
        :param tag: str
        :param save: if set to True the change will be saved immediately by a call to update()
        """
        tag = tag.strip()
        if not tag:
            return

        if not self._file_record:
            self._load_from_record()
        if tag not in self._tags:
            self._tags.append(tag)
            if save:
                self.update()

    def drop_tag(self, tag: str, save: bool = False):
        """
        drops a tag from the file tags if it does exist
        :param tag: str
        :param save: if set to True the change will be saved immediately by a call to update()
        """
        if not self._file_record:
            self._load_from_record()
        if tag in self._tags:
            self._tags.remove(tag)
            if save:
                self.update()

    def has_tag(self, tag: str):
        """
        checks if the file is tagged with a certain tag
        :param tag: str
        :returns: boolean
        """
        return tag in self._tags


    def delete(self, no_history=False, commit=True) -> bool:
        """
        deletes the file and all its representations. Physically and logically!
        :param commit: leaves the commit to the caller if False
        :param no_history: if set to True, the file will not be moved to the history directory
        :return: bool
        """

        if not no_history:
            if not self._archive_file():
                logging.error(f"{self.__class__.__name__}.delete: File not archived: deletion aborted.")
                return False
        rc = super().delete(commit)
        return rc

    def _fetch_contexts(self):
        """
        fetches the currently stored contexts for the file. Always overrides the current _context attribute!
        """
        if not self._fic:
            self._fic = FileIdentifierCache(self._dsd)
        try:
            rc = self._fic.get_contexts_for_file(self._uid)
            return rc
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._fetch_contexts: "
                          f"error in FileIdentifierCache.get_contexts_for_file: {repr(e)}")
            raise e

    def push_contexts(self, commit_on_change=False):
        """
        pushes the change in contexts to the database.
        :param commit_on_change: if set the method issues commits and rollbacks
        :return: True if successful, False if not
        """
        # add file to new contexts
        changed = False
        cur = KioskSQLDb.get_dict_cursor()
        last_identifier = ""
        try:
            idc = MemoryIdentifierCache(self._dsd)

            for ctx in self._contexts.get_added_contexts():
                changed = True
                last_identifier = ctx[0]
                if not self._push_context(ctx, cur):
                    raise Exception(f"call to _push_context failed with context {last_identifier}")

            for ctx in self._contexts.get_dropped_contexts():
                changed = True
                self._drop_context(ctx, cur)

            cur.close()
            if commit_on_change and changed:
                KioskSQLDb.commit()
            if changed:
                self._fic.update_file(self.uid, commit=commit_on_change)

            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.push_contexts: Exception when pushing {last_identifier}: "
                          f"{repr(e)}")
            self._last_error = repr(e)

            try:
                cur.close()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.push_contexts: Exception when closing cursor: {repr(e)}")
            try:
                if commit_on_change and changed:
                    KioskSQLDb.rollback()
            except:
                pass

        return False

    def _push_context(self, ctx: tuple, cur, use_idc: IdentifierCache = None) -> bool:
        """
        adds a file to the context and record type.
        :param ctx: a tuple consisting of the context identifier and file_location.
                    if a file location is given the file will be added to
                    that specific record type (=table).
                    if not given (set to "") or None the default record type for the identifier will be used
        :param cur: an open dict-cursor
        :return: True/False, can throw Exceptions
        """
        identifier: str = ctx[0]
        file_location: str = ctx[1]

        result = self._get_file_location_and_uuid(identifier, file_location, use_idc=use_idc)
        if not result:
            logging.error(f"{self.__class__.__name__}._push_context: Cannot acquire (default) file location for "
                          f" identifier {identifier}")
            return False

        file_location, file_location_field, identifier_table, identifier_uuid = result

        # check if the table we are about to insert into isn't a table with identifiers.
        # e.G. site does have an image field but that image cannot be added without more information
        if len(self._dsd.list_identifier_fields(file_location)) > 0:
            logging.error(f"{self.__class__.__name__}._push_context: default file location {file_location}"
                          f" has itself identifiers: context cannot be pushed.")
            return False

        # ok, we can create the sql
        sql, params = self._get_insert_context_sql(file_location, file_location_field,
                                                   identifier_uuid, identifier_table)
        if not sql:
            return False

        cur.execute(sql, params)
        if cur.rowcount == 1:
            try:
                # todo: This works only for trigger "rtl" currently. In future the trigger needs to
                #       be set somewhere in the dsd or so.
                run_quality_control(identifier_uuid)
                logging.debug(f"{self.__class__.__name__}._push_context: QC ran for "
                              f"identifier {identifier_table}/{identifier_uuid}.")
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._push_context: Exception when running quality control "
                                f"for identifier {identifier_table}/{identifier_uuid}: {repr(e)}")
            logging.debug(f"{self.__class__.__name__}.push_context: file {self.uid} "
                          f"pushed to context {identifier}, record-type {identifier_table}, "
                          f"file_location{file_location}")
            return True
        else:
            return False

    def _get_insert_context_sql(self, file_location: str, file_location_field: str,
                                identifier_uuid: str, identifier_table: str):
        """
        returns the sql string that inserts a new record into a file location
        :param file_location: the table where the file ist stored
        :param file_location_field: the field that holds the file's uuid
        :param identifier_uuid: the uuid of the record that holds the identifier field
        :param identifier_table: the table that holds the identifier
        :return: a tuple consisting of the sql and a list of values. In case a DSDJoinError the sql string is empty.
                 other Exceptions are thrown.
        """
        # let's get the join fields first. If that fails the presumably because
        # the two tables are not DIRECTLY connected, which is necessary (otherwise more than a record in the
        # target table would have to be created!

        try:
            join = self._dsd.get_default_join(identifier_table, file_location)
        except DSDJoinError as e:
            logging.error(f"{self.__class__.__name__}._get_insert_context_sql: {repr(e)}")
            logging.error(f"{self.__class__.__name__}._get_insert_context_sql: Presumably the table "
                          f"{identifier_table} and {file_location} are not joined directly in the dsd.")
            return "", []

        created_field = KioskSQLDb.sql_safe_ident(
            self._dsd.get_fields_with_instruction(file_location, KEY_INSTRUCTION_REPLFIELD_CREATED)[0])
        modified_field = KioskSQLDb.sql_safe_ident(
            self._dsd.get_fields_with_instruction(file_location, KEY_INSTRUCTION_REPLFIELD_MODIFIED)[0])
        modified_by_field = KioskSQLDb.sql_safe_ident(
            self._dsd.get_fields_with_instruction(file_location, KEY_INSTRUCTION_REPLFIELD_MODIFIED_BY)[0])

        sql = f"insert " + f"into {KioskSQLDb.sql_safe_ident(file_location)} "
        sql += "(" + \
               ",".join([KioskSQLDb.sql_safe_ident(file_location_field),
                         created_field, modified_field, modified_by_field,
                         KioskSQLDb.sql_safe_ident(join.related_field)]) + \
               ")"
        sql += f" values(%s,%s,%s,%s,%s)"
        values = [self.uid, datetime.datetime.now(), datetime.datetime.now(),
                  self.modified_by if self.modified_by else "sys", identifier_uuid]
        return sql, values

    def _drop_context(self, ctx, cur, use_idc: IdentifierCache = None) -> bool:
        """
        unassignes an image from a record type
        :param ctx:
        :param cur:
        returns True or False but might also throw an Exception
        """
        identifier: str = ctx[0]
        file_location: str = ctx[1]
        idc: IdentifierCache
        if use_idc:
            idc = use_idc
        else:
            idc = MemoryIdentifierCache(self._dsd)

        contexts = idc.get_recording_contexts(identifier)
        context = None
        file_location_field = None
        for ctx in contexts:
            assigned_file_locations = self._dsd.get_assigned_file_locations(ctx[0])
            for assigned_file_location in assigned_file_locations:
                if file_location == assigned_file_location[0]:
                    context = ctx
                    file_location_field = assigned_file_location[1]
                    break

        if not context or not file_location_field:
            logging.error(f"{self.__class__.__name__}._drop_context: context identifier "
                          f"{identifier} not properly connected to file location {file_location}. There might be a "
                          f"file_assigned_to dsd instruction missing")
            raise Exception(f"context identifier {identifier} not connected to file location {file_location}")

        identifier_uuid = context[3]
        identifier_table = context[0]
        sql, params = self._get_detach_from_context_sql(file_location=file_location,
                                                        file_location_field=file_location_field,
                                                        identifier_uuid=identifier_uuid,
                                                        identifier_table=identifier_table)

        if not sql:
            return False

        cur.execute(sql, params)
        if cur.rowcount == 1:
            try:
                # todo: This works only for trigger "rtl" currently. In future the trigger needs to
                #       be set somewhere in the dsd or so.
                run_quality_control(identifier_uuid)
                logging.debug(f"{self.__class__.__name__}._drop_context: QC ran for "
                              f"identifier {identifier_table}/{identifier_uuid}.")
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._push_context: Exception when running quality control "
                                f"for identifier {identifier_table}/{identifier_uuid}: {repr(e)}")
            logging.debug(f"{self.__class__.__name__}._drop_context: file {self.uid} "
                          f"detached from context {identifier}, "
                          f"record-type {context[0]}, "
                          f"file_location{file_location}")
            return True
        else:
            logging.error(f"{self.__class__.__name__}._drop_context: file {self.uid} "
                          f"was NOT detached from context {identifier}, "
                          f"record-type {context[0]}, "
                          f"file_location{file_location}")

        return False

    def _get_detach_from_context_sql(self, file_location: str, file_location_field: str,
                                     identifier_uuid: str, identifier_table: str):
        """
        returns the sql string that detaches a file from the default file location of an identifier
        :param file_location: the table where the file ist stored
        :param file_location_field: the field that holds the file's uuid
        :param identifier_uuid: the uuid of the record that holds the identifier field
        :param identifier_table: the table that holds the identifier
        :return: a tuple consisting of the sql and a list of values. In case a DSDJoinError the sql string is empty.
                 other Exceptions are thrown.
        """
        # let's get the join fields first. If that fails the presumably because
        # the two tables are no directly connected
        try:
            join = self._dsd.get_default_join(identifier_table, file_location)
        except DSDJoinError as e:
            logging.error(f"{self.__class__.__name__}._get_detach_from_context_sql: {repr(e)}")
            logging.error(f"{self.__class__.__name__}._get_detach_from_context_sql: Presumably the table "
                          f"{identifier_table} and {file_location} are not joined correctly in the dsd.")
            return "", []

        modified_field = KioskSQLDb.sql_safe_ident(
            self._dsd.get_fields_with_instruction(file_location, KEY_INSTRUCTION_REPLFIELD_MODIFIED)[0])
        modified_by_field = KioskSQLDb.sql_safe_ident(
            self._dsd.get_fields_with_instruction(file_location, KEY_INSTRUCTION_REPLFIELD_MODIFIED_BY)[0])

        sql = f"update " + f"{KioskSQLDb.sql_safe_ident(file_location)} "
        sql += f"set {KioskSQLDb.sql_safe_ident(file_location_field)}=null, " \
               f"{modified_field}=%s, {modified_by_field}=%s " \
               f"where {KioskSQLDb.sql_safe_ident(join.related_field)}=%s and " \
               f"{KioskSQLDb.sql_safe_ident(file_location_field)}=%s"
        values = [datetime.datetime.now(), self.modified_by, identifier_uuid, self.uid]
        return sql, values

    def _get_file_location_and_uuid(self, identifier: str, required_record_type: str = "",
                                    use_idc: IdentifierCache = None) -> tuple:
        """
        acquires the default record type for the given context identifier
        and the uuid of the identifier's record.
        Note that this can return a file location that itself has an identifier field.

        :param identifier: the identifier
        :param required_record_type: if given the identifier must exist in this record type.
                            So expected here is not the record type of the file but of the record type!
                            If not given and the identifier is only in one record type, that one is used,
                            if not given and the identifier is in more than one record type, an Exception is thrown
        :return: a 4-tuple: (default file location (a table), the uid_field-field in that table,
                             the record type of the identifier, the uuid of the identifier)
                 or an empty tuple if no default record type can be found
        :exception KeyError: KeyError is thrown if identifier is not valid
        """
        idc: IdentifierCache
        if use_idc:
            idc = use_idc
        else:
            idc = MemoryIdentifierCache(self._dsd)

        if not idc.has_identifier(identifier):
            raise KeyError(f"{self.__class__.__name__}._get_file_location_and_uuid: "
                           f"{identifier} is not a known identifier")

        record_types = [x[0] for x in idc.get_recording_contexts(identifier)]

        # remove all identifiers that do not have a default file location.
        for rt in list(record_types):
            default_location = self._dsd.get_default_file_location_for(rt)
            if not default_location:
                # noinspection PyBroadException
                try:
                    record_types.remove(rt)
                except Exception as e:
                    pass

        if required_record_type:
            if required_record_type not in record_types:
                raise KeyError(f"{self.__class__.__name__}._get_file_location_and_uuid: "
                               f"{identifier} does not belong to required record type {required_record_type} or "
                               f"{required_record_type} is not "
                               f"assigned a default file location in the dsd.")
            else:
                record_type = required_record_type
        else:
            if len(record_types) == 0:
                logging.info(f"{self.__class__.__name__}._get_file_location_and_uuid: "
                             f"{identifier} exists but has no default file location. No joint "
                             f"record type offers a default file location for it.")
                return tuple()

            if len(record_types) > 1:
                raise Exception(f"{self.__class__.__name__}._get_file_location_and_uuid: "
                                f"{identifier} belongs to more than one record type: {record_types}.")
            record_type = record_types[0]

        # at this point record_type is the record type of the given identifier
        # and it does have a default file location.
        identifier_uuid = [x[3] for x in idc.get_recording_contexts(identifier) if x[0] == record_type]

        default_location = self._dsd.get_default_file_location_for(record_type)
        if default_location:
            return default_location[0], default_location[1], record_type, identifier_uuid[0]
        else:
            return tuple()

    def get_descriptive_filename(self, file_extension=None):
        """
        get the most humane filename possible for a file. It is either a list of
        context identifiers with the description, or only the description or
        the ugly uid.
        29.IV.2022: If the file has the export_filename attribute that sets the filename
        :param file_extension: if set, the filename will have this file extension instead of the default extension
        :return: a filename that actually tells a user something about the file.
        """
        if not file_extension:
            file_extension = kioskstdlib.get_file_extension(self._get_path_and_filename())

        contexts = ";".join([x[0] for x in self._contexts.get_contexts()])
        dest_filename = ""

        if self.export_filename:
            dest_filename = self.export_filename
        else:
            if contexts:
                dest_filename = contexts

            if self.description:
                if dest_filename:
                    dest_filename = ";".join([dest_filename, self.description])
                else:
                    dest_filename = self.description

        if not dest_filename:
            dest_filename = self.uid

        dest_filename = kioskstdlib.get_valid_filename(
            f"{dest_filename}.{file_extension}")

        return dest_filename
