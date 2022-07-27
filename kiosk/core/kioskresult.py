from flask import jsonify
from copy import copy


class KioskResult:
    def __init__(self, success: bool = False, message: str = ""):
        self.success = success
        self.message = message
        self._log = []
        self._data = {}

    def add_log_line(self, s: str):
        self._log.append(s)

    def add_log(self, log: [str]):
        self._log.extend(log)

    def set_data(self, key, data):
        self._data[key] = data

    def get_data(self, key):
        return self._data[key]

    def get_log(self):
        return copy.copy(self.log)

    def get_dict(self):
        return {"success": self.success,
                "message": self.message,
                "data": self._data,
                "log": self._log}

    def jsonify(self):
        return jsonify(self.get_dict())
