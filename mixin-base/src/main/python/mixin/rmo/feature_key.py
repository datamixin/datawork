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
from typing import List, Set
from mixin.lean import Lean
from mixin.model.emap import EMap
from mixin.model.elist import EList
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature


class FeatureKey(Lean):
    def __init__(self, name: str = None):
        super().__init__(FeatureKey)
        self._name = name

    @property
    def name(self) -> str:
        return self._name

    def toQualified(self) -> str:
        return self._name


class ListFeatureKey(FeatureKey):

    SEPARATOR: str = "#"

    def __init__(self, name: str = None, position: int = None):
        super().__init__(ListFeatureKey)
        self._name = name
        self._position = position

    @property
    def position(self) -> int:
        return self._position

    def toQualified(self) -> str:
        return super().toQualified() + ListFeatureKey.SEPARATOR + self._position


class MapFeatureKey(FeatureKey):

    SEPARATOR: str = "$"

    def __init__(self, name: str = None, key: str = None):
        super().__init__(MapFeatureKey)
        self._name = name
        self._key = key

    @property
    def key(self) -> int:
        return self._key

    def toQualified(self) -> str:
        return super().toQualified() + MapFeatureKey.SEPARATOR + self._key


class FeatureKeyUtils:
    @classmethod
    def fromModel(model: EObject) -> List[FeatureKey]:

        keys: List[FeatureKey] = []
        container: EObject = model.eContainer()

        while container != None:

            featureId: str = None
            featureKey: FeatureKey = None
            feature: EFeature = model.eContainingFeature()
            featureId: str = feature.name()
            object: any = container.eGet(feature)

            if isinstance(object, EList):

                # Untuk feature list
                position: int = object.indexOf(model)
                if position != -1:
                    featureKey = ListFeatureKey(featureId, position)
                    model = container

                if featureKey is None:
                    raise ValueError("Fail seek value model while create ListFeatureKey")

            elif isinstance(object, EMap):

                # Untuk Feature Map
                keySet: Set[str] = object.keySet()
                for key in keySet:
                    value: any = object.get(key)
                    if value == model:
                        featureKey = MapFeatureKey(featureId, key)
                        model = container
                        break

                if featureKey is None:
                    raise ValueError("Fail seek feature key while create MapFeatureKey")

            else:

                # Untuk feature biasa
                featureKey = FeatureKey(featureId)
                model = model.eContainer()

            container = container.eContainer()

            keys.insert(0, featureKey)

        return keys
