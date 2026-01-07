import logging

from dsl.kioskdsl import KioskDSL, KioskDSLException

try:
    import lupa.lua54 as lupa
except ImportError:
    import lupa


class KioskDSLLua(KioskDSL):
    MAX_MEM = 10 * 1024 * 1024

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

        self.lua.globals().attach_resolver(self.sandbox_env, self._python_resolver)

        # mt = self.lua.table(__index=self._python_resolver)
        # self.lua.globals().setmetatable(self.sandbox_env, mt)
        self.run_in_env = self.lua.eval('''
                function(chunk, env)
                    -- Upvalue 1 of a Lua chunk is always '_ENV'
                    debug.setupvalue(chunk, 1, env)
                    return chunk()
                end
            ''')

        self.print_log = []
        self._on_get = None


    @property
    def on_get(self):
        return self._on_get

    @on_get.setter
    def on_get(self, value):
        self._on_get = value

    def _python_resolver(self, key: str):
        # 'table' is the Lua table where the lookup failed
        # 'key' is the name of the missing variable (e.g., "my_custom_var")

        logging.debug(f"Lua tried to find '{key}', but it wasn't there. Resolving from Python...")
        try:
            if self._on_get:
                return self._on_get(key)
        except BaseException as e:
            self._on_console_out(f"Exception in KioskDSLLUA on_get callback: {repr(e)}")

        return None

    def _on_console_out(self, msg: str):
        self.print_log.append(msg)

    def eval(self, expression: str):
        try:
            user_code = f'return {expression}'
            chunk = self.lua.compile(user_code, mode='t')
            env =self.sandbox_env
            result = self.run_in_env(chunk, env)
            return result
        except lupa.LuaError as e:
            raise KioskDSLException(f'{repr(e)}. Expression was: {expression}')
