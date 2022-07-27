from .fileexportlib import FileExportError
from .fileexporttarget import FileExportTarget
from sync_config import SyncConfig


class FileExportTargetTest(FileExportTarget):

    def _load_target(self):
        self.name = "Test Target"
        self.description = "Export to null"


