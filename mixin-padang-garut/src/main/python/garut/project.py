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
from garut.sheet import Sheet
from garut.foresee import Foresee
from garut.receipt import Receipt
from garut.dataset import Dataset
from garut.builder import Builder
from garut.outlook import Outlook
from garut.container import Container
from garut.storage import StorageFile
from garut.contexts.context import Context
from garut.evaluations.evaluation import EvaluationFactory
from garut.contexts.project_context import ProjectContext, ForeseeProvider
from dataminer_pb2 import *


class Project(Container):
    def __init__(self, context: Context, folder: StorageFile):
        self._folder = folder
        self._sheets: Dict[str, Sheet] = {}
        self._prepareContext(context)

    def _prepareContext(self, context: Context):
        outputProvider = ProjectForeseeProvider(self)
        self._context = ProjectContext(context, self._folder, outputProvider)

    def getContext(self) -> Context:
        return self._context

    def copyTo(self, folder: StorageFile):
        self._folder.copyTo(folder)

    # =========================================================================
    # PREPARE
    # =========================================================================

    def prepareDataset(self, request: SheetPrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.sheet
        if name in self._sheets:
            response.created = False
        else:
            if request.create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                foresee = Dataset(self._context, folder)
                self._sheets[name] = Sheet(folder, foresee)
                response.created = True
            else:
                raise Exception("Dataset '{}' not prepared because create = False".format(name))
        return response

    def prepareIngestion(self, request: SheetPrepareRequest) -> PrepareResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to prepare ingestion")
        return dataset.prepareIngestion(request)

    def preparePreparation(self, request: SheetPrepareRequest) -> PrepareResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to prepare preparation")
        return dataset.preparePreparation(request)

    def prepareBuilder(self, request: SheetPrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.sheet
        if name in self._sheets:
            response.created = False
        else:
            if request.create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                foresee = Builder(self._context, folder)
                self._sheets[name] = Sheet(folder, foresee)
                response.created = True
            else:
                raise Exception("Builder '{}' not prepared because create = False".format(name))
        return response

    def prepareBuilderVariable(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to prepare variable")
        return builder.prepareVariable(request)

    def prepareBuilderVariablePreparation(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to prepare variable preparation")
        return builder.prepareVariablePreparation(request)

    def prepareOutlook(self, request: SheetPrepareRequest) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.sheet
        if name in self._sheets:
            response.created = False
        else:
            if request.create == True:
                self._folder.prepareFolder(name)
                folder = self._folder.openFolder(name)
                foresee = Outlook(self._context, folder)
                self._sheets[name] = Sheet(folder, foresee)
                response.created = True
            else:
                raise Exception("Outlook '{}' not prepared because create = False".format(name))
        return response

    def prepareOutcome(self, request: OutletPrepareRequest) -> InsertResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to prepare outcome")
        return outlook.prepareOutcome(request)

    def prepareFigure(self, request: OutletPrepareRequest) -> PrepareResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to prepare figure")
        return outlook.prepareFigure(request)

    def prepareFigureVariable(self, request: FigureVariablePrepareRequest) -> PrepareResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to prepare figure variable")
        return outlook.prepareFigureVariable(request)

    # =========================================================================
    # ASSIGN
    # =========================================================================

    def assignReceiptInput(self, request: ReceiptInputAssignRequest) -> AssignResponse:
        receipt = self._confirmReceipt(request.key.sheet, "Missing receipt '{}' to assign input expression")
        return receipt.assignInput(request)

    def assignBuilderVariableExpression(self, request: BuilderVariableExpressionAssignRequest) -> AssignResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to assign variable expression")
        return builder.assignVariableExpression(request)

    def assignOutcomeExpression(self, request: OutcomeExpressionAssignRequest) -> AssignResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to assign variable expression")
        return outlook.assignOutcomeExpression(request)

    def assignFigureVariableExpression(self, request: FigureVariableExpressionAssignRequest) -> AssignResponse:
        outlook = self._confirmOutlook(
            request.key.sheet,
            "Missing outlook '{}' to assign figure variable expression",
        )
        return outlook.assignFigureVariableExpression(request)

    # =========================================================================
    # RENAME
    # =========================================================================

    def renameSheet(self, request: SheetRenameRequest) -> RenameResponse:
        if request.oldName in self._sheets:
            sheet = self._sheets.pop(request.oldName)
            response = RenameResponse()
            try:
                sheet.rename(request.newName)
                self._sheets[request.newName] = sheet
                response.renamed = True
            except Exception as e:
                response.message = str(e.args)
                response.renamed = False
            return response
        else:
            raise Exception("Missing sheet '{}' to rename".format(request.oldName))

    def renameReceiptInput(self, request: ReceiptInputRenameRequest) -> RenameResponse:
        receipt = self._confirmReceipt(request.key.sheet, "Missing receipt '{}' to rename input")
        return receipt.renameInput(request)

    def renameBuilderVariable(self, request: BuilderVariableRenameRequest) -> RenameResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to rename variable")
        return builder.renameVariable(request)

    def renameOutlet(self, request: OutletRenameRequest) -> RenameResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to rename outlet")
        return outlook.renameOutlet(request)

    def renameFigureVariable(self, request: FigureVariableRenameRequest) -> RenameResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to rename figure variable")
        return outlook.renameFigureVariable(request)

    # =========================================================================
    # INSERT
    # =========================================================================

    def insertPreparationMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to insert preparation mutation")
        return dataset.insertPreparationMutation(request)

    def insertDatasetDisplayMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to insert dataset display mutation")
        return dataset.insertDisplayMutation(request)

    def insertPreparationDisplayMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to insert preparation display mutation")
        return dataset.insertPreparationDisplayMutation(request)

    def insertBuilderVariableMutation(self, request: BuilderVariableMutationInsertRequest) -> InsertResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to insert variable mutation")
        return builder.insertVariableMutation(request)

    def insertBuilderVariableDisplayMutation(self, request: BuilderVariableMutationInsertRequest) -> InsertResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to insert variable display mutation")
        return builder.insertVariableDisplayMutation(request)

    # =========================================================================
    # SELECT
    # =========================================================================

    def selectIngestionResult(self, request: IngestionResultSelectRequest) -> SelectResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to select ingestion result")
        return dataset.selectIngestionResult(request)

    def selectPreparationMutationResult(self, request: PreparationMutationResultSelectRequest) -> SelectResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to select preparation mutation result")
        return dataset.selectPreparationMutationResult(request)

    def selectDatasetResult(self, request: DatasetSelectRequest) -> SelectResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to select result")
        return dataset.selectResult(request)

    def selectBuilderVariablePreparationResult(
        self, request: BuilderVariablePreparationResultSelectRequest
    ) -> SelectResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to select variable preparation result")
        return builder.selectVariablePreparationResult(request)

    def selectBuilderVariableMutationResult(
        self, request: BuilderVariableMutationResultSelectRequest
    ) -> SelectResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to select variable mutation result")
        return builder.selectVariableMutationResult(request)

    def evaluate(self, request: OnForeseeEvaluateRequest) -> EvaluateResponse:
        factory = EvaluationFactory.getInstance()
        result = factory.evaluateResponse(self._context, request.expression)
        return result

    def evaluateOnForesee(self, request: OnForeseeEvaluateRequest) -> EvaluateResponse:
        foresee = self._confirmForesee(request.key.sheet, Foresee, False, "Missing foresee '{}' to evaluate on")
        return foresee.evaluate(request)

    def evaluateOnPreparation(self, request: OnPreparationEvaluateRequest) -> EvaluateResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to evaluate on preparation")
        return dataset.evaluateOnPreparation(request)

    def evaluateOnFigure(self, request: OnFigureEvaluateRequest) -> EvaluateResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to evaluate outlook figure")
        return outlook.evaluateOnFigure(request)

    def evaluateOnBuilderVariablePreparation(
        self, request: OnBuilderVariablePreparationEvaluateRequest
    ) -> EvaluateResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to evaluate on variable preparation")
        return builder.evaluateOnVariablePreparation(request)

    def isSheetExists(self, name: str) -> bool:
        return name in self._sheets

    def getSheet(self, name: str) -> Sheet:
        return self._sheets[name]

    # =========================================================================
    # APPLY
    # =========================================================================

    def computeReceipt(self, request: ReceiptComputeRequest) -> ApplyResponse:
        receipt = self._confirmReceipt(request.key.sheet, "Missing receipt '{}' to compute")
        return receipt.compute()

    def computePreparation(self, request: PreparationComputeRequest) -> ApplyResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to compute preparation")
        return dataset.computePreparation()

    def computeBuilderVariable(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to compute variable")
        return builder.computeVariable(request)

    def computeBuilderVariablePreparation(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to compute variable preparation")
        return builder.computeVariablePreparation(request)

    def computeOutcome(self, request: OutcomeComputeRequest) -> ApplyResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to compute outcome")
        return outlook.computeOutcome(request)

    def computeFigureVariable(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to compute figure variable")
        return outlook.computeFigureVariable(request)

    def applySourceResult(self, request: SourceResultApplyRequest) -> ApplyResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to apply source result")
        return dataset.applySourceResult()

    def applyBuilderVariablePreparation(self, request: FigureVariableComputeRequest) -> ApplyResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to apply variable preparation")
        return builder.applyVariablePreparation(request)

    # ========================================================================
    # EXPORT
    # ========================================================================

    def listDatasetExportFormat(self, request: DatasetExportFormatListRequest) -> FormatListResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to list export format")
        return dataset.listExportFormat(request)

    def listBuilderVariableExportFormat(self, request: BuilderVariableExportFormatListRequest) -> FormatListResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to list variable export format")
        return builder.listVariableExportFormat(request)

    def listFigureVariableExportFormat(self, request: FigureVariableExportFormatListRequest) -> FormatListResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to list figure variable export format")
        return outlook.listFigureVariableExportFormat(request)

    def listOutcomeExportFormat(self, request: OutcomeExportFormatListRequest) -> FormatListResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to list outcome export format")
        return outlook.listOutcomeExportFormat(request)

    def exportBuilderVariableResult(self, request: BuilderVariableExportRequest) -> ExportResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to export variable result")
        return builder.exportVariableResult(request)

    def exportFigureVariableResult(self, request: FigureVariableExportRequest) -> ExportResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to export figure variable result")
        return outlook.exportFigureVariableResult(request)

    def exportOutcomeResult(self, request: OutcomeExportRequest) -> ExportResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to export outcome result")
        return outlook.exportOutcomeResult(request)

    def exportDatasetResult(self, request: DatasetExportRequest) -> ExportResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to export result")
        return dataset.exportResult(request)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removePreparationMutation(self, request: DatasetMutationRemoveRequest) -> RemoveResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to remove preparation mutation")
        return dataset.removePreparationMutation(request)

    def removeDatasetDisplayMutation(self, request: DatasetMutationRemoveRequest) -> RemoveResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to remove display mutation")
        return dataset.removeDisplayMutation(request)

    def removePreparationDisplayMutation(self, request: DatasetMutationRemoveRequest) -> RemoveResponse:
        dataset = self._confirmDataset(request.key.sheet, "Missing dataset '{}' to remove preparation display mutation")
        return dataset.removePreparationDisplayMutation(request)

    def removeReceiptInput(self, request: ReceiptInputRemoveRequest) -> RemoveResponse:
        receipt = self._confirmReceipt(request.key.sheet, "Missing receipt '{}' to remove input")
        return receipt.removeInput(request)

    def removeBuilderVariable(self, request: BuilderVariableRemoveRequest) -> RemoveResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to remove variable")
        return builder.removeVariable(request)

    def removeBuilderVariableMutation(self, request: BuilderVariableMutationRemoveRequest) -> RemoveResponse:
        builder = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to remove variable mutation")
        return builder.removeVariableMutation(request)

    def removeBuilderVariableDisplayMutation(self, request: BuilderVariableMutationRemoveRequest) -> RemoveResponse:
        outlook = self._confirmBuilder(request.key.sheet, "Missing builder '{}' to remove variable display mutation")
        return outlook.removeVariableDisplayMutation(request)

    def removeOutlet(self, request: OutletRemoveRequest) -> RemoveResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to remove outlet")
        return outlook.removeOutlet(request)

    def removeFigureVariable(self, request: FigureVariableRemoveRequest) -> RemoveResponse:
        outlook = self._confirmOutlook(request.key.sheet, "Missing outlook '{}' to remove figure variable")
        return outlook.removeFigureVariable(request)

    def removeSheet(self, request: SheetRemoveRequest) -> RemoveResponse:
        name = request.key.sheet
        if name in self._sheets:
            sheet = self._sheets.pop(name)
            sheet.remove()
            response = RemoveResponse()
            response.removed = True
            return response
        else:
            raise Exception("Missing sheet '{}' to be removed".format(name))

    def delete(self):
        for rawdata in self._sheets.values():
            rawdata.remove()
        self._folder.delete()

    # =========================================================================
    # CONFIRM
    # =========================================================================

    def _confirmDataset(self, name: str, message: str) -> Dataset:
        return self._confirmForesee(name, Dataset, True, message)

    def _confirmBuilder(self, name: str, message: str) -> Builder:
        return self._confirmForesee(name, Builder, True, message)

    def _confirmOutlook(self, name: str, message: str) -> Outlook:
        return self._confirmForesee(name, Outlook, True, message)

    def _confirmReceipt(self, name: str, message: str) -> Receipt:
        return self._confirmForesee(name, Receipt, False, message)

    def _confirmForesee(self, name: str, type: Type, create: bool, message: str) -> Foresee:
        if name in self._sheets:
            sheet = self._sheets[name]
            if isinstance(sheet.foresee, type):
                return sheet.foresee
        else:
            if create:
                if self._folder.isFolderExists(name):
                    folder = self._folder.openFolder(name)
                    foresee = type(self._context, folder)
                    self._sheets[name] = Sheet(folder, foresee)
                    return foresee
        raise Exception(message.format(name))


class ProjectForeseeProvider(ForeseeProvider):
    def __init__(self, project: Project):
        self._project = project

    def isForeseeExists(self, name: str) -> bool:
        return self._project.isSheetExists(name)

    def getForesee(self, name: str) -> Sheet:
        sheet = self._project.getSheet(name)
        return sheet.foresee

    def getDatasetResult(self, name: str, display: bool) -> any:
        dataset: Dataset = self.getForesee(name)
        return dataset.getResult(display)

    def getPreparationResult(self, name: str, mutation: int, display: bool) -> any:
        dataset: Dataset = self.getForesee(name)
        return dataset.getPreparation(mutation, display)
