import logging
import os
import kioskpiexif

from kioskphysicalfile import KioskPhysicalFile
from kioskrepresentationtype import KioskRepresentationType, MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA

# File meta information constants. Used to access standard attributes in the
# dict returned by get_file_attributes

FILE_ATTR_WIDTH = "width"
FILE_ATTR_HEIGHT = "height"
FILE_ATTR_FORMAT = "format"


class KioskPhysicalImageFile(KioskPhysicalFile):

    def __init__(self, source_path_and_filename: str):
        self.source_path_and_filename = source_path_and_filename
        self._file_attributes = None
        self._has_exif_data = False

    def convert_to(self, representation: KioskRepresentationType,
                   target_filename_without_extension: str,
                   target_path: str) -> str:
        if not target_filename_without_extension or not target_path:
            return ""

        if self.can_open(self.source_path_and_filename):
            if self.can_convert_to(source_filepath_and_name=self.source_path_and_filename,
                                   representation=representation):
                return self._convert_to(representation, target_path=target_path,
                                        target_filename_without_extenson=target_filename_without_extension)
            else:
                logging.warning(f"{self.__class__} cannot convert {self.source_path_and_filename}")
        else:
            logging.warning(f"{self.__class__} cannot open {self.source_path_and_filename}")
        return ""

    def _convert_to(self, representation: KioskRepresentationType,
                    target_filename_without_extenson: str = "",
                    target_path: str = "") -> str:
        img = None
        try:
            img = self._open_image(representation)
            if not img:  # or not img.size:
                logging.warning(f"{self.__class__} cannot open {self.source_path_and_filename}")
                return ""

            if img and representation.dimensions:
                img = self._downscale(img, representation)
                if not img:
                    logging.warning(f"{self.__class__} cannot open {self.source_path_and_filename}")
                    return ""

            if self.supports(MANIPULATION_FIX_ROTATION) \
                    and MANIPULATION_FIX_ROTATION in representation.get_specific_manipulations():

                img = self._fix_rotation(img, representation)
                if not img:
                    return ""

            if img:
                current_format = self._get_image_format(img)
                dest_format = representation.get_requested_output_format(current_format)
                if not dest_format:
                    logging.warning(f"{self.__class__.__name__}._convert_to: representation.get_requested_output_format"
                                    f" returned no format for {current_format}, file {self.source_path_and_filename}")
                    return ""

                dest_extension = self._get_output_extension(dest_format)
                if not dest_extension:
                    logging.warning(f"{self.__class__.__name__}._convert_to: _get_output_extension returned "
                                    f"no extension for format {dest_format}, file {self.source_path_and_filename}")
                    return ""

                target_filepath_and_name = os.path.join(target_path,
                                                        f"{target_filename_without_extenson}.{dest_extension}")
                path_and_filename = self._save_image(img, representation=representation,
                                                     target_filepath_and_name=target_filepath_and_name,
                                                     dest_format=dest_format)
                if img:
                    self._close_image(img)
                    img = None
                return self._post_conversion(representation=representation,
                                             target_filepath_and_name=path_and_filename)

        except Exception as e:
            if "cannot identify" not in repr(e):
                logging.error(
                    f"{self.__class__} _convert_to failed with source file {self.source_path_and_filename}. "
                    f"Exception {repr(e)}")
        finally:
            try:
                if img:
                    self._close_image(img)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._convert_to: Exception when trying to close image:"
                              f"{repr(e)}")

        return ""

    def get_file_attributes(self, open_if_necessary: bool = True) -> dict:
        """
        returns a dict with meta information for the file (e.G. dimensions).

        :param open_if_necessary: if no meta information is stored,
                                  should the file be opened to acquire it?
                                  Optional, defaults to true.

        :return: the dict or explicitly None (don't test for an empty dict!)
        :raises alll Exceptions are passed on
        """
        if self._file_attributes is None:
            if open_if_necessary:
                with self._open_image() as img:
                    pass

        return self._file_attributes

    def _get_image_format(self, img):
        """
        subclasses must implement this. It returns the format of the open source file in terms of
        the kiosk - internal format identifiers. It is used by convert to find which destination format
        the source can be converted to.

        :param img:
        """
        raise NotImplementedError

    def _open_image(self, representation: KioskRepresentationType = None):
        """
        subclasses must implement this. It returns an instance that handles the file and offers
        an interface to the necessary manipulations and a save method etc.
        Would be Pillow.Image with Pillow.

        """
        raise NotImplementedError

    def _close_image(self, img):
        """
        subclasses must implement this. It is called to close the image and free all resources.
        :param img: handler / class of open image.

        """
        raise NotImplementedError

    def _downscale(self, img, representation: KioskRepresentationType):
        """
        scales the open image according to the dimensions given by the representation.
        Must be overloaded by child classes.
        :param img: handler / class of open image.
        :param representation: the requested representation
        """
        raise NotImplementedError

    def _save_image(self, img, representation: KioskRepresentationType,
                    target_filepath_and_name, dest_format) -> str:
        """
        Saves the image as the requested representation in the format of dest_format.
        Does not close the image, though!
        Must be overloaded by child classes.

        :param img: handler / class of open image.
        :param representation: the requested representation
        :param target_filepath_and_name: complete path and filename of the destination file
        :param dest_format: the destination format as a kiosk format identifier.
        """
        raise NotImplementedError

    def _fix_rotation(self, img, representation):
        """
        should be overloaded by a child class if it allows for the FIX_ROTATION method. If not, the method
        would not be called. Hence it isn't implemented as a strict abstract method.
        :param img: the image instance
        :param representation: the requested representation
        """
        raise Exception("call to abstract method KioskPhysicalImagefile._fix_rotation. "
                        "Apparently some child class allowed for rotation but did not implement _fix_rotation.")

    def _post_conversion(self, representation: KioskRepresentationType,
                         target_filepath_and_name: str) -> str:
        """
        Manipulates the file further after it has been saved and closed.
        If requested, EXIF data is dropped here. Overriding child classes should call this.

        :param representation: the requested representation
        :param target_filepath_and_name: complete path and filename of the destination file
        :return: new complete path and filename of the final file
        """
        if self.supports(MANIPULATION_DROP_EXIF_DATA) \
                and MANIPULATION_DROP_EXIF_DATA in representation.get_specific_manipulations():
            try:
                logging.debug(f"{self.__class__.__name__}._post_conversion : DROP_EXIF_DATA Manipulation")
                if self._has_exif_data:
                    logging.debug(f"{self.__class__.__name__}._post_conversion : Trying to remove exif data")
                    kioskpiexif.remove(target_filepath_and_name)
                    return target_filepath_and_name
                else:
                    return target_filepath_and_name
            except BaseException as e:
                if MANIPULATION_DROP_EXIF_DATA in representation.required_manipulations:
                    logging.error(f"{self.__class__.__name__} cannot drop exif data of {target_filepath_and_name}: "
                                  f"Exception {repr(e)}")
                else:
                    logging.info(f"{self.__class__.__name__} cannot drop exif data of {target_filepath_and_name}: "
                                 f"Exception {repr(e)}")
                    return target_filepath_and_name
        else:
            return target_filepath_and_name

        return ""
