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
import pandas as pd
from scipy.stats import shapiro
from typing import Dict, List
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class VariableRank(Function):

    FUNCTION_NAME = "VariableRank"

    FEATURES = "features"
    ALGORITHM = "algorithm"

    VARIABLE = "variable"
    RESULT = "result"

    SAPHIRO = "shapiro"

    ranking_methods = {}

    def __init__(self) -> None:
        super().__init__()
        self.ranking_methods[VariableRank.SAPHIRO] = lambda X: shapiro(X)[0]

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Options
        features: List[pd.Series] = options.get(VariableRank.FEATURES)

        # Algorithm
        algorithm: str = options.get(VariableRank.ALGORITHM)
        if algorithm not in self.ranking_methods:
            return Exception("Missing algorithm {}".format(algorithm))

        variables: List[str] = []
        results: List[float] = []
        for feature in features:
            variables.append(feature.name)
            result = self.ranking_methods[algorithm](feature)
            results.append(result)

        return pd.DataFrame({VariableRank.VARIABLE: variables, VariableRank.RESULT: results})


parameters = [VariableRank.FEATURES, Parameter(VariableRank.ALGORITHM, str, VariableRank.SAPHIRO)]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(VariableRank.FUNCTION_NAME, VariableRank, parameters)
