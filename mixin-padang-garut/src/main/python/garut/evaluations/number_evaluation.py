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
from garut.contexts.context import Context
from garut.evaluations.evaluation import EvaluationFactory
from garut.evaluations.constant_evaluation import ConstantEvaluation
from dataminer_pb2 import *
from evaluate_pb2 import *


class NumberEvaluation(ConstantEvaluation):
    def __init__(self, expression: EvaluateExpression):
        number: EvaluateNumber = expression.number
        value = number.WhichOneof("value")
        if value == EvaluateNumber.int32.DESCRIPTOR.name:
            self._value = number.int32
        elif value == EvaluateNumber.int64.DESCRIPTOR.name:
            self._value = number.int64
        elif value == EvaluateNumber.float.DESCRIPTOR.name:
            self._value = number.float
        elif value == EvaluateNumber.double.DESCRIPTOR.name:
            self._value = number.double

    def evaluate(self, context: Context) -> any:
        return self._value


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.number.DESCRIPTOR.name, NumberEvaluation)
