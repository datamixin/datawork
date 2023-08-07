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
from typing import Dict


class BinaryOperation:
    def operate(self, left: any, right: any) -> any:
        raise Exception("{}.operate() is not implemented".format(type(self).__name__))


class BinaryOperationRegistry:
    instance = None

    def __init__(self):
        if BinaryOperationRegistry.instance != None:
            raise Exception("Use BinaryOperationRegistry.getInstance()")
        BinaryOperationRegistry.instance = self
        self._operations: Dict[str, BinaryOperation] = {}

    def getInstance():
        if BinaryOperationRegistry.instance == None:
            BinaryOperationRegistry()
        return BinaryOperationRegistry.instance

    def register(self, symbol: str, operation: BinaryOperation):
        self._operations[symbol] = operation

    def isExists(self, symbol: str) -> bool:
        return self._operations.get(symbol, None) is not None

    def get(self, symbol) -> BinaryOperation:
        operation = self._operations.get(symbol, None)
        if operation is None:
            raise Exception("Unknown binary operation '{}'".format(symbol))
        return operation
