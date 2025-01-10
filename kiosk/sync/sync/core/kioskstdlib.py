import datetime
import time
import importlib
import os
import stat
import threading
import re

import math
import zipfile
from pprint import pformat
from typing import List, Callable, Union

import rawpy
import shutil
import kioskpiexif
import hashlib
import sys
import string
import random
import platform
import logging

import ctypes

from uuid import UUID, uuid4
from os import path
from glob import iglob
from ntpath import basename
from PIL import Image

from kioskdatetimelib import utc_datetime_since_epoch, local_datetime_to_utc
from semantic_version import Version

if os.name == 'nt':
    import win32file
    import win32con
    from pywintypes import Time

raw_file_extensions = ["nef"]
format_translations = {"jpg": ("JPEG", "jpg"),
                       "nef": ("tiff", "tif"),
                       "tiff": ("tiff", "tif"),
                       "tif": ("tiff", "tif"),
                       "raw": ("tiff", "tif"),
                       }

def get_first_matching_file(filespath, identifier, prefix="", postfix="", wildcard="*"):
    """
    Finds the first file in a path that matches prefix+identifier+postfix+".*".

    :param filespath: the path to search
    :param identifier: the identifier
    :param prefix: an optional prefix (e.G. "*" or "A?")
    :param postfix: an optional postfix (e.G. "?D" )
    :param wildcard: optional. Just in case a different trailing wildcard is necessary.
           e.G. "*.*" to exclude directories
    :return: the filename without the path if found otherwise an empty string.
    """
    if filespath and identifier:
        searchpattern = path.join(filespath, prefix + identifier + postfix + wildcard)
        for f in iglob(searchpattern):
            return basename(f)
    return ""


def find_files(filepath, file_pattern, exclude_file="", include_path=True, order_by_time=False,
               order_desc=True) -> List[str]:
    """
    list files from a directory - not recursive!
    :param filepath: the path
    :param file_pattern: a pattern like "*.dmp"
    :param exclude_file: a single file that will not occur in the list.
    :param include_path: returns path and filename if true otherwise only the filename
    :param order_by_time: if set the list will be ordered by the file's creation datetime in descending order
    :return: a list of files (list(str)
    """
    files = []
    if filepath and file_pattern:
        searchpattern = path.join(filepath, file_pattern)
        for f in iglob(searchpattern):
            if not exclude_file or f.upper() != exclude_file.upper():
                if include_path:
                    files.append(f)
                else:
                    files.append(get_filename(f))
        if order_by_time:
            file_ages = {}
            for f in files:
                file_ages[f] = get_file_date_since_epoch(f if include_path else os.path.join(filepath, f),
                                                                     use_most_recent_date=False)

            files.sort(key=lambda x: file_ages[x], reverse=order_desc)

    return files


def apply_files(filepath, file_pattern, file_method: Callable):
    """
    list files from a directory and calls a function on them.
    :param filepath: the path
    :param file_pattern: a pattern like "*.dmp"
    :param file_method: a function that accepts a parameter path_and_filename
    :param exclude_file: a single file that will not occur in the list.
    :return: a list of files (list(str)
    """

    if filepath and file_pattern:
        search_pattern = path.join(filepath, file_pattern)
        for f in iglob(search_pattern):
            file_method(f)


def delete_files(file_list, exception_if_missing=False):
    if file_list:
        for f in file_list:
            try:
                logging.debug("delete_files: deleting " + f)
                os.remove(f)
            except Exception as e:
                if exception_if_missing:
                    raise e


def change_file_ext(filename, new_ext):
    new_filename, ext = os.path.splitext(filename)
    if new_ext[0] != ".":
        new_ext = "." + new_ext
    return (new_filename + new_ext)


def get_file_dimensions(filename):
    result = None
    img = None
    try:
        if get_file_extension(filename).lower() in raw_file_extensions:
            try:
                with rawpy.imread(filename) as raw:
                    result = (raw.sizes[2], raw.sizes[3])
            except Exception as e:
                logging.error(
                    "Exception in kioskstdlib.get_file_dimensions when opening raw file " + filename + ": " + repr(e))
        else:
            try:
                img = Image.open(filename)
                result = img.size
            except Exception as e:
                if "cannot identify" not in repr(e):
                    raise
                else:
                    logging.info(
                        "kioskstdlib.get_file_dimensions: Pillow cannot identify file format of file " + filename)

        return result
    except Exception as e:
        logging.error("Exception in kioskstdlib.get_file_dimensions when opening file " + filename + ": " + repr(e))

    return result


def trim_pathsep(path: str):
    """
    Get's rid of trailing path separators if they are unnecessary. E.g. "c:\path\" will be "c:\path"
    but "c:\" will be kept.
    :param path: input path
    :return: return path without a superfluous trailing backslash
    """
    return os.path.normpath(path)


def instantiate_exif_orientation(src_file, dst_file):
    if src_file[-4:].lower() != ".nef":
        try:
            img = Image.open(src_file)
            if not img or not img.size:
                logging.error("the file " + src_file + " does not seem to be an image")
                img = None
            else:
                exif_object = img._getexif()
                if exif_object:
                    print("Exif Object seems to exist")
                    exif = dict(exif_object.items())
                    print(exif[0x0112])
                else:
                    print(f"No exif data in {src_file} via _getexif()")
                    exif_dict = kioskpiexif.load(src_file)
                    if not exif_dict:
                        print(f"No exif data in {src_file} via kioskpiexif.load(src_file)")

                    print(exif_dict["0th"][kioskpiexif.ImageIFD.Orientation])

        except Exception as e:
            if "cannot identify" not in repr(e):
                logging.error(
                    "Exception in CopyAndManipulateFile when opening the non-raw file " + src_file + ": " + repr(e))
            img = None


def copy_and_manipulate_file(src_file, dst_file, manipulations, no_planb=False):
    """copies and manipulates a file, if requested.

    src_file is the fully qualified path and filename of the source \n
    dst_file is the fully qualified path and filename of the target file, but \n
    the target file will change its extension according to the target format (see below). \n
    If not target format is given, the target format will be that of the src_file. \n

    The parameter 'manipulations' is a dictionary expected to have the following structure: \n
    \n
    downscale: Algorithm to be used in downscaling (refers to the options of the Pillow.Image.thumbnail method) \n
               If no downscaling is wished for, the parameter should be absent or set to None. \n
               downscaling keeps aspect ratio.
    width:     necessary if downscale is given: max target width in pixel
    height:    necessary if downscale is given: max target height in pixel
    format:    If present and not None, this is the target format, stated by the last three letters of the file-extension or
               by one of the format indicators like "tif".\n
    no_planb:  By default a file is simply copied to the destination if manipulating isn't possible.
               If no_planb is True the method fails if manipulations are not possible.     \n
    Returns None if failed or the (finally used) fully qualified path and filename of the created target file.

    ..note:

    As for the return value: It is important to know that the destination filename might very well be altered by
    the method according to the conversion format. That is why the method returns the actually used destination filename.


    """
    downscale_algo = None
    width = None
    height = None
    new_format = None
    img = None
    rc = None
    fix_orientation = False

    if manipulations:
        try:
            if "downscale" in manipulations:
                downscale_algo = manipulations["downscale"]
                if downscale_algo:
                    downscale_algo = downscale_algo.lower()
                    width = manipulations["width"]
                    height = manipulations["height"]
        except Exception as e:
            logging.error(
                "Exception in copy_and_manipulate_file. Presumably not all expected parameters were given for downscale: " + repr(
                    e))
            downscale_algo = None

        try:
            if "format" in manipulations:
                new_format = manipulations["format"]
        except Exception as e:
            logging.error("Exception in copy_and_manipulate_file when evaluating the format parameter: " + repr(e))
            new_format = None

        try:
            if "fix_orientation" in manipulations:
                fix_orientation = True
        except Exception as e:
            logging.error(
                "Exception in copy_and_manipulate_file when evaluating the fix_orientation parameter: " + repr(e))
            new_format = None

    if new_format or downscale_algo or fix_orientation:
        if src_file[-4:].lower() == ".nef":
            try:
                with rawpy.imread(src_file) as raw:
                    rgb = raw.postprocess()
                img = Image.fromarray(rgb)
            except Exception as e:
                logging.error(
                    "Exception in CopyAndManipulateFile when opening the raw file " + src_file + ": " + repr(e))
                img = None
        else:
            try:
                img = Image.open(src_file)
                if not img or not img.size:
                    logging.error("the file " + src_file + " does not seem to be an image")
                    img = None
                else:
                    if fix_orientation:
                        try:
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
                            logging.warning(
                                f"Copy_and_manipulate_file: Orientation of {src_file} cannot be fixed: {repr(e)}")

            except Exception as e:
                if "cannot identify" not in repr(e):
                    logging.error(
                        "Exception in CopyAndManipulateFile when opening the non-raw file " + src_file + ": " + repr(e))
                img = None

    if img:
        if downscale_algo and width and height:
            if downscale_algo == "bicubic":
                thumbnail_algo = Image.BICUBIC
            else:
                thumbnail_algo = Image.LANCZOS
            img.thumbnail([width, height], thumbnail_algo)

        if new_format:
            if new_format in format_translations:
                new_ext = format_translations[new_format][1]
                new_format = format_translations[new_format][0]
                dst_file = change_file_ext(dst_file, new_ext)
            else:
                dst_file = change_file_ext(dst_file, new_format)
        try:
            if dst_file:
                img.save(dst_file, new_format)
                if get_file_extension(dst_file).lower() in ("jpg", "tif"):
                    kioskpiexif.remove(dst_file)

                rc = dst_file
                return rc
            else:
                logging.error(f"Error in CopyAndManipulateFile when saving {src_file}: dst_file is None")
                return None  # if there is no dst_file, there is no reason left even to try a plan b
        except Exception as e:
            logging.error("Exception in CopyAndManipulateFile when saving " + dst_file + ": " + repr(e))

    # at this point the file needs only copying either because that's what was requested or the other operation failed
    if (new_format or downscale_algo) and no_planb:
        return None
    try:
        shutil.copyfile(src_file, dst_file)
        try:
            if get_file_extension(src_file).lower() in ("jpg", "tif"):
                kioskpiexif.remove(dst_file)
        except Exception as e:
            logging.warning(f"Exception in CopyAndManipulateFile when removing EXIF data "
                            f"from {src_file}: {repr(e)}")

        rc = dst_file
    except Exception as e:
        logging.error("Exception in CopyAndManipulateFile when just copying file: " + repr(e))

    return rc


def invalid_extension_for_image_format(src_file):
    ext = get_file_extension(src_file).upper()
    file_format = get_image_format(src_file)
    if file_format:
        if ext == "JPG":
            if file_format != "JPEG":
                return file_format
        if ext == "PNG":
            if file_format != "PNG":
                return file_format

    return None


def get_image_format(src_file):
    rc = None
    try:
        if src_file[-4:].lower() == ".nef":
            try:
                with rawpy.imread(src_file) as raw:
                    rgb = raw.postprocess()
                img = Image.fromarray(rgb)
            except Exception as e:
                logging.error(
                    "Exception in get_image_format when opening the raw file " + src_file + ": " + repr(e))
                img = None
        else:
            try:
                img = Image.open(src_file)
                if not img or not img.size:
                    logging.error("the file " + src_file + " does not seem to be an image")
                    img = None
            except Exception as e:
                if "cannot identify" not in repr(e):
                    logging.error(
                        "Exception in get_image_format when opening the non-raw file " + src_file + ": " + repr(e))
                img = None

        if img:
            rc = img.format
    except Exception as e:
        logging.debug(f"Exception in get_image_format for file {src_file}: {repr(e)}")

    img = None
    return rc


def get_file_extension(filename):
    ext = ""
    try:
        new_filename, ext = os.path.splitext(filename)
        if ext[0] == ".":
            ext = ext[1:]
    except:
        pass
    return ext


def get_filename(filename):
    """
    returns a filename without without the path!
    :param filename:
    :return:
    """
    separated_filename = ""
    try:
        separated_filename = os.path.basename(filename)
    except:
        pass
    return separated_filename


def get_filename_without_extension(filename):
    """
    returns a filename without an extension AND without the path!
    :param filename:
    :return:
    """
    filename_without_ext = ""
    try:
        filename_without_ext = os.path.basename(filename)
        idx = filename_without_ext.rfind(".")
        if idx > -1:
            filename_without_ext = filename_without_ext[:idx]
    except:
        filename_without_ext = ""
        pass
    return filename_without_ext


def file_exists(filepath):
    """
    Check if the given file path corresponds to an existing file.

    This function validates if the given `filepath` points to an actual file
    in the filesystem. If any exception occurs,
    it gracefully handles it by returning `False` without raising the exception.

    This does not work for directories!

    :param filepath: The path to the file to check.
    :type filepath: Any
    :return: True if the file exists, False otherwise.
    :rtype: bool
    """
    try:
        if os.path.isfile(str(filepath)):
            return True
    except BaseException:
        pass
    return False


def get_file_size(path_and_filename: str) -> int:
    """
    returns the file size of a file or 0.
    :param path_and_filename:
    :return: the file size in bytes or 0 in case of any error.
    """
    try:
        if not path_and_filename:
            logging.error("get_file_size: no path_and_filename given.")
            return 0
        return os.path.getsize(path_and_filename)
    except BaseException as e:
        logging.error(f"get_file_size: error for file {path_and_filename}: {repr(e)}")
    return 0


def byte_size_to_string(byte_size, categories=["bytes", "KB", "MB", "GB"]) -> str:
    """
    returns a text that gives the byte size in a readable way in either bytes, kilobytes, megabytes or even
    gigabytes depending on the size.

    :param byte_size:
    :return: the readable size
    """

    n = 1
    for cat in categories:
        if byte_size < 1024 or n == len(categories):
            return "{:.2f} {:s}".format(byte_size, cat) if int(byte_size * 100) != int(
                byte_size) * 100 else "{:d} {:s}".format(int(byte_size), cat)
        n += 1
        byte_size = byte_size / 1024


def str_split_and_trim(s, separator=","):
    if s:
        lst = s.split(separator)
        return (list(map(lambda x: x.strip(), lst)))
    return []


def rmtree(path: str, delay=0.5) -> bool:
    """
    This is a dangerous method without any safety catches!
    Please consider using remove_kiosk_subtree instead!

    This rmtree method is a wrapper around shutil.rmtree.
    It sleeps for the time stated as delay after the rmtree and
    returns a boolean instead of throwing exceptions.

    :param path: the directory do remove
    :param delay: the time to sleep afterwards
    :return: bool
    """
    try:
        shutil.rmtree(path)
        time.sleep(delay)
        return True
    except:
        return False


def report_progress(callback_progress, progress, topic=None, extended_progress=None):
    if callback_progress:
        prg = {"progress": progress}
        if topic:
            prg["topic"] = topic
        if extended_progress is not None:
            prg["extended_progress"] = extended_progress
        return callback_progress(prg)
    else:
        return False


def get_file_hash(filepath_and_name):
    try:
        hash_md5 = hashlib.md5()
        with open(filepath_and_name, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except:
        pass
    return ("")


def check_uuid(uuid_to_test, version=4, accept_filemaker_too=False):
    try:
        uuid_obj = UUID(uuid_to_test.lower(), version=version)
    except ValueError as e:
        return False
    except Exception as e:
        logging.error("Exception in check_uuid: " + repr(e))
        return False

    if str(uuid_obj) == uuid_to_test.lower():
        return True
    else:
        if accept_filemaker_too:
            fm_uuid_fmt = re.compile("[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[‌​0-9a-f]{12}", re.I)
            if re.match(fm_uuid_fmt, uuid_to_test.lower()):
                return True

        logging.error("check_uuid: " + str(uuid_obj) + " <> " + uuid_to_test.lower())
        return False


def try_get_dict_entry(d, key, default, null_defaults=False):
    """
    returns a dictionary value if it exists. If it does not exist, the default value is returned.
    if null_defaults is set, the default value is also returned if the key exists but its value is None.

    :param d:  the dictionary
    :param key:  the key
    :param default: default value
    :param null_defaults: IF true, the default value is also returned if the the value is None
    :return: returns the value or if the value does not exist or an error occurs the default
    """
    try:
        if key in d:
            v = d[key]
            if null_defaults and v is None:
                return default
            else:
                return v
        else:
            return default
    except BaseException as e:
        logging.error(f"kioskstdlib.try_get_dict_entry: {repr(e)}")
        return default


def get_regex_group_or_default(rgx, grp_name, default):
    d = rgx.groupdict()
    if grp_name in d:
        if d[grp_name]:
            return (d[grp_name])

    return (default)


def get_exif_data(filename):
    try:
        exif_dict = kioskpiexif.load(filename)
    except:
        exif_dict = None
    return exif_dict


def exif_to_yaml(filename):
    yaml_filename = filename + ".yaml"
    ff = open(yaml_filename, 'w')
    exif_dict = get_exif_data(filename)
    for k, v in exif_dict.items():
        ff.write(str(k) + ' >>> ' + str(v) + '\n\n')
    ff.close()


def is_file_hidden(filepath):
    return bool(os.stat(filepath).st_file_attributes & stat.FILE_ATTRIBUTE_HIDDEN)


def is_dir_hidden(filepath):
    return is_file_hidden(filepath)


# def is_directory_hidden(p):
#     if os.name == 'nt':
#         attribute = win32api.GetFileAttributes(p)
#         return attribute & (win32con.FILE_ATTRIBUTE_HIDDEN | win32con.FILE_ATTRIBUTE_SYSTEM)
#     else:
#         return p.startswith('.') #linux/osx


def null_val(v, null_v):
    if v:
        return v
    return null_v


def null_key(fld, key, null_val):
    if key in fld:
        return (fld[key])
    else:
        return (null_val)


def str_starts_with_element(s: str, lst):
    """
    checks if s starts with any of the list elements. case-insensitive!
    :param s: a string
    :param lst: a list with strings
    :return: true or false
    """
    s = s.upper().strip()
    for element in lst:
        if s.startswith(element.upper().strip()):
            return True

    return False


def has_element_that_starts_with(s: str, lst: list[string]):
    """
    checks if any element in a list of strings starts with the sequence s.
    Search is case-insensitive.
    :param s: the search string
    :param lst: the list of strings
    :return: True | False, element | None
    """
    s = s.upper().strip()
    for element in lst:
        if element.upper().strip().startswith(s):
            return True, element

    return False, None


def resolve_symbols_in_string(path, symbol_dict):
    c = 0
    if path:
        rx_symbol = re.compile(r"(\%.*?\%)", re.I)
        next_symbol = rx_symbol.search(path)
        while next_symbol:
            c += 1
            if c > 10:
                logging.error("resolve_symbols_in_string exceed depth of 10")
                return (None)
            value = ""
            key = next_symbol.group(0)[1:-1]
            if key in symbol_dict:
                value = symbol_dict[key]
            else:
                value = "!" + next_symbol.group(0)[1:-1] + "!"
            path = path.replace(next_symbol.group(0), value)
            next_symbol = rx_symbol.search(path)
    return (path)


def getEmptyArray(v):
    if v:
        if v[0]:
            return (v)
    return []


def split_or_empty_list(s: str, separator=","):
    """
    returns a list of string elements separated by the given separator. The items themselves
    will be trimmed with strip, so that they won't have leading or trailing blanks.
    :param s:
    :param separator:
    :return:
    """
    lst: [] = [x.strip() for x in str(s).split(separator)]
    if len(lst) == 1:
        if not lst[0]:
            lst = []
    return lst


def urap_secure_filename(filename, additional_characters: str = ""):
    r"""
    Copied from werkzeug: utils.py.

    This version here leaves blanks untouched.

    Pass it a filename and it will return a secure version of it.  This
    filename can then safely be stored on a regular file system and passed
    to :func:`os.path.join`.  The filename returned is an ASCII only string
    for maximum portability.

    On windows systems the function also makes sure that the file is not
    named after one of the special device files.

    # >>> secure_filename("My cool movie.mov")
    'My_cool_movie.mov'
    # >>> secure_filename("../../../etc/passwd")
    'etc_passwd'
    # >>> secure_filename(u'i contain cool \xfcml\xe4uts.txt')
    'i_contain_cool_umlauts.txt'

    The function might return an empty filename.  It's your responsibility
    to ensure that the filename is unique and that you generate random
    filename if the function returned an empty one.

    .. versionadded:: 0.5

    :param filename: the filename to secure
    """
    if isinstance(filename, str):
        from unicodedata import normalize
        filename = normalize('NFKD', filename).encode('ascii', 'ignore')
        filename = filename.decode('ascii')

    for sep in os.path.sep, os.path.altsep:
        if sep:
            filename = filename.replace(sep, ' ')
    filename = str(re.compile(rf'[^A-Za-z0-9 _.-{additional_characters}]').sub('', filename)).strip('._')

    # on nt a couple of special files are present in each folder.  We
    # have to ensure that the target file is not such a filename.  In
    # this case we prepend an underline
    if os.name == 'nt' and filename and \
            filename.split('.')[0].upper() in (
            'CON', 'AUX', 'COM1', 'COM2', 'COM3', 'COM4', 'LPT1', 'LPT2', 'LPT3', 'PRN', 'NUL'):
        filename = '_' + filename

    return filename


def in_virtual_env():
    """
        determines whether the current process is running inside a virtual environment (python or virtualenv).
    """

    try:
        if sys.real_prefix:
            return True
    except AttributeError:
        pass
    return not (sys.prefix == sys.base_prefix)


def load_custom_module(config, module_name, subsystem="SYNC", method="PREFIX", fallback=False):
    """
    Loads a customer (project-) specific module from one of the custom directories.

    :param config: a Config object. In kiosk that would be a KioskConfig, in Sync a SyncConfig.
    :param module_name: the name of the module to load (without .py)
    :param subsystem: "SYNC" or "KIOSK"
    :param method: "PREFIX" if it is a single file,
                   "PACKET" if it is a directory. (currently not supported)
    :param fallback: if True and if no project-specific module exists a module with the prefix "default_" is tried.
                     currently only supported with method "PREFIX"!
    :return: the imported module or NONE
    """
    custom_base_path = ""
    if subsystem == "SYNC":
        custom_base_path = config.custom_sync_modules
    elif subsystem == "KIOSK":
        custom_base_path = config.get_custom_kiosk_modules_path()

    if custom_base_path:
        if method == "PREFIX":
            module_to_load = f"{config.get_project_id()}_{module_name}"
            module_path = custom_base_path
            if not os.path.isfile(os.path.join(module_path, module_to_load) + '.py'):
                if fallback:
                    module_to_load = f"default_{module_name}"

            if not os.path.isfile(os.path.join(module_path, module_to_load) + '.py'):
                logging.error(f"load_custom_module: {module_name} neither exists for {config.get_project_id()}"
                              f"nor as a default_ version in {custom_base_path}.")
                return None

        elif method == "PACKET":
            logging.error("load_custom_module: method \"PACKET\" not implemented yet. ")
            return None
        else:
            logging.error(f"load_custom_module: method {method} invalid.")
            return None

        if method:
            if module_path not in sys.path:
                sys.path.append(module_path)
            try:
                return importlib.import_module(module_to_load)
            except ModuleNotFoundError:
                logging.error(f"load_custom_module: Module {module_to_load} not found in {module_path}")
                return None
        else:
            logging.error(f"load_custom_module: Unknown parameter method={method}")
    else:
        logging.error(f"load_custom_module: Unknown parameter subsystem={subsystem}")
    return None


def get_parent_dir(kiosk_dir):
    """
    returns the full parent directory of directory
    :param kiosk_dir: the directory whose parent is needed
    :return: complete parent directory
    """
    return os.path.abspath(os.path.join(kiosk_dir, os.pardir))


def get_relative_path(filemaker_path, p):
    return os.path.relpath(p, filemaker_path)


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    """
    taken from https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits

    :param size: length of password to be generated
    :param chars: list of chars from which to chose the digits.
    :return: a random password of given size
    """
    return ''.join(random.choice(chars) for _ in range(size))


def calc_image_rect_to_fit_in(img_width, img_height, max_width, max_height):
    """
    recalcs a rect so that it fits within max_width * max_height by keeping aspect ratio
    :param img_width: width of the current rect
    :param img_height: height of current rect
    :param max_width: maximum width of the new rect
    :param max_height: maximum height of the new rect
    :return: the new image width and height
    """
    ratio = min((max_width / img_width), (max_height / img_height))
    if ratio >= 1.0:
        return img_width, img_height
    else:
        return int(round(img_width * ratio)), int(round(img_height * ratio))


def image_needs_scaling(img_width: int, img_height: int, dest_width: int, dest_height: int) -> bool:
    """
    Tests whether an image needs to be downscaled to fit into a destination rectangle.

    :param img_width:  The image's current width
    :param img_height: The image's current height
    :param dest_width: The requested width
    :param dest_height: The requested height
    :return: True if the image needs to be scaled to fit into the dest rectangle.
    """
    return bool(img_width > dest_width or img_height > dest_height)


def get_uuid_from_filename(path_and_filename):
    """
    extracts the filename without extension and returns it if it is a valid uuid4 or
    a valid filemaker uuid. Otherwise an exception is thrown.

    :param path_and_filename:
    :return: uuid
    """
    filename: str = basename(path_and_filename)
    if len(filename.split(".")) > 1:
        identifier = filename.split(".")[-2]
    else:
        identifier = filename

    if not check_uuid(identifier, accept_filemaker_too=True):
        raise Exception(
            f"get_uuid_from_filemaker: add_file_to_repository: {identifier} is not a valid UUID V4. "
            "File cannot be imported to file repository")

    return identifier.lower()


def get_valid_filename(s):
    """
    borrowed from django / get_valid_filename():
    Return the given string converted to a string that can be used for a clean
    filename. Remove leading and trailing spaces; convert other spaces to
    underscores; and remove anything that is not an alphanumeric, dash,
    underscore, or dot.
    >>> get_valid_filename("john's portrait in 2004.jpg")
    'johns_portrait_in_2004.jpg'
    """
    s = str(s).strip().replace(' ', '_')
    filename = re.sub(r'(?u)[^-\w.;]', '', s)
    if len(filename) > 128:
        ext = get_file_extension(filename)
        filename = ".".join([get_filename_without_extension(filename)[0:124], ext])

    return filename


def compare_datetimes(dt1, dt2, compare_time=True, compare_microseconds=True) -> int:
    """
        compares two datetimes.
    :param dt1: the first datetime
    :param dt2: the second datetime
    :param compare_time: should the time be compared, too? Otherwise it will be ignored.
    :param compare_microseconds: should the milliseconds count? Otherwise they will be ignored.
    :return: -1: dt1 is earlier (more in the past) than dt2
             0: they are equal
             1: dt1 is more recent than dt2
    """

    if not isinstance(dt1, datetime.datetime) or not isinstance(dt2, datetime.datetime):
        return -2

    if compare_time:
        if compare_microseconds:
            dtc1 = datetime.datetime(dt1.year, dt1.month, dt1.day, dt1.hour,
                                     dt1.minute, dt1.second, dt1.microsecond, null_val(dt1.tzinfo, None))
            dtc2 = datetime.datetime(dt2.year, dt2.month, dt2.day, dt2.hour,
                                     dt2.minute, dt2.second, dt2.microsecond, null_val(dt2.tzinfo, None))
        else:
            dtc1 = datetime.datetime(dt1.year, dt1.month, dt1.day, dt1.hour,
                                     dt1.minute, dt1.second, 0, null_val(dt1.tzinfo, None))
            dtc2 = datetime.datetime(dt2.year, dt2.month, dt2.day, dt2.hour,
                                     dt2.minute, dt2.second, 0, null_val(dt2.tzinfo, None))
    else:
        dtc1 = datetime.datetime(dt1.year, dt1.month, dt1.day, 0,
                                 0, 0, 0, null_val(dt1.tzinfo, None))
        dtc2 = datetime.datetime(dt2.year, dt2.month, dt2.day, 0,
                                 0, 0, 0, null_val(dt2.tzinfo, None))

    if dtc1 == dtc2:
        return 0
    else:
        td = (dtc1 - dtc2) / datetime.timedelta(microseconds=1)
        return int(math.copysign(1, td))


def uppercase_elements(lst: []) -> []:
    """
        returns a copy of a list of strings with uppercase elements
    :param lst: list with strings only.
    :return: list with those strings turned to uppercase
    """
    return [x.upper() for x in lst]


def lowercase_elements(lst: []) -> []:
    """
        returns a copy of a list of strings with lowercase elements
    :param lst: list with strings only.
    :return: list with those strings turned to lowercase
    """
    return [x.lower() for x in lst]


def get_file_path(filename):
    """
    returns the path of a string containing path and filename
    :param filename: something like "c:\asdfasdfa\asdfsdf\asdfsfd.bmp"
    :return: just the path without a trailing backslash or other path separator.
    """
    return os.path.dirname(filename)


def is_platform_admin():
    """
    tests (currently only under windows) if the user has admin privileges (UAC Admin rights).
    :return: True or False (where false occurs also when on a different platform than windows)
    """
    if platform.system().lower() == "windows":
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False
    else:
        return False


def delete_lines_from_file(path_and_filename, key_words: [], case_sensitive=True):
    """
    deletes lines form a file that contain one of the key words
    :param path_and_filename: path and filename to the file that is going to loose some lines
    :param key_words: a list of keywords. Lines in the file containing those keywords will be dropped
    :param case_sensitive: If set to False, case does not matter when searching for keywords
    :return: nothing, but raises Exception if things go wrong.
    """
    if key_words:
        with open(path_and_filename, "r") as f:
            lines = f.readlines()
        with open(path_and_filename, "w") as f:
            for line in lines:
                if not case_sensitive:
                    search_line = line.lower().strip("\n")
                else:
                    search_line = line.strip("\n")

                found = False
                for key in key_words:
                    if not case_sensitive:
                        key = key.lower()
                    if key in search_line:
                        found = True
                        break

                if not found:
                    f.write(line)


def get_directory_name_from_datetime():
    """
    creates a valid name from the current date and time (now()) that can be used as file or directory name.
    :return: a string
    """
    return get_valid_filename(str(datetime.datetime.now()))


def ts_to_str(ts: datetime.datetime):
    """
    converts a datetime.datetime to a string using "%Y-%m-%d %H:%M:%S.%f" as a format
    :param ts: a datetime
    :return: a string
    :exception All kinds of exceptions from datetime.datetime are possible
    """
    return datetime.datetime.strftime(ts, "%Y-%m-%d %H:%M:%S.%f")


def str_to_ts(s: str):
    """
    converts a string to a datetime.datetime using "%Y-%m-%d %H:%M:%S.%f" as a format
    :param s: a string
    :return: a datetime
    :exception All kinds of exceptions from datetime.datetime are possible
    """
    return datetime.datetime.strptime(s, "%Y-%m-%d %H:%M:%S.%f")


def get_dict_key_from_value(d: dict, v: str, case_insensitive: bool = False) -> str:
    """
    returns the key for the first value found in a dict
    :param d: the dict
    :param v: the value to search for
    :return: the key matching the value.
    :exception: Throws an IndexError if not found, can throw other exceptions
    """
    if case_insensitive:
        v = v.lower()
        for key, value in d.items():
            if value.lower() == v:
                return key
    else:
        for key, value in d.items():
            if value == v:
                return key

    raise IndexError


def remove_files_in_directory(folder, remove_sub_dirs=False):
    """
    removes all files in a given directory, even all subdirectories if requested.
    :param folder: the path including the directory
    :param remove_sub_dirs: set to true if you want to remove the sub directories as well
    :exception: throws all kinds of exceptions
    """
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif remove_sub_dirs and os.path.isdir(file_path):
            shutil.rmtree(file_path)


def now_as_str():
    """
    returns the current date and time as a string like "10 April 2020 10:22:12"
    note: This is not using time zones. Perhaps use kioskdatetimelib.get_utc_now_as_str()?
    :return: str
    """
    return datetime.datetime.now().strftime("%d %b %Y %H:%M:%S")


def get_unique_filename(temp_dir: str, filename: str = "", file_extension: str = "") -> str:
    """
    returns the fully qualified name of a temporary file in the given directory. The filename
    will be created using uuid4, so should be unique.
    :param temp_dir: the path in which the file will appear
    :param filename: optional: if given, this exact filename will be used.
    :param file_extension: if given (and no filename is given) this extension will be used.
    :return: path and filename of the temporary file.
    """
    if not os.path.isdir(temp_dir):
        raise NotADirectoryError(f"kioskstdlib.get_temp_file: {temp_dir} is not a directory")

    if not filename:
        filename = str(uuid4())
        if file_extension:
            if file_extension[:1] != ".":
                filename += "."
            filename += file_extension

    return os.path.join(temp_dir, filename)


def str_to_iso8601(date_arg: str):
    """
    returns a datetime.datetime from the iso8601 date string given
    :param date_arg: a string with an iso8601 date / time
    :return: datetime.datetime
    """
    return datetime.datetime.fromisoformat(date_arg)


def iso8601_to_str(timestamp, sep='T', timespec='auto'):
    """

    :param timestamp: datetime.datetime or datetime.date or datetime.time
    :param sep:
    :param timespec:
    :return:
    """
    if not timestamp:
        return ""
    else:
        if isinstance(timestamp, datetime.datetime):
            return timestamp.isoformat(sep=sep, timespec=timespec)
        else:
            return timestamp.isoformat()


def get_thread_id() -> int:
    """
    returns the current thread's id
    :return: the id, an int
    """
    return threading.current_thread().ident


def get_process_id() -> int:
    """
    returns the current process's id
    :return: the id, an int
    """
    return os.getpid()


def get_file_age_days(filename: str, now: datetime.datetime = None, use_most_recent_date=True,
                      use_modification_date=False):
    """
    returns the age of the file in days. If e.g.
    the delta is 1 day plus 1 hour, the return value is 2!
    :param self:
    :param filename: path and filename
    :param now: if not given, the age will be calculated using the current date and time.
                Otherwise this parameter is used.
    :return: the age in days
    :param use_most_recent_date: set to False if you want to use the oldest date of the file
                                 otherwise the most recent date (modification vs creation date) is used.
    :param use_modification_date: uses only and always the mtime of the file (the modification date)
    :raises: all kinds of exceptions. This does not check if the file exists!
    """
    if not now:
        now = datetime.datetime.now()
    if use_modification_date:
        file_date = datetime.datetime.fromtimestamp(os.path.getmtime(filename))
    elif use_most_recent_date:
        file_date = get_latest_date_from_file(filename)
    else:
        file_date = get_earliest_date_from_file(filename)
    delta = now - file_date
    return delta.days


def get_file_date_since_epoch(file: str, use_most_recent_date=True):
    """
    returns the milliseconds since the start of the epoch of a file's datetime.
    :param file: path and filename
    :return: the timestamp of the file in terms of milliseconds from the start of the epoch
    :param use_most_recent_date: set to False if you want to use the oldest date of the file
                                 otherwise the most recent date (modification vs creation date) is used.
    :raises: all kinds of exceptions. This does not check if the file exists!
    """
    if use_most_recent_date:
        file_date = get_latest_date_from_file(file)
    else:
        file_date = get_earliest_date_from_file(file)
    utc_ts = local_datetime_to_utc(file_date)
    ms_since_epoch = utc_datetime_since_epoch(utc_ts)
    return ms_since_epoch


def get_earliest_date_from_file(filename):
    """
    uses the earliest date (modification / creation date / access date) of the file as it is reported by
    the operating system. That should be the creation date.

    :param filename: path and filename
    :return: datetime.datetime
    :raises: all kinds of exceptions
    """

    ts = None
    ts = datetime.datetime.fromtimestamp(os.path.getctime(filename))
    ts2 = datetime.datetime.fromtimestamp(os.path.getmtime(filename))
    if ts2 < ts:  # for reasons I don't understand the modification date of a file is often earlier than the creation.
        ts = ts2

    return ts


def get_latest_date_from_file(filename):
    """
    uses the latest (the most recent) date (modification / creation / access date) of the file as it is reported by
    the operating system.

    :param filename: path and filename
    :return: datetime.datetime
    :raises: all kinds of exceptions
    """

    ts = None
    ts = datetime.datetime.fromtimestamp(os.path.getctime(filename))
    ts2 = datetime.datetime.fromtimestamp(os.path.getmtime(filename))
    if ts2 > ts:  # for reasons I don't understand the modification date of a file is often earlier than the creation.
        ts = ts2

    return ts


def set_file_date_and_time(path_and_filename: str, dt: datetime.datetime):
    """
    Set the creation, modification, and access times for a file to the specified
    date and time.

    This function updates the file timestamps (creation, modification, and access)
    based on the operating system. On Windows, it makes use of a specific
    function to adjust all three file timestamps. On non-Windows platforms, it
    updates the modification and access times using `os.utime`.

    :param path_and_filename: Absolute or relative path to the file whose
        timestamps are to be updated.
    :type path_and_filename: str
    :param dt: The date and time to set for the file timestamps. This datetime
        value is applied as the new timestamp.
    :type dt: datetime.datetime
    :return: None
    """
    if os.name == 'nt':
        set_file_datetimes_win(path_and_filename, [dt,dt,dt])
    else:
        dt_epoch = dt.timestamp()
        os.utime(path_and_filename, (dt_epoch, dt_epoch))

def is_windows() -> bool:
    """
    Determine if the code is running on a Windows operating system.

    This function checks the operating system of the machine where it is
    executed. It evaluates whether the operating system is of the type
    "Windows" by using the platform module instead of the Python's os module.

    :return: True if the operating system is Windows, otherwise False
    :rtype: bool
    """
    import platform
    return platform.system() == 'Windows'

def get_file_datetimes( filePath ):
    return ( os.path.getctime( filePath ),
         os.path.getmtime( filePath ),
         os.path.getatime( filePath ) )

def set_file_datetimes_win(path_and_filename: str, datetimes: List[datetime.datetime])->bool:
    """
    Sets the creation, modification, and access times for a given file on Windows
    systems. This function accepts datetime objects and converts them to the
    appropriate time format required for file attribute updates. The function
    will only execute successfully on Windows platforms.

    mostly copied from https://stackoverflow.com/a/43047398/11150752

    :param path_and_filename: The file path and name of the target file whose
        timestamps are to be modified.
    :type path_and_filename: str
    :param datetimes: A list containing three datetime objects in the
        following order: creation time, modification time, and access time.
        Each datetime object will be converted to the required file-time format.
    :type datetimes: List[datetime.datetime]
    :return: boolean
    """

    try :
        if os.name == 'nt':
            ctime = datetimes[0]
            mtime = datetimes[1]
            atime = datetimes[2]
            # handle datetime.datetime parameters
            if isinstance( ctime, datetime.datetime ) :
                ctime = time.mktime( ctime.timetuple() )
            if isinstance( mtime, datetime.datetime ) :
                mtime = time.mktime( mtime.timetuple() )
            if isinstance( atime, datetime.datetime ) :
                atime = time.mktime( atime.timetuple() )
            # # adjust for day light savings
            # now = time.localtime()
            # ctime += 3600 * (now.tm_isdst - time.localtime(ctime).tm_isdst)
            # mtime += 3600 * (now.tm_isdst - time.localtime(mtime).tm_isdst)
            # atime += 3600 * (now.tm_isdst - time.localtime(atime).tm_isdst)
            # change time stamps
            winfile = win32file.CreateFile(
                path_and_filename, win32con.GENERIC_WRITE,
                win32con.FILE_SHARE_READ | win32con.FILE_SHARE_WRITE | win32con.FILE_SHARE_DELETE,
                None, win32con.OPEN_EXISTING,
                win32con.FILE_ATTRIBUTE_NORMAL, None)
            win32file.SetFileTime( winfile, Time(ctime), Time(atime), Time(mtime) )
            winfile.close()
            return True
        else:
            raise Exception("call to set_file_datetime_win on a non-windows system.")

    except BaseException as e:
        logging.error(f"kioskstdlib.set_file_datetimes_win: {repr(e)}")
    return False

def remove_kiosk_subtree(dir_to_remove: str, base_path: str = "", delay=0) -> None:
    """
    removes a directory if it is a subdirectory of the project's base_path
    :param dir_to_remove: the FULL path to the directory to be removed
    :param base_path: the project's base path. If empty this method will fetch a base-path form the config
    :param delay: time to sleep after the removal in seconds
    :raises: All kinds of exceptions on failure
    """
    if os.path.isdir(dir_to_remove):
        if not base_path:
            from sync_config import SyncConfig
            cfg = SyncConfig.get_config()
            if not cfg:
                raise Exception("remove_kiosk_subtree: Config not accessible in remove_kiosk_subdir")
            base_path = cfg.base_path

        if not base_path:
            raise Exception("remove_kiosk_subtree: not base-path in remove_kiosk_subdir")

        if dir_to_remove.startswith(base_path) and base_path.lower() != dir_to_remove.lower():
            shutil.rmtree(dir_to_remove)
            if delay:
                time.sleep(delay)
        else:
            raise Exception(f"remove_kiosk_subtree: {dir_to_remove} is not a sub-dir of {base_path}")


def get_datetime_template_filename(filename_template: str, dt: datetime.datetime = None) -> str:
    """
    substitutes datetime template characters with the current date and time and returns the filename.
    Follows the strftime formatting BUT replaces "#" characters with "%" characters.
    :param filename_template: the template. e.G. urap_#a_#d#m#y-#H#M.log
    :param dt: a datetime.datetimte timestamp. If None now() will be used.
    :return: the filename with the current date e.g. urap_Tue_22032022-1119.log

    :note that if dt is not given, this is using datetime.now()
        which creates a time in whatever time zone Python thinks is on.
    """
    filename_template = filename_template.replace("#", "%")
    if not dt:
        dt = datetime.datetime.now()
    filename = datetime.datetime.strftime(dt, filename_template)
    return filename


def get_zip_compression_method(compression_method) -> int:
    """
    returns the compression method (as pyzip wants it) from one of these strings: LZMA, BZIP2, DEFLATED
    :param compression_method: the compression method constant for pyzip
    :return:
    """
    compression_method = compression_method.upper()
    if compression_method == "LZMA":
        return zipfile.ZIP_LZMA
    if compression_method == "BZIP2":
        return zipfile.ZIP_BZIP2
    elif compression_method == "DEFLATED":
        return zipfile.ZIP_DEFLATED


def to_bool(v) -> bool:
    """
    returns boolean true or false if v is a string that contains "true" or "false" or returns
    v interpreted as bool
    """
    if isinstance(v, str):
        return v.lower() == "true"
    else:
        return bool(v)


def replace_keys(dc: dict, keys: list, value: str = ""):
    """
    replaces all values in the dictionary that belong to a key in the keys list with a new value.
    recursive! If a key refers to a dictionary that dictionary will be searched, too.
    :param dc: the dictionary that will be modified
    :param keys: the keys whose values will be replaced
    :param value: the value that will be set for each of the key's value
    """

    def r_replace_keys(sub_dict: dict, c_depth=0):
        if not isinstance(sub_dict, dict):
            return
        if c_depth > 20:
            return
        for k in keys:
            if k in sub_dict:
                sub_dict[k] = value

        for k in sub_dict.keys():
            r_replace_keys(sub_dict[k], c_depth + 1)

    r_replace_keys(dc)
    return dc


def copytree(src: str, dst: str, only_modified_files: bool, only_different_size: bool = False,
             ignore: list = None,
             symlinks=False,
             _on_progress: Union[Callable[[str], bool], None] = lambda x: True) -> int:
    """
    copies all file from a source directory tree to a dest directory. Directories that don't exist will be created.
    inspired by Cyrille Pontvieux
    (https://stackoverflow.com/questions/1868714/how-do-i-copy-an-entire-directory-of-files-into-an-existing-directory-using-pyth)

    :param src: source directory
    :param dst: dest directory
    :param only_modified_files: copy only modified or new files.
    :param only_different_size: copy only files with different size (or new files).
    :param ignore: list of lowercase! strings with names of files or directories to be ignored.
    :param symlinks: treat symlinks (default is False)
    :param _on_progress: optional callback that takes a string and returns a bool.
                         If the bool is false, the method will stop
    :returns: the number of files copied (does not count directories).
    :raises InterruptedError: if at some point _on_progress returns False
    :raises : whatever other Exception gets raised.
    """
    c_files = 0
    if not os.path.exists(dst):
        os.makedirs(dst)
        shutil.copystat(src, dst)
    if not ignore:
        ignore = []

    lst = os.listdir(src)
    for item in lst:
        if item.lower() not in ignore:
            s = os.path.join(src, item)
            d = os.path.join(dst, item)
            if _on_progress:
                if not _on_progress(s):
                    raise InterruptedError("Operation interrupted by user")
            if symlinks and os.path.islink(s):
                if os.path.lexists(d):
                    os.remove(d)
                os.symlink(os.readlink(s), d)
                try:
                    st = os.lstat(s)
                    mode = stat.S_IMODE(st.st_mode)
                    os.lchmod(d, mode)
                except:
                    pass  # lchmod not available
            elif os.path.isdir(s):
                c_files += copytree(s, d, only_modified_files, only_different_size, ignore, symlinks, _on_progress)
            else:
                if not os.path.exists(d) \
                        or ((not only_modified_files or os.stat(s).st_mtime_ns - os.stat(d).st_mtime_ns > 100000000)
                            and (not only_different_size or os.path.getsize(s) != os.path.getsize(d))):
                    shutil.copy2(s, d)
                    c_files += 1
    return c_files


def clear_dir(src: str):
    """
    deletes all files in a directory. Not recursive and does not delete the directory itself.
    :param src: the directory.
    """
    if len(str(src)) < 4:
        raise ValueError(f"{src} should be longer than 3 characters")
    if os.path.isdir(src):
        lst = os.listdir(src)
        for item in lst:
            s = os.path.join(src, item)
            if not os.path.islink(s) and not os.path.isdir(s):
                os.remove(s)
    else:
        raise ValueError(f"{src} is not a directory")


def get_ip_addresses(must_include='192.168', debug_log=False):
    addresses = []
    try:
        try:
            import netifaces
        except BaseException as e:
            logging.info(f"kioskstdlib.get_ip_addresses: netifaces module not installed.")
            return []

        if debug_log:
            logging.debug(f"get_ip_addresses: Searching network interfaces ...")
        for dev in netifaces.interfaces():
            try:
                if debug_log:
                    logging.debug(f"get_ip_addresses: Found device {pformat(dev)}:")
                address = netifaces.ifaddresses(dev)[netifaces.AF_INET]
                if debug_log:
                    if address:
                        logging.debug(f"                  {pformat(address)}")
                    else:
                        logging.debug(f"                  No information available.")
                for part in address:
                    if 'addr' in part:
                        if must_include and (part['addr'].find(must_include) > -1):
                            addresses.append(part['addr'])
            except BaseException as e:
                if debug_log:
                    if "KeyError(2)" in repr(e):
                        logging.debug(f"                  Device has no IP addresses")
                    else:
                        logging.debug(f"                  Could not get more information: {repr(e)} ")
    except BaseException as e:
        logging.error(f"kioskstdlib.get_ip_addresses: {repr(e)}")

    if debug_log:
        logging.debug(f"get_ip_addresses: {len(addresses)} network addresses found.")

    return addresses


def delete_any_of(s: str, illegal_characters: str):
    characters = set(illegal_characters)
    result = ""
    for c in s:
        if c not in characters:
            result += c

    return result


def in_virtual_env():
    """
        determines whether the current process is running inside a virtual environment (python or virtualenv).
    """

    try:
        if sys.real_prefix:
            return True
    except AttributeError:
        pass
    return not (sys.prefix == sys.base_prefix)


def erase_esc_seq(s: str) -> str:
    """
    erases all console escape sequences from the string. "\u001b;1;2;3mmeins\u001b0m" comes back as 'meins'
    :param s: input string with escape sequences
    :return: string without sequences
    """
    return re.sub('\u001b.+?m', '', s)


def escape_backslashs(s: str) -> str:
    """
    duplicates all backslashs
    :param s: input string with
    :return: string with duplicate backslashs
    """
    return s.replace("\\", "\\\\")


def adjust_tuple(in_tuple: tuple, length: int, default) -> tuple:
    """
    adjusts the length of a tuple.
    It either shrinks the tuple to the given length or fills it up with the default value.
    :param in_tuple: the tuple
    :param length: the required length
    :param default: the default value in case it needs to be filled up
    :return: the adjusted tuple
    """
    if len(in_tuple) == length:
        return in_tuple
    return tuple([in_tuple[x] if x < len(in_tuple) else default
                  for x in range(0, length)])


def get_secure_windows_sub_path(sub_path: str) -> str:
    """
    returns a subdirectory path even if fed a static path (including a drive or path that starts with \\).
    This is windows-specific and works only with \\
    :param sub_path: a path
    :return: a relative path without a leading \
    """
    regex = r"^\s*((.*):)?([\\|\s]*)(?P<path>.+?)\s*$"

    match = re.match(regex, sub_path)
    if match:
        regex_path = match.group("path")
        if regex_path:
            return regex_path
    return ""


def get_kiosk_semantic_version(version: str) -> (str, str):
    """
    returns the generation and semantic version of a kiosk version. A kiosk version has an additional leading generation
    version number that is incompatible with the semantic version.
    :param version: either a 4 digit kiosk version or a 3 digit semantic version.
    :return: a tuple consisting of the generation and semantic version. Can throw Exceptions and returns "","" if
             it cannot figure out a correct sematic version
    """
    if re.fullmatch(r'^(\d+)\.(\d+)$', version):
        version = version + ".0"
    if re.fullmatch(r'^(\d+)\.(\d+)\.(\d+)$', version):
        version = version + ".0"
    rc = re.fullmatch(r'^(?P<generation>\d+)\.(?P<version>(\d+)\.(\d+)\.(\d+))$', version)
    if rc:
        if rc.group("version"):
            return rc.group("generation"), rc.group("version")

    return "", ""


def cmp_semantic_version(version1: str, version2: str) -> int:
    """
    compares two semantic versions (something like 1.0.0).
    Additionally deals with kiosk versions which have an extra leading generation number
    :param version1: a semantic or kiosk version number
    :param version2:a semantic or kiosk version number
    :return: -1: version 1 is smaller than version 2, 1: version 1 is bigger than version 2, 0 if they are equal
    """

    if re.fullmatch(r'^(?P<generation>\d+)\.(?P<version>(\d+)\.(\d+)\.(\d+))$', version1) or re.fullmatch(
            r'^(?P<generation>\d+)\.(?P<version>(\d+)\.(\d+)\.(\d+))$', version2):
        generation_1, sv1 = get_kiosk_semantic_version(version1)
        generation_2, sv2 = get_kiosk_semantic_version(version2)
        if not generation_1 or not generation_2:
            raise ValueError(f"One of the versions is not compatible: {version1}, {version2}")
        generation_1 = int(generation_1)
        generation_2 = int(generation_2)
        if generation_1 < generation_2:
            return -1
        if generation_1 > generation_2:
            return 1
        version1 = sv1
        version2 = sv2
    else:
        if re.fullmatch(r'^(\d+)\.(\d+)$', version1):
            version1 = version1 + ".0"
        if re.fullmatch(r'^(\d+)\.(\d+)$', version2):
            version2 = version2 + ".0"

    try:
        v1 = Version(version1)
    except BaseException as e:
        logging.error(f"kioskstdlib.cmp_semantic_version: Version 1 ({version1}) is not valid: {repr(e)}")
        raise e
    try:
        v2 = Version(version2)
    except BaseException as e:
        logging.error(f"kioskstdlib.cmp_semantic_version: Version 2 ({version2}) is not valid: {repr(e)}")
        raise e

    return -1 if v1 < v2 else (1 if v1 > v2 else 0)


def force_positive_int_from_string(param: str, ignore_non_digit_strings=True) -> int:
    """
    returns a positive int cobbled together from all the digits in the string.
    :param ignore_non_digit_strings: If False a ValueError exception is raised if a string has not digits at all
    :return: -1 if the string does not contain any digits
    """
    result = ''.join(filter(str.isdigit, param))
    if not ignore_non_digit_strings and not result:
        raise ValueError(f'{param} does not have a single digit')
    return int(result) if result else -1


def get_printable_chars(s: Union[str, bytes]) -> str:
    """
    Returns a list of printable characters in the given string or byte array.

    :param s: The input string or byte array.

    :return: list: A list of printable characters.
    """
    if not isinstance(s, str) and not isinstance(s, bytes):
        raise TypeError("Input must be a string")
    return "".join([chr(c) for c in s if chr(c).isprintable()])


def load_python_module(source, module_name):
    """
    reads file source and loads it as a module

    :param source: file to load
    :param module_name: name of module to register in sys.modules
    :return: loaded module
    """

    if module_name is None:
        return None

    if module_name in sys.modules:
        del sys.modules[module_name]

    spec = importlib.util.spec_from_file_location(module_name, source)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)

    return module

def get_kiosk_version_from_file(kiosk_version_file_path):
    """
        retrieves the Kiosk version from the file "kiosk.version" in the root directory of Kiosk.
        :param kiosk_version_file_path: path and filename of the version file
        todo: Not implemented, yet.
    """
    raise NotImplementedError
