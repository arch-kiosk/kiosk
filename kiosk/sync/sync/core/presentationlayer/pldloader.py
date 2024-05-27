import logging
import os.path

import kioskstdlib
from presentationlayer.presentationlayerdefinition import PresentationLayerDefinition
from sync_config import SyncConfig


class PLDLoader:
    @classmethod
    def load_pld(cls, pld_name: str, cfg: SyncConfig) -> PresentationLayerDefinition:
        """
        loads a presentation layer definition. This tries to load the pld from the custom directory first and
        only if that fails the pld will be loaded from config\\ui directory.
        :param pld_name: the name of the pld (without a file extension!).
        :param cfg: a SyncConfig or KioskConfig
        """

        def _filename_resolver(importing_path_and_filename: str, filename: str) -> str:
            """
            :param importing_path_and_filename: the name of the pld file that is importing another
            :param filename: the filename to import. With or without an extension (will be replaced with .pld)
            :return: path and filename
            """
            path_and_filename = ""
            filename = kioskstdlib.get_filename_without_extension(filename)
            if filename.lower().startswith('%custom_path%'):
                path_and_filename = cfg.resolve_symbols(filename)
            else:
                if not importing_path_and_filename.startswith(cfg.custom_path):
                    path_and_filename = os.path.join(cfg.custom_path, "ui", filename + ".pld")
                if not path_and_filename or not os.path.isfile(path_and_filename):
                    path_and_filename = os.path.join(cfg.base_path, "config", "ui", filename + ".pld")
            return path_and_filename

        try:
            pld = PresentationLayerDefinition()
            pld.load(_filename_resolver("", pld_name), _filename_resolver)
            return pld
        except BaseException as e:
            logging.error(f"{cls.__name__}.load_pld: {repr(e)}")
            raise e
