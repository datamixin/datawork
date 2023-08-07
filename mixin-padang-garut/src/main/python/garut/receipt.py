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
from typing import Dict, List
from garut.bearer import Bearer
from garut.foresee import Foresee
from garut.parameter import Parameter
from garut.storage import StorageFile
from garut.contexts.context import Context
from garut.calculable import Calculable
from garut.evaluations.evaluation import EvaluationFactory
from garut.contexts.receipt_context import InputProvider, ReceiptContext
from dataminer_pb2 import *


class Receipt(Foresee, Bearer, Calculable):
    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(context, folder)
        self._inputs: Dict[str, any] = {}

    def createParameters(self) -> List[Parameter]:
        parameters: List[Parameter] = []
        for name in self._inputs.keys():
            value = self._inputs.get(name)
            dtype = type(value)
            parameter = Parameter(name, dtype, value)
            parameters.append(parameter)
        return parameters

    def assignInput(self, request: ReceiptInputAssignRequest) -> AssignResponse:
        factory = EvaluationFactory.getInstance()
        result = factory.evaluate(self._context, request.expression)
        self._inputs[request.key.input] = result
        response = AssignResponse()
        response.assigned = True
        return response

    def renameInput(self, request: ReceiptInputRemoveRequest) -> RenameResponse:
        if request.oldName in self._inputs:
            self._inputs[request.newName] = self._inputs[request.oldName]
        del self._inputs[request.oldName]
        response = RenameResponse()
        response.renamed = True
        return response

    def removeInput(self, request: ReceiptInputRemoveRequest) -> AssignResponse:
        del self._inputs[request.key.input]
        response = RemoveResponse()
        response.removed = True
        return response

    def compute(self):
        pass


class ReceiptInputProvider(InputProvider):
    def __init__(self, context: Context, inputs: Dict[str, any]):
        self._context: Context = context
        self._inputs: Dict[str, any] = inputs

    def getInputNames(self) -> List[str]:
        return self._inputs.keys()

    def isInputExists(self, name: str):
        return name in self._inputs

    def getInput(self, name: str):
        return self._inputs[name]
