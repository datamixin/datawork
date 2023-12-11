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
from typing import Dict
from garut.functions.aggregate.sum import Sum
from garut.functions.aggregate.aggregate import Aggregate
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class PivotRows(DatasetFunction):

    FUNCTION_NAME = "PivotRows"

    ROWS = "rows"
    COLUMNS = "columns"
    VALUES = "values"
    AGGREGATE = "aggregate"
    NONE = "None"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Options
        dataset = self.getDataset(options)
        rows = options.get(PivotRows.ROWS, None)
        columns = options.get(PivotRows.COLUMNS, None)
        values = options.get(PivotRows.VALUES, None)

        # Pivot
        aggregate = options.get(PivotRows.AGGREGATE, Sum.FUNCTION_NAME)
        if aggregate != PivotRows.NONE:
            aggregateType = self._getType(aggregate)
            dataFrame = dataset.pivot_table(index=rows, columns=columns, values=values, aggfunc=aggregateType)
        else:
            dataFrame = dataset.pivot(index=rows, columns=columns, values=values)

        # Index
        if dataFrame.index.name in dataFrame.columns:
            dataFrame.index.name = "row_" + dataFrame.index.name
        dataFrame.reset_index(inplace=True)

        # Types
        return self.forceObjectToString(dataFrame)

    def _getType(self, aggregate: str):
        if aggregate == "":
            aggregate = Sum.FUNCTION_NAME
        module = registry.get(aggregate)
        type: Aggregate = module.type()
        return type.getFunction()


parameters = [
    DatasetFunction.DATASET,
    PivotRows.ROWS,
    PivotRows.COLUMNS,
    PivotRows.VALUES,
    Parameter(PivotRows.AGGREGATE, str, Sum.FUNCTION_NAME),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(PivotRows.FUNCTION_NAME, PivotRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(PivotRows.FUNCTION_NAME)
