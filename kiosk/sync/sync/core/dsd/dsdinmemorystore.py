from typing import List

from dsd.dsdstore import DSDStore
import logging
import pprint


class DSDInMemoryStore(DSDStore):
    def __init__(self):
        self._dsd_data = {}

    def get(self, index: List):
        current_position = self._dsd_data
        for idx in index:
            current_position = current_position[idx]

        return current_position

    def set(self, index: List, value):
        current_position = self._dsd_data
        if not index:
            if isinstance(value, dict):
                self._dsd_data = value
                return self._dsd_data
            else:
                raise IndexError("If not index is given, value must be a dictionary.")
        else:
            last_idx = index.pop()
            for idx in index:
                current_position = current_position[idx]
            current_position[last_idx] = value
            return current_position[last_idx]

    def merge(self, index, value: dict) -> dict:
        own_data = self.get(index)
        if not index:
            if "config" in own_data and "config" in value:
                merged_config = {**own_data["config"], **value.pop("config")}
                own_data["config"] = merged_config

        merged = {**own_data, **value}
        return self.set(index, merged)

    def get_keys(self, index: List) -> List:
        try:
            return list(self.get(index).keys())
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_keys: Error accessing index {index}: {repr(e)}")
            raise e

    def delete(self, index: List) -> List:
        current_position = self._dsd_data
        if not index:
            return None
        else:
            last_idx = index.pop()
            for idx in index:
                current_position = current_position[idx]
            deleted = current_position.pop(last_idx)
            return deleted

    def clear(self) -> None:
        self._dsd_data.clear()

    def pprint(self, key="", width=200) -> str:
        pp = pprint.PrettyPrinter(width=width)
        if key:
            data = {key: self._dsd_data[key]}
        else:
            data = self._dsd_data

        return pp.pformat(data)
