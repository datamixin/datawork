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
import pandas as pd

from garut.operations.binary_operation import BinaryOperation, BinaryOperationRegistry


class MultiplyBinaryOperation(BinaryOperation):
    def operate(self, left: any, right: any) -> any:
        if isinstance(left, pd.Series) and left.dtype.str == str:
            return Exception("Cannot multiply left part string")
        elif isinstance(right, pd.Series) and right.dtype.str == str:
            return Exception("Cannot multiply right part string")
        return left * right


registry: BinaryOperationRegistry = BinaryOperationRegistry.getInstance()
registry.register("*", MultiplyBinaryOperation())
