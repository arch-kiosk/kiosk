from typing import TYPE_CHECKING

from dsd.dsd3 import DataSetDefinition
from kioskglossary import KioskGlossary
from uic.uictree import UICTree

if TYPE_CHECKING:
    from presentationlayer.kioskview import KioskView
else:
    KioskView = object


class ViewPart:
    def __init__(self, part_definition: dict, dsd: DataSetDefinition, uic_tree: UICTree, uic_literals: list,
                 kiosk_view: KioskView, glossary: KioskGlossary):
        self.part_definition = part_definition
        self.dsd = dsd
        self.view: KioskView = kiosk_view
        self.view_record_type = self.part_definition["record_type"]
        self._uic_tree = uic_tree
        self._uic_literals = uic_literals
        self._glossary:KioskGlossary = glossary

    def render(self):
        raise NotImplementedError()