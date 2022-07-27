"""
    Plugin with the class KioskPhysicalHeicFile that handles Apple's Heic nonsense.
"""
import logging

from wand.image import Image

import kioskstdlib
from core.kioskphysicalfile import FILE_ATTR_HEIGHT, FILE_ATTR_WIDTH, FILE_ATTR_FORMAT
from core.synchronization import Synchronization
from kioskphysicalimagefile import KioskPhysicalImageFile
from kioskrepresentationtype import KioskRepresentationType, MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA
from sync_config import SyncConfig
from synchronizationplugin import SynchronizationPlugin


# *******************************************+
# KioskPhysicalPillowFile
# ********************************************
class KioskPhysicalHeicFile(KioskPhysicalImageFile):
    """ KioskPhysicalFile sub class that supports the HEIC format with extensions HEIC and JPG """

    supported_file_formats = [("HEIC", "High Efficiency Image Format (HEIC)", ["heic", "jpg"], None),
                              ("PDF", "Adobe Portable Document Format", [], "pdf"),
                              ("TIFF", "Tagged Image File Format", [], "tif"),
                              ("JPEG", "JPEG", [], "jpg"),
                              ("GIF", "Graphics Interchange Format", [], "gif"),
                              ("PNG", "Portable Network Graphics", [], "png"),
                              ("BMP", "Bitmap Image File", [], "bmp"),
                              ("PSD", "Photoshop Document", [], "psd")
                             ]

    supported_methods = ["BICUBIC", "CATROM", "LANCZOS"]

    supported_manipulations = [MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA]

    def _get_image_format(self, img):
        return "HEIC"

    def _read_file_attributes(self, img: Image):
        self._file_attributes = {}
        if img:
            try:
                self._file_attributes[FILE_ATTR_WIDTH] = img.width
                self._file_attributes[FILE_ATTR_HEIGHT] = img.height
                self._file_attributes[FILE_ATTR_FORMAT] = img.format
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._read_file_attributes:"
                                f" Non-fatal exception {repr(e)}")
        return self._file_attributes

    def get_exif_dict(self, img: Image):
        """
        read exif data from HEIC (well, it works with Wand in general.
        :param img:
        :return:
        """
        exif = {}
        exif.update((k[5:], v) for k, v in img.metadata.items()
                    if k.startswith('exif:'))
        return exif

    def _open_image(self):
        img = Image(filename=self.source_path_and_filename)
        self._read_file_attributes(img)
        self._has_exif_data = bool(self.get_exif_dict(img))
        return img

    def _close_image(self, img):
        if img:
            img.close()

    def _fix_rotation(self, img: Image, representation):
        # method is ok, but rotation does not seem to be necessary anymore. So the results are wrong.
        # Wait until we have a proper test image....

        try:
            logging.debug(f"{self.__class__.__name__}._fix_rotation: No rotation fix for heics")
            return img

            # this does not make any sense:
            exif = {}
            exif.update((k[5:], v) for k, v in img.metadata.items() if k.startswith('exif:'))

            if "Orientation" in exif:
                orientation = int(exif["Orientation"])
                if orientation == 3:
                    logging.debug(f"{self.__class__.__name__}._fix_rotation :"
                                  f" {self.source_path_and_filename} rotated by 180 degrees")
                    img.rotate(180)
                elif orientation == 6:
                    logging.debug(f"{self.__class__.__name__}._fix_rotation :"
                                  f" {self.source_path_and_filename} rotated by 270 degrees")
                    img.rotate(270)
                elif orientation == 8:
                    logging.debug(f"{self.__class__.__name__}._fix_rotation :"
                                  f" {self.source_path_and_filename} rotated by 90 degrees")
                    img.rotate(90)
                else:
                    logging.debug(f"{self.__class__.__name__}._fix_rotation :"
                                  f" {self.source_path_and_filename} not rotated, exif orientation was {orientation}")

        except Exception as e:
            if MANIPULATION_FIX_ROTATION in representation.required_manipulations:
                logging.warning(
                    f"{self.__class__}._convert_to: Orientation of {self.source_path_and_filename} "
                    f"cannot be fixed: {repr(e)}")
                return None
            else:
                logging.debug(
                    f"{self.__class__}._convert_to: Orientation of {self.source_path_and_filename} "
                    f"cannot be fixed: {repr(e)}. Skipped since not required.")

        return img

    def _downscale(self, img: Image, representation: KioskRepresentationType):
        downscale_algo = "undefined"

        if representation.method:
            if representation.method.lower() == "bicubic" or \
                    representation.method.lower() == "catrom":
                downscale_algo = "catrom"
            elif representation.method.lower() == "lanczos":
                downscale_algo = "lanczos"
            else:
                # that should not happen at all!
                raise NotImplementedError(f"{self.__class__}._convert_to: "
                                          f"Method {representation.method} not supported.")

        if img.width > representation.dimensions.width or \
                img.height > representation.dimensions.height:
            new_width, new_height = kioskstdlib.calc_image_rect_to_fit_in(img.width,
                                                                          img.height,
                                                                          representation.dimensions.width,
                                                                          representation.dimensions.height)

            img.resize(round(new_width), round(new_height),
                       filter=downscale_algo)
        return img

    def _save_image(self, img: Image, representation: KioskRepresentationType,
                    target_filepath_and_name, dest_format) -> str:
        try:
            # todo: save exit data?
            img.format = dest_format.lower()
            img.save(filename=target_filepath_and_name)
            # not needed any longer since done by _convert_to.
            # img.close()
            return target_filepath_and_name
        except BaseException as e:
            logging.error(f"{self.__class__} cannot save {target_filepath_and_name}: Exception {repr(e)}")

        return ""


# ************************************************************************
# Plugin code for PluginDefaultFileHandling
# ************************************************************************
class PluginHeicFileHandling(SynchronizationPlugin):
    _plugin_version = 1.0

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            self.register_types(app, SyncConfig.get_config())
            logging.debug("PluginHeicFileHandling: plugin registered")
        else:
            logging.error("PluginHeicFileHandling: plugin could not be registered due to no app.")
            return False

        return True

    def register_types(self, app: Synchronization, config: SyncConfig):
        def add_format(file_format, format_description):
            if not config.has_key("file_formats"):
                config.set_base_key("file_formats", {})

            config.file_formats[file_format] = format_description

        # register the supported basic physical file formats
        KioskPhysicalHeicFile.register(app.type_repository, add_format)
