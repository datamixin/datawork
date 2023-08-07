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


class UnaryOperation:
    def operate(self, argument: any) -> any:
        raise Exception("{}.operate() is not implemented".format(type(self).__name__))


class UnaryOperationRegistry:
    instance = None

    def __init__(self):
        if UnaryOperationRegistry.instance != None:
            raise Exception("Use UnaryOperationRegistry.getInstance()")
        UnaryOperationRegistry.instance = self
        self._operations: Dict[str, UnaryOperation] = {}

    def getInstance():
        if UnaryOperationRegistry.instance == None:
            UnaryOperationRegistry()
        return UnaryOperationRegistry.instance

    def register(self, symbol: str, operation: UnaryOperation):
        self._operations[symbol] = operation

    def isExists(self, symbol: str) -> bool:
        return self._operations.get(symbol, None) is not None

    def get(self, symbol) -> UnaryOperation:
        operation = self._operations.get(symbol, None)
        if operation is None:
            raise Exception("Unknown unary operation '{}'".format(symbol))
        return operation
