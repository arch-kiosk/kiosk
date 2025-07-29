from dsd.dsd3 import DataSetDefinition

class  DataSetDefinitionCache(DataSetDefinition):
    # noinspection PyMissingConstructor
    def __init__(self, dsd_store=None, dsd: DataSetDefinition=None):
        if dsd:
            super().__init__(dsd._dsd_data)
        else:
            super().__init__(dsd_store=dsd_store)
        if dsd:
            dsd._clone_refs(self)




