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
import numpy as np
import pandas as pd
from garut.contexts.context import Context
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class ConditionalEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        conditional: EvaluateConditional = expression.conditional
        self._logical = factory.create(conditional.logical)
        self._consequent = factory.create(conditional.consequent)
        self._alternate = factory.create(conditional.alternate)

    def evaluate(self, context: Context) -> any:
        logical = self._logical.evaluate(context)
        if isinstance(logical, pd.Series):
            consequent = self._consequent.evaluate(context)
            alternate = self._alternate.evaluate(context)
            series = np.select([logical], [consequent], alternate)
            return series
        else:
            if logical is True:
                return self._consequent.evaluate(context)
            else:
                return self._alternate.evaluate(context)


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.conditional.DESCRIPTOR.name, ConditionalEvaluation)
