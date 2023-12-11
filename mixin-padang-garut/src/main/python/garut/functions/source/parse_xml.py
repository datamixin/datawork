#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.#
import pandas as pd
from lxml import etree
from typing import Dict, List
from lxml.etree import ElementBase
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction

TEXT = "text"
NSCODE = "}"


"""
Convert an lxml.etree node tree into a ElementMap dict.
"""


class ElementMap(dict):
    def __init__(self, node: ElementBase) -> None:
        self._populate(node)

    def _populate(self, node: ElementBase):

        # Status populated
        populated = True

        # Read attibutes
        for key in node.attrib:
            self[key] = node.attrib[key]

        # Read child element
        for i in range(len(node)):

            # Remove namespace prefix
            element: ElementBase = node[i]
            key = element.tag.split(NSCODE)[1] if NSCODE in element.tag else element.tag

            # Process element as tree element if the inner XML contains non-whitespace content
            if len(node.attrib) == 0:
                if element.text and element.text.strip():
                    value = element.text.strip()
            else:
                value = ElementMap(element)

            if key in self:

                # Key already exists
                current = self[key]
                if isinstance(current, list):

                    # Current already an list
                    current.append(value)

                else:

                    # Create new list
                    self[key] = [current, value]
            else:

                # New key
                self[key] = value

        # Read read if any
        if node.text and node.text.strip():
            text = node.text.strip()
            if len(self) == 0:
                return text
            else:
                self[TEXT] = text


class ParseXml(Function):

    FUNCTION_NAME = "ParseXml"

    PATH = "path"
    XPATH = "xpath"
    ELEMENTS = "elements"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        path = options.get(ParseXml.PATH, None)
        xpath = options.get(ParseXml.XPATH, "./*")
        if type(path) == str:
            if path is None or path == "":
                return pd.DataFrame()
            else:
                return self.parse(path, xpath)

        else:
            return Exception("Invalid path type " + type(path).__name__)

    def parse(self, path: str, xpath: str) -> pd.DataFrame:

        # Read rows from xpath
        tree: ElementBase = None
        if len(path) > 0 and path[0] == "<":
            tree = etree.fromstring(path)
        else:
            tree = etree.parse(path)
        elements: List[ElementBase] = tree.xpath(xpath)
        if isinstance(elements, list):

            # Generation
            count = len(elements)
            dicts = [
                {
                    **e.attrib,
                    **({e.tag: e.text.strip()} if e.text and not e.text.isspace() else {}),
                    **ElementMap(e),
                }
                for e in elements[:count]
            ]

            # Normalization
            keys = list(dict.fromkeys([k for d in dicts for k in d.keys()]))
            dicts = [{key: d[key] if key in d.keys() else None for key in keys} for d in dicts]
            dataFrame = pd.DataFrame.from_records(dicts)
            dataFrame = DatasetFunction.forceObjectColumnsToString(dataFrame)
        else:
            return Exception("Expected return list from xpath {xpath}")

        return dataFrame


parameters = [ParseXml.PATH, ParseXml.XPATH]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ParseXml.FUNCTION_NAME, ParseXml, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ParseXml.FUNCTION_NAME)
