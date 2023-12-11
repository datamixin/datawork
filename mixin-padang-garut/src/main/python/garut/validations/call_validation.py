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
from garut.contexts.context import Context
from garut.validations.validation import Validation, ValidationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class CallValidation(Validation):
    def __init__(self, expression: EvaluateExpression):
        call: EvaluateCall = expression.call
        self._callee = factory.create(call.callee)
        self._arguments: List[Validation] = []
        for argument in call.argument:
            oneOf = argument.WhichOneof("argument")
            if oneOf == "expression":
                validation = factory.create(argument.expression)
                self._arguments.append(validation)
            elif oneOf == "assignment":
                validation = factory.create(argument.assignment.expression)
                self._arguments.append(validation)
            else:
                raise Exception("Unexpected argument {}".format(argument))

    def validate(self, context: Context, hoster: Context) -> any:
        self._callee.validate(context, hoster)
        for validation in self._arguments:
            validation.validate(context, hoster)


factory: ValidationFactory = ValidationFactory.getInstance()
factory.register(EvaluateExpression.call.DESCRIPTOR.name, CallValidation)
