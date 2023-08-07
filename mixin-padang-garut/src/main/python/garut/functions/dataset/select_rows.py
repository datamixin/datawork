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
from garut.invocations.invocation import *
from garut.evaluations.evaluation import *
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.contexts.data_frame_context import DataFrameContext
from garut.functions.dataset.dataset_function import DatasetFunction


class SelectRows(DatasetFunction):

    FUNCTION_NAME = "SelectRows"

    CONDITION = "condition"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        where = options[SelectRows.CONDITION]
        condition = Condition(context, where)
        if len(dataset.columns) == 0:
            return dataset
        else:
            result = dataset[condition].reset_index()
            result = result.drop(result.columns[[0]], axis=1)
            return result


class Condition:
    def __init__(self, context: Context, invocation: Invocation) -> None:
        self._context = context
        self._invocation = invocation

    def __call__(self, data: pd.DataFrame):
        context = DataFrameContext(self._context, data)
        return self._invocation.invoke(context)


parameters = [DatasetFunction.DATASET, SelectRows.CONDITION]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SelectRows.FUNCTION_NAME, SelectRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(SelectRows.FUNCTION_NAME)
