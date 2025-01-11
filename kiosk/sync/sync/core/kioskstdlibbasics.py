import logging
import os

""" kioskstdlib basics
    This part of kioskstdlib needs no external python packages installed.
    Make sure that only standard python modules are imported.
"""



def get_parent_dir(kiosk_dir):
    """
    returns the full parent directory of directory
    :param kiosk_dir: the directory whose parent is needed
    :return: complete parent directory
    """
    return os.path.abspath(os.path.join(kiosk_dir, os.pardir))

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

def get_file_path(filename):
    """
    returns the path of a string containing path and filename
    :param filename: something like "c:\asdfasdfa\asdfsdf\asdfsfd.bmp"
    :return: just the path without a trailing backslash or other path separator.
    """
    return os.path.dirname(filename)
