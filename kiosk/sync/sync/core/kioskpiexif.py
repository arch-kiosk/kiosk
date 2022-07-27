from piexif import remove as piexif_remove
# noinspection PyUnresolvedReferences
from piexif import load, dump, transplant, insert, VERSION
# noinspection PyProtectedMember,PyUnresolvedReferences
from piexif._exif import *
# noinspection PyProtectedMember,PyUnresolvedReferences
from piexif._exceptions import *
import logging

assert VERSION == "1.1.3"


def remove(src, new_file=None):
    """
    Remove exif from JPEG.
    This avoids an exception in piexif 1.1.3 if the file is not a jpeg.

    :param src: filename or blob.
    :param new_file: see piexif.remove
    :returns: nothing, but can raise other Exceptions, though. and
    """
    try:
        piexif_remove(src, new_file)
    except UnboundLocalError as e:
        output_is_file = False
        file_type = ""
        if src[0:2] == b"\xff\xd8":
            file_type = "jpeg"
        elif src[0:4] == b"RIFF" and src[8:12] == b"WEBP":
            file_type = "webp"
        else:
            with open(src, 'rb') as f:
                src_data = f.read()
            output_is_file = True
            if src_data[0:2] == b"\xff\xd8":
                file_type = "jpeg"
            elif src_data[0:4] == b"RIFF" and src_data[8:12] == b"WEBP":
                file_type = "webp"

        if not file_type:
            if output_is_file:
                logging.debug(f"cannot drop exif data from {src}")
            else:
                logging.debug(f"cannot drop exif data from blob.")
            return
        else:
            raise e
