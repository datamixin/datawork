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
import numbers as nb
from typing import Dict
from garut.converter import Converter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry
from garut.functions.text.text_function import TextFunction


class TypeName(Function):

    FUNCTION_NAME = "TypeName"
    VALUE = "value"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        value = options[TypeName.VALUE]
        if isinstance(value, pd.Series):

            def getTypeName(value: any) -> str:
                if value is None:
                    return Converter.NULL
                elif isinstance(value, Exception):
                    return Converter.ERROR
                elif isinstance(value, bool):
                    return Converter.BOOLEAN
                elif isinstance(value, nb.Number):
                    return Converter.NUMBER
                elif isinstance(value, str):
                    return Converter.STRING
                elif isinstance(value, list):
                    return Converter.LIST
                else:
                    return Converter.OBJECT

            return value.apply(getTypeName)
        elif isinstance(value, str):
            return type(value).__name__
        else:
            return Exception("Cannot get type name from {}".format(value))


parameters = [TypeName.VALUE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(TypeName.FUNCTION_NAME, TypeName, parameters)
