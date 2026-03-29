from .fileexporttarget import FileExportTarget


class FileExportTargetTest(FileExportTarget):

    def _load_target(self):
        self.name = "Test Target"
        self.description = "Export to null"


