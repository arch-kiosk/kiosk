import logging
import os
from typing import List

import yaml

import kioskdatetimelib
import kioskglobals
import kioskstdlib
from uuid import uuid4

from dsd.dsd3singleton import Dsd3Singleton
from dsl.kioskdsllupa import KioskDSLLua, KioskDSLLuaResolver, LazyResolverContinue, LazyResolverStop
from dsl.resolvers.dslluakioskconfigresolver import DSLLuaKioskConfigResolver
from dsl.resolvers.dslluakioskdsdresolver import DSLLuaKioskDSDResolver
from dsl.resolvers.dslluametaresolver import DSLLuaMetaResolver
from dsl.resolvers.dslluasettingsresolver import DSLLuaSettingsResolver
from kioskquery.kioskquery import KioskQuery
from kioskquery.kioskquerydefinition import KioskQueryDefinition
from kioskquery.kioskqueryfactory import KioskQueryFactory
from kioskquery.kioskquerylib import *
from kioskquery.kioskquerystoremodel import KioskQueryStoreModel
import kioskstdlib
import datetime

from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig


def install_default_kiosk_queries(config: SyncConfig):
    """
    adds / updates the query definitions from the files found
    in the default kiosk query path and in project's default kiosk query path (which is just a subdirectory in the
    default query path named after the project-id)
    :param config:
    """
    project_id = config.get_project_id()
    def_base_path = config.default_kiosk_queries
    if os.path.isdir(def_base_path):
        KioskQueryStore.add_or_update_from_path(def_base_path, "*.yml")
        def_project_path = str(os.path.join(def_base_path, project_id))
        if os.path.isdir(def_project_path):
            KioskQueryStore.add_or_update_from_path(def_project_path, "*.yml")

def clear_all_kiosk_queries(commit=True):
    # noinspection SqlWithoutWhere
    KioskSQLDb.execute("delete from kiosk_queries", commit=commit)

class KioskQueryStore:

    @classmethod
    def add(cls, query: KioskQuery):
        query_definition: KioskQueryDefinition = query.query_definition
        store_entry = KioskQueryStoreModel()
        store_entry.uid = kioskstdlib.uuid4()
        store_entry.id = query_definition.query_id
        store_entry.category = query_definition.category
        store_entry.order_priority = query_definition.order_priority
        store_entry.show_only_if = query_definition.show_only_if
        store_entry.query_type = query.__class__.__name__
        if hasattr(query_definition, "category"):
            store_entry.category = query_definition.category
        if hasattr(query_definition, "order_priority"):
            store_entry.order_priority = query_definition.order_priority

        cls._update_definition(store_entry, query_definition)
        store_entry.add(commit=True)

    @classmethod
    def _update_definition(cls, store_entry, query_definition):
        logging.info(f"{cls.__name__}._update_definition: update '{query_definition.query_name}'")
        store_entry.name = query_definition.query_name
        store_entry.description = query_definition.query_description
        store_entry.category = query_definition.category
        store_entry.order_priority = query_definition.order_priority
        store_entry.show_only_if = query_definition.show_only_if
        store_entry.query = query_definition.raw_query_definition
        store_entry.created = kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True)
        store_entry.modified = kioskdatetimelib.get_utc_now(no_tz_info=True, no_ms=True)

    @classmethod
    def add_or_update(cls, query: KioskQuery):
        query_definition: KioskQueryDefinition = query.query_definition
        store_entry = KioskQueryStoreModel()
        if store_entry.get_one("id=%s", [query_definition.query_id]):
            cls._update_definition(store_entry, query_definition)
            store_entry.update(commit=True)
        else:
            cls.add(query)

    @classmethod
    def add_or_update_from_file(cls, path_and_filename: str) -> KioskQuery:
        if not os.path.isfile(path_and_filename):
            raise KioskQueryException(f"{cls.__name__}.add_or_update_from_file: "
                                      f"File does not exist ({path_and_filename})")
        with open(path_and_filename, "r", encoding='utf8') as ymlfile:
            query_def = yaml.load(ymlfile, Loader=yaml.FullLoader)

        return cls.add_or_update_from_raw_definition(query_def)

    @classmethod
    def add_or_update_from_path(cls, path_name: str, file_pattern: str = "*.yml"):
        if not os.path.isdir(path_name):
            raise KioskQueryException(f"{cls.__name__}.add_or_update_from_path: "
                                      f"Directory does not exist ({path_name})")
        kioskstdlib.apply_files(path_name, file_pattern, cls.add_or_update_from_file)

    @classmethod
    def add_or_update_from_raw_definition(cls, query_def: dict) -> KioskQuery:
        query = KioskQueryFactory.load(query_def)
        query_definition: KioskQueryDefinition = query.query_definition
        store_entry = KioskQueryStoreModel()
        if store_entry.get_one("id=%s", [query_definition.query_id]):
            cls._update_definition(store_entry, query_definition)
            store_entry.update(commit=True)
        else:
            cls.add(query)
        return query

    @classmethod
    def get(cls, query_id: str) -> KioskQuery | None:
        store_entry = KioskQueryStoreModel()
        if store_entry.get_one("id=%s", [query_id]):
            return KioskQueryFactory().load(store_entry.query)
        else:
            return None

    @classmethod
    def get_accessibility_dsl(cls):

        dsl =  KioskDSLLua()

        accessibility_resolver = DSLLuaMetaResolver([DSLLuaKioskConfigResolver(kioskglobals.cfg),
                                                     DSLLuaKioskDSDResolver(Dsd3Singleton.get_dsd3()),
                                                     DSLLuaSettingsResolver(kioskglobals.cfg)])
        dsl.on_get = accessibility_resolver
        return dsl


    @classmethod
    def check_accessibility(cls, dsl: KioskDSLLua, show_only_if: str) -> bool:
        pass

    @classmethod
    def list(cls, only_accessible_queries=False):
        """
        lists available queries from the store
        :param only_accessible_queries: Set to True if you want this to check the show_only_if attribute of each query
        :return: list of tuple (id, type, name, description, r.category, r.order_priority, r.show_only_if)
        """
        result = []
        store_entry = KioskQueryStoreModel()
        dsl = None
        for r in store_entry.all():
            if only_accessible_queries and r.show_only_if:
                if not dsl:
                    dsl = cls.get_accessibility_dsl()
                if dsl:
                    try:
                        if not dsl.eval(r.show_only_if):
                            continue
                    except BaseException as e:
                        logging.error(f"{cls.__name__}.list : {repr(e)}")
            result.append((r.id, r.query_type, r.name, r.description, r.category, r.order_priority, r.show_only_if))

        return result
