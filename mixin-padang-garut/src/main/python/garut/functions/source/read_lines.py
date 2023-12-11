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
import re
import pandas as pd
from typing import Dict
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class ReadLines(Function):

    FUNCTION_NAME = "ReadLines"

    PATH = "path"
    SEPARATOR = "separator"
    LINES = "lines"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        path = options.get(ReadLines.PATH, None)
        separator = options.get(ReadLines.SEPARATOR, None)
        if path is None or path == "":
            dataFrame = pd.DataFrame()
        else:
            with open(path, mode="r", encoding="utf8") as file:
                content = file.read()
                lines = re.split(separator, content)
                dataFrame = pd.DataFrame({ReadLines.LINES: lines})

            dataFrame = DatasetFunction.forceObjectColumnsToString(dataFrame)
        return dataFrame


parameters = [ReadLines.PATH, ReadLines.SEPARATOR]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ReadLines.FUNCTION_NAME, ReadLines, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ReadLines.FUNCTION_NAME)
