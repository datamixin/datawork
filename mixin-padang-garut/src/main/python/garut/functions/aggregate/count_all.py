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
from garut.contexts.group_by_context import GroupByContext
from garut.contexts.data_frame_context import DataFrameContext
from garut.functions.aggregate.aggregate import Aggregate


class CountAll(Aggregate):

    FUNCTION_NAME = "CountAll"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        if isinstance(context, GroupByContext):
            return context.getRowCount()
        elif isinstance(context, DataFrameContext):
            return context.getRowCount()
        return 0

    def getFunction(self) -> any:
        raise "count"


registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(CountAll.FUNCTION_NAME, CountAll, [])
