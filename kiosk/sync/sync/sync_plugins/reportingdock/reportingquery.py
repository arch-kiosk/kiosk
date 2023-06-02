from kioskquery.kioskqueryvariables import KioskQueryVariables


class ReportingQuery:
    def __init__(self, query_dict: dict, variables: KioskQueryVariables, namespace: str, template_strings=None):
        if template_strings is None:
            template_strings = {}
        self._query_dict = query_dict
        self._variables = variables
        self._namespace = namespace
        self._template_strings = template_strings
        self.debug = False

    def execute(self, prepare_first_run=False):
        """
        executes the query
        :param prepare_first_run: set to true if this is the first run in a series of linked runs. Can be used
                by a ReportingQuery to prepare or empty tables
        """
        raise Exception(NotImplementedError)
