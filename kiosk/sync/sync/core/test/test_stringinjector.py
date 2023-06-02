from stringinjector import StringInjector


class TestStringInjector:

    def test_injector(self):
        def get_variable(var_term):
            return var_term

        injector = StringInjector(get_variable)
        s = injector.inject_variables("This {{is}} a {{text}} and this {{is}} another {{text}}")
        assert s == "This is a text and this is another text"

    def test_injector_pattern(self):
        def get_variable(var_term):
            if var_term == "text":
                return "{{#subst text}}"
            return ""

        injector = StringInjector(get_variable, r"({\?.*?\?})")
        s = injector.inject_variables("This {?is?} a {?text?} and another {?text?}")
        assert s == "This  a {{#subst text}} and another {{#subst text}}"
