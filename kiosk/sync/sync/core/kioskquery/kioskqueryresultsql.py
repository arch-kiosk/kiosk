import logging

from kioskquery.kioskquerylib import *
from copy import copy

from dsd.dsd3 import DataSetDefinition
from kioskquery.kioskqueryresult import KioskQueryResult
from kiosksqldb import KioskSQLDb
from simplefunctionparser import SimpleFunctionParser


class KioskQueryResultSQL(KioskQueryResult):
    def __init__(self, dsd: DataSetDefinition, query_information: dict, sql: str, kiosk_query_def: dict):
        super().__init__(dsd, query_information)
        self._sql = sql
        self._cur = None
        self._column_names = []
        self._process_column_information(kiosk_query_def)
        self._process_include_dsds(kiosk_query_def)
        self._supports_pagination = True
        self._page_count = 0
        self._overall_record_count = 0

    @property
    def page_count(self):
        return self._page_count

    @property
    def overall_record_count(self):
        return self._overall_record_count

    def _get_column_names(self, cur=None) -> list:
        """
        returns a list with the column names
        :param cur: an open cursor. In this case the column names will be taken from the open cursor and no additional
                    cursor is necessary.
        :return: list
        """
        close_cur = True
        if not self._column_names:
            if not cur:
                cur = KioskSQLDb.execute_return_cursor(self._sql + " limit 0")
            else:
                close_cur = False
            self._column_names = [desc[0] for desc in cur.description]
            if close_cur:
                cur.close()

        return self._column_names

    def _process_column_information(self, kiosk_query_def: dict):
        if "column_information" not in kiosk_query_def:
            return

        for field, value in kiosk_query_def["column_information"].items():
            if type(value) is str:
                value = [value]

            instruction = value[0]
            parser = SimpleFunctionParser()
            parser.parse(instruction)
            if parser.ok:
                if parser.instruction.lower() == 'dsd':
                    if len(parser.parameters) in [1, 2]:
                        self._add_column_information_from_dsd(field, *parser.parameters)
                        value.pop(0)
                    else:
                        raise KioskQueryException(f"{self.__class__.__name__}._process_column_information: "
                                                  f"Wrong number of parameters in column "
                                                  f"information for {field} : {value}")
            else:
                raise KioskQueryException(f"{self.__class__.__name__}._process_column_information: "
                                          f"Syntax Error in column information for {field}: {value}")

            try:
                self._add_column_information_from_list(field, value)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._process_column_information: {repr(e)}")
                raise e

    def get_documents(self, page=1, new_page_size=0):
        """
        returns the result of the Kiosk Query record by record.
        :param page:      the number of the page, starting with 1.
                          If page exceeds the number of pages an error will occur.
        :param new_page_size: optional. how many records should be returned per page?
                              Default is defined by DEFAULT_PAGE_SIZE.
                              if -1 than no pagination will occur and ALL records will be returned at once.
        :returns: yields either a dict or a JSON with data or None as eof.
                  If and ONLY IF page 1 is requested, the property page_count will be set.
                  And that only after the generator for page one has been consumed!
        :todo: This is very inefficient in the way it does pagination! It should be easy to use limit and offset here
               but that would require a consistent order of the records.
        """
        if new_page_size > 0:
            self._page_size = new_page_size

        self._page_count = 0
        self._overall_record_count = 0
        self._column_names = []

        record_count = 0
        self._cur = None
        r = None
        try:
            self._cur = KioskSQLDb.execute_return_cursor(self._sql)
            if self._cur:
                self._get_column_names(self._cur)
                r = self._cur.fetchone()
            while r:
                record_count += 1
                if new_page_size == -1 or ((page - 1) * self._page_size < record_count <= page * self._page_size):
                    yield dict(r)
                else:
                    if record_count > page * self._page_size:
                        if page > 1:
                            break
                r = self._cur.fetchone()

            if not r or (page == 1 and self._page_size > 0):
                self._page_count = record_count // self._page_size + 1 if record_count % self._page_size > 0 else 0
                self._overall_record_count = record_count

        finally:
            if self._cur:
                self._cur.close()
            self._cur = None

    def get_column_names(self):
        return self._column_names

    def close(self):
        if self._cur:
            self._cur.close()
        self._cur = None
