import json
import logging

from messaging.systemmessage import SystemMessage
from messaging.systemmessagestore import SystemMessageStore
from kiosksqldb import KioskSQLDb


class SystemMessageStorePostgres:
    @classmethod
    def load(cls, store: SystemMessageStore):
        cur = None
        try:
            if not KioskSQLDb.does_table_exist('kiosk_system_message'):
                logging.error(f"{cls.__name__}.load: kiosk_system_message table does not exist. Cannot load messages.")
                return

            cur = KioskSQLDb.execute_return_cursor(
                "select " + f"* from {KioskSQLDb.sql_safe_ident('kiosk_system_message')}")
            r = cur.fetchone()
            while r:
                message = SystemMessage()
                message.from_json(r["message"])
                message.set_modified(r["modified"])
                message.stored()
                store.set_message(message)
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"{cls.__name__}.load: {repr(e)}")
            raise e
        finally:
            if cur:
                cur.close()

    @classmethod
    def store(cls, store: SystemMessageStore):

        savepoint = ""
        try:
            if not KioskSQLDb.does_table_exist('kiosk_system_message'):
                logging.error(f"{cls.__name__}.store: kiosk_system_message table does not exist. Cannot save messages.")
                return

            sql_insert = "insert" + f" into {KioskSQLDb.sql_safe_ident('kiosk_system_message')}"
            sql_insert += f" ({KioskSQLDb.sql_safe_ident('nid')}, {KioskSQLDb.sql_safe_ident('deleted')})"
            sql_insert += " values(%s, %s)"
            sql_insert += " ON CONFLICT ON CONSTRAINT kiosk_system_message_pkey" \
                          " DO NOTHING"

            sql_update = "update" + f" {KioskSQLDb.sql_safe_ident('kiosk_system_message')}"
            sql_update += f" set {KioskSQLDb.sql_safe_ident('message')}=%s, "
            sql_update += f" {KioskSQLDb.sql_safe_ident('deleted')}=%s, "
            sql_update += f" {KioskSQLDb.sql_safe_ident('modified')}=%s "
            sql_update += f" WHERE {KioskSQLDb.sql_safe_ident('nid')}=%s"

            savepoint = KioskSQLDb.begin_savepoint()
            for msg in store.messages:
                json_msg = msg.to_json()
                KioskSQLDb.execute(sql_insert, parameters=[msg.uid, msg.deleted])
                KioskSQLDb.execute(sql_update, parameters=[json_msg, msg.deleted, msg.modified, msg.uid])

            KioskSQLDb.commit_savepoint(savepoint)
            KioskSQLDb.commit()
            for msg in store.messages:
                msg.stored()
            logging.debug(f"{cls.__name__}.save: messages stored in postgres store.")
        except BaseException as e:
            logging.error(f"{cls.__name__}.save: {repr(e)}")
            try:
                if savepoint:
                    KioskSQLDb.rollback_savepoint(savepoint)
            except BaseException as e:
                logging.error(f"{cls.__name__}.save: {repr(e)}")

    def clear(self, store: SystemMessageStore):
        """
        clears the store. Only for testing purposes.
        :param store:
        """
        KioskSQLDb.execute(f"delete * from {KioskSQLDb.sql_safe_ident('kiosk_system_message')}")
