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
from garut.instruction import InstructionFactory
from garut.invocations.invocation import Invocation
from garut.functions.function import FunctionRegistry
from garut.contexts.data_frame_context import DataFrameContext
from garut.functions.dataset.dataset_function import DatasetFunction


class SelectColumns(DatasetFunction):

    FUNCTION_NAME = "SelectColumns"

    VALUES = "values"
    EXPRESSION = "expression"
    ALIAS = "alias"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        mapper = SelectMapper(context, options)
        result = mapper(dataset)
        return result


class SelectMapper:
    def __init__(self, context: Context, options: Dict[str, any]):
        self._context = context
        self._options = options

    def __call__(self, input: pd.DataFrame):
        context = DataFrameContext(self._context, input)
        values: List[any] = self._options[SelectColumns.VALUES]
        data: List[any] = []
        headers: List[str] = []
        for value in values:

            # Value string berarti nama column
            if isinstance(value, str):
                alias: str = value
                data.append(input[alias])
                headers.append(alias)

            # Value selain string berarti alias
            else:
                expression: Invocation = value[SelectColumns.EXPRESSION]
                alias: str = value[SelectColumns.ALIAS]
                vector = expression.invoke(context)
                series = pd.Series(vector)
                data.append(series)
                headers.append(alias)

        result = pd.concat(data, axis=1, keys=headers)
        return result


parameters = [DatasetFunction.DATASET, SelectColumns.VALUES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SelectColumns.FUNCTION_NAME, SelectColumns, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(SelectColumns.FUNCTION_NAME)
