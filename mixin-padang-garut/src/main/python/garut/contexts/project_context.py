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
from garut.contexts.context import Context, BaseContext
from garut.contexts.dataminer_context import DataminerContext
from garut.storage import StorageFile


class ForeseeProvider:
    def isForeseeExists(self, sheet: str) -> bool:
        return False

    def getForesee(self, sheet: str) -> any:
        return None

    def getDatasetResult(self, sheet: str, display: bool) -> any:
        return None

    def getPreparationResult(self, sheet: str, mutation: int, display: bool) -> any:
        return None


class ProjectContext(BaseContext):
    def __init__(self, parent: Context, folder: StorageFile, provider: ForeseeProvider):
        super().__init__(parent)
        self._folder = folder
        self._provider = provider

    def getKey(self) -> str:
        return self._folder.getName()

    def isFieldExists(self, key: any):
        if self._provider.isForeseeExists(key):
            return True
        else:
            parent: DataminerContext = super().getParent()
            reference = self._folder.getName()
            return parent.isFieldExists(key, reference)

    def getField(self, key: any) -> any:
        if self._provider.isForeseeExists(key):
            key = self._provider.getForesee(key)
            return key
        else:
            parent: DataminerContext = super().getParent()
            reference = self._folder.getName()
            return parent.getField(key, reference)

    def getFieldContext(self, key: any) -> any:
        if self._provider.isForeseeExists(key):
            return self
        else:
            parent: DataminerContext = super().getParent()
            reference = self._folder.getName()
            return parent.getFieldContext(key, reference)

    def getDatasetResult(self, sheet: any, display: bool) -> any:
        return self._provider.getDatasetResult(sheet, display)

    def getPreparationResult(self, sheet: str, mutation: int, display: bool) -> any:
        return self._provider.getPreparationResult(sheet, mutation, display)
