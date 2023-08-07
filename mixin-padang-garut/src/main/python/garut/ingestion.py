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
import pandas as pd

from garut.source import Source
from garut.datastage import Datastage
from garut.contexts.context import Context
from garut.converter import ConverterRegistry
from garut.evaluations.evaluation import EvaluationFactory
from garut.instruction import InstructionFactory, Instruction
from dataminer_pb2 import *


class Ingestion(Source):
    def __init__(self, context: Context, datastage: Datastage):
        self.resetResult()
        self._context = context
        self._datastage: Datastage = datastage

    def selectResult(self, request: IngestionResultSelectRequest) -> SelectResponse:

        # Instruction
        factory = InstructionFactory.getInstance()
        instruction: Instruction = factory.create(request.order.name)

        # Options
        factory: EvaluationFactory = EvaluationFactory.getInstance()
        values = factory.evaluateOptions(self._context, request.order.options)

        # Execute
        buffer = self._getBuffer()
        result = instruction.execute(self._context, buffer, values)

        # Response
        registry: ConverterRegistry = ConverterRegistry.getInstance()
        value = registry.toValue(result)
        response = SelectResponse()
        response.value.CopyFrom(value)
        return response

    def resetResult(self):
        self._buffer: pd.DataFrame = None

    def applyResult(self):

        # Response
        response = ApplyResponse()
        response.applied = True
        return response

    def remove(self) -> any:
        del self._buffer
        pass

    def _getBuffer(self) -> pd.DataFrame:
        return self._buffer
