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
import numpy as np
from typing import Dict, List
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class SortRows(DatasetFunction):

    FUNCTION_NAME = "SortRows"

    ORDERS = "orders"
    COLUMN = "column"
    ASCENDING = "ascending"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        if len(dataset.index) == 0:
            return dataset
        orders: List[Dict[str, any]] = options[SortRows.ORDERS]
        columns: List[str] = []
        ascendings: List[any] = []
        for order in orders:
            column = order[SortRows.COLUMN]
            columns.append(column)
            ascending = order[SortRows.ASCENDING]
            ascendings.append(ascending)
        result = dataset.sort_values(by=columns, ascending=ascendings)
        return result


parameters = [DatasetFunction.DATASET, SortRows.ORDERS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SortRows.FUNCTION_NAME, SortRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(SortRows.FUNCTION_NAME)
