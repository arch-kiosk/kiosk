import datetime
import logging
import time
import uuid
import os

import pytest

from core.config import Config
from kioskglossary import KioskGlossary
from test.testhelpers import KioskPyTestHelper
from kiosklogger import KioskLogger

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestGlossary(KioskPyTestHelper):

    def test_glossary(self):
        config = Config()
        assert not config.has_key("glossary")

        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 1) == "my term"
        assert glossary.get_term("my term", 2) == "my terms"

        # pluralization switched off
        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 0, auto_plural=False) == "my term"
        assert glossary.get_term("my term", 2, auto_plural=False) == "my term"

        # Empty Glossary
        config._config["glossary"] = {}
        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 0) == "my term"
        assert glossary.get_term("my term", 2) == "my terms"

        # Glossary with string entry
        config._config["glossary"] = {
            "my term": "glossary entry"}

        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 0) == "glossary entry"
        assert glossary.get_term("my term", 2) == "glossary entrys"

        assert glossary.get_term("my term", 0, auto_plural=False) == "glossary entry"
        assert glossary.get_term("my term", 2, auto_plural=False) == "glossary entry"

        # Glossary with one-element array entry
        config._config["glossary"] = {
            "my term": ["glossary entry"]}

        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 0) == "glossary entry"
        assert glossary.get_term("my term", 2) == "glossary entrys"

        assert glossary.get_term("my term", 0, auto_plural=False) == "glossary entry"
        assert glossary.get_term("my term", 2, auto_plural=False) == "glossary entry"

        # Glossary with complete array entry
        config._config["glossary"] = {
            "my term": ["glossary entry", "glossary entries"]}

        glossary = KioskGlossary(config)
        assert glossary.get_term("my term", 0) == "glossary entry"
        assert glossary.get_term("my term", 2) == "glossary entries"

        assert glossary.get_term("my term", 0, auto_plural=False) == "glossary entry"
        assert glossary.get_term("my term", 2, auto_plural=False) == "glossary entries"
