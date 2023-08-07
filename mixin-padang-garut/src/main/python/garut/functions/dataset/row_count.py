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
from typing import Dict, List
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class RowCount(DatasetFunction):

    FUNCTION_NAME = "RowCount"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        option = self.getDatasetOption(options)
        if isinstance(option, pd.DataFrame):
            return len(option)
        elif isinstance(option, pd.Series):
            return self.createSeries(option, RowCount.length)
        else:
            raise Exception("Unexpected RowCount '{}' option type {}".format(DatasetFunction.DATASET, type(option)))

    def length(value: any) -> int:
        if value is None:
            return "Null value has no length"
        if isinstance(value, Exception):
            raise value
        if isinstance(value, Bearer):
            value = value.getResult()
        return len(value)


parameters = [DatasetFunction.DATASET]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(RowCount.FUNCTION_NAME, RowCount, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(RowCount.FUNCTION_NAME)
