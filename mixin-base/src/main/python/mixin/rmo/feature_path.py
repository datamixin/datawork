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
from mixin.lean import Lean
from mixin.model.eobject import EObject
from mixin.rmo.feature_key import FeatureKey, ListFeatureKey, MapFeatureKey, FeatureKeyUtils


class FeaturePath(Lean):
    def __init__(self, keys: List[FeatureKey]):
        super().__init(FeaturePath)
        self._keys = keys

    @property
    def keys(self) -> List[FeatureKey]:
        return self._keys

    def setKeys(self, keys: List[FeatureKey]):
        self._keys = keys

    def addPath(self, key: FeatureKey):
        self._keys.append(key)

    def toQualified(self) -> str:
        strings: List[str] = []
        for key in self._keys:
            qualified = key.getName()
            strings.append(qualified)
        return "/".join(strings)

    def __str__(self) -> str:
        return self.toQualified()


class FeaturePathUtils:
    @classmethod
    def fromQualified(cls, qualifiedPath: str) -> FeaturePath:

        parts: List[str] = qualifiedPath.split("/")
        keys: List[FeatureKey] = []
        for part in parts:

            if part.index(ListFeatureKey.SEPARATOR) > 0:

                hash: int = part.index(ListFeatureKey.SEPARATOR)
                name: str = part[0, hash]
                index: str = part[hash + 1 :]
                position: int = int(index)
                keys.append(ListFeatureKey(name, position))

            elif part.index(MapFeatureKey.SEPARATOR) > 0:

                hash: int = part.index(MapFeatureKey.SEPARATOR)
                name: str = part[0, hash]
                key: str = part[hash + 1 :]
                keys.append(MapFeatureKey(name, key))

            else:

                keys.append(FeatureKey(part))

        return FeaturePath(keys)

    def fromModel(model: EObject, keys: List[FeatureKey]) -> FeaturePath:
        modelKeys: List[FeatureKey] = FeatureKeyUtils.fromModel(model)
        newKeys: List[FeatureKey] = keys.insert(0, modelKeys)
        return FeaturePath(newKeys)

    def fromModel(model: EObject) -> FeaturePath:
        keys: List[FeatureKey] = FeatureKeyUtils.fromModel(model)
        return FeaturePath(keys)
