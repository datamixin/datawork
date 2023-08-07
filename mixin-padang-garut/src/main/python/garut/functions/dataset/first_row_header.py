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
from typing import Dict
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class FirstRowHeader(DatasetFunction):

    FUNCTION_NAME = "FirstRowHeader"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        dataFrame = dataset.copy()
        dataFrame.columns = dataFrame.iloc[0]
        dataFrame = dataFrame.drop(dataFrame.index[0])
        dataFrame.reset_index(inplace=True)
        dataFrame.drop(dataFrame.columns[[0]], axis=1, inplace=True)
        for index in range(len(dataFrame.columns)):
            name = dataFrame.columns.values[index]
            if not isinstance(name, str):
                dataFrame.columns.values[index] = str(name)
        return dataFrame


parameters = [DatasetFunction.DATASET]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(FirstRowHeader.FUNCTION_NAME, FirstRowHeader, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(FirstRowHeader.FUNCTION_NAME)
