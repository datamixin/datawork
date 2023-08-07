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
from garut.graphic import Graphic
from garut.storage import StorageFile
from garut.container import Container
from garut.contexts.context import Context
from dataminer_pb2 import *


class Figure(Outlet, Container):
    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(folder)
        self._graphic = Graphic(context, folder)

    def getContext(self) -> Context:
        return self._graphic.getContext()

    # =========================================================================
    # PREPARE
    # =========================================================================
    def prepareVariable(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        return self._graphic.prepareVariable(request.key.variable, request.create)

    # =========================================================================
    # ASSIGN
    # =========================================================================

    def assignVariableExpression(self, request: FigureVariableExpressionAssignRequest) -> AssignResponse:
        return self._graphic.assignVariableExpression(request.key.variable, request.expression)

    # =========================================================================
    # REMAME
    # =========================================================================
    def renameVariable(self, request: FigureVariableRenameRequest) -> RenameResponse:
        return self._graphic.renameVariable(request.oldName, request.newName)

    # =========================================================================
    # SELECT
    # =========================================================================
    def evaluate(self, request: OnFigureEvaluateRequest) -> any:
        return self._graphic.evaluate(request.expression)

    def computeVariable(self, request: FigureVariableComputeRequest) -> any:
        return self._graphic.computeVariable(request.key.variable)

    # =========================================================================
    # EXPORT
    # =========================================================================

    def listVariableExportFormat(self, request: FigureVariableExportFormatListRequest) -> FormatListResponse:
        return self._graphic.listVariableExportFormat(request.key.variable)

    def exportVariableResult(self, request: FigureVariableExportRequest) -> ExportResponse:
        return self._graphic.exportVariableResult(request.key.variable, request.format)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeVariable(self, request: FigureVariableRemoveRequest) -> RemoveResponse:
        return self._graphic.removeVariable(request.key.variable)

    def remove(self) -> any:
        self._graphic.remove()
        super().remove()
