from typing import List

from dsl.kioskdsllupa import KioskDSLLuaResolver, LazyResolverContinue, LazyResolverStop


class NamedDSLLuaResolver(KioskDSLLuaResolver):
    def __init__(self, name: str):
        self.err = False
        self.name = name

class DSLLuaMetaResolver(KioskDSLLuaResolver):
    def __init__(self, resolvers:List=None):
        self.err=False
        self._resolvers = {}
        if resolvers:
            for resolver in resolvers:
                self.add_resolver(resolver)

    def __call__(self, path):
        # The resolver only knows the root entry point
        # if path == "exists":
        #     raise LazyResolverContinue
        return super().__call__(path)

    def add_resolver(self,resolver: KioskDSLLuaResolver):
        resolver_name = resolver.name if hasattr(resolver, "name") and resolver.name else resolver.__class__.__name__
        self._resolvers[resolver_name] = resolver

    def resolve(self, path_elements: List):
        self.err = False
        try:
            if len(path_elements) == 1 and path_elements[0] in self._resolvers.keys():
                raise LazyResolverContinue

            if len(path_elements) > 1:
                resolver = self._resolvers[path_elements[0]]
                rc = resolver.resolve(path_elements[1:])
                self.err = self.err or (resolver.err if hasattr(resolver, "err") else False)
                return rc

        except LazyResolverContinue as e:
            raise e
        except BaseException as e:
            self.err = True
            raise e

        self.err = True
        raise LazyResolverStop


    def call_function(self, path, *args):
        if len(path) > 1:
            resolver = self._resolvers[path[0]]
            try:
                return resolver.call_function(path[1:], *args)
            except BaseException as e:
                raise e
        self.err = True
        raise LazyResolverStop
