import logging

from .kioskcontext import KioskContext, KioskContextError
from dsd.dsd3 import DataSetDefinition
from .contextquery import ContextQuery
from .sqlsource import SqlSource
from .sqlsourceinmemory import SqlSourceInMemory


class ContextIndex:
    def __init__(self, dsd: DataSetDefinition, name="", include_primary_record_type=False):
        """
        A ContextIndex is a collection of contexts that can be queried together as one.

        :param dsd: DataSetDefinition
        :param name: name being used to instantiate the SQLSourceClass.
                     Only necessary if you want to use a SQLSourceClass makes use of a name.
        :param include_primary_record_type: includes the field "primary_record_type" in the result set.
                                            By default, (and for legacy reasons) this is not the case.
        """
        self._contexts: [KioskContext] = []
        self._include_primary_record_type = include_primary_record_type
        self._dsd = dsd
        self._name = name

    def from_dict(self, index_def: dict):
        """
        reads a context index definition from a dictionary
        :param index_def: a dictionary with a regular context index definition
        """
        context_defs = index_def["contexts"]
        for context_def in context_defs:
            if isinstance(context_def, dict):
                self.add_context_definition(context_def)
            elif isinstance(context_def, str):
                if context_def[0] == ":":
                    self.add_context_type(context_def[1:])
                else:
                    self.add_dsd_context_definition(context_def)
            else:
                raise KeyError(f"{self.__class__.__name__}.from_dict: "
                               f"Key {context_def} of index definition has wrong format.")

    def has_no_scope(self):
        return len(self._contexts) == 0

    def read_from_dsd(self, index_id: str):
        """
        adds a context index definition from the dsd to the index
        :param index_def: a valid name for a context index definition in the dsd
        """
        return NotImplementedError

    def add_context_definition(self, context_scope_def):
        """
        adds a context definition to the list of contexts combined in this index.
        :param context_scope_def: a valid scope definition of a context.
        """
        context = KioskContext("", self._dsd)
        context.include_primary_record_type = self._include_primary_record_type
        context.from_dict(context_scope_def, scope_only=True)
        self._contexts.append(context)

    def add_dsd_context_definition(self, context_id: str):
        """
        adds a context definition to the list of contexts combined in this index.
        :param context_id: a valid scope definition of a context.
        """
        context = KioskContext(context_id, self._dsd)
        context.include_primary_record_type = self._include_primary_record_type
        context.read_from_dsd()
        self._contexts.append(context)

    def add_context_type(self, context_type: str) -> bool:
        """
        adds all context definitions of the given type to the index.
        :param context_type: a valid context type id.
        """
        contexts = self._dsd.get_context_names(context_type=context_type)
        if not contexts:
            logging.error(f"{self.__class__.__name__}.add_context_type: context type {context_type} "
                          f"does not yield any context definitions.")
            return False
        for context_id in contexts:
            self.add_dsd_context_definition(context_id)
        return True

    def select_all(self, field_or_instruction: str, field_from_record_type: str = "",
                   sql_source_class: SqlSource.__class__ = SqlSourceInMemory,
                   additional_fields: list = None, output_format: str = "") -> SqlSource:
        """
        prepares a query for all the values of all fields that match a search_term in all of the indexes contexts
        Or in other words: selects all records in all the contexts of the index.

        :param field_or_instruction: either a field name or an instruction that marks fields.
                                     The field name or instruction name can be prefixed by a record_type/table name:
                                     e.g. locus.identifier() / locus.type
                                     will only query the identifer field in record_type locus/ the type field in locus.
        :param sql_source_class: A subclass of ContextQuery
                that will be instantiated to produce the query results. ContextQueryInMemory will be used as a default.
        :param additional_fields: see KioskContext.select!
        :param output_format: unclear
        :returns: a ContextQuery subclass that produces the query results.
        :exception KioskContextDuplicateInstructionError:
                You used an instruction in field_or_instruction
                or additional_fields that is used in more than one field in the dsd of one of the tables
                in the context.
        """
        sql_source = sql_source_class(name=self._name)
        for ctx in self._contexts:
            sql_source.add_source(ctx.select_all(field_or_instruction=field_or_instruction,
                                                 field_from_record_type=field_from_record_type,
                                                 sql_source_class=sql_source_class,
                                                 additional_fields=additional_fields,
                                                 output_format=output_format))
        return sql_source

    def register_output_formatter(self, name, formatter):
        """
        registers an output formatter under the given name
        :param name: the name of the output-format instruction this formatter listens to
        :param formatter: a SqlFieldFormatter instance
        """
        for ctx in self._contexts:
            ctx.register_output_formatter(name, formatter)
