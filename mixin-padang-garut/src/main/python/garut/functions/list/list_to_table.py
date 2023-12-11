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
from typing import Dict, List
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.list.list_function import ListFunction


class ListToTable(ListFunction):

    FUNCTION_NAME = "ListToTable"

    ELEMENT = "Element"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        list = self.getList(options)

        # Baca semua tipe element
        elementTypes: List[any] = []
        for element in list:
            elementType = type(element)
            if elementType not in elementTypes:
                elementTypes.append(elementType)
        dataFrame = pd.DataFrame(list)

        # Jika hanya ada satu column dan satu tipe
        if len(dataFrame.columns) == 1 and len(elementTypes) == 1:
            dataFrame.rename(columns={0: ListToTable.ELEMENT}, inplace=True)
            if elementTypes[0] == str:
                elementTypes[0] = "string"
            dataFrame[ListToTable.ELEMENT] = dataFrame[ListToTable.ELEMENT].astype(elementTypes[0])

        # Rename column yang masih bernama 0, 1, ... <number>
        for column in dataFrame.columns:
            if type(column) == int:
                dataFrame.rename(columns={column: "Column" + str(column)}, inplace=True)
        return dataFrame


parameters = [ListToTable.LIST]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ListToTable.FUNCTION_NAME, ListToTable, parameters)
