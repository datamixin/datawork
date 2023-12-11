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
from mixin.model.efeature import EFeature


class Notification:

    # EObject
    SET: int = 1
    UNSET = 2

    # EList
    ADD: int = 3
    REMOVE: int = 4
    MOVE: int = 5
    ADD_MANY: int = 6
    REMOVE_MANY: int = 7
    REPLACE_MANY: int = 8

    def __init__(
        self,
        notifier: any,
        eventType: int,
        feature: EFeature,
        oldValue: any,
        newValue: any,
        listPosition: int,
        mapKey: str,
    ):
        self._notifier = notifier
        self._eventType = eventType
        self._feature = feature
        self._oldValue = oldValue
        self._newValue = newValue
        self._listPosition = listPosition
        self._mapKey = mapKey

    def getNotifier(self) -> any:
        return self._notifier

    def getEventType(self) -> int:
        return self._eventType

    def getFeature(self) -> EFeature:
        return self._feature

    def getOldValue(self) -> any:
        return self._oldValue

    def getNewValue(self) -> any:
        return self._newValue

    def getListPosition(self) -> int:
        return self._listPosition

    def getMapKey(self) -> str:
        return self._mapKey
