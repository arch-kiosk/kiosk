# This registers the basic type repository types that both the sync subsystem and Kiosk use.
# These types must be registered with both type repositories.
from fileidentifiercache import FileIdentifierCache


def register_basic_types(type_repository):
    FileIdentifierCache.register_fic_type(type_repository, "file_search")
    FileIdentifierCache.register_fic_type(type_repository, "site_index")
    # FileIdentifierCache.register_fyc_type(type_repository, "file-picking")
