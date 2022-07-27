from core.typerepository import TypeRepository
import pytest


class ISomeInterfaceClass:

    @classmethod
    def get_class_name(cls):
        return cls.__name__

    def __init__(self, *args, **kwargs):
        self.cls_name = self.__class__.__name__

    def get_name(self):
        return self.cls_name


class ISomeOtherInterfaceClass(ISomeInterfaceClass):
    def __init__(self, *args, **kwargs):
        super().__init__(self, *args, **kwargs)

        try:
            my_name = args[0]
        except:
            my_name = ""

        self.my_name = my_name + "/" + kwargs.get("special_name", "")

    def get_name(self):
        return super().get_name() + "/{}".format(self.my_name)


class ISomeCoolInterfaceClass(ISomeInterfaceClass):
    def __init__(self, my_name, special_name=""):
        super().__init__(self)

        self.my_name = my_name + "/" + special_name

    def get_name(self):
        return super().get_name() + "/{}".format(self.my_name)


class TestTypeRepository:

    @pytest.fixture(autouse=True)
    def init_test(self):
        yield

    def test_register_type(self):
        repos = TypeRepository()
        assert repos.list_types("SomeModule.SomeSubModule.ISomeInterface") == []

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass", ISomeInterfaceClass)
        assert repos.get_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass") == ISomeInterfaceClass

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface",
                            "ISomeOtherInterfaceClass", ISomeOtherInterfaceClass)
        assert repos.get_type("SomeModule.SomeSubModule.ISomeInterface",
                              "ISomeOtherInterfaceClass") == ISomeOtherInterfaceClass

    def test_get_type(self):
        repos = TypeRepository()
        assert repos.get_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass") == None

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass", ISomeInterfaceClass)
        cls = repos.get_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass")
        assert cls.get_class_name() == "ISomeInterfaceClass"

    def test_list_types(self):
        repos = TypeRepository()
        assert repos.list_types("SomeModule.SomeSubModule.ISomeInterface") == []

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass", ISomeInterfaceClass)
        assert len(repos.list_types("SomeModule.SomeSubModule.ISomeInterface")) == 1
        assert repos.list_types("SomeModule.SomeSubModule.ISomeInterface")[0] == "ISomeInterfaceClass"

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeOtherInterfaceClass",
                            ISomeOtherInterfaceClass)
        assert len(repos.list_types("SomeModule.SomeSubModule.ISomeInterface")) == 2
        assert "ISomeOtherInterfaceClass" in str(repos.list_types("SomeModule.SomeSubModule.ISomeInterface"))
        assert "ISomeInterfaceClass" in str(repos.list_types("SomeModule.SomeSubModule.ISomeInterface"))
        assert "IInterfaceClass" not in str(repos.list_types("SomeModule.SomeSubModule.ISomeInterface"))

    def test_create_type(self):
        repos = TypeRepository()
        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass", ISomeInterfaceClass)
        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeOtherInterfaceClass",
                            ISomeOtherInterfaceClass)
        obj: ISomeInterfaceClass = repos.create_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeInterfaceClass")
        assert obj.get_name() == "ISomeInterfaceClass"

        obj: ISomeInterfaceClass = repos.create_type("SomeModule.SomeSubModule.ISomeInterface",
                                                     "ISomeOtherInterfaceClass")
        assert obj.get_name() == "ISomeOtherInterfaceClass//"

        obj: ISomeInterfaceClass = repos.create_type("SomeModule.SomeSubModule.ISomeInterface",
                                                     "ISomeOtherInterfaceClass", "Object Name")

        assert obj.get_name() == "ISomeOtherInterfaceClass/Object Name/"

        obj: ISomeInterfaceClass = repos.create_type("SomeModule.SomeSubModule.ISomeInterface",
                                                     "ISomeOtherInterfaceClass", "Object Name",
                                                     special_name="another name")

        assert obj.get_name() == "ISomeOtherInterfaceClass/Object Name/another name"

        repos.register_type("SomeModule.SomeSubModule.ISomeInterface", "ISomeCoolInterfaceClass",
                            ISomeCoolInterfaceClass)
        obj: ISomeInterfaceClass = repos.create_type("SomeModule.SomeSubModule.ISomeInterface",
                                                     "ISomeCoolInterfaceClass", "Cool Name",
                                                     special_name="another cool name")

        assert obj.get_name() == "ISomeCoolInterfaceClass/Cool Name/another cool name"
