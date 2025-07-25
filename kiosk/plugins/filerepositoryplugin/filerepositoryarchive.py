import copy
import logging
import re
from typing import Tuple, List

from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from .ModelFileRepository import ModelFileRepository
from sync_config import SyncConfig

FR_ARCHIVE_NAMESPACE = "FR_ARCHIVE"
class FileRepositoryArchive:

    @classmethod
    def check_archive_name(cls, archive_name: str):
        if not (archive_name and re.match(r"^[a-z0-9 _]+$", archive_name)):
            return ""
        archive_name = archive_name.replace(" ","_").lower()
        return archive_name

    @classmethod
    def get_archive_display_name(cls, archive_name:str):
        archive_name = archive_name.replace("_"," ").lower()
        return archive_name

    @classmethod
    def list_archives(cls, dsd) -> List:
        """
        lists the file archives that exist in schema FR_ARCHIVE_NAMESPACE
        :param dsd: a DataSetDefinition object
        :return: a list with the display name (!) of each archive
        :raises all kinds of exceptions are passed on
        """
        archive_tables = KioskSQLDb.list_tables(FR_ARCHIVE_NAMESPACE)
        files_table = "_" + dsd.files_table
        archives = [cls.get_archive_display_name(x[0:x.rfind(files_table)]) for x in archive_tables]
        return archives

    def __init__(self, dsd:DataSetDefinition, cfg: SyncConfig, archive_name: str):
        self._dsd = dsd
        self._cfg = cfg
        self._archive_name = self.check_archive_name(archive_name)
        if not self._archive_name:
            raise Exception(f"Archive name '{archive_name}' contains illegal characters. "
                            f"Please use only letters, digits and space. Operation aborted.")
        self._frf_options = {}
        self._selected_files = []

    @property
    def archive_table_name(self):
        return self.get_archive_table_name(self._archive_name,self._dsd.files_table)

    @classmethod
    def get_namespaced_archive_table_name(cls, archive_name: str, files_table: str):
        return KioskSQLDb.sql_safe_namespaced_table(FR_ARCHIVE_NAMESPACE,
                                                    cls.get_archive_table_name(archive_name, files_table))

    @classmethod
    def get_archive_table_name(cls, archive_name: str, files_table: str):
        return f"{archive_name}_{files_table}"

    def set_frf_options(self, frf_options: dict):
        self._frf_options = frf_options

    def set_selected_files(self, selected_files: List[str]):
        """
        sets a list of selected files.
        :param selected_files: by value (the input list gets copied)
        """
        self._selected_files = copy.copy(selected_files)

    def migrate_archive_table(self):
        migration = Migration(self._dsd, PostgresDbMigration(self._dsd, KioskSQLDb.get_con()),
                              self._cfg.get_project_id())
        rc = migration.migrate_datatable(self._dsd.files_table, prefix=self._archive_name + "_", namespace=FR_ARCHIVE_NAMESPACE)
        logging.debug(f"{self.__class__.__name__}.update_archive_table: migrate_datatable returned {rc}")
        if not rc:
            raise Exception(f"migrate_archive_table failed because migrate_datatable failed.")

    def move_fr_records(self, from_ns, from_table, to_ns, to_table):
        """
        copies filtered and selected rows from the source to the dest files table

        :param from_ns: the source schema name,  can be an empty string
        :param from_table: the source files table
        :param to_ns: the dest schema name, can be an empty string
        :param to_table: the dest files table
        :return: number of rows copied
        :raises passes all kinds of exceptions on.
        """
        source_table = KioskSQLDb.sql_safe_namespaced_table(from_ns, from_table)
        dest_table = KioskSQLDb.sql_safe_namespaced_table(to_ns, to_table)
        columns = self._dsd.list_fields(self._dsd.files_table)
        # columns = KioskSQLDb.get_table_columns(dest_table)
        sql_select, sql_from, params =  self.query_images(files_table_name=source_table, columns=columns)
        sql_selected_files_where, selected_files = self.get_where_selected_files()
        params.extend(selected_files)
        sp = KioskSQLDb.begin_savepoint()
        sql_insert = f"{'insert'} into {dest_table}({','.join(columns)}) {sql_select}{sql_from} {sql_selected_files_where}"
        sql_delete = f"{'delete'} from {source_table} where uid in (select i.uid {sql_from} {sql_selected_files_where})"
        try:
            rows = KioskSQLDb.execute(sql_insert, params)
            dels = KioskSQLDb.execute(sql_delete, params)
            if rows != dels:
                raise Exception("FileRepositoryArchive.copy_fr_records: numbers of inserted"
                                " and deleted rows don't match.")
            KioskSQLDb.commit_savepoint(sp)
        except BaseException as e:
            KioskSQLDb.rollback_savepoint(sp)
            raise e

        return rows

    def query_images(self, files_table_name: str, columns: List[str]) -> Tuple[str, str, List]:
        """
        uses the options set with set_frf_options to query images
        :param files_table_name:
        :param columns:
        :return: a Tuple with [select statement, from statement, list of sql parameters]
        """
        m_file_repository = ModelFileRepository(self._cfg, None)
        m_file_repository.set_filter_values(self._frf_options)
        str_columns = ",".join(["i." + x for x in columns])
        query_sql, params = m_file_repository.get_uid_query_sql(files_table_name=files_table_name)
        return f"select {str_columns}", f" from {files_table_name} i inner join ({query_sql}) q on q.uid = i.uid", params

    def get_where_selected_files(self) -> Tuple[str, List]:
        """
        returns a where statement that limits the output to the files (uids)
        that have been set via set_selected_files.

        :return: a Tuple of the where statement (including 'where' and the values
                  or an empty string if there are no selected files
        """
        if self._selected_files:
            files = ",".join(["%s" for x in range(0, len(self._selected_files))])
            str_where = f" where i.uid in ({files})"
            return str_where, self._selected_files
        else:
            return "", []

    def archive(self):
        self.migrate_archive_table()
        return self.move_fr_records("", self._dsd.files_table, FR_ARCHIVE_NAMESPACE, self.archive_table_name)

    def un_archive(self):
        self.migrate_archive_table()
        return self.move_fr_records(FR_ARCHIVE_NAMESPACE, self.archive_table_name,"", self._dsd.files_table)

