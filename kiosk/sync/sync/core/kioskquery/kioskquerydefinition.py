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

    @property
    def category(self):
        raw_query_definition = self.raw_query_definition
        return raw_query_definition["meta"]["category"] if (
                    "meta" in raw_query_definition and "category" in raw_query_definition["meta"]) else "-"

    @property
    def order_priority(self):
        raw_query_definition = self.raw_query_definition
        return raw_query_definition["meta"]["order_priority"] if (
                    "meta" in raw_query_definition and "order_priority" in raw_query_definition["meta"]) else "Z"

    @property
    def charts(self):
        return None

