import copy
import logging
from pprint import pprint
import datetime
from typing import List, Dict, Tuple

from contextmanagement.kioskscopeselect import KioskScopeSelect
from dsd.dsd3singleton import Dsd3Singleton
from filedescription import FileDescription
from kiosksqldb import KioskSQLDb
from presentationlayer.kioskview import KioskView
from simplefunctionparser import SimpleFunctionParser
from sync_config import SyncConfig
from uic.uicstream import UICStream, UICKioskFile


class KioskViewDocument:
    KIOSK_VIEW_DOCUMENT_VERSION = 1

    # inner class to store lookup element data more conveniently
    class LookupElement:
        def __init__(self, part_id: str, element_id: str, lookup_def: dict):
            self.part_id = part_id
            self.element_id = element_id
            self.lookup_def = lookup_def

    # end inner class to store lookup element data more conveniently

    def __init__(self, record_type: str, pld_id: str, identifier: str):
        try:
            self._record_type = record_type
            self._pld_id = pld_id
            self._kiosk_view: KioskView = None
            self._cfg = SyncConfig.get_config()
            self._dsd = Dsd3Singleton.get_dsd3()
            self._doc = {}
            self._identifier = identifier
            self._file_description = FileDescription(self._cfg, self._dsd)
            self._uic_stream = UICStream(UICKioskFile.get_file_stream("kiosk_ui_classes.uic"),
                                         get_import_stream=UICKioskFile.get_file_stream)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.__init__: {repr(e)}")
            raise Exception(f"Error initializing KioskViewDocument with {record_type}, {pld_id} and {identifier}")

    def _initialize_view(self, identifier):
        view = KioskView(self._cfg, self._pld_id, self._uic_stream.tree)
        view.record_type = self._record_type
        view.identifier_field = self._dsd.get_fields_with_instruction(view.record_type,
                                                                      "identifier")[0]
        view.identifier = identifier
        return view

    def _get_data(self, target_record_types: list[str], record_filter: dict) -> dict:
        filter_field = None
        filter_value = None

        def _parse_filter(filter_expression):
            parser=SimpleFunctionParser()
            parser.parse(filter_expression)
            if parser.ok and parser.instruction == "exclude":
                return parser.parameters[0], parser.parameters[1]
            else:
                return None, None

        def _filter_record(r):
            return not filter_field or r[filter_field] != filter_value

        try:
            scope_select = KioskScopeSelect()
            scope_select.set_dsd(self._dsd)
            result = dict()
            selects = scope_select.get_selects(self._record_type, target_types=target_record_types, add_lore=True)
            for select in selects:
                if select[0] in record_filter:
                    filter_field, filter_value = _parse_filter(record_filter[select[0]])
                    result[select[0]] = KioskSQLDb.get_records(select[1], {"identifier": self._identifier.upper()},
                                                           add_column_row=True, post_filter=_filter_record)
                else:
                    result[select[0]] = KioskSQLDb.get_records(select[1], {"identifier": self._identifier.upper()},
                                                           add_column_row=True)
            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_data: {repr(e)}")
            raise e

    def _get_parts_from_doc(self):
        parts = []
        compilation = self._doc["compilation"]
        for group in compilation["groups"].values():
            for part in group["parts"].keys():
                parts.append(part)
        return parts

    def _get_elements_with_lookup(self, parts) -> List[LookupElement]:
        lookups = []
        for part_id in parts:
            part = self._doc[part_id]
            elements = part["ui_elements"]
            try:
                for element_id, element_def in elements.items():
                    if "lookup" in element_def["element_type"]:
                        lookups.append(self.LookupElement(part_id, element_id, element_def["element_type"]["lookup"]))
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._get_elements_with_lookup: {repr(e)}")
        return lookups

    def _get_lookup_record_data(self, target_types: List[str], lookups: List[LookupElement]) -> Tuple[Dict[str, List[List[any]]], Dict]:
        """
        returns the actually needed records for all the relevant lookup table relations
        :param target_types: the record_types requested by the document's parts
        :param lookups: A list of LookupElement objects
        :return: a tuple with
                 - a dictionary with the lookup record type as the key that
                   points to a list of records (each a list). The first record is always the list
                   of column headers
                 - a dictionary that has the key fields for all lookup tables
                   (or "-" if an equivocal key could not be determined)

        """
        lookup_types = set()
        try:
            for lookup in lookups:
                if "lookup_type" in lookup.lookup_def and lookup.lookup_def["lookup_type"] == "record":
                    if "record_type" in lookup.lookup_def:
                        lookup_types.add(lookup.lookup_def["record_type"])
                    else:
                        logging.warning(f"{self.__class__.__name__}._get_lookup_data: lookup_type 'record' "
                                        f" for element {lookup.element_id} lacks a record type.")

            scope_select = KioskScopeSelect(include_lookups=True)
            scope_select.set_dsd(self._dsd)
            result = dict()
            selects = scope_select.get_selects(self._record_type, target_types=target_types,
                                               add_lore=True, only_lookups=True)
            for select in selects:
                if select[0] in lookup_types:
                    try:
                        records = KioskSQLDb.get_records(select[1], {"identifier": self._identifier.upper()},
                                                         add_column_row=True)
                        if records:
                            if select[0] not in result:
                                result[select[0]] = records
                            else:
                                try:
                                    existing_records = result[select[0]]
                                    uid_idx = records[0].index("uid")
                                    existing_uids = [r[uid_idx] for r in existing_records]
                                    for r in records:
                                        if r[uid_idx] not in existing_uids:
                                            existing_records.append(r)
                                except ValueError as e:
                                    logging.error(f"{self.__class__.__name__}._get_lookup_table_data: "
                                                  f"lookup table {select[0]} has no 'uid' field.")
                                except BaseException as e:
                                    logging.warning(f"{self.__class__.__name__}._get_lookup_table_data: "
                                                    f"Error when adding records from lookup table {select[0]}: "
                                                    f"{repr(e)}")
                    except BaseException as e:
                        logging.warning(f"{self.__class__.__name__}._get_lookup_table_data: "
                                        f"Error selecting lookups for {select[0]}: {repr(e)}")
            return result, scope_select.lookup_key_fields
        except BaseException as e:
            logging.error(
                f"{self.__class__.__name__}._get_lookup_table_data: when processing {lookup_types}: {repr(e)}")
            raise e


    def _get_aggregation_select(self, base_select, lookup_element: LookupElement) -> Tuple[str, str]:
        """
        Wraps an aggregation select statement around the base select that connects
        the base record type of the ViewDocument with the record type that is being looked up.

        :param base_select: the base select constructed with KioskScopeSelects
        :param lookup_element: the lookup element definition
        :return: A tuple consisting of the select statement and the name under which the result should be stored
        """
        lookup_def = lookup_element.lookup_def
        agg_method = lookup_def["aggregation_method"].lower()
        sql = "select "
        if agg_method == "count":
            sql += (f"{KioskSQLDb.sql_safe_ident(lookup_def['key_field'])}, "
                    f"count({KioskSQLDb.sql_safe_ident(lookup_def['aggregation_field'])}) c "
                    f"from ({base_select}) t group by {KioskSQLDb.sql_safe_ident(lookup_def['key_field'])}")
            return sql, f"{lookup_def['record_type']}.{lookup_def['aggregation_field']}.count"
        else:
            raise Exception(f"aggregation method {agg_method} unknown for lookup field {lookup_element.element_id}")

    def _get_lookup_aggregate_data(self, lookups: List[LookupElement]) -> Tuple[Dict[str, List[List[any]]], Dict]:
        """
        returns the actually needed records for all the relevant aggregate lookups
        :param lookups: A list of LookupElement objects

        """
        lookup_types = set()
        try:
            for lookup in lookups:
                if "lookup_type" in lookup.lookup_def and lookup.lookup_def["lookup_type"] == "aggregate":
                    if "record_type" in lookup.lookup_def:
                        lookup_types.add(lookup.lookup_def["record_type"])
                    else:
                        logging.warning(f"{self.__class__.__name__}._get_lookup_aggregate_data: lookup_type 'record' "
                                        f" for element {lookup.element_id} lacks a record type.")

            scope_select = KioskScopeSelect(include_lookups=True)
            scope_select.set_dsd(self._dsd)
            result = dict()
            selects = scope_select.get_selects(self._record_type,
                                               target_types=list(lookup_types),
                                               add_lore=False, only_lookups=False)
            for select in selects:
                lookup_element = next(iter(filter(lambda x: x.lookup_def["lookup_type"] == "aggregate" and x.lookup_def["record_type"] == select[0],
                                                  lookups)), None)
                if lookup_element:
                    select, result_name = self._get_aggregation_select(select[1], lookup_element)
                    try:
                        records = KioskSQLDb.get_records(select,
                                                         {"identifier": self._identifier.upper()},
                                                         add_column_row=True)
                        if records:
                            result[result_name] = records
                    except BaseException as e:
                        logging.warning(f"{self.__class__.__name__}._get_lookup_table_data: "
                                        f"Error selecting lookups for {select[0]}: {repr(e)}")
            return result, scope_select.lookup_key_fields
        except BaseException as e:
            logging.error(
                f"{self.__class__.__name__}._get_lookup_aggregate_data: when processing {lookup_types}: {repr(e)}")
            raise e

    def _get_lookup_data(self, target_types) -> Dict[str, List[List]]:
        """
        This returns the complete lookup data for the View. That includes normal record lookups and aggregations.
        :param target_types: the record types requested by all the parts of the view
        :return: a dict with {lookup_table_name: [records[values]]]
        """
        parts = self._get_parts_from_doc()
        lookups = self._get_elements_with_lookup(parts)


        data, lookup_key_fields = self._get_lookup_record_data(target_types, lookups)
        agg_data, agg_lookup_key_fields = self._get_lookup_aggregate_data(lookups)
        data.update(agg_data)
        lookup_key_fields.update(agg_lookup_key_fields)
        for lookup in lookups:
            if "record_type" in lookup.lookup_def and "key_field" not in lookup.lookup_def:
                record_type = lookup.lookup_def["record_type"]
                if record_type in lookup_key_fields:
                    key_field = lookup_key_fields[record_type]
                    if key_field == "?":
                        logging.warning(f"{self.__class__.__name__}._get_lookup_data: Key field for lookup "
                                        f"{record_type} could not be determined because of equivocal use of the"
                                        f"lookup table across the dataset definition")
                    else:
                        lookup.lookup_def["key_field"] = key_field
                else:
                    logging.warning(f"{self.__class__.__name__}._get_lookup_data: Key field for lookup "
                                    f"{record_type} could not be determined but it is also not stated manually.")

        return data

    def _get_dsd_definitions(self, target_record_types: list[str]) -> dict:
        try:
            result = dict()
            for record_type in target_record_types:
                result[record_type] = copy.deepcopy(self._dsd.get_table_definition(record_type))

            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_dsd_definitions: {repr(e)}")
            raise e

    def _get_image_attributes(self, uid) -> Tuple[dict, datetime.datetime]:
        image_record = KioskSQLDb.get_first_record(self._dsd.files_table, "uid", uid)
        file_datetime = None
        image_attributes = {}
        if image_record:
            try:
                image_attributes = image_record["image_attributes"]
            except:
                pass
            try:
                #refactor: this is an explicit reference to a field name. Should rather use a dsd instruction or so.
                file_datetime = image_record["file_datetime"]
            except:
                pass
        return image_attributes, file_datetime

    def _get_file_info(self, uid):
        file_attributes, file_datetime = self._get_image_attributes(uid)
        file_info = {"description": self._file_description.get_description_summary(uid),
                     "file_datetime": file_datetime,
                     "attributes": file_attributes}
        return file_info

    def _get_file_infos(self, data: dict[str, list[list]]) -> dict:
        c_error = 0
        try:
            result = {}
            file_fields = self._dsd.list_file_fields()
            file_tables = list(file_fields.keys())
            for record_type in [t for t in data.keys() if t in file_tables]:
                records = data[record_type]
                for file_field in file_fields[record_type]:
                    try:
                        file_field_idx = records[0].index(file_field)
                        for r in records[1:]:
                            uid_file = r[file_field_idx]
                            if uid_file:
                                result[uid_file] = self._get_file_info(uid_file)
                    except BaseException as e:
                        c_error += 1
                        if c_error > 10:
                            raise Exception(f"Too many errors in _get_image_descriptionfor table {record_type}")
                        else:
                            logging.warning(f"Couldn't find {file_field} in data of table {record_type}: {repr(e)}")

            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_image_descriptions: {repr(e)}")
            raise e

    def compile(self):
        try:
            view = self._initialize_view(self._identifier)
            self._doc = view.render()
            self._doc["kioskview.header"] = {
                "version": self.KIOSK_VIEW_DOCUMENT_VERSION,
                "dsd_version": self._dsd.CURRENT_DSD_FORMAT_VERSION
            }
            parts = view.get_parts()
            target_record_types = [self._doc[part]["record_type"] for part in parts]
            record_filters = {}
            for part in parts:
                if "filter_records" in self._doc[part]:
                    record_filters[self._doc[part]["record_type"]] = self._doc[part]["filter_records"]

            self._doc["kioskview.data"] = self._get_data(target_record_types, record_filters)
            self._doc["kioskview.lookup_data"] = self._get_lookup_data(target_record_types)
            self._doc["kioskview.dsd"] = self._get_dsd_definitions(self._doc["kioskview.data"].keys())
            self._doc["kioskview.images"] = self._get_file_infos(self._doc["kioskview.data"])
            return self._doc
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.compile: {repr(e)}")
            raise Exception(f"Error in {self.__class__.__name__}.compile: {repr(e)}")
