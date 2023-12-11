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
import pandas as pd

from typing import Dict, List
from garut.source import Source
from garut.display import Display
from garut.mutation import Mutation
from garut.datastage import Datastage
from garut.contexts.context import Context
from garut.converter import ConverterRegistry
from garut.evaluations.evaluation import EvaluationFactory
from garut.instruction import InstructionFactory, Instruction
from garut.contexts.preparation_context import MutationResultProvider, PreparationContext
from dataminer_pb2 import *


class Preparation(Source):
    def __init__(self, context: Context, datastage: Datastage):
        super().__init__()
        self._prepareContext(context)
        self._datastage = datastage
        self._display = Display(self._context)
        self._mutations: List[Mutation] = []
        self.resetResult()

    def _prepareContext(self, context: Context):
        provider = PreparationMutationResultProvider(self)
        self._context = PreparationContext(context, provider)

    def insertMutation(self, index: int, order: any) -> InsertResponse:

        # Buat mutation baru
        mutation = Mutation(self._context, order.name, order.options)

        # Append atau insert mutation
        if index == -1:
            self._mutations.append(mutation)
        else:
            self._mutations.insert(index, mutation)
            self._clearBufferUp(index)

        response = InsertResponse()
        response.modified = True
        return response

    def insertDisplayMutation(self, index: int, order: any) -> InsertResponse:
        return self._display.insertMutation(index, order)

    def removeMutation(self, index: int) -> RemoveResponse:

        # Hapus mutation di index tersebut
        del self._mutations[index]
        self._clearBufferUp(index)

        # Response
        response = RemoveResponse()
        response.removed = True
        return response

    def removeDisplayMutation(self, index: int) -> RemoveResponse:
        return self._display.removeMutation(index)

    def selectLastMutationResult(self, order: any) -> SelectResponse:
        index = len(self._mutations) - 1
        self.selectMutationResult(index, order)

    def selectMutationResult(self, index: int, order: any) -> SelectResponse:

        # Instruction
        factory = InstructionFactory.getInstance()
        instruction: Instruction = factory.create(order.name)

        # Result
        factory: EvaluationFactory = EvaluationFactory.getInstance()
        values = factory.evaluateOptions(self._context, order.options)
        source = self._getBuffer(index)
        inspect = self._display.inspect(source)
        result = instruction.execute(self._context, inspect, values)

        # Response
        registry: ConverterRegistry = ConverterRegistry.getInstance()
        value = registry.toValue(result)
        response = SelectResponse()
        response.value.CopyFrom(value)
        return response

    def evaluate(self, expression: any):
        factory = EvaluationFactory.getInstance()
        result = factory.evaluateResponse(self._context, expression)
        return result

    def getMutationResult(self, mutation: int, display: bool):
        result = self._getBuffer(mutation)
        if display is True:
            result = self._display.inspect(result)
        return result

    def compute(self):

        # Compute
        self._buffers.clear()
        index = len(self._mutations) - 1
        self._getBuffer(index)

        # Response
        response = ApplyResponse()
        response.applied = True
        return response

    def calculate(self, context: Context):

        # Jalankan semua mutation dengan context lain
        result = None
        for mutation in self._mutations:

            # Instruction
            factory = InstructionFactory.getInstance()
            instruction: Instruction = factory.create(mutation.name)

            # Options
            factory: EvaluationFactory = EvaluationFactory.getInstance()
            options = factory.evaluateOptions(context, mutation.options)
            result = instruction.execute(context, result, options)

        return result

    def resetResult(self):
        self._buffers: Dict[int, pd.DataFrame] = {}

    def applyResult(self):

        # Reset datastage
        self._datastage.reset()

        # Append last dataframe
        index = len(self._mutations) - 1
        result = self._getBuffer(index)
        self._datastage.append(result)

        # Response
        response = ApplyResponse()
        response.applied = True
        return response

    def _getBuffer(self, index: int) -> pd.DataFrame:

        # Index -1 berarti akhir buffer
        if index == -1:
            index = len(self._mutations) - 1

        buffer = self._buffers.get(index, None)
        if buffer is None:

            # Buat secara recursive jika belum ada
            source: pd.DataFrame = None
            if index > 0:
                source = self._getBuffer(index - 1)

            # Jalankan mutation
            mutation = self._mutations[index]
            buffer = mutation.mutate(source)
            self._buffers[index] = buffer

        return buffer

    def _clearBufferUp(self, position: int):
        removed: List[int] = []
        for index in self._buffers.keys():
            if index >= position:
                removed.append(index)
        for index in removed:
            del self._buffers[index]


class PreparationMutationResultProvider(MutationResultProvider):
    def __init__(self, preparation: Preparation) -> None:
        super().__init__()
        self._preparation = preparation

    def getMutationResult(self, mutation: int, display: bool):
        return self._preparation.getMutationResult(mutation, display)
