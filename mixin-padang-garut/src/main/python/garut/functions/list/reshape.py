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
import numpy as np
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.list.list_function import ListFunction


class Reshape(ListFunction):

    FUNCTION_NAME = "Reshape"

    SHAPE = "shape"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        list = self.getList(options)
        shape = options.get(Reshape.SHAPE)
        return np.reshape(list, shape)


parameters = [Reshape.LIST, Reshape.SHAPE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Reshape.FUNCTION_NAME, Reshape, parameters)
