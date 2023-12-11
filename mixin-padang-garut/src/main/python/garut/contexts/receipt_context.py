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


class InputProvider:
    def isInputExists(self, name: str):
        return None

    def getInput(self, name: str):
        return None


class ReceiptContext(BaseContext):
    def __init__(self, parent: Context, provider: InputProvider):
        super().__init__(parent)
        self._provider = provider

    def isFieldExists(self, input: str) -> bool:
        if self._provider.isInputExists(input):
            return True
        else:
            return super().isFieldExists(input)

    def getField(self, input: str):
        if self._provider.isInputExists(input):
            return self._provider.getInput(input)
        else:
            return super().getField(input)

    def getFieldContext(self, input: str):
        if self._provider.isInputExists(input):
            return self
        else:
            return super().getFieldContext(input)
