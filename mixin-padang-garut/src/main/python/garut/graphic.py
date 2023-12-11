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
from garut.variable import Variable
from garut.storage import StorageFile
from garut.contexts.context import Context
from garut.evaluations.evaluation import EvaluationFactory
from garut.contexts.graphic_context import GraphicContext, VariableProvider
from dataminer_pb2 import *
from evaluate_pb2 import *


class Graphic:
    def __init__(self, context: Context, folder: StorageFile):
        self._variables: Dict[str, Variable] = {}
        self._folder = folder
        self._prepareContext(context)

    def _prepareContext(self, context: Context):
        provider = DiagramVariableProvider(self)
        self._context = GraphicContext(context, provider)

    def getContext(self):
        return self._context

    # =========================================================================
    # PREPARE
    # =========================================================================
    def prepareVariable(self, name: str, create: bool) -> PrepareResponse:
        response = PrepareResponse()
        if name in self._variables:
            response.created = False
        else:
            if create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                self._variables[name] = Variable(self._context, folder)
                response.created = True
            else:
                raise Exception("Graphic variable '{}' not prepared because create = False".format(name))
        return response

    # =========================================================================
    # ASSIGN
    # =========================================================================

    def assignVariableExpression(self, name: str, expression: EvaluateExpression) -> AssignResponse:
        variable = self._confirmVariable(name)
        return variable.assignExpression(expression)

    # =========================================================================
    # REMAME
    # =========================================================================

    def renameVariable(self, oldName: str, newName: str) -> RenameResponse:
        if oldName in self._variables:
            sheet = self._variables.pop(oldName)
            sheet.rename(newName)
            self._variables[newName] = sheet
            response = RenameResponse()
            response.renamed = True
            return response
        else:
            raise Exception("Missing variable '{}' to rename".format(oldName))

    # =========================================================================
    # SELECT
    # =========================================================================

    def evaluate(self, expression: EvaluateExpression) -> any:
        factory = EvaluationFactory.getInstance()
        return factory.evaluateResponse(self._context, expression)

    def computeVariable(self, name: str) -> any:
        variable = self._confirmVariable(name)
        return variable.compute()

    def isVariableExists(self, name: str) -> bool:
        return name in self._variables

    def getVariable(self, name: str):
        variable = self._confirmVariable(name)
        return variable

    # =========================================================================
    # EXPORT
    # =========================================================================

    def listVariableExportFormat(self, name: str) -> FormatListResponse:
        variable = self._confirmVariable(name)
        return variable.listExportFormat()

    def exportVariableResult(self, name: str, format: str) -> ExportResponse:
        variable = self._confirmVariable(name)
        return variable.exportResult(format)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeVariable(self, name: str) -> RemoveResponse:
        if name in self._variables:
            rawdata = self._variables.pop(name)
            rawdata.remove()
            response = RemoveResponse()
            response.removed = True
            return response
        else:
            raise Exception("Missing variable '{}' to be removed".format(name))

    def remove(self) -> any:
        for variable in self._variables.values():
            variable.remove()

    def _confirmVariable(self, name: str) -> Variable:
        if name in self._variables:
            return self._variables[name]
        raise Exception("Missing graphic variable '{}'".format(name))


class DiagramVariableProvider(VariableProvider):
    def __init__(self, graphic: Graphic):
        self._graphic = graphic

    def isVariableExists(self, variable: str) -> bool:
        return self._graphic.isVariableExists(variable)

    def getVariable(self, variable: str) -> any:
        return self._graphic.getVariable(variable)
