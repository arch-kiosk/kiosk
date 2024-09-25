import copy
import logging
from typing import Dict, Tuple

import dicttools
from uic.uicfinder import UICFinder
from presentationlayer.viewpart import ViewPart


class ViewPartSheet(ViewPart):
    def get_elements_to_render(self, start_dsd_fields: [], start_layout: Dict) -> Dict[str, Tuple[Dict, Dict]]:
        """
        returns all elements in the layout (and its sub layouts) that match a dsd field
        :param start_dsd_fields: the names of the dsd fields
        :param start_layout: a UISchema layout structure
        :return: dictionary with dsd field name as key and tuple as value pointing to
                - the layout in the layout structure element to which the element belongs
                - the element in the layout structure
        """
        elements_to_render = {}

        def _r_get_elements_to_render(dsd_fields: [], layout: dict):
            if "ui_elements" in layout:
                for element_id, element in layout["ui_elements"].items():
                    try:
                        if element_id in dsd_fields:
                            elements_to_render[element_id] = (layout, element)
                        else:
                            if element["element_type"]["name"] == "layout":
                                _r_get_elements_to_render(dsd_fields, element["element_type"])
                    except KeyError:
                        pass

        _r_get_elements_to_render(start_dsd_fields, start_layout)
        return elements_to_render

    def render(self):
        part_definition = copy.deepcopy(self.part_definition)
        table_def = self.dsd.get_table_definition(self.view_record_type)
        dsd_fields_to_render = self.dsd.omit_fields_by_datatype(self.view_record_type,
                                                                [field_name for field_name in table_def.keys()], "tz")

        elements_to_render: dict = self.get_elements_to_render(dsd_fields_to_render,
                                                               part_definition) if dsd_fields_to_render else {}
        if "ui_elements" not in part_definition:
            part_definition["ui_elements"] = {}

        if "fields_selection" in part_definition and part_definition["fields_selection"] == "dsd":
            element_ids_to_render = elements_to_render.keys()
            additional_element_ids = [field_name for field_name in dsd_fields_to_render if
                                      field_name not in element_ids_to_render]
            for additional_element_id in additional_element_ids:
                part_definition["ui_elements"][additional_element_id] = {}
                elements_to_render[additional_element_id] = (part_definition,
                                                             part_definition["ui_elements"][additional_element_id])
        for element_id, layout_and_element in elements_to_render.items():
            try:
                layout = layout_and_element[0]
                element = layout_and_element[1]
                orchestration_strategy = layout["layout_settings"]["orchestration_strategy"]

                element_definition = UICFinder(self._uic_tree).get_ui_definition_from_selector(
                    table_def[element_id] +
                    [f"dsd('{self.view_record_type}','{element_id}')",
                     f"orchestration_strategy:{orchestration_strategy}"] +
                    self._uic_literals)

                dicttools.dict_merge(element_definition, element)
                dicttools.dict_merge(element, element_definition)

                if "element_type" not in element:
                    logging.info(f"Element type for element {element_id} "
                                    f"not set by any uic rule or the presentation layer definition.")
                    continue

                if "value" not in element["element_type"]:
                    element["element_type"]["value"] = f"#({self.view_record_type}/{element_id})"

                if "text" not in element["element_type"]:
                    text = self.dsd.get_field_label(self.view_record_type, element_id)
                    if not text:
                        text = element_id.replace("_", " ")

                    element["element_type"]["text"] = text

            except BaseException as e:
                raise Exception(f"{self.__class__.__name__}.render: Error rendering element '{element_id}' "
                                f"for '{self.view_record_type}': {repr(e)}")

        return part_definition

    # This can go. I just keep it for a bit to look at it should I run into odd behaviour. After Kiosk 1.6 this can
    # definitely be deleted.
    def old_render(self):
        table_def = self.dsd.get_table_definition(self.view_record_type)
        if "ui_elements" in self.part_definition:
            part_ui_elements = self.part_definition["ui_elements"]
        else:
            part_ui_elements = {}

        part_ui_element_ids = list(part_ui_elements.keys())
        if "fields_selection" in self.part_definition and self.part_definition["fields_selection"] == "dsd":
            element_ids = [field_name for field_name in table_def.keys()]
        else:
            element_ids = [field_name for field_name in table_def.keys() if field_name in part_ui_element_ids]

        result = copy.deepcopy(self.part_definition)
        if "ui_elements" not in result:
            result["ui_elements"] = {}

        ui_elements = result["ui_elements"]

        for element_id in element_ids:
            try:
                element_definition = UICFinder(self._uic_tree).get_ui_definition_from_selector(
                    table_def[element_id] + [f"dsd('{self.view_record_type}','{element_id}')"] + self._uic_literals)
                if element_id not in ui_elements:
                    ui_elements[element_id] = element_definition
                else:
                    dicttools.dict_merge(element_definition, ui_elements[element_id])
                    ui_elements[element_id] = element_definition

                if "value" not in ui_elements[element_id]["element_type"]:
                    ui_elements[element_id]["element_type"]["value"] = f"#({self.view_record_type}/{element_id})"

                if "text" not in ui_elements[element_id]["element_type"]:
                    text = self.dsd.get_field_label(self.view_record_type, element_id)
                    if not text:
                        text = element_id.replace("_", " ")

                    ui_elements[element_id]["element_type"]["text"] = text
                # else:
                #     ui_elements[element_id]["element_type"]["text"] = self._glossary.get_term(
                #         ui_elements[element_id]["element_type"]["text"], 1, auto_plural=False)

            except BaseException as e:
                raise Exception(f"{self.__class__.__name__}.render: Error rendering element '{element_id}' "
                                f"for '{self.view_record_type}': {repr(e)}")

        return result
