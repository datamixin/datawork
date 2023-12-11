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
from typing import Dict
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class ReadExcel(Function):

    FUNCTION_NAME = "ReadExcel"

    PATH = "path"
    SHEET = "sheet"
    HEADER = "header"
    PARSE_DATES = "parserDates"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        path = options.get(ReadExcel.PATH, None)
        if path is None or path == "":
            dataFrame = pd.DataFrame()
        else:
            dataFrame = pd.read_excel(
                path,
                sheet_name=options.get(ReadExcel.SHEET, 0),
                header=options.get(ReadExcel.HEADER, None),
                parse_dates=options.get(ReadExcel.PARSE_DATES, False),
            )

            # Rubah column ber tipe object menjadi string
            dataFrame = DatasetFunction.forceObjectColumnsToString(dataFrame)
        return dataFrame


parameters = [ReadExcel.PATH, ReadExcel.SHEET, ReadExcel.HEADER, ReadExcel.PARSE_DATES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ReadExcel.FUNCTION_NAME, ReadExcel, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ReadExcel.FUNCTION_NAME)
