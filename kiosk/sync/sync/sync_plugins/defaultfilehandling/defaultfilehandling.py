"""
    Plugin with classes for standard file handling
"""
import logging

import rawpy
import kioskpiexif
import kioskstdlib
from kioskphysicalfile import FILE_ATTR_ROTATE
from kioskpiexif import TAGS, TYPES
from PIL import Image, ImageColor, ImageOps

from core.kioskphysicalfile import FILE_ATTR_HEIGHT, FILE_ATTR_WIDTH, FILE_ATTR_FORMAT
from core.synchronization import Synchronization
from kioskphysicalimagefile import KioskPhysicalImageFile
from kioskrepresentationtype import KioskRepresentationType, MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA, MANIPULATION_AUTO_WHITE_BALANCE
from sync_config import SyncConfig
from synchronizationplugin import SynchronizationPlugin


# *******************************************+
# KioskPhysicalPillowFile
# ********************************************
class KioskPhysicalPillowFile(KioskPhysicalImageFile):
    """ KioskPhysicalFile sub class that supports standard image files like
    jpeg, gif, png etc. using the pillow library """

    supported_file_formats = [("TIFF", "Tagged Image File Format", ["tif", "tiff"], "tif"),
                              ("JPEG", "JPEG", ["jpg", "jpeg"], "jpg"),
                              ("GIF", "Graphics Interchange Format", ["gif"], "gif"),
                              ("PNG", "Portable Network Graphics", ["png"], "png"),
                              ("BMP", "Bitmap Image File", ["bmp"], "bmp"),
                              ("PSD", "Photoshop Document", ["psd"], "psd"),
                              ]

    supported_methods = ["BICUBIC", "LANCZOS"]

    supported_manipulations = [MANIPULATION_FIX_ROTATION, MANIPULATION_DROP_EXIF_DATA]

    def __init__(self, source_path_and_filename: str):
        super(KioskPhysicalPillowFile, self).__init__(source_path_and_filename)
        self._exif_data = None
        self._is_rotated = False

    def _rotated(self, image: Image) -> bool:
        try:
            exif = image.getexif()
            orientation = exif.get(0x0112)
            return orientation in [6,8]
            # method = {
            #     2: Image.Transpose.FLIP_LEFT_RIGHT,
            #     3: Image.Transpose.ROTATE_180,
            #     4: Image.Transpose.FLIP_TOP_BOTTOM,
            #     5: Image.Transpose.TRANSPOSE,
            #     6: Image.Transpose.ROTATE_270,
            #     7: Image.Transpose.TRANSVERSE,
            #     8: Image.Transpose.ROTATE_90,
            # }.get(orientation)
        except BaseException as e:
            logging.debug(f"{self.__class__.__name__}._get_rotation: {repr(e)}")
        return False

    def _read_file_attributes(self, img: Image):
        self._file_attributes = {}
        if img:
            try:
                self._file_attributes[FILE_ATTR_WIDTH] = img.height if self._is_rotated else img.width
                self._file_attributes[FILE_ATTR_HEIGHT] = img.width if self._is_rotated else img.height
                self._file_attributes[FILE_ATTR_FORMAT] = img.format
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._read_file_attributes:"
                                f" Non-fatal exception {repr(e)}")
        return self._file_attributes

    def _open_image(self, representation: KioskRepresentationType = None):

        img = Image.open(self.source_path_and_filename)
        try:
            self._is_rotated = self._rotated(img)
            exif_info = None
            # todo: refactor
            # I remember that dropping exif data was necessary at some point under certain
            # circumstances. But  I am not sure if any of this is still necessary
            # after all these years.
            # And why not use Pillow's own exif handling? Like in self._rotated?

            if "exif" in img.info:
                exif_info = kioskpiexif.load(img.info["exif"])

                try:
                    self._exif_data = kioskpiexif.dump(exif_info)
                except ValueError:
                    TAGS['Exif'][41728] = {'name': 'FileSource', 'type': TYPES.Short}
                    TAGS['Exif'][41729] = {'name': 'SceneType', 'type': TYPES.Short}
                    try:
                        self._exif_data = kioskpiexif.dump(exif_info)
                    except ValueError as e:
                        logging.warning(f"{self.__class__.__name__}._open_image:"
                                        f"ValueError when reading exif data: {repr(e)} "
                                        f"from file {self.source_path_and_filename}")
                        logging.debug(f"Exif info: {exif_info}")
                        self._exif_data = None
        except BaseException as e:
            logging.info(f"{self.__class__.__name__}._open_image:"
                            f"Non-fatal exception when reading exif data: {repr(e)}")
            if exif_info:
                logging.debug(f"Exif info: {exif_info}")
            self._exif_data = None

        self._has_exif_data = True if self._exif_data else False
        self._read_file_attributes(img)
        return img

    def _close_image(self, img):
        # todo: this is an ugly work around that can go as soon as pillow > 7.0 is out.
        def _close_pillow_image(img):
            try:
                if hasattr(img, "_close__fp"):
                    img._close__fp()
                if hasattr(img, "fp"):
                    if img.fp:
                        img.fp.close()
                    img.fp = None
            except Exception as msg:
                logging.debug("Error closing: %s", msg)

            if getattr(img, "map", None):
                img.map = None

            # Instead of simply setting to None, we're setting up a
            # deferred error that will better explain that the core image
            # object is gone.
            img.im = Image.deferred_error(ValueError("Operation on closed image"))

        if img:
            try:
                img.close()
            except BaseException as e:
                _close_pillow_image(img)

    def _fix_rotation(self, img: Image, representation):
        try:
            logging.debug(f"{self.__class__.__name__}._fix_rotation: Trying to fix rotation.")
            exif_object = img._getexif()
            if exif_object:
                exif = dict(exif_object.items())
                orientation = 0x0112
                if exif[orientation] == 3:
                    img = img.rotate(180, expand=True)
                elif exif[orientation] == 6:
                    img = img.rotate(270, expand=True)
                elif exif[orientation] == 8:
                    img = img.rotate(90, expand=True)
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
        if representation.method:
            if representation.method.lower() == "bicubic":
                downscale_algo = Image.BICUBIC
            elif representation.method.lower() == "lanczos":
                downscale_algo = Image.LANCZOS
            else:
                # that should not happen at all!
                raise NotImplementedError(f"{self.__class__}._convert_to: "
                                          f"Method {representation.method} not supported.")
        else:
            downscale_algo = Image.LANCZOS

        img.thumbnail([representation.dimensions.width, representation.dimensions.height], downscale_algo)
        return img

    def _save_image(self, img: Image, representation: KioskRepresentationType,
                    target_filepath_and_name, dest_format) -> str:
        try:
            if dest_format == "JPEG" and img.mode in ('RGBA', 'LA'):
                background = Image.new(img.mode[:-1], img.size, ImageColor.getrgb('#ffffff'))
                background.paste(img, img.split()[-1])
                img = background

            if self._exif_data and dest_format == "JPEG":
                img.save(target_filepath_and_name, dest_format, exif=self._exif_data)
                logging.debug(
                    f"{self.__class__.__name__}._save_image : saved {target_filepath_and_name} "
                    f"with exif data as {dest_format}.")
            else:
                img.save(target_filepath_and_name, dest_format)
                logging.debug(f"{self.__class__.__name__}._save_image : saved {target_filepath_and_name} as {dest_format}.")
            return target_filepath_and_name
        except BaseException as e:
            logging.error(f"{self.__class__} cannot save {target_filepath_and_name} "
                          f"with format {dest_format}: Exception {repr(e)}")

        return ""

    def _get_image_format(self, img):
        if img.format:
            return img.format
        else:
            logging.debug(f"{self.__class__.__name__}._get_image_format: Image has no inherent format, using extension.")
            return self.get_format_from_input_file_extensions(
                kioskstdlib.get_file_extension(self.source_path_and_filename))


# *******************************************+
# KioskPhysicalPillowNefFile
# ********************************************
class KioskPhysicalPillowNefFile(KioskPhysicalPillowFile):
    """ KioskPhysicalPillowFile sub class that supports raw files
        using rawpi and the pillow library """

    supported_file_formats = [("NEF", "Nikkon Electronic Format", ["nef"], None),
                              ("CR2", "Canon Raw File Format", ["cr2"], None),
                              ("TIFF", "Tagged Image File Format", [], "tif"),
                              ("JPEG", "JPEG", [], "jpg"),
                              ("GIF", "Graphics Interchange Format", [], "gif"),
                              ("PNG", "Portable Network Graphics", [], "png"),
                              ("BMP", "Bitmap Image File", [], "bmp"),
                              ("PSD", "Photoshop Document", [], "psd")]

    supported_manipulations = [MANIPULATION_AUTO_WHITE_BALANCE]

    def _open_image(self, representation: KioskRepresentationType = None):
        try:
            with rawpy.imread(self.source_path_and_filename) as raw:
                if representation and MANIPULATION_AUTO_WHITE_BALANCE in representation.get_specific_manipulations():
                    rgb = raw.postprocess(use_auto_wb=True)
                else:
                    rgb = raw.postprocess(use_camera_wb=True)
                self._read_file_attributes(raw)
            img = Image.fromarray(rgb)
        except Exception as e:
            logging.error(
                f"{self.__class__.__name__}._open_image: Exception "
                f"when opening the raw file {self.source_path_and_filename} : {repr(e)}")
            img = None

        return img

    def _get_image_format(self, img):
        if kioskstdlib.get_file_extension(self.source_path_and_filename).lower() == "cr2":
            return "CR2"
        else:
            return "NEF"

    def _read_file_attributes(self, img):
        self._file_attributes = {}
        ROTATION = [0,0,0,180,0,-90,90]
        if img:
            try:
                flipped = img.sizes.flip in [5, 6]
                self._file_attributes[FILE_ATTR_WIDTH] = img.sizes.raw_height if flipped else img.sizes.raw_width
                self._file_attributes[FILE_ATTR_HEIGHT] = img.sizes.raw_width if flipped else img.sizes.raw_height
                self._file_attributes[FILE_ATTR_ROTATE] = ROTATION[img.sizes.flip] if 0 <= img.sizes.flip <= 6 else 0
                self._file_attributes[FILE_ATTR_FORMAT] = "NEF"
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}._read_file_attributes:"
                                f" Non-fatal exception {repr(e)}")
        return self._file_attributes


# ************************************************************************
# Plugin code for PluginDefaultFileHandling
# ************************************************************************
class PluginDefaultFileHandling(SynchronizationPlugin):
    _plugin_version = 1.0
    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            self.register_types(app, SyncConfig.get_config())
            # logging.debug("PluginDefaultFileHandling: PluginDefaultFileHandling has been registered")
        else:
            logging.error("PluginDefaultFileHandling: PluginDefaultFileHandling could not be registered due to no app.")
            return False

        return True

    def register_types(self, app: Synchronization, config: SyncConfig):
        def add_format(file_format, format_description):
            if not config.has_key("file_formats"):
                config.set_base_key("file_formats", {})

            config.file_formats[file_format] = format_description

        # register the supported basic physical file formats
        KioskPhysicalPillowFile.register(app.type_repository, add_format)
        KioskPhysicalPillowNefFile.register(app.type_repository, add_format)





