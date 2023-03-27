from kiosksqldb import KioskSQLDb


class Table:
    _FIELD_DEFINITION_NAME = 0
    _FIELD_DEFINITION_ATTRIBUTES = 1

    ATTRIBUTE_KEY = "[key]"
    ATTRIBUTE_DONT_INSERT = "[dontinsert]"
    ATTRIBUTE_DONT_UPDATE = "[dontupdate]"

    _quote_identifier = "\""
    _quote_string = "'"

    _fields = []
    _table_name = ""

    debug = False

    def __init__(self, **kwargs):
        self._r = {}
        self._fields = []
        self._table_name = ""
        self._sql_insert_values = ""
        self._sql_insert_columns = ""
        self._sql_update = ""
        self._sql_select_columns = ""
        self._key_fields_names = []
        self._key_fields_columns_str = ""
        self._init_instance(**kwargs)

    def _init_instance(self, **kwargs):
        self._r = {}
        self._fields = []
        self._key_fields_names = []
        self._sql_insert_values = ""
        self._sql_insert_columns = ""
        self._sql_update = ""
        self._sql_select_columns = ""
        self._table_name = self._get_table_name()
        self._fields = self._get_fields()
        for f in self._fields:
            self._init_field(f[0], kwargs)

        if not self._fields or not self._table_name:
            raise Exception("no fields or no table name defined.")

        self._identify_key_fields()

    def _get_new_instance(self, **kwargs):
        return self.__class__(**kwargs)

    def _identify_key_fields(self):
        for f in self._fields:
            if len(f) > 1:
                if f[self._FIELD_DEFINITION_ATTRIBUTES].find(self.ATTRIBUTE_KEY) > -1:
                    self._key_fields_names.append(f[self._FIELD_DEFINITION_NAME])
        self._key_fields_columns_str = ",".join(self._key_fields_names)

    def _init_field(self, field_name, value_dict):
        if field_name in value_dict:
            setattr(self, field_name, value_dict[field_name])
        else:
            if not hasattr(self, field_name):
                setattr(self, field_name, None)

    def _dict_to_fields(self, field_dict: dict):
        for field in field_dict.keys():
            if hasattr(self, field):
                setattr(self, field, field_dict[field])

    @classmethod
    def _get_fields(cls):
        return cls._fields

    @classmethod
    def _get_table_name(cls):
        return cls._table_name

    @classmethod
    def _field_has_attribute(cls, field, attributes: list):
        if len(field) < 2 or not attributes:
            return False
        for attr in attributes:
            if field[cls._FIELD_DEFINITION_ATTRIBUTES].find(attr) > -1:
                return True

        return False

    def _select_fields(self, include_attributes=[], exclude_attributes=[], fields=[]):
        if not fields:
            fields = self._fields
        return_fields = []
        for f in fields:
            if include_attributes:
                if f[self._FIELD_DEFINITION_NAME] not in include_attributes:
                    continue
            if self._field_has_attribute(f, exclude_attributes):
                continue

            return_fields.append(f)

        return return_fields

    def _get_column_str(self, fields=None, exclude_attributes=[]):
        qi = self._quote_identifier
        fields = self._select_fields(exclude_attributes=exclude_attributes, fields=fields)

        return ",".join([f"{qi}{field[0]}{qi}"
                         for field in fields])

    def _get_value_placeholders_str(self, fields=None, exclude_attributes=[]):
        fields = self._select_fields(exclude_attributes=exclude_attributes, fields=fields)
        return ",".join(["%s" for _ in range(0, len(fields))])

    def _prepare_sql_insert(self):
        qi = self._quote_identifier
        if not self._sql_insert_columns:
            self._sql_insert_columns = self._get_column_str(exclude_attributes=[self.ATTRIBUTE_DONT_INSERT])
            self._sql_insert_values = self._get_value_placeholders_str(exclude_attributes=[self.ATTRIBUTE_DONT_INSERT])

    def _prepare_sql_update(self):
        if not self._sql_update:
            qi = self._quote_identifier
            fields = self._select_fields(exclude_attributes=[self.ATTRIBUTE_DONT_UPDATE])
            self._sql_update = ",".join([f"{qi}{field[0]}{qi}=%s"
                                         for field in fields])

    def _prepare_sql_select(self):
        if not self._sql_select_columns:
            self._sql_select_columns = self._get_column_str()

    @classmethod
    def truncate(cls, commit=False):
        qi = cls._quote_identifier
        sql = "DELETE " + f" from {qi}{cls._get_table_name()}{qi}"
        KioskSQLDb.execute(sql, commit=commit)

    def _execute_and_fetch(self, sql, sql_params, commit=False) -> bool:
        """
        executes the sql statement (which must use RETURNING) and then loads the instance with the
        cache element that had just been inserted or updated. Used by add and update only!

        :param sql: sql data manipulation statement that must use RETURNING
        :param sql_params:
        :param commit: set to True if you want to commit the current transaction after the statement. Default is False.
        :return: bool
        """
        rc = False
        cur = KioskSQLDb.execute_return_cursor(sql, parameters=sql_params, commit=commit)
        if self.debug:
            print(cur.query)
        try:
            if self._key_fields_columns_str:
                r = cur.fetchone()
                if r:
                    rc = self.get_by_key(r)
            else:
                rc = True

        finally:
            cur.close()
        return rc

    def add(self, commit=False):
        qi = self._quote_identifier
        self._prepare_sql_insert()

        sql_params = [getattr(self, field[self._FIELD_DEFINITION_NAME])
                      for field in self._select_fields(exclude_attributes=[self.ATTRIBUTE_DONT_INSERT])]
        sql = "INSERT INTO " + f"{qi}{self._table_name}{qi} ({self._sql_insert_columns}) " \
                               f"VALUES({self._sql_insert_values})"
        if self._key_fields_columns_str:
            sql = " ".join([sql, f"RETURNING {self._key_fields_columns_str}"])

        return self._execute_and_fetch(sql, sql_params, commit)

    def update(self, commit=False) -> bool:
        """
        updates an existing record with the data of the instance.
        :param commit: set to True of you want to commit the current transaction, otherwise default is False.
        :return: bool
        :exception: Lets all kinds of exceptions through
        """
        qi = self._quote_identifier
        self._prepare_sql_update()

        if len(self._key_fields_names) == 0:
            raise Exception("update does not work without having any keyfields defined.")

        sql_params = [getattr(self, field[self._FIELD_DEFINITION_NAME])
                      for field in self._select_fields(exclude_attributes=[self.ATTRIBUTE_DONT_UPDATE])]

        sql = "UPDATE " + f"{qi}{self._table_name}{qi} SET {self._sql_update}"

        where_params, where_str = self.get_where_from_key_fields()
        if not where_str or not where_params:
            raise Exception("update: where could not be built.")

        sql = " ".join([sql, " WHERE ", where_str])
        sql_params.extend(where_params)
        sql = " ".join([sql, f"RETURNING {self._key_fields_columns_str}"])

        return self._execute_and_fetch(sql, sql_params, commit)

    def get_one(self, where: str, params: []) -> bool:
        """
        loads a record into the current instance's attributes.
        :param where:
        :param params:
        :return: True if the record was loaded otherwise (if it could not be found) False.
        """
        qi = self._quote_identifier
        self._prepare_sql_select()
        sql = "SELECT " + f"{self._sql_select_columns} FROM {self._table_name} WHERE {where}"
        r = KioskSQLDb.get_first_record_from_sql(sql, params)
        if r:
            self._load_record(r)
            return True
        else:
            return False

    def get_many(self, where: str = "", params: [] = None, order_by: str = ""):
        if len(self._key_fields_names) == 0:
            raise Exception("get_many does not work without having any keyfields defined.")

        primary_field_name = self._get_primary_field_name()
        qi = self._quote_identifier
        self._prepare_sql_select()
        sql = "SELECT " + f"{self._key_fields_columns_str} FROM {self._table_name}"
        if where:
            sql += f" WHERE {where}"
        if order_by:
            sql += f" ORDER BY {order_by}"

        cur = KioskSQLDb.get_dict_cursor()
        try:
            cur.execute(sql, params)
            r = cur.fetchone()
            while r:
                new_instance = self._get_new_instance(**{primary_field_name: r[primary_field_name]})
                new_instance.get_by_key()
                yield new_instance
                r = cur.fetchone()
        finally:
            cur.close()

    def update_many(self, update_fields, update_params=None, where="", where_params=None):
        if where_params is None:
            where_params = []
        if update_params is None:
            update_params = []
        qi = self._quote_identifier

        sql_fields = ",".join([f"{qi}{field_name}{qi}=%s" for field_name in update_fields])
        sql = "UPDATE " + f"{self._table_name} SET {sql_fields}"
        sql_params = []
        sql_params.extend(update_params)
        if where:
            sql += f"WHERE {where}"
            sql_params.extend(where_params)
        if KioskSQLDb.execute(sql, sql_params):
            self.get_by_key()
            return True

        return False

    def get_by_key(self, key_fields_dict: dict = {}):
        """
        (re)loads the record into the instance attributes using the
        current values of the key fields (or the given dict)
        :param key_fields_dict: a dict with key fields and values to use instead of the
                                instance attributes.
        :return: bool. If the key fields are not set, the method returns False!
        """
        if self.check_key_fields():
            params, where = self.get_where_from_key_fields(key_fields_dict)
            return self.get_one(where, params)
        else:
            return False

    def get_where_from_key_fields(self, key_fields_dict={}):
        """
        returns the where clause (without keyword WHERE) for the key fields and their current values
        :param key_fields_dict: if set key fields and values will be taken from this dict instead of
                                the instance attributes
        :return: the where clause without "WHERE"
        :exception: Lets exceptions through.

        """
        qi = self._quote_identifier
        params = []
        where = ""
        and_sep = ""
        for key_field in self._key_fields_names:
            param = ""
            if key_fields_dict:
                if key_field in key_fields_dict:
                    param = key_fields_dict[key_field]
            else:
                if hasattr(self, key_field):
                    param = getattr(self, key_field)

            if param:
                params.append(param)
                where = where + f"{and_sep}{qi}{key_field}{qi}=%s"
                and_sep = " and "
            else:
                raise Exception(f"get_by_key: value for key field {key_field} missing.")
        return params, where

    def _load_record(self, r):
        for field in self._fields:
            setattr(self, field[0], r[field[0]])

    def count(self, key="*", only_distinct_values=False, where="", params=None):
        if params is None:
            params = []

        if only_distinct_values:
            sql = "SELECT" + f" count(distinct {key}) c FROM {self._table_name}"
        else:
            sql = "SELECT" + f" count({key}) c FROM {self._table_name}"
        if where:
            sql += f" WHERE {where}"
        return KioskSQLDb.get_first_record_from_sql(sql, params=params)["c"]

    def all(self, where="", params=[]):
        qi = self._quote_identifier
        self._prepare_sql_select()
        sql = "SELECT " + f"{self._sql_select_columns} FROM {self._table_name}"
        if where:
            sql = sql + f" WHERE {where}"

        try:
            cur = KioskSQLDb.get_dict_cursor()
            cur.execute(sql, params)
            r = cur.fetchone()
            while r:
                self._load_record(r)
                yield self
                r = cur.fetchone()
        finally:
            try:
                cur.close()
            except:
                pass

    def check_key_fields(self):
        """
        checks if the key fields are set to something (they are not None)
        :return: false if any of the key fields is set to None, otherwise True
        """
        if len(self._key_fields_names) == 0:
            return False

        for f in self._key_fields_names:
            if (not hasattr(self, f)) or (getattr(self, f) is None):
                return False
        return True

    def delete(self, commit=False):
        """
        deletes the record in the database that corresponds to the key fields of the instance
        :param commit: set to True of you want to commit the current transaction, otherwise default is False.
        :exception throws an exception if no key fields are set and lets other exceptions through.

        """
        if not self.check_key_fields():
            raise Exception(f"table.delete: Key fields for table {self._table_name} not set.")

        params, where = self.get_where_from_key_fields()
        sql = "DELETE" + f" FROM {self._table_name} WHERE {where}"
        if KioskSQLDb.execute(sql, params):
            if commit:
                KioskSQLDb.commit()
            return True

        return False

    def _get_primary_field_name(self):
        if len(self._key_fields_names) == 1:
            return self._key_fields_names[0]
        else:
            raise Exception("table._get_primary_field_name: An operation was "
                            "called that works only on tables with exactly one key field.")
