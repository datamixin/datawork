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
from garut.outlet import Outlet
from garut.viewset import Viewset
from garut.foresee import Foresee
from garut.storage import StorageFile
from garut.container import Container
from garut.contexts.context import Context
from dataminer_pb2 import *


class Outlook(Foresee, Container):
    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(context, folder)
        self._viewset = Viewset(context, folder)

    def getContext(self) -> Context:
        return self._viewset.getContext()

    # =========================================================================
    # PREPARE
    # =========================================================================

    def prepareFigure(self, request: OutletPrepareRequest) -> PrepareResponse:
        return self._viewset.prepareFigure(request)

    def prepareOutcome(self, request: OutletPrepareRequest) -> PrepareResponse:
        return self._viewset.prepareOutcome(request)

    def prepareFigureVariable(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        return self._viewset.prepareFigureVariable(request)

    # =========================================================================
    # RENAME
    # =========================================================================

    def rename(self, name: str):
        self._viewset.rename(name)

    def renameOutlet(self, request: OutletRenameRequest) -> RenameResponse:
        return self._viewset.renameOutlet(request)

    def renameFigureVariable(self, request: FigureVariableRenameRequest) -> RenameResponse:
        return self._viewset.renameFigureVariable(request)

    # =========================================================================
    # ASSIGN
    # =========================================================================
    def assignOutcomeExpression(self, request: OutcomeExpressionAssignRequest) -> AssignResponse:
        return self._viewset.assignOutcomeExpression(request)

    def assignFigureVariableExpression(self, request: FigureVariableExpressionAssignRequest) -> AssignResponse:
        return self._viewset.assignFigureVariableExpression(request)

    # =========================================================================
    # APPLY
    # =========================================================================

    def computeOutcome(self, request: OutcomeComputeRequest) -> ApplyResponse:
        return self._viewset.computeOutcome(request)

    def computeFigureVariable(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        return self._viewset.computeFigureVariable(request)

    # =========================================================================
    # SELECT
    # =========================================================================

    def evaluateOnFigure(self, request: OnFigureEvaluateRequest) -> EvaluateResponse:
        return self._viewset.evaluateOnFigure(request)

    def isOutletExists(self, name: str) -> bool:
        return self._viewset.isOutletExists(name)

    def getOutlet(self, name: str) -> Outlet:
        return self._viewset.getOutlet(name)

    # =========================================================================
    # EXPORT
    # =========================================================================

    def listFigureVariableExportFormat(self, request: FigureVariableExportFormatListRequest) -> FormatListResponse:
        return self._viewset.listFigureVariableExportFormat(request)

    def listOutcomeExportFormat(self, request: OutcomeExportFormatListRequest) -> FormatListResponse:
        return self._viewset.listOutcomeExportFormat(request)

    def exportFigureVariableResult(self, request: FigureVariableExportRequest) -> ExportResponse:
        return self._viewset.exportFigureVariableResult(request)

    def exportOutcomeResult(self, request: OutcomeExportRequest) -> ExportResponse:
        return self._viewset.exportOutcomeResult(request)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeOutlet(self, request: OutletRemoveRequest) -> RemoveResponse:
        return self._viewset.removeOutlet(request)

    def removeFigureVariable(self, request: FigureVariableRemoveRequest) -> RemoveResponse:
        return self._viewset.removeFigureVariable(request)
