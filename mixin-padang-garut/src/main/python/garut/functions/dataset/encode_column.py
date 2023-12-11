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
from garut.functions.encoder.encoder import Encoder
from garut.functions.dataset.dataset_function import DatasetFunction


class EncodeColumn(DatasetFunction):

    FUNCTION_NAME = "EncodeColumn"

    COLUMN = "column"
    ENCODER = "encoder"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        column: str = self.get(options, EncodeColumn.COLUMN)
        encoder: Encoder = self.get(options, EncodeColumn.ENCODER)
        result = dataset.copy()
        result[column] = encoder.encode(dataset[column])
        return result


parameters = [DatasetFunction.DATASET, EncodeColumn.COLUMN, EncodeColumn.ENCODER]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(EncodeColumn.FUNCTION_NAME, EncodeColumn, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(EncodeColumn.FUNCTION_NAME)
