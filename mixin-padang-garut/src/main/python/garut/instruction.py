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
from typing import Dict, Type
from garut.contexts.context import Context


class Instruction:
    def __init__(self, name: str):
        from garut.functions.function import Function, FunctionRegistry

        factory: FunctionRegistry = FunctionRegistry.getInstance()
        module = factory.get(name)
        self._function: Function = module.create()

    @property
    def function(self):
        return self._function

    def _injectDataset(self, dataframe: pd.DataFrame, options: Dict[str, any]):
        from garut.functions.dataset.dataset_function import DatasetFunction

        if isinstance(self._function, DatasetFunction):
            options[DatasetFunction.DATASET] = dataframe

    def execute(self, context: Context, dataframe: pd.DataFrame, options: Dict[str, any]) -> any:
        self._injectDataset(dataframe, options)
        try:
            for value in options.values():
                if isinstance(value, Exception):
                    return value
            return self._function.execute(context, options)
        except Exception as e:
            return e


class InstructionFactory:
    instance = None

    def __init__(self):
        if InstructionFactory.instance != None:
            raise Exception("Use InstructionFactory.getInstance()")
        InstructionFactory.instance = self
        self._types: Dict[str, Type[Instruction]] = {}

    def getInstance():
        if InstructionFactory.instance == None:
            InstructionFactory()
        return InstructionFactory.instance

    def registerInstruction(self, name: str):
        self._types[name] = Instruction

    def create(self, name) -> Instruction:
        type = self._types.get(name, None)
        if type is None:
            raise Exception("Unknown instruction for '{}' operation".format(name))
        return type(name)
