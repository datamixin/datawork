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

from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class And(Function):

    FUNCTION_NAME = "And"

    VALUES = "values"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        values = options[And.VALUES]
        if len(values) == 0:
            return Exception("Required at least one logical value")
        value = values[0]
        for index in range(len(values) - 1):
            element = values[index + 1]
            value = np.logical_and(value, element)
        return value


parameters = [And.VALUES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(And.FUNCTION_NAME, And, parameters)
