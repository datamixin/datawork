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
from garut.bearer import Bearer
from garut.outlet import Outlet
from garut.variable import Variable
from garut.storage import StorageFile
from garut.contexts.context import Context
from dataminer_pb2 import *


class Outcome(Outlet, Bearer):
    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(folder)
        self._variable = Variable(context, folder)

    # =========================================================================
    # ASSIGN
    # =========================================================================
    def assignExpression(self, request: OutcomeExpressionAssignRequest) -> AssignResponse:
        return self._variable.assignExpression(request.expression)

    # =========================================================================
    # SELECT
    # =========================================================================
    def getResult(self):
        return self._variable.getResult()

    # =========================================================================
    # APPLY
    # =========================================================================

    def compute(self, request: OutcomeComputeRequest) -> ApplyResponse:
        return self._variable.compute()

    # =========================================================================
    # EXPORT
    # =========================================================================
    def listExportFormat(self, request: FigureVariableExportFormatListRequest) -> FormatListResponse:
        return self._variable.listExportFormat()

    def exportResult(self, request: FigureVariableExportRequest) -> ExportResponse:
        return self._variable.exportResult(request.format)

    # =========================================================================
    # REMOVE
    # =========================================================================
    def remove(self) -> any:
        if self._folder.isDataFile(Variable.DATA_FILE_NAME):
            self._folder.deleteDataFile(Variable.DATA_FILE_NAME)
        super().remove()
