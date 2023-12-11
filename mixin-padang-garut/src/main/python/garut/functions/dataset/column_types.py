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
from typing import Dict, List
import numpy as np
import pandas as pd
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class ColumnTypes(DatasetFunction):

    FUNCTION_NAME = "ColumnTypes"

    START = "start"
    END = "end"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        start = options["start"]
        end = options["end"]
        if end == -1:
            end = len(dataset.dtypes)
        types: List[str] = []
        for column in dataset.columns[start:end]:
            name: str = column
            ctype = dataset[name].dtype.type
            ctypeName = ctype.__name__.lower()
            if ctype == np.object_:

                # Classes list
                classes = dataset[name].map(ColumnTypes._typeOf).unique()
                classes = list(classes)

                # Remove none type
                noneType = type(None)
                if noneType in classes:
                    classes.remove(noneType)

                # Get type name
                if len(classes) == 1:
                    ctype = np.object_ if issubclass(classes[0], dict) else classes[0]
                    ctypeName = "table" if ctype == pd.DataFrame else ctype.__name__
                    ctypeName = "object" if ctype == np.object_ else ctypeName
                else:
                    ctypeName = "unknown"

                # Change type to str if applicable
                if ctypeName == str.__name__:
                    dataset[name] = dataset[name].astype("string")
            types.append(ctypeName)
        return types

    def _typeOf(x: any):
        if isinstance(x, Bearer):
            x = x.getResult()
        return type(x)


parameters = [DatasetFunction.DATASET, ColumnTypes.START, ColumnTypes.END]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(ColumnTypes.FUNCTION_NAME, ColumnTypes, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(ColumnTypes.FUNCTION_NAME)
