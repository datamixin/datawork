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
from typing import Dict, Type
from garut.outlet import Outlet
from garut.figure import Figure
from garut.outcome import Outcome
from garut.storage import StorageFile
from garut.container import Container
from garut.contexts.context import Context
from garut.contexts.viewset_context import ViewsetContext, OutletProvider
from dataminer_pb2 import *


class Viewset(Container):
    def __init__(self, context: Context, folder: StorageFile):
        self._outlets: Dict[str, Outlet] = {}
        self._folder = folder
        self._prepareContext(context)

    def _prepareContext(self, context: Context):
        provider = ViewsetOutletProvider(self)
        self._context = ViewsetContext(context, provider)

    def getContext(self) -> Context:
        return self._context

    # =========================================================================
    # PREPARE
    # =========================================================================

    def prepareFigure(self, request: OutletPrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.outlet
        if name in self._outlets:
            response.created = False
        else:
            if request.create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                self._outlets[name] = Figure(self._context, folder)
                response.created = True
            else:
                raise Exception("Figure '{}' not prepared because create = False".format(name))
        return response

    def prepareOutcome(self, request: OutletPrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.outlet
        if name in self._outlets:
            response.created = False
        else:
            if request.create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                self._outlets[name] = Outcome(self._context, folder)
                response.created = True
            else:
                raise Exception("Variable '{}' not prepared because create = False".format(name))
        return response

    def prepareFigureVariable(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to prepare variable")
        return figure.prepareVariable(request)

    # =========================================================================
    # RENAME
    # =========================================================================

    def rename(self, name: str):
        self._folder.renameTo(name)

    def renameOutlet(self, request: OutletRenameRequest) -> RenameResponse:
        if request.oldName in self._outlets:
            outlet = self._outlets.pop(request.oldName)
            outlet.rename(request.newName)
            self._outlets[request.newName] = outlet
            response = RenameResponse()
            response.renamed = True
            return response
        else:
            raise Exception("Missing outlet '{}' to rename".format(request.oldName))

    def renameFigureVariable(self, request: FigureVariableRenameRequest) -> RenameResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to rename variable")
        return figure.renameVariable(request)

    # =========================================================================
    # ASSIGN
    # =========================================================================
    def assignOutcomeExpression(self, request: OutcomeExpressionAssignRequest) -> AssignResponse:
        outcome = self._confirmOutcome(request.key.outlet, "Missing outcome '{}' to assign expression")
        return outcome.assignExpression(request)

    def assignFigureVariableExpression(self, request: FigureVariableExpressionAssignRequest) -> AssignResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to assign variable expression")
        return figure.assignVariableExpression(request)

    # =========================================================================
    # APPLY
    # =========================================================================

    def computeOutcome(self, request: OutcomeComputeRequest) -> ApplyResponse:
        outcome = self._confirmOutcome(request.key.outlet, "Missing outcome '{}' to compute")
        return outcome.compute(request)

    def computeFigureVariable(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to compute")
        return figure.computeVariable(request)

    # =========================================================================
    # SELECT
    # =========================================================================

    def evaluateOnFigure(self, request: OnFigureEvaluateRequest) -> EvaluateResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to evaluate on")
        return figure.evaluate(request)

    def isOutletExists(self, name: str) -> bool:
        return name in self._outlets

    def getOutlet(self, name: str) -> Outlet:
        return self._outlets[name]

    # =========================================================================
    # EXPORT
    # =========================================================================

    def listFigureVariableExportFormat(self, request: FigureVariableExportFormatListRequest) -> FormatListResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to list figure variable export format")
        return figure.listVariableExportFormat(request)

    def listOutcomeExportFormat(self, request: OutcomeExportFormatListRequest) -> FormatListResponse:
        variable = self._confirmOutcome(request.key.outlet, "Missing outcome '{}' to list export format")
        return variable.listExportFormat(request)

    def exportFigureVariableResult(self, request: FigureVariableExportRequest) -> ExportResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to export figure variable result")
        return figure.exportVariableResult(request)

    def exportOutcomeResult(self, request: OutcomeExportRequest) -> ExportResponse:
        variable = self._confirmOutcome(request.key.outlet, "Missing outcome '{}' to export result")
        return variable.exportResult(request)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeFigureVariable(self, request: FigureVariableRemoveRequest) -> RemoveResponse:
        figure = self._confirmFigure(request.key.outlet, "Missing figure '{}' to remove variable")
        return figure.removeVariable(request)

    def removeOutlet(self, request: OutletRemoveRequest) -> RemoveResponse:
        name = request.key.outlet
        if name in self._outlets:
            outlet = self._outlets.pop(name)
            outlet.remove()
            response = RemoveResponse()
            response.removed = True
            return response
        else:
            raise Exception("Missing outlet '{}' to be removed".format(name))

    def remove(self) -> any:
        for outlet in self._outlets.values():
            outlet.remove()
        super().remove()

    # =========================================================================
    # CONFIRM
    # =========================================================================

    def _confirmFigure(self, name: str, message: str) -> Figure:
        return self._confirmOutlet(name, Figure, False, message)

    def _confirmOutcome(self, name: str, message: str) -> Outcome:
        return self._confirmOutlet(name, Outcome, False, message)

    def _confirmOutlet(self, name: str, type: Type, create: bool, message: str) -> Outlet:
        if name in self._outlets:
            outlet = self._outlets[name]
            if isinstance(outlet, type):
                return outlet
        else:
            if create:
                if self._folder.isFolderExists(name):
                    folder = self._folder.openFolder(name)
                    self._outlets[name] = type(self._context, folder)
                    return self._outlets[name]
        raise Exception(message.format(name))


class ViewsetOutletProvider(OutletProvider):
    def __init__(self, viewset: Viewset):
        self._viewset = viewset

    def isOutletExists(self, outlet: str) -> bool:
        return self._viewset.isOutletExists(outlet)

    def getOutlet(
        self,
        outlet: str,
    ) -> any:
        return self._viewset.getOutlet(outlet)
