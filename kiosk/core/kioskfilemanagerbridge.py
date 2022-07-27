from kioskglobals import type_repository
from kioskrepositorytypes import TYPE_FILE_MANAGER_INTERFACE


class KioskFileManagerBridge:

    @staticmethod
    def instantiate():
        return type_repository.create_type(TYPE_FILE_MANAGER_INTERFACE, TYPE_FILE_MANAGER_INTERFACE)

    def __init__(self):
        raise NotImplementedError

    """ this is only a proxy for the actual class that is registered in the type repository """
    def assert_file_transfer_directory(self, alias, description, symbolic_path, restart_server=False):
        """
        makes sure that a certain file transfer directory is known by the file manager and that it
        has the given attributes, particularly the symbolic_path.
        The description and restart_server will only be updated if the directory is created for the first time or
        if the symbolic path changes.

        :param alias: the unique name of the directory as it is known to the file manager
        :param symbolic_path: a symbolic path. Static paths are usually not accepted by file manager plugins
        :param description:  a description of the directory (shown by the file manager)
        :param restart_server: sets whether the server needs a restart after a file changes in this directory.
        """
        raise NotImplementedError

    def url_for_directory(self, alias: str) -> str:
        """
        returns a url that shows the directory in the filemanager controller
        """
        raise NotImplementedError
