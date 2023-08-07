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
import pandas as pd
from typing import Dict
from sklearn.base import BaseEstimator
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class Predict(Function):

    FUNCTION_NAME = "Predict"

    MODEL = "model"
    FEATURES = "features"
    PREDICTION = "prediction"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        model: BaseEstimator = options.get(Predict.MODEL)
        features = options.get(Predict.FEATURES)

        if isinstance(features, pd.DataFrame):
            X = features.to_numpy()
        else:
            X = np.array(features).T

        y = model.predict(X)

        return y


parameters = [Predict.MODEL, Predict.FEATURES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Predict.FUNCTION_NAME, Predict, parameters)
