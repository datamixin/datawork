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
from typing import Dict, List

from mixin.model.eclass import EClass
from mixin.model.elist import EList
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.notification import Notification
from mixin.model.adapter import Adapter, AdapterList

from mixin.rmo.regulator import Regulator
from mixin.rmo.feature_key import FeatureKey
from mixin.rmo.base_regulator import BaseRegulator
from mixin.rmo.elist_regulator import EListRegulator
from mixin.rmo.outset import Outset, OutsetFactory, OutsetList
from mixin.rmo.feature_path import FeaturePath, FeaturePathUtils


class AdapterRegulator(BaseRegulator, Adapter):
    def __init__(self):
        super().__init__()

    def activate(self):
        super().activate()
        adapters: AdapterList = self.getAdapters()
        adapters.add(self)

        #  Tambah custom adapters
        for adapter in self.getCustomAdapters():
            adapters.add(adapter)

    def deactivate(self):
        super().deactivate()

        adapters: AdapterList = self.getAdapters()
        adapters.remove(self)

        #  Hapus custom adapters
        for adapter in self.getCustomAdapters():
            adapters.remove(adapter)

    def getCustomAdapters(self) -> List[Adapter]:
        return []

    def getAdapters(self) -> AdapterList:
        pass

    def notifyChanged(notification: Notification):
        pass


class EObjectRegulator(AdapterRegulator):

    CHECKUP_PROBLEM_LIST: str = "problem-list"
    CHECKUP_PROBLEM_COUNTER: str = "problem-counter"

    def __init__(self):
        super().__init__()
        self._keys: List[FeatureKey] = []
        self._qualifiedPath: str = None
        self._outsetListMap: Dict[EFeature, OutsetList] = {}

    def setModel(self, object: any):
        super().setModel(object)
        model: EObject = object
        path: FeaturePath = FeaturePathUtils.fromModel(model)
        self._keys = path.keys
        self._qualifiedPath = path.toQualified()

    def getModel(self) -> EObject:
        return super().getModel()

    def getAdapters(self) -> AdapterList:
        model: EObject = self.getModel()
        adapters: AdapterList = model.eAdapters()
        return adapters

    def createOutset(self) -> Outset:

        factory: OutsetFactory = self.getOutsetFactory()
        try:

            model: EObject = self.getModel()
            eClass: EClass = model.eClass()
            name: str = eClass.getName()

            features: List[EFeature] = model.eFeatures()
            for feature in features:
                key: str = factory.asFeatureKey(name, feature)
                if factory.isExists(key):
                    outsetList: OutsetList = factory.create(self, key)
                    self.registerOutsetList(feature, outsetList)

            return factory.create(self, name)

        except ValueError as e:
            raise ValueError("Fail create outset for " + str(type(self)), e)

    def registerOutsetList(self, feature: EFeature, list: OutsetList):
        self._outsetListMap[feature] = list

    def addChildOutset(self, child: Regulator, index: int):

        if isinstance(child, EListRegulator):

            #  Khusus EListRegulator berikan langsung instance-nya
            regulator: EListRegulator = child
            list: EList[any] = regulator.getModel()
            feature: EFeature = list.eFeature()
            outset: OutsetList = self._outsetListMap.get(feature)
            if outset is not None:
                regulator.setOutset(outset)
            else:
                msg = "Missing outset list for '{}'".format(feature.name)
                raise ValueError(msg)

        super().addChildOutset(child, index)

    def getQualifiedPath(self) -> str:
        return self._qualifiedPath

    def getFeatureKeys(self) -> List[FeatureKey]:
        return self._keys
