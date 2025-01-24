import logging
from xml.dom.minidom import getDOMImplementation, parse, parseString, Document, Element


class KioskSVG:
    empty_svg = """<?xml version="1.0" encoding="iso-8859-1"?>
                    <svg version="1.1" id="parent_svg" xmlns="http://www.w3.org/2000/svg" 
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="{}px" height="{}px">
                    </svg>"""

    def __init__(self):
        self.path_and_filename = ""
        self.src_svg: Document = None
        self._attributes = {}

    @property
    def width(self) -> str:
        if "width" in self._attributes:
            return self._attributes["width"]
        else:
            return ""

    @property
    def height(self) -> str:
        if "height" in self._attributes:
            return self._attributes["height"]
        else:
            return ""

    def _read_attributes(self):
        width = -1
        height = -1
        self._attributes = {}
        if self.src_svg:
            try:
                svg_tag = self.src_svg.getElementsByTagName("svg")[0]
                width = svg_tag.attributes["width"].value
                height = svg_tag.attributes["height"].value
            except BaseException as e:
                logging.info(f"{self.__class__.__name__}._read_attributes: {repr(e)}")
                return False

        if width:
            if width != -1:
                self._attributes["width"] = width
            if height != -1:
                self._attributes["height"] = height

        return True

    def open(self, path_and_filename: str):
        if self.src_svg:
            self.close()
        self.path_and_filename = path_and_filename
        self.src_svg = parse(self.path_and_filename)
        self._read_attributes()
        return True

    def set_dimensions(self, width: int, height: int):
        if self.src_svg:
            src_svg_tag: Element = self.src_svg.getElementsByTagName("svg")[0]
            if src_svg_tag:
                doc: Document = parseString(self.empty_svg.format(str(width), str(height)))
                if src_svg_tag.hasAttribute("id") and \
                        src_svg_tag.getAttribute("id") == "parent_svg":
                    # this is an svg we have already embedded, so we need the inner svg to embed it afresh:
                    embedded_tag = src_svg_tag.getElementsByTagName("svg")[0]
                else:
                    embedded_tag = self.src_svg.getElementsByTagName("svg")[0]

                if embedded_tag.hasAttribute("height"):
                    embedded_tag.setAttribute("height", str(height) + "px")
                if embedded_tag.hasAttribute("width"):
                    embedded_tag.setAttribute("width", str(width) + "px")

                parent_tag = doc.getElementsByTagName("svg")[0]
                parent_tag.appendChild(embedded_tag)
                self.src_svg = doc
                if self._read_attributes():
                    return True

        return False

    def save(self, path_and_filename: str):
        if self.src_svg:
            with open(path_and_filename, "w", encoding='utf8') as dst_file:
                self.src_svg.writexml(dst_file)
            return True
        return False

    def close(self):
        src_svg = None
        self.path_and_filename = ""
