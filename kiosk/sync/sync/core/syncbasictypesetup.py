# This registers the basic type repository types that both the sync subsystem and Kiosk use.
# These types must be registered with both type repositories.
from fileidentifiercache import FileIdentifierCache
from sync_config import SyncConfig


def register_basic_types(type_repository):
    cfg = SyncConfig.get_config()
    fic_types = cfg.get_fic_types()
    if fic_types is None:  # note that an empty array is different from None!
        fic_types = ["file_search", "site_index"]
    for fic_type in fic_types:
        FileIdentifierCache.register_fic_type(type_repository, fic_type)
