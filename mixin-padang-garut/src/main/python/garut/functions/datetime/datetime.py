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
import pandas as pd
from typing import Dict
from datetime import datetime
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry
from garut.parameter import Parameter


class Datetime(Function):

    FUNCTION_NAME = "DateTime"
    TIMESTAMP = "timestamp"
    UNIT = "unit"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        timestamp = options.get(Datetime.TIMESTAMP, 0)
        unit = options.get(Datetime.UNIT)
        if isinstance(timestamp, pd.Series):
            if timestamp.dtype.type == np.float32 or timestamp.dtype.type == np.float64:
                return pd.to_datetime(int(timestamp), unit=unit)
            elif timestamp.dtype.type == np.int32 or timestamp.dtype.type == np.int64:
                return pd.to_datetime(timestamp, unit=unit)
            else:
                return Exception("DateTime expecting numeric series argument")
        elif isinstance(timestamp, float):
            return np.datetime64(int(timestamp), unit)
        elif isinstance(timestamp, int):
            return np.datetime64(timestamp, unit)
        elif isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp).timestamp()
            return np.datetime64(int(timestamp), unit)
        else:
            return Exception("DateTime expecting numeric argument")


parameters = [Datetime.TIMESTAMP, Parameter(Datetime.UNIT, str, "ms")]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Datetime.FUNCTION_NAME, Datetime, parameters)
