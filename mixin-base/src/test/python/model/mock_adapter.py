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
from mixin.model.adapter import Adapter
from mixin.model.notification import Notification


class MockAdapter(Adapter):
    def __init__(self):
        self._list: List[Notification] = []

    def notifyChanged(self, notification: Notification):
        self._list.append(notification)

    @property
    def last_notification(self) -> Notification:
        return self._list[-1]

    @property
    def notifications(self) -> int:
        return len(self._list)
