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
from storage import StorageFile
from garut.contexts.context import Context, BaseContext


class VariableContext(BaseContext):
    def __init__(self, parent: Context, folder: StorageFile):
        super().__init__(parent)
        self._folder = folder

    def getName(self) -> str:
        return self._folder.getName()

    def isFieldExists(self, key: any):
        if self.getName() == key:
            return True
        else:
            return super().isFieldExists(key)

    def getField(self, key: any) -> any:
        if self.getName() == key:
            return self
        else:
            return super().getField(key)

    def getFieldContext(self, key: any) -> any:
        if self.getName() == key:
            return self
        else:
            return super().getFieldContext(key)
