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
import inspect
from typing import List, Tuple
from mixin.model.eclass import EClass
from mixin.model.eutils import EUtils
from mixin.model.eobject import EObject
from mixin.model.efeature import EFeature
from mixin.model.notification import Notification
from mixin.model.adapter import AdapterList, ContentAdapter
from mixin.util.method_utils import MethodUtils


class BasicEObject(EObject):
    def __init__(self, eClass: EClass, features: List[EFeature]):
        self._classType = eClass
        self._features = features
        self._adapters: AdapterList = AdapterList()
        self._container: EObject = None
        self._containingFeature: EFeature = None

    def eClass(self) -> EClass:
        return self._classType

    def eFeature(self, id: str) -> EFeature:
        for feature in self._features:
            if feature.name == id:
                return feature
        return None

    def eFeatures(self) -> List[EFeature]:
        return self._features

    def eGet(self, feature: EFeature) -> any:
        name: str = feature.name
        members: List[Tuple[str, any]] = inspect.getmembers(self)
        for member in members:
            method = member[1]
            if inspect.ismethod(method):
                methodName: str = member[0]
                field: str = MethodUtils.checkGetOrIsField(methodName)
                signature = inspect.signature(method)
                parameters = signature.parameters
                if field is None or not field == name or len(parameters) != 0:
                    continue
                try:
                    return method()
                except ValueError as e:
                    raise e
        raise ValueError("Missing method to get field '{}' at {}".format(name, str(type(self))))

    def eSet(self, feature: EFeature, newValue: any):

        # Lepas value baru dari container sebelumnya.
        if isinstance(newValue, EObject):
            EUtils.remove(newValue)

        # Berikan value baru ke object ini.
        name: str = feature.name
        members: List[Tuple[str, any]] = inspect.getmembers(self)
        for member in members:
            method = member[1]
            if inspect.ismethod(method):
                methodName: str = member[0]
                field: str = MethodUtils.checkSetField(methodName)
                signature = inspect.signature(method)
                parameters = signature.parameters
                if field is None or not field == name or len(parameters) != 1:
                    continue
                try:
                    return method(newValue)
                except ValueError as e:
                    raise e
        raise ValueError("Missing method to set field '{}' at {}".format(name, str(type(self))))

    def eSetNotify(self, feature: EFeature, oldValue: any, newValue: any):
        self.notify(Notification.SET, feature, oldValue, newValue, -1, None)

    def eAdapters(self) -> AdapterList:
        return self._adapters

    def eContainer(self) -> EObject:
        return self._container

    def eContainingFeature(self) -> EFeature:
        return self._containingFeature

    def notify(self, eventType: int, feature: EFeature, oldValue: any, newValue: any, position: int, key: str):

        # Setting container dan featureId di old value menjadi None
        if isinstance(oldValue, BasicEObject):
            eObject: EObject = oldValue
            self._setContainerFeature(eObject, None, None)
        elif isinstance(oldValue, List):
            collection: List[any] = oldValue
            for object in collection:
                if isinstance(object, BasicEObject):
                    eObject: BasicEObject = object
                    self._setContainerFeature(eObject, None, None)

        # Setting container dan featureId di new value
        if isinstance(newValue, BasicEObject):
            eObject: BasicEObject = newValue
            self._setContainerFeature(eObject, self, feature)
        elif isinstance(newValue, List):
            collection: List[any] = newValue
            for object in collection:
                if isinstance(object, BasicEObject):
                    eObject: BasicEObject = object
                    self._setContainerFeature(eObject, self, feature)

        # Notification akan di berikan ke synchronizer dan adapters
        notification = Notification(self, eventType, feature, oldValue, newValue, position, key)
        self._notifyAdapters(notification)

    def _notifyAdapters(self, notification: Notification):

        # Lakukan notifikasi ke semua adapter
        for adapter in self._adapters:
            adapter.notifyChanged(notification)

        # Notify ke adapter yang extends ContentAdapter
        self._notifyContentAdapter(self._container, notification)

    def _notifyContentAdapter(self, eObject: EObject, notification: Notification):

        if eObject is not None:

            # Ambil daftar adapters
            adapters = eObject.eAdapters()
            for adapter in adapters:

                # Notify content adapter yang ada di eObject ini
                if isinstance(adapter, ContentAdapter):
                    adapter.notifyChanged(notification)

            # Notify content adapter yang ada di container
            container: BasicEObject = eObject.eContainer()
            self._notifyContentAdapter(container, notification)

    def _setContainerFeature(self, eObject: EObject, container: EObject, feature: EFeature):

        model: BasicEObject = eObject

        # Hapus model dari current container
        if model._container is not None:
            parent = model._container
            features = parent.eFeatures()
            for field in features:
                if parent.eGet(field) == model:
                    parent.eSet(field, None)

        # Berikan parent baru
        model._container = container
        model._containingFeature = feature
