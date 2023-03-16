from kiosksqldb import KioskSQLDb


def get_key_value_pair_from_constants(key):
    cur = KioskSQLDb.execute_return_cursor(f"select * from constants where id='{key}'")
    try:
        key_value_pair = dict()
        r = cur.fetchone()
        if r:
            if r["value"]:
                pairs = [line.split("=") for line in r["value"].splitlines()]
                for pair in pairs:
                    key_value_pair[pair[0].strip()] = pair[1].strip()
                    key_value_pair[pair[1].strip()] = pair[0].strip()
    finally:
        cur.close()

    return key_value_pair


def get_valuelist_from_constants(key):
    cur = KioskSQLDb.execute_return_cursor(f"select * from constants where id='{key}'")
    try:
        valuelist = []
        r = cur.fetchone()
        if r:
            if r["value"]:
                valuelist = r["value"].splitlines()
    finally:
        cur.close()

    return valuelist


