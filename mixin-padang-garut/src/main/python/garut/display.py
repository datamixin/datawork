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
from pandas.core.frame import DataFrame

from typing import List
from garut.mutation import Mutation
from garut.contexts.context import Context
from dataminer_pb2 import *


class Display:
    def __init__(self, context: Context):
        self._mutations: List[Mutation] = []
        self._context = context

    def insertMutation(self, index: int, order: any) -> InsertResponse:

        # Buat mutation baru
        mutation = Mutation(self._context, order.name, order.options)

        # Append atau insert mutation
        if index == -1:
            self._mutations.append(mutation)
        else:
            self._mutations.insert(index, mutation)

        response = InsertResponse()
        response.modified = True
        return response

    def removeMutation(self, index: int) -> RemoveResponse:

        # Hapus mutation setelah index
        del self._mutations[index]

        # Response
        response = RemoveResponse()
        response.removed = True
        return response

    def inspect(self, source: DataFrame):
        result = source
        for mutation in self._mutations:
            result = mutation.mutate(result)
        return result
