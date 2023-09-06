import copy
import logging

import dicttools
from uic.uicfinder import UICFinder
from presentationlayer.viewpart import ViewPart


class ViewPartSheet(ViewPart):
    def render(self):
        table_def = self.dsd.get_table_definition(self.view_record_type)
        if "ui_elements" in self.part_definition["layout_settings"]:
            part_ui_elements = self.part_definition["layout_settings"]["ui_elements"]
        else:
            part_ui_elements = {}

        part_ui_element_ids = list(part_ui_elements.keys())
        if "fields_selection" in self.part_definition and self.part_definition["fields_selection"] == "dsd":
            element_ids = [field_name for field_name in table_def.keys()]
        else:
            element_ids = [field_name for field_name in table_def.keys() if field_name in part_ui_element_ids]

        result = copy.deepcopy(self.part_definition)
        if "ui_elements" not in result["layout_settings"]:
            result["layout_settings"]["ui_elements"] = {}
        ui_elements = result["layout_settings"]["ui_elements"]

        for element_id in element_ids:
            try:
                element_definition = UICFinder(self._uic_tree).get_ui_definition_from_selector(
                    table_def[element_id] + self._uic_literals)
                if element_id not in ui_elements:
                    ui_elements[element_id] = element_definition
                else:
                    dicttools.dict_merge(ui_elements[element_id], element_definition)

                if "text" not in ui_elements[element_id]["element_type"]:
                    text = self.dsd.get_field_label(self.view_record_type, element_id)
                    if not text:
                        text = element_id

                    ui_elements[element_id]["element_type"]["text"] = text
                else:
                    ui_elements[element_id]["element_type"]["text"] = self._glossary.get_term(
                        ui_elements[element_id]["element_type"]["text"], 1, auto_plural=False)
            except BaseException as e:
                raise Exception(f"{self.__class__.__name__}.render: Error rendering element '{element_id}' "
                                f"for '{self.view_record_type}': {repr(e)}")

        return result
