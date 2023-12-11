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
from typing import List
from mixin.model.basic_emap import BasicEMap
from mixin.model.emap import EMap
from mixin.model.ereference import EReference
from model import mock
from mixin.model.eattribute import EAttribute
from mixin.model.basic_eobject import BasicEObject
from model import mock_epackage


class FakeEObject(BasicEObject):

    XCLASSMANE: str = mock.getEClassName("FakeEObject")

    def __init__(self):
        super().__init__(mock.createEClass(FakeEObject.XCLASSMANE), [])


epackage = mock_epackage.eINSTANCE
epackage.register(FakeEObject.XCLASSMANE, FakeEObject)
