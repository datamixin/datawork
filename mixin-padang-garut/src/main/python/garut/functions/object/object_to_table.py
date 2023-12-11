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
from garut.functions.object.object_function import ObjectFunction


class ObjectToTable(ObjectFunction):

    FUNCTION_NAME = "ObjectToTable"

    KEY = "Key"
    VALUE = "Value"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Baca keys dan values untuk membangun data
        keys: List[str] = []
        values: List[any] = []
        object = self.getObject(options)
        valueTypes: List[any] = []
        for key in object.keys():
            keys.append(key)
            value = object.get(key)
            valueType = type(value)
            if valueType not in valueTypes:
                valueTypes.append(valueType)
            values.append(value)
        data = {ObjectToTable.KEY: keys, ObjectToTable.VALUE: values}

        # Buat dataframe dari dari
        dataFrame = pd.DataFrame(data)
        dataFrame[[ObjectToTable.KEY]] = dataFrame[[ObjectToTable.KEY]].astype("string")

        # Kendalikan tipe value jika satu tipe
        if len(valueTypes) == 1:
            try:
                dataFrame[[ObjectToTable.VALUE]] = dataFrame[[ObjectToTable.VALUE]].astype(valueTypes[0])
            except:
                pass
        return dataFrame


parameters = [ObjectToTable.OBJECT]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ObjectToTable.FUNCTION_NAME, ObjectToTable, parameters)
