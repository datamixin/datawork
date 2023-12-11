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
from garut.foresee import Foresee
from garut.variable import Variable
from garut.container import Container
from garut.storage import StorageFile
from garut.contexts.context import Context
from garut.contexts.builder_context import BuilderContext, FieldProvider
from dataminer_pb2 import *


class Builder(Foresee, Container):
    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(context, folder)
        self._variables: Dict[str, Variable] = {}
        self._prepareContext(context)

    def _prepareContext(self, context: Context):
        provider = BuilderVariableProvider(self)
        self._context = BuilderContext(context, provider)

    # =========================================================================
    # PREPARE
    # =========================================================================
    def prepareVariable(self, request: BuilderVariablePrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.variable
        create = request.create
        if name in self._variables:
            response.created = False
        else:
            if create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                self._variables[name] = Variable(self._context, folder)
                response.created = True
            else:
                raise Exception("Builder variable '{}' not prepared because create = False".format(name))
        return response

    def prepareVariablePreparation(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.preparePreparation(request.create)

    # =========================================================================
    # ASSIGN
    # =========================================================================
    def assignVariableExpression(self, request: BuilderVariableExpressionAssignRequest) -> AssignResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.assignExpression(request.expression)

    # =========================================================================
    # INSERT
    # =========================================================================

    def insertVariableMutation(self, request: BuilderVariableMutationInsertRequest) -> InsertResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.insertMutation(request.index, request.order)

    def insertVariableDisplayMutation(self, request: BuilderVariableMutationInsertRequest) -> InsertResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.insertDisplayMutation(request.index, request.order)

    # =========================================================================
    # RENAME
    # =========================================================================
    def renameVariable(self, request: BuilderVariableRemoveRequest) -> RenameResponse:
        if request.oldName in self._variables:
            self._variables[request.newName] = self._variables[request.oldName]
        del self._variables[request.oldName]
        response = RenameResponse()
        response.renamed = True
        return response

    # =========================================================================
    # SELECT
    # =========================================================================

    def selectVariablePreparationResult(self, request: BuilderVariableMutationResultSelectRequest) -> SelectResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.selectPreparationResult(request.order)

    def selectVariableMutationResult(self, request: BuilderVariableMutationResultSelectRequest) -> SelectResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.selectMutationResult(request.index, request.order)

    def evaluateOnVariablePreparation(self, request: OnBuilderVariablePreparationEvaluateRequest) -> EvaluateResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.evaluateOnPreparation(request.expression)

    def isVariableExists(self, name: str) -> bool:
        return name in self._variables

    def getVariable(self, name: str):
        return self._confirmVariable(name)

    # =========================================================================
    # APPLY
    # =========================================================================

    def applyVariablePreparation(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.applyPreparation()

    def computeVariable(self, request: BuilderVariableComputeRequest) -> any:
        variable = self._confirmVariable(request.key.variable)
        return variable.compute()

    def computeVariablePreparation(self, request: BuilderVariableComputeRequest) -> ApplyResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.computePreparation()

    # ========================================================================
    # EXPORT
    # ========================================================================

    def listVariableExportFormat(self, request: BuilderVariableExportFormatListRequest) -> FormatListResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.listExportFormat(request)

    def exportVariableResult(self, request: BuilderVariableExportRequest) -> ExportResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.exportResult(request)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeVariableMutation(self, request: BuilderVariableMutationRemoveRequest) -> RemoveResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.removeMutation(request.index)

    def removeVariableDisplayMutation(self, request: BuilderVariableMutationRemoveRequest) -> RemoveResponse:
        variable = self._confirmVariable(request.key.variable)
        return variable.removeDisplayMutation(request.index)

    def removeVariable(self, request: BuilderVariableRemoveRequest) -> AssignResponse:
        del self._variables[request.key.variable]
        response = RemoveResponse()
        response.removed = True
        return response

    # =========================================================================
    # CONFIRM
    # =========================================================================

    def _confirmVariable(self, name: str) -> Variable:
        if name in self._variables:
            return self._variables[name]
        raise Exception("Missing builder variable '{}'".format(name))


class BuilderVariableProvider(FieldProvider):
    def __init__(self, modeler: Builder):
        self._modeler = modeler

    def isFieldExists(self, name: str) -> bool:
        return self._modeler.isVariableExists(name)

    def getField(self, name: str) -> any:
        if self._modeler.isVariableExists(name):
            return self._modeler.getVariable(name)
        else:
            return None
