import os

import pytest
import yaml
from sqlalchemy import null

from dsl.kioskdsl import KioskDSLException
from test.testhelpers import KioskPyTestHelper
from dsl.kioskdsllupa import KioskDSLLua


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


    def test_resolver(self, config):
        dsl = KioskDSLLua()
        with pytest.raises(KioskDSLException):
            assert dsl.eval("""x+3""") == 5
        dsl.on_get = lambda x: 2 if x=="x" else None
        assert dsl.eval("""x+3""") == 5
        assert dsl.eval("""x+x""") == 4
        with pytest.raises(KioskDSLException):
            assert dsl.eval("""y+3""") == 5
