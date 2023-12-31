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
from sklearn.naive_bayes import GaussianNB

from garut.contexts.context import Context
from garut.functions.model.learning import ClassificationLearning
from garut.functions.function import Function, FunctionRegistry


class GaussianNaiveBayes(Function):

    FUNCTION_NAME = "GaussianNaiveBayes"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        return GaussianNaiveBayesLearner()


class GaussianNaiveBayesLearner(ClassificationLearning):
    def __init__(self) -> None:
        super().__init__()
        self._model = GaussianNB()


parameters = []
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(GaussianNaiveBayes.FUNCTION_NAME, GaussianNaiveBayes, parameters)
