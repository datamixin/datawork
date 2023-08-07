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
from typing import Dict
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class ObjectEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        object: EvaluateObject = expression.object
        self._object: Dict[str, Evaluation] = {}
        for field in object.field:
            name: EvaluateIdentifier = field.name
            value: EvaluateExpression = field.expression
            self._object[name.name] = factory.create(value)

    def evaluate(self, context: Context) -> any:
        values: Dict[str, any] = {}
        for name in self._object.keys():
            object = self._object[name]
            value = object.evaluate(context)
            values[name] = self.confirm(value)
        return values


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.object.DESCRIPTOR.name, ObjectEvaluation)
