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
from mixin.model.eclass import EClass
from mixin.model.efeature import EFeature
from mixin.model.adapter import AdapterList


class EObject:
    def eClass(self) -> EClass:
        pass

    def eFeatures(self) -> List[EFeature]:
        pass

    def eFeature(self, id: str) -> EFeature:
        pass

    def eGet(self, feature: EFeature) -> any:
        pass

    def eSet(self, feature: EFeature, newValue: any):
        pass

    def eAdapters(self) -> AdapterList:
        pass

    def eContainer(self) -> any:
        pass

    def eContainingFeature(self) -> EFeature:
        pass

    def notify(self, eventType: int, feature: EFeature, oldValue: any, newValue: any, position: int, key: str):
        pass
