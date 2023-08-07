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
from typing import Callable, List, Type
from mixin.lean import Lean
from mixin.rmo.feature_key import FeatureKey
from mixin.rmo.rectification import Rectification


class Supervisor:
    def getParent(self):
        pass

    def indexOf(self, outset: any) -> int:
        pass

    def getQualifiedPath(self) -> str:
        pass

    def getFeatureKeys(self) -> List[FeatureKey]:
        pass

    def submitRectification(self, rectification: Rectification):
        pass

    def submitIndication(self, key: str, values: List[Lean]):
        pass

    def setPreparedObject(self, preparedClass: Type, p: any):
        pass

    def getPrepareObject(self, preparedClass: Type):
        pass

    def getCapability(self, capabilityClass: Type):
        pass

    def applyDescendants(self, descendantClass: Type, consumer: Callable[[any], None]):
        pass

    def getFirstDescendant(self, descendantClass: Type, evaluator: Callable[[any], bool]):
        pass

    def getDescendants(self, descendantClass: Type, evaluator: Callable[[any], bool]):
        pass

    def applyFirstDescendant(
        self, descendantClass: Type, evaluator: Callable[[any], bool], consumer: Callable[[any], None]
    ):
        pass
