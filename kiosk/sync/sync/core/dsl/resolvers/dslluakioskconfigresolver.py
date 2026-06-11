import logging
from typing import List

import kioskstdlib
from config import Config
from dsl.kioskdsllupa import LazyResolverContinue, LazyResolverStop
from dsl.resolvers.dslluametaresolver import NamedDSLLuaResolver
from sync_config import SyncConfig


class DSLLuaKioskConfigResolver(NamedDSLLuaResolver):

    def __init__(self, config: SyncConfig, resolver_root_name="config"):
        self._config = config.config_dict
        super().__init__(resolver_root_name)

    def __call__(self, path):
        # The resolver only knows the root entry point
        if path == "exists":
            raise LazyResolverContinue
        return super().__call__(path)

    def resolve(self, path_elements: List):
        self.err = False
        if len(path_elements) == 1 and path_elements[0] == "exists":
            raise LazyResolverContinue
        try:
            v = kioskstdlib.get_nested_dict_value_by_path(self._config,path_elements)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.resolve: Error resolving {'.'.join(path_elements)}: {repr(e)}")
            self.err = True
            raise LazyResolverStop

        if v is None:
            raise LazyResolverContinue

        return v


    def call_function(self, path, *args):
        if path[-1] == "exists":
            key = args[-1].split(".")
            try:
                kioskstdlib.get_nested_dict_value_by_path(self._config,key)
                return True
            except BaseException as e:
                return False
        self.err = True
        raise LazyResolverStop
