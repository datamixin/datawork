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
from typing import Dict
from pandas import DataFrame
from garut.source import Source
from garut.display import Display
from garut.storage import StorageFile
from garut.ingestion import Ingestion
from garut.preparation import Preparation
from garut.contexts.context import Context
from garut.converter import ConverterRegistry
from garut.exporter import ExporterListRegistry
from garut.receipt import Receipt, ReceiptInputProvider
from garut.contexts.dataset_context import DatasetContext
from garut.evaluations.evaluation import EvaluationFactory
from garut.instruction import Instruction, InstructionFactory
from garut.contexts.calculate_context import CalculateContext
from dataminer_pb2 import *


class Dataset(Receipt):

    DATASET_FILE_NAME = "dataset"

    def __init__(self, context: Context, folder: StorageFile):
        super().__init__(context, folder)
        self._source: Source = None
        self._display = Display(self._context)
        self._datafile = Dataset.DATASET_FILE_NAME
        self._prepareContext(context)
        self._prepareResult()

    def _prepareContext(self, context: Context):
        provider = ReceiptInputProvider(context, self._inputs)
        self._context = DatasetContext(context, provider)

    def _prepareResult(self):
        self._result = self._folder.loadDataFile(self._datafile)
        if self._result is None:
            self._result = DataFrame()

    def reset(self):
        self._result: DataFrame = DataFrame()
        self._folder.deleteDataFile(self._datafile)

    def append(self, dataframe: DataFrame):
        self._folder.saveDataFile(self._datafile, dataframe)
        self._result = self._folder.loadDataFile(self._datafile)

    def calculate(self, parent: Context, options: Dict[str, any]):

        # Apply default value in case input missing
        provider = ReceiptInputProvider(self._context, self._inputs)
        for name in provider.getInputNames():
            if name not in options.keys():
                options[name] = provider.getInput(name)

        # Calculate source
        context = CalculateContext(parent, options)
        return self._source.calculate(context)

    # =========================================================================
    # PREPARE
    # =========================================================================

    def prepareIngestion(self, request: SheetPrepareRequest) -> PrepareResponse:
        self._source = Ingestion(self._context, self)
        response = PrepareResponse()
        response.created = True
        return response

    def preparePreparation(self, request: SheetPrepareRequest) -> PrepareResponse:
        self._source = Preparation(self._context, self)
        response = PrepareResponse()
        response.created = True
        return response

    # =========================================================================
    # RENAME
    # =========================================================================

    def rename(self, name: str):
        self._folder.renameTo(name)

    # =========================================================================
    # INSERT
    # =========================================================================

    def insertPreparationMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        preparation = self._confirmPreparation()
        return preparation.insertMutation(request.index, request.order)

    def insertDisplayMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        return self._display.insertMutation(request.index, request.order)

    def insertPreparationDisplayMutation(self, request: DatasetMutationInsertRequest) -> InsertResponse:
        preparation = self._confirmPreparation()
        return preparation.insertDisplayMutation(request.index, request.order)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def removePreparationMutation(self, request: DatasetMutationInsertRequest) -> RemoveResponse:
        preparation = self._confirmPreparation()
        return preparation.removeMutation(request.index)

    def removeDisplayMutation(self, request: DatasetMutationInsertRequest) -> RemoveResponse:
        return self._display.removeMutation(request.index)

    def removePreparationDisplayMutation(self, request: DatasetMutationInsertRequest) -> RemoveResponse:
        preparation = self._confirmPreparation()
        return preparation.removeDisplayMutation(request.index)

    # =========================================================================
    # SELECT
    # =========================================================================

    def selectIngestionResult(self, request: IngestionResultSelectRequest) -> SelectResponse:
        ingestion = self._confirmIngestion()
        return ingestion.selectResult(request)

    def selectPreparationMutationResult(self, request: PreparationMutationResultSelectRequest) -> SelectResponse:
        preparation = self._confirmPreparation()
        return preparation.selectMutationResult(request.index, request.order)

    def selectResult(self, request: DatasetSelectRequest) -> SelectResponse:

        result = self.getResult(request.display)

        factory: EvaluationFactory = EvaluationFactory.getInstance()
        values = factory.evaluateOptions(self._context, request.order.options)

        factory = InstructionFactory.getInstance()
        instruction: Instruction = factory.create(request.order.name)
        result = instruction.execute(self._context, result, values)

        registry: ConverterRegistry = ConverterRegistry.getInstance()
        response = SelectResponse()
        value = registry.toValue(result)
        response.value.CopyFrom(value)
        return response

    def evaluateOnPreparation(self, request: OnPreparationEvaluateRequest):
        preparation = self._confirmPreparation()
        return preparation.evaluate(request.expression)

    def getPreparation(self, mutation: int, display: bool):
        preparation = self._confirmPreparation()
        return preparation.getMutationResult(mutation, display)

    def getResult(self, display: bool = False):
        result = self._result
        if display is True:
            result = self._display.inspect(self._result)
        return result

    # =========================================================================
    # EXPORT
    # =========================================================================
    def listExportFormat(self, request: DatasetExportFormatListRequest) -> FormatListResponse:
        result = self.getResult(False)
        registry = ExporterListRegistry.getInstance()
        return registry.getFormatListValue(result)

    def exportResult(self, request: DatasetExportRequest) -> ExportResponse:
        result = self.getResult(False)
        registry = ExporterListRegistry.getInstance()
        return registry.export(result, request.format)

    # =========================================================================
    # REMOVE
    # =========================================================================

    def remove(self) -> any:
        self._folder.deleteDataFile(self._datafile)
        super().remove()

    # =========================================================================
    # APPLY
    # =========================================================================

    def compute(self) -> ApplyResponse:
        self._source.resetResult()
        return self.applySourceResult()

    def computePreparation(self) -> ApplyResponse:
        preparation = self._confirmPreparation()
        return preparation.compute()

    def applySourceResult(self) -> ApplyResponse:
        return self._source.applyResult()

    # =========================================================================
    # CONFIRM
    # =========================================================================

    def _confirmIngestion(self) -> Ingestion:
        if isinstance(self._source, Ingestion):
            return self._source
        else:
            raise Exception("Source type is not an ingestion")

    def _confirmPreparation(self) -> Preparation:
        if isinstance(self._source, Preparation):
            return self._source
        else:
            raise Exception("Source type is not a preparation")
