from textsubstitution import TextSubstitution
import pytest


class TestTextSubstitution:

    def test_add_from_list(self):
        subst = TextSubstitution()
        subst.add_from_list([("abc", "cba")])
        subst.add_from_list([("123", "321")])
        subst.add_from_list([("d", "e"), ("f", "g")])
        assert len(subst._substitutions) == 4
        with pytest.raises(ValueError):
            subst.add_from_list([("only one",)])
        with pytest.raises(ValueError):
            subst.add_from_list([("more", "than", "two")])

    def test_substitute(self):
        subst = TextSubstitution()
        subst.add_from_list([("abc", "cba")])
        assert subst.substitute("my abc is now in reverse but not my abc") == "my cba is now in reverse but not my abc"

        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL:abc", "cba")])
        assert subst.substitute(
            "my abc is now in reverse and so is my abc") == "my cba is now in reverse and so is my cba"

        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL:abc", "cba")])
        assert subst.substitute(
            "my abc is now in reverse but not my ABC") == "my cba is now in reverse but not my ABC"

        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL,NOCASE:abc", "cba")])
        assert subst.substitute(
            "my abc is now in reverse and so is my ABC") == "my cba is now in reverse and so is my cba"

    def test_substitute_regexs(self):
        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL,REGEX:abc", r"\cba")])
        assert subst.substitute(
            "my abc is now in reverse and so is my abc") == r"my \cba is now in reverse and so is my \cba"

        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL,NOCASE,REGEX:A.C", r"\cba")])
        assert subst.substitute(
            "my abc is now in reverse and so is my abc") == r"my \cba is now in reverse and so is my \cba"

    def test_substitute_no_regexs(self):
        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL:abc", r"\cba")])
        assert subst.substitute(
            "my abc is now in reverse and so is my abc") == r"my \cba is now in reverse and so is my \cba"

        subst = TextSubstitution()
        subst.add_from_list([(r"\ALL,NOCASE:A\BC", r"D\EF")])
        assert subst.substitute(
            r"a\Bc is now A\bC") == r"D\EF is now D\EF"
