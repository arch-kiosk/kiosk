"""
    Plugin with the class KioskPhysicalSvgFile that creates SVGs with a width and a height.
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
from .kiosksvg import KioskSVG


# ******************************************************************
# Plugin code for PluginSvgFileHandling
# ************************************************************************
class PluginSvgFileHandling(SynchronizationPlugin):
    _plugin_version = 1.0

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            self.register_types(app, SyncConfig.get_config())
            logging.debug("PluginSvgFileHandling: plugin registered")
        else:
            logging.error("PluginSvgFileHandling: plugin could not be registered due to no app.")
            return False

        return True

    def register_types(self, app: Synchronization, config: SyncConfig):
        def add_format(file_format, format_description):
            if not config.has_key("file_formats"):
                config.set_base_key("file_formats", {})

            config.file_formats[file_format] = format_description

        # register the supported basic physical file formats
        KioskPhysicalSvgFile.register(app.type_repository, add_format)


# *******************************************+
# KioskPhysicalSvgFile
# ********************************************
class KioskPhysicalSvgFile(KioskPhysicalImageFile):
    """ KioskPhysicalFile sub class supports the PDF format and outputs representations of the first page
    as JPG, BMP and PNG"""

    supported_file_formats = [("SVG", "Scalable Vector Format (SVG)", ["svg"], "svg"),
                              ]

    def _open_image(self):
        svg = KioskSVG()
        if svg.open(self.source_path_and_filename):
            if not self._file_attributes:
                self._file_attributes = {}
            self._file_attributes[FILE_ATTR_FORMAT] = "SVG"
            return svg
        else:
            return None

    def _close_image(self, svg):
        if svg:
            svg.close()

    def _get_image_format(self, img):
        return "SVG"

    def _downscale(self, svg: KioskSVG, representation: KioskRepresentationType):
        if representation.dimensions:
            if svg.set_dimensions(representation.dimensions.width, representation.dimensions.height):
                return svg
            else:
                return None

    def _save_image(self, svg: KioskSVG, representation: KioskRepresentationType,
                    target_filepath_and_name, dest_format) -> str:
        try:
            if svg.save(target_filepath_and_name):
                return target_filepath_and_name
            else:
                raise Exception("svg.save went wrong.")
        except BaseException as e:
            logging.error(f"{self.__class__} cannot save {target_filepath_and_name}: Exception {repr(e)}")

        return ""
