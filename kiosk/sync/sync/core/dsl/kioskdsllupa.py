from __future__ import annotations

import logging
import operator
from typing import Callable, List, Union

from dsl.kioskdsl import KioskDSL, KioskDSLException

try:
    import lupa.lua54 as lupa
except ImportError:
    import lupa

class LazyResolverContinue(Exception):
    pass

class LazyResolverStop(Exception):
    pass

class KioskDSLLuaResolver:
    @staticmethod
    def split_lua_dot_notation(s: str):
        parts = []
        current = []
        stack = []
        in_string = False
        string_char = None
        escape = False

        for i, c in enumerate(s):
            if escape:
                current.append(c)
                escape = False
                continue
            if c == '\\':
                escape = True
                current.append(c)
                continue
            if c in ('"', "'") and not stack:
                if in_string and c == string_char:
                    in_string = False
                    string_char = None
                elif not in_string:
                    in_string = True
                    string_char = c
                current.append(c)
                continue
            if in_string:
                current.append(c)
                continue
            if c in '([{':
                stack.append(c)
                current.append(c)
            elif c in ')]}':
                if stack:
                    stack.pop()
                current.append(c)
            elif c == '.' and not stack:
                parts.append(''.join(current))
                current = []
            else:
                current.append(c)
        if current:
            parts.append(''.join(current))
        return parts

    def resolve(self, path_elements: List):
        raise NotImplementedError

    def __call__(self, path):
        path_elements = self.split_lua_dot_notation(path)
        try:
            return self.resolve(path_elements)
        except LazyResolverContinue as e:
            raise e
        except LazyResolverStop as e:
            raise e
        except BaseException as e:
            logging.debug(f"{self.__class__.__name__}.__call__: resolve threw an Exception {repr(e)}")
            raise LazyResolverStop


    def call_function(self, path_elements: List, *args):
        raise NotImplementedError

    def execute(self, path, *args):
        try:
            path_elements = self.split_lua_dot_notation(path)
            return self.call_function(path_elements, args)
        except LazyResolverContinue as e:
            raise e
        except LazyResolverStop as e:
            raise e
        except BaseException as e:
            logging.debug(f"{self.__class__.__name__}.execute: eval threw an Exception {repr(e)}")

        return None

class KioskDSLLua(KioskDSL):
    MAX_MEM = 10 * 1024 * 1024

    def kiosk_python_resolver(self, key:str):
        if not self._on_get:
            return None

        return self.LazyResolver(self).resolve(key)

    class LazyResolver:
        def __init__(self, dsl: KioskDSLLua, path=None):
            self.dsl = dsl
            self._path=path if path else []
            self._cache = {}
            # This lists all the methods of the LazyResolver that can be called by LUA chunks.
            # These methods take precedent over methods that are provided by dsl._on_get!
            self._callable_methods = ["resolve_to_bool"]

        def resolve(self, key):
            if not "_path" in self.__dict__ and "dsl" in self.__dict__:
                raise AttributeError
            print("_path is", self._path)
            self._path.append(key)
            try:
                return self.dsl.on_get(".".join(self._path))
            except LazyResolverContinue:
                return self.__class__(self.dsl, path = self._path)
            except LazyResolverStop:
                return None

        # this can be called from within LUA, that's why it is in "_callable_methods"
        def resolve_to_bool(self, key):
            if type(key) is self.__class__:
                return False
            return bool(key)

        def __bool__(self):
            logging.debug(f"{self.__class__.__name__}.__bool__: called for [{self._path}]")
            # val = self._source(self._path) if self._is_global else self._source
            # return val is not None and val != "__INVALID__"

        # def __len__(self):
        #     print(f"__len__ called for [{self._path}]")

        def __getattr__(self, name):
            print("__getattr__ called with ", name)
            if name.startswith("_"):
                if name.startswith("__getitem"):
                    raise AttributeError()
                # raise KeyError(f"_ - access of {name}")
            if name in self._cache:
                return self._cache[name]
            if name in self.__dict__:
                print("__getattr__ found ", name)
                return self.name
            self._cache[name] = self.resolve(name)
            return self._cache[name]

        def __call__(self, *args):
            result = None
            actual_args = args
            if len(self._path) == 1 and self._path[0] in self._callable_methods:
                # result = self.resolve_to_bool(*actual_args)
                caller = operator.methodcaller(self._path[0], *actual_args)
                result = caller(self)
            else:
                if args:
                    if hasattr(args[0], '_path') and self._path:
                        logging.debug(f"{self.__class__.__name__}.__call__: Got a LazyResolver as an args[0].")
                        # actual_args = args[1:]
                if hasattr(self.dsl.on_get, 'execute'):
                    result = self.dsl.on_get.execute(".".join(self._path), *actual_args)
                elif callable(self.dsl.on_get):
                    actual_args = args[1:]
                    result = self.dsl.on_get(*actual_args)

            return result

    # def _gemini_python_resolver(self, key: str):
    #     """
    #     The bridge between Lua global lookup and Python.
    #     Uses the Proxy factory to resolve values or create optimistic paths.
    #     """
    #     if not self._on_get:
    #         return None
    #
    #     # We call the 'create' factory with is_global=True.
    #     # 1. If key 'x' is 2, this returns the integer 2.
    #     # 2. If key 'unit' is a dict, this returns a Local Proxy.
    #     # 3. If key 'unit' is missing, this returns an Optimistic Global Proxy.
    #     # 4. If key 'unit' is __INVALID__, this returns None (Lua nil).
    #     return self.GeminiLazyPath.create(
    #         source=self._on_get,
    #         path="",
    #         key=key,
    #         is_global=True,
    #         root=None
    #     )
    #
    # class GeminiLazyPath:
    #     def __init__(self, source, path="", is_global=True, root=None):
    #         self._source = source
    #         self._path = path
    #         self._is_global = is_global
    #         self._root = root or self
    #         self._cache = {}
    #
    #     @classmethod
    #     def create(cls, source, path, key, is_global, root):
    #         if key:
    #             if is_global:
    #                 lookup_path = f"{path}.{key}" if path else key
    #                 val = source(lookup_path) if callable(source) else None
    #                 out_path, out_global = lookup_path, True
    #             else:
    #                 if isinstance(source, dict):
    #                     val = source.get(key, "__INVALID__")
    #                 else:
    #                     val = getattr(source, key, "__INVALID__")
    #                 out_path, out_global = "", False
    #         else:
    #             val, out_path, out_global = source, path, is_global
    #
    #         if val == "__INVALID__": return None
    #         if isinstance(val, (int, float, str, bool)) and val is not None:
    #             return val
    #         if val is None:
    #             return cls(source, out_path, True, root) if out_global else None
    #         return cls(val, "", False, root)
    #
    #     def exists(self):
    #         """Explicitly check if the optimistic _path resolves to data."""
    #         return self.__bool__()
    #
    #     def __getattr__(self, name):
    #         if name.startswith('_'): raise AttributeError(name)
    #         if name in self._cache: return self._cache[name]
    #         res = self.create(self._source, self._path, name, self._is_global, self._root)
    #         self._cache[name] = res
    #         return res
    #
    #     def __call__(self, *args):
    #         is_colon = False
    #         if args:
    #             if args[0] is self or args[0] is self._root:
    #                 is_colon = True
    #             elif hasattr(args[0], '_path') and self._path:
    #                 if args[0]._path == self._path:
    #                     is_colon = True
    #
    #         actual_args = args[1:] if is_colon else args
    #
    #         if self._is_global and len(actual_args) == 1 and isinstance(actual_args[0], str):
    #             return self.create(self._source, self._path, actual_args[0], True, self._root)
    #
    #         if self._is_global and hasattr(self._source, 'execute'):
    #             result = self._source.execute(self._path, *actual_args)
    #             return self.create(result, "", "", False, self._root)
    #
    #         if not self._is_global and callable(self._source):
    #             result = self._source(*actual_args)
    #             return self.create(result, "", "", False, self._root)
    #
    #         if not actual_args:
    #             raw = self._source(self._path) if self._is_global else self._source
    #             return self.create(raw, "", "", False, self._root)
    #         return None
    #
    #     def __bool__(self):
    #         val = self._source(self._path) if self._is_global else self._source
    #         return val is not None and val != "__INVALID__"
    #
    #     def __len__(self):
    #         return 1 if self.__bool__() else 0

    def __init__(self):
        super().__init__()

        # noinspection PyArgumentList
        self.lua = lupa.LuaRuntime(unpack_returned_tuples=True, max_memory=self.MAX_MEM)
        safe_globals = {
            'math': self.lua.globals().math,
            'string': self.lua.globals().string,
            'table': self.lua.globals().table,
            'tostring': self.lua.globals().tostring,
            'tonumber': self.lua.globals().tonumber,
            'type': self.lua.globals().type,
            'pairs': self.lua.globals().pairs,
            'ipairs': self.lua.globals().ipairs,
            'print': self._on_console_out,
        }
        self.sandbox_env = self.lua.table(**safe_globals)
        self.lua.execute('''
            function attach_resolver(target_table, py_func)
                setmetatable(target_table, {
                    __index = function(t, key)
                        return py_func(key)
                    end
                })
            end
        ''')

        # noinspection PyUnresolvedReferences
        # self.lua.globals().attach_resolver(self.sandbox_env, self._gemini_python_resolver)
        self.lua.globals().attach_resolver(self.sandbox_env, self.kiosk_python_resolver)

        self.run_in_env = self.lua.eval('''
                function(chunk, env)
                    -- Upvalue 1 of a Lua chunk is always '_ENV'
                    debug.setupvalue(chunk, 1, env)
                    return chunk()
                end
            ''')

        self.print_log = []
        self._on_get: Union[Callable, None] = None

    @property
    def on_get(self):
        return self._on_get

    @on_get.setter
    def on_get(self, value):
        self._on_get = value

    def _on_console_out(self, msg: str):
        self.print_log.append(msg)

    def eval(self, expression: str):
        try:
            user_code = f'return {expression}'
            chunk = self.lua.compile(user_code, mode='t')
            env =self.sandbox_env
            # noinspection PyCallingNonCallable
            result = self.run_in_env(chunk, env)
            return None if type(result) == KioskDSLLua.LazyResolver else result
        except lupa.LuaError as e:
            raise KioskDSLException(f'{repr(e)}. Expression was: {expression}')

