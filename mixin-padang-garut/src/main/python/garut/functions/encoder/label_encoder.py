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
from typing import Dict

from sklearn.preprocessing import LabelEncoder

from garut.contexts.context import Context
from garut.functions.encoder.encoder import Encoder
from garut.functions.function import Function, FunctionRegistry


class LabelEncoderFunction(Function):
    FUNCTION_NAME = "LabelEncoder"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        return LabelEncoderWrapper()


class LabelEncoderWrapper(Encoder):
    def __init__(self) -> None:
        super().__init__()
        self._encoder = LabelEncoder()
        self._assigned: LabelEncoder = None

    def encode(self, input: any) -> any:
        if isinstance(self._assigned, LabelEncoder):
            return self._assigned.transform(input)
        else:
            return self._encoder.fit_transform(input)


parameters = []
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(LabelEncoderFunction.FUNCTION_NAME, LabelEncoderFunction, parameters)
