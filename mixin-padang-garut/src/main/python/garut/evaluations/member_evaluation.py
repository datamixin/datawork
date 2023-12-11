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
import pandas as pd
import collections as coll
from typing import List, Dict
from garut.bearer import Bearer
from garut.container import Container
from garut.contexts.context import Context
from garut.evaluations.constant_evaluation import ConstantEvaluation
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from garut.evaluations.reference_evaluation import ReferenceEvaluation
from dataminer_pb2 import *
from evaluate_pb2 import *


class MemberEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        member: EvaluateMember = expression.member
        self._object = factory.create(member.object)
        self._property = factory.create(member.property)

    def evaluate(self, context: Context) -> any:

        # Object
        object = self._object.evaluate(context)
        if isinstance(object, Exception):
            return object

        # Property
        if isinstance(self._property, ConstantEvaluation):
            property = self._property.evaluate(context)
        elif isinstance(self._property, ReferenceEvaluation):
            property = self._property.getName()

        # Container
        if isinstance(object, Container):
            if isinstance(object, Bearer):
                object = object.getResult()
            else:
                current = object.getContext()
                if current.isFieldExists(property):
                    return current.getField(property)
                else:
                    return Exception("Missing {} field {}".format(type(object).__name__, property))

        # DataFrame
        if isinstance(object, pd.DataFrame):
            if property in object.columns:
                return object[property]
            else:
                return Exception("Missing column {}".format(property))

        # List
        elif isinstance(object, List):
            list: List[any] = object
            if property < len(object):
                return list[property]
            else:
                return Exception("{} out of list member".format(property))

        # Dictionary
        elif isinstance(object, Dict):
            dict: Dict[str, any] = object
            if dict.get(property, None) is not None:
                return dict.get(property)
            else:
                return Exception("{} not one of object member".format(property))

        else:

            if isinstance(property, str) and hasattr(object, property):

                # Object
                return getattr(object, property)

            elif isinstance(property, int) and isinstance(object, coll.Iterable):

                # Iterable
                return object[property]

            else:

                # Unknown
                dtype = type(object)
                return Exception("Unknown member object '{}.{}'".format(dtype, property))


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.member.DESCRIPTOR.name, MemberEvaluation)
