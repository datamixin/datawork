#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
import pandas as pd
from typing import Dict
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import Function, FunctionRegistry


class DataForm(Function):

    FUNCTION_NAME = "DataForm"

    DATA = "data"
    TYPES = "types"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Baca data
        data = options.get(DataForm.DATA, {})
        types: Dict[str, str] = options.get(DataForm.TYPES, {})
        dataFrame = pd.DataFrame(data)

        # Rubah column ber tipe object menjadi string
        for column in dataFrame.columns:
            if column in types.keys():
                type = types[column]
                try:
                    dataFrame[column] = dataFrame[column].astype(type)
                except Exception:
                    dataFrame[column] = dataFrame[column].astype("string")
        return dataFrame


parameters = [DataForm.DATA, DataForm.TYPES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(DataForm.FUNCTION_NAME, DataForm, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(DataForm.FUNCTION_NAME)
