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
from garut.functions.function import Function
from garut.connectors.connector import ConnectorRegistry
from garut.evaluations.evaluation import EvaluationFactory
from garut.contexts.dataminer_context import DataminerContext


class DatabaseFunction(Function):

    SERVER = "server"
    DATABASE = "database"
    CONNECTOR = "connector"
    CREDENTIAL = "credential"

    def getCredential(self, context: Context, options: Dict[str, any]):
        ancestor: DataminerContext = context.getAncestor(DataminerContext)
        credentialName = self.get(options, DatabaseFunction.CREDENTIAL)
        object = ancestor.getCredential(Function.CREDENTIAL, credentialName)
        evaluator = EvaluationFactory.getInstance()
        credential = evaluator.evaluate(context, object)
        if isinstance(credential, str):
            raise Exception("Credential: " + credential)
        return credential

    def createConnector(self, context: Context, options: Dict[str, any]):
        server = self.get(options, DatabaseFunction.SERVER)
        database = self.get(options, DatabaseFunction.DATABASE)
        credential = self.getCredential(context, options)
        connectorName = self.get(options, DatabaseFunction.CONNECTOR)
        registry = ConnectorRegistry.getInstance()
        module = registry.get(connectorName)
        return module.create(server, database, credential)
