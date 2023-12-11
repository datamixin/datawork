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
from typing import Dict, Type
from garut.contexts.context import Context
from dataminer_pb2 import *
from evaluate_pb2 import *


class Validation:
    def __init__(self, expression: EvaluateExpression):
        pass

    def validate(self, context: Context, hoster: Context) -> any:
        pass


class ValidationFactory:
    instance = None

    def __init__(self):
        if ValidationFactory.instance != None:
            raise Exception("Use ValidationFactory.getInstance()")
        ValidationFactory.instance = self
        self._types: Dict[str, Type[Validation]] = {}

    def getInstance():
        if ValidationFactory.instance == None:
            ValidationFactory()
        return ValidationFactory.instance

    def register(self, name: str, type: Type[Validation]):
        self._types[name] = type

    def create(self, expression: EvaluateExpression) -> Validation:
        if isinstance(expression, EvaluatePointer):
            name = expression.WhichOneof("pointer")
        else:
            name = expression.WhichOneof("expression")
        type = self._types.get(name, None)
        if type is None:
            return Validation(expression)
        return type(expression)

    def validate(self, context: Context, hoster: Context, expression: any) -> any:
        validation = self.create(expression)
        return validation.validate(context, hoster)
