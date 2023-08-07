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
from typing import List
from garut.contexts.context import Context
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from garut.operations.binary_operation import BinaryOperationRegistry
from dataminer_pb2 import *
from evaluate_pb2 import *


class BinaryEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        binary: EvaluateBinary = expression.binary
        self._left = factory.create(binary.left)
        self._right = factory.create(binary.right)
        registry: BinaryOperationRegistry = BinaryOperationRegistry.getInstance()
        self._operation = registry.get(binary.operator)

    def evaluate(self, context: Context) -> any:

        # Left
        left = self._left.evaluate(context)
        if isinstance(left, Exception):
            return left

        # Right
        right = self._right.evaluate(context)
        if isinstance(right, Exception):
            return right

        arrayed = False
        if isinstance(left, pd.Series):
            if issubclass(left.dtype.type, pd.Timestamp):
                left = left.values
                arrayed = True

        if isinstance(right, pd.Series):
            if issubclass(right.dtype.type, pd.Timestamp):
                right = right.values
                arrayed = True

        try:
            result = self._operation.operate(left, right)
        except Exception as e:
            arrayed = True
            if isinstance(left, pd.Series) and isinstance(right, pd.Series):
                result = [None] * len(left)
                for i in range(len(left)):
                    self._operate(result, i, left.values[i], right.values[i])
            elif isinstance(left, pd.Series):
                result = [None] * len(left)
                for i in range(len(left)):
                    self._operate(result, i, left.values[i], right)
            elif isinstance(right, pd.Series):
                result = [None] * len(right)
                for i in range(len(right)):
                    self._operate(result, i, left, right.values[i])
            else:
                return e

        if arrayed:
            return pd.Series(result)
        else:
            return result

    def _operate(self, result: List[any], index: int, left: any, right: any):
        try:
            result[index] = self._operation.operate(left, right)
        except Exception as e:
            result[index] = e


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.binary.DESCRIPTOR.name, BinaryEvaluation)
