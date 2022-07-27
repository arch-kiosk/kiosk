import logging
from logging import Handler
from queue import Queue


class KioskLogger(Handler):

    def install_log_handler(self):
        self.setLevel(self._log_level)
        self.set_info_filter(["werkzeug"])
        if not self._formatter:
            self._formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')

        self.setFormatter(self._formatter)
        self._logger = logging.getLogger()
        self._logger.addHandler(self)

    def uninstall_log_handler(self):
        if self._logger:
            self._logger.removeHandler(self)
            self._logger = None

    def __init__(self, log_level=logging.INFO, formatter=None):
        super(KioskLogger, self).__init__()
        self._info_filter_expressions = None
        self._has_warnings = False
        self._has_errors = False
        self._logger = None
        self.q = Queue()
        self._formatter = formatter
        self._log_level = log_level

    def __enter__(self):
        # logging.info("log_handler about to be installed")
        self.install_log_handler()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.uninstall_log_handler()
        # logging.info("log_handler uninstalled")

    def emit(self, record):
        omit = False
        log_entry = self.format(record)
        if record.levelno <= logging.INFO and self.level <= logging.INFO:
            if self._info_filter_expressions:
                for s in self._info_filter_expressions:
                    if record.name == s or record.module == s:
                        omit = True
                        break
        if not omit:
            prefix = "INFO: "
            if record.levelno == logging.ERROR:
                self._has_errors = True
                prefix = "ERROR: "
            if record.levelno == logging.WARNING:
                self._has_warnings = True
                prefix = "WARNING: "
            self.q.put(prefix + record.msg)

    def has_new_warnings(self, reset=True):
        rc = self._has_warnings
        if reset:
            self._has_warnings = False
        return rc

    def has_new_errors(self, reset=True):
        rc = self._has_errors
        if reset:
            self._has_errors = False
        return rc

    def get_log(self):
        rc = []
        while not self.q.empty():
            rc.append(self.q.get())
        return rc

    def set_info_filter(self, filter_expressions):
        self._info_filter_expressions = filter_expressions

    def set_temp_level(self, level):
        self.old_level = self.level
        self.level = level

    def restore_level(self):
        try:
            self.level = self.old_level
        except Exception as e:
            logging.error("Exception in kiosk_logger.restore_level" + repr(e))

    def peek_last_error(self) -> str:
        try:
            return self.peek_last(search_term="error")
        except Exception as e:
            logging.error("Exception in kiosk_logger.restore_level" + repr(e))
        return ""

    def peek_last(self, search_term="") -> str:
        try:
            log_list = list(self.q.queue)
            if not search_term:
                return self.q.queue[len(self.q.queue) - 1]
            else:
                log_list = list(self.q.queue)
                x: str
                search_term = search_term.lower()
                logs = [x for x in log_list if x.lower().find(search_term)]
                return logs[len(logs)]
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.peek_last: {repr(e)}")
        return ""
