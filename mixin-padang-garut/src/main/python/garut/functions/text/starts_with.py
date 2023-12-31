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


class StartsWith(TextFunction):

    FUNCTION_NAME = "StartsWith"
    CHARS = "chars"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        text = self.getText(options)
        chars = options.get(StartsWith.CHARS, "")
        if isinstance(text, pd.Series):
            return text.str.startswith(chars).fillna(False)
        elif isinstance(text, str):
            return text.startswith(chars)
        else:
            return Exception("Cannot get starts with from non string {}".format(type(text)))


parameters = [TextFunction.TEXT, StartsWith.CHARS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(StartsWith.FUNCTION_NAME, StartsWith, parameters)
