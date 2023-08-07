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
from typing import TypeVar, Set, Dict, List, Tuple
from mixin.model.emap import EMap
from mixin.model.eutils import EUtils
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.notification import Notification

V = TypeVar("V")


class BasicEMap(EMap[V]):
    def __init__(self, owner: EObject, feature: EFeature):
        super().__init__(owner, feature)
        self._map: Dict[str, V] = {}

    def containsKey(self, key: str) -> bool:
        return key in self._map

    def get(self, key: str) -> V:
        return self._map.get(key)

    def put(self, key: str, value: V):
        self._deleteFromContainer(value)
        oldValue: V = self._map.get(key)
        self._map[key] = value
        self._owner.notify(Notification.SET, self._feature, oldValue, value, -1, key)

    def putAll(self, source: Dict[str, V]):
        keys: Set[str] = source.keys()
        for key in keys:
            oldElement: V = self._map.get(key)
            value: V = source.get(key)
            self._deleteFromContainer(value)
            self._map.put(key, value)
            self._owner.notify(Notification.SET, self._feature, oldElement, value, -1, key)

    def keySet(self) -> Set[str]:
        return list(self._map.keys())

    def entrySet(self) -> Set[Tuple[str, V]]:
        return list(self._map.items())

    def _deleteFromContainer(self, value: V):
        if isinstance(value, EObject):
            eObject: EObject = value
            EUtils.remove(eObject)

    def remove(self, key: str) -> V:
        if key in self._map:
            value: V = self._map[key]
            del self._map[key]
            self._owner.notify(Notification.REMOVE, self._feature, value, None, -1, key)
            return value
        return None

    def size(self) -> int:
        return len(self._map)

    def clear(self):
        removes: Dict[str, V] = {}
        for key in self._map.keys():
            value: V = self._map.get(key)
            removes[key] = value
        self._map.clear()
        self._owner.notify(Notification.REMOVE_MANY, self._feature, removes, None, -1, None)

    def removeValue(self, value: V) -> bool:
        keys: Set[str] = self._map.keys()
        for key in keys:
            value: V = self._map.get(key)
            if value == value:
                self.remove(key)
                return True
        return False

    def isEmpty(self) -> bool:
        return len(self._map) == 0

    def containsValue(self, value: any) -> bool:
        return value in self._map.values()

    def values(self) -> List[V]:
        return self._map.values()

    def repopulate(self, source: Dict[str, V]):
        cleared: Dict[str, V] = self._doClear()
        keys: Set[str] = source.keys()
        for key in keys:
            value: V = source.get(key)
            self._deleteFromContainer(value)
            self._map[key] = value
        self._owner.notify(Notification.REPLACE_MANY, self._feature, cleared, source, -1, None)

    def __str__(self) -> str:
        return str(self._map)
