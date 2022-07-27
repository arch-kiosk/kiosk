import logging

from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb


class FileRewirerer:
    def __init__(self, dsd: DataSetDefinition):
        self._dsd = dsd
        self._file_fields = self._dsd.list_file_fields()

    def rewire_file(self, uid_file, uid_file_rewired):
        """
        rewires all file fields in all of the tables in the dsd from one uid to a new uid.
        Should only be used for redundant files that failed to import and need to be rewired to
        the already known file record.

        :param uid_file: the uid that will be replaced
        :param uid_file_rewired: the uid with which uid_file is going to be replaced
        """
        for t in self._file_fields.keys():
            for f in self._file_fields[t]:
                try:
                    sql = f"update {KioskSQLDb.sql_safe_ident(t)} set {KioskSQLDb.sql_safe_ident(f)}=%s " \
                          f"where {KioskSQLDb.sql_safe_ident(f)}=%s"
                    c = KioskSQLDb.execute(sql, parameters=[uid_file_rewired, uid_file])
                    if c:
                        logging.debug(f"rewired {c} files in {t}.{f}")

                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.rewire_file : Rewiring {uid_file} to {uid_file_rewired}"
                                  f"went wrong for file field {t}.{f}: {repr(e)}")
                    raise e
