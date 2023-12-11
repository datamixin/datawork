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
from typing import Dict
from garut.contexts.context import Context, BaseContext


class LambdaContext(BaseContext):
    def __init__(self, parent: Context, parameters: Dict[str, any]):
        super().__init__(parent)
        self._parameters = parameters

    def isFieldExists(self, key: str) -> bool:
        if key in self._parameters:
            return True
        else:
            return super().isFieldExists(key)

    def getField(self, key: str):
        if key in self._parameters:
            return self._parameters.get(key)
        else:
            return super().getField(key)

    def getFieldContext(self, key: str):
        if key in self._parameters:
            return self
        else:
            return super().getFieldContext(key)
