from __future__ import annotations
from shutil import copyfile

import logging
import os.path
from typing import List

from flask import url_for

import kioskstdlib
from authorization import is_authorized
from orm.table import Table
from kioskconfig import KioskConfig
from .filemanagerfile import FileManagerFile


class FileManagerDirectory(Table):
    _table_name = "kiosk_filemanager_directories"

    # todo: should be taken from the dsd information
    _fields = [("alias", ",".join([Table.ATTRIBUTE_KEY])),
               ("description",),
               ("path",),
               ("enabled",),
               ("privilege_modify",),
               ("privilege_read",),
               ("server_restart",),
               ]

    def __init__(self, **kwargs):
        self.alias = ""
        self.sub_dir = ""
        self.description = ""
        self.path = ""
        self.enabled = True
        self.privilege_modify = ""
        self.privilege_read = ""
        self.server_restart = False
        super().__init__(**kwargs)

    @property
    def physical_directory(self) -> str:
        """
        returns the physical directory that is the result of interpreting the instance's path attribute
        Does not check if that directory is a valid path let alone exists
        :return:  the physical directory.
                  Can throw exceptions, e.g. a ValueError if there is something wrong with the path
        """
        return self.interprete_path(self.path, self.sub_dir)

    @staticmethod
    def interprete_path(path: str, sub_dir: str = "") -> str:
        r"""
        returns a physical directory valid for the local machine.
        :param path: the directory string. Can include path variables (%%) referring to the config
                          All other directories are expected to be a sub folder to the kiosk directory.
                          "static" would be %base_path%\static, "\static" would be the same
                          "%backup%" would unfold e.g. to "E:\USTP\BACKUP", which is not a subfolder of %base_path%.
                          Addressing folders outside of the base-path is only possible with path variables.
        :param sub_dir: optional. If given the sub_dir will be appended to the path in the end
        :return: either the physical path or ""
        """

        cfg = KioskConfig.get_config()
        if os.path.isabs(path):
            new_path = path.lstrip("\\")
            new_path = new_path.lstrip("/")
            new_path = os.path.join(cfg.base_path, new_path)
            if new_path.lower() == path.lower():
                raise ValueError(f"FileManagerDirectory.interprete_path: path {path} is an absolute path "
                                 f"and cannot be accepted")
            path = new_path

        path = cfg.resolve_symbols(path)
        if not os.path.isabs(path):
            path = os.path.join(cfg.base_path, path)
        if path and sub_dir:
            path = os.path.join(path, sub_dir)
        return path

    def get(self, alias="", sub_dir="") -> bool:
        """
        loads a record from the file_manager_diretories table into THIS instance.
        :param alias: if empty the current instance's alias is being used, otherwise the alias in the parameter
        :param sub_dir: a sub directory for the aloas
        :return: True/False depending on the operations success
        """
        if not alias:
            alias = self.alias
        self.sub_dir = sub_dir
        return self.get_one("alias=%s", [alias])

    def list_directories(self) -> List[FileManagerDirectory]:
        """
        returns a list of directories that are configured for the file manager in kiosk
        :return: List of FileManagerDirectory classes.
        """
        return self.get_many()

    def list_files(self, sort_by='filename', sort_order='asc') -> List[FileManagerFile]:
        """
        returns a list of FileManagerFile instances with all the file information required by the file manager.
        Unlike _list_files, this checks if the physical_directory is valid and exists. This can not be used, e.g.
        to query the files if path contains an absolute path.
        :param sort_by: the attribute depending on which the list will be sorted
               sort_order: asc: the list is sorted from a to Z, dsc: the other way around
        :return: List of FileManagerFile instances
        """
        if self.alias:
            if os.path.isdir(self.physical_directory):
                return self._list_files(sort_by, sort_order)

    def _list_files(self, sort_by: str, sort_order: str) -> List[FileManagerFile]:
        """
        returns a list of FileManagerFile instances with all the file information required by the file manager.
        Throws exceptions if the physical_directory does not exist.
        Can be used to query files of an absolute path.
        :return: List of FileManagerFile instances
        """
        files = []
        history_dir = os.path.join(self.physical_directory, 'history')
        historical_files = []
        if os.path.isdir(history_dir):
            historical_files = kioskstdlib.find_files(history_dir, "*.*")

        modify_privilege = (not self.privilege_modify) or is_authorized(self.privilege_modify)
        for f in kioskstdlib.find_files(self.physical_directory, "*.*"):
            fm_file = FileManagerFile(f)
            alias = self.alias
            if self.sub_dir:
                alias = alias + "$$" + self.sub_dir

            fm_file.add_action("download", "fa-file-download",
                               f"triggerFileManagerDownload("
                               f"'{url_for('filemanager.filemanager_download', topic=alias, file=fm_file.filename)}')")
            if modify_privilege:
                fm_file.add_action("delete", "fa-trash",
                                   f"triggerFileManagerDelete('{fm_file.filename}',"
                                   f"'{url_for('filemanager.filemanager_delete', topic=alias, file=fm_file.filename)}')")
            try:
                if historical_files:
                    i = historical_files.index(os.path.join(history_dir, fm_file.filename))
                    historical_files.pop(i)
                    if modify_privilege:
                        fm_file.add_action("restore", "fa-undo",
                                           f"triggerFileManagerRestore('{fm_file.filename}',"
                                           f"'{url_for('filemanager.filemanager_restore', topic=alias, file=fm_file.filename)}')")
            except ValueError:
                pass
            files.append(fm_file)

        if modify_privilege:
            for f in historical_files:
                fm_file = FileManagerFile(f)
                alias = self.alias
                if self.sub_dir:
                    alias = alias + "$$" + self.sub_dir
                fm_file.add_action("restore", "fa-undo",
                                   f"triggerFileManagerRestore('{fm_file.filename}',"
                                   f"'{url_for('filemanager.filemanager_restore', topic=alias, file=fm_file.filename)}')")
                fm_file.historical = True
                files.append(fm_file)

        self.sort_file_list(files, sort_by, sort_order)
        return files

    @staticmethod
    def sort_file_list(files: List[FileManagerFile], sort_by: str, sort_order: str):
        """
        sorts the file list
        :param files: a list of FileManagerFile instances
        :param sort_by: an attribute to sort by
        :param sort_order: 'asc' to sort in ascending, 'dsc' to sort in descending order.
        """
        files.sort(key=lambda item: getattr(item, sort_by), reverse=sort_order == 'dsc')

    def get_create_history_directory(self) -> str:
        """
        returns the full path to the history directory and creates it if necessary.
        :return: the full path or an empty string
        """
        try:
            history_dir = os.path.join(self.physical_directory, 'history')
            if not os.path.isdir(history_dir):
                os.mkdir(history_dir)
            return history_dir
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_create_history_directory: {repr(e)}")
            return ''

    def backup_file(self, f: FileManagerFile) -> bool:
        """
        copies a file to the history directory
        :param f: a FileManagerFile instance
        """
        try:
            history_dir = self.get_create_history_directory()
            dest_file = os.path.join(history_dir, f.filename)
            src_file = os.path.join(self.physical_directory, f.filename)
            copyfile(src_file, dest_file)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.backup_file: {repr(e)}")
            return False

    def delete_file(self, f: FileManagerFile) -> bool:
        """
        deletes a file in the directory
        :param f: a FileManagerFile instance
        """
        try:
            src_file = os.path.join(self.physical_directory, f.filename)
            os.remove(src_file)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.delete_file: {repr(e)}")
            return False

    def restore_file(self, f) -> bool:
        """
        restores a file from the history directory back to the main directory
        :param f:
        :return: true/false
        """
        try:
            history_dir = self.get_create_history_directory()
            src_file = os.path.join(history_dir, f.filename)
            dest_file = os.path.join(self.physical_directory, f.filename)
            copyfile(src_file, dest_file)
            os.remove(src_file)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.restore_file: {repr(e)}")
        return False

    def upload_file(self, file, file_name) -> bool:
        """
        saves an uploaded file in the topic directory
        :param file: the source file
        :param file_name: the source file's name without path
        :return: true/false
        """
        try:
            dest_file = os.path.join(self.physical_directory, file_name)

            files = self.list_files()
            existing_file = None
            for f in files:
                if f.filename == file_name:
                    existing_file = f

            if existing_file:
                if self.backup_file(existing_file):
                    if self.delete_file(existing_file):
                        logging.info(f"{self.__class__.__name__}.upload_file: overriding file {existing_file.filename}")
                    else:
                        logging.error(f"{self.__class__.__name__}.upload_file: error deleting {existing_file.filename}")
                        return False
                else:
                    logging.error(f"{self.__class__.__name__}.upload_file: error backing up {existing_file.filename}")
                    return False
            else:
                logging.info(f"{self.__class__.__name__}.upload_file: new file {dest_file}")

            file.save(dest_file)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.upload_file: {repr(e)}")
        return False
