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
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.invocations.invocation import Invocation
from garut.functions.function import FunctionRegistry
from garut.contexts.data_frame_context import DataFrameContext
from garut.evaluations.lambda_evaluation import LambdaFunction
from garut.functions.dataset.dataset_function import DatasetFunction


class AddColumn(DatasetFunction):

    FUNCTION_NAME = "AddColumn"

    NAME = "name"
    EXPRESSION = "expression"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset = self.getDataset(options)
        dataframe = dataset.copy()
        mapper = AddMapper(context, options)
        mapper(dataframe)
        return dataframe


class AddMapper:

    TYPE_MAP = {np.str_: "string", np.bool_: "bool"}

    def __init__(self, context: Context, options: Dict[str, any]):
        self._context = context
        self._options = options

    def __call__(self, input: pd.DataFrame):
        context = DataFrameContext(self._context, input)
        expression: Invocation = self._options.get(AddColumn.EXPRESSION, None)
        if expression is not None:
            column = self._options.get(AddColumn.NAME, "Column")
            try:
                result = expression.invoke(context)
                if isinstance(result, LambdaFunction):
                    call = LambdaCall(context, result)
                    length = len(input)
                    input[column] = np.zeros(length)
                    input[column] = input[column].apply(call)
                else:
                    input[column] = result

                # Apply object to string
                dtype = input[column].dtype.type
                if dtype in AddMapper.TYPE_MAP:
                    ptype = AddMapper.TYPE_MAP[dtype]
                    input[column] = input[column].astype(ptype)
            except Exception as e:
                input[column] = e
        return input


class LambdaCall:
    def __init__(self, context: Context, function: LambdaFunction):
        self._context = context
        self._function = function

    def __call__(self, arg: any):
        args: Dict[str, any] = {}
        arg0 = self._function.parameters[0].name
        args[arg0] = arg
        return self._function.execute(self._context, args)


parameters = [DatasetFunction.DATASET, AddColumn.NAME, AddColumn.EXPRESSION]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(AddColumn.FUNCTION_NAME, AddColumn, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(AddColumn.FUNCTION_NAME)
