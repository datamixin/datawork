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
import numpy as np
import pandas as pd
from sklearn.feature_selection import mutual_info_classif
from typing import Dict, List
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class ClassificationCorrelation(Function):

    FUNCTION_NAME = "ClassificationCorrelation"

    FEATURES = "features"
    TARGET = "target"
    METHOD = "method"

    FEATURE = "feature"
    CORRELATION = "correlation"

    MUTUAL_INFO_CLASSIFICATION = "mutual_info-classification"

    correlation_methods = {}

    def __init__(self) -> None:
        super().__init__()
        self.correlation_methods[
            ClassificationCorrelation.MUTUAL_INFO_CLASSIFICATION
        ] = lambda X, y: mutual_info_classif(X, y)

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Features
        features: List[pd.Series] = options.get(ClassificationCorrelation.FEATURES)
        if len(features) == 0:
            return Exception("Required at least one feature")
        names = [feature.name for feature in features]
        X = np.array(features).T

        # Classification
        y: pd.Series = options.get(ClassificationCorrelation.TARGET)

        # Method
        method: str = options.get(ClassificationCorrelation.METHOD)
        if method not in self.correlation_methods:
            return Exception("Missing method {}".format(method))

        # Correlation
        result = self.correlation_methods[method](X, y)
        return pd.DataFrame({ClassificationCorrelation.FEATURE: names, ClassificationCorrelation.CORRELATION: result})


parameters = [
    ClassificationCorrelation.FEATURES,
    ClassificationCorrelation.TARGET,
    Parameter(ClassificationCorrelation.METHOD, str, ClassificationCorrelation.MUTUAL_INFO_CLASSIFICATION),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ClassificationCorrelation.FUNCTION_NAME, ClassificationCorrelation, parameters)
