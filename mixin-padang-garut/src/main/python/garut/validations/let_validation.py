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
from garut.contexts.context import Context
from garut.contexts.let_context import LetContext, LetVariable
from garut.validations.validation import Validation, ValidationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class LetValidation(Validation):
    def __init__(self, expression: EvaluateExpression):
        let: EvaluateLet = expression.let
        self._variables: Dict[str, LetVariable] = {}
        for variable in let.variable:
            identifier: EvaluateIdentifier = variable.name
            name = identifier.name
            from garut.evaluations.evaluation import Evaluation, EvaluationFactory

            fabric: EvaluationFactory = EvaluationFactory.getInstance()
            evaluation: Evaluation = fabric.create(variable.expression)
            self._variables[name] = LetVariable(name, evaluation)
        self._result = factory.create(let.result)

    def validate(self, context: Context, hoster: Context) -> any:
        context = LetContext(context, self._variables)
        self._result.validate(context, hoster)


factory: ValidationFactory = ValidationFactory.getInstance()
factory.register(EvaluateExpression.let.DESCRIPTOR.name, LetValidation)
