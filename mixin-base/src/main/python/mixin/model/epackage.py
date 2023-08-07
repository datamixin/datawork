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
from typing import List, Type
from mixin.model.efactory import EFactory
from mixin.model.namespace import Namespace


class EPackage:
    def getNamespaces(self) -> List[Namespace]:
        pass

    def getMainNamespace(self) -> Namespace:
        pass

    def getDefinedEClass(self, eClassName: str) -> Type[any]:
        pass

    def getEClass(self, eClassName: str) -> Type[any]:
        pass

    def getEFactoryInstance(self) -> EFactory:
        pass
