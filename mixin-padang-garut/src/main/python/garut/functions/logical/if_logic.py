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
from typing import Dict
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class If(Function):

    FUNCTION_NAME = "If"

    LOGICAL = "value"
    CONSEQUENT = "consequent"
    ALTERNATE = "alternate"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        logical = options[If.LOGICAL]
        consequent = options[If.CONSEQUENT]
        alternate = options[If.ALTERNATE]
        if isinstance(logical, pd.Series):
            return np.where(logical, consequent, alternate)
        else:
            if logical is True:
                return consequent
            else:
                return alternate


class Branch:
    def __init__(self, options: Dict[str, any]):
        self._options = options

    def __call__(self, value: any):
        if value is True:
            consequent = self._options[If.CONSEQUENT]
            return consequent
        else:
            alternate = self._options[If.ALTERNATE]
            return alternate


parameters = [If.LOGICAL, If.CONSEQUENT, If.ALTERNATE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(If.FUNCTION_NAME, If, parameters)
