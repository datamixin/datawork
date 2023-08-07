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
import numpy as np

import pandas as pd
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class ReplaceValue(DatasetFunction):

    FUNCTION_NAME = "ReplaceValue"

    COLUMN = "column"
    TARGET = "target"
    REPLACEMENT = "replacement"
    REGEX = "regex"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset: pd.DataFrame = self.getDataset(options)
        column = options.get(ReplaceValue.COLUMN, None)
        target = options.get(ReplaceValue.TARGET, None)
        replacement = options.get(ReplaceValue.REPLACEMENT, None)
        regex = options.get(ReplaceValue.REGEX, False)
        if dataset[column].dtype.type == str or dataset[column].dtype.type == np.string_:
            result = dataset.copy()
            result[column] = result[column].str.replace(target, replacement, regex=regex)
            return result
        else:
            return dataset.replace({column: target}, {column: replacement}, regex=regex)


parameters = [
    DatasetFunction.DATASET,
    ReplaceValue.COLUMN,
    ReplaceValue.TARGET,
    ReplaceValue.REPLACEMENT,
    Parameter(ReplaceValue.REGEX, bool, False),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ReplaceValue.FUNCTION_NAME, ReplaceValue, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ReplaceValue.FUNCTION_NAME)
