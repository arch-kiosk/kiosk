from kioskquery.kioskquerylib import *


class KioskQueryDefinition:
    def __init__(self, query_definition: dict):
        raise NotImplementedError

    @property
    def raw_query_definition(self):
        raise NotImplementedError
        return self._raw_query_definition

    @property
    def query_id(self):
        raise NotImplementedError
        return "fulltextquery"

    @property
    def query_name(self):
        raise NotImplementedError
        return "Full Text Search"

    @property
    def query_description(self):
        raise NotImplementedError
        return ("Query all places in the archaeological record that match a text or statement "
                "and have them sorted by relevance")
