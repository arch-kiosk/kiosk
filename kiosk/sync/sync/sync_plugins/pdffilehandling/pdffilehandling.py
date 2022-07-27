"""
    Plugin with the class KioskPhysicalPdfFile that creates representations of the first page of a PDF File.
"""
import logging
from wand.image import Image

from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin
from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from kioskphysicalimagefile import KioskPhysicalImageFile
from core.kioskphysicalfile import FILE_ATTR_HEIGHT, FILE_ATTR_WIDTH, FILE_ATTR_FORMAT
from kioskstdlib import image_needs_scaling, calc_image_rect_to_fit_in


# ************************************************************************
# Plugin code for PluginPdfFileHandling
# ************************************************************************
class PluginPdfFileHandling(SynchronizationPlugin):
    _plugin_version = 1.0
    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            self.register_types(app, SyncConfig.get_config())
            logging.debug("PluginPdfFileHandling: plugin registered")
        else:
            logging.error("PluginPdfFileHandling: plugin could not be registered due to no app.")
            return False

        return True

    def register_types(self, app: Synchronization, config: SyncConfig):
        def add_format(file_format, format_description):
            if not config.has_key("file_formats"):
                config.set_base_key("file_formats", {})

            config.file_formats[file_format] = format_description

        # register the supported basic physical file formats
        KioskPhysicalPdfFile.register(app.type_repository, add_format)


# *******************************************+
# KioskPhysicalPdfFile
# ********************************************
class KioskPhysicalPdfFile(KioskPhysicalImageFile):
    """ KioskPhysicalFile sub class supports the PDF format and outputs representations of the first page
    as JPG, BMP and PNG"""

    supported_file_formats = [("PDF", "Adobe Portable Document Format", ["pdf"], None),
                              ("JPEG", "JPEG", [], "jpg"),
                              ("PNG", "Portable Network Graphics", [], "png"),
                              ("BMP", "Bitmap Image File", [], "bmp"),
                              ]

    def _open_image(self):
        open_first_page = '[0]'
        img = Image(filename=self.source_path_and_filename + open_first_page)
        self._read_file_attributes(img)
        return img

    def _close_image(self, img):
        if img:
            img.close()

    def _get_image_format(self, img):
        return "PDF"

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

    def _downscale(self, img: Image, representation: KioskRepresentationType):
        if representation.method:
            downscale_algo = self._get_wand_downscale_method(representation)
            if not downscale_algo:
                raise NotImplementedError(f"{self.__class__}._downscale: "
                                          f"Downscale method {representation.method} not supported.")
        else:
            downscale_algo = "undefined"

        if image_needs_scaling(img.width, img.height,
                                          representation.dimensions.width, representation.dimensions.height):
            new_width, new_height = calc_image_rect_to_fit_in(img.width,
                                                                           img.height,
                                                                           representation.dimensions.width,
                                                                           representation.dimensions.height)

            img.resize(new_width, new_height,
                       filter=downscale_algo)

        return img

    @staticmethod
    def _get_wand_downscale_method(representation):
        downscale_algo = ""
        if representation.method.lower() == "bicubic" or \
                representation.method.lower() == "catrom":
            downscale_algo = "catrom"
        elif representation.method.lower() == "lanczos":
            downscale_algo = "lanczos"
        return downscale_algo

    def _save_image(self, img: Image, representation: KioskRepresentationType,
                    target_filepath_and_name, dest_format) -> str:
        try:
            img.format = dest_format.lower()
            img.save(filename=target_filepath_and_name)
            return target_filepath_and_name
        except BaseException as e:
            logging.error(f"{self.__class__} cannot save {target_filepath_and_name}: Exception {repr(e)}")

        return ""
