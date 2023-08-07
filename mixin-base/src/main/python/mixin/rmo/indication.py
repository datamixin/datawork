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
from mixin.lean import Lean
from mixin.rmo.feature_path import FeaturePath


class Indication(Lean):
    def __init__(self, path: FeaturePath, key: str, values: List[Lean]):
        super().__init__(Indication)
        self._path = path
        self._key = key
        self._values = values

    @property
    def path(self) -> FeaturePath:
        return self._path

    @property
    def key(self) -> str:
        return self._key

    @property
    def values(self) -> List[Lean]:
        return self._values
