import logging
from typing import Tuple

from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb


class KioskDBSequence:
    def __init__(self, dsd: DataSetDefinition):
        self._dsd = dsd

    def list_sequences(self) -> list[Tuple[str, str]]:
        result = []
        for t in self._dsd.list_tables_with_instructions(["sequence"]):
            for field in self._dsd.get_fields_with_instruction(t, "sequence"):
                result.append((t, field))
        return result

    def update_all_sequences(self):
        sequences = self.list_sequences()
        c = 0
        for sequence in sequences:
            self.update_sequence(sequence[0], sequence[1])
            c += 1
        return c

    def update_sequence(self, table, field):
        try:
            if not KioskSQLDb.backfill_serial_column(table, field):
                logging.warning(f"The table {table} could not be locked to update the sequence on {field}. "
                                f"Try again later ...")

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.update_sequence: "
                          f"Updating sequence {table}.{field} failed due to {repr(e)}")
