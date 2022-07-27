import copy

from contextmanagement.identifiercache import IdentifierCache
from kiosksqldb import KioskSQLDb


class MemoryIdentifierCache(IdentifierCache):
    # constants to address the values in an cache tuple
    UID = 0
    IDX = 1

    def __init__(self, *args, **kwargs):
        """
        inits the identifier cache on the basis of the dsd
        :param dsd: the dsd
        """
        super().__init__(*args, **kwargs)
        self._identifier_cache: dict = {}
        self.rebuild_cache()

    def rebuild_cache(self) -> int:
        self._identifier_cache.clear()
        cur = KioskSQLDb.get_dict_cursor()
        try:
            for idx_identifier in range(0, len(self._identifiers)):
                select_sql = self._get_sql(self._identifiers[idx_identifier], idx_identifier)
                cur.execute(select_sql)
                r = cur.fetchone()
                while r:
                    _id = r["identifier"]
                    if _id in self._identifier_cache:
                        self._identifier_cache[r["identifier"]].append((r["uid"], idx_identifier))
                    else:
                        self._identifier_cache[r["identifier"]] = [(r["uid"], idx_identifier)]
                    r = cur.fetchone()

        finally:
            cur.close()
        return len(self._identifier_cache)

    def has_identifier(self, identifier: str) -> bool:
        return identifier.upper() in self._identifier_cache

    def get_recording_contexts(self, identifier: str) -> list:
        """
        returns the recording contexts (record types) of an identifier as a list of 4-tuples:
        (table, name of identifier()-field, name of replfield_uid()-field, uid of the record containing the identifier)
        :param identifier: an actual identifier
        :return: list of record types as a 4-tuple (see above) or empty list.
        :exception: throws exceptions, e.G. KeyError if the identifier does not exist at all.
        """
        cache_entries = self._identifier_cache[identifier.upper()]
        result = []
        for cache_entry in cache_entries:
            table = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_TABLE]
            id_field = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_ID_FIELD]
            uid_field = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_UID_FIELD]
            result.append((table, id_field, uid_field, cache_entry[self.UID]))
        return result

    def get_recording_context(self, identifier: str, fail_on_multiple=False) -> tuple:
        """
        returns the recording context (record type) of an identifier as a 4-tuple:
        (table, name of identifier()-field, name of replfield_uid()-field, uid of the record containing the identifier)

        :param fail_on_multiple: if an identifier has more than one record types in the cache
                                 and fail_on_multiple is not set the first will be returned
                                 otherwise an Exception will be thrown
        :param identifier: an actual identifier
        :return: record type as a 4-tuple (see above) or ()
        :exception: throws exceptions, e.G. KeyError if the identifier does not exist at all or
                                            ValueError if more than one record type was found.
        """
        cache_entries = self._identifier_cache[identifier.upper()]
        result = ()
        if cache_entries:
            if len(cache_entries) > 1 and fail_on_multiple:
                raise ValueError(f"identifier {identifier} is associated with more than one record type")
            cache_entry = cache_entries[0]
            table = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_TABLE]
            id_field = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_ID_FIELD]
            uid_field = self._identifiers[cache_entry[self.IDX]][self.IDENTIFIER_UID_FIELD]
            result = (table, id_field, uid_field, cache_entry[self.UID])
        return result

    def delete_identifier(self, identifier: str, recording_context: str = ""):
        pass

    def get_identifiers(self) -> [str]:
        return list(self._identifier_cache.keys())
