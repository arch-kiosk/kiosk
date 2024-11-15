import logging
from typing import List
import datetime
from kiosksqldb import KioskSQLDb


def log_repl_event(event: str, message: str, dock="", level=1, commit=True, user=None):
    sql = f"""{"insert"} 
            into repl_events(event,message,dock,level,{KioskSQLDb.sql_safe_ident("user")}) values(%s,%s,%s,%s,%s) 
    """
    save_point = ""
    try:
        save_point = KioskSQLDb.begin_savepoint()
        KioskSQLDb.execute(sql, parameters=[event, message, dock, level, user], commit=False)
        KioskSQLDb.commit_savepoint(save_point)
        if commit:
            KioskSQLDb.commit()

    except BaseException as e:
        logging.error(f"kioskrepllib.log_repl_event: {repr(e)} when logging {event},{message},{dock}")
        if save_point:
            KioskSQLDb.rollback_savepoint(save_point)
        if commit:
            KioskSQLDb.rollback()


def get_repl_events(dock_id: str = "", days: int = 30, lines=0) -> List:
    sql = f"select * from repl_events "
    # that's good enough time zone wise
    since_date = datetime.datetime.now() - datetime.timedelta(days=days)
    where = " where ts >= %s "
    params = [since_date, ]
    if dock_id:
        where += " and dock = %s"
        params.append(dock_id)
    sql += where
    sql += " order by ts desc"
    if lines:
        sql += f" limit {lines}"
    return KioskSQLDb.get_records(sql, params=params)
