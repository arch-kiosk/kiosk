import pytest
import unittest.mock as mock


class SomeClass:
    inner_value = 1

    def some_method(self, some_param):
        print("\nsome method has been called")
        self.inner_value = 3
        return self.inner_value

    def some_calling_method(self, some_param):
        print("\nsome calling method has been called")
        return self.some_method(some_param)


@pytest.mark.skip
class TestMocking:

    # @pytest.fixture(autouse=True, scope="session")
    # def init_session(self):
    #     print("\nInit session ran")
    #
    # @pytest.fixture(autouse=True, scope="module")
    # def init_module(self):
    #     print("init module ran")

    @pytest.fixture()
    def init_method(self):
        print("\ninit method ran")

    def test_mock_it(self):
        with mock.patch.object(SomeClass, "some_method") as some_method_mocked:
            some_method_mocked.return_value = 2

            some_object = SomeClass()
            assert some_object.some_calling_method(3) == 2
            some_method_mocked.assert_called_once_with(3)

        assert some_object.some_calling_method(3) == 3

    @mock.patch.object(SomeClass, "some_method")
    def test_decorator_mock(self, some_method_mocked):
        some_method_mocked.return_value = 2

        some_object = SomeClass()
        assert some_object.some_calling_method(3) == 2
        some_method_mocked.assert_called_once_with(3)

    def test_something_else(self, init_method):
        assert True
