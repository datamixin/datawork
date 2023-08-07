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
from typing import Dict
from garut.bearer import Bearer
from garut.container import Container
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.contexts.dataset_context import DatasetContext
from garut.functions.function import Function, FunctionRegistry


class FromDataset(Function):

    FUNCTION_NAME = "FromDataset"

    DATASET = "dataset"
    DISPLAY = "display"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        output = options[FromDataset.DATASET]
        dtype = type(output)
        if isinstance(output, Container):
            current = output.getContext()
            if isinstance(current, DatasetContext):
                display = options.get(FromDataset.DISPLAY, False)
                return output.getResult(display)
            elif isinstance(output, Bearer):
                return output.getResult()
            else:
                return Exception("Expect '{}' as a Dataset or a Bearer".format(dtype))
        elif isinstance(output, pd.DataFrame):
            return output
        else:
            return Exception("FromDataset expect container, actually is '{}'".format(dtype))


parameters = [FromDataset.DATASET, FromDataset.DISPLAY]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(FromDataset.FUNCTION_NAME, FromDataset, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(FromDataset.FUNCTION_NAME)
