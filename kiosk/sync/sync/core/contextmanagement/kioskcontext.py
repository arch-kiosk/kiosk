import copy
import logging
import re
from uuid import uuid4

import nanoid

import kioskstdlib
from dsd.dsd3 import DataSetDefinition, Join
from dsd.dsdgraph import DsdGraph
from simplefunctionparser import SimpleFunctionParser
from kiosksqldb import KioskSQLDb
from .contexttypeinfo import ContextTypeInfo
from .sqlsource import SqlSource
from .sqlsourceinmemory import SqlSourceInMemory
from .sqlfieldformatters import SqlFieldFormatter


class KioskContextError(Exception):
    pass


class KioskContextTypeError(KioskContextError):
    pass


class KioskContextDuplicateInstructionError(KioskContextError):
    pass


# noinspection PyTypeChecker
class KioskContext:
    src_table_regex = r"^(?P<table>[a-z|_]*)\.(?P<field_or_instruction>.*)\Z"
    regex_table_and_field = re.compile(src_table_regex)

    def __init__(self, name: str, dsd=None):
        self.name = name
        # noinspection PyTypeChecker
        self._graph: DsdGraph = None
        self._type: str = ""
        self._dsd: DataSetDefinition = None
        self._include_primary_record_type = False

        self.identifier_table = ""
        self.identifier_field = ""
        self.id_uuid_field = ""

        self.data_table = ""
        self.data_field = ""
        self.data_uuid_field = ""

        self._additional_fields = []  # 5-tuple(field_or_instruction, field_name, default_value, output-format, substitute)
        self._output_format = ""
        self._output_formatters = {}

        self._lookup_tables = {}

        self._type_info: ContextTypeInfo = None
        self.set_dsd(dsd)

    @staticmethod
    def _rectify_additional_fields(additional_fields: list):
        """
        Just makes sure that all additional field tuples have 5 elements.
        That's for compatibility's sake.
        :returns: This changes the input list and returns the very same.
        """
        for idx, additional_field in enumerate(additional_fields):
            if len(additional_field) != 5:
                additional_field = kioskstdlib.adjust_tuple(additional_field, 5, "")
                additional_fields[idx] = additional_field
        return additional_fields

    @property
    def include_primary_record_type(self):
        """
        returns if the resulting sql statements have the primary_record_type field included.
        :return: bool
        """
        return self._include_primary_record_type

    @include_primary_record_type.setter
    def include_primary_record_type(self, value: bool):
        """
        sets if the resulting sql statements should have the primary_record_type field included.
        :param value: bool
        """
        self._include_primary_record_type = value

    def register_output_formatter(self, name: str, formatter: SqlFieldFormatter):
        """
        registers an output formatter under the given name
        :param name: the name of the output-format instruction this formatter listens to
        :param formatter: a SqlFieldFormatter instance
        """
        self._output_formatters[name] = formatter

    def set_dsd(self, dsd):
        if dsd:
            self._dsd = dsd
            self._type_info = ContextTypeInfo(dsd.get_field_datatype)

    def from_dict(self, context_data: dict, scope_only=False) -> None:
        """
        reads a context definition from the dict and creates the graph to navigate the context's structure.
        Necessary preparatory step before the context can be used for anything.
        :param context_data: dictionary with the context data (the name of the context not included)
        :param scope_only: optional. If set the context definition is expected to be a scope,
                so "type" and "scope" keywords are skipped.
        :returns: Nothing. Throws exceptions if things go wrong
        """

        # main function
        self._graph = DsdGraph(self._dsd)
        if scope_only:
            self._type = ""
            self._graph.add_tables(context_data)
        else:
            self._type = context_data["type"]
            self._graph.add_tables(context_data["scope"])

    def has_no_scope(self):
        return self._graph.is_empty() if self._graph else True

    def read_from_dsd(self):
        """
        reads the context from the dsd.
        :returns: Noting. Throws exceptions if things go wrong
        """
        context_data = self._dsd.get_context(self.name)
        self.from_dict(context_data)

    def auto_context(self, origin: str = "") -> None:
        context_def = {origin: "browse()"}
        self.from_dict(context_def, scope_only=True)

    def _get_formatted_output_field(self, src_table_name: str, src_field_or_instruction: str, dst_field_name: str,
                                    add2type_info: bool = True, default_value: str = None) -> str:

        if default_value is None:
            src_field_name = src_field_or_instruction
        else:
            src_field_name = ""

        output_format = ""
        try:
            if dst_field_name == "data":
                output_format = self._output_format.lower()
            else:
                for additional_field in self._additional_fields:
                    if additional_field[1] == dst_field_name:
                        if additional_field[3]:
                            output_format = additional_field[3]
                        break

            if output_format:
                p = SimpleFunctionParser()
                p.parse(output_format)
                if p.ok:
                    if p.instruction in self._output_formatters.keys():
                        if default_value is None:
                            output, data_type = self._output_formatters[p.instruction](src_table_name,
                                                                                       src_field_name,
                                                                                       p.parameters)
                            if not data_type:
                                if add2type_info:
                                    self._type_info.add_type(src_field_name, src_table_name, field_alias=dst_field_name)
                            else:
                                self._type_info.add_data_type(dst_field_name, data_type)

                        else:
                            output, data_type = self._output_formatters[p.instruction]("",
                                                                                       src_field_or_instruction,
                                                                                       p.parameters,
                                                                                       default_value=default_value)
                            if add2type_info:
                                self._type_info.add_data_type(dst_field_name, data_type)
                        return f"{output} \"{dst_field_name}\""
                    else:
                        raise KioskContextError(f"KioskContext._get_formatted_output_field: "
                                                f"No formatter for {output_format} "
                                                f"when rendering field {dst_field_name}.")
                else:
                    raise KioskContextError(
                        f"KioskContext._get_formatted_output_field: error parsing output format {output_format} "
                        f"when rendering field {dst_field_name}: {p.err}")
            else:
                if add2type_info and src_field_name:
                    self._type_info.add_type(src_field_name, src_table_name, field_alias=dst_field_name)
                if default_value is None:
                    return f"{KioskSQLDb.sql_safe_ident(src_table_name)}." \
                           f"{KioskSQLDb.sql_safe_ident(src_field_name)} \"{dst_field_name}\""
                else:
                    if default_value == "null":
                        return f"null \"{dst_field_name}\""
                    else:
                        raise KioskContextTypeError(
                            f"KioskContext._get_formatted_output_field: no output format for non-null "
                            f"default value {default_value} "
                            f"when rendering field {dst_field_name}. "
                            f"Please state an explicit output format, e.G. by using lookup_type(). "
                            f"Or use null as default value.")

        except KioskContextError as e:
            raise e
        except BaseException as e:
            raise KioskContextError(f"KioskContext._get_formatted_output_field: Exception when "
                                    f"rendering field {self.data_table}.{src_field_name} to {dst_field_name}: {repr(e)}")

    @classmethod
    def _get_table_and_field(cls, additional_field) -> tuple:
        result = cls.regex_table_and_field.match(additional_field)
        if result and len(result.groups()) == 2:
            return result.group('table'), result.group("field_or_instruction")
        else:
            return "", additional_field

    def register_lookup_table(self, src_field, table, key_field, value_field) -> str:
        if table in self._lookup_tables:
            lookup_table = self._lookup_tables[table]
            if lookup_table["src_field"] != src_field:
                raise KioskContextError(f"KioskContext._register_lookup_table: lookup-table {table} is referenced twice"
                                        f"with different source fields: {src_field} != {lookup_table['src_field']}."
                                        f"That's not supported, yet.")
        else:
            lookup_table = {
                "src_field": src_field,
                "key_field": key_field,
                "table_alias": nanoid.generate(),
                "value_fields": []
            }
            self._lookup_tables[table] = lookup_table

        lookup_table["value_fields"].append(value_field)
        return lookup_table["table_alias"]

    def _process_substitution_directive(self, additional_field: tuple) -> tuple:
        p = SimpleFunctionParser()
        p.parse(additional_field[4])
        if not p.ok:
            raise KioskContextError(
                f"KioskContext._process_substitution_directive: Statement {additional_field[4]} can't "
                f"be parsed properly. ")

        directive = p.instruction.lower()
        if directive == 'lookup':
            return self._process_lookup_substitution(additional_field, p)
        else:
            raise KioskContextError(
                f"KioskContext._process_substitution_directive: Statement {additional_field[4]} is not "
                f"referring to any known substitution function. ")

    def _process_lookup_substitution(self, additional_field: tuple, p: SimpleFunctionParser) -> tuple:
        if len(p.parameters) != 3:
            raise KioskContextError(
                f"KioskContext._process_lookup_substitution: lookup substitution {additional_field[4]} does not "
                f"have the the expected 3 arguments. ")
        # additional_field: 5 - tuple(field_or_instruction, field_name, default_value, output - format, substitute)
        # parameters for lookup: table, key field, value field

        table_alias = self.register_lookup_table(additional_field[0], *p.parameters)

        # lookup substitutions are only allowed to return a varchar, currently
        self._type_info.add_data_type(additional_field[1], "varchar")

        # returns table, src_field_name, dst_field_name
        return table_alias, p.parameters[2], additional_field[1]

    def _get_select_for_path(self, path: list) -> str:
        sql = "select distinct "
        sql += self._get_formatted_output_field(self.identifier_table, self.identifier_field, "identifier")
        # sql += f",{KioskSQLDb.sql_safe_ident(self.identifier_table)}." \
        #        f"{KioskSQLDb.sql_safe_ident(self.id_uuid_field)} \"id_uuid\""
        sql += "," + self._get_formatted_output_field(self.identifier_table, self.id_uuid_field, "id_uuid")
        sql += "," + self._get_formatted_output_field(self.data_table, self.data_field, "data")
        # sql += f",{KioskSQLDb.sql_safe_ident(self.data_table)}." \
        #        f"{KioskSQLDb.sql_safe_ident(self.data_uuid_field)} \"data_uuid\""
        sql += "," + self._get_formatted_output_field(self.data_table, self.data_uuid_field, "data_uuid")
        sql += f",{str(self.primary_identifier).lower()} \"primary\""
        self._type_info.add_data_type("primary", "varchar")

        sql += f",'{self.data_table}' \"record_type\""
        self._type_info.add_data_type("record_type", "varchar")

        # sql += f",{KioskSQLDb.sql_safe_ident(self.closest_identifier_table)}." \
        #        f"{KioskSQLDb.sql_safe_ident(self.closest_identifier_field)} \"primary_identifier\""
        sql += "," + self._get_formatted_output_field(self.closest_identifier_table,
                                                      self.closest_identifier_field, "primary_identifier")
        sql += "," + self._get_formatted_output_field(self.closest_identifier_table,
                                                      self.closest_identifier_uid_field, "primary_identifier_uuid")
        if self._include_primary_record_type:
            sql += f",'{self.closest_identifier_table}' \"primary_record_type\""
            self._type_info.add_data_type("primary_record_type", "varchar")

        for additional_field in self._additional_fields:
            # additional_field:
            # 5 - tuple(field_or_instruction, field_name, default_value, output - format, substitute)

            (table, field) = self._get_table_and_field(additional_field[0])
            if not table:
                table = self.data_table
            else:
                if table not in path:
                    table = ""

            if table:
                fields = self._get_field_or_instructions(table, field)
            else:
                fields = None

            if additional_field[4]:
                # there's a substitution directive
                if fields:
                    new_additional_field = (fields[0],
                                            additional_field[1],
                                            additional_field[2],
                                            additional_field[3],
                                            additional_field[4]
                                            )
                else:
                    new_additional_field = additional_field

                table, src_field_name, dst_field_name = self._process_substitution_directive(new_additional_field)
                sql += "," + self._get_formatted_output_field(table, src_field_name, dst_field_name,
                                                              add2type_info=False)
            else:

                if fields:
                    if len(fields) > 1:
                        logging.warning(f"KioskContext._get_select_for_path: table {table} "
                                        f"has more than one field with instruction {field}. "
                                        f"That is not supported by KioskContext, right now.")
                        raise KioskContextDuplicateInstructionError(
                            f"KioskContext._get_select_for_path: table {table} "
                            f"has more than one field with instruction {field}. "
                            f"That is not supported by KioskContext, right now.")
                    field_name = fields[0]
                    sql += "," + self._get_formatted_output_field(table, field_name, additional_field[1])
                    # sql += f",{KioskSQLDb.sql_safe_ident(self.data_table)}.{KioskSQLDb.sql_safe_ident(field_name)} " \
                    #        f"{KioskSQLDb.sql_safe_ident(additional_field[1])}"
                else:
                    # 5 - tuple(field_or_instruction, field_name, default_value, output - format, substitute)
                    sql += "," + self._get_formatted_output_field(table, field, additional_field[1],
                                                                  default_value=additional_field[2])
                    # sql += f",'{additional_field[2]}' " \
                    #        f"{KioskSQLDb.sql_safe_ident(additional_field[1])}"

        return sql

    def _join_from_lookup_table(self, root_table, table) -> str:
        if table not in self._lookup_tables:
            raise KioskContextError(
                f"KioskContext._join_from_lookup_table: lookup {table} is not "
                f"a known look up table.")

        lookup_table = self._lookup_tables[table]
        table_alias = KioskSQLDb.sql_safe_ident(lookup_table['table_alias'])
        # sql = "left outer join lookup_table table_alias on root_table.src_field = table_alias.key_field"

        sql = ""
        sql += f" left outer join"
        sql += f" {KioskSQLDb.sql_safe_ident(table)} as {table_alias}"
        sql += f" on {KioskSQLDb.sql_safe_ident(root_table)}." \
               f"{KioskSQLDb.sql_safe_ident(lookup_table['src_field'])}"
        sql += f"="
        sql += f"{table_alias}.{KioskSQLDb.sql_safe_ident(lookup_table['key_field'])}"

        return sql

    def _get_from_for_path(self, path: list) -> str:
        sql = "from"
        root_table = ""
        for table in path:
            if root_table:
                join = self._graph.get_join(root_table, table)
                sql += join.get_sql()
            else:
                sql += " " + table

            root_table = table

        for table in self._lookup_tables:
            sql += self._join_from_lookup_table(root_table, table)

        return sql

    def _get_where_for_path(self, path: list, identifier) -> str:
        if identifier:
            sql = " where coalesce("
            sql += f" {KioskSQLDb.sql_safe_ident(self.identifier_table)}." \
                   f"{KioskSQLDb.sql_safe_ident(self.identifier_field)}, '')"
            sql += f" ilike '{identifier}'"
        else:
            sql = " where coalesce("
            sql += f" {KioskSQLDb.sql_safe_ident(self.identifier_table)}." \
                   f"{KioskSQLDb.sql_safe_ident(self.identifier_field)}, '')"
            sql += f" <> ''"

        sql += f" AND {KioskSQLDb.sql_safe_ident(self.data_table)}." \
               f"{KioskSQLDb.sql_safe_ident(self.data_field)} is not null"
        return sql

    def _get_sql_select(self, path: list, identifier: str, prefixed_field_or_instruction) -> str:
        self.identifier_table = path[0]

        self._lookup_tables = {}
        search_term = prefixed_field_or_instruction.split(".")
        if len(search_term) == 2:
            table_prefix = search_term[0]
            field_or_instruction = search_term[1]
        else:
            table_prefix = ""
            field_or_instruction = search_term[0]

        identifier_fields = self._dsd.get_fields_with_instruction(self.identifier_table, "identifier")
        sqls = []
        if not identifier_fields:
            raise KioskContextError(f"KioskContext._get_sql_select: Context {self.name} "
                                    f"does not have any identifiers in scope.")

        for identifier_field in identifier_fields:
            # if len(identifier_fields) != 1:
            #     logging.warning(f"KioskContext._get_sql_select: {self.identifier_table} "
            #                             f"has {len(identifier_fields)} identifiers. Only one is currently supported")
            self.identifier_field = identifier_field
            self.id_uuid_field = self._dsd.get_fields_with_instruction(self.identifier_table,
                                                                       "replfield_uuid")[0]

            self.data_table = path[len(path) - 1]
            self.closest_identifier_table = self._graph.find_closest_identifier(self.data_table)
            identifier_fields = list(self._dsd.get_fields_with_instruction_and_parameter(self.closest_identifier_table,
                                                                                         "identifier",
                                                                                         requested_parameter_values=[
                                                                                             None],
                                                                                         fail_on_many=True).keys())
            closest_uid_fields = list(self._dsd.get_fields_with_instruction_and_parameter(self.closest_identifier_table,
                                                                                          "replfield_uuid",
                                                                                          requested_parameter_values=[
                                                                                              None],
                                                                                          fail_on_many=True).keys())
            if identifier_fields:
                self.closest_identifier_field = identifier_fields[0]
                self.closest_identifier_uid_field = closest_uid_fields[0]
            else:
                self.closest_identifier_field = ""
                self.closest_identifier_table = ""
                self.closest_identifier_uid_field = ""

            self.primary_identifier = (self.closest_identifier_table == self.identifier_table)

            data_fields = self._get_field_or_instructions(self.data_table, field_or_instruction)
            if len(data_fields) > 1:
                logging.warning(f"KioskContext._get_sql_select: table {self.data_table} "
                                f"has more than one field with instruction {field_or_instruction}. "
                                f"That is not supported by KioskContext, right now.")
                raise KioskContextDuplicateInstructionError(f"KioskContext._get_sql_select: table {self.data_table} "
                                                            f"has more than one field with instruction "
                                                            f"{field_or_instruction}. "
                                                            f"That is not supported by KioskContext, right now.")
            self.data_field = data_fields[0]
            # self._type_info.add_type(self.data_field, self.data_table, field_alias="data")
            self.data_uuid_field = self._dsd.get_fields_with_instruction(self.data_table, "replfield_uuid")[0]

            sql_select = self._get_select_for_path(path)
            sql_from = self._get_from_for_path(path)
            sql_where = self._get_where_for_path(path, identifier)

            sql = sql_select + " " + sql_from + " " + sql_where
            sqls.append(sql)
        return sqls

    def _get_selects(self, identifier, field_or_instruction):
        paths = self._graph.find_paths(field_or_instruction)
        selects = []
        if not paths:
            raise KioskContextError(f"KioskContext.get_root_identifier: Context {self.name} "
                                    f"does not have anything like "
                                    f"{field_or_instruction}")
        for p in paths:
            selects.extend(self._get_sql_select(p, identifier, field_or_instruction))

        return selects

    def select(self, identifier: str, field_or_instruction: str,
               sql_source_class: SqlSource.__class__ = SqlSourceInMemory,
               additional_fields: list = None, output_format: str = "") -> SqlSource:
        """
        prepares a query for all the values of all fields that match a search_term within the scope of a
        certain identifier.
        :param identifier: The identifier that limits the query
        :param output_format: optional. An output-format instruction
                              that converts the target field into a required format.
        :param sql_source_class: A subclass of SqlSource
                that will be instantiated to produce the query results. ContextQueryInMemory will be used as a default.
        :param additional_fields: 5-tuple(field_or_instruction, field_name, default_value, output-format, substitute)
                additional fields of the target table that will be part of the result set.
                - The first part of the tuple is a field or instruction that marks a field.
                That field or instruction will only be collected from the same record_type/table
                as the parameter field_or_instruction! If parameter field_or_instruction is prefixed with a table,
                that limits the additional_fields as well.
                - The second part of the tuple defines the field's name in the result set.
                - If an additional field cannot be found in the target table, the column will be
                added (the second value of the tuple) nonetheless with the default value (the third value of the tuple).
                - The fourth element of the tuple is either an empty string or a valid output-format instruction.
                - The tuple's fifth element is either an empty string or a valid substitution instruction

                When using an instruction, make sure that all tables in the context definition have only one field marked
                with that instruction. Otherwise a KioskContextDuplicateInstructionError exception will occur.
        :return: a SqlSource subclass that stores the query results (basically a type-info and select statements)
        :exception KioskContextDuplicateInstructionError:
                You used an instruction in field_or_instruction
                or additional_fields that is used in more than one field in the dsd of one of the tables
                in the context.
        """
        if additional_fields is None:
            additional_fields = []

        self._type_info = ContextTypeInfo(self._dsd.get_field_datatype)
        self._additional_fields = self._rectify_additional_fields(additional_fields)
        self._output_format = output_format
        sql_selects = self._get_selects(identifier, field_or_instruction)
        type_info = copy.copy(self._type_info) # Checked it, copy is enough here. This is a dict with tuple values.
        return sql_source_class(selects=sql_selects, type_info=type_info, name=self.name)

    def select_all(self, field_or_instruction: str, field_from_record_type: str = "",
                   sql_source_class: SqlSource.__class__ = SqlSourceInMemory,
                   additional_fields: list = None, output_format: str = "") -> SqlSource:
        """
        prepares a query for all the values of all fields that match a search_term.
        Or in other words: selects all records in the context.

        :param field_or_instruction: either a field name or an instruction that marks fields.
                                     The field name or instruction name can be prefixed by a record_type/table name:
                                     e.g. locus.identifier() / locus.type
                                     will only query the identifer field in record_type locus/ the type field in locus.
        :param output_format: optional. An output-format instruction
                              that converts the target field into a required format.
        :param sql_source_class: A subclass of SqlSource
                that will be instantiated to produce the query results. ContextQueryInMemory will be used as a default.
        :param additional_fields: see KioskContext.select
        :returns: a ContextQuery subclass that produces the query results.
        :exception KioskContextDuplicateInstructionError:
                You used an instruction in field_or_instruction
                or additional_fields that is used in more than one field in the dsd of one of the tables
                in the context.
        """
        if additional_fields is None:
            additional_fields = []

        return self.select(identifier="",
                           field_or_instruction=field_or_instruction,
                           sql_source_class=sql_source_class,
                           additional_fields=additional_fields,
                           output_format=output_format)

    def _get_field_or_instructions(self, data_table, field_or_instruction):
        """
        if given an instruction (parses as a valid instruction, so needs at least brackets: () )
        this returns a list of field names which have the instruction.
        If field_or_instruction does not parse, it is considered a field name and if the field exists in the
        table it is returned.

        This has a hacky exception:
        If this leads to more than one field (which won't currently
        be accepted by the caller) and field_and_instruction is "identifier()" it will try to return only
        the field that has the primary identifier. So marked is as either "identifier()" or "identifier(primary)" in the
        DSD.

        :param data_table: the table
        :param field_or_instruction: the field or fields with instruction wanted
        :return: a list of field names or [] if the field or instruction cannot be found.
        :exception: throws all kinds of exceptions, e.G. if no field has the requested instruction)
        """
        data_fields = self._dsd.get_field_or_instructions(data_table, field_or_instruction)
        if len(data_fields) > 1:
            if field_or_instruction.lower() == "identifier()":
                for f in data_fields:
                    params = self._dsd.get_instruction_parameters_and_types(data_table, f, "identifier")
                    if len(params) == 0 or params[0][0] == "primary":
                        return [f]
        return data_fields
