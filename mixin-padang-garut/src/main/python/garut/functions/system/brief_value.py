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
from typing import Dict
from garut.bearer import Bearer
from garut.briefer import BrieferCatalog
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry
from dataminer_pb2 import *


class BriefValue(Function):

    FUNCTION_NAME = "BriefValue"

    VALUE = "value"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        value = options[BriefValue.VALUE]
        if isinstance(value, Bearer):
            value = value.getResult()
        if isinstance(value, Exception):
            return value
        catalog = BrieferCatalog.getInstance()
        reader = catalog.get(value)
        brief = reader.read(value)
        return brief


parameters = [BriefValue.VALUE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(BriefValue.FUNCTION_NAME, BriefValue, parameters)
