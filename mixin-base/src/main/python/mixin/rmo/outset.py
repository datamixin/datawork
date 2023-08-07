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
from typing import Dict, List, Type, TypeVar, Generic
from mixin.model.efeature import EFeature
from mixin.rmo.supervisor import Supervisor
from mixin.model.ereference import EReference


class Outset:
    pass


class RootOutset(Outset):
    pass


O = TypeVar("O")


class OutsetList(Generic[O]):
    def add(child: O, index: int):
        pass

    def remove(child: O):
        pass

    def move(child: O, index: int):
        pass

    def get(index: int) -> O:
        pass

    def size() -> int:
        pass

    def indexOf(child: O) -> int:
        pass


class OutsetFactory:
    def create(supervisor: Supervisor, model: any) -> Outset:
        pass

    def asFeatureKey(name: str, feature: EFeature) -> str:
        pass

    def isExists(className: str) -> bool:
        pass


class BaseOutsetFactory(OutsetFactory):
    def __init__(self) -> None:
        super().__init__()
        self._outsets: Dict[str, Outset] = {}

    def register(self, className: str, outsetClass: Type[Outset]):
        self._outsets[className] = outsetClass

    def registerList(self, className: str, feature: EReference, outsetClass: Type[Outset]):
        key: str = self.asFeatureKey(className, feature)
        self.register(key, outsetClass)

    def asFeatureKey(className: str, feature: EFeature) -> str:
        return className + "." + feature.name

    def create(self, supervisor: Supervisor, className: str) -> Outset:

        outsetClass: any = None
        outsetClass = self._outsets.get(className)

        if outsetClass is not None:

            try:
                outset: Outset = outsetClass(supervisor)
                return outset
            except ValueError as e:
                message = "Fail create outset " + outsetClass
                raise ValueError(message)
        else:
            raise ValueError("Missing outset for " + className)

    def isExists(self, className: str) -> bool:
        return className in self._outsets
