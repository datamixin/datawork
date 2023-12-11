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
from mixin.lean import Lean
from mixin.rmo.feature_path import FeaturePath


class Modification(Lean):
    def __init__(self, path: FeaturePath = None, type: int = None, oldValue: any = None, newValue: any = None):
        super().__init__(Modification)
        self._path = path
        self._type = type
        self._oldValue = oldValue
        self._newValue = newValue

    @property
    def path(self) -> FeaturePath:
        return self._path

    @property
    def type(self) -> int:
        return self._type

    @property
    def oldValue(self) -> any:
        return self._oldValue

    @property
    def newValue(self) -> any:
        return self._newValue
