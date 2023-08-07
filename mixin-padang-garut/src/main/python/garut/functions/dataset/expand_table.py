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
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class ExpandTable(DatasetFunction):

    FUNCTION_NAME = "ExpandTable"

    COLUMN = "column"
    INCLUDES = "includes"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Options
        original = self.getDataset(options)
        column = options[ExpandTable.COLUMN]
        includes = options.get(ExpandTable.INCLUDES, [])
        oldNames = original.columns.tolist()
        index = oldNames.index(column)
        dataset = original.copy()

        # Records
        dataset[column] = dataset[column].apply(lambda x: x.to_dict("records"))
        dataset = dataset.explode(column, ignore_index=True)

        # Columns
        expanded = pd.DataFrame.from_records(dataset.pop(column))
        if len(includes) > 0:
            expanded = expanded[includes]

        # Names
        newNames = expanded.columns.tolist()
        outNames = [column + "_" + str(name) for name in newNames]
        expanded.rename(columns={k: v for (k, v) in zip(newNames, outNames)}, inplace=True)

        # Join
        allNames = oldNames[0:index] + outNames + oldNames[index + 1 :]
        joined = dataset.join(expanded)
        dataFrame = joined[allNames]

        # Types
        return self.forceObjectToString(dataFrame)


parameters = [DatasetFunction.DATASET, ExpandTable.COLUMN]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ExpandTable.FUNCTION_NAME, ExpandTable, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ExpandTable.FUNCTION_NAME)
