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
from garut.contexts.context import Context
from garut.contexts.dataminer_context import DataminerContext
from garut.functions.function import Function, FunctionRegistry


class DatabaseConnectors(Function):

    FUNCTION_NAME = "DatabaseConnectors"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        ancestor: DataminerContext = context.getAncestor(DataminerContext)
        if ancestor is not None:
            return ancestor.getConnectorNames()
        else:
            return Exception("DatabaseConnectors must be execute under DataminerContext")


parameters = []
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(DatabaseConnectors.FUNCTION_NAME, DatabaseConnectors, parameters)
