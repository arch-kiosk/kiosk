from typing import Callable


class ContextTypeInfo:

    def __init__(self, get_field_data_type_callback: Callable[[str, str], any]):
        """
        A ContextTypeInfo Instance stores key-value pairs of field name and type.
        It makes sure that a field name is only added once and in subsequent attempts to add it
        again it checks whether the type is the same as that of the previous attempts.

        :param get_field_data_type_callback: A callback function that takes
                a record type and a field and returns the data type of the field.
        """
        self._types = {}
        self._get_field_data_type_callback: Callable[[str, str], any] = get_field_data_type_callback
        self._dsd_fields = []

    @property
    def extended_field_information(self) -> list:
        """
        returns a list of tuples with a more extensive set of information about all fields and types.
        :return: list of (field-alias, dsd field name, dsd table, datatype)
        """
        return self._dsd_fields

    def add_type(self, field: str, record_type: str = "", field_alias="") -> None:
        """
        adds the type of a dsd field to the typeinfo.
        Fails if there is already a different(!) type registered under the field name
        :param field: the field name.
        :param record_type: optional. If given a table prefix in field name will be ignored.
               if missing "field" needs a table prefix.
        :param field_alias: optional. While "field" is the field as it is known to the dsd,
                "field_alias" is expected to and will be the field name known to the ContextTypeInfo instance.
        :exception ValueError: Thrown if a record_type is neither given directly or by means of a table prefix
        :exception TypeError: Thrown if the field was already registered with a different type
        """
        if not field_alias:
            field_alias = field

        if record_type:
            field = field.split(".")[-1]
        else:
            field_parts = field.split(".")
            if len(field_parts) != 2:
                raise ValueError(f"ContextTypeInfo.add_type: field {field} is expected to have a table prefix.")
            else:
                record_type = field_parts[0]
                field = field_parts[1]

        type_info = self._get_field_data_type_callback(record_type, field)
        self._dsd_fields.append((field_alias, field, record_type, type_info))
        self.add_data_type(field_alias, type_info)

    def add_data_type(self, field: str, datatype: str):
        """
        Adds the type of a field to the typeinfo.
        Fails if there is already a different(!) type registered under the field name
        :param field: the field name.
        :param datatype: The data type to store. Must be a regular dsd datatype.
        :exception TypeError: Thrown if the field was already registered with a different type
        """
        current_type = self.get_type(field)
        if current_type:
            if current_type == datatype:
                return
            else:
                if not (current_type in ["varchar", "text"] and datatype in ["varchar", "text"]):
                    raise TypeError(f"field {field} is expected to have type {current_type} but has {datatype}.")

        self._types[field] = datatype

    def append_to(self, additional_type_info):
        for field in self._types.keys():
            additional_type_info.add_data_type(field, self._types[field])

    def get_type(self, field: str) -> str:
        """
        returns the data type for a field
        :param field: the field name. Any table prefix will be ignored.
                Note if types are added using a field_alias, that alias is expected here.
        :return: the type or an empty string if there is none.
        """
        try:
            return self._types[field]
        except KeyError:
            return ""
