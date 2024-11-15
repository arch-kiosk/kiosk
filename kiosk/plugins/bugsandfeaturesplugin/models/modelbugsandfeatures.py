import logging

from kiosksqldb import KioskSQLDb
from core.kioskcontrollerplugin import get_plugin_for_controller



class ModelBugsAndFeatures:
    # deprecated: We give up on the internal bugs and features system

    _views = ["Only open cases sorted by where and priority",
              "all cases sorted by where",
              "newest open cases on top"
             ]

    @classmethod
    def get_views(cls):
        return cls._views

    @classmethod
    def get_priorities(cls):
        return [x[0] for x in KioskSQLDb.get_records("select distinct priority from tickets order by priority", max_records=100)]

    @classmethod
    def get_states(cls):
        return [x[0] for x in KioskSQLDb.get_records("select distinct state from tickets order by state", max_records=100)]

    @classmethod
    def delete_bug(cls, uuid):
        if KioskSQLDb.delete_records("tickets", "uid", uuid):
            KioskSQLDb.commit()
            return True
        else:
            logging.error(f"modelbugsandfeatures.delete_bug: KioskSQLDb.rollback")
            KioskSQLDb.rollback()
            return False

    def __init__(self, conf, plugin_name):
        self.conf = conf
        self.plugin_controller = get_plugin_for_controller(plugin_name)
        self._current_view = 0

    def get_current_view(self):
        return self.get_views()[self._current_view]

    def set_current_view(self, view_name):
        if view_name in self._views:
            self._current_view = self._views.index(view_name)

    def _get_where(self):
        if self._current_view in [0, 2]:
            return "where coalesce(\"state\",'') not like %s", ["done"]

        return "", []

    def _get_order(self):
        if self._current_view == 0:
            return "order by \"where\" asc, priority desc"

        if self._current_view == 1:
            return "order by \"where\" asc"

        if self._current_view == 2:
            return "order by modified desc, \"where\" asc"
        return ""

    def query_records(self):
        result = []
        cur = KioskSQLDb.get_dict_cursor()
        sql_where, params = self._get_where()
        sql_order = self._get_order()
        if sql_where:
            sql_where = " " + sql_where
        if sql_order:
            sql_order = " " + sql_order
        sql = "select * from \"tickets\"" + \
              sql_where + sql_order + ";"
        try:
            cur.execute(sql, params)
            print("***************+ query: *************")
            print(cur.query)

            r = cur.fetchone()
            while r:
                try:
                    result.append(dict(r))
                except Exception as e:
                    msg = "ModelBugsAndFeatures.query_records: Error adding record to resultset. Aborting process: " + repr(e)
                    raise Exception(msg)

                r = cur.fetchone()
            cur.close()
            return result
        except Exception as e:
            logging.error("Exception in ModelBugsAndFeatures.query_records: " + repr(e))
            cur.close()
        return []

    def get_bug(self, uuid):
        cur = None
        try:
            cur = KioskSQLDb.get_dict_cursor()
            sql = "select * from \"tickets\" where uid=%s"
            cur.execute(sql, [uuid])
            r = cur.fetchone()
            if r:
                cur.close()
                return dict(r)
            else:
                raise Exception("fetchone() with no result. Record not found.")
        except Exception as e:
            logging.error(f"Exception in ModelBugsAndFeatures.get_bug: {repr(e)}")
            try:
                cur.close()
            except:
                pass

        return None

    def modify_bug(self, uuid=None, data=None, user="sys"):
        rc, err_msg, err_sql = KioskSQLDb.update_by_uuid("tickets", uuid, data)
        if rc:
            return True
        else:
            logging.error(f"Error in ModelBugsAndFeatures.modify_bug: {err_sql} led to error {err_msg}.")
            return False

