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


class MutationResultProvider:
    def getMutationResult(self, mutation: int, display: bool):
        return False


class PreparationContext(BaseContext):
    def __init__(self, parent: Context, provider: MutationResultProvider):
        super().__init__(parent)
        self._provider = provider

    def getMutationResult(self, mutation: int, display: bool):
        return self._provider.getMutationResult(mutation, display)
