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
from mixin.model.emap import EMap
from mixin.model.elist import EList
from mixin.model.eclass import EClass
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.notification import Notification
from mixin.rmo.feature_path import FeaturePath
from mixin.rmo.modification import Modification
from mixin.rmo.feature_key import FeatureKey, ListFeatureKey, MapFeatureKey


class EObjectModifier:
    def __init__(self, modification: Modification) -> None:
        self._modification = modification

    def modify(self, eObject: EObject):
        path: FeaturePath = self._modification.path
        keys: List[FeatureKey] = path.keys
        if len(keys) > 0:
            self.visit(eObject, keys, 0)

    def visit(self, eObject: EObject, keys: List[FeatureKey], index: int):

        key: FeatureKey = keys[index]
        name: str = key.name
        feature: EFeature = eObject.eFeature(name)
        if feature is None:
            eClass: EClass = eObject.eClass()
            className: str = eClass.getName()
            raise ValueError("Missing feature '{}' at '{}'".format(name, className))

        value: any = eObject.eGet(feature)

        # Sebelum key terakhir pencarian masih recursive
        length: int = len(keys)
        if index < length - 1:

            if isinstance(key, MapFeatureKey):

                map: EMap[any] = value
                mapKey: any = self.getMapKey(key)
                object: any = map.get(mapKey)
                self.visit(object, keys, index + 1)

            elif isinstance(key, ListFeatureKey):

                list: EList[any] = value
                listPosition: int = self.getListPosition(key)
                object: any = list.get(listPosition)
                self.visit(object, keys, index + 1)

            else:

                self.visit(value, keys, index + 1)

        else:

            # Key terakhir adalah feature yang di-modify
            self.modify(eObject, key, feature, value)

    def modify(self, eObject: EObject, featureKey: FeatureKey, feature: EFeature, value: any):

        type: int = self._modification.type
        oldValue: any = self._modification.oldValue
        newValue: any = self._modification.newValue

        if isinstance(value, EMap):

            map: EMap[any] = value
            mapKey: str = self.getMapKey(featureKey)

            if type == Notification.SET:
                map.put(mapKey, newValue)
            elif type == Notification.REMOVE:
                map.remove(mapKey)
            elif type == Notification.REPLACE_MANY:
                map.repopulate(newValue)
            else:
                raise ValueError("Unknown modification type {}".format(type))

        elif isinstance(value, EList):

            list: EList[any] = value
            listPosition: int = self.getListPosition(featureKey)
            if type == Notification.ADD:
                if listPosition == -1:
                    list.add(newValue)
                else:
                    list.add(listPosition, newValue)
            elif type == Notification.REMOVE:
                list.remove(listPosition)
            elif type == Notification.MOVE:
                newPosition: int = newValue
                object: any = list.get(listPosition)
                list.move(object, newPosition)
            elif type == Notification.SET:
                list.set(listPosition, newValue)
            elif type == Notification.ADD_MANY:
                newRange: List[any] = newValue
                rangeSize: int = len(newRange)
                if listPosition == -1 and rangeSize == list.size():
                    list.addAll(newRange)
                else:
                    list.insertRange(newRange, listPosition)
            elif type == Notification.REMOVE_MANY:
                oldRange: List[any] = oldValue
                rangeSize: int = len(oldRange)
                if listPosition == -1 and rangeSize == list.size():
                    list.clear()
                else:
                    list.removeRange(listPosition, listPosition + rangeSize)
            elif type == Notification.REPLACE_MANY:
                list.repopulate(newValue)
            else:
                raise ValueError("Unknown modification type {}".format(type))

        else:

            if type == Notification.SET:
                eObject.eSet(feature, newValue)
            else:
                raise ValueError("Unknown modification type {}".format(type))

    def getMapKey(self, featureKey: FeatureKey) -> str:
        mapFeatureKey: MapFeatureKey = featureKey
        return mapFeatureKey.key

    def getListPosition(self, featureKey: FeatureKey) -> int:
        listFeatureKey: ListFeatureKey = featureKey
        return listFeatureKey.position

    def visit(self, object: any, keys: List[FeatureKey], index: int):
        if isinstance(object, EObject):
            eObject: EObject = object
            self.visit(eObject, keys, index)
        else:
            raise ValueError("Object '{}' not instanceof EObject".format(object))
