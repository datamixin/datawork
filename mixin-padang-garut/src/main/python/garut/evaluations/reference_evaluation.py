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
from garut.contexts.context import Context
from garut.contexts.alias_context import AliasContext
from garut.contexts.project_context import ProjectContext
from garut.contexts.dataminer_context import DataminerContext
from garut.evaluations.evaluation import Evaluation, EvaluationFactory
from evaluate_pb2 import *


class ReferenceEvaluation(Evaluation):
    def __init__(self, expression: EvaluateExpression):
        reference: EvaluateReference = expression.reference
        self._name: str = reference.name

    def getName(self):
        return self._name

    def evaluate(self, context: Context) -> any:

        # Looping melewati alias context
        while context.isFieldExists(self._name):
            owner = context.getFieldContext(self._name)
            if isinstance(owner, AliasContext):
                context = owner.getParent()
            else:
                field = context.getField(self._name)
                return field

        # Handling untitled reference
        dataminer: DataminerContext = context.getAncestor(DataminerContext)
        if dataminer.isFileUntitled(self._name):
            return Exception("Cannot reference to new unsaved {}, please save it first!".format(self._name))

        # Handling untitled project
        project: ProjectContext = context.getAncestor(ProjectContext)
        key = project.getKey()
        name = dataminer.getFileName(key)
        if dataminer.isFileUntitled(name):
            return Exception("Cannot reference from new unsaved {}, please save it first!".format(name))

        # Default missing
        return Exception("Missing reference '{}'".format(self._name))

    def __str__(self):
        return "Reference:" + self._name


factory: EvaluationFactory = EvaluationFactory.getInstance()
factory.register(EvaluateExpression.reference.DESCRIPTOR.name, ReferenceEvaluation)
