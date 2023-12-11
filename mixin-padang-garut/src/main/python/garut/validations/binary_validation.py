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
from contexts.context import Context
from garut.validations.validation import Validation, ValidationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class BinaryValidation(Validation):
    def __init__(self, expression: EvaluateExpression):
        binary: EvaluateBinary = expression.binary
        self._left = factory.create(binary.left)
        self._right = factory.create(binary.right)

    def validate(self, context: Context, hoster: Context) -> any:
        self._left.validate(context, hoster)
        self._right.validate(context, hoster)


factory: ValidationFactory = ValidationFactory.getInstance()
factory.register(EvaluateExpression.binary.DESCRIPTOR.name, BinaryValidation)
