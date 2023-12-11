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
import math
import pandas as pd
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class IsNull(Function):

    FUNCTION_NAME = "IsNull"

    VALUE = "value"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        value = options[IsNull.VALUE]
        if isinstance(value, pd.Series):
            return value.isnull()
        else:
            return value is None or math.isnan(value)


parameters = [IsNull.VALUE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(IsNull.FUNCTION_NAME, IsNull, parameters)
