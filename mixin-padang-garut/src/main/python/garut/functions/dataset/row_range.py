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
from typing import Dict, List
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class RowRange(DatasetFunction):

    FUNCTION_NAME = "RowRange"

    ROW_START = "rowStart"
    ROW_END = "rowEnd"
    COLUMN_START = "columnStart"
    COLUMN_END = "columnEnd"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        rowStart = options[RowRange.ROW_START]
        rowEnd = options[RowRange.ROW_END]
        if rowEnd == -1:
            rowEnd = len(dataset.index)
        columnStart = options[RowRange.COLUMN_START]
        columnEnd = options[RowRange.COLUMN_END]
        if columnEnd == -1:
            columnEnd = len(dataset.columns)
        subset = dataset.iloc[rowStart:rowEnd, columnStart:columnEnd]
        startAtZero = subset.reset_index(drop=True)
        return startAtZero.set_index(startAtZero.index + rowStart)


parameters = [DatasetFunction.DATASET, RowRange.ROW_START, RowRange.ROW_END, RowRange.COLUMN_START, RowRange.COLUMN_END]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(RowRange.FUNCTION_NAME, RowRange, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(RowRange.FUNCTION_NAME)
