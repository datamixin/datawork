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
from typing import TypeVar, Generic, List
from mixin.model.eobject import EObject
from mixin.model.eholder import EHolder
from mixin.model.efeature import EFeature

E = TypeVar("E")


class EList(EHolder, Generic[E]):
    def __init__(self, owner: EObject, feature: EFeature):
        super().__init__(owner, feature)

    def get(self, index: int) -> E:
        pass

    def set(self, index: int, element: E) -> E:
        pass

    def contains(self, object: any) -> bool:
        pass

    def indexOf(self, object: any) -> int:
        pass

    def isEmpty(self) -> bool:
        pass

    def add(self, element: E):
        pass

    def addAt(self, index: int, element: E):
        pass

    def remove(self, element: E):
        pass

    def removeAt(self, index: int) -> E:
        pass

    def clear(self):
        pass

    def addAll(self, source: List[E]):
        pass

    def removeRange(self, start: int, end: int):
        pass

    def insertRange(self, source: List[E], start: int):
        pass

    def move(self, element: E, index: int):
        pass

    def size(self) -> int:
        pass

    def toArray(self) -> List[E]:
        pass

    def repopulate(self, source: List[E]):
        pass
