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
from typing import List, Dict, Type
from garut.parameter import Parameter
from sqlalchemy.engine.base import Engine
from garut.contexts.context import Context


class Connector:
    def __init__(self, server: str, database: str, credential: Dict[str, any]):
        self._server = server
        self._database = database
        self._credential = credential

    def tables(self) -> List[str]:
        return []

    def query(self, query: str) -> pd.DataFrame:
        return None


class ConnectorModule:
    def __init__(self, name: str, connector: Type[Connector]):
        self._name = name
        self._connector = connector

    @property
    def parameters(self) -> Type[Parameter]:
        return self._parameters

    @property
    def name(self) -> str:
        return self._name

    def create(self, server: str, database: str, credential: Dict[str, any]) -> Connector:
        return self._connector(server, database, credential)


class ConnectorRegistry:
    instance = None

    def __init__(self):
        if ConnectorRegistry.instance != None:
            raise Exception("Use ConnectorRegistry.getInstance()")
        ConnectorRegistry.instance = self
        self._modules: Dict[str, ConnectorModule] = {}

    def getInstance():
        if ConnectorRegistry.instance == None:
            ConnectorRegistry()
        return ConnectorRegistry.instance

    def register(self, name: str, driver: Connector):
        self._modules[name] = ConnectorModule(name, driver)

    def isExists(self, name: str) -> bool:
        return self._modules.get(name, None) is not None

    def get(self, name) -> ConnectorModule:
        module = self._modules.get(name, None)
        if module is None:
            raise Exception("Unknown connector '{}'".format(name))
        return module

    def getNames(self) -> List[str]:
        keys = self._modules.keys()
        return list(keys)

    def list(self) -> List[ConnectorModule]:
        return self._modules.values()
