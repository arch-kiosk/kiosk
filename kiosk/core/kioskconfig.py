import logging
import os
import tempfile

from sync_config import SyncConfig


class KioskConfig(SyncConfig):
    def __init__(self, default_config=None, log_warnings=True):
        super().__init__(default_config, log_warnings=log_warnings)
        if 'base_path' not in self._config["kiosk"]:
            self._config["kiosk"]['base_path'] = self.base_path

    @classmethod
    def get_config(cls, default_config=None, log_warnings=True):
        """This is the singleton call. Use this and not __init__ !"""
        config = super().get_config(default_config, log_warnings=log_warnings)
        return config

    def get_local_importpaths(self):
        if "local_importpaths" in self.kiosk:
            return self.resolve_symbols(self.kiosk["local_importpaths"])
        else:
            if "local_import_paths" in self.kiosk:
                return self.resolve_symbols(self.kiosk["local_import_paths"])
            else:
                return []

    def get_temporary_upload_path(self) -> str:
        """
        returns the temporary upload path (kiosk/temporary_upload_path)
        Makes sure the directory actually exists
        :return: string
        """
        path = ""
        if "temporary_upload_path" in self.kiosk:
            path = self.resolve_symbols(self.kiosk["temporary_upload_path"])

        if not path:
            path = self.get_temp_dir(create_if_non_existent=False)
            logging.warning(f"Temporary upload path not configured. Defaulting to {path}")

        if path:
            if not os.path.isdir(path):
                os.makedirs(path, exist_ok=True)

        return path

    def get_plugin_config(self, plugin):
        if plugin in self.kiosk:
            return self.kiosk[plugin]

        return {}

    def get_custom_kiosk_modules_path(self):
        if "custom_kiosk_modules" in self.kiosk:
            return self.resolve_symbols(self.kiosk["custom_kiosk_modules"])
        else:
            s = self.resolve_symbols('%base_path%\\custom')
            logging.warning(f"No custom_kiosk_modules path defined. Defaulting to {s}")
            return s

    def get_reset_file(self):
        if "reset_file" in self.kiosk:
            return self.resolve_symbols(self.kiosk["reset_file"])
        else:
            return ""

    @property
    def security_token_timeout_seconds(self):
        if "security_token_timeout_seconds" in self.kiosk:
            return self.kiosk["security_token_timeout_seconds"]
        else:
            return 60 * 60 * 2  # default is 2 hours
