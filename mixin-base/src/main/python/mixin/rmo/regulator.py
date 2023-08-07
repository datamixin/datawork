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

from mixin.rmo.outset import Outset
from mixin.rmo.supervisor import Supervisor


class Regulator(Supervisor):

    FLAG_ACTIVE: int = 1

    def getModel(self) -> any:
        pass

    def createOutset(self) -> Outset:
        pass

    def getOutset(self) -> Outset:
        pass

    def setOutset(self, outset: Outset):
        pass

    def removeOutset(self):
        pass

    def setParent(self):
        pass

    def getChildren() -> List[Supervisor]:
        pass

    def activate(self):
        pass

    def deactivate(self):
        pass

    def addNotify(self):
        pass

    def removeNotify(self):
        pass

    def update(self):
        pass

    def getRoot(self) -> Supervisor:
        pass

    def getRunmodel(self):
        pass

    def moveChildOutset(self, regulator: Supervisor, index: int):
        pass

    def createAcceptors(self):
        pass


class RegulatorFactory:
    def create(model: any) -> Regulator:
        pass
