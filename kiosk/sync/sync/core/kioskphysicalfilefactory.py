from typerepository import TypeRepository

import kioskstdlib
from kioskphysicalfile import KioskPhysicalFile
from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from syncrepositorytypes import TYPE_PHYSICALFILEHANDLER
from kioskabstractclasses import PluginLoader

class KioskPhysicalFileFactory:
    def __init__(self, type_repository: TypeRepository,
                 priority_func=None,
                 plugin_loader: PluginLoader = None):
        """

        :param type_repository: a TypeRepository that stores the available file handlers
        :param config: optional. A SyncConfig instance that is needed only if the class should load plugins
        :param plugin_loader: optional. A PluginLoader instance that will load the file handler plugins
                if none are installed, yet .
        :param priority_func: optional. callable(ClassName)->:str.
                It can be used to set a priority among the KioskPhysicalFile derivates that claim
                to be able to handle the file or conversion.
        """
        self.type_repository: TypeRepository = type_repository
        self.priority_func = priority_func
        self._plugin_loader: PluginLoader = plugin_loader

    def get(self, path_and_filename: str, target_representation: KioskRepresentationType = None) -> []:
        """
        gets a list of KioskPhysicalFile derivates that can handle and convert the given source file.
        ..important.. Note that the file has not been tried to open, so it is not clear that any of the handlers will
        actually succeed. Perhaps several of them have to be tried.

        :param path_and_filename: path and filename of the file that needs a handler
        :param target_representation: optional. If set, only handlers
               that can potentially convert such a file into the given representation type are selected.
        :return: List of KioskPhysicalFile derivates (classes, not instances) that claim to be able to handle
                 the file (and conversion, if requested)
        """
        handlers = []
        handler_types = self.type_repository.list_types(TYPE_PHYSICALFILEHANDLER)
        if not handler_types:
            self._load_plugins()
            handler_types = self.type_repository.list_types(TYPE_PHYSICALFILEHANDLER)

        for x in handler_types:
            handler: KioskPhysicalFile = self.type_repository.get_type(TYPE_PHYSICALFILEHANDLER, x)
            if handler.can_open(path_and_filename):
                if (not target_representation) or handler.can_convert_to(path_and_filename, target_representation):
                    handlers.append(handler)

        if self.priority_func:
            handlers.sort(key=self.priority_func)

        return handlers

    def _load_plugins(self):
        if self._plugin_loader:
            config = SyncConfig.get_config()
            if config.has_key("file_handlers"):
                plugins = kioskstdlib.try_get_dict_entry(config.file_handlers, "plugins", [])
                if plugins:
                    self._plugin_loader.load_plugins(plugins)
