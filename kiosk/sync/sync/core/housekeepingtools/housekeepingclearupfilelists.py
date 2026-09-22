import logging
import os

import datetime
from dsd.dsd3 import DataSetDefinition
from dsd.dsdconstants import KEY_TABLE_FLAG_FILE_LIST
from kioskcontextualfile import KioskContextualFile
from kioskglobals import debug
from kiosklib import is_local_server
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from tz.kiosktimezones import KioskTimeZones


class FileListSweeper:
    def __init__(self, dsd: DataSetDefinition, user_id: str, active_tz_index):
        self.dsd = dsd
        self.user_id = user_id
        self.in_console = False
        self.active_tz_index = active_tz_index
        self.kiosk_time_zones = KioskTimeZones(cache_time_zones=True)

    def clear_up_file_list(self, table_name: str, file_field: str, description_field: str):

        sql_store_deleted_uids = f"""
            insert into repl_deleted_uids(deleted_uid, \"table\", modified, repl_workstation_id,master_deletion_ww, master_deletion_tz)
                select \"uid\", %s, %s,%s,%s,%s from {KioskSQLDb.sql_safe_ident(table_name)} 
                where {KioskSQLDb.sql_safe_ident(file_field)} is null and 
                    trim(both ' ' from coalesce({KioskSQLDb.sql_safe_ident(description_field)},''))=''
        """
        sql_delete_records = f"""
            delete from {KioskSQLDb.sql_safe_ident(table_name)}
                where {KioskSQLDb.sql_safe_ident(file_field)} is null and 
                    trim(both ' ' from coalesce({KioskSQLDb.sql_safe_ident(description_field)},''))=''
        """
        modified_info = self.kiosk_time_zones.get_modified_components_from_now(self.active_tz_index)

        try:
            c_uids = KioskSQLDb.execute(sql_store_deleted_uids, [
                table_name,
                modified_info[0],  # utc time
                self.user_id,
                modified_info[2],  # tz index
                modified_info[1]]) # ww time
            if c_uids:
                c_records = KioskSQLDb.execute(sql_delete_records)
                if c_uids == c_records:
                    KioskSQLDb.commit()
                    logging.info(f"{self.__class__.__name__}.clear_up_file_list: deleted ${c_records} records "
                                 f"from file_list table ${table_name}")
                else:
                    raise Exception(f"inserted {c_uids} uids in repl_deleted_uids and then deleted {c_records} "
                                    f"records. Can't be right.")
            return True
        except BaseException as e:
            try:
                KioskSQLDb.rollback()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.clear_up_file_list : {repr(e)}")
            logging.error(f"{self.__class__.__name__}.clear_up_file_list: Error when saving deleted uids "
                          f"(rolling back): {repr(e)}")
            return False

    def clear_up_file_lists(self):
        assert self.dsd

        if self.in_console:
            print("running clear_up_file_list")
        for table_name, field_list in self.dsd.get_file_fields_with_description_fields().items():
            if not self.dsd.table_has_meta_flag(table_name, [KEY_TABLE_FLAG_FILE_LIST]):
                continue
            for f in field_list:
                if self.in_console:
                    print(f"  - cleaning up ${table_name}: fields ${f}")
                try:
                    file_field = f[0]
                    description_field = f[1]
                    if not (file_field and description_field):
                        logging.error(f"{self.__class__.__name__}.clear_up_file_lists: either file field or description field empty "
                                        f"for table {table_name}: {f}")
                        continue
                    if not self.clear_up_file_list(table_name, file_field, description_field):
                        logging.error(f"{self.__class__.__name__}.clear_up_file_list failed for ${table_name}: fields ${f}")
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.clear_up_file_lists: Exception when iterating "
                                  f"over file field_list of {table_name}: {repr(e)}")
        return True
