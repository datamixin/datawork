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


class ChangeTypes(DatasetFunction):

    FUNCTION_NAME = "ChangeTypes"

    TYPE_MAP = "typeMap"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        typeMap: Dict[str, str] = options[ChangeTypes.TYPE_MAP]
        dataset = dataset.astype(typeMap, errors="ignore")
        dataset = dataset.infer_objects()
        return dataset


parameters = [DatasetFunction.DATASET, ChangeTypes.TYPE_MAP]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ChangeTypes.FUNCTION_NAME, ChangeTypes, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ChangeTypes.FUNCTION_NAME)
