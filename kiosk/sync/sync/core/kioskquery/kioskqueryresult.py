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
        self.column_order = []
        # self._page_count = -1
        # self._overall_record_count = -1

        # the list-value of "_column_information" is basically a list of all dsd instructions for a field
        # but the first two element are always: the dsd table and dsd field name!
        # the key for the dictionary is the cql or sql output field name (column name).
        self._column_information: dict[str, list] = {}
        self._query_information = query_information

    @property
    def page_size(self):
        return self._page_size

    @property
    def supports_pagination(self):
        return self._supports_pagination

    @property
    def page_count(self):
        raise NotImplementedError

    @property
    def overall_record_count(self):
        raise NotImplementedError

    def _include_dsd_table(self, table_name: str):
        self._included_dsd_tables.add(table_name)

    def _process_include_dsds(self, kiosk_query_def):
        if "dsd_includes" in kiosk_query_def:
            for table in kiosk_query_def["dsd_includes"]:
                self._include_dsd_table(table)

    def _get_valid_extra_column_information(self, kiosk_query_def: dict):
        if "column_information" not in kiosk_query_def:
            return

        for field, value in kiosk_query_def["column_information"].items():
            if type(value) is str:
                value = [value]

            yield field, value

    def _add_column_information_from_dsd(self, sql_field, dsd_table, dsd_field=""):
        """
        # adds a new entry to the internal _column_information dict which is required to connect cql / sql - columns
        # to dsd tables/fields and their information.
        # The list-value of "_column_information" is basically a list of all dsd instructions for a field
        # but the first two element are always: the dsd table and dsd field name!
        # the key for the dictionary is the cql or sql output field name (column name).

        :param sql_field: the name of the output column
        :param dsd_table: the dsd table
        :param dsd_field: the dsd field name (if absent sql_field will be used instead)
        """
        column_info = [dsd_table, dsd_field if dsd_field else sql_field]
        column_info.extend(self._dsd.get_unparsed_field_instructions(dsd_table, dsd_field if dsd_field else sql_field))
        self._column_information[sql_field] = column_info
        self._include_dsd_table(dsd_table)

    def _add_column_information_from_list(self, sql_field, field_instructions: list):
        """
        # adds a new entry to the internal _column_information dict or updates an existing entry.
        # The _column_information dict is required to connect cql / sql - columns

        :param sql_field: the name of the output column
        :param field_instructions: list of raw dsd field instructions
        """
        if field_instructions:
            if sql_field in self._column_information:
                column_info = self._column_information[sql_field]
            else:
                column_info = ["", sql_field]
            column_info.extend(field_instructions)
            self._column_information[sql_field] = column_info

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
                dsd_info = self._dsd.get_table_definition(table)
                if dsd_info:
                    result[table] = dsd_info
            except BaseException as e:
                raise KioskQueryException(f"{self.__class__.__name__}.get_DSD_information: {repr(e)}")
        return result

    def get_document_information(self):
        """
        returns key information about columns. The key information is a sub-set of the dsd.
        :returns: dict {"columns" -> {"column" -> {datatype: string,
                                                   identifier: bool,
                                                   table: string,
                                                   field: string,
                                                   label: string},
                        "query" -> {"type": string}}
        """
        result = {"columns": {}, "column_order": self.get_ordered_column_names(), "query": {}}
        columns = result["columns"]
        parser = SimpleFunctionParser()
        for col, col_info in self._column_information.items():
            columns[col] = {"identifier": False, "datatype": "", "table": col_info[0], "field": col_info[1]}
            for instruction in col_info[2:]:
                instruction = instruction.lower()
                if instruction.startswith('identifier'):
                    columns[col]["identifier"] = True
                elif instruction.startswith('label'):
                    parser.parse(instruction)
                    if parser.ok:
                        columns[col]["label"] = parser.parameters[0]
                    else:
                        raise KioskQueryException(f"{self.__class__.__name__}.get_document_information: "
                                                  f"Error in label instructions of column {col}: {instruction}")
                elif instruction.startswith('datatype'):
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

    def _read_column_order(self, kiosk_query_def: dict):
        """
        Just reads the column order if any from the query definition.

        :return: None
        """
        if "column_order" in kiosk_query_def:
            self.column_order = kiosk_query_def["column_order"]

    def get_ordered_column_names(self):
        """
        returns the column names that are visible in the order of their intended appearance.

        :return:
        """
        column_names = self.get_column_names()
        if self.column_order:
            return [c for c in self.column_order if c in column_names]
        else:
            return column_names

    def get_column_names(self):
        """
        returns the column names
        """
        raise NotImplementedError
