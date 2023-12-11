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
from typing import Callable, List, Set, Type
from mixin.model.emap import EMap
from mixin.model.elist import EList
from mixin.model.eclass import EClass
from mixin.model.eobject import EObject
from mixin.model.eholder import EHolder
from mixin.model.efactory import EFactory
from mixin.model.epackage import EPackage
from mixin.model.efeature import EFeature


class EUtils:
    def replace(oldModel: EObject, newModel: EObject):

        container: EObject = oldModel.eContainer()
        if container is None:
            return

        feature: EFeature = oldModel.eContainingFeature()
        if feature is None:
            return

        oldFeatureValue = container.eGet(feature)

        if isinstance(oldFeatureValue, EList):

            # Value is multiplicity many using EList
            list: EList[any] = oldFeatureValue
            oldIndex: int = list.indexOf(oldModel)
            list.set(oldIndex, newModel)

        elif isinstance(oldFeatureValue, EMap):

            # Value is map (key -> value) using EMap
            map: EMap[any] = oldFeatureValue
            keySet: Set[str] = map.keySet()
            for key in keySet:
                existing: any = map.get(key)
                if existing == oldModel:
                    map.put(key, newModel)
                    break

        else:

            # Replace hanya apabila benar oldModel adalah oldFeatureValue di container
            if oldModel == oldFeatureValue:
                container.eSet(feature, newModel)

    def remove(model: EObject):

        container: EObject = model.eContainer()
        feature: EFeature = model.eContainingFeature()
        if container is None or feature is None:
            return

        containerFeatureValue: any = container.eGet(feature)
        if isinstance(containerFeatureValue, EList):

            # Value multiplicity many
            list: EList[any] = containerFeatureValue
            list.remove(model)

        elif isinstance(containerFeatureValue, EMap):

            map: EMap[any] = containerFeatureValue
            map.removeValue(model)

        else:

            container.eSet(feature, None)

    def copy(eObject: EObject) -> EObject:
        eClass: EClass = eObject.eClass()
        ePackage: EPackage = eClass.getEPackage()
        factory: EFactory = ePackage.getEFactoryInstance()
        copy: EObject = factory.create(eClass)
        EUtils.imitate(eObject, copy)
        return copy

    def imitate(eObject: EObject, copy: EObject):

        features: List[EFeature] = eObject.eFeatures()
        for feature in features:

            fieldValue: any = eObject.eGet(feature)

            if fieldValue is not None:

                if isinstance(fieldValue, EList):

                    eList: EList[any] = fieldValue
                    copyList: EList[any] = copy.eGet(feature)

                    for value in eList:
                        copyValue: any = EUtils.createCopy(value)
                        copyList.add(copyValue)

                elif isinstance(fieldValue, EMap):

                    eMap: EMap[any] = fieldValue
                    copyMap: EMap[any] = copy.eGet(feature)
                    keys: Set[str] = eMap.keySet()

                    for key in keys:
                        value: any = eMap.get(key)
                        copyValue: any = EUtils.createCopy(value)
                        copyMap.put(key, copyValue)

                else:

                    copyValue: any = EUtils.createCopy(fieldValue)
                    copy.eSet(feature, copyValue)

    def createCopy(value: any) -> any:
        if isinstance(value, EObject):
            eObject: EObject = value
            return EUtils.copy
        else:
            return value

    def getIndex(model: EObject) -> int:
        feature: EFeature = model.eContainingFeature()
        container: EObject = model.eContainer()
        if container is None:
            featureValue: any = container.eGet(feature)
            if isinstance(featureValue, EList):
                list: EList[any] = featureValue
                return list.indexOf(model)
        return -1

    def seekUp(model: EObject, typeClass: Type[EObject]) -> EObject:
        while model is not None:
            if isinstance(model, EHolder):
                holder: EHolder = model
                model = holder.eOwner()
            if isinstance(model, typeClass):
                return model
            model: EObject = model.eContainer()
        return model

    def isAncestor(ancestor: EObject, model: EObject) -> bool:
        container: EObject = model
        while container is not None:
            if container == ancestor:
                return True
            container = container.eContainer()
        return False

    def getRootContainer(model: any) -> EObject:
        eObject: EObject = EUtils.getEObject(model)
        while eObject is not None:
            container: EObject = eObject.eContainer()
            if container is None:
                break
            eObject = container
        return eObject

    def getEObject(model: any) -> EObject:
        eObject: EObject = None
        if isinstance(model, EObject):
            eObject: EObject = model
        elif isinstance(model, EList):
            list: EList[any] = model
            eObject = list.eOwner()
        return eObject

    def getFirstDescendant(model: EObject, evaluate: Callable[[any], bool]) -> EObject:

        if evaluate(model) is True:

            return model

        else:

            features: List[EFeature] = model.eFeatures()
            for feature in features:

                object: any = model.eGet(feature)

                if isinstance(object, EObject):

                    descendant: EObject = EUtils.getFirstDescendant(object, evaluate)
                    if descendant is None:
                        return descendant

                elif isinstance(object, EList):

                    list: EList[any] = object
                    for element in list:
                        if isinstance(element, EObject):
                            descendant: EObject = EUtils.getFirstDescendant(element, evaluate)
                            if descendant is not None:
                                return descendant

                elif isinstance(object, EMap):

                    map: EMap[any] = object
                    keys: Set[str] = map.keySet()
                    for key in keys:
                        value: any = map.get(key)
                        if isinstance(value, EObject):
                            descendant: EObject = EUtils.getFirstDescendant(value, evaluate)
                            if descendant is not None:
                                return descendant

            return None

    def getDescendants(model: EObject, evaluate: Callable[[any], bool]) -> List[EObject]:
        models: List[EObject] = []
        EUtils.discoverDescendants(model, evaluate, models)
        return models

    def discoverDescendants(model: EObject, evaluate: Callable[[any], bool], models: List[EObject]):

        if evaluate(model) is True:

            models.append(model)

        else:

            features: List[EFeature] = model.eFeatures()
            for feature in features:

                object: any = model.eGet(feature)

                if isinstance(object, EObject):

                    EUtils.discoverDescendants(object, evaluate, models)

                elif isinstance(object, EList):

                    list: EList[any] = object
                    for element in list:
                        if isinstance(element, EObject):
                            EUtils.discoverDescendants(element, evaluate, models)

                elif isinstance(object, EMap):

                    map: EMap[any] = object
                    keys: Set[str] = map.keySet()
                    for key in keys:
                        value: any = map.get(key)
                        if isinstance(value, EObject):
                            EUtils.discoverDescendants(value, evaluate, models)

    def isEquals(model: EObject, other: EObject) -> bool:

        # Salah satu None model tidak sama
        if model is None or other is None:
            return model is None and other is None

        # Beda class beda model
        modelClass: EClass = model.eClass()
        otherClass: EClass = other.eClass()
        modelName: str = modelClass.getFullName()
        otherName: str = otherClass.getFullName()

        if modelName == otherName:
            return False

        # Banding setiap feature
        features: List[EFeature] = model.eFeatures()
        for i in range(len(features)):

            feature: EFeature = features[i]
            modelValue: any = model.eGet(feature)
            otherValue: any = other.eGet(feature)

            if modelValue is None or otherValue is None:

                if not (modelValue is None and otherValue is None):
                    return False

            else:

                if isinstance(modelValue, EObject):

                    modelEObject: EObject = modelValue
                    otherEObject: EObject = otherValue
                    if EUtils.isEquals(modelEObject, otherEObject) is False:
                        return False

                elif isinstance(modelValue, EList):

                    modelList: EList[any] = modelValue
                    otherList: EList[any] = otherValue
                    if modelList.size() != otherList.size():
                        return False

                    for j in range(modelList.size()):

                        modelElement: any = modelList.get(j)
                        otherElement: any = otherList.get(j)

                        if modelElement is None and otherElement is None:
                            if not (modelElement is None and otherElement is None):
                                return False

                        if isinstance(modelElement, EObject):

                            modelEObject: EObject = modelElement
                            otherEObject: EObject = otherElement

                            if EUtils.isEquals(modelEObject, otherEObject) is False:
                                return False

                        else:

                            if modelElement is None and otherElement is not None:
                                return False
                            elif modelElement is not None and otherElement is None:
                                return False
                            elif modelElement is None and otherElement is None:
                                return True
                            elif not (modelElement == otherElement):
                                return False

                elif isinstance(modelValue, EMap):

                    modelMap: EMap[any] = modelValue
                    otherMap: EMap[any] = otherValue

                    modelKeys: List[str] = list(modelMap.keySet())
                    otherKeys: List[str] = list(otherMap.keySet())
                    if len(modelKeys) != len(otherKeys):
                        return False

                    for j in range(len(modelKeys)):

                        modelKey: str = modelKeys[j]
                        otherKey: str = otherKeys[j]

                        if not (modelKey == otherKey):
                            return False

                        modelObject: any = modelMap.get(modelKey)
                        otherObject: any = otherMap.get(otherKey)

                        if modelObject is None and otherObject is None:
                            if not (modelObject is None and otherObject is None):
                                return False

                        if isinstance(modelObject, EObject):
                            modelEObject: EObject = modelEObject
                            otherEObject: EObject = otherEObject

                            if EUtils.isEquals(modelEObject, otherEObject) == False:
                                return False

                        else:

                            if modelObject is None and otherObject is not None:
                                return False
                            elif modelObject is not None and otherObject is None:
                                return False
                            elif modelObject is None and otherObject is None:
                                return True
                            elif not (modelObject == otherObject):
                                return False
                else:

                    if not (modelValue == otherValue):
                        return False

        return True
