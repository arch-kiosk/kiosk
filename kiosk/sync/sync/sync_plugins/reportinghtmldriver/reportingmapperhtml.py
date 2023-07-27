import logging

from sync_plugins.reportingdock.reportingmapper import ReportingMapper


class ReportingMapperHTML(ReportingMapper):
    def _render_list(self, list_name):
        if not self._on_load_list:
            logging.info(f"{self.__class__.__name__}._render_list: no handler to load list {list_name}.")
            return

        list_def = self._mapping_dict["lists"][list_name]
        columns: list = list_def["columns"]
        rows = self._on_load_list(list_name, columns)

        found_rows = 0
        skipped_rows = 0
        skip_row = False
        result = {"values": [],
                  "types": [list_def[col]["type"] if col in list_def and "type" in list_def[col] else "VARCHAR"
                            for col in columns]}

        values = result["values"]
        for r in rows:
            found_rows += 1
            if skip_row:
                skipped_rows += 1
            else:
                values.append([str(r[idx]) if r[idx] else "" for idx, _ in enumerate(columns)])

        if skipped_rows:
            logging.warning(f"{self.__class__.__name__}._render_list: {skipped_rows} rows of list {list_name} skipped")
        self.add_key_value(list_name, result)
