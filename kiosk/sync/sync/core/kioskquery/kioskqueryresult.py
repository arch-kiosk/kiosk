from dsd.dsd3 import DataSetDefinition
from kioskquery.kioskquerylib import KioskQueryException
from simplefunctionparser import SimpleFunctionParser

DEFAULT_PAGE_SIZE = 50


class KioskQueryResult:
    def __init__(self, dsd, query_information: dict, *args, **kwargs):
        self._dsd: DataSetDefinition = dsd
        self._supports_pagination: bool = False
        self._included_dsd_tables = set()
        self._page_size = DEFAULT_PAGE_SIZE
        self._page_count = -1
        self._overall_record_count = -1
        self._column_information: dict = {}
        self._query_information = query_information

    @property
    def page_size(self):
        return self._page_size

    @property
    def supports_pagination(self):
        return self._supports_pagination

    @property
    def page_count(self):
        return self._page_count

    @property
    def overall_record_count(self):
        return self._overall_record_count

    def _include_dsd_table(self, table_name: str):
        self._included_dsd_tables.add(table_name)

    def _process_include_dsds(self, kiosk_query_def):
        if "dsd_includes" in kiosk_query_def:
            for table in kiosk_query_def["dsd_includes"]:
                self._include_dsd_table(table)

    def _add_column_information_from_dsd(self, sql_field, dsd_table, dsd_field=""):
        column_info = self._dsd.get_unparsed_field_instructions(dsd_table, dsd_field if dsd_field else sql_field)
        self._column_information[sql_field] = column_info
        self._include_dsd_table(dsd_table)

    # noinspection PyPep8Naming
    def get_DSD_information(self) -> dict:
        """
        returns the DSD information for all involved DSD tables.
        :return: dict {"table" -> dict with dsd information}
        :except: all kinds of exceptions are thrown, mostly veiled as KioskQueryException
        """
        result = {}
        for table in self._included_dsd_tables:
            try:
                dsd_info = self._dsd.get_table_definition("locus")
                if dsd_info:
                    result[table] = dsd_info
            except BaseException as e:
                raise KioskQueryException(f"{self.__class__.__name__}.get_DSD_information: {repr(e)}")
        return result

    def get_document_information(self):
        """
        returns key information about columns. The key information is a sub-set of the dsd. This here is for
        :returns: dict {"columns" -> {"column" -> {datatype: string, identifier: bool},
                        "query" -> {"type": string}}
        """
        result = {"columns": {}, "query": {}}
        columns = result["columns"]
        parser = SimpleFunctionParser()
        for col, col_info in self._column_information.items():
            columns[col] = {"identifier": False, "datatype": ""}
            for instruction in col_info:
                instruction: str
                if instruction.lower().startswith('identifier'):
                    columns[col]["identifier"] = True
                if instruction.lower().startswith('datatype'):
                    parser.parse(instruction)
                    if parser.ok:
                        columns[col]["datatype"] = parser.parameters[0]
                    else:
                        raise KioskQueryException(f"{self.__class__.__name__}.get_document_information: "
                                                  f"Error in datatype of column {col}: {instruction}")
        if self._query_information:
            result["query"] = self._query_information
        return result

    def get_documents(self, page=1, new_page_size=0):
        raise NotImplementedError

    def close(self):
        """
        Makes sure that all resources are freed
        """
        raise NotImplementedError
