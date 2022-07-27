'''
Helper classes for logging
'''
import logging

class LoggingFeature:

    _on_logging_handler = None

    def debug(self, msg):
        if self._on_logging_handler:
            self._on_logging_handler(logging.DEBUG, msg)

    def info(self, msg):
        if self._on_logging_handler:
            self._on_logging_handler(logging.INFO, msg)

    def error(self, msg):
        if self._on_logging_handler:
            self._on_logging_handler(logging.ERROR, msg)

    def warning(self, msg):
        if self._on_logging_handler:
            self._on_logging_handler(logging.WARNING, msg)

    def on_logging(self, logging_handler):
        self._on_logging_handler = logging_handler