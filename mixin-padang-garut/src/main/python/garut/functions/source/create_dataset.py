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
import numpy as np
import pandas as pd
from typing import Dict
from garut.bearer import Bearer
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class CreateDataset(Function):

    FUNCTION_NAME = "CreateDataset"

    RESULT = "result"
    COLUMNS = "columns"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        result = self.get(options, CreateDataset.RESULT)
        columns = self.get(options, CreateDataset.COLUMNS)
        if columns is not None:
            if len(columns) == 0:
                columns = None
        dataFrame = pd.DataFrame()
        if isinstance(result, list) or isinstance(result, np.ndarray):
            serieses: Dict[str, pd.Series] = {}
            for item in result:
                if isinstance(item, pd.Series):
                    serieses[item.name] = item
            if len(serieses) == len(result):
                dataFrame = pd.DataFrame(serieses, columns=columns)
            else:
                dataFrame = pd.DataFrame(result, columns=columns)
        elif isinstance(result, dict):
            dataFrame = pd.DataFrame(result, columns=columns)
        elif isinstance(result, pd.DataFrame):
            dataFrame = result
        elif isinstance(result, Bearer):
            dataFrame = result.getResult()
        else:
            dataFrame = pd.DataFrame({CreateDataset.RESULT: [result]})
        DatasetFunction.forceObjectColumnsToString(dataFrame)
        return dataFrame


parameters = [CreateDataset.RESULT, Parameter(CreateDataset.COLUMNS, list, None)]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(CreateDataset.FUNCTION_NAME, CreateDataset, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(CreateDataset.FUNCTION_NAME)
