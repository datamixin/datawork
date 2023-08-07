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
from typing import Dict, List
from pandas import Series

from garut.contexts.context import Context
from garut.functions.splitter.splitter import Splitter
from garut.functions.function import Function, FunctionRegistry


class SplitByNone(Function):
    FUNCTION_NAME = "SplitByNone"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        return SplitByNoneSplitter()


class SplitByNoneSplitter(Splitter):
    def __init__(self) -> None:
        super().__init__()

    def split(self, input: Series) -> any:
        return input


parameters = []
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(SplitByNone.FUNCTION_NAME, SplitByNone, parameters)
