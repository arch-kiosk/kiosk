import os

import kioskstdlib
from kioskabstractclasses import PluginLoader
from kioskphysicalfile import KioskPhysicalFile
from kioskphysicalfilefactory import KioskPhysicalFileFactory
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentations

import logging


class KioskFileConverter:

    def __init__(self, type_repository=None, plugin_loader=None):
        self._type_repository = type_repository
        # self._file_repository: filerepository.FileRepository = file_repository
        self._plugin_loader: PluginLoader = plugin_loader

    def convert(self, src_path_and_filename: str, representation_type: KioskRepresentationType, dst_path,
                dst_filename=""):
        """
        converts a source file to a dest file of the given representation type if possible.
        :param src_path_and_filename: the source file
        :param representation_type: a KioskRepresentationType instance that describes the target format
        :param dst_path: the destination path
        :param dst_filename: optional: A destination filename (the extension will be ignored).
        :return: path and filename of the result. An empty string if conversion was not possible.
        """
        if not (self._type_repository and self._plugin_loader):
            raise Exception(f"KioskFileConverter.convert: type repository or plugin loader not set.")

        if not (os.path.isdir(dst_path)):
            raise Exception(f"KioskFileConverter.convert: {dst_path} is not a valid, existing directory")

        factory = KioskPhysicalFileFactory(self._type_repository,
                                           plugin_loader=self._plugin_loader)
        handlers = factory.get(src_path_and_filename, representation_type)
        if dst_filename:
            dst_filename = kioskstdlib.get_filename_without_extension(dst_filename)
        else:
            dst_filename = kioskstdlib.get_filename_without_extension(src_path_and_filename)

        for handler in handlers:
            pf: KioskPhysicalFile = handler(src_path_and_filename)
            rc = pf.convert_to(representation_type,
                               target_filename_without_extension=dst_filename,
                               target_path=dst_path)
            if rc:
                return rc

        return ""
