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
from mixin.model.epackage import EPackage


class EClass:
    def __init__(self, ePackage: EPackage, name: str):
        self._ePackage = ePackage
        self._name = name

    def getName(self) -> str:
        return self._name

    def getFullName(self) -> str:
        namespaces = self._ePackage.getNamespaces()
        namespace = namespaces[0]
        name = namespace.getName()
        uri = namespace.getURI()
        length = name.length()
        return "{} #{}".format(uri, self._name[length + 1 :])

    def getEPackage(self) -> EPackage:
        return self._ePackage

    def __str__(self) -> str:
        return self._name
