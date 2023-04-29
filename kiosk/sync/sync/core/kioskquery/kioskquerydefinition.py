from kioskquery.kioskquerylib import *


class KioskQueryDefinition:
    def __init__(self, query_definition: dict):
        raise NotImplementedError

    @property
    def raw_query_definition(self):
        raise NotImplementedError

    @property
    def query_id(self):
        raise NotImplementedError

    @property
    def query_name(self):
        raise NotImplementedError

    @property
    def query_description(self):
        raise NotImplementedError
