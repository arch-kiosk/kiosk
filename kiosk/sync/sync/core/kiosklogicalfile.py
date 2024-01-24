import os
import logging

import kioskstdlib
from kioskabstractclasses import PluginLoader
from kioskphysicalfile import KioskPhysicalFile
from kioskphysicalfilefactory import KioskPhysicalFileFactory
from kioskstdlib import get_first_matching_file, check_uuid
from kiosksqldb import KioskSQLDb

from kioskrepresentationtype import KioskRepresentationType, KioskRepresentations
from kioskfilecache import KioskFileCache
from kioskfilesmodel import KioskFilesModel

# import filerepository

FILES_TABLE_NAME = "images"


class KioskLogicalFile:
    def __init__(self, uid, session_deprecated=None, cache_manager=None, file_repository=None,
                 type_repository=None, plugin_loader=None, test_mode=False):

        if session_deprecated is not None:
            raise DeprecationWarning("call to KioskLogicalFile.__init__ with a sqlalchemy session.")

        if not check_uuid(uid, accept_filemaker_too=True):
            raise Exception(
                f"KioskLogicalFile.__init__: {uid} is not a valid UUID V4.")

        self._uid = uid.lower()
        self._cache_manager: KioskFileCache = cache_manager
        # noinspection PyTypeChecker
        self._file_record: KioskFilesModel = None
        self._type_repository = type_repository
        # self._file_repository: filerepository.FileRepository = file_repository
        self._file_repository = file_repository
        self._file_repository_file = ""
        self._plugin_loader: PluginLoader = plugin_loader
        self._test_mode = test_mode

    @classmethod
    def get_image_count(cls, sqlalchemy_session=None):
        if sqlalchemy_session is not None:
            raise DeprecationWarning("call to kiosklogicalfile.get_image_count with sqlachemy_session deprecated")
        rows = KioskFilesModel().count()
        return rows

    def _get_file_record(self) -> KioskFilesModel:
        kfm = KioskFilesModel(uid=self._uid)
        if kfm.get_by_key():
            self._file_record = kfm
        else:
            self._file_record = None

        return self._file_record

    def _record_exists(self):
        if not self._file_record:
            self._get_file_record()
        return self._file_record

    def file_exists(self):
        filename = self._get_path_and_filename()
        return os.path.isfile(filename)

    def _get_representation_from_cache(self, representation_type, renew=False):
        if self._cache_manager:
            return self._cache_manager.get(self._uid, representation_type, renew)

        return None

    def _get_path_and_filename(self):
        """
        returns the path and filename for a file in the file repository
        :return: path and filename
        """

        if not self._file_repository_file:
            if self._record_exists():
                record: KioskFilesModel = self._file_record
                repository_path = self._file_repository.get_repository_path_for_file(self._uid)
                if repository_path and record and record.filename:
                    self._file_repository_file = os.path.join(repository_path, record.filename)

        return self._file_repository_file

    def _conclude_filename_from_filerepository(self):
        repository_path = self._file_repository.get_repository_path_for_file(self._uid)
        filename = get_first_matching_file(repository_path, self._uid)
        if repository_path and filename:
            self._file_repository_file = os.path.join(repository_path, filename)
        else:
            repository_path = self._file_repository.get_repository_path_for_file(self._uid, old_style=True)
            filename = get_first_matching_file(repository_path, self._uid)
            if repository_path and filename:
                self._file_repository_file = os.path.join(repository_path, filename)

        return self._file_repository_file

    def detect_filename_from_filerepository(self):
        """
        finds the first physical file in the file-repository's directory that start with
        the _uid and sets it as the filename in the database.
        :return: filename and extension of the file in the filerepository - not the path!
                 Empty String if filename cannot be detected. Can throw exceptions.
        """
        filename = self._conclude_filename_from_filerepository()
        if filename:
            self.set_filename(filename)
            return filename
        return ""

    def set_cache_manager(self, cache_manager):
        self._cache_manager = cache_manager

    def set_file_repository(self, file_repository):
        self._file_repository = file_repository

    def set_type_repository(self, type_repository):
        self._type_repository = type_repository

    def set_plugin_loader(self, plugin_loader):
        self._plugin_loader = plugin_loader

    def _get_physical_file_attributes(self, physical_file: KioskPhysicalFile):
        try:
            attr = physical_file.get_file_attributes()
            if attr:
                self._file_record: KioskFilesModel
                self._file_record.image_attributes = attr
                self._file_record.update()
                return True
        except BaseException:
            pass

        return False

    def _force_get_file_attributes(self) -> bool:
        """
          tries to find a PhysicalFileHandler that can open the source file and acquire
          meta information from it using get_file_attributes().
          If possible, the meta information is stored in the image_attributes of _file_record

          Needs an existing database record for the file.

        :return: true if successful, false if no meta information could be acquired

        """
        if not self._record_exists():
            logging.error(f"{self.__class__.__name__}._force_get_file_attributes: no database record available.")
            return False

        factory = KioskPhysicalFileFactory(self._type_repository, plugin_loader=self._plugin_loader)
        handlers = factory.get(self._get_path_and_filename())

        for handler in handlers:
            if self._get_physical_file_attributes(handler(self._get_path_and_filename())):
                return True

        return False

    def set_filename(self, filename: str, commit=True):
        """
        sets the filename (including the extension but without a path)
        of the physical file in the file repository.
        :param filename: the filename with extension
        :param commit: if False, the transaction will NOT be comitted.
        :exception let's through all exceptions
        """
        record = self._get_file_record()
        if record:
            record.filename = os.path.basename(filename)
            record.update()
            if commit:
                KioskSQLDb.commit()

    def get_file_attributes(self, force_it=False) -> dict:
        """
            returns the meta information known about the source file. If no meta information is
            available in the database force_it would try to acquire it from the physical file itself.

        :param force_it: optional, default False. If set meta information is retrieved
                        from the physical file.
        :return: dict.
        """

        file_record: KioskFilesModel = self._record_exists()
        if file_record:
            if not file_record.image_attributes and force_it:
                if self._force_get_file_attributes():
                    logging.debug(f"{self.__class__.__name__}.get_file_attributes: "
                                  f"created file attributes for {self._uid}")

            if file_record.image_attributes:
                return file_record.image_attributes
            else:
                logging.error(f"{self.__class__.__name__}.get_file_attributes: "
                              f"cannot acquire file attributes for {self._uid}")
        else:
            logging.error(f"{self.__class__.__name__}.get_file_attributes: "
                          f"no file record for {self._uid}")

        return {}

    def get(self, representation_type: KioskRepresentationType = None,
            create=False, create_to_file=None):
        """
        Gets path and name of the physical file or one of its representations.

        :param representation_type: optional if given a representation of the file will be returned.
        :param create: only with representation: If the representation does not exist,
                "True" will try to create it.
        :param create_to_file: optional and only interpreted if create is True:
                The representation will be created under the given path and filename
                and it will NOT be cached.
        :return: path and filename of the file or representation or None if there is none.
        """

        if representation_type:
            return self.get_representation(representation_type, create=create, create_to_file=create_to_file)

        file_record = self._file_record

        if not file_record:
            file_record = self._get_file_record()

        if not file_record:
            logging.debug(f"{self.__class__.__name__}.get(): No file record for {self._uid}")
            return None

        return self._get_path_and_filename()

    def get_representation(self, representation_type, create, create_to_file=None, renew=False):
        """
        Gets the filename and path of the file's required representation
        :param representation_type: name of the representation type
        :param create: If the representation does not exist, "True" will try to create it.
        :param create_to_file: optional and only interpreted if create is True:
                The representation will be created under the given path and filename
                and it will NOT be cached.
        :param renew: Set to True if you want to treat a cache entry marked as "renew" as invalid
        :return: path and filename of the representation or None if there is none
        """
        rc = None
        path_and_filename = self._get_representation_from_cache(representation_type, renew)
        if path_and_filename:
            return path_and_filename

        if create:
            savepoint = "get_representation"
            KioskSQLDb.begin_savepoint(savepoint)
            try:
                rc = self._create_representation(representation_type, create_to_file=create_to_file)
                KioskSQLDb.commit_savepoint(savepoint)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.get_representation(), File {self._uid}: {repr(e)}")
                logging.error(f"{self.__class__.__name__}.get_representation(): ROLLBACK to savepoint!")
                KioskSQLDb.rollback_savepoint(savepoint)

        return rc

    def _create_representation(self, representation_type, create_to_file=None):
        """
        tries to create a certain representation of the file
        :param representation_type:
        :todo: test create_to_file
        :param create_to_file: path and filename: The result will be stored in this file instead of the cache
        :return: path and filename of the representation or None.
        """
        path_and_filename = None
        source_file = ""

        if representation_type.inherits:
            master_representation = KioskRepresentations.instantiate_representation_from_config(
                representation_type.inherits)
            if master_representation:
                source_file = self._get_representation_from_cache(master_representation)
                if source_file:
                    logging.debug(f"{self.__class__.__name__}._create_representation: "
                                  f"Using master-representation {representation_type.inherits}: {source_file}. ")
                else:
                    logging.debug(f"{self.__class__.__name__}._create_representation: "
                                  f"Master-representation {representation_type.inherits} is not in cache.")
            else:
                logging.error(f"{self.__class__.__name__}._create_representation: master representation "
                              f"{representation_type.inherits} undefined in config.")

        if not source_file:
            source_file = self._get_path_and_filename()
            # if the source file is used, the inheritance plays no role anymore.
            # Otherwise manipulations would not be applied because they are assumed to have been already applied
            # to the master
            representation_type.inherits = ""

        # todo: deprecated. I don't think this line even necessary if the value isn't used subsequently.
        #  I leave it here as a reminder:
        # manipulations = representation_type.get_specific_manipulations()
        try:
            factory = KioskPhysicalFileFactory(self._type_repository,
                                               plugin_loader=self._plugin_loader)
            handlers = factory.get(source_file, representation_type)
            dest_path_and_filename = None
            cache_path = None
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._create_representation: {repr(e)}")
            raise e

        if create_to_file:
            dest_path_and_filename = create_to_file
        else:
            # extension = None if representation_type.output_file_extension \
            #     else kioskstdlib.get_file_extension(source_file)
            cache_path = self._cache_manager.add(self._uid, representation_type)

        if dest_path_and_filename or cache_path:
            for handler in handlers:
                pf: KioskPhysicalFile = handler(source_file)
                if dest_path_and_filename:
                    raise DeprecationWarning("parameter target_filepath_and_name not anymore supported by convert_to.")
                    # rc = pf.convert_to(representation_type, target_filepath_and_name=dest_path_and_filename)
                else:
                    rc = pf.convert_to(representation_type,
                                       target_filename_without_extension=self._uid,
                                       target_path=cache_path)

                if rc:
                    path_and_filename = rc
                    self._get_physical_file_attributes(pf)
                    break

            if path_and_filename:
                if not create_to_file:
                    self._cache_manager.validate(self._uid, representation_type,
                                                 path_and_filename=path_and_filename)

        return path_and_filename

    def invalidate_cache(self):
        """
        Invalidates all cache entries for this file.
        Includes invalidating file information and
        deleting the files in the cache.
        :return: true/false
        """
        self.reset_file_attributes()
        return self._cache_manager.invalidate(self._uid, delete_files=True)

    def reset_file_attributes(self):
        """ resets the meta data for the file in the database """
        r: KioskFilesModel = self._record_exists()
        if r:
            r.image_attributes = None
            r.update()

    def create_representation(self, r_name: str, log_warning_on_fail: bool = True):
        """
        Creates a certain representation
        :param r_name: the name of the representation as configured under "file_repository/representations"
        :param log_warning_on_fail: Set to False if you don't want this to log a warning on failure.
                                    This never logs an error!
        :return: True if the representation is there on exit of the method
        """
        representation = KioskRepresentations.instantiate_representation_from_config(r_name)
        path_and_filename = self.get(representation, True)
        if not path_and_filename:
            if self._test_mode:
                logging.error(f"{self.__class__.__name__}.create_auto_representations: representation {r_name} "
                              f"could not be created for file {self.get()} ({self._uid})")
                return False
            else:
                if log_warning_on_fail:
                    logging.warning(
                        f"{self.__class__.__name__}.create_auto_representations: representation {r_name} "
                        f"could not be created for file {self.get()} ({self._uid})")
                return False
        else:
            logging.debug(f"{self.__class__.__name__}.create_auto_representations: representation"
                          f" {path_and_filename} created.")
        return True

    def create_auto_representations(self, error_on_fail: bool = False, log_warning_on_fail: bool = True):
        """
            creates the representations for the file that are listed in config
            as auto_representations under file_repository.
            :param error_on_fail:       set to True if you want to get "false" back as soon as any
                                        of the representations fails to be created. If False
                                        this will continue with the next representation on error.
            :param log_warning_on_fail: unless set to False this will log a warning if a representation fails
                                        note that it won't log an error ever
            :return: true/false
        """
        try:

            for r_name in KioskRepresentations.get_auto_representations():
                rc = self.create_representation(r_name, log_warning_on_fail)
                if not rc and error_on_fail:
                    return False

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.create_auto_representations: {repr(e)}")

        return False

    def delete(self, commit=True):
        """
        deletes the file and with all its representations.
        note: Use ContextualFile.delete if you want to make sure that the file is being archived first.

        :param commit: leaves the general commit and rollback to the caller if False but always uses a savepoint
                       to rollback the changes made within the method.

        :return: bool
        """
        r: KioskFilesModel = self._get_file_record()
        if not r:
            logging.error(f"{self.__class__.__name__}.delete: no record loaded.")
            return False

        if not self._uid:
            logging.error(f"{self.__class__.__name__}.delete: no _uid.")
            return False

        savepoint = "kiosklogicalfile_delete"
        KioskSQLDb.begin_savepoint(savepoint)
        if not self.invalidate_cache():
            logging.warning(f"{self.__class__.__name__}.delete: Non fatal: cache could not be invalidated. ")

        try:
            if KioskSQLDb.repl_mark_as_deleted(FILES_TABLE_NAME, "uid", self._uid):
                rollback = True
                try:
                    filename = self.get()
                    r.delete()
                    if filename:
                        try:
                            kioskstdlib.delete_files([filename], exception_if_missing=True)
                        except BaseException as e:
                            logging.warning(f"{self.__class__.__name__}.delete: Not fatal: "
                                            f"Exception when deleting {filename}: {repr(e)}")
                    else:
                        logging.warning(f"{self.__class__.__name__}.delete: Not fatal: "
                                        f"{filename} not found, so cannot be deleted.")
                    rollback = False
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.delete : "
                                  f"Exception when deleting {self._uid}: {repr(e)}")

                if rollback:
                    logging.error(f"{self.__class__.__name__}.delete(): ROLLBACK of KioskSQLDb to savepoint")
                    KioskSQLDb.rollback_savepoint(savepoint)
                    if commit:
                        KioskSQLDb.rollback()
                    return False
                else:
                    KioskSQLDb.commit_savepoint(savepoint)
                    if commit:
                        KioskSQLDb.commit()
                    return True
            else:
                logging.error(f"{self.__class__.__name__}.delete: repl_mark_as_deleted failed for {self._uid}")

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.delete : "
                          f"Exception when deleting {self._uid}: {repr(e)}")
        return False

    def _repair_cache_filename(self):
        """
        calls repair_cache_filename of the cache manager for the file's uid
        :returns: nothing. Lets through Exceptions.
        """
        if self._cache_manager:
            self._cache_manager.repair_cache_filename(self._uid)

    def transform_cache_filename(self):
        """
        transform_cache_file of the cache manager for the file's uid
        :returns: nothing. Lets through Exceptions.
        """
        if self._cache_manager:
            self._cache_manager.transform_cache_file(self._uid)


KioskCachedFile = KioskLogicalFile
