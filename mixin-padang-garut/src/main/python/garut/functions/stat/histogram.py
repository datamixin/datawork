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
import pandas as pd
import datetime as datetime
from typing import Dict
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class Histogram(Function):

    FUNCTION_NAME = "Histogram"

    TARGET = "target"
    BINS = "bins"

    VALUES = "values"
    EDGES = "edges"
    NULLS = "nulls"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        list = options[Histogram.TARGET]
        nulls = 0
        if isinstance(list, pd.DataFrame):
            list = list[list.columns[0]]
        if isinstance(list, pd.Series):
            nulls = list[list.isna()].size
            list = list[list.notna()]
        bins = options[Histogram.BINS]

        min = list.min()
        max = list.max()
        if min != max:

            if list.values.dtype.type == np.datetime64:

                # Datetime
                timestamps = np.multiply(list.values.tolist(), 1e-6)
                if self._isList(bins):
                    bins = [value.astype(int) for value in bins]
                    bins.sort()
                histogram = np.histogram(timestamps, bins=bins)
                values = histogram[0]
                edges = histogram[1]
                edges = [self._intToMS(int(value)) for value in edges]
                return {Histogram.VALUES: values, Histogram.EDGES: edges, Histogram.NULLS: nulls}

            else:

                # Expected
                histogram = np.histogram(list, bins=bins)
                values = histogram[0]
                edges = histogram[1]
                return {Histogram.VALUES: values, Histogram.EDGES: edges, Histogram.NULLS: nulls}

        else:

            # Where min == max
            count = len(list)
            values = [count]
            if self._isList(list):
                edges = [max - 0.5, max + 0.5]
            else:
                if list.values.dtype.type == np.datetime64:
                    max = int(max.to_datetime64()) * 1e-6
                    edges = [self._intToMS(int(max) - 1), self._intToMS(int(max) + 1)]
                else:
                    edges = [max - 0.5, max + 0.5]

            return {Histogram.VALUES: values, Histogram.EDGES: edges, Histogram.NULLS: nulls}

    def _isList(self, object: any) -> bool:
        return isinstance(object, list)

    def _intToMS(self, value: int):
        return np.datetime64(value, "ms")

    def _intToDate(self, value: int):
        return datetime.date.fromtimestamp(value)


parameters = [Histogram.TARGET, Parameter(Histogram.BINS, int, 10)]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Histogram.FUNCTION_NAME, Histogram, parameters)
