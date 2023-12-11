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
from typing import Dict, List
import pandas as pd

from garut.contexts.context import Context
from garut.functions.splitter.splitter import Splitter
from garut.functions.function import Function, FunctionRegistry


class SplitByPositions(Function):

    FUNCTION_NAME = "SplitByPositions"

    POSITIONS = "positions"
    TRIM = "trim"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        delimiter = options.get(SplitByPositions.POSITIONS, " ")
        trim = options.get(SplitByPositions.TRIM, True)
        return SplitByPositionsSplitter(delimiter, trim)


class SplitByPositionsSplitter(Splitter):
    def __init__(self, positions: List[int], trim: bool) -> None:
        super().__init__()
        self._positions = positions
        self._trim = trim

    def split(self, input: pd.Series) -> any:
        array: List[pd.Series] = []
        start = 0
        self._positions.append(-1)
        for position in self._positions:
            series = input.str.slice(start, None if position == -1 else position)
            if self._trim:
                series = series.str.strip()
            series.name = input.name + "_" + str(len(array))
            array.append(series)
            start = position
        return pd.concat(array, axis=1)


parameters = [SplitByPositions.POSITIONS, SplitByPositions.TRIM]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SplitByPositions.FUNCTION_NAME, SplitByPositions, parameters)
