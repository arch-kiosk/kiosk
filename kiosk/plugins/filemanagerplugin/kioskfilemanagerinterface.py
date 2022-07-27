from flask import url_for

from kioskfilemanagerbridge import KioskFileManagerBridge
from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory


class KioskFileManagerInterface(KioskFileManagerBridge):
    # noinspection PyMissingConstructor
    def __init__(self):
        pass

    def assert_file_transfer_directory(self, alias, description, symbolic_path, restart_server=False) -> bool:
        """
        makes sure that a certain file transfer directory is known by the file manager and that it
        has the given attributes, particularly the symbolic_path.
        The description and restart_server will only be updated if the directory is created for the first time or
        if the symbolic path changes.

        Commits the database-session!

        :param alias: the unique name of the directory as it is known to the file manager
        :param symbolic_path: a symbolic path. Static paths are usually not accepted by file manager plugins
        :param description:  a description of the directory (shown by the file manager)
        :param restart_server: sets whether the server needs a restart after a file changes in this directory.
        :returns: boolean
        """
        update = False
        fdir = FileManagerDirectory()
        if fdir.get(alias):
            update = True
            if symbolic_path == fdir.path:
                return True

        fdir.alias = alias
        fdir.description = description
        fdir.path = symbolic_path
        fdir.server_restart = restart_server
        return fdir.update(commit=True) if update else fdir.add(commit=True)

    def url_for_directory(self, alias: str) -> str:
        """
        returns a url that shows the directory in the filemanager controller
        """
        return url_for("filemanager.filemanager_topic", topic=alias.lower())

