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
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class RemoveColumns(DatasetFunction):

    FUNCTION_NAME = "RemoveColumns"

    KEYS = "keys"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        keys = options[RemoveColumns.KEYS]
        result = dataset.drop(columns=keys)
        return result


parameters = [DatasetFunction.DATASET, RemoveColumns.KEYS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(RemoveColumns.FUNCTION_NAME, RemoveColumns, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(RemoveColumns.FUNCTION_NAME)
