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
from typing import TypeVar, List
from mixin.model.elist import EList
from mixin.model.eutils import EUtils
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.notification import Notification

E = TypeVar("E")


class BasicEList(EList[E]):
    def __init__(self, owner: EObject, feature: EFeature):
        super().__init__(owner, feature)
        self._elements: List[E] = []

    def isEmpty(self) -> bool:
        return len(self._elements) == 0

    def contains(self, object: any) -> bool:
        return object in self._elements

    def get(self, index: int) -> E:
        if index >= 0 or index < len(self._elements):
            return self._elements[index]
        else:
            return None

    def set(self, index: int, element: E) -> E:
        self._deleteFromContainer(element)
        oldElement: E = self._elements[index]
        self._elements[index] = element
        self._owner.notify(Notification.SET, self._feature, oldElement, element, index, None)
        return element

    def _deleteFromContainer(self, element: E):
        if isinstance(element, EObject):
            eObject: EObject = element
            EUtils.remove(eObject)

    def add(self, element: E):
        self._deleteFromContainer(element)
        self._elements.append(element)
        position: int = len(self._elements) - 1
        self._owner.notify(Notification.ADD, self._feature, None, element, position, None)

    def addAt(self, index: int, element: E):

        self._deleteFromContainer(element)

        if index == len(self._elements):

            # Lakukan penambahan di bagian akhir
            self._elements.append(element)
            self._owner.notify(Notification.ADD, self._feature, None, element, index, None)

        elif index >= 0 and index < len(self._elements):

            # Lakukan penambahan di index tersebut
            self._elements.insert(index, element)
            self._owner.notify(Notification.ADD, self._feature, None, element, index, None)

    def remove(self, element: any):
        index: int = self.indexOf(element)
        if index != -1:
            self.removeAt(index)
        return index

    def removeAt(self, index: int) -> E:
        removed: E = self.get(index)
        if removed is not None:
            del self._elements[index]
            self._owner.notify(Notification.REMOVE, self._feature, removed, None, index, None)
        return removed

    def move(self, element: E, index: int):
        position: int = self.indexOf(element)
        if position != -1:
            removed = self._elements[position]
            del self._elements[position]
            self._elements.insert(index, removed)
            self._owner.notify(Notification.MOVE, self._feature, element, element, index, None)

    def indexOf(self, element: any) -> int:
        if element in self._elements:
            return self._elements.index(element)
        else:
            return -1

    def size(self) -> int:
        return len(self._elements)

    def _doClear(self) -> List[E]:
        elements: List[E] = []
        elements.extend(self._elements)
        self._elements.clear()
        return elements

    def addAll(self, source: List[E]):
        index = len(self._elements)
        for element in source:
            self._deleteFromContainer(element)
        self._elements.extend(source)
        self._owner.notify(Notification.ADD_MANY, self._feature, None, source, index, None)

    def insertRange(self, source: List[E], start: int):
        for element in source:
            self._deleteFromContainer(element)
        self._elements[start:start] = source
        self._owner.notify(Notification.ADD_MANY, self._feature, None, source, start, None)

    def removeRange(self, start: int, end: int):
        removed: List[E] = []
        for i in range(start, end):
            element: E = self._elements[i]
            removed.append(element)
        for remove in removed:
            self._elements.remove(remove)
        self._owner.notify(Notification.REMOVE_MANY, self._feature, removed, None, start, None)

    def clear(self):
        elements: List[E] = self._doClear()
        self._owner.notify(Notification.REMOVE_MANY, self._feature, elements, None, -1, None)

    def repopulate(self, source: List[E]):
        removes: List[E] = self._doClear()
        self._elements.extend(source)
        self._owner.notify(Notification.REPLACE_MANY, self._feature, removes, source, 0, None)

    def __iter__(self):
        return self._elements.__iter__()

    def toArray(self) -> List[any]:
        return self._elements
