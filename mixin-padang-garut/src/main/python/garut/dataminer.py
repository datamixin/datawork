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
import sys
import grpc
import logging
import argparse
import dataminer_pb2_grpc

from typing import Dict
from concurrent.futures import ThreadPoolExecutor

from garut.project import Project
from garut.storage import Storage, LocalStorage
from garut.contexts.dataminer_context import DataminerContext, ProjectProvider
from dataminer_pb2_grpc import DataminerServicer
from dataminer_pb2 import *


class Dataminer(DataminerServicer):

    STORAGE = "storage"
    FILESTORE = "filestore"

    def __init__(self, storage: str, filestore: str):
        self._projects: Dict[str, Project] = {}
        provider = DataminerProjectProvider(self._projects)
        self._context = DataminerContext(provider, filestore)
        self._storage: Storage = LocalStorage(storage)

    # =========================================================================
    # PREPARE
    # =========================================================================

    def prepareProject(self, request: ProjectPrepareRequest, context) -> PrepareResponse:
        response = PrepareResponse()
        name = request.key.project
        if name in self._projects:
            response.created = False
        else:
            if request.create == True:
                self._storage.prepareRootFolder(name)
                folder = self._storage.openRootFolder(name)
                self._projects[name] = Project(self._context, folder)
                response.created = True
            else:
                raise Exception("Project '{}' not prepared because create = False".format(name))
        return response

    def prepareDataset(self, request: SheetPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare dataset")
        return project.prepareDataset(request)

    def prepareIngestion(self, request: SheetPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare ingestion")
        return project.prepareIngestion(request)

    def preparePreparation(self, request: SheetPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare preparation")
        return project.preparePreparation(request)

    def prepareBuilder(self, request: SheetPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare builder")
        return project.prepareBuilder(request)

    def prepareBuilderVariable(self, request: BuilderVariablePrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare variable")
        return project.prepareBuilderVariable(request)

    def prepareBuilderVariablePreparation(self, request: BuilderVariablePrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to prepare builder variable preparation"
        )
        return project.prepareBuilderVariablePreparation(request)

    def prepareOutlook(self, request: SheetPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare viewset")
        return project.prepareOutlook(request)

    def prepareFigure(self, request: OutletPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare figure")
        return project.prepareFigure(request)

    def prepareOutcome(self, request: OutletPrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare outcome")
        return project.prepareOutcome(request)

    def prepareFigureVariable(self, request: FigureVariablePrepareRequest, context) -> PrepareResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to prepare figure variable")
        return project.prepareFigureVariable(request)

    def copyProject(self, request: ProjectCopyRequest, context) -> CopyResponse:
        source = request.source.project
        if source in self._projects:
            response = CopyResponse()
            target = request.target.project
            self._storage.prepareRootFolder(target)
            folder = self._storage.openRootFolder(target)
            dest = Project(self._context, folder)
            orig = self._projects.get(source)
            orig.copyTo(folder)
            self._projects[target] = dest
            response = CopyResponse()
            response.copied = True
            return response
        else:
            raise Exception("Missing project '{}' to be copied".format(source))

    # =========================================================================
    # ASSIGN
    # =========================================================================

    def assignReceiptInput(self, request: ReceiptInputAssignRequest, context) -> AssignResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to assign receipt input expression")
        return project.assignReceiptInput(request)

    def assignBuilderVariableExpression(
        self, request: BuilderVariableExpressionAssignRequest, context
    ) -> AssignResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to assign builder variable expression"
        )
        return project.assignBuilderVariableExpression(request)

    def assignOutcomeExpression(self, request: OutcomeExpressionAssignRequest, context) -> AssignResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to assign outcome expression")
        return project.assignOutcomeExpression(request)

    def assignFigureVariableExpression(self, request: FigureVariableExpressionAssignRequest, context) -> AssignResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to assign figure variable expression")
        return project.assignFigureVariableExpression(request)

    # =========================================================================
    # INSERT
    # =========================================================================

    def insertPreparationMutation(self, request: DatasetMutationInsertRequest, context) -> InsertResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to insert preparation mutation")
        return project.insertPreparationMutation(request)

    def insertDatasetDisplayMutation(self, request: DatasetMutationInsertRequest, context) -> InsertResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to insert dataset display mutation")
        return project.insertDatasetDisplayMutation(request)

    def insertPreparationDisplayMutation(self, request: DatasetMutationInsertRequest, context) -> InsertResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to insert preparation display mutation"
        )
        return project.insertPreparationDisplayMutation(request)

    def insertBuilderVariableMutation(self, request: BuilderVariableMutationInsertRequest, context) -> InsertResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to insert builder variable mutation")
        return project.insertBuilderVariableMutation(request)

    def insertBuilderVariableDisplayMutation(
        self, request: BuilderVariableMutationInsertRequest, context
    ) -> InsertResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to insert builder variable display mutation"
        )
        return project.insertBuilderVariableDisplayMutation(request)

    # =========================================================================
    # RENAME
    # =========================================================================

    def renameSheet(self, request: SheetRenameRequest, context) -> RenameResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to rename sheet")
        return project.renameSheet(request)

    def renameReceiptInput(self, request: ReceiptInputRenameRequest, context) -> RenameResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to rename dataset input")
        return project.renameReceiptInput(request)

    def renameBuilderVariable(self, request: BuilderVariableRenameRequest, context) -> RenameResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to rename builder variable")
        return project.renameBuilderVariable(request)

    def renameOutlet(self, request: OutletRenameRequest, context) -> RenameResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to rename outlet")
        return project.renameOutlet(request)

    def renameFigureVariable(self, request: FigureVariableRenameRequest, context) -> RenameResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to rename figure variable")
        return project.renameFigureVariable(request)

    # =========================================================================
    # SELECT
    # =========================================================================

    def selectIngestionResult(self, request: IngestionResultSelectRequest, context) -> SelectResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to select ingestion result")
        return project.selectIngestionResult(request)

    def selectPreparationMutationResult(
        self, request: PreparationMutationResultSelectRequest, context
    ) -> SelectResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to select preparation mutation result"
        )
        return project.selectPreparationMutationResult(request)

    def selectDatasetResult(self, request: DatasetSelectRequest, context) -> SelectResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to select dataset result")
        return project.selectDatasetResult(request)

    def selectBuilderVariablePreparationResult(
        self, request: BuilderVariablePreparationResultSelectRequest, context
    ) -> SelectResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to select builder variable preparation result"
        )
        return project.selectBuilderVariablePreparationResult(request)

    def selectBuilderVariableMutationResult(
        self, request: BuilderVariableMutationResultSelectRequest, context
    ) -> SelectResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to select builder variable mutation result"
        )
        return project.selectBuilderVariableMutationResult(request)

    def evaluateOnProject(self, request: OnProjectEvaluateRequest, context) -> EvaluateResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to evaluate on")
        return project.evaluate(request)

    def evaluateOnForesee(self, request: OnForeseeEvaluateRequest, context) -> EvaluateResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to evaluate on foresee")
        return project.evaluateOnForesee(request)

    def evaluateOnPreparation(self, request: OnPreparationEvaluateRequest, context) -> EvaluateResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to evaluate on proparation")
        return project.evaluateOnPreparation(request)

    def evaluateOnBuilderVariablePreparation(
        self, request: OnBuilderVariablePreparationEvaluateRequest, context
    ) -> EvaluateResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to evaluate on builder variable preparation"
        )
        return project.evaluateOnBuilderVariablePreparation(request)

    def evaluateOnFigure(self, request: OnFigureEvaluateRequest, context) -> EvaluateResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to evaluate on figure")
        return project.evaluateOnFigure(request)

    # =========================================================================
    # APPLY
    # =========================================================================

    def computeReceipt(self, request: ReceiptComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to compute sheet")
        return project.computeReceipt(request)

    def computePreparation(self, request: PreparationComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to compute preparation")
        return project.computePreparation(request)

    def computeBuilderVariable(self, request: BuilderVariableComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to compute builder variable")
        return project.computeBuilderVariable(request)

    def computeBuilderVariablePreparation(self, request: BuilderVariableComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to compute builder variable preparation"
        )
        return project.computeBuilderVariablePreparation(request)

    def computeOutcome(self, request: OutcomeComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to compute outcome")
        return project.computeOutcome(request)

    def computeFigureVariable(self, request: FigureVariableComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to compute figure variable")
        return project.computeFigureVariable(request)

    def applySourceResult(self, request: SourceResultApplyRequest, context) -> ApplyResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to apply source result")
        return project.applySourceResult(request)

    def applyBuilderVariablePreparation(self, request: FigureVariableComputeRequest, context) -> ApplyResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to apply builder variable preparation"
        )
        return project.applyBuilderVariablePreparation(request)

    # ========================================================================
    # EXPORT
    # ========================================================================

    def listDatasetExportFormat(self, request: DatasetExportFormatListRequest, context) -> FormatListResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to list dataset export format")
        return project.listDatasetExportFormat(request)

    def listBuilderVariableExportFormat(
        self, request: BuilderVariableExportFormatListRequest, context
    ) -> FormatListResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to list builder variable export format"
        )
        return project.listBuilderVariableExportFormat(request)

    def listOutcomeExportFormat(self, request: OutcomeExportFormatListRequest, context) -> FormatListResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to list outcome export format")
        return project.listOutcomeExportFormat(request)

    def listFigureVariableExportFormat(
        self, request: FigureVariableExportFormatListRequest, context
    ) -> FormatListResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to list figure variable export format"
        )
        return project.listFigureVariableExportFormat(request)

    def exportDatasetResult(self, request: DatasetExportRequest, context) -> ExportResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to export dataset result")
        return project.exportDatasetResult(request)

    def exportBuilderVariableResult(self, request: BuilderVariableExportRequest, context) -> ExportResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to export builder variable result")
        return project.exportBuilderVariableResult(request)

    def exportOutcomeResult(self, request: OutcomeExportRequest, context) -> ExportResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to export outcome result")
        return project.exportOutcomeResult(request)

    def exportFigureVariableResult(self, request: FigureVariableExportRequest, context) -> ExportResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to export figure variable result")
        return project.exportFigureVariableResult(request)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removePreparationMutation(self, request: DatasetMutationRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove preparation mutation")
        return project.removePreparationMutation(request)

    def removeDatasetDisplayMutation(self, request: DatasetMutationRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove dataset display mutation")
        return project.removeDatasetDisplayMutation(request)

    def removePreparationDisplayMutation(self, request: DatasetMutationRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to remove preparation display mutation"
        )
        return project.removePreparationDisplayMutation(request)

    def removeReceiptInput(self, request: ReceiptInputRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove receipt input")
        return project.removeReceiptInput(request)

    def removeBuilderVariable(self, request: BuilderVariableRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove builder variable")
        return project.removeBuilderVariable(request)

    def removeBuilderVariableMutation(self, request: BuilderVariableMutationRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove builder variable mutation")
        return project.removeBuilderVariableMutation(request)

    def removeBuilderVariableDisplayMutation(
        self, request: BuilderVariableMutationRemoveRequest, context
    ) -> RemoveResponse:
        project = self._confirmProject(
            request.key.project, "Missing project '{}' to remove builder variable display mutation"
        )
        return project.removeBuilderVariableDisplayMutation(request)

    def removeFigureVariable(self, request: FigureVariableRemoveRequest, context) -> RemoveResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove figure variable")
        return project.removeFigureVariable(request)

    def removeOutlet(self, request: OutletRemoveRequest, context) -> SelectResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove outlet")
        return project.removeOutlet(request)

    def removeSheet(self, request: SheetRemoveRequest, context) -> SelectResponse:
        project = self._confirmProject(request.key.project, "Missing project '{}' to remove sheet")
        return project.removeSheet(request)

    def removeProject(self, request: ProjectRemoveRequest, context) -> RemoveResponse:
        name = request.key.project
        if name in self._projects:
            project = self._projects.pop(name)
            project.delete()
            response = RemoveResponse()
            response.removed = True
            return response
        else:
            raise Exception("Missing project '{}' to be removed".format(name))

    # =========================================================================
    # CONFIRM
    # =========================================================================

    def _confirmProject(self, name: str, message: str) -> Project:
        if name in self._projects:
            return self._projects[name]
        else:
            if self._storage.isRootFolderExists(name):
                folder = self._storage.openRootFolder(name)
                self._projects[name] = Project(self._context, folder)
                return self._projects[name]
            else:
                raise Exception(message.format(name))


class DataminerProjectProvider(ProjectProvider):
    def __init__(self, projects: Dict[str, Project]):
        self._projects = projects

    def isProjectExists(self, id: str) -> bool:
        return id in self._projects

    def getProject(self, id: str) -> Project:
        return self._projects.get(id, None)


def serve():
    host = "0.0.0.0"
    port = 8980
    max = 10 * 1024 * 1024
    options = [("grpc.max_send_message_length", max), ("grpc.max_receive_message_length", max)]
    executor = ThreadPoolExecutor(max_workers=1)
    server = grpc.server(executor, options=options)
    dataminer = createDataminer()
    dataminer_pb2_grpc.add_DataminerServicer_to_server(dataminer, server)
    server.add_insecure_port(host+":" + str(port))
    server.start()
    print("Dataminer started on {}".format(host+":" + str(port)))
    server.wait_for_termination()


def createDataminer() -> Dataminer:
    parser = argparse.ArgumentParser()
    parser.add_argument("--" + Dataminer.STORAGE, default="./demo/storage", help="storage path to store result")
    parser.add_argument("--" + Dataminer.FILESTORE, default="localhost:8981", help="filestore server address")
    namespace = parser.parse_args()
    dataminer = Dataminer(namespace.storage, namespace.filestore)
    return dataminer


if __name__ == "__main__":
    logging.basicConfig()
    serve()
