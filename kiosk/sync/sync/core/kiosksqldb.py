from typing import Union, Callable
import os

import nanoid
import psycopg2
import psycopg2.extras
import psycopg2.extensions
import threading

from psycopg2.pool import PoolError

from kioskthreadedconnectionpool import KioskThreadedConnectionPool, PoolNoConnectionError

from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT, TRANSACTION_STATUS_INERROR, \
    TRANSACTION_STATUS_ACTIVE, TRANSACTION_STATUS_IDLE, TRANSACTION_STATUS_INTRANS, TRANSACTION_STATUS_UNKNOWN
import psycopg2.sql

import logging
import yaml
import datetime

import kioskstdlib
from copy import copy

from sqlsafeident import SqlSafeIdentMixin
from sync_config import SyncConfig


class KioskSQLDb(SqlSafeIdentMixin):
    _lock = threading.Lock()
    _pool: KioskThreadedConnectionPool = None
    # _con_ = None
    _dsn = ""

    FIRST_RECORD = 0
    LAST_RECORD = -1

    @classmethod
    def _get_psycopg_dsn(cls):
        if not cls._dsn:
            os.environ["PGTZ"] = "UTC"
            cfg = SyncConfig.get_config()
            db_name = cfg.database_name
            usr = cfg.database_usr_name
            pwd = cfg.database_usr_pwd
            if cfg.database_timeout_sec:
                timeout = f" options='-c statement_timeout={cfg.database_timeout_sec}s'"
            else:
                timeout = ""

            cls._dsn = ("dbname=" + db_name + " user=" + usr + " password=" + pwd +
                        f" port={cfg.database_port}" + timeout)

        return cls._dsn

    @classmethod
    def release_pool(cls):
        """
        releases all connections held by the current pool. Afterwards the pool will be empty.
        """
        if cls._pool:
            cls._pool.release_all()

    @classmethod
    def get_thread_con(cls, establish=True, autocommit=None) -> any:
        """

        :param establish: default is true: Establish a new connection if there is none registered for this key.
        :param autocommit: The connection's autocommit attribute will be changed(!)
                           to this unless autocommit is None (default).

        :return: will return the connection or None if there was no connection (in case of establish=False)
        :raises: all kinds of PoolError Exception or other Psycopg2.Error Exceptions
        """
        try:
            if cls._lock.acquire(blocking=True, timeout=60):
                if not cls._pool:
                    psycopg2.extensions.register_adapter(dict, psycopg2.extras.Json)
                    dsn = cls._get_psycopg_dsn()
                    logging.debug(f"{cls.__name__}.gte_thread_con: creating pool "
                                  f"for process {kioskstdlib.get_process_id()}")
                    cls._pool = KioskThreadedConnectionPool(5, 10, dsn=dsn)
            else:
                logging.error(
                    f"{cls.__name__}.get_thread_con: database connection could not be established because "
                    f"the connection pool could not be locked.")
                raise Exception(
                    f"{cls.__name__}.get_thread_con: database connection could not be established because "
                    f"the connection pool could not be locked.")
        finally:
            cls._lock.release()

        try:
            con = cls._pool.getconn(key=kioskstdlib.get_thread_id(), establish=establish)
            if con:
                if autocommit is not None:
                    cls.set_autocommit(autocommit=autocommit, con=con)

            return con

        except PoolNoConnectionError:
            return None

    @classmethod
    def release_thread_con(cls) -> None:
        """
            releases the connection held by the thread.
            Throws Exceptions in case of error.
        """
        try:
            if cls._pool:
                con = cls.get_thread_con(establish=False)
                if con:
                    cls._pool.putconn(con, key=kioskstdlib.get_thread_id())
                    # logging.debug(f"{cls.__name__}.release_thread_con: "
                    #               f"Released db connection for thread {kioskstdlib.get_thread_id()}")
        except BaseException as e:
            logging.error(f"{cls.__name__}.release_thread_con: Exception {repr(e)}")
            raise e

    @classmethod
    def get_con(cls, establish=True, autocommit=None):
        """
        same as get_thread_con()
        """
        return cls.get_thread_con(establish=establish, autocommit=autocommit)

    @classmethod
    def close_connection(cls):
        """
        just another name for "release_thread_con"
        """
        cls.release_thread_con()
        # if cls._con_:
        #     cls._con_.close()
        #     cls._con_ = None

    @classmethod
    def set_autocommit(cls, autocommit, con=None) -> bool:
        """
        Set's and changes the autocommit attribute for the connection.
        :param autocommit: boolean
        :param con: if not given, the thread's connection will be used (but not established).
        :return: bool.
        :exception: Can raise all kinds of exceptions.
        """
        if not con:
            con = cls.get_thread_con(establish=False)
        if con:
            if con.info.transaction_status == TRANSACTION_STATUS_IDLE:
                if con.autocommit != autocommit:
                    con.set_session(autocommit=autocommit)
                return True
        return False

    @classmethod
    def get_autocommit(cls, con=None, establish=True) -> bool:
        """
        returns the autocommit attribute for the connection.

        :param autocommit: boolean
        :param con: if not given, the thread's connection will be used (but not established).
        :param establish: If not explicitly set to False a connection will be opened.
        :return: bool.
        :exception: Can raise all kinds of exceptions.
        """
        if not con:
            con = cls.get_thread_con(establish=establish)
        return con.autocommit

    @classmethod
    def commit(cls):
        """ commits the current transaction in the current database"""
        con = cls.get_thread_con(establish=False)
        if con:
            con.commit()

    @classmethod
    def rollback(cls):
        """ rejects the current transaction in the current database"""
        con = cls.get_thread_con(establish=False)
        if con:
            logging.debug("KioskSQLDb.rollback: Rollback of KioskSQLDb!")
            con.rollback()

    @classmethod
    def drop_database(cls):
        """
        drops the configured database.
        Uses the database "postgres" to do so. Only works if the
        configured user can log in to that one, too!
        Skips the connection pool and uses its own connection to postgres.

        :return: boolean
        """
        result = False
        cls.rollback()
        cls.close_connection()
        try:
            cls._pool.release_all()
        except PoolError:
            pass
        cfg = SyncConfig.get_config()
        db_name = "postgres"
        usr = cfg.database_usr_name
        pwd = cfg.database_usr_pwd
        if cfg.database_timeout_sec:
            timeout = f" options='-c statement_timeout={cfg.database_timeout_sec}s'"
        else:
            timeout = ""

        con = None
        try:
            con = psycopg2.connect(
                dsn="dbname=" + db_name + " user=" + usr + " password=" + pwd + f" port={cfg.database_port}" + timeout)
            con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = None
            try:
                cur = con.cursor()
                cur.execute("drop " + f"database if exists \"{cfg.database_name}\"")
                result = True
            finally:
                if cur:
                    cur.close()
        except BaseException as e:
            logging.error(f"{cls.__name__}.drop_database: {repr(e)}")
        finally:
            if con:
                con.close()

        return result

    @classmethod
    def create_database(cls):
        """
        creates the configured database.
        Uses the database "postgres" to do so. Only works if the
        configured user can log in to that one, too!

        skips the connection pool and uses its own connection to postgres.
        :return: boolean
        """
        result = False
        con = None
        cls.rollback()
        cls.close_connection()
        try:
            cls._pool.release_all()
        except PoolError:
            pass
        cfg = SyncConfig.get_config()
        db_name = "postgres"
        usr = cfg.database_usr_name
        pwd = cfg.database_usr_pwd
        if cfg.database_timeout_sec:
            timeout = f" options='-c statement_timeout={cfg.database_timeout_sec}s'"
        else:
            timeout = ""
        try:
            con = psycopg2.connect(
                "dbname=" + db_name + " user=" + usr + " password=" + pwd + f" port={cfg.database_port}" + timeout)
            con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = None
            try:
                cur = con.cursor()
                cur.execute(f"create database \"{cfg.database_name}\"")
                cur.close()
                con.close()
                con = None
                cls.get_con()
                try:
                    cls.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
                except BaseException as e:
                    if repr(e).find("already exists") == -1:
                        raise e
                logging.info(f"{cls.__name__}.create_database: database \"{cfg.database_name}\" created.")
                result = True
            finally:
                if cur:
                    cur.close()
        except BaseException as e:
            logging.error(f"{cls.__name__}.create_database: {repr(e)}")
        finally:
            if con:
                con.close()

        return result

    @classmethod
    def get_dict_cursor(cls):
        """ returns a dict cursor, which means that where_field-values cannot only be
            accessed by index but also by where_field-name. See "get_cursor" for more details.
        """
        return cls.get_cursor(cursortype="dict")

    @classmethod
    def in_error_state(cls):
        """
        checks if the current connection is in an errorneous transaction state
        :return: True if that is so
        """
        con = cls.get_con()
        if con:
            return con.info.transaction_status == TRANSACTION_STATUS_INERROR

        return False

    @classmethod
    def transaction_active(cls):
        """
        checks if the current connection has a running transaction
        :return: True if that is so
        """
        con = cls.get_con()
        if con:
            return con.info.transaction_status >= TRANSACTION_STATUS_ACTIVE

    @classmethod
    def get_postgres_version(cls):
        """
        returns the version of the connected postgres database
        :return: string
        """
        ver = 0
        try:
            con = cls.get_con()
            ver = con.server_version
            major_ver = ver // 10000
            minor_ver = (ver - major_ver * 10000) // 100
            patch_ver = ver - major_ver * 10000 - minor_ver * 100
            return f"{major_ver}.{minor_ver}.{patch_ver}"
        except BaseException as e:
            logging.error(f"{cls.__name__}.get_postgres_version: {repr(e)}")
            return f"{ver if ver else 'unknown'}"

    @classmethod
    def get_cursor(cls, cursortype=None):
        """ returns a cursor to the master-database. If cursortype is "dict", the resulting
            cursor is the same as returned by get_dict_cursor. If the parameter is missing, the
            result is a standard cursor that does not provide where_field values via where_field names. \n
            If the database is not open already, it will be opened. The class makes sure that only one database-connection
            will be used. \n
            :returns None if the database cannot be opened otherwise return where_value is an open cursor to the database.
        """

        con = cls.get_con()
        if con:
            try:
                if not cursortype:
                    return con.cursor()
                elif cursortype == "dict":
                    return con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                else:
                    raise Exception("KioskSQLDb: Unknown cursor type " + cursortype + ".")
            except Exception as e:
                logging.error(repr(e))
                return None

    @classmethod
    def execute(cls, sql, parameters=None, commit=False):
        """
        executes an sql statement and returns the number of affected rows.
        :param sql: the sql statement
        :param parameters: list with parameters (matching the %s occurrences in the statement)
        :param commit: if true the sql statement will be commited but in case of error NOT rolled back!
        :return: number of affected rows
        :exception: throws exceptions in case of an error
        """
        rc = None
        cur = cls.get_cursor()
        if not cur:
            raise Exception("Cannot get a cursor. Database not properly initiated.")
        try:
            cur.execute(sql, parameters)
            rc = cur.rowcount
            if commit:
                cls.commit()
            return rc
        except BaseException as e:
            logging.debug(f"{cls.__name__}.execute: sql failed: {repr(e)}. sql was {sql}.")
            logging.debug(f"{cls.__name__}.execute: query was: {cur.query}")
            raise e
        finally:
            cur.close()

    @classmethod
    def extended_execute(cls, sql, parameters=None, auto_commit=True):
        """ returns the number of effected rows, an exception's message and the errorneous sql statement """
        rc = None
        err_msg = ""
        err_sql = ""
        cur = cls.get_cursor()
        if not cur:
            raise Exception("Cannot get a cursor. Database not properly initiated.")
        try:
            cur.execute(sql, parameters)
            rc = cur.rowcount
            if auto_commit:
                KioskSQLDb.commit()
        except Exception as e:
            err_msg = repr(e)
            try:
                err_sql = cur.query
            except:
                pass
            try:
                if auto_commit:
                    cls.rollback()
            except:
                pass

        try:
            cur.close()
        except:
            if auto_commit:
                cls.rollback()
                pass

        cur = None

        return rc, err_msg, err_sql

    @classmethod
    def execute_return_cursor(cls, sql, parameters=None, commit=False):
        """
        executes an SQL statement and returns the cursor
        :param sql:
        :param parameters:
        :param commit:
        :return: an open cursor (only if no error occured, otherwise it makes sure not to leave a cursor open)
        :exception: Lets all kinds of exceptions through. But closes the cursor in case of an exception.
        """
        rc = None
        cur = cls.get_dict_cursor()
        if not cur:
            raise Exception("Cannot get a cursor. Database not properly initiated.")
        try:
            cur.execute(sql, parameters)
            if commit:
                cls.commit()
            rc = cur
        except BaseException as e:
            try:
                logging.error(f"{cls.__name__}.execute_return_cursor: {repr(e)}")
                cur.close()
            finally:
                if commit:
                    cls.rollback()
            raise e
        return rc

    @classmethod
    def delete_records(cls, table, where_field, where_value, add_to_repl_deleted=False):
        """ delete records from a table just chaining where_field and where_value with "="
        .. parameters: add_to_repl_deleted is optional. If set the uid and modified values of the
                        deleted records will be added to repl_deleted_uids.

        .. todo: document properly
        """
        rc = 0
        cur = cls.get_cursor()
        try:
            sql = f"""
            insert into \"repl_deleted_uids\"
            (\"deleted_uid\", \"table\",\"repl_workstation_id\", \"modified\") 
            select t.\"uid", '{table}', 'kiosk', t.\"modified" 
            from \"{table}\" t 
            where \"{where_field}\"=%s; 
            """

            cur.execute(sql, [where_value])
            logging.debug(str(cur.rowcount) + " new deleted uids added to repl_deleted_uids")

            sql = f"DELETE from \"{table}\" where \"{where_field}\"=%s;"
            cur.execute(sql, [where_value])
            rc = cur.rowcount
        except Exception as e:
            logging.error("Exception in kioskstdlib.delete_records: " + repr(e))
        finally:
            cur.close()
        return rc

    @classmethod
    def repl_mark_as_deleted(cls, table, where_field, where_value):
        """ The uid and modified values of the
            deleted records will be added to repl_deleted_uids.

        """
        rc = 0
        cur = cls.get_cursor()
        try:
            sql = f"""
            insert into \"repl_deleted_uids\"
            (\"deleted_uid\", \"table\",\"repl_workstation_id\", \"modified\") 
            select t.\"uid", '{table}', 'kiosk', t.\"modified" 
            from \"{table}\" t 
            where \"{where_field}\"=%s; 
            """

            cur.execute(sql, [where_value])
            logging.debug(str(cur.rowcount) + " new deleted uids added to repl_deleted_uids")

            rc = cur.rowcount
        except Exception as e:
            logging.error("Exception in kioskstdlib.delete_records: " + repr(e))
        finally:
            cur.close()
        return rc

    @classmethod
    def truncate_table(cls, table, commit=False, namespace=""):
        rc = 0
        cur = cls.get_cursor()
        san_table = cls.sql_safe_namespaced_table(namespace=namespace, db_table=table)
        try:
            sql = "TRUNCATE TABLE " + san_table
            cur.execute(sql)
            rc = cur.rowcount
            if commit:
                cls.commit()
        except Exception as e:
            logging.error("Exception in truncate_table: " + repr(e))
            try:
                if commit:
                    cls.rollback()
            except BaseException:
                pass
            raise e

        finally:
            cur.close()

        return rc

    @classmethod
    def get_connection_info(cls):
        s = ""
        try:
            con = cls.get_thread_con(establish=False)
            if con:
                cur = con.cursor()
                cur.execute("""select version();""")
                s = cur.fetchone()[0]
                cur.close()
            else:
                s = "database not connected"
        except Exception as e:
            s = repr(e)
        return s

    @classmethod
    def get_dsd(cls):
        """ returns the current DataSetDefinition. To get a result here,
        the database must have been opened first by requesting a cursor.
        todo: remove
        """
        logging.error(f"{cls.__class__.__name__}.get_dsd: Call to obsolete get_dsd.")
        return None

    @classmethod
    def does_table_exist(cls, tablename, schema=""):
        exists = False
        cur = cls.get_cursor()
        if cur:
            try:
                sql = "SELECT EXISTS ("
                sql = sql + f"SELECT 1 FROM pg_tables WHERE"
                if schema == "":
                    sql = sql + f" (schemaname = 'public' or schemaname = '')"
                else:
                    sql = sql + f" schemaname = '{schema}'"
                sql = sql + " AND tablename = '" + tablename + "');"
                cur.execute(sql)
                exists = cur.fetchone()[0]
                if not exists and schema == "":
                    # could be a temporary table
                    try:
                        # savepoint = cls.begin_savepoint(savepoint_prefix="chktmptbl")
                        sql = f'''
                            SELECT EXISTS (
                               SELECT 1
                               FROM   information_schema.tables 
                               WHERE  table_schema like 'pg_temp_%'
                               AND table_name ilike '{tablename}'
                            )
                        '''
                        # sql = f"select 1 from \"{tablename}\" limit 0"
                        cur.execute(sql)
                        exists = cur.fetchone()[0]
                    except BaseException as e:
                        raise e
                    # finally:
                    #     try:
                    #         cls.commit_savepoint(savepoint)
                    #     except BaseException as e:
                    #         pass
            finally:
                cur.close()
        return exists

    @classmethod
    def does_view_exist(cls, viewname, materialized_view=False, schema="public"):
        exists = False
        cur = cls.get_cursor()
        if cur:
            try:
                sql = f"""
                    SELECT count(*) > 0
                    FROM pg_catalog.pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relkind = '{'m' if materialized_view else 'v'}'
                    AND n.nspname = %s
                    AND c.relname = %s;
                    """

                cur.execute(sql, [schema, viewname])
                r = cur.fetchone()
                exists = r[0]
            finally:
                cur.close()
        return exists

    @classmethod
    def does_temp_table_exist(cls, tablename):
        cur = cls.get_cursor()
        if cur:
            try:
                sql = "SELECT count(*) c from \"" + tablename + "\";"
                cur.execute(sql)
                exists = cur.fetchone()
                cur.close()
                return (exists)
            except:
                pass
            try:
                cur.close()
            except:
                pass
        return (False)

    @classmethod
    def drop_table_if_exists(cls, tablename, namespace=""):
        """
        drops the given table. Sanatizes tablename and namespace (if given)
        :param tablename: the table (without namespace)
        :param namespace: optional namespace.
        :exception throws all kinds of exceptions.
        """
        cur = cls.get_cursor()
        if cur:
            sql = "DROP TABLE IF EXISTS %s;" % cls.sql_safe_namespaced_table(namespace=namespace,
                                                                             db_table=tablename)
            cur.execute(sql)
            cur.close()

    @classmethod
    def get_record_by_position(cls, table, position, field, order_by="", schema=""):
        rc = None
        try:
            cur = cls.get_dict_cursor()
            if cur:
                if position == cls.LAST_RECORD:
                    sql = f"select count(*) c from {cls.sql_safe_namespaced_table(table, schema)}"
                    cur.execute(sql)
                    offset = cur.fetchone()["c"] - 1
                elif position > cls.FIRST_RECORD:
                    offset = position - 1
                else:  # position == self.FIRST_RECORD:
                    offset = 0
                sql = f"select * from {cls.sql_safe_namespaced_table(table, schema)}"
                if order_by:
                    sql = sql + " order by " + order_by
                sql = sql + " limit 1"
                if offset > 0:
                    sql = sql + " offset " + str(offset)
                sql = sql + ";"
                cur.execute(sql)
                rc = cur.fetchone()

        except:
            pass

        try:
            cur.close()
        except:
            pass

        return (rc)

    @classmethod
    def get_first_record(cls, table, where_field, where_value, order_by=None, namespace=""):
        """
        get the record of a table that comes out first given a certain order.

        :return: return a record or None. Will not throw exceptions of any kind.
        """
        rc = None
        cur = None
        try:
            san_table = cls.sql_safe_namespaced_table(namespace=namespace, db_table=table)
            cur = cls.get_dict_cursor()
            if cur:
                sql = f"select * from {san_table} where \"" + where_field + "\" = %s"
                if order_by:
                    sql = sql + " order by " + order_by
                sql = sql + " limit 1;"
                cur.execute(sql, [where_value])
                rc = cur.fetchone()
        except BaseException as e:
            logging.error(
                "Exception in get_first_record, sql= " + sql + ", where_value=" + where_value + ": " + repr(e))
        finally:
            if cur:
                cur.close()

        return rc

    @classmethod
    def get_first_record_from_sql(cls, sql: str, params: Union[list, dict] = []) -> dict:
        rc = None
        try:
            cur = cls.get_dict_cursor()
            if cur:
                sql = sql + " limit 1"
                cur.execute(sql, params)
                rc = cur.fetchone()
                # print(cur.query, rc)

        except Exception as e:
            logging.error(f"Exception in get_first_record_from_sql, sql={sql}, params={params}: {repr(e)}")
            raise e
        finally:
            try:
                cur.close()
                # logging.debug(f"{cls.__name__}.get_first_record_from_sql: cursor closed.")
            except BaseException as e:
                logging.error(f"{cls.__name__}.get_first_record_from_sql: {repr(e)}")

        return rc

    @classmethod
    def get_records(cls, sql, params=None, max_records=0, add_column_row=False,
                    raise_exception=False,
                    post_filter: Callable = None):
        result = []
        if params is None:
            params = []
        cur = None
        try:
            cur = cls.get_dict_cursor()
            if cur:
                if max_records:
                    sql = sql + f" limit {max_records};"
                cur.execute(sql, params)
                if add_column_row:
                    result.append([desc[0] for desc in cur.description])

                r = cur.fetchone()
                while r:
                    if not post_filter or post_filter(r):
                        result.append(r)
                    r = cur.fetchone()

        except Exception as e:
            logging.error(f"Exception in get_records, sql= {cur.query if cur else ''}: {repr(e)}")
            KioskSQLDb.rollback()
            if raise_exception:
                try:
                    cur.close()
                except:
                    pass
                raise e

        try:
            cur.close()
        except:
            pass

        return result

    @classmethod
    def get_field_value(cls, table, wherefield, wherevalue, field, orderby=None):
        rc = None
        try:
            rc = cls.get_first_record(table, wherefield, wherevalue, orderby)

            if rc:
                rc = rc[field]

        except Exception as e:
            logging.error("Exception in get_field_value, where_field {}: ".format(field) + repr(e))
            rc = None

        return (rc)

    @classmethod
    def get_field_value_from_sql(cls, field, sql, params=None, exception_on_no_record=False):
        if params is None:
            params = []
        try:
            rc = cls.get_first_record_from_sql(sql, params)

            if rc:
                rc = rc[field]
            else:
                if exception_on_no_record:
                    raise KeyError()

        except KeyError as e:
            raise e
        except Exception as e:
            logging.error("Exception in get_field_value_from_sql, where_field {}: ".format(field) + repr(e))
            rc = None

        return rc

    @classmethod
    def is_empty(cls, table, schema=""):
        rc = None
        cur = cls.get_cursor()
        if cur:
            try:
                table = cls.sql_safe_namespaced_table(schema, table)
                sql = f"select" + f" * from {table} limit 1"
                cur.execute(sql)
                rc = cur.fetchone()
                rc = not rc
            finally:
                try:
                    cur.close()
                except:
                    pass

        return rc

    @classmethod
    def run_sql_script(cls, filename, commit=True, substitute_variables={}):
        sql = ""
        with open(filename, 'r', encoding="utf8") as script_file:
            sql = script_file.read()
        if sql:
            if substitute_variables:
                sql = kioskstdlib.resolve_symbols_in_string(sql, substitute_variables)
            cur = cls.get_cursor()
            if cur:
                try:
                    cur.execute(sql)
                    cur.close()
                    if commit:
                        cls.commit()
                except BaseException as e:
                    logging.error(f"{cls.__name__}.run_sql_script: Exception when running script {filename}: {repr(e)}")
                    logging.error(f"{cls.__name__}.run_sql_script: sql was {sql}")
                    cur.close()
                    cls.rollback()
                    raise e
            else:
                logging.error("No cursor in run_sq_script.")

    @classmethod
    def initialize_table_data(cls, table, filename, commit=True):
        if filename:
            try:
                # with open(filename, "r") as ymlfile:
                # y = yaml.load(ymlfile)
                # print("\n***********************")
                # print(y)
                # print("\n***********************")
                with open(filename, "r", encoding='utf8') as ymlfile:
                    columns = yaml.load(ymlfile, Loader=yaml.FullLoader)['columns']
                with open(filename, "r", encoding='utf8') as ymlfile:
                    records = yaml.load(ymlfile, Loader=yaml.FullLoader)['data']
            except Exception as e:
                logging.error(repr(e))
                columns = None
                records = None
        if columns:
            # logging.debug("columns is true")
            if records:
                # logging.debug("records is true")
                cur = cls.get_cursor()
                if cur:
                    sqlinsert = "INSERT" + " INTO \"" + table + "\" ("
                    comma = ""
                    for col in columns:
                        sqlinsert = sqlinsert + comma + "\"" + col + "\""
                        comma = ", "
                    sqlinsert = sqlinsert + ") VALUES("
                    for record in records:
                        sqlvalues = ""
                        comma = ""
                        for value in record:
                            sqlvalues = sqlvalues + comma + "%s"
                            comma = ", "
                        sql = sqlinsert + sqlvalues + ");"
                        cur.execute(sql, record)
                cur.close()
                if commit:
                    cls.commit()

    @classmethod
    def update_table_data(cls, table, filename, keyfield, modified_by=None, fail_on_key_not_found=False, commit=False):
        """ updates records in the table according to the records in the yml-file.
            They keyfield defines, which of the fields in the yml-file will be used
            in the where - clause of the update statement. Some paraneters control the manipulation: \n
            \n
            modified_by: if given, it will be saved to every modified record and the modified date will be set to now() \n
            fail_on_key_not_found: if True, the function fails if an update statement affects 0 rows. \n
            commit: if set to True, manipulations will be persisted. \n

            NOTE: This is deprecated.
            """
        logging.error(f"{cls.__name__}.update_table_data: call to deprecated function")
        raise Exception(f"{cls.__name__}.update_table_data: call to deprecated function")
        overall_row_count = 0
        if filename:
            try:
                # with open(filename, "r") as ymlfile:
                #     y = yaml.load(ymlfile)
                # print("\n***********************")
                # print(y)
                # print("\n***********************")
                with open(filename, "r", encoding='utf8') as ymlfile:
                    records = yaml.load(ymlfile, Loader=yaml.FullLoader)
            except Exception as e:
                logging.error(repr(e))
                records = None
            try:
                if records:
                    # logging.debug("records is true")
                    cur = cls.get_cursor()
                    if cur:
                        for row in records:
                            sqlupdate = "UPDATE \"" + table + "\" SET "
                            sqlwhere = "WHERE "
                            update_values = []
                            where_value = None
                            comma = ""
                            for key, value in row.items():
                                if key.upper() != keyfield.upper():
                                    sqlupdate = sqlupdate + comma + "\"" + key + "\"=%s"
                                    update_values.append(value)
                                    comma = ", "
                                else:
                                    sqlwhere = sqlwhere + key + "=%s"
                                    where_value = value
                            if where_value:
                                if modified_by:
                                    sqlupdate = sqlupdate + ", \"modified_by\"=%s"
                                    update_values.append(modified_by)
                                    sqlupdate = sqlupdate + ", \"modified\"=%s"
                                    update_values.append(datetime.datetime.now())

                                update_values.append(where_value)
                                sql = sqlupdate + " " + sqlwhere
                                cur.execute(sql, update_values)
                                overall_row_count += cur.rowcount
                                if fail_on_key_not_found:
                                    if cur.rowcount == 0:
                                        raise Exception("no record affected by " + str(row))
                            else:
                                raise Exception("No keyvale found in row " + str(row))
                    cur.close()
                    if commit:
                        cls.commit()
                    return (overall_row_count)
                else:
                    raise Exception("No records")
            except Exception as e:
                logging.error("Exception in update_table_data: " + repr(e))
            try:
                cur.close()
            except:
                pass
            return False

    @classmethod
    def update_by_uuid(cls, table, uuid, data={}, user="sys", set_repl_data=True, auto_commit=True):
        """ updates a row in a table according to the given uid

            deprecated.
        """
        logging.error(f"{cls.__name__}.update_by_uuid: call to deprecated function")
        raise Exception(f"{cls.__name__}.update_by_uuid: call to deprecated function")
        params = []
        if not data or not table:
            return None, "KioskSQLDb.update_by_uuid: No data or no table provided", ""

        if not uuid:
            return None, "KioskSQLDb.update_by_uuid: No uuid provided", ""

        if set_repl_data:
            if "modified_by" not in data:
                data["modified_by"] = user
            if "modified" not in data:
                date_modified: datetime.datetime = datetime.datetime.now()
                data["modified"] = datetime.datetime(date_modified.year,
                                                     date_modified.month,
                                                     date_modified.day,
                                                     date_modified.hour,
                                                     date_modified.minute,
                                                     date_modified.second,
                                                     0)

        if uuid:
            sql = f"update \"{table}\" set "
            comma = ""
            for key in data:
                sql += f"{comma}\"{key}\"=%s"
                params.append(data[key])
                comma = " ,"

            sql += f" where \"uid\"=%s"
            params.append(uuid)
            rc, err_msg, err_sql = cls.extended_execute(sql, parameters=params, auto_commit=auto_commit)

            return rc, err_msg, err_sql

    @classmethod
    def get_record_count(cls, table, key_field, where="", params=None, namespace=""):
        """
        returns the number of records in the table. table and namespace will be sanitized and quoted, so
        don't quote them yourself.

        :param table: the table
        :param key_field: this where_field will be counted (without distinct!)
        :param where: the conditions of a where clause with %s placeholders and without the WHERE
        :param params: a list of params feeding the where statement
        :param namespace: optional. If the table is in a db namespace.
        :return: number of records, can throw exceptions.
        """
        if params is None:
            params = []
        san_table_name = cls.sql_safe_namespaced_table(namespace=namespace, db_table=table)
        sql = f"SELECT" + f" count(\"{key_field}\") \"c{key_field}\" from {san_table_name} "
        if where:
            sql += f" WHERE {where}"
        return cls.get_field_value_from_sql(f"c{key_field}", sql, params)

    @classmethod
    def begin_savepoint(cls, savepoint_name: str = "", savepoint_prefix: str = ""):
        """
        starts a savepoint in the current transaction.
        :param savepoint_name: optional. A static name for the savepoint.
                               It is recommended to leave this blank. Then a random id will be used for the savepoint.
        :param savepoint_prefix: optional. A prefix for the random id. Keep it short!
        :return: returns the name of the savepoint.
        :exception: Throws an exception if savepoint creation fails.
        """
        if not savepoint_name:
            if savepoint_prefix:
                savepoint_name = "T_" + savepoint_prefix + "_" + nanoid.generate("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
            else:
                savepoint_name = "T_" + nanoid.generate("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
        cls.execute(f"SAVEPOINT {savepoint_name}")
        logging.debug(
            f"{cls.__name__}.begin_savepoint: {savepoint_name} set. "
            f"TR Status is {cls.get_thread_con().info.transaction_status}")
        return savepoint_name

    @classmethod
    def commit_savepoint(cls, savepoint_name: str):
        if savepoint_name:
            cls.execute(f"RELEASE SAVEPOINT {savepoint_name}")
        logging.debug(f"{cls.__name__}.commit_savepoint: {savepoint_name} commited")

    @classmethod
    def rollback_savepoint(cls, savepoint_name: str):
        if savepoint_name:
            cls.execute(f"ROLLBACK TO SAVEPOINT {savepoint_name}")
        logging.debug(f"{cls.__name__}.rollback_savepoint: {savepoint_name} rolled back")

    # @classmethod
    # def get_first_record(cls, table, where_field=None, where_value=None, order_by=None):
    #     rc = None
    #
    #     cur = cls.get_dict_cursor()
    #     try:
    #         if cur:
    #             if where_field and where_value:
    #                 sql = "select * from \"" + table + "\" where \"" + where_field + "\" = %s"
    #             else:
    #                 sql = "select * from \"" + table + "\""
    #
    #             if order_by:
    #                 sql = sql + " order by " + order_by
    #             sql = sql + " limit 1;"
    #             if where_value:
    #                 cur.execute(sql, [where_value])
    #             else:
    #                 cur.execute(sql, [])
    #
    #             rc = cur.fetchone()
    #     finally:
    #         try:
    #             cur.close()
    #         except:
    #             pass
    #
    #     return rc

    @classmethod
    def sql_safe_ident(cls, identifier: str):
        """
        returns a sanitized and properly quoted sql identifier (table names, where_field names etc.)
        :param identifier: identifier that has to be sanitized and quoted
        :return: the sanitized and quoted identifier
        """
        return psycopg2.sql.Identifier(identifier).as_string(cls.get_con())

    @classmethod
    def sql_safe_namespaced_table(cls, namespace: str, db_table: str):
        """
        returns a sanitized and properly quoted table name. If a namespace is not "",
        a schema name will be set in front of the tablename.
        :param namespace: the schema name
        :param db_table: the table name
        :return:
        """
        if namespace:
            return f"{psycopg2.sql.Identifier(namespace).as_string(cls.get_con())}." \
                   f"{psycopg2.sql.Identifier(db_table).as_string(cls.get_con())}"
        else:
            return f"{psycopg2.sql.Identifier(db_table).as_string(cls.get_con())}"

    @classmethod
    def create_namespace(cls, namespace: str, commit=False):
        cls.execute(
            psycopg2.sql.SQL("CREATE SCHEMA IF NOT EXISTS {0}").format(psycopg2.sql.Identifier(namespace)))
        if commit:
            cls.commit()

    @classmethod
    def get_default_time_zone(cls):
        """
        returns the default time zone setting of the current session (or PostgreSQL in general) as uppercase.
        :return: uppercase default time zone
        """
        r = cls.get_records("show time zone")[0]
        return r[0].upper()

    @classmethod
    def apply_post_filter(cls, records, ):
        pass
