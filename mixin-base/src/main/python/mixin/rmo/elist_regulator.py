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

from mixin.model.elist import EList
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.adapter import AdapterList
from mixin.model.notification import Notification

from mixin.rmo.regulator import Regulator
from mixin.rmo.feature_key import FeatureKey
from mixin.rmo.outset import Outset, OutsetList
from mixin.rmo.adapter_regulator import AdapterRegulator
from mixin.rmo.feature_path import FeaturePath, FeaturePathUtils


class EListRegulator(AdapterRegulator):
    def getModel(self) -> EList:
        return super().getModel()

    def createOutset(self) -> OutsetList:
        return self.getOutset()

    def setOutset(self, list: OutsetList):
        super().setOutset(list)

    def getAdapters(self) -> AdapterList:
        model: EList = self.getModel()
        owner: EObject = model.eOwner()
        eAdapters: AdapterList = owner.eAdapters()
        return eAdapters

    def getQualifiedPath(self) -> str:
        path: FeaturePath = self._getFeaturePath()
        return str(path)

    def _getFeaturePath(self) -> FeaturePath:
        model: EList = self.getModel()
        feature: EFeature = model.eFeature()
        owner: EObject = model.eOwner()
        name: str = feature.name
        key: FeatureKey = FeatureKey(name)
        path: FeaturePath = FeaturePathUtils.fromModel(owner, key)
        return path

    def getFeatureKeys(self) -> List[FeatureKey]:
        path: FeaturePath = self._getFeaturePath()
        return path.keys

    def getModelChildren(self) -> List[any]:
        model: EList = self.getModel()
        return model.toArray()

    def notifyChanged(self, notification: Notification):

        model: EList = self.getModel()
        modelFeature: EFeature = model.eFeature()
        notifFeature: EFeature = notification.getFeature()

        if notifFeature == modelFeature:
            eventType: int = notification.getEventType()
            if (
                eventType == Notification.ADD
                or eventType == Notification.REMOVE
                or eventType == Notification.MOVE
                or eventType == Notification.SET
                or eventType == Notification.ADD_MANY
                or eventType == Notification.REMOVE_MANY
                or eventType == Notification.REPLACE_MANY
            ):
                self.update()

    def getOutset(self) -> OutsetList:
        return super().getOutset()

    def addChildOutset(self, child: Regulator, index: int):
        super().addChildOutset(child, index)
        outset: Outset = child.getOutset()
        list: OutsetList[Outset] = self.getOutset()
        list.add(outset, index)

    def moveChildOutset(self, child: Regulator, index: int):
        outset: Outset = child.getOutset()
        list: OutsetList[Outset] = self.getOutset()
        list.move(outset, index)

    def removeChildOutset(self, child: Regulator):
        outset: Outset = child.getOutset()
        list: OutsetList[Outset] = self.getOutset()
        list.remove(outset)
        super().removeChildOutset(child)
