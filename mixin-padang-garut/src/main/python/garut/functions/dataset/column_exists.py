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


class ColumnExists(DatasetFunction):

    FUNCTION_NAME = "ColumnExists"

    NAME = "name"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        column = options[ColumnExists.NAME]
        return column in dataset.columns.values


parameters = [DatasetFunction.DATASET, ColumnExists.NAME]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ColumnExists.FUNCTION_NAME, ColumnExists, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ColumnExists.FUNCTION_NAME)
