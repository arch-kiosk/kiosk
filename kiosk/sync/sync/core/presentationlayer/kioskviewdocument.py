import copy
import logging

from contextmanagement.kioskscopeselect import KioskScopeSelect
from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from presentationlayer.kioskview import KioskView
from sync_config import SyncConfig
from uic.uicstream import UICStream, UICKioskFile


class KioskViewDocument:
    KIOSK_VIEW_DOCUMENT_VERSION = 1

    def __init__(self, record_type: str, pld_id: str, identifier: str):
        try:
            self._record_type = record_type
            self._pld_id = pld_id
            self._kiosk_view: KioskView = None
            self._cfg = SyncConfig.get_config()
            self._dsd = Dsd3Singleton.get_dsd3()
            self._doc = {}
            self._identifier = identifier
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

    def _get_data(self, target_record_types: list[str]) -> dict:
        try:
            scope_select = KioskScopeSelect()
            scope_select.set_dsd(self._dsd)
            result = dict()
            selects = scope_select.get_selects(self._record_type, target_types=target_record_types)
            for select in selects:
                result[select[0]] = KioskSQLDb.get_records(select[1], {"identifier": self._identifier})
            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_data: {repr(e)}")
            raise e

    def _get_dsd_definitions(self, target_record_types: list[str]) -> dict:
        try:
            result = dict()
            for record_type in target_record_types:
                result[record_type] = copy.deepcopy(self._dsd.get_table_definition(record_type))

            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_dsd_definitions: {repr(e)}")
            raise e

    def compile(self):
        try:
            view = self._initialize_view(self._identifier)
            self._doc = view.render()
            self._doc["kioskview.header"] = {"version": self.KIOSK_VIEW_DOCUMENT_VERSION}
            parts = view.get_parts()
            target_record_types = [self._doc[part]["record_type"] for part in parts]
            self._doc["kioskview.data"] = self._get_data(target_record_types)
            self._doc["kioskview.dsd"] = self._get_dsd_definitions(target_record_types)
            return self._doc
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.compile: {repr(e)}")
            raise Exception(f"Error in {self.__class__.__name__}.compile: {repr(e)}")
