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
from typing import List
from mixin.model.basic_emap import BasicEMap
from mixin.model.emap import EMap
from mixin.model.ereference import EReference
from model import mock
from mixin.model.eattribute import EAttribute
from mixin.model.basic_eobject import BasicEObject
from model import mock_epackage
from model.fake_eobject import FakeEObject


class MockEObject(BasicEObject):

    XCLASSMANE: str = mock.getEClassName("MockEObject")
    FEATURE_NAME: EAttribute = EAttribute("name", EAttribute.STRING)
    FEATURE_MAP: EReference = EReference("map", any)
    FEATURE_FAKE: EReference = EReference("fake", FakeEObject)

    def __init__(self):
        super().__init__(
            mock.createEClass(MockEObject.XCLASSMANE),
            [MockEObject.FEATURE_NAME, MockEObject.FEATURE_MAP, MockEObject.FEATURE_FAKE],
        )
        self._name: str = None
        self._map: EMap = BasicEMap(self, MockEObject.FEATURE_MAP)
        self._fake: FakeEObject = None

    def getName(self) -> str:
        return self._name

    def setName(self, newName: str):
        oldName = self._name
        self._name = newName
        self.eSetNotify(MockEObject.FEATURE_NAME, oldName, newName)

    def getMap(self) -> BasicEMap:
        return self._map

    def getFake(self) -> FakeEObject:
        return self._fake

    def setFake(self, newFake: FakeEObject):
        oldFake = self._fake
        self._fake = newFake
        self.eSetNotify(MockEObject.FEATURE_FAKE, oldFake, newFake)


epackage = mock_epackage.eINSTANCE
epackage.register(MockEObject.XCLASSMANE, MockEObject)
