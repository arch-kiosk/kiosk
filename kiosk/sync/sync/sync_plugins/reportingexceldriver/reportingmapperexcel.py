import copy

from sync_plugins.reportingdock.reportingmapper import ReportingMapper


class ReportingMapperExcel(ReportingMapper):
    TYPE_TABLE = 5

    def _resolve_value_and_type(self, value_term: str) -> (int, str):
        """
        resolves a value expression and to either a constant, a variable or a db-value (or a db-list)
        or a table.
        :param value_term: The term without the outer quotes of a triple quote(so a constant would just be \'constant\'
        :return: a tuple consisting of (value-type, value) - both elements can be None.
        """
        value_type, value = super()._resolve_value_and_type(value_term)
        if not value_type:
            # might be a table type?
            _, match = self._get_value_type(value_term)
            if _ and match:
                name = match.groups(1)[0][1:]
                if "tables" in self._mapping_dict and name in self._mapping_dict["tables"]:
                    return self.TYPE_TABLE, name
        return value_type, value

    def _simple_mapping(self, mapping: str) -> str:
        value_type, value = self._resolve_value_and_type(mapping)
        if value_type != self.TYPE_TABLE:
            return super()._simple_mapping(mapping)
        else:
            return "#" + value

    def get_table_cell_mapping(self, mapping, row: dict):
        """
        special mapping from a single table row onto a cell.
        :param mapping:
        :param row:
        """
        save_key_values = self._key_values
        self._key_values = copy.deepcopy(save_key_values)
        self._key_values.update(row)

        if isinstance(mapping, str):
            # no tables supported here
            v = super()._simple_mapping(mapping)
        else:
            v = self._process_transformations(mapping)

        self._key_values = save_key_values

        return v
