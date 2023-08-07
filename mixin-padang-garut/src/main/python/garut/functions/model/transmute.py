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
from garut.functions.dataset.dataset_function import DatasetFunction
from garut.functions.function import Function, FunctionModule, FunctionRegistry


class Transmute(Function):

    FUNCTION_NAME = "Transmute"

    OPERATION = "operation"
    OPTIONS = "options"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        operation = self.get(options, Transmute.OPERATION)
        if isinstance(operation, FunctionModule):
            inputs = self.get(options, Transmute.OPTIONS)
            values: Dict[str, any] = {}
            index = 0
            if issubclass(operation.type, DatasetFunction):
                index = 1
            for i in range(len(operation.parameters) - index):
                parameter = operation.parameters[i + index]
                if i < len(inputs):
                    values[parameter.name] = inputs[i]
                else:
                    values[parameter.name] = parameter.defaultValue
            transmutation = Transmutation(operation.name, values)
            return transmutation
        else:
            raise Exception("Expected operation is a function reference")


class Transmutation:
    def __init__(self, operation: str, options: Dict[str, any]) -> None:
        self._operation = operation
        self._options = options

    @property
    def operation(self):
        return self._operation

    @property
    def options(self):
        return self._options


parameters = [Transmute.OPERATION, Transmute.OPTIONS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Transmute.FUNCTION_NAME, Transmute, parameters)
