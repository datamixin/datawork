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
from typing import List
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class ListEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        list: EvaluateList = expression.list
        self._list: List[Evaluation] = []
        for element in list.element:
            value = factory.create(element)
            self._list.append(value)

    def evaluate(self, context: Context) -> any:
        list: List[any] = []
        for element in self._list:
            value = element.evaluate(context)
            value = self.confirm(value)
            list.append(value)
        return list


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.list.DESCRIPTOR.name, ListEvaluation)
