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
import pandas as pd
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.text.text_function import TextFunction


class Left(TextFunction):

    FUNCTION_NAME = "Left"
    COUNT = "count"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        text = self.getText(options)
        count = options.get(Left.COUNT, 1)
        if isinstance(text, pd.Series):
            return text.str[:count]
        elif isinstance(text, str):
            return text[:count]
        else:
            return Exception("Cannot get left text from non string {}".format(type(text)))


parameters = [TextFunction.TEXT, Left.COUNT]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Left.FUNCTION_NAME, Left, parameters)
