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
from scipy.stats import pearsonr
from sklearn.feature_selection import mutual_info_regression
from typing import Dict, List
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry

# https://www.scikit-yb.org/en/latest/_modules/yellowbrick/target/feature_correlation.html
class RegressionCorrelation(Function):

    FUNCTION_NAME = "RegressionCorrelation"

    FEATURES = "features"
    TARGET = "target"
    METHOD = "method"

    FEATURE = "feature"
    CORRELATION = "correlation"

    PEARSON = "pearson"
    MUTUAL_INFO_REGRESSION = "mutual_info-regression"

    correlation_methods = {}

    def __init__(self) -> None:
        super().__init__()
        self.correlation_methods[RegressionCorrelation.MUTUAL_INFO_REGRESSION] = lambda X, y: mutual_info_regression(
            X, y
        )

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Features
        features: List[pd.Series] = options.get(RegressionCorrelation.FEATURES)
        if len(features) == 0:
            return Exception("Required at least one feature")
        names = [feature.name for feature in features]
        X = np.array(features).T

        # Regression
        y: pd.Series = options.get(RegressionCorrelation.TARGET)

        # Method
        method: str = options.get(RegressionCorrelation.METHOD)
        if method not in self.correlation_methods:
            if method != RegressionCorrelation.PEARSON:
                return Exception("Missing method {}".format(method))

        # Correlation
        if method == RegressionCorrelation.PEARSON:
            result = np.array([pearsonr(x, y)[0] for x in np.asarray(X).T])
        else:
            result = self.correlation_methods[method](X, y)
        return pd.DataFrame({RegressionCorrelation.FEATURE: names, RegressionCorrelation.CORRELATION: result})


parameters = [
    RegressionCorrelation.FEATURES,
    RegressionCorrelation.TARGET,
    Parameter(RegressionCorrelation.METHOD, str, RegressionCorrelation.PEARSON),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(RegressionCorrelation.FUNCTION_NAME, RegressionCorrelation, parameters)
