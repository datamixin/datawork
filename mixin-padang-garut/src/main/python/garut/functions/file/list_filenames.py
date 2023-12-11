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
from pathlib import Path
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry
from garut.parameter import Parameter


class ListFilenames(Function):

    FUNCTION_NAME = "ListFilenames"

    DIRECTORY = "directory"
    PATTERN = "pattern"
    FULLPATH = "fullPath"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        directory = options.get(ListFilenames.DIRECTORY, "./")
        fullPath = options[ListFilenames.FULLPATH]
        path = Path(directory)
        if path.exists():
            pattern = options[ListFilenames.PATTERN]
            files = path.glob(pattern)
            if fullPath:
                return [str(file.resolve()) for file in files]
            else:
                return [file.name for file in files]
        else:
            return Exception("Missing directory {}".format(path))


parameters = [
    ListFilenames.DIRECTORY,
    Parameter(ListFilenames.PATTERN, str, "*"),
    Parameter(ListFilenames.FULLPATH, bool, False),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ListFilenames.FUNCTION_NAME, ListFilenames, parameters)
