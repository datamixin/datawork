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
from mixin.model.notification import Notification


class Adapter:
    def notifyChanged(self, notification: Notification):
        pass


class ContentAdapter(Adapter):
    def notifyChanged(self, notification: Notification):
        pass


class AdapterList:
    def __init__(self):
        self._adapters: List[Adapter] = []

    def get(self, index: int) -> Adapter:
        return self._adapters[index]

    def indexOf(self, adapter: Adapter) -> int:
        if adapter in self._adapters:
            return self._adapters.index(adapter)
        else:
            return -1

    def add(self, adapter: Adapter) -> bool:
        if self.indexOf(adapter) == -1:
            self._adapters.append(adapter)
            return True
        else:
            return False

    def remove(self, adapter: Adapter) -> bool:
        index: int = self.indexOf(adapter)
        if index != -1:
            del self._adapters[index]
            return True
        else:
            return False

    def size(self) -> int:
        return len(self._adapters)

    def __iter__(self):
        return self._adapters.__iter__()
