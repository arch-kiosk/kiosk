import pytest
import logginglib
import logging

class loggable(logginglib.LoggingFeature):
    pass

class TestLoggingFeature():
    def on_log(self, level, msg):
        self.last_level = level
        self.last_msg = msg

    @pytest.fixture(autouse=True)
    def init_test(self):
        self.last_level = None
        self.last_msg = None

        self.loggable = logginglib.LoggingFeature()

    def test_info(self):

        self.loggable.debug("infomessage")
        assert self.last_level == None
        assert self.last_msg == None

        self.loggable.on_logging(self.on_log)

        self.loggable.info("infomessage")
        assert self.last_level == logging.INFO
        assert self.last_msg == 'infomessage'

    def test_debug(self):

        self.loggable.debug("debugmessage")
        assert self.last_level == None
        assert self.last_msg == None

        self.loggable.on_logging(self.on_log)

        self.loggable.debug("debugmessage")
        assert self.last_level == logging.DEBUG
        assert self.last_msg == 'debugmessage'

    def test_warning(self):

        self.loggable.warning("warningmessage")
        assert self.last_level == None
        assert self.last_msg == None

        self.loggable.on_logging(self.on_log)

        self.loggable.warning("warningmessage")
        assert self.last_level == logging.WARNING
        assert self.last_msg == 'warningmessage'

    def test_error(self):

        self.loggable.debug("errormessage")
        assert self.last_level == None
        assert self.last_msg == None

        self.loggable.on_logging(self.on_log)

        self.loggable.error("errormessage")
        assert self.last_level == logging.ERROR
        assert self.last_msg == 'errormessage'




