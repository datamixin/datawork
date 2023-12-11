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
from garut.contexts.context import Context, BaseContext


class FieldProvider:
    def isFieldExists(self, name: str) -> bool:
        return False

    def getField(self, name: str):
        return None


class BuilderContext(BaseContext):
    def __init__(self, parent: Context, provider: FieldProvider):
        super().__init__(parent)
        self._provider = provider

    def isFieldExists(self, variable: str) -> bool:
        if self._provider.isFieldExists(variable):
            return True
        else:
            return super().isFieldExists(variable)

    def getField(self, variable: str):
        if self._provider.isFieldExists(variable):
            return self._provider.getField(variable)
        else:
            return super().getField(variable)

    def getFieldContext(self, variable: str):
        if self._provider.isFieldExists(variable):
            return self
        else:
            return super().getFieldContext(variable)
