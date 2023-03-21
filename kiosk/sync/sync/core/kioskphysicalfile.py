import logging

import kioskstdlib
from collections import namedtuple

from typerepository import TypeRepository
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER

from kioskrepresentationtype import KioskRepresentationType

# File meta information constants. Used to access standard attributes in the
# dict returned by get_file_attributes

FILE_ATTR_WIDTH = "width"
FILE_ATTR_HEIGHT = "height"
FILE_ATTR_FORMAT = "format"

SupportedFileFormat = namedtuple('SupportedFileFormat',
                                 ['id', 'name', 'input_extensions', 'output_extension'])


class KioskPhysicalFile:

    supported_manipulations = []
    supported_methods = []

    """ list of 4-tuples like this: 
        ("HEIC", "High Efficiency Image Format (HEIC)", ["heic", "jpg"], None)
        (format-id, format display name, [supported input extensions], output-extension) 
        file extensions must be lower case, file formats uppercase
        all formats, input and output formats must be listed here.
        if a format is not supported as an output format, 
        it has None as the fourth tuple attribute
        if a format is not supported as an input format, it has an empty list
        for supported input extensions
    """
    supported_file_formats = []

    @classmethod
    def supports_method(cls, method):
        return method in cls.supported_methods

    @classmethod
    def supports_manipulation(cls, manipulation):
        return manipulation in cls.supported_manipulations

    @classmethod
    def supports(cls, feature):
        return cls.supports_manipulation(feature) or cls.supports_method(feature)

    @classmethod
    def _manipulations_supported(cls, requested_manipulations):
        if requested_manipulations:
            for m in requested_manipulations:
                if m not in cls.supported_manipulations:
                    return False
        return True

    @classmethod
    def get_supported_input_file_extensions(cls):
        supported_extension = []
        for fmt in cls.supported_file_formats:
            if SupportedFileFormat(*fmt).input_extensions:
                for ext in SupportedFileFormat(*fmt).input_extensions:
                    supported_extension.append(ext)
        return supported_extension

    @classmethod
    def get_format_from_input_file_extensions(cls, extension: str):
        supported_extension = []
        extension = extension.lower()
        for fmt in cls.supported_file_formats:
            dfmt = SupportedFileFormat(*fmt)
            if dfmt.input_extensions:
                if extension in dfmt.input_extensions:
                    return dfmt.id

        return ""

    @classmethod
    def get_supported_output_formats(cls):
        return [SupportedFileFormat(*x).id for x in cls.supported_file_formats if x[3]]

    @classmethod
    def get_supported_output_file_extensions(cls):
        return [SupportedFileFormat(*x).output_extension for x in cls.supported_file_formats if x[3]]

    @classmethod
    def _get_output_extension(cls, dest_format):
        """
        returns the extension a file should have when saved in the given format.
        :param dest_format:
        :return: the extension or an empty string.
        """
        for fmt in cls.supported_file_formats:
            if SupportedFileFormat(*fmt).id == dest_format:
                return SupportedFileFormat(*fmt).output_extension

        return ""


    @classmethod
    def _guess_dest_format_from_extension(cls, extension):
        extension = extension.lower()
        for fmt in cls.supported_file_formats:
            dfmt = SupportedFileFormat(*fmt)
            if dfmt.output_extension and dfmt.output_extension == extension:
                return dfmt.id
        return ""

    @classmethod
    def _determine_dest_format(cls, representation: KioskRepresentationType, source_filepath_and_name):
        # if representation.dest_format:
        #     return representation.dest_format.upper()
        # if representation.output_file_extension:
        #     dest_format = cls._guess_dest_format_from_extension(representation.output_file_extension)

        if representation.format_request:
            extension = kioskstdlib.get_file_extension(source_filepath_and_name)
            return cls._guess_dest_format_from_extension(extension)
        else:
            logging.error(f"{cls.__name__}._determine_dest_format: representation has no format_request: {representation}")

        return None

    @classmethod
    def can_convert_to(cls, source_filepath_and_name: str, representation: KioskRepresentationType):
        if cls.can_open(source_filepath_and_name) and \
           representation.__class__ is KioskRepresentationType:
            extension = kioskstdlib.get_file_extension(source_filepath_and_name)
            src_format = cls.get_format_from_input_file_extensions(extension)
            # dest_format = cls._determine_dest_format(representation, source_filepath_and_name)
            dest_format = representation.get_requested_output_format(src_format)
            if dest_format != "*" and \
                    dest_format not in cls.get_supported_output_formats():
                logging.info(f"{cls.__name__}.can_convert_to: dest_format '{dest_format}' for '{src_format}' "
                             f"could not be determined.")
                return False
            else:
                logging.debug(f"{cls.__name__}.can_convert : dest_format is {dest_format}")

            if not representation.method or cls.supports_method(representation.method):
                if not representation.required_manipulations or \
                        cls._manipulations_supported(representation.required_manipulations):
                    return True
                else:
                    logging.error(f"{cls.__name__}.can_convert_to: required manipulations unsupported.")
            else:
                logging.error(f"{cls.__name__}.can_convert_to: method unsupported.")
        else:
            logging.error(f"{cls.__name__}.can_convert_to: extension or dest format unsupported.")

        return False

    @classmethod
    def can_open(cls, source_filepath_and_name: str):
        extension = kioskstdlib.get_file_extension(source_filepath_and_name).lower()
        return extension in cls.get_supported_input_file_extensions()

    @classmethod
    def register(cls, type_repository: TypeRepository, registry: callable):

        cls._register_file_formats(cls.supported_file_formats, registry)
        type_repository.register_type(TYPE_PHYSICALFILEHANDLER, cls.__name__, cls)

    def convert_to(self, representation: KioskRepresentationType,
                   target_filename_without_extension: str,
                   target_path: str) -> str:
        raise NotImplementedError

    def __init__(self, source_path_and_filename: str):
        raise NotImplementedError

    def get_file_attributes(self, open_if_necessary: bool = True):
        """
            abstract method. Needs to be overridden. A handler returns
            a dict with further file information like dimensions etc.
            To avoid unnecessary opening of the file (which takes long) the
            attributes are read if a file is opened so that they are available
            for a subsequent call to this function.

            :param open_if_necessary: if True the file will be opened to retrieve file attributes if necessary.
            :return: the dict or None (test for it explicitly since a dict could be empty!)
        """
        raise NotImplementedError

    @staticmethod
    def _register_file_formats(supported_file_formats, registry: callable):
        """
        registers new file formats using the callable registry like this:
        registry(id, {"id": id, "name": name, "extensions": extensions[]})

        :param supported_file_formats: list of tuples like (ID, NAME, EXTENSIONS),
                e.G. ("PNG", "Portable Network Graphics", ["PNG"])

        :param registry: callable that takes the parameters (id:str, info:dict)
        """

        for fmt in supported_file_formats:
            fmt = SupportedFileFormat(*fmt)
            if fmt.input_extensions:
                registry(fmt.id, {"id": fmt.id, "name": fmt.name, "extensions": fmt.input_extensions})

    def _get_image_format(self, img):
        """
        subclasses must implement this. It returns the format of the open source file in terms of
        the kiosk - internal format identifiers. It is used by convert_to find out which destination format
        the source can be converted to.

        :param img:
        """
        raise NotImplementedError

