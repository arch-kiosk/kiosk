from contextmanagement.contextquery import ContextQuery
from dsd.dsd3 import DataSetDefinition
from kioskquery.kioskqueryresult import KioskQueryResult


class KioskQueryResultCQL(KioskQueryResult):

    def __init__(self, dsd: DataSetDefinition, query_information: dict, query: ContextQuery, kiosk_query_def: dict):
        super().__init__(dsd, query_information)
        self._query = query
        self._column_names = []
        self._process_column_information()
        self._process_include_dsds(kiosk_query_def)
        self._supports_pagination = True

    @property
    def page_count(self):
        return self._query.page_count

    @property
    def overall_record_count(self):
        return self._query.overall_record_count

    def _process_column_information(self):
        dsd_fields = {}

        for type_info in self._query.type_info.extended_field_information:
            dsd_fields[type_info[0]] = (type_info[1], type_info[2])

        for c, v in self._query.columns.items():
            source_field = v["source_field"]
            if source_field in dsd_fields:
                self._add_column_information_from_dsd(c, dsd_fields[source_field][1], dsd_fields[source_field][0])

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
        """
        records = self._query.records(page=page, new_page_size=new_page_size)
        self._column_names = self._query.get_column_names()
        return records

    def close(self):
        if self._query:
            self._query.close()

    def get_column_names(self):
        """
        returns the column names in the order of the intended appearance.
        """
        if not self._column_names:
            self._column_names = self._query.get_column_names()
        return self._column_names
