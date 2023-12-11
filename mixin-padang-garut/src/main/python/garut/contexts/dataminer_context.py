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
from typing import List, Dict
from garut.filestore import Filestore
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.connectors.connector import ConnectorRegistry

factory: FunctionRegistry = FunctionRegistry.getInstance()


class ProjectProvider:
    def isProjectExists(self, id: str) -> bool:
        return False

    def getProject(self, id: str) -> any:
        return None


class DataminerContext(Context):
    def __init__(self, provider: ProjectProvider, filestore: str):
        self._filestore = Filestore(filestore)
        self._provider = provider

    def isFileUntitled(self, name: any) -> bool:
        return self._filestore.untitled(name, None)

    def getFileName(self, key: str) -> bool:
        return self._filestore.name(key)

    def getConnectorNames(self) -> List[str]:
        registry = ConnectorRegistry.getInstance()
        return registry.getNames()

    def getCredential(self, group: str, name: str) -> Dict[str, any]:
        return self._filestore.credential(group, name)

    def isFieldExists(self, name: any, reference: any = None):
        exists = factory.isExists(name)
        if exists is True:
            return True
        else:
            return self._filestore.exists(name, reference)

    def getField(self, name: any, reference: any = None) -> any:
        if factory.isExists(name):
            return factory.get(name)
        else:
            identity = self._filestore.identify(name, reference)
            return self._provider.getProject(identity)

    def getFieldContext(self, name: any, reference: any = None) -> any:
        if self.isFieldExists(name, reference):
            return self
        return None
