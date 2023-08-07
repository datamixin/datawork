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
import time
from typing import Dict, Type
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.converter import ConverterRegistry
from dataminer_pb2 import *
from evaluate_pb2 import *


class Evaluation:
    def __init__(self, expression: EvaluateExpression):
        raise Exception("{}.__init__() is not implemented".format(type(self).__name__))

    def evaluate(self, context: Context) -> any:
        raise Exception("{}.evaluate() is not implemented".format(type(self).__name__))

    def confirm(self, value: any) -> any:
        if isinstance(value, Exception):
            return value
        if isinstance(value, Bearer):
            value = value.getResult()
        return value


class EvaluationFactory:
    instance = None

    def __init__(self):
        if EvaluationFactory.instance != None:
            raise Exception("Use EvaluationFactory.getInstance()")
        EvaluationFactory.instance = self
        self._types: Dict[str, Type[Evaluation]] = {}

    def getInstance():
        if EvaluationFactory.instance == None:
            EvaluationFactory()
        return EvaluationFactory.instance

    def register(self, name: str, type: Type[Evaluation]):
        self._types[name] = type

    def create(self, expression: EvaluateExpression) -> Evaluation:
        if isinstance(expression, EvaluatePointer):
            name = expression.WhichOneof("pointer")
        else:
            name = expression.WhichOneof("expression")
        type = self._types.get(name, None)
        if type is None:
            raise Exception("Unknown evaluation for '{}'".format(name))
        return type(expression)

    def evaluate(self, context: Context, expression: any) -> any:
        try:
            evaluation = self.create(expression)
            return evaluation.evaluate(context)
        except Exception as e:
            return e

    def evaluateOptions(self, context: Context, options: Dict[str, any]) -> Dict[str, any]:
        values: Dict[str, any] = {}
        for name in options.keys():
            expression = options[name]
            values[name] = self.evaluate(context, expression)
        return values

    def evaluateResponse(self, context: Context, expression: any) -> any:

        # Evaluate
        pre = time.time()
        result = self.evaluate(context, expression)

        # Convert
        mid = time.time()
        registry: ConverterRegistry = ConverterRegistry.getInstance()
        response = EvaluateResponse()
        value = registry.toValue(result)
        response.value.CopyFrom(value)
        end = time.time()
        print("evaluate={} ms & convert={} ms".format(round((mid - pre) * 1000), round((end - mid) * 1000)))
        return response
