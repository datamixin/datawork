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
from garut.container import Container
from garut.contexts.context import Context
from garut.validations.validation import Validation, ValidationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class ReferenceValidation(Validation):
    def __init__(self, expression: EvaluateExpression):
        reference: EvaluateReference = expression.reference
        self._name: str = reference.name

    def validate(self, context: Context, hoster: Context) -> any:

        # Existance
        if context.isFieldExists(self._name) == False:
            raise Exception("Missing reference '{}'".format(self._name))

        # Circular
        field = context.getField(self._name)
        if field is hoster:
            raise Exception("Circular reference using '{}'".format(self._name))
        elif isinstance(field, Container):
            target = field.getContext()
            if target is hoster:
                raise Exception("Circular reference using field '{}'".format(self._name))
            else:
                field.validate(context, hoster)


factory: ValidationFactory = ValidationFactory.getInstance()
factory.register(EvaluateExpression.reference.DESCRIPTOR.name, ReferenceValidation)
