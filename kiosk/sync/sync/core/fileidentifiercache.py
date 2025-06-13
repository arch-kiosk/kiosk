import logging
from typing import Union, List

import yaml

from contextmanagement.contextdirectsqlquery import ContextDirectSqlQuery
from contextmanagement.contextindex import ContextIndex
from contextmanagement.contextquery import ContextQuery
from contextmanagement.sqlsourcecached import SqlSourceCached, CONTEXT_CACHE_NAMESPACE
from contextmanagement.sqlfieldformatters import register_formatters
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from databasedrivers import DatabaseDriver
from syncrepositorytypes import TYPE_FILE_IDENTIFIER_CACHE
from typerepository import TypeRepository

class FileIdentifierCache:

    @classmethod
    def register_fic_type(cls, type_repository: TypeRepository, context_type: str):
        type_repository.register_type(TYPE_FILE_IDENTIFIER_CACHE, context_type, context_type)

    @classmethod
    def build_fic_indexes(cls, sync_type_repository: TypeRepository, dsd: DataSetDefinition) -> bool:
        rc = True
        fic_indexes = sync_type_repository.list_types(TYPE_FILE_IDENTIFIER_CACHE)
        for fic_index in fic_indexes:
            context_type = "unknown"
            try:
                context_type = sync_type_repository.get_type(TYPE_FILE_IDENTIFIER_CACHE, fic_index)
                logging.debug(f"{cls.__class__.__name__}.build_fic_type_indexes: building {context_type}")
                fic = FileIdentifierCache(dsd, context_type=context_type)
                if fic.build_file_identifier_cache_from_contexts():
                    logging.info(f"{cls.__class__.__name__}.build_fic_type_indexes: building {context_type} done")
                else:
                    logging.info(f"{cls.__class__.__name__}.build_fic_type_indexes: building {context_type} failed.")
                    rc = False
            except BaseException as e:
                logging.error(f"{cls.__name__}.build_fic_indexes: Error building fic {fic_index}, "
                              f"context type {context_type}: {repr(e)}")
                rc = False
        return rc

    def __init__(self, dsd, context_type="file_search", cache_name=""):
            self.context_type = context_type
            if cache_name:
                self.cache_name = cache_name
            else:
                self.cache_name = "file_identifier_cache" if context_type == "file_search" else context_type + "_cache"
            self.dsd = dsd

    def build_file_identifier_cache_from_contexts(self, commit=False) -> bool:
        sql_source = self._get_sql_source()
        if sql_source:
            sql_source.build_cache(commit=commit)
            # if commit:
            #     KioskSQLDb.commit()
            logging.debug(f"{self.__class__.__name__}.migrate: cache {self.cache_name} successfully rebuilt. ")
            return True
        return False

    def _get_sql_source(self) -> Union[SqlSourceCached, None]:
        """
        :return: SqlSourceCached
        """
        fid = ContextIndex(self.dsd, name=self.cache_name)
        if fid.add_context_type(self.context_type):
            register_formatters(dsd=self.dsd, context=fid)
            # noinspection PyTypeChecker
            return fid.select_all(field_or_instruction="uid_file()",
                                  sql_source_class=SqlSourceCached,
                                  additional_fields=[("describes_file()", "description", "", "dsd_type(varchar)")])
        else:
            return None

    def get_contexts_for_file(self, file_uuid: str, primary_only=True):
        """
        fetches the context identifiers and record types (recording contexts) from the file identifier cache.

        :param file_uuid: the uuid of a file
        :param primary_only: default is True. returns only the primary context identifiers for a file.
        :return: list of tuples of type (context identifier, record type). No contexts -> empty list.
        """
        query = ContextQuery(self._get_sql_source())
        query.qualify("data", f"= '{file_uuid}'")
        if primary_only:
            query.qualify("primary", f"= true")

        contexts = set()
        for r in query.records(new_page_size=-1):
            contexts.add((r["identifier"], r["record_type"]))

        return list(set(contexts))

    def update_file(self, file_uuid, commit=False):
        sql_source = self._get_sql_source()
        sql_source.build_cache(commit=commit, condition_field="data", condition=f"='{file_uuid}'")

    def get_records_with_context(self, context="", equals=True, compare_as_part=False, id_uuid="") -> ContextQuery:
        if compare_as_part:
            comparison = DatabaseDriver.case_insensitive_comparison(DatabaseDriver.wildcard(context))
        else:
            comparison = f"={DatabaseDriver.quote_value('VARCHAR', context)}"

        if equals:
            query = ContextQuery(self._get_sql_source())
            if context:
                query.qualify("identifier", comparison)
            else:
                if id_uuid:
                    query.qualify("id_uuid", f"={DatabaseDriver.quote_value('VARCHAR', id_uuid)}")
                else:
                    query.qualify("identifier", f"is not null")

        else:
            if context:
                query = ContextDirectSqlQuery(self._get_sql_source())
                params = {"sql": "distinct data from {base} where data not in (select distinct data from {base} "
                                 f"where identifier {comparison})"}

                query.define_from_dict(params)
            else:
                # this makes no sense since the file identifier cache does not have records without an identifier
                return None
        return query

    def get_files_with_context(self, context="", equals=True, compare_as_part=False):
        """
        returns a list of files linked to the given context.

        With equals=False the query can be negated.
        Keep in mind in this case that you can only get files back that are in the
        file identifier cache at all! Files that are not connected to any identifer at all
        are not in the file identifier cache.

        :param context: if empty all files in the file identifier cache are concerned
        :param equals: default True. If False this will return all files that are NOT in any way connected
                        to the context
        :param compare_as_part: If set the given context is supposed to be just part of a context identifier.
                                That way an identifier like "%Wheeler%" would be searched (case insensitive, too).
        :return:
        """

        query = self.get_records_with_context(context, equals, compare_as_part)
        if not query:
            return []

        files = set()
        for r in query.records(new_page_size=-1):
            files.add(r["data"])

        return list(files)

    def get_files_with_record_type(self, record_type, equals=True):

        if equals:
            query = ContextQuery(self._get_sql_source())
            query.qualify("record_type", f"={DatabaseDriver.quote_value('VARCHAR', record_type)}")
        else:
            query = ContextDirectSqlQuery(self._get_sql_source())
            params = {"sql": "distinct data from {base} where data not in (select distinct data from {base} "
                             f"where record_type={DatabaseDriver.quote_value('VARCHAR', record_type)})"}
            query.define_from_dict(params)

        files = set()
        for r in query.records(new_page_size=-1):
            files.add(r["data"])

        return list(files)

    def get_distinct_contexts(self):
        query = ContextDirectSqlQuery(self._get_sql_source())
        params = {"sql": "distinct identifier, id_uuid from {base}"}

        query.define_from_dict(params)

        identifiers = list()
        for r in query.records(new_page_size=-1):
            identifiers.append((r["identifier"], r["id_uuid"]))

        return identifiers

    def get_primary_identifier(self, uuid_identifier: str)->List:
        query = ContextDirectSqlQuery(self._get_sql_source())

        # note: It really needs this order by down there! The primary identifiers first and only if there is no
        # primary identifier a non-primary can be accepted. See bug in ticket #3072
        params = {"sql": "* from {base} where "
                         # f"{KioskSQLDb.sql_safe_ident('primary')}=true and"
                         f" {KioskSQLDb.sql_safe_ident('id_uuid')} ="
                         f" {DatabaseDriver.quote_value('UUID', uuid_identifier)}"
                         f" order by {KioskSQLDb.sql_safe_ident('primary')} desc limit 1"}

        query.define_from_dict(params)
        r=[]
        for r in query.records(new_page_size=-1):
            break

        return r


    # seems not in use anymore?
    # @staticmethod
    # def get_cache_sql(fields=None, primary=False):
    #     """
    #     returns an sql statement that queries all uids and identifiers from the cache.
    #     This is used to form a join between a cache and another table.
    #     This does not make sure that the cache actually exists and is up to date.
    #
    #     :param fields: the fields to include.
    #                     default is: "data": file's uid,
    #                                 "identifier": the associated context identifier.
    #     :param primary: if set only primary identifiers are queried
    #     :return: str: an sql statement with the fields given.
    #     """
    #     if fields is None:
    #         fields = ["data", "identifier"]
    #     sql = "select distinct "
    #     sql += ",".join([KioskSQLDb.sql_safe_ident(field) for field in fields])
    #     sql += f" from {KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE, self.cache_name)}"
    #     sql += f" where {KioskSQLDb.sql_safe_ident('identifier')} is not null"
    #     if primary:
    #         sql += f" and {KioskSQLDb.sql_safe_ident('primary')}"
    #
    #     return sql
