from psycopg2.pool import ThreadedConnectionPool, PoolError
from psycopg2 import Error as PsycoPg2Error
import logging
from kioskstdlib import get_thread_id


class PoolNoConnectionError(PsycoPg2Error):
    pass


class KioskThreadedConnectionPool(ThreadedConnectionPool):

    def __init__(self, minconn, maxconn, *args, **kwargs):
        super().__init__(0, maxconn, *args, **kwargs)
        self.minconn = minconn

    def _connect(self, key=None):
        con = super()._connect(key=key)
        logging.debug(f"Established new db connection for thread {get_thread_id()}: {self._kwargs['dsn']}")
        return con

    def _getconn(self, key=None, establish=True):
        """Get a free connection and assign it to 'key' if not None.
           This just introduces the establish parameter.

           :param establish: default is true: Establish a new connection if there is none registered for this key.
                             if false no connection will be established if there is none for this key!
           :raises PoolError: in case of issues
           :raises PoolNoConnectionError: in case there is no connection for this key.

        """

        if not establish:
            if not key:
                raise PoolError("when using establish=False a key must be provided.")
            if key not in self._used:
                raise PoolNoConnectionError()
        else:
            if key not in self._used:
                logging.debug(f"{self.__class__.__name__}: establishing new db connection for Thread {get_thread_id()}")

        return super()._getconn(key)

    def getconn(self, key=None, establish=True):
        """ Get a free connection and assign it to 'key' if not None.
            Replaces the method of the base-class entirely!

           :param key: the key. If establish is False the key is required.
           :param establish: default is true: Establish a new connection if there is none registered for this key.
                             if false no connection will be established if there is none for this key!
           :raises PoolError: in case of issues
           :raises PoolNoConnectionError: in case there is no connection for this key.
        """

        self._lock.acquire()
        try:
            return self._getconn(key, establish=establish)
        finally:
            self._lock.release()

    def release_all(self):
        """Release all connections but leave the pool open.
        """

        self._lock.acquire()
        try:
            if self.closed:
                raise PoolError("connection pool is closed")
            for conn in self._pool + list(self._used.values()):
                try:
                    conn.close()
                except Exception:
                    pass

            self._pool = []
            self._used = {}
            self._rused = {}  # id(conn) -> key map
            self._keys = 0
        finally:
            self._lock.release()
        # self.closed = True
