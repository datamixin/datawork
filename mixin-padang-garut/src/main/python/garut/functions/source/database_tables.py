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
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.evaluations.evaluation import EvaluationFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.source.database_function import DatabaseFunction


class DatabaseTable(DatabaseFunction):

    FUNCTION_NAME = "DatabaseTable"

    TABLE = "table"
    QUERY = "query"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        connector = self.createConnector(context, options)
        return connector.tables()


parameters = [
    DatabaseTable.SERVER,
    DatabaseTable.DATABASE,
    DatabaseTable.CONNECTOR,
    DatabaseTable.CREDENTIAL,
    Parameter(DatabaseTable.TABLE, str),
    Parameter(DatabaseTable.QUERY, str),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(DatabaseTable.FUNCTION_NAME, DatabaseTable, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(DatabaseTable.FUNCTION_NAME)
