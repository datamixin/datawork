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

from mixin.rmo.outset import RootOutset
from mixin.rmo.runmodel import Runmodel
from mixin.rmo.regulator import Regulator
from mixin.rmo.feature_key import FeatureKey
from mixin.rmo.base_regulator import BaseRegulator


class RootRegulator(BaseRegulator):
    def __init__(self):
        super().__init__()
        self._contents: Regulator = None
        self._runmodel: Runmodel = None

    def createOutset(self) -> RootOutset:
        return RootOutset()

    def getRunmodel(self) -> Runmodel:
        return self._runmodel

    def setRunmodel(self, runmodel: Runmodel):
        self._runmodel = runmodel

    def getRoot(self) -> Regulator:
        return self

    def setContents(self, contents: Regulator):

        # Hapus terlebih dahulu yang sebelumnya jika ada
        if self._contents is not None:
            self._removeChild(self._contents)

        # Setting contents baru
        self._contents = contents
        if self._contents is not None:
            self._addChild(self._contents, 0)
            self._contents.activate()

    def getContents(self) -> Regulator:
        return self._contents

    def update(self):
        self._contents.update()

    def getChildren(self) -> List[Regulator]:
        if self._contents is None:
            return []
        return [self._contents]

    def getQualifiedPath(self) -> str:
        return ""

    def getFeatureKeys(self) -> List[FeatureKey]:
        return []
