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
from mixin.model.eclass import EClass
from mixin.model.epackage import EPackage
from mixin.model.namespace import Namespace
from model import mock_epackage


NAMESPACE: Namespace = Namespace("mock", "http://www.andiasoft.com/model/mixin/mock")
URI: str = "mock://"


def getEClassName(name: str) -> str:
    return URI + name


def createEClass(name: str) -> EClass:
    ePackage: EPackage = mock_epackage.eINSTANCE
    return EClass(ePackage, name)
