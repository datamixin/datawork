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
from typing import List, Dict, Type
from garut.parameter import Parameter
from garut.contexts.context import Context


class Function:

    CREDENTIAL = "credential"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        raise Exception("{}.evaluate() is not immplemented".format(type(self).__name__))

    def get(self, options: Dict[str, any], name: str) -> any:
        if name in options:
            return options[name]
        else:
            raise Exception("Missing function option '{}'".format(name))


class FunctionModule:
    def __init__(self, name: str, type: Type[Function], parameters: List[any]):
        self._name = name
        self._type = type
        self._prepareParameters(parameters)

    def _prepareParameters(self, arguments: List[any]):
        self._parameters: List[Parameter] = []
        for argument in arguments:
            if isinstance(argument, str):
                self._parameters.append(Parameter(argument))
            elif isinstance(argument, Parameter):
                self._parameters.append(argument)
            else:
                raise Exception("Expected str or parameter instead of {}".format(argument))

    @property
    def name(self) -> str:
        return self._name

    @property
    def type(self) -> Type[Function]:
        return self._type

    @property
    def parameters(self) -> List[Parameter]:
        return self._parameters

    def create(self) -> Function:
        return self._type()


class FunctionRegistry:
    instance = None

    def __init__(self):
        if FunctionRegistry.instance != None:
            raise Exception("Use FunctionRegistry.getInstance()")
        FunctionRegistry.instance = self
        self._modules: Dict[str, FunctionModule] = {}

    def getInstance():
        if FunctionRegistry.instance == None:
            FunctionRegistry()
        return FunctionRegistry.instance

    def register(self, name: str, type: Type[Function], parameters: List[str]):
        self._modules[name] = FunctionModule(name, type, parameters)

    def isExists(self, name: str) -> bool:
        return self._modules.get(name, None) is not None

    def get(self, name) -> FunctionModule:
        if name in self._modules:
            return self._modules[name]
        else:
            raise Exception("Unknown function '{}'".format(name))
