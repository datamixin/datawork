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
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.evaluations.lambda_evaluation import LambdaFunction
from garut.functions.function import Function, FunctionRegistry


class GenerateDataset(Function):

    FUNCTION_NAME = "GenerateDataset"

    GENERATOR = "generator"
    START = "start"
    STOP = "stop"
    STEP = "step"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        generator: LambdaFunction = options[GenerateDataset.GENERATOR]
        if len(generator.parameters) != 1:
            return ValueError("Generator function must specify one parameter")

        start = options[GenerateDataset.START]
        stop = options[GenerateDataset.STOP]
        step = options[GenerateDataset.STEP]

        X: List[int] = []
        Y: List[any] = []
        args: Dict[str, any] = {}
        arg = generator.parameters[0].name

        for x in np.arange(start, stop, step):
            args[arg] = x
            y = generator.execute(context, args)
            X.append(x)
            Y.append(y)

        dataFrame = pd.DataFrame({"x": X, "y": Y})
        return dataFrame


parameters = [
    GenerateDataset.GENERATOR,
    GenerateDataset.START,
    GenerateDataset.STOP,
    Parameter(GenerateDataset.STEP, int, 1),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(GenerateDataset.FUNCTION_NAME, GenerateDataset, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(GenerateDataset.FUNCTION_NAME)
