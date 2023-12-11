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
from typing import Dict, List
from garut.contexts.context import Context
from yellowbrick.features import RadialVisualizer
from garut.functions.function import Function, FunctionRegistry


class RadViz(Function):

    FUNCTION_NAME = "RadViz"

    FEATURES = "features"
    TARGET = "target"

    POINTS = "points"
    CORNERS = "corners"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Options
        features: List[pd.Series] = options.get(RadViz.FEATURES)
        target: pd.Series = options.get(RadViz.TARGET)

        # Shape of the data
        ncols = len(features)
        X = np.array(features).T
        y = np.array(target)

        # Remove nulls
        x_nans = pd.isnull(X).any(axis=1)
        y_nans = pd.isnull(y)
        unioned_nans = np.logical_or(x_nans, y_nans)
        X = X[~unioned_nans]
        y = y[~unioned_nans]

        # Create a data structure to hold scatter plot representations
        points: List[List[any]] = []

        # Compute the arcs around the circumference for each feature axis
        corners = np.array([(np.cos(t), np.sin(t)) for t in [2.0 * np.pi * (i / float(ncols)) for i in range(ncols)]])

        # Compute the locations of the scatter plot for each class
        # Normalize the data first to plot along the 0, 1 axis
        normalized = RadialVisualizer.normalize(X)
        for i, row in enumerate(normalized):
            row_ = np.repeat(np.expand_dims(row, axis=1), 2, axis=1)
            rowsum = row.sum()
            if rowsum > 0:
                xy = (corners * row_).sum(axis=0) / rowsum
                points.append([xy[0], xy[1], y[i]])

        return {RadViz.POINTS: points, RadViz.CORNERS: corners}


parameters = [RadViz.FEATURES, RadViz.TARGET]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(RadViz.FUNCTION_NAME, RadViz, parameters)
