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
from typing import Dict

import sklearn.tree as tree

from garut.contexts.context import Context
from garut.functions.model.learning import ClassificationLearning
from garut.functions.function import Function, FunctionRegistry


class DecisionTreeClassifier(Function):

    FUNCTION_NAME = "DecisionTreeClassifier"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        return DecisionTreeClassifierLearner()


class DecisionTreeClassifierLearner(ClassificationLearning):
    def __init__(self) -> None:
        super().__init__()
        self._model = tree.DecisionTreeClassifier()


parameters = []
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(DecisionTreeClassifier.FUNCTION_NAME, DecisionTreeClassifier, parameters)
