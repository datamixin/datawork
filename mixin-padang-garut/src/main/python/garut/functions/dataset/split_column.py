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
from garut.contexts.context import Context
from garut.functions.splitter.split_by_none import SplitByNone
from garut.functions.splitter.splitter import Splitter
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class SplitColumn(DatasetFunction):

    FUNCTION_NAME = "SplitColumn"

    COLUMN = "column"
    SPLITTER = "splitter"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Options
        dataset = self.getDataset(options)
        column = options.get(SplitColumn.COLUMN, None)
        splitter: Splitter = options.get(SplitColumn.SPLITTER, SplitByNone())

        # Initial
        columns: List = dataset.columns.values.tolist()
        index = columns.index(column)
        result = dataset.copy()

        # Split
        split: pd.DataFrame = splitter.split(result[column])
        newColumns = split.columns.values.tolist()
        result = pd.concat([result, split], axis=1)
        result.drop(columns=[column], inplace=True)
        columns.remove(column)

        # Position
        columns[index:index] = newColumns
        return result[columns]


parameters = [DatasetFunction.DATASET, SplitColumn.COLUMN, SplitColumn.SPLITTER]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SplitColumn.FUNCTION_NAME, SplitColumn, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(SplitColumn.FUNCTION_NAME)
