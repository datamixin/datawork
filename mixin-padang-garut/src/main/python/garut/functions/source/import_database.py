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
from typing import Dict
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.evaluations.evaluation import EvaluationFactory
from garut.functions.function import Function, FunctionRegistry
from garut.functions.source.database_function import DatabaseFunction


class ImportDatabase(DatabaseFunction):

    FUNCTION_NAME = "ImportDatabase"

    TABLE = "table"
    QUERY = "query"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        connector = self.createConnector(context, options)
        table = self.get(options, ImportDatabase.TABLE)
        query = self.get(options, ImportDatabase.QUERY)
        if table is not None and table != "":
            return connector.query("SELECT * FROM " + table)
        elif query is not None and query != "":
            return connector.query(query)
        else:
            raise Exception("Table or Query must be defined")


parameters = [
    ImportDatabase.SERVER,
    ImportDatabase.DATABASE,
    ImportDatabase.CONNECTOR,
    ImportDatabase.CREDENTIAL,
    Parameter(ImportDatabase.TABLE, str),
    Parameter(ImportDatabase.QUERY, str),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ImportDatabase.FUNCTION_NAME, ImportDatabase, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ImportDatabase.FUNCTION_NAME)
