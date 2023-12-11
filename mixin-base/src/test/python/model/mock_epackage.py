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
from typing import Dict, List, Type
from mixin.model.efactory import EFactory
from mixin.model.epackage import EPackage
from mixin.model.namespace import Namespace
from model import mock
from model import mock_efactory


class MockEPackage(EPackage):
    def __init__(self):
        self._map: Dict[str, any] = {}

    def register(self, name: str, eClass: any):
        self._map[name] = eClass

    def getNamespaces(self) -> List[Namespace]:
        return [mock.NAMESPACE]

    def getMainNamespace(self) -> Namespace:
        return mock.NAMESPACE

    def getDefinedEClass(self, eClassName: str) -> Type[any]:
        return self._map.get(eClassName)

    def getEClass(self, eClassName: str) -> Type[any]:
        return self.getDefinedEClass(eClassName)

    def getEFactoryInstance(self) -> EFactory:
        return mock_efactory.eINSTANCE


eINSTANCE = MockEPackage()
