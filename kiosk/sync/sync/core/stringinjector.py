import re


class StringInjector:
    def __init__(self, get_variable_callback, variable_regex=""):
        self._get_variable_callback = get_variable_callback
        if not variable_regex:
            self.variable_regex = "({{.*?}})"
        else:
            self.variable_regex = variable_regex

    def inject_variables(self, s_in) -> str:
        """
        replaces every variable in the text with a return value of the get_variable_callback set
        during initialization.
        :param s_in: some text with variables (matching the variable_regex pattern)
        :return: the text with replaced variables
        """
        pattern = re.compile(self.variable_regex)
        matches = pattern.findall(s_in)
        subst = {}
        for m in matches:
            subst[m] = ""

        for key in subst.keys():
            subst[key] = self._get_variable_callback(key[2:-2])

        result: str = s_in
        for key, value in subst.items():
            # result = re.sub(key, value, result)
            result = result.replace(key, value)
        return result





