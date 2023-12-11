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
import pandas as pd
from typing import Dict, List
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.list.list_function import ListFunction


class Distinct(ListFunction):

    FUNCTION_NAME = "Distinct"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        array = self.getList(options)
        if isinstance(array, pd.Series):
            return list(array.unique())
        else:
            if isinstance(array, list):
                series = pd.Series(list)
                return list(series.unique())
            else:
                raise Exception("Unexpected list type '{}'".format(type(array).__name__))


parameters = [Distinct.LIST]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Distinct.FUNCTION_NAME, Distinct, parameters)
