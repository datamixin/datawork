#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
import numpy as np
from typing import Dict
from garut.contexts.context import Context
from garut.functions.model.learning import Learning
from sklearn.model_selection import train_test_split
from garut.functions.function import Function, FunctionRegistry


class TrainTest(Function):

    FUNCTION_NAME = "TrainTest"
    LEARNING = "learning"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Learner
        learning: Learning = options.get(TrainTest.LEARNING)

        # Features
        features = options.get(Learning.FEATURES)
        X = np.array(features).T

        # Target
        y = options.get(Learning.TARGET)

        # Train - Test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        return learning.fitTestResult(X_train, X_test, y_train, y_test)


parameters = [TrainTest.LEARNING, Learning.FEATURES, Learning.TARGET]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(TrainTest.FUNCTION_NAME, TrainTest, parameters)
