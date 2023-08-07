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
from typing import TypeVar, Generic, Set, Dict, List, Tuple
from mixin.model.eholder import EHolder
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature

V = TypeVar("V")


class EMap(EHolder, Generic[V]):
    def __init__(self, owner: EObject, feature: EFeature):
        super().__init__(owner, feature)

    def containsKey(self, key: str) -> bool:
        pass

    def get(self, key: str) -> V:
        pass

    def put(self, key: str, value: V):
        pass

    def putAll(self, source: Dict[str, V]):
        pass

    def keySet(self) -> Set[str]:
        pass

    def entrySet(self) -> Set[Tuple[str, V]]:
        pass

    def _deleteFromContainer(self, value: V):
        pass

    def remove(self, key: str) -> V:
        pass

    def size(self) -> int:
        pass

    def clear(self):
        pass

    def removeValue(self, value: V) -> bool:
        pass

    def isEmpty(self) -> bool:
        pass

    def containsValue(self, value: any) -> bool:
        pass

    def values(self) -> List[V]:
        pass

    def repopulate(self, source: Dict[str, V]):
        pass
