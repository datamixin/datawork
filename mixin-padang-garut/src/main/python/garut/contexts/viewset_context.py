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
from garut.contexts.context import BaseContext, Context


class OutletProvider:
    def isOutletExists(self, outlet: str) -> bool:
        return False

    def getOutlet(self, outlet: str):
        return None


class ViewsetContext(BaseContext):
    def __init__(self, parent: Context, provider: OutletProvider):
        super().__init__(parent)
        self._provider = provider

    def isFieldExists(self, key: str) -> bool:
        if self._provider.isOutletExists(key):
            return True
        else:
            return super().isFieldExists(key)

    def getField(self, key: str):
        if self._provider.isOutletExists(key):
            return self._provider.getOutlet(key)
        else:
            return super().getField(key)

    def getFieldContext(self, key: str):
        if self._provider.isOutletExists(key):
            return self
        else:
            return super().getFieldContext(key)
