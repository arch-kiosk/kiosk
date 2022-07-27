class SqlSafeIdentMixin:
    @classmethod
    def sql_safe_ident(cls, identifier: str):
        """
        returns a sanitized and properly quoted sql identifier (table names, field names etc.)
        :param identifier: identifier that has to be sanitized and quoted
        :return: the sanitized and quoted identifier
        """
        raise NotImplementedError

    @classmethod
    def sql_safe_namespaced_table(cls, namespace: str, db_table: str):
        """
        returns a sanitized and properly quoted table name. If a namespace is not "",
        a schema name will be set in front of the tablename.
        :param namespace: the schema name
        :param db_table: the table name
        :return:
        """
        raise NotImplementedError
