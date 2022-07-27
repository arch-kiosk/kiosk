from __future__ import annotations
from typing import List
import datetime
import kioskstdlib


class FileManagerFile:
    class Action:
        def __init__(self, action, icon, trigger):
            self.action = action
            self.icon = icon
            self.trigger = trigger

    def __init__(self, path_and_filename):
        self.filename: str = kioskstdlib.get_filename(path_and_filename)
        self.date: datetime = kioskstdlib.get_latest_date_from_file(path_and_filename)
        self.size: int = int(kioskstdlib.get_file_size(path_and_filename) / 1024)
        self.actions: List[FileManagerFile.Action] = []
        self.historical = False

    def add_action(self, action, icon, trigger):
        self.actions.append(FileManagerFile.Action(action, icon, trigger))

    @property
    def latin_date(self):
        return kioskstdlib.latin_date(self.date, no_time=False)

    def backup_file(self):
        pass
