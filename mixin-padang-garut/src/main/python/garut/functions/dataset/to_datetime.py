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
import pandas

from typing import Dict
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.datetime import datetime_format as dtf
from garut.functions.dataset.dataset_function import DatasetFunction


class ToDatetime(DatasetFunction):

    FUNCTION_NAME = "ToDatetime"

    COLUMN = "column"
    FORMAT = "format"
    AUTO_DETECT = "autoDetect"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        dataset = self.getDataset(options)

        column = options.get(ToDatetime.COLUMN)
        format = options.get(ToDatetime.FORMAT, None)
        autoDetect = options.get(ToDatetime.AUTO_DETECT, False)

        dataFrame = dataset.copy()
        series = dataFrame[column]

        if format is not None and dtf.getGroups(format) == "yq":

            # Parsing for quarter using standart YYYYQQ pandas format
            qPos = format.find("Q")
            if qPos > 0:
                series = series.str.replace(r"(\d+).*Q(\d)", r"\1Q\2")
            elif qPos == 0:
                series = series.str.replace(r"Q(\d).*(\d{4})", r"\2Q\1")
            else:
                return Exception("Quarterly format required 'Q' directive")
            dataFrame[column] = pandas.to_datetime(series, infer_datetime_format=autoDetect)

        else:

            # Standard python strptime format
            if format is not None:
                format = dtf.getFromLuxon(format)
            dataFrame[column] = pandas.to_datetime(series, format=format, infer_datetime_format=autoDetect)

        return dataFrame


parameters = [
    DatasetFunction.DATASET,
    ToDatetime.COLUMN,
    Parameter(ToDatetime.FORMAT, str, None),
    Parameter(ToDatetime.AUTO_DETECT, bool, False),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ToDatetime.FUNCTION_NAME, ToDatetime, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ToDatetime.FUNCTION_NAME)
