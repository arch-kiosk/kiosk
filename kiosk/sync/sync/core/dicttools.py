import copy
from collections.abc import Mapping


def dict_merge(dct, merge_dct):
    # Recursive dictionary merge
    # Copyright (C) 2016 Paul Durivage <pauldurivage+github@gmail.com>
    #
    # This program is free software: you can redistribute it and/or modify
    # it under the terms of the GNU General Public License as published by
    # the Free Software Foundation, either version 3 of the License, or
    # (at your option) any later version.
    #
    # This program is distributed in the hope that it will be useful,
    # but WITHOUT ANY WARRANTY; without even the implied warranty of
    # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    # GNU General Public License for more details.
    #
    # You should have received a copy of the GNU General Public License
    # along with this program.  If not, see <https://www.gnu.org/licenses/>.
    #
    # Lutz: Just turned it into Python 3 and made sure that merge_dct
    # will not be modified later when dct gets modified.
    #
    """ Recursive dict merge. Inspired by :meth:``dict.update()``, instead of
    updating only top-level keys, dict_merge recurses down into dicts nested
    to an arbitrary depth, updating keys. The ``merge_dct`` is merged into
    ``dct``.

    :param dct: dict onto which the merge is executed
    :param merge_dct: dct merged into dct
    :return: None
    """
    for k, v in merge_dct.items():
        if (k in dct and isinstance(dct[k], dict)
                and isinstance(merge_dct[k], Mapping)):
            dict_merge(dct[k], merge_dct[k])
        else:
            dct[k] = copy.deepcopy(merge_dct[k])


def dict_search(search_dict, key_to_find, cache=None):
    """
      Cached brute force search for a key in a hierarchy of dicts.
      If a cache is given then the key will be searched in the cache first.
      If cache is not given or the key not found in the cache, the hierarchy of dicts
      will be searched. Once the key is found the key value pair will be added to the cache (if given)
      and then returned to the caller at once. The values of a level will be searched first and only if
      nothing can be found a new level of recursion will be started.
    """
    def inner_search(search_dict, key_to_find):
        try:
            value = search_dict[key_to_find]
            if not isinstance(value, dict):
                return value
        except KeyError:
            pass

        for key, value in search_dict.items():
            if isinstance(value, dict):
                rc = inner_search(value, key_to_find)
                if rc:
                    return rc

        return None

    if cache:
        try:
            found_value = cache[key_to_find]
            return found_value
        except KeyError as e:
            pass

    found_value = inner_search(search_dict, key_to_find)
    if cache and found_value:
        cache[key_to_find] = found_value

    return found_value


def dict_recursive_substitute(dict_to_traverse, method_to_call):
    """
    traverses through a dict and calls method_to_call on every key that is not
    pointing to a dict itself. if method_to_call returns something != None this will be
    the new key.

    :param dict_to_traverse:
    :param method_to_call:
    :return:
    """
    for key, value in dict_to_traverse.items():
        if isinstance(value, dict):
            dict_recursive_substitute(value, method_to_call)
        else:
            v = method_to_call(key, value)
            if v:
                dict_to_traverse[key] = v

