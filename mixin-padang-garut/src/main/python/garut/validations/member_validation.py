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
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.validations.validation import Validation, ValidationFactory
from dataminer_pb2 import *
from evaluate_pb2 import *


class MemberValidation(Validation):
    def __init__(self, expression: EvaluateExpression):
        member: EvaluateMember = expression.member
        self._prepareObject(member)
        self._property = factory.create(member.property)

    def _prepareObject(self, member: EvaluateMember):
        from garut.evaluations.evaluation import EvaluationFactory

        fabric = EvaluationFactory.getInstance()
        self._object = fabric.create(member.object)

    def validate(self, context: Context, hoster: Context) -> any:

        # Object
        object = self._object.evaluate(context)
        if isinstance(object, Exception):
            return object

        # Bearer
        if isinstance(object, Bearer):
            current = object.getContext()
            return self._property.validate(current, hoster)


factory: ValidationFactory = ValidationFactory.getInstance()
factory.register(EvaluateExpression.member.DESCRIPTOR.name, MemberValidation)
