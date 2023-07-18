from typing import List, Tuple, Union
import re


class TextSubstitutionElement:
    def __init__(self, search_pattern: str, replace_with: str):
        self.search_pattern: str = search_pattern
        self.replace_with: str = replace_with
        self.replace_all = False
        self.case_sensitive = True
        self.regex_pattern: Union[re.Pattern, None] = None
        self.is_regex_pattern = False
        self.regex_options = re.compile(r"^(\s*\\(?P<options>.*?)\:)?(?P<pattern>.*)$")
        self.interpret_search_pattern()

    def _interpret_options(self, options: str):
        options = options.lower()
        for option in options.split(","):
            if option == "all":
                self.replace_all = True
            elif option == "nocase":
                self.case_sensitive = False
            elif option == "regex":
                self.is_regex_pattern = True
            else:
                raise Exception(f"{self.__class__.__name__}.interpret_search_pattern: "
                                f"option {option} in search pattern unknown.")

    def interpret_search_pattern(self):
        m = self.regex_options.search(self.search_pattern)
        try:
            options = m.group("options")
            if options:
                self._interpret_options(options)
        except KeyError:
            pass

        pattern = m.group("pattern")
        if pattern:
            if self.is_regex_pattern:
                self.regex_pattern = re.compile(pattern, flags=0 if self.case_sensitive else re.IGNORECASE)
            else:
                self.regex_pattern = re.compile(re.escape(pattern), flags=0 if self.case_sensitive else re.IGNORECASE)
        else:
            raise ValueError(f"{self.__class__.__name__}.interpret_search_pattern: "
                             f"substitution pattern {self.search_pattern} is empty.")

    def replace(self, text: str) -> str:
        if self.is_regex_pattern:
            return self.regex_pattern.sub(lambda m: self.replace_with, text, count=0 if self.replace_all else 1)
        else:
            return self.regex_pattern.sub(lambda m: self.replace_with, text, count=0 if self.replace_all else 1)


class TextSubstitution:

    def __init__(self):
        self._substitutions: List[TextSubstitutionElement] = []

    @property
    def count(self):
        return len(self._substitutions)

    def add_from_list(self, text_substitutions: List[Tuple]):
        for subst in text_substitutions:
            if len(subst) != 2:
                raise ValueError(f"{self.__class__.__name__}.check_substitution: "
                                 f"Substitution {subst} does not have two components.")

            tse = TextSubstitutionElement(subst[0], subst[1])
            self._substitutions.append(tse)

    def substitute(self, text: str) -> str:
        for tse in self._substitutions:
            text = tse.replace(text)

        return text
