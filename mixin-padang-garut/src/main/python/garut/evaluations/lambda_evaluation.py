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
from typing import Dict, List
from garut.prototype import Prototype
from garut.contexts.context import Context
from garut.contexts.lambda_context import LambdaContext
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class LambdaEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        self._expression = expression

    def evaluate(self, context: Context) -> any:
        return LambdaFunction(self._expression)


class LambdaFunction(Prototype):
    def __init__(self, expression: EvaluateExpression) -> None:
        self._lambda = getattr(expression, "lambda")
        self._parameters: List[str] = []
        for parameter in self._lambda.parameter:
            self._parameters.append(parameter)
        self._result = factory.create(self._lambda.expression)

    def getLiteral(self) -> any:
        return "LambdaFunction"

    @property
    def parameters(self) -> List[str]:
        return self._parameters

    def execute(self, context: Context, options: Dict[str, any]):
        lambdaContext = LambdaContext(context, options)
        return self._result.evaluate(lambdaContext)


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(getattr(EvaluateExpression, "lambda").DESCRIPTOR.name, LambdaEvaluation)
