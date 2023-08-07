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
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.list.list_function import ListFunction


class Contains(ListFunction):

    FUNCTION_NAME = "Contains"

    ITEM = "item"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        list = self.getList(options)
        item = options.get(Contains.ITEM)
        if isinstance(list, pd.Series):
            return list.str.contains(item).fillna(False)
        else:
            if isinstance(item, pd.Series):
                return item.isin(list).fillna(False)
            else:
                return item in list


parameters = [Contains.LIST, Contains.ITEM]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Contains.FUNCTION_NAME, Contains, parameters)
