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
from typing import List, Dict

import numpy as np
import pandas as pd
from garut.calculable import Calculable
from garut.contexts.context import Context
from garut.evaluations.lambda_evaluation import LambdaFunction
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from garut.functions.function import Function, FunctionModule, Parameter
from dataminer_pb2 import *
from evaluate_pb2 import *


class CallEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        call: EvaluateCall = expression.call
        self._callee = factory.create(call.callee)
        self._arguments: List[Evaluation] = []
        for argument in call.argument:
            oneOf = argument.WhichOneof("argument")
            if oneOf == "expression":
                evaluation = factory.create(argument.expression)
                self._arguments.append(evaluation)
            elif oneOf == "assignment":
                name = argument.assignment.name.name
                evaluation = factory.create(argument.assignment.expression)
                evaluation = NamedEvaluation(name, evaluation)
                self._arguments.append(evaluation)
            else:
                raise Exception("Unexpected argument {}".format(argument))

    def evaluate(self, context: Context) -> any:

        callee = self._callee.evaluate(context)
        if isinstance(callee, FunctionModule):

            # Function call
            function: Function = callee.type()
            options = self._createOptions(context, callee.parameters)
            for option in options.values():
                if isinstance(option, Exception):
                    return option
            result = function.execute(context, options)
            return result

        elif isinstance(callee, Calculable):

            # Calculable call
            series = None
            parameter = callee.createParameters()
            options = self._createOptions(context, parameter)
            for option in options.values():
                if isinstance(option, Exception):
                    return option
                elif isinstance(option, pd.Series):
                    if series is None:
                        array = np.array([None] * len(option))
                        series = pd.Series(array)

            # Calculable cannot accept series
            if series is not None:
                for i in range(len(series)):
                    args: Dict[str, any] = {}
                    for name in options.keys():
                        option = options.get(name)
                        if isinstance(option, pd.Series):
                            args[name] = option[i]
                        else:
                            args[name] = option
                    series[i] = callee.calculate(context, args)
                return series
            else:
                result = callee.calculate(context, options)
                return result

        elif isinstance(callee, LambdaFunction):
            options = self._createOptions(context, callee.parameters)
            for option in options.values():
                if isinstance(option, Exception):
                    return option
            result = callee.execute(context, options)
            return result

        elif isinstance(callee, Exception):
            return callee
        else:
            return Exception("Callee must be a function, but {} instead".format(type(callee)))

    def _createOptions(self, context: Context, parameters: List[Parameter]) -> Dict[str, any]:

        # Prepare
        positional = True
        options: Dict[str, any] = {}
        pairs: Dict[str, Parameter] = {}
        for parameter in parameters:
            pairs[parameter.name] = parameter

        # Specified
        for index in range(len(self._arguments)):
            evaluation = self._arguments[index]
            if isinstance(evaluation, Evaluation) and positional:
                parameter = parameters[index]
                value = evaluation.evaluate(context)
                if isinstance(value, Exception):
                    raise value
                options[parameter.name] = value
                pairs[parameter.name] = None
            else:
                if isinstance(evaluation, NamedEvaluation):
                    if evaluation.name in pairs:
                        parameter = pairs[evaluation.name]
                        if parameter is not None:
                            value = evaluation.evaluation.evaluate(context)
                            if isinstance(value, Exception):
                                raise value
                            options[parameter.name] = value
                            pairs[evaluation.name] = None
                        else:
                            raise Exception("Parameter '{}' already specified".format(evaluation.name))
                    else:
                        raise Exception("Unknown parameter '{}'".format(evaluation.name))
                    positional = False
                else:
                    raise Exception("Use named argument after positional argument")

        # Default
        for name in pairs:
            if pairs[name] is not None:
                options[name] = pairs[name].defaultValue

        return options


class NamedEvaluation:
    def __init__(self, name: str, evaluation: Evaluation):
        self._name = name
        self._evaluation = evaluation

    @property
    def name(self):
        return self._name

    @property
    def evaluation(self):
        return self._evaluation


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.call.DESCRIPTOR.name, CallEvaluation)
