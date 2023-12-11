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
from typing import Type

from dataminer_pb2 import *


class Context:
    def getParent(self):
        return None

    def isFieldExists(self, key: any):
        return False

    def getField(self, key: any) -> any:
        return None

    def getFieldContext(self, key: any) -> any:
        return None

    def getAncestor(self, type: Type):
        return None


class BaseContext(Context):
    def __init__(self, parent: Context = None):
        self._parent = parent

    def getParent(self) -> Context:
        return self._parent

    def isFieldExists(self, key: any):
        if self._parent is None:
            return False
        else:
            return self._parent.isFieldExists(key)

    def getField(self, key: any) -> any:
        if self._parent is None:
            return None
        else:
            return self._parent.getField(key)

    def getFieldContext(self, key: any) -> any:
        if self._parent is None:
            return None
        else:
            return self._parent.getFieldContext(key)

    def getAncestor(self, type: Type) -> Context:
        current = self
        while current is not None:
            if isinstance(current, type):
                return current
            else:
                current = current.getParent()
        return None
