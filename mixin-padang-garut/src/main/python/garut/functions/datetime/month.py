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
from garut.functions.datetime.datetime_function import DatetimeFunction
from garut.functions.function import FunctionRegistry


class Month(DatetimeFunction):

    FUNCTION_NAME = "Month"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        datetime: pd.Series = self.getDatetime(options)
        return datetime.dt.month


parameters = [DatetimeFunction.DATETIME]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Month.FUNCTION_NAME, Month, parameters)
