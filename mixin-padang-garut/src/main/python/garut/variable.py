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
import time
from garut.outlet import Outlet
from garut.bearer import Bearer
from garut.storage import StorageFile
from garut.datastage import Datastage
from garut.preparation import Preparation
from garut.contexts.context import Context
from garut.exporter import ExporterListRegistry
from garut.evaluations.evaluation import EvaluationFactory
from garut.contexts.variable_context import VariableContext
from dataminer_pb2 import *
from evaluate_pb2 import *


class Variable(Outlet, Bearer, Datastage):

    DATA_FILE_NAME = "data"

    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(folder)
        self._result = None
        self._expression = None
        self._preparation = None
        self._context = VariableContext(context, folder)

    def getContext(self) -> str:
        return self._context

    def validate(self, context: Context, hoster: Context):
        from garut.validations.validation import ValidationFactory

        validator = ValidationFactory.getInstance()
        validator.validate(context, hoster, self._expression)

    def reset(self):
        pass

    def append(self, dataframe: any):
        pass

    # =========================================================================
    # PREPARE
    # =========================================================================

    def preparePreparation(self, create: bool) -> PrepareResponse:
        self._preparation = Preparation(self._context, self)
        response = PrepareResponse()
        response.created = True
        return response

    # =========================================================================
    # INSERT
    # =========================================================================

    def insertMutation(self, index: int, order: any) -> InsertResponse:
        self._preparation.insertMutation(index, order)
        response = InsertResponse()
        response.modified = True
        return response

    def insertDisplayMutation(self, index: int, order: any) -> InsertResponse:
        self._preparation.insertDisplayMutation(index, order)
        response = InsertResponse()
        response.modified = True
        return response

    # =========================================================================
    # ASSIGN
    # =========================================================================

    def assignExpression(self, expression: EvaluateExpression) -> AssignResponse:
        self._expression = expression
        response = AssignResponse()
        response.assigned = True
        return response

    # =========================================================================
    # SELECT
    # =========================================================================

    def selectPreparationResult(self, order: any) -> SelectResponse:
        return self._preparation.selectMutationResult(order)

    def selectMutationResult(self, index: int, order: any) -> SelectResponse:
        return self._preparation.selectMutationResult(index, order)

    def evaluateOnPreparation(self, expression: any) -> EvaluateResponse:
        return self._preparation.evaluate(expression)

    def getResult(self):
        if self._result is None:
            if self._folder.isDataFile(Variable.DATA_FILE_NAME):
                self._result = self._folder.loadDataFile(Variable.DATA_FILE_NAME)
            else:
                self._compute()
        return self._result

    # =========================================================================
    # APPLY
    # =========================================================================

    def applyPreparation(self) -> ApplyResponse:
        return self._preparation.applyResult()

    def computePreparation(self) -> ApplyResponse:
        return self._preparation.compute()

    def compute(self) -> ApplyResponse:
        self._compute()
        response = ApplyResponse()
        response.applied = True
        return response

    # =========================================================================
    # EXPORT
    # =========================================================================
    def listExportFormat(self) -> FormatListResponse:
        result = self.getResult()
        registry = ExporterListRegistry.getInstance()
        return registry.getFormatListValue(result)

    def exportResult(self, format: str) -> ExportResponse:
        result = self.getResult()
        registry = ExporterListRegistry.getInstance()
        return registry.export(result, format)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removeMutation(self, index: int) -> RemoveResponse:
        return self._preparation.removeMutation(index)

    def removeDisplayMutation(self, index: int) -> RemoveResponse:
        return self._preparation.removeDisplayMutation(index)

    def remove(self) -> any:
        if self._folder.isDataFile(Variable.DATA_FILE_NAME):
            self._folder.deleteDataFile(Variable.DATA_FILE_NAME)
        super().remove()

    def _compute(self):
        if self._expression is not None:

            try:

                # Validate
                startEval = time.time()
                self.validate(self._context, self._context)

                # Evaluate
                evaluator = EvaluationFactory.getInstance()
                result = evaluator.evaluate(self._context, self._expression)
                if isinstance(result, Bearer):
                    result = result.getResult()
            except Exception as e:
                result = e
            self._result = result

            # Persist
            elapsedTime = time.time() - startEval
            if elapsedTime > 1:
                self._folder.saveDataFile(Variable.DATA_FILE_NAME, self._result)
