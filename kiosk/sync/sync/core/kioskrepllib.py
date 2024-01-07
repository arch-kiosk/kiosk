import logging

from kiosksqldb import KioskSQLDb


def log_repl_event(event: str, message: str, dock="", level=1, commit=True):
    sql = f"""{"insert"} 
            into repl_events(event,message,dock,level) values(%s,%s,%s,%s) 
    """
    save_point = ""
    try:
        save_point = KioskSQLDb.begin_savepoint()
        KioskSQLDb.execute(sql, parameters=[event, message, dock, level], commit=False)
        KioskSQLDb.commit_savepoint(save_point)
        if commit:
            KioskSQLDb.commit()

    except BaseException as e:
        logging.error(f"kioskrepllib.log_repl_event: {repr(e)} when logging {event},{message},{dock}")
        if save_point:
            KioskSQLDb.rollback_savepoint(save_point)
        if commit:
            KioskSQLDb.rollback()
