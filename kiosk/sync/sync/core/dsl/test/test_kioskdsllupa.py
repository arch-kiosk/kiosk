import math
import os

import pytest
import yaml
from sqlalchemy import null
import math
import pytest

from dsl.kioskdsl import KioskDSLException
from test.testhelpers import KioskPyTestHelper
from dsl.kioskdsllupa import KioskDSLLua, LazyResolverContinue, LazyResolverStop

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskDSLLupa(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    # @pytest.fixture(scope="module")
    # def urapdb(self, config):
    #     return self.get_urapdb(config)
    #
    # @pytest.fixture()
    # def urapdb_without_migration(self, config):
    #     return self.get_urapdb(config, migration=False)
    #
    # @pytest.fixture()
    # def dsd(self, urapdb_without_migration):
    #     return Dsd3Singleton.get_dsd3()

    def test_init(self, config):
        dsl = KioskDSLLua()
        assert dsl.eval("2+2") == 4
        assert dsl.eval("15/5") == 3

    def test_sandbox(self, config):
        dsl = KioskDSLLua()
        with pytest.raises(KioskDSLException):
            assert dsl.eval("x/3") == 5

        assert dsl.eval("string.upper('hello world')") == 'HELLO WORLD'

        assert dsl.eval("""string.len("abc")""") == 3
        assert dsl.eval("""("abc"):len()""") == 3

        assert dsl.eval("math.sqrt(16)") == 4

        with pytest.raises(KioskDSLException):
            assert dsl.eval("io.type(nil)") == None

    def test_print(self,config):
        dsl = KioskDSLLua()
        assert dsl.eval("""print("Hello World!")""") == None
        assert dsl.print_log == ['Hello World!']


    def test_resolver_simple_statement(self, config):
        dsl = KioskDSLLua()
        with pytest.raises(KioskDSLException):
            assert dsl.eval("""x+3""") == 5
        dsl.on_get = lambda x: 2 if x=="x" else None
        assert dsl.eval("""x+3""") == 5
        assert dsl.eval("""x+x""") == 4
        with pytest.raises(KioskDSLException):
            assert dsl.eval("""y+3""") == 5

    def test_kiosk_resolver(self, config):
        def data_request(x):
            if x == "x":
                raise LazyResolverContinue
            if x == "x.y":
                return 2
            return None

        dsl = KioskDSLLua()
        dsl.on_get = data_request
        assert dsl.eval("""x.y+3""") == 5

    def test_kiosk_resolver_falsy_stuff(self, config):
        def data_request(x):
            if x == "x.y":
                return True
            raise LazyResolverContinue

        dsl = KioskDSLLua()
        dsl.on_get = data_request
        assert dsl.eval("""x.y""")
        assert not dsl.eval("""x.z""")

    def test_resolver_deep_expression(self, config):
        """Standard jagged path resolution with arithmetic."""
        def data_request(x):
            if x == "x.y.z":
                return 2
            raise LazyResolverContinue

        dsl = KioskDSLLua()
        dsl.on_get = data_request

        # Test 1: Deep resolution works
        assert dsl.eval("x.y.z + 3") == 5

        # Test 2: Intermediate path used as a value should fail arithmetic
        # because x.y is a Proxy object, not a number.
        with pytest.raises(Exception):
            dsl.eval("x.y + 3")

    # def test_gemini_veto_and_nil_safety(self, config):
    #     """Ensures that __INVALID__ successfully stops the chain."""
    #     dsl = KioskDSLLua()
    #
    #     # x is a Proxy (returns None), x.y is Vetoed
    #     dsl.on_get = lambda path: "__INVALID__" if path == "x.y" else (5 if path == "x.z" else None)
    #
    #     # 1. x should return a Proxy (Truthiness check)
    #     assert dsl.eval("x ~= nil") == True
    #
    #     # 2. x.y should return nil because of the Veto
    #     assert dsl.eval("x.y == nil") == True
    #
    #     # 3. Accessing x.y.z should throw "attempt to index a nil value"
    #     # because x.y is literally nil.
    #     with pytest.raises(Exception, match="attempt to index a nil value"):
    #         dsl.eval("x.y.z")
    #
    #     # 4. x.z should return a value
    #     assert dsl.eval("x.z == 5") == True

    def test_me_own_veto_and_nil_safety(self, config):
        """Ensures that raising The LazyResolverStop Exception successfully stops the chain."""
        def data_request(path):
            if path == "x.y":
                raise LazyResolverStop
            if path == "x.z":
                return 5
            raise LazyResolverContinue

        dsl = KioskDSLLua()

        # x is a Proxy (returns None), x.y is Vetoed
        dsl.on_get = data_request

        # 1. x should return a Proxy (Truthiness check)
        assert dsl.eval("x ~= nil") == True

        # 2. x.y should return nil because of the Veto
        assert dsl.eval("x.y == nil") == True

        # 3. Accessing x.y.z should throw "attempt to index a nil value"
        # because x.y is literally nil.
        with pytest.raises(Exception, match="attempt to index a nil value"):
            dsl.eval("x.y.z")

        # 4. x.z should return a value
        assert dsl.eval("x.z == 5") == True

    def test_truthiness_and_jagged_paths(self, config):
        dsl = KioskDSLLua()

        # This is our "Intelligent" callback
        def intelligent_get(path):
            # 1. The Leaf
            if path == "x.y.z":
                return 2

            # 2. The Known Branch (Optimism)
            # We allow 'x' and any path starting with 'x.' to be proxies
            if path == "x" or path.startswith("x."):
                raise LazyResolverContinue

                # 3. The Unknown (Truthiness Fix)
            # Anything else is explicitly invalid, so the factory returns None (nil)
            raise LazyResolverStop

        dsl.on_get = intelligent_get

        # TEST A: Jagged path still works
        # x (None) -> x.y (None) -> x.y.z (2)
        assert dsl.eval("x.y.z + 3") == 5

        # TEST B: Truthiness now works!
        # not_exists returns "__INVALID__" -> Factory returns None -> Lua sees nil
        assert dsl.eval("not_exists and 'yes' or 'no'") == "no"

    def test_proxy_method_with_resolved_arguments(self):
        """
        Validates:
        1. Property resolution to primitives (unit.x, unit.y).
        2. Method resolution via colon syntax (unit:get_length).
        3. Python-side execution with resolved arguments.
        """
        dsl = KioskDSLLua()

        class DataBridge:
            def __init__(self):
                # The raw data state
                self.values = {
                    "unit.x": 10,
                    "unit.y": 20
                }

            def __call__(self, path):
                """Retrieval logic for GeminiLazyPath.create."""
                # Return value if it exists
                if path in self.values:
                    return self.values[path]

                # Allow path exploration for specific branch roots
                if path == "unit" or path.startswith("unit."):
                    raise LazyResolverContinue

                # Explicitly block everything else to satisfy truthiness tests
                raise LazyResolverStop

            def execute(self, path, *args):
                if path == "unit.get_length":
                    # If called via unit:get_length, args[0] is the unit proxy.
                    # We just take the last two arguments.
                    x, y = args[-2], args[-1]
                    return math.sqrt(x ** 2 + y ** 2)
                return LazyResolverStop

        bridge = DataBridge()
        dsl.on_get = bridge

        # The Lua chunk under test
        # 1. 'unit.x' is resolved via __getattr__ -> create() -> bridge('unit.x') -> 10
        # 2. 'unit.y' is resolved via __getattr__ -> create() -> bridge('unit.y') -> 20
        # 3. 'unit:get_length' triggers __call__ with (unit_proxy, 10, 20)
        # 4. 'is_colon' strips the proxy, passing (10, 20) to bridge.execute
        expression = "unit:get_length(unit.x, unit.y)"
        result = dsl.eval(expression)

        # Expected: sqrt(10^2 + 20^2) = sqrt(500) ≈ 22.360679
        assert result == pytest.approx(22.360679)

    def test_string_handling(self, config):
        """Ensures strings are unwrapped for Lua concatenation."""
        def data_request(path):
            if path == "hello.target":
                return "World"
            raise LazyResolverContinue
        dsl = KioskDSLLua()
        dsl.on_get = data_request

        assert dsl.eval("'Hello ' .. hello.target") == "Hello World"

    def test_nested_return_from_function(self):
        dsl = KioskDSLLua()

        class NestedDataSource:
            def __call__(self, path):
                # The resolver only knows the root entry point
                if path == "get_unit": raise LazyResolverContinue
                raise LazyResolverStop

            def execute(self, path, *args):
                if path == "get_unit":
                    # This is the "Local Data" that was causing the nil error
                    return {"id": "TR-1", "meta": {"depth": 1.5}}
                return None

        dsl.on_get = NestedDataSource()

        # 1. Test single level depth
        assert dsl.eval("get_unit().id") == "TR-1"

        # 2. Test double level depth (Recursive Proxying)
        assert dsl.eval("get_unit().meta.depth") == 1.5

    def test_nested_object_return_chain(self):
        """Ensures proxies switch to Local Mode when a function returns a object/dict."""
        dsl = KioskDSLLua()
        class NestedDataSource:
            def __call__(self, path):
                # The resolver only knows the root entry point
                if path.startswith("unit"):
                    for key in ["unit",".get_target", ".is_alive"]:
                        if path.endswith(key): raise LazyResolverContinue
                raise LazyResolverStop

            def execute(self, path, *args):
                if path == "unit.get_target":
                    # This is the "Local Data" that was causing the nil error
                    return {"hp": 50, "is_alive": lambda: True}
                return None
        dsl.on_get = NestedDataSource()

        # We test both a property lookup and a function call on the returned result
        assert dsl.eval("unit.get_target().hp") == 50
        assert dsl.eval("unit.get_target().is_alive()") is True

    def test_proxy_value_as_method_argument(self):
        """Ensures resolved primitives are passed correctly to execute() calls."""
        dsl = KioskDSLLua()

        # Create a Mock Bridge that behaves like your real backend
        class MockBridge:
            def __call__(self, key):
                # The 'on_get' logic
                if key == "x":
                    return 10
                else:
                    raise LazyResolverContinue

            def execute(self, path, *args):
                if path == "unit.damage":
                    # If there are 2 args, the first is 'self' (the unit proxy)
                    # If there is 1 arg, it's a direct call.
                    val = args[1] if len(args) > 1 else args[0]
                    return f"Dealt {val} damage"
                return None

        bridge = MockBridge()

        # Inject the bridge as the source
        dsl.on_get = bridge

        # Now, when 'unit' is created, its _source is the 'bridge' object.
        # When 'unit:damage' is called, it sees bridge.execute exists and calls it.
        assert dsl.eval("unit:damage(x)") == "Dealt 10 damage"

    def test_global_function_call(self):
        """Ensures that function calls on the upper level (No . or : involved) work"""
        dsl = KioskDSLLua()

        # Create a Mock Bridge that behaves like your real backend
        class MockBridge:
            def __call__(self, key):
                # The 'on_get' logic
                if key == "x":
                    return 10
                else:
                    raise LazyResolverContinue

            def execute(self, path, *args):
                if path == "my_func":
                    # If there are 2 args, the first is 'self' (the unit proxy)
                    # If there is 1 arg, it's a direct call.
                    val = args[1] if len(args) > 1 else args[0]
                    return f"got {val} as parameter"
                return None

        bridge = MockBridge()

        # Inject the bridge as the source
        dsl.on_get = bridge

        # Now, when 'unit' is created, its _source is the 'bridge' object.
        # When 'unit:damage' is called, it sees bridge.execute exists and calls it.
        assert dsl.eval("my_func(x)") == "got 10 as parameter"

    def test_optimistic_path_falsiness(self):
        """Users check .exists() to see if an optimistic path has data."""
        def optimistic_resolver(path: str=None):
            raise LazyResolverContinue

        dsl = KioskDSLLua()
        dsl.on_get = optimistic_resolver

        # This will now correctly return False
        assert not dsl.eval("unit.some.path")

        # This will fail: Checking if a path exists needs an additional function.
        with pytest.raises(AssertionError):
            assert dsl.eval("not unit.some.path")


    def test_resolve_to_bool(self):
        """Users check .exists() to see if an optimistic path has data."""
        def optimistic_resolver(path: str=None):
            raise LazyResolverContinue

        dsl = KioskDSLLua()
        dsl.on_get = optimistic_resolver
        assert dsl.eval("not resolve_to_bool(unit.some.path)")
        assert dsl.eval("not resolve_to_bool(nil)")
        assert dsl.eval("not resolve_to_bool(false)")
        assert dsl.eval("resolve_to_bool(true)")
