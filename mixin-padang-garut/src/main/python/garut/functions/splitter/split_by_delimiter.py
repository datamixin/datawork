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
import re
import pandas as pd
from typing import Dict, List

from garut.contexts.context import Context
from garut.functions.splitter.splitter import Splitter
from garut.functions.function import Function, FunctionRegistry


class SplitByDelimiter(Function):

    FUNCTION_NAME = "SplitByDelimiter"

    DELIMITER = "delimiter"
    REGEX = "regex"
    LIMIT = "limit"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        delimiter = options.get(SplitByDelimiter.DELIMITER, " ")
        regex = options.get(SplitByDelimiter.REGEX, False)
        limit = options.get(SplitByDelimiter.LIMIT, -1)
        return SplitByDelimiterSplitter(delimiter, regex, limit)


class SplitByDelimiterSplitter(Splitter):
    def __init__(self, delimiter: str, regex: bool, limit: int) -> None:
        super().__init__()
        self._delimiter = delimiter
        self._regex = regex
        self._limit = limit

    def split(self, input: pd.Series) -> any:
        result: pd.DataFrame = None
        if self._regex is True:
            sep = re.compile(self._delimiter)
            result = input.str.split(sep.pattern, n=self._limit, expand=True)
        else:
            result = input.str.split(self._delimiter, n=self._limit, expand=True)
        columns: List[str] = []
        for column in result.columns:
            columns.append(input.name + "_" + str(len(columns)))
        result.columns = columns
        return result


parameters = [SplitByDelimiter.DELIMITER, SplitByDelimiter.REGEX, SplitByDelimiter.LIMIT]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SplitByDelimiter.FUNCTION_NAME, SplitByDelimiter, parameters)
