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
from garut.functions.function import FunctionRegistry, FunctionModule
from garut.functions.dataset.dataset_function import DatasetFunction


class TransformColumn(DatasetFunction):

    FUNCTION_NAME = "TransformColumn"

    COLUMN = "column"
    TRANFORMATION = "transformation"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        column = options.get(TransformColumn.COLUMN, None)
        result = dataset.copy()
        transformation = options.get(TransformColumn.TRANFORMATION, None)
        if isinstance(transformation, FunctionModule):
            parameters = transformation.parameters
            if len(parameters) > 0:
                parameter = parameters[0].name
                function = transformation.create()
                args: Dict[str, any] = {}
                args[parameter] = result[column]
                result[column] = function.execute(context, args)
                return result
            else:
                return Exception("Transformation function must required at least one parameter")
        else:
            return Exception("Expected transformation function")


parameters = [DatasetFunction.DATASET, TransformColumn.COLUMN, TransformColumn.TRANFORMATION]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(TransformColumn.FUNCTION_NAME, TransformColumn, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(TransformColumn.FUNCTION_NAME)
