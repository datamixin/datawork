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
from typing import Callable, Dict, List

from mixin.lean import Lean

from mixin.rmo.outset import Outset
from mixin.rmo.lifetime import Lifetime
from mixin.rmo.acceptor import Acceptor
from mixin.rmo.runmodel import Runmodel
from mixin.rmo.indication import Indication
from mixin.rmo.modification import Modification
from mixin.rmo.rectification import Rectification
from mixin.rmo.regulator import Regulator, RegulatorFactory
from mixin.rmo.feature_path import FeaturePath, FeaturePathUtils


class BaseRegulator(Regulator):
    def __init__(self) -> None:
        super().__init__()
        self._model: any = None
        self._flags: int = 0
        self._outset: Outset = None
        self._parent: Regulator = None
        self._children: List[Regulator] = []
        self._preparedObjects: Dict[any, any] = {}
        self._acceptors: Dict[str, Acceptor] = {}

    def setModel(self, model: any):
        self._model = model

    def getModel(self) -> any:
        return self._model

    def setParent(self, parent: Regulator):
        self._parent = parent

    def getParent(self) -> Regulator:
        return self._parent

    def indexOf(self, outset: Outset) -> int:
        children: List[Regulator] = self.getChildren()
        for i in range(len(children)):
            regulator: Regulator = children[i]
            child: Outset = regulator.getOutset()
            if child == outset:
                return i
        return -1

    def setOutset(self, outset: Outset):
        self._outset = outset

    def getChildren(self) -> List[Regulator]:
        return self._children.copy()

    def getFlag(self, flag: int) -> bool:
        return (self._flags & flag) != 0

    def setFlag(self, flag: int, value: bool):
        if value == True:
            self._flags |= flag
        else:
            self._flags &= ~flag

    def _addChild(self, child: Regulator, index: int):
        self._children.insert(index, child)
        child.setParent(self)
        child.createAcceptors()
        self.addChildOutset(index, child)
        child.addNotify()
        if self.isActive():
            child.activate()

    def isActive(self) -> bool:
        return self.getFlag(Regulator.FLAG_ACTIVE)

    def getChildRegulator(self, index: int) -> Regulator:
        return self._children[index]

    def addChildOutset(self, index: int, child: Regulator):
        outset: Outset = child.createOutset()
        child.setOutset(outset)

    def getOutset(self) -> Outset:
        if self._outset is None:
            outset: Outset = self.createOutset()
            self.setOutset(outset)
        return self._outset

    def addNotify(self):
        for child in self._children:
            child.addNotify()
        self.update()

    def _removeChild(self, child: Regulator):
        if child in self._children:
            index: int = self._children.index(child)
            child.deactivate()
            child.removeNotify()
            self.removeChildOutset(child)
            child.setParent(None)
            self._children.remove(index)

    def removeNotify(self):
        for child in self._children:
            child.removeNotify()

    def removeChildOutset(self, child: Regulator):
        child.removeOutset()
        child.setOutset(None)

    def _reorderChild(self, child: Regulator, index: int):
        if child in self._children:
            oldIndex: int = self._children.index(child)
            self._children.remove(oldIndex)
            self._children.insert(index, child)
            self.moveChildOutset(child, index)

    def update(self):
        self._updateChildren()

    def _getExistsModelChildren(self) -> List[any]:
        children: List[any] = []
        for child in self.getModelChildren():
            if child is not None:
                children.append(child)
        return children

    def _updateChildren(self):

        modelObjects: List[any] = self._getExistsModelChildren()
        size: int = len(self._children)

        i: int
        for i in range(len(modelObjects)):

            model: any = modelObjects[i]

            # Do a quick check to see if regulator[i] == model[i]
            if i < len(self._children) and self.isEquals(self._children[i].getModel(), model):
                continue

            # See if the regulator is already around but in the wrong location
            regulator: Regulator = None
            if size > 0:
                for j in range(len(self._children)):
                    child: Regulator = self._children[j]
                    childModel: any = child.getModel()
                    if self.isEquals(childModel, model):
                        regulator = child
                        break

            if regulator is not None:

                # Reorder children
                self._reorderChild(regulator, i)

            else:

                # Regulator for self._model doesn't exist yet, create & insert
                regulator = self._createChild(model)
                self._addChild(regulator, i)

        # Remove the remaining regulators
        size = len(self._children)
        if i < size:
            trash: List[Regulator] = self._children[i:]
            for tobeRemove in trash.reverse():
                self._removeChild(tobeRemove)

    def _createChild(self, model: any) -> Regulator:
        runmodel: Runmodel = self.getRunmodel()
        factory: RegulatorFactory = runmodel.getRegulatorFactory()
        if model is None:
            raise ValueError("{} cannot create child for None model".format(type(BaseRegulator)))
        return factory.create(model)

    def activate(self):
        self.setFlag(Regulator.FLAG_ACTIVE, True)
        if isinstance(self._outset, Lifetime):
            self._outset.initiate()

        for regulator in self._children:
            regulator.activate()

        if isinstance(self._outset, Lifetime):
            self._outset.activate()

    def deactivate(self):
        for regulator in self._children:
            regulator.deactivate()

        if isinstance(self._outset, Lifetime):
            self._outset.terminate()

        self.setFlag(Regulator.FLAG_ACTIVE, False)

    def isEquals(self, a: any, b: any) -> bool:
        return a == b

    def getRunmodel(self) -> Runmodel:
        root: Regulator = self.getRoot()
        if root is None:
            return None
        return root.getRunmodel()

    def getRoot(self) -> Regulator:
        parent: Regulator = self.getParent()
        if parent is not None:
            return parent.getRoot()
        return None

    def getOutsetFactory(self):
        runmodel: Runmodel = self.getRunmodel()
        return runmodel.getOutsetFactory()

    def getModelChildren(self) -> List[Regulator]:
        return []

    def getPrepareObject(self, preparedClass: any) -> any:

        # Default cari di regulator menggunakan class yang diberikan
        preparedObject: any = self._preparedObjects.get(preparedClass)

        # Cari menggunakan class sebagai interface
        if preparedObject is None:
            for pClass in self._preparedObjects.keys():
                if issubclass(pClass, preparedClass):
                    preparedObject = self._preparedObjects.get(pClass)
                    break

        if preparedObject is not None:
            return preparedObject

        else:

            # Cari secara recursive ke atas untuk preparedClass yang sesuai
            if self._parent != None:
                return self._parent.getPrepareObject(preparedClass)
            else:
                return None

    def setPreparedObject(self, preparationClass, object):
        self._preparedObjects[preparationClass] = object

    def applyDescendants(self, descendantClass: any, consumer: Callable[[any], None]):
        self._doApplyDescendants(descendantClass, consumer, self)

    def _doApplyDescendants(self, descendantClass: any, consumer: Callable[[any], None], parent: Regulator):
        for regulator in parent.getChildren():
            descendant: Regulator = regulator
            if issubclass(descendantClass, Outset):
                descendant = descendant.getOutset()

            if isinstance(descendant, descendantClass):
                consumer(descendant)
            else:
                self._doApplyDescendants(descendantClass, consumer, regulator)

    def getFirstDescendant(self, descendantClass: any, evaluator: Callable[[any], bool]):
        return self._doGetFirstDescendant(descendantClass, evaluator, self)

    def _doGetFirstDescendant(self, descendantClass: any, evaluator: Callable[[any], bool], parent: Regulator):
        for regulator in parent.getChildren():
            descendant: Regulator = regulator
            if issubclass(descendantClass, Outset):
                descendant = descendant.getOutset()

            if isinstance(descendant, descendantClass):
                if evaluator(descendant):
                    return descendant

            else:
                descendant = self._doGetFirstDescendant(descendantClass, evaluator, regulator)
                if descendant is not None:
                    return descendant

        return None

    def getDescendants(self, descendantClass: any, evaluator: Callable[[any], bool]):
        list: List[any] = []
        self._doGetDescendants(descendantClass, evaluator, list)
        return list

    def _doGetDescendants(
        self, descendantClass: any, evaluator: Callable[[any], bool], parent: Regulator, list: List[any]
    ):
        for regulator in parent.getChildren():
            descendant: Regulator = regulator
            if issubclass(descendantClass, Outset):
                descendant = descendant.getOutset()

            if isinstance(descendant, descendantClass):
                if evaluator(descendant):
                    list.append(descendant)

            else:
                self._doGetDescendants(descendantClass, evaluator, regulator, list)

    def applyFirstDescendant(
        self, descendantClass: any, evaluator: Callable[[any], bool], consumer: Callable[[any], None]
    ):
        descendant = self.getFirstDescendant(descendantClass, evaluator)
        if descendant != None:
            consumer(descendant)

    def getCapability(self, capabilityClass: any):
        runmodel: Runmodel = self.getRunmodel()
        return runmodel.getCapability(capabilityClass)

    def submitIndication(self, key: str, values: List[Lean]):
        runmodel: Runmodel = self.getRunmodel()
        qualifiedPath: str = self.getQualifiedPath()
        path: FeaturePath = FeaturePathUtils.fromQualified(qualifiedPath)
        indication: Indication = Indication(path, key, values)
        runmodel.postIndication(indication)

    def submit(self, rectification: Rectification):
        type: str = rectification.getType()
        if type in self._acceptors:
            acceptor: Acceptor = self._acceptors.get(type)
            pool: List[Modification] = []
            acceptor.accept(rectification, pool)
            runmodel: Runmodel = self.getRunmodel()
            for modification in pool:
                runmodel.postRectification(modification)

    def installRectificationAcceptors(self, type: str, acceptor: Acceptor):
        self._acceptors[type] = acceptor
