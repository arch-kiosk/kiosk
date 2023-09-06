import logging
import os.path

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

        def _filename_resolver(filename: str) -> str:
            if filename.lower().startswith('%custom_path%'):
                return cfg.resolve_symbols(filename)
            else:
                return os.path.join(cfg.base_path, "config", "ui", filename)
        try:
            path_and_filename = os.path.join(cfg.custom_path, pld_name + ".pld")
            if not os.path.isfile(path_and_filename):
                path_and_filename = os.path.join(cfg.base_path, "config", "ui", pld_name + ".pld")

            pld = PresentationLayerDefinition()
            pld.load(path_and_filename, _filename_resolver)
            return pld
        except BaseException as e:
            logging.error(f"{cls.__name__}.load_pld: {repr(e)}")
            raise e
