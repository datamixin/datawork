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
from garut.functions.dataset.dataset_function import DatasetFunction


class ReadCsv(Function):

    FUNCTION_NAME = "ReadCsv"

    PATH = "path"
    DELIMITER = "delimiter"
    FIRST_ROW_HEADER = "firstRowHeader"
    QUOTE_CHARACTER = "quoteCharacter"
    PARSE_DATES = "parseDates"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        path = options.get(ReadCsv.PATH, None)
        if path is None or path == "":
            dataFrame = pd.DataFrame()
        else:
            header = self._getHeader(options)
            dataFrame = pd.read_csv(
                path,
                sep=options.get(ReadCsv.DELIMITER, ","),
                header=header,
                quotechar=options.get(ReadCsv.QUOTE_CHARACTER, '"'),
                parse_dates=options.get(ReadCsv.PARSE_DATES, False),
            )

            # Header if header=None
            if header is None:
                dataFrame.columns = ["Column" + str(index) for index in dataFrame.columns.values]

            # Rubah column ber tipe object menjadi string
            dataFrame = DatasetFunction.forceObjectColumnsToString(dataFrame)
        return dataFrame

    def _getHeader(self, options: Dict[str, any]) -> str:
        firstRowHeader = options.get(ReadCsv.FIRST_ROW_HEADER, True)
        if firstRowHeader:
            return 0
        else:
            return None


parameters = [ReadCsv.PATH, ReadCsv.DELIMITER, ReadCsv.FIRST_ROW_HEADER, ReadCsv.QUOTE_CHARACTER, ReadCsv.PARSE_DATES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ReadCsv.FUNCTION_NAME, ReadCsv, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ReadCsv.FUNCTION_NAME)
