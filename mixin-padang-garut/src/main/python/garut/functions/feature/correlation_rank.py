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
from scipy.stats import spearmanr
from yellowbrick.features.rankd import kendalltau
from typing import Dict, List
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class CorrelationRank(Function):

    FUNCTION_NAME = "CorrelationRank"

    FEATURES = "features"
    ALGORITHM = "algorithm"

    LEFT = "left"
    RIGHT = "right"
    RESULT = "result"

    PEARSON = "pearson"
    COVARIANCE = "covariance"
    SPEARMAN = "spearman"
    KENDALLTAU = "kendalltau"

    ranking_methods = {}

    def __init__(self) -> None:
        super().__init__()
        self.ranking_methods[CorrelationRank.PEARSON] = lambda X: np.corrcoef(X.T)
        self.ranking_methods[CorrelationRank.COVARIANCE] = lambda X: np.cov(X.T)
        self.ranking_methods[CorrelationRank.SPEARMAN] = lambda X: spearmanr(X)[0]
        self.ranking_methods[CorrelationRank.KENDALLTAU] = lambda X: kendalltau(X)

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Features
        features: List[pd.Series] = options.get(CorrelationRank.FEATURES)
        if len(features) == 0:
            return Exception("Required at least one feature")
        names = [feature.name for feature in features]

        # Algorithm
        algorithm: str = options.get(CorrelationRank.ALGORITHM)
        if algorithm not in self.ranking_methods:
            return Exception("Missing algorithm {}".format(algorithm))

        # Correlate
        X = np.array(features).T
        left = pd.DataFrame(names, columns=["column"])
        result = self.ranking_methods[algorithm](X)
        result = [result] if isinstance(result, float) else result
        right = pd.DataFrame(result, columns=names)
        return pd.concat([left, right], axis=1)


parameters = [CorrelationRank.FEATURES, Parameter(CorrelationRank.ALGORITHM, str, CorrelationRank.PEARSON)]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(CorrelationRank.FUNCTION_NAME, CorrelationRank, parameters)
