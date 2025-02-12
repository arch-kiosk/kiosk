import logging
import os
import re

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

def resolve_symbols(term:str, symbol_dict: dict, error_unknown_symbol = False)->str:
    """
    resolves %% symbols in a string by replacing them with a value from the dict.
    %% symbols that cannot be resolved are replaced with !symbol!.

    This is not recursive and more or less an exact copy of config._resolve_symbols, which does not use this here
    because config is not allowed to import any non-standard modules.

    :param term: str
    :param symbol_dict: dict
    :param error_unknown_symbol: Set to True if this is supposed to throw an error if a symbol cannot be resolved. 
    :return: str
    """

    c = 0
    if term:
        rx_symbol = re.compile(r"(%.*?%)", re.I)
        next_symbol = rx_symbol.search(term)
        while next_symbol:
            c += 1
            if c > 10:
                logging.error("resolve_symbols_in_string exceed depth of 10")
                return None

            key = next_symbol.group(0)[1:-1]
            if key in symbol_dict:
                value = symbol_dict[key]
            else:
                if error_unknown_symbol:
                    raise KeyError(f"Symbol {key} unknown in {term}")
                value = "!" + next_symbol.group(0)[1:-1] + "!"

            try:
                term = term.replace(next_symbol.group(0), value)
            except BaseException as e:
                raise Exception(f"resolve_symbols: Exception {repr(e)} in {term}")
            next_symbol = rx_symbol.search(term)
    return term

