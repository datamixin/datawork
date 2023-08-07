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
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.group_rows import GroupRows
from garut.functions.dataset.dataset_function import DatasetFunction


class DistinctRows(DatasetFunction):

    FUNCTION_NAME = "DistinctRows"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset: pd.DataFrame = self.getDataset(options)
        keys = options[GroupRows.KEYS]
        groupby = dataset.groupby(keys)
        result = groupby.size().reset_index()[keys]
        result = self.forceObjectToString(result)
        return result


parameters = [DatasetFunction.DATASET, GroupRows.KEYS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(DistinctRows.FUNCTION_NAME, DistinctRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(DistinctRows.FUNCTION_NAME)
