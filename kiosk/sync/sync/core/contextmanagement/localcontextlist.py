import cProfile

from fileidentifiercache import FileIdentifierCache


class LocalContextList:
    def __init__(self, context_fetcher):
        self._contexts = []
        self._context_fetcher = context_fetcher

    def _fetch_contexts(self):
        self._contexts = self._context_fetcher()
        return self._contexts

    def _read_contexts_once(self):
        """
        reads the contexts if the context list is empty.
        It does not read the contexts if the contexts have a null context tuple!
        """
        if not self._contexts:
            self._fetch_contexts()

    def _pop_null_context(self, contexts):
        """
        pops the null context from the given context list
        :param contexts:
        """
        if contexts:
            if contexts[0] == (None, None):
                contexts.pop(0)

    def add_context(self, identifier: str, record_type: str = ""):
        """
        adds the file to a context. Context changes are not permanent until push_contexts() is used!
        """
        self._read_contexts_once()
        self._contexts.append((identifier, record_type))

    def drop_context(self, identifier: str, record_type: str = ""):
        """
        unassigns the file from a context. Context changes are not permanent until push_contexts() is used!
        """
        self._read_contexts_once()
        self._contexts.remove((identifier, record_type))

    def clear_contexts(self):
        """
        Clears the file from all contexts. Context changes are not permanent until push_contexts() is used!
        Note that this inserts a null context, which signals that the contexts have been cleared
        and keeps get_context from reading the contexts again.
        """
        self._contexts = [(None, None)]

    def get_contexts(self):
        """
        get a list of context identifiers and record types for the file.
        :return: list of tuples of type (context identifier, record type), no context -> empty list
        """
        self._read_contexts_once()
        rc = list(self._contexts)
        self._pop_null_context(rc)
        return rc

    def get_dropped_contexts(self) -> list:
        """
        return contexts that have been dropped compared to the contexts in the data source.
        :return: list dropped contexts (context identifier, record type), no context -> empty list
        """
        dropped = list()

        former_contexts = self._context_fetcher()
        for c in former_contexts:
            if c not in self._contexts:
                dropped.append(c)

        return dropped

    def get_added_contexts(self) -> list:
        """
        return contexts that have been added compared to the contexts in the data source.
        :return: list of added contexts (context identifier, record type), no context -> empty list
        """
        added = list()

        former_contexts = self._context_fetcher()
        current_contexts = list(self._contexts)
        self._pop_null_context(current_contexts)
        for c in current_contexts:
            if c not in former_contexts:
                added.append(c)

        return added

    @property
    def count(self):
        return len(self._contexts)
