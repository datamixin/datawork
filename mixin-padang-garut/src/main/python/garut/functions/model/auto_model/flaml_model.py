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
from flaml import AutoML
from garut.contexts.context import Context
from garut.functions.function import FunctionRegistry
from garut.functions.model.auto_model.auto_model import AutoModel
from garut.functions.model.learning import Learning, RegressionLearning, ClassificationLearning


class FlamlModel(AutoModel):

    FUNCTION_NAME = "FlamlModel"

    TASK = "task"

    LEARNERS: Dict[str, Type] = {}

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        task = self.get(options, FlamlModel.TASK)
        settings = self.get(options, FlamlModel.SETTINGS)
        learner = FlamlModel.LEARNERS[task]
        return learner(settings)


class FlamlRegressionLearner(RegressionLearning):
    def __init__(self, settings: Dict[str, any]) -> None:
        super().__init__()
        self._model = AutoML(task=Learning.REGRESSION)


FlamlModel.LEARNERS[Learning.REGRESSION] = FlamlRegressionLearner


class FlamlClassificationLearner(ClassificationLearning):
    def __init__(self, settings: Dict[str, any]) -> None:
        super().__init__()
        self._model = AutoML(task=Learning.CLASSIFICATION)


FlamlModel.LEARNERS[Learning.CLASSIFICATION] = FlamlClassificationLearner


parameters = [FlamlModel.TASK, FlamlModel.SETTINGS]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(FlamlModel.FUNCTION_NAME, FlamlModel, parameters)
