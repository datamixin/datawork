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


class UnionRows(DatasetFunction):

    FUNCTION_NAME = "UnionRows"

    OTHERS = "others"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        others: List[any] = options[UnionRows.OTHERS]
        outputs: List[pd.DataFrame] = []
        outputs.append(dataset)
        for other in others:
            if isinstance(other, Bearer):
                outout = other.getResult()
                outputs.append(outout)
            elif isinstance(other, pd.DataFrame):
                outputs.append(other)
            else:
                return Exception("Unexpected union data type {}".format(type(other)))
        dataFrame = pd.concat(outputs)
        dataFrame.reset_index(inplace=True)
        dataFrame.drop(dataFrame.columns[[0]], axis=1, inplace=True)
        return dataFrame


parameters = [DatasetFunction.DATASET, UnionRows.OTHERS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(UnionRows.FUNCTION_NAME, UnionRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(UnionRows.FUNCTION_NAME)
