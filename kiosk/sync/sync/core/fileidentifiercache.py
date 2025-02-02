import logging
from typing import Union

import yaml

from contextmanagement.contextdirectsqlquery import ContextDirectSqlQuery
from contextmanagement.contextindex import ContextIndex
from contextmanagement.contextquery import ContextQuery
from contextmanagement.sqlsourcecached import SqlSourceCached, CONTEXT_CACHE_NAMESPACE
from contextmanagement.sqlfieldformatters import register_formatters
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from kiosksqldb import KioskSQLDb
from databasedrivers import DatabaseDriver


class FileIdentifierCache:

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

        if compare_as_part:
            comparison = DatabaseDriver.case_insensitive_comparison(DatabaseDriver.wildcard(context))
        else:
            comparison = f"={DatabaseDriver.quote_value('VARCHAR', context)}"

        if equals:
            query = ContextQuery(self._get_sql_source())
            if context:
                query.qualify("identifier", comparison)
            else:
                # this should never be the case, anyhow:
                query.qualify("identifier", f"is not null")

        else:
            if context:
                query = ContextDirectSqlQuery(self._get_sql_source())
                params = {"sql": "distinct data from {base} where data not in (select distinct data from {base} "
                                 f"where identifier {comparison})"}

                query.define_from_dict(params)
            else:
                # this makes no sense since the file identifier cache does not have records without an identifier
                return []

        files = set()
        for r in query.records(new_page_size=-1):
            files.add(r["data"])

        # for r in query.records(new_page_size=-1):
        #     files.add(r["data"])

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
