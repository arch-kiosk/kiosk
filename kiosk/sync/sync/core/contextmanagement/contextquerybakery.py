import logging
import nanoid

from dsd.dsd3 import DataSetDefinition
from .contextdirectsqlquery import ContextDirectSqlQuery
from .contextindex import ContextIndex
from .contextquery import ContextQuery
from .kioskcontext import KioskContext
from .sqlfieldformatters import register_formatters
from .cqlconstants import CqlError


CQL_VERSION = 0.1


class ContextQueryBakery:
    # noinspection PyTypeChecker

    def __init__(self, dsd: DataSetDefinition):
        self._query_classes = {}
        self._cql = {}
        self._identifier = ""
        self.kiosk_context: KioskContext = None
        self._target_field_or_instruction = ""
        self._target_format = ""

        # additional_field is a tuple: (field_or_instruction, output_name, default, field_format, field_substitute)
        # field_format and field_substitute can be empty.
        self._additional_fields = []
        self._dsd = dsd
        self.register_query_class("Raw", ContextQuery)
        self.register_query_class("DirectSqlQuery", ContextDirectSqlQuery)

    def _set_cql(self, cql):
        self._cql = cql

    def _register_formatters(self, context: KioskContext):
        register_formatters(dsd=self._dsd, context=context)

    def _check_meta(self) -> bool:
        try:
            if "cql" not in self._cql or not isinstance(self._cql["cql"], dict):
                raise CqlError(f"cql query: Entirely wrong basic structure. Has to start with \"cql\": followed by dict.")
            if float(self._cql["cql"]["meta"]["version"]) > CQL_VERSION:
                raise CqlError(f"Version {self._cql['cql']['meta']['version']} not supported. Max is {CQL_VERSION}")
            if "base" not in self._cql["cql"]:
                raise CqlError(f"Cql format error: 'cql>base' not found")
            if "query" not in self._cql["cql"]:
                raise CqlError(f"Cql format error: 'cql>query' not found")

            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._check_meta : {repr(e)}")
            raise e

    def _prepare_base(self) -> None:
        try:
            try:
                self._identifier = self._cql["cql"]["base"]["identifier"]
            except KeyError:
                pass
            if "target" not in self._cql["cql"]["base"] \
                    or "field_or_instruction" not in self._cql["cql"]["base"]["target"]:
                raise CqlError("no field_or_instruction defined in cql>base")
            self._target_field_or_instruction = self._cql["cql"]["base"]["target"]["field_or_instruction"]
            try:
                self._target_format = self._cql["cql"]["base"]["target"]["format"]
            except KeyError:
                pass
            self._get_additional_fields()
            self._get_scope()
            self._register_formatters(self._kiosk_context)

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._prepare_base: {repr(e)}")
            raise CqlError(repr(e))

    def _get_additional_fields(self):
        if "additional_fields" not in self._cql["cql"]["base"]:
            return
        for output_name in self._cql["cql"]["base"]["additional_fields"].keys():
            additional_field = ()
            field = self._cql["cql"]["base"]["additional_fields"][output_name]

            for term in ["field_or_instruction", "default"]:
                if term not in field:
                    raise CqlError(f"no {term} defined for additional field {output_name}.")

            field_format = field["format"] if "format" in field else ""
            field_substitute = field["substitute"] if "substitute" in field else ""

            additional_field = (field["field_or_instruction"], output_name, field["default"], field_format,
                                field_substitute)
            self._additional_fields.append(additional_field)

    def _get_scope(self):
        if "scope" not in self._cql["cql"]["base"]:
            raise CqlError("scope missing in cql query")
        scope = self._cql["cql"]["base"]["scope"]
        if isinstance(self._cql["cql"]["base"]["scope"], str):
            # either a named context or a named index
            try:
                self._get_named_scope(scope)
                return
            except CqlError:
                pass

        if isinstance(self._cql["cql"]["base"]["scope"], list):
            # this must be an index definition
            self._kiosk_context = ContextIndex(name="i" + nanoid.generate("abcdefghijklmnopqrstuvwxyz1234567890"),
                                               dsd=self._dsd)
            self._kiosk_context.from_dict({"contexts": self._cql["cql"]["base"]["scope"]})
        elif isinstance(self._cql["cql"]["base"]["scope"], dict) or isinstance(self._cql["cql"]["base"]["scope"], str):
            # this must be a context definition, even if just an auto-scope instruction.
            self._kiosk_context = KioskContext(name="c" + nanoid.generate("abcdefghijklmnopqrstuvwxyz1234567890"),
                                               dsd=self._dsd)
            self._kiosk_context.from_dict(self._cql["cql"]["base"]["scope"], scope_only=True)

        else:
            raise CqlError(f"scope expects a string, list or dictionary.")

        if not self._kiosk_context:
            raise CqlError(f"no KioskContext after attempt to read the scope.")
        if self._kiosk_context.has_no_scope():
            raise CqlError(f'It was not possible to resolve the scope of the CQL '
                           f'definition {self._cql["cql"]["base"]["scope"]}')

    def _get_named_scope(self, scope_name):
        contexts = self._dsd.get_context_names()
        if scope_name in contexts:
            self._kiosk_context = KioskContext(name=scope_name, dsd=self._dsd)
            self._kiosk_context.read_from_dsd()
        else:
            raise CqlError(f"scope name {scope_name} does not refer to a known context definition. "
                           f"If it refers to an index, note that named indexes are not implemented, yet")

    def register_query_class(self, name: str, query_class):
        self._query_classes[name.lower()] = query_class

    def _get_query_type(self):
        if "type" not in self._cql["cql"]["query"]:
            query_type = "operatorquery"
        else:
            query_type = self._cql["cql"]["query"]["type"].lower()

        if query_type in self._query_classes:
            query_class = self._query_classes[query_type]
        else:
            raise CqlError(f"Query-type {query_type} is unknown.")

        return query_class

    def _prepare_query(self):
        try:
            return self._get_query_type()

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._prepare_query: {repr(e)}")
            raise CqlError(repr(e))

    def get_query(self, cql: dict) -> ContextQuery:
        self._set_cql(cql)
        self._check_meta()
        self._prepare_base()
        self._kiosk_context.include_primary_record_type = True
        query_class = self._prepare_query()

        try:
            if self._identifier:
                query = query_class(self._kiosk_context.select(identifier=self._identifier,
                                                               field_or_instruction=self._target_field_or_instruction,
                                                               output_format=self._target_format,
                                                               additional_fields=self._additional_fields
                                                               ))
            else:
                query = query_class(
                    self._kiosk_context.select_all(field_or_instruction=self._target_field_or_instruction,
                                                   output_format=self._target_format,
                                                   additional_fields=self._additional_fields
                                                   ))
            query.define_from_dict(self._cql["cql"]["query"])
            return query
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_query: {repr(e)}")
            raise CqlError(repr(e))
