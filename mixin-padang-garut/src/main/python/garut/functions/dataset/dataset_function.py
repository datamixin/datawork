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
import time
import numpy as np
import pandas as pd
from typing import Dict
from garut.bearer import Bearer
from garut.functions.function import Function


class DatasetFunction(Function):

    DATASET = "dataset"
    TYPE = "type"

    def __init__(self):
        self._span = 1000

    def _currentMillisecond(self) -> int:
        seconds = time.time()
        return int(seconds * 1000)

    def _generatedIndex(self, last: int) -> int:
        ms = self._currentMillisecond()
        if ms > last + self._span:
            return ms
        else:
            return last + self._span

    def _shiftIndex(self, dataFrame: pd.DataFrame, position: int) -> pd.DataFrame:
        newIndex = dataFrame.index.map(lambda x: x + self._span if x >= position else x)
        return dataFrame.reindex(newIndex)

    def forceObjectToString(self, dataFrame: pd.DataFrame) -> pd.DataFrame:
        for column in dataFrame.columns:
            if dataFrame[column].dtype.type == np.object_:
                classes = dataFrame[column].map(lambda x: type(x)).unique()
                if str in classes:
                    if len(classes) == 1 or (len(classes) == 2 and float in classes):
                        dataFrame[column] = dataFrame[column].astype("string")

        return dataFrame

    def forceObjectColumnsToString(dataFrame: pd.DataFrame) -> pd.DataFrame:
        function = DatasetFunction()
        return function.forceObjectToString(dataFrame)

    def getDatasetOption(self, options: Dict[str, any]) -> any:
        output = options.get(DatasetFunction.DATASET, None)
        if output is None:
            raise Exception("Required 'dataset' option")
        if isinstance(output, Exception):
            raise output
        if isinstance(output, Bearer):
            output = output.getResult()
        return output

    def getDataset(self, options: Dict[str, any]) -> pd.DataFrame:
        output = self.getDatasetOption(options)
        if isinstance(output, pd.DataFrame):
            return output
        else:
            raise Exception("Unexpected 'dataset' option type {}".format(type(output)))

    def createSeries(self, input: pd.Series, function: any) -> pd.Series:
        result = [None] * len(input)
        for i in range(len(input)):
            result[i] = function(input.values[i])
        return pd.Series(result)
