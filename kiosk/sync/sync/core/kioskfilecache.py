import os
import logging

import kioskstdlib
from kiosksqldb import KioskSQLDb

from kioskrepresentationtype import KioskRepresentationType
import datetime

from kioskfilecachemodel import KioskFileCacheModel


class CacheEntryNotFoundError(Exception):
    pass


class CacheDatabaseError(Exception):
    pass


class KioskFileCache:
    def __init__(self, cache_base_dir, deprecated_sql_session=None, representation_repository=None):
        if deprecated_sql_session is not None:
            raise DeprecationWarning("Call to KioskFileCache with an sql alchemy session.")

        self._cache_base_dir = cache_base_dir
        self._representation_repository = representation_repository
        self._file_cache_model = KioskFileCacheModel()

    def _get_cache_entry(self, uid_file, representation_type: KioskRepresentationType):
        if self._file_cache_model.get_one("uid_file=%s and representation_type=%s",
                                          [uid_file, representation_type.unique_name]):
            return self._file_cache_model
        else:
            return None

    def _get_cache_entries(self, uid):
        records = self._file_cache_model.get_many("uid_file=%s", [uid])
        return list(records)

    def _get_cache_filename(self, uid, representation_type: KioskRepresentationType,
                            src_file_extension):
        if not src_file_extension:
            logging.error(f"{self.__class__.__name__}._get_cache_filename:"
                          f" no file extension given for file with id {uid}.")
            return ""
        cache_dir = self.get_cache_dir(uid, representation_type)

        extension = src_file_extension

        return os.path.join(cache_dir, f"{uid}.{extension}")

    def _is_in_cache_dir(self, path_and_filename):
        """
        checks whether a file is stored in the cache directory and not outside of it.
        The cache can under some circumstances point to a file outside of the cache directory.
        In this case the cache points to the original file. This here helps to identify this case.

        :param path_and_filename:
        :return: bool
        """
        try:
            path_and_filename = path_and_filename.upper()
            cache_dir = self._cache_base_dir.upper()
            if cache_dir == os.path.commonpath([cache_dir, path_and_filename]):
                return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._is_in_cache_dir {repr(e)}")
            logging.error(f"{self.__class__.__name__}._is_in_cache_dir: cache_dir is {cache_dir}, "
                          f"path_and_filename is {path_and_filename}")

        return False

    def _get_representation_type_by_name(self, representation_type_name):
        if self._representation_repository:
            return self._representation_repository(representation_type_name)
        else:
            raise Exception("no handler to fetch representation classes installed.")

    def _invalidate_all_entries(self):

        return self._file_cache_model.update_many(["invalid"], [True])

    def install_representation_repository(self, callable):
        """
        sets a callable object that returns a KioskRepresentationType instance
        that matches a unique name given as a parameter to it. Or it must return None.
        :param callable: a handler function that returns none or a KioskRepresentationType instance
        """
        self._representation_repository = callable

    def add(self, uid_file, representation_type: KioskRepresentationType,
            image_attributes: dict = None, src_file_extension="", commit=False):
        """
         adds (or overrides) a cache entry and returns the filename for the cache file.
         The cache entry is always invalidated! A subsequent call to validate() is necessary
         to confirm the cache entry.

        :param representation_type: The kind of file we have here. Different representations are
                kept in separate directories. the representationtype also determines the file extension.
        :param uid_file: the unique identifier of the file
                (two representations of the same file must have the same uid).
                NOT the uid of the kiosk_file_cache table!
        :param image_attributes: dict with image attributes. e.G. width and height.
        :param src_file_extension: If no file extension is given in the representation_type,
                this one will be used.
        :param commit: Set to true to commit changes to the database. Default is false.
        :return: if src_file_extension is given, path and filename of the cache file
                 if src_file_extension is not given, the path of the cache directory where the file should be stored.
        :exception: lets through all kinds of exceptions.
        """
        cache_entry = self._get_cache_entry(uid_file, representation_type)
        its_new = False
        if not cache_entry:
            cache_entry = KioskFileCacheModel(uid_file=uid_file,
                                              representation_type=representation_type.unique_name)
            its_new = True

        cache_entry.modified = datetime.datetime.now()
        cache_entry.invalid = True
        cache_entry.image_attributes = image_attributes
        if src_file_extension:
            cache_entry.path_and_filename = self._get_cache_filename(uid_file, representation_type, src_file_extension)
        else:
            cache_entry.path_and_filename = ""

        if its_new:
            cache_entry.add(commit=commit)
        else:
            cache_entry.update(commit=commit)

        if src_file_extension:
            return cache_entry.path_and_filename
        else:
            return self.get_cache_dir(uid_file, representation_type)

    def validate(self, uid_file, representation_type: KioskRepresentationType,
                 path_and_filename: str = "", commit=False) -> str:
        """
            Validates a cache entry. Only a validated cache file is returned by get_one.
            The method checks whether the file does indeed exist or fails otherwise
            with an Exception!

        :param representation_type: The kind of file we have here. Different representations are
                kept in separate directories. the representationtype also determines the file extension.
        :param uid_file: the unique identifier of the file
                (two representations of the same file must have the same uid)
        :param path_and_filename: path and filename of the cached file in the cache directory.
                if this is not given, the path_and_filename in the cache table is used.
                A cache entry is only validated if a path_and_filename to a valid cache file
                is available.
        :param commit: Set to true to commit changes to the database. Default is false.
        :return file_path_and_name: path and filename of the cache file
        :exception NoCacheItemError, FileNotFoundError, CacheDatabaseError
        """

        cache_entry = self._get_cache_entry(uid_file, representation_type)
        if not cache_entry:
            raise CacheEntryNotFoundError()

        if not path_and_filename:
            path_and_filename = cache_entry.path_and_filename
        if not os.path.isfile(path_and_filename):
            raise FileNotFoundError()

        cache_entry.path_and_filename = path_and_filename
        cache_entry.modified = datetime.datetime.now()
        cache_entry.invalid = False
        if not cache_entry.update(commit=commit):
            raise CacheDatabaseError(f"update of cache-entry for file {uid_file} failed.")

        return path_and_filename

    def invalidate(self, uid=None, representation_type=None, delete_files=False, commit=False):
        """
            invalidates a specific representation or all representations of an item in the cache.
            If delete_files is set, files are only deleted if they are located within the cache directory.
            Should the cache point to a file outside of the cache directory, it will NOT be deleted.

        :param delete_files: deletes the physical cache files
        :param uid: the cache item. If not given, the whole cache is invalidated
        :param representation_type: None or a representation type. If not given, all representations
               are invalidated, either of that uid or even the whole cache
        :param commit: Set to true to commit changes to the database. Default is false.
        :return: False / True
        """

        savepoint = KioskSQLDb.begin_savepoint(savepoint_prefix="fcinv")
        try:
            if representation_type:
                cache_entries = [self._get_cache_entry(uid, representation_type)]
            else:
                if uid:
                    cache_entries = self._get_cache_entries(uid)
                else:
                    # invalidate the whole cache
                    rc = self._invalidate_all_entries()
                    KioskSQLDb.commit_savepoint(savepoint)
                    if commit:
                        KioskSQLDb.commit()
                    return rc

            if not cache_entries:
                return False

            files_to_delete = []
            for cache_entry in cache_entries:
                cache_entry.invalid = True
                cache_entry.update()
                logging.debug(f"{self.__class__.__name__}.invalidate(): invalidated {cache_entry.uid}.")
                if delete_files:
                    if self._is_in_cache_dir(cache_entry.path_and_filename):
                        files_to_delete.append(cache_entry.path_and_filename)
                    else:
                        logging.warning(
                            f"Representation {cache_entry.path_and_filename} will not be deleted: not "
                            f"in cache dir {self._cache_base_dir}")

            if files_to_delete:
                for f in files_to_delete:
                    try:
                        logging.debug(f"{self.__class__.__name__}.invalidate(): delete {f}.")
                        os.remove(f)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.invalidate: "
                                      f"Exception when deleting {f}: {repr(e)}")

            KioskSQLDb.commit_savepoint(savepoint)
            if commit:
                KioskSQLDb.commit()
            return True

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.invalidate() : {repr(e)}")
            logging.error(f"{self.__class__.__name__}.invalidate() : rolling back to savepoint {savepoint}")
            KioskSQLDb.rollback_savepoint(savepoint)

        return False

    def is_valid(self, uid, representation_type: KioskRepresentationType):
        """
        checks of there is a valid cache entry for the file and its representation

        :param representation_type:
        :param uid:
        :return: true if there is a valid entry,
                 false if there is no entry or it is marked invalid.
        """
        cache_entry = self._get_cache_entry(uid, representation_type)
        if not cache_entry:
            return False

        return not cache_entry.invalid

    def get(self, uid, representation_type: KioskRepresentationType):
        """
        gets a file's representation from the cache.
        :param uid:
        :param representation_type:
        :return: None if the file does not exist in the cache
                 or if it is invalidated, otherwise path and filename of the representation.
        """
        cache_entry = self._get_cache_entry(uid, representation_type)
        if not cache_entry:
            return None

        if cache_entry.invalid:
            return None

        file_path_and_name = cache_entry.path_and_filename
        # file_path_and_name = self._get_cache_filename(uid, representation_type)

        if os.path.isfile(file_path_and_name):
            return file_path_and_name
        else:
            return None

    def delete_from_cache(self, uid, representation_type=None, commit=False):
        """
        deletes either a files certain representation or all of its representations.
        Deletes the physical file(s) and the cache entry/entries.
        Will NOT delete physical files that are located outside of the cache directory.

        :param uid:
        :param representation_type: optional.
        :param commit: Set to true to commit changes to the database. Default is false.
        :return: True if the cache entries are gone
                 (which is also true if they hadn't been there to begin_savepoint with)
        """
        if representation_type:
            cache_entries = [self._get_cache_entry(uid, representation_type)]
        else:
            cache_entries = self._get_cache_entries(uid)

        if not cache_entries:
            return True

        for cache_entry in cache_entries:
            cache_entry: KioskFileCacheModel
            _representation_type = self._get_representation_type_by_name(cache_entry.representation_type)
            if not _representation_type:
                logging.error(f"KioskFileCache.delete_from_cache: cannot acquire "
                              f"representation type {cache_entry.representation_type} for {uid}.")
                return False
            filename_and_path = cache_entry.path_and_filename
            if os.path.isfile(filename_and_path):
                if self._is_in_cache_dir(filename_and_path):
                    cache_entry.delete(commit)
                    os.remove(filename_and_path)
                else:
                    logging.warning(f"Attempt to delete outside of cache-dir: {filename_and_path}")

        return True

    def delete_representation_type(self, representation_type):
        """
        deletes all cache items that refer to the given representation type.
        Also deletes the physical files in that branch of the cache.
        :param representation_type:
        :returns True or False
        :todo: implementation
        """
        pass

    def get_cache_dir(self, uid: str, representation_type: KioskRepresentationType) -> str:
        """
        returns the directory in which a file would be cached.

        :param uid:
        :param representation_type:
        :return: the directory
        """
        cache_dir = os.path.join(self._cache_base_dir,
                                 representation_type.unique_name)

        if not os.path.isdir(cache_dir):
            os.makedirs(cache_dir, exist_ok=True)

        return cache_dir

    def rebuild_cache(self, representation_type=None, delete_invalid_entries=False):
        """
        rebuilds all cache entries from what can be found in the cache directory.


        :param representation_type: optional. If given, only that sub branch of the cache is rebuilt.
        :param delete_invalid_entries: if set, the cache or cache branch about to be rebuilt is deleted first.
               Otherwise all entries in the cache or branch are invalidated first and then validated if
               a matching file can be found during the rebuild.
        :returns True or False
        :todo: implementation
        """
        raise NotImplementedError

    def repair_cache_filename(self, uid, commit=True):
        """
        checks if the if all the filenames in the cache for this file have the cache dir as the base path.
        If not, the file cache might have been restored from a different system and the files just need to be
        rewritten towards a different cache directory.
        Any filename that does not have the cache dir as its base will be rewritten in the process.
        :param uid: the file's uid
        :param commit: Set to false to prevent immediate commits.
        :returns: None. Lets through all kinds of exceptions.
        """

        def _rewrite(representation_type, wrong_filename):
            extension = kioskstdlib.get_file_extension(wrong_filename)

            cache_filename = self._get_cache_filename(uid, representation_type, extension)
            entry = self._get_cache_entry(uid, representation_type)
            entry.path_and_filename = cache_filename
            entry.update(commit)

        records = self._file_cache_model.get_many("uid_file=%s", [uid])
        for r in records:
            s = str(r.path_and_filename)
            if s.find(self._cache_base_dir) != 0:
                representation_type = KioskRepresentationType(r.representation_type)
                _rewrite(representation_type, s)

