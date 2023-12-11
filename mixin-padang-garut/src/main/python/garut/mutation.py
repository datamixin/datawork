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

from pandas import DataFrame
from garut.contexts.context import Context
from garut.evaluations.evaluation import EvaluationFactory
from garut.instruction import Instruction, InstructionFactory
from dataminer_pb2 import *


class Mutation:
    def __init__(self, context: Context, name: str, options: Dict[str, any]):
        self._context = context
        self._name = name
        self._instruction = self._createInstruction(name)
        self._options: Dict[str, any] = options

    def _createInstruction(self, name: str) -> Instruction:
        factory = InstructionFactory.getInstance()
        return factory.create(name)

    def mutate(self, dataframe: DataFrame) -> DataFrame:
        options = self._toObjects(self._options)
        return self._instruction.execute(self._context, dataframe, options)

    def commit(self, dataframe: DataFrame) -> DataFrame:
        options = self._toObjects(self._options)
        return self._instruction.execute(self._context, dataframe, options)

    def _toObjects(self, options: Dict[str, any]) -> Dict[str, any]:
        factory: EvaluationFactory = EvaluationFactory.getInstance()
        return factory.evaluateOptions(self._context, options)

    @property
    def name(self):
        return self._name

    @property
    def options(self):
        return self._options

    @property
    def instruction(self):
        return self._instruction
