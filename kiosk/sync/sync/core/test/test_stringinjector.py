from stringinjector import StringInjector


class TestStringInjector:

    def test_injector(self):
        def get_variable(var_term):
            return var_term

        injector = StringInjector(get_variable)
        s = injector.inject_variables("This {{is}} a {{text}} and this {{is}} another {{text}}")
        assert s == "This is a text and this is another text"

