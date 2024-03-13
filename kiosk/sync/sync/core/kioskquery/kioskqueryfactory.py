from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.fulltextkioskquery import FullTextKioskQuery
from kioskquery.kioskquery import KioskQuery
from kioskquery.structuredkioskquery import StructuredKioskQuery, KioskQueryException


class KioskQueryFactory:
    @classmethod
    def load(cls, query_def: dict) -> KioskQuery:
        """
        returns a KioskQuery subclass appropriate for the given query_def.
        The query_def is expected to have the "meta/query_type:" attribute set to a known query type.
        :param query_def: a dictionary with a query definition
        :param uic_tree: the uic tree with UI definitions
        :return: an initialized KioskQuery subclass
        """
        if "meta" not in query_def:
            raise KioskQueryException(f"{cls.__name__}.load : Query definition has no meta section")

        if "query_type" not in query_def["meta"]:
            raise KioskQueryException(f"{cls.__name__}.load : Query definition has no query_type attribute")

        query_type = query_def["meta"]["query_type"].lower()
        if query_type == "structuredkioskquery":
            return StructuredKioskQuery(query_def, Dsd3Singleton.get_dsd3())
        elif query_type == "fulltextkioskquery":
            return FullTextKioskQuery(query_def, Dsd3Singleton.get_dsd3())
        else:
            raise KioskQueryException(f"{cls.__name__}.load : Query type {query_type} unknown.")
