from collections import OrderedDict
from functools import reduce
import logging


class ManipulationImageCache:
    POS_COUNT = 0
    POS_IMAGE = 1

    def __init__(self, cache_size: int = 5):
        self._cache_size: int = cache_size
        self._img_cache = OrderedDict()

    def add(self, index: [], img):
        """
        adds an image under the list given as index. The index will be translated into a string with the
        list elements separated by "#". Make sure that you do not use "#" as one of the list elements.
        :param index: list with elements, none of which should contain a "#"
        :param img: some object
        """
        str_index = self._get_str_index(index)
        if len(self._img_cache) == self._cache_size:
            self._free_one()
        self._img_cache[str_index] = (1, img)
        self._img_cache.move_to_end(str_index)

    def get(self, index: []):
        """
        returns the object according to the index.

        :param index: The index can consist of several list elements, but
        none of them should use a "#".
        :return: the object stored under index.
        :exception raises a KeyError exception if the index is unknown.
        """
        cache_element, str_index = self.get_cache_entry(index)
        img = cache_element[self.POS_IMAGE]
        self._increase_counter(index)
        logging.debug(f"Used cached image {index}")

        return img

    def _increase_counter(self, index):
        cache_element, str_index = self.get_cache_entry(index)
        new_cache_element = (cache_element[self.POS_COUNT] + 1, cache_element[self.POS_IMAGE])
        self._img_cache[str_index] = new_cache_element

    def get_cache_entry(self, index):
        """
        returns the actual entry in the cache, which is a tuple of the form
        (COUNT, IMAGE) with count being the number of accesses to this cache entry and the cached image
        :param index: The index can consist of several list elements, but
        none of them should use a "#".
        :return: cache_element: the tuple that is stored in the cache, str_index: the stringified index for further use.
        """
        str_index = self._get_str_index(index)
        cache_element = self._img_cache[str_index]
        return cache_element, str_index

    @staticmethod
    def _get_str_index(index):
        str_index = reduce((lambda x, y: x + "#" + str(y)), index)
        return str_index

    def _free_one(self):
        if len(self._img_cache) > 0:
            values = list(self._img_cache.values())
            min_value = values[0][self.POS_COUNT]
            min_idx = 0
            for i in range(1, len(values) - 1):
                if values[i][self.POS_COUNT] < min_value:
                    min_idx = i
                    min_value = values[i][self.POS_COUNT]
            key = list(self._img_cache.keys())[min_idx]

            del self._img_cache[key]

    def debug_out(self):
        logging.debug("---- manipulation cache ----")
        for element in self._img_cache:
            logging.debug(f"{element}: {self._img_cache[element][0]}")
        logging.debug("----------------------------")
