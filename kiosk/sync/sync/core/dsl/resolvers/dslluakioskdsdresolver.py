import logging
from typing import List

from dsd.dsd3 import DataSetDefinition
from dsl.kioskdsllupa import LazyResolverContinue, LazyResolverStop
from dsl.resolvers.dslluametaresolver import NamedDSLLuaResolver


class DSLLuaKioskDSDResolver(NamedDSLLuaResolver):

    def __init__(self, dsd: DataSetDefinition, resolver_root_name="DSD"):
        self._dsd = dsd
        super().__init__(resolver_root_name)

    def __call__(self, path):
        # The resolver only knows the root entry point
        if path == "exists":
            raise LazyResolverContinue
        return super().__call__(path)

    def resolve(self, path_elements: List):
        self.err = False
        if len(path_elements) == 1:
            if path_elements[0] == "exists":
                raise LazyResolverContinue

        self.err = True
        raise LazyResolverStop



    def call_function(self, path, *args):
        if path[-1] == "exists":
            keys = args[-1].split(".")
            try:
                if len(keys) == 1:
                    # that's an exists(table)
                    return self._dsd.table_is_defined(keys[0])
                elif len(keys) == 2:
                    # that's an exists(table.field or table.instruction)
                    return self._dsd.get_field_or_instructions(keys[0], keys[1])
            except BaseException as e:
                self.err = True
                raise LazyResolverStop(repr(e))
        self.err = True
        raise LazyResolverStop
