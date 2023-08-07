/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.andia.mixin.padang.garut;

import java.util.Collection;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.Options;
import com.andia.mixin.padang.dumai.Prominer;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.garut.DataminerGrpc.DataminerBlockingStub;
import com.andia.mixin.padang.garut.adapters.ExpressionAdapterRegistry;
import com.andia.mixin.padang.garut.converters.ObjectConverter;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;
import com.andia.mixin.plan.QualifiedPlan;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class GarutProminer implements Prominer {

	private static final Logger logger = LoggerFactory.getLogger(GarutProminer.class.getName());

	private final static String DATAMINER_SERVER_PROPERTY = "dataminer";
	private final static String DEFAULT_DATAMINER_SERVER = "localhost:8980";

	private static ManagedChannel channel;
	private String project;

	public GarutProminer() {
		prepareChannel();
	}

	private void prepareChannel() {
		if (channel == null) {
			String server = System.getProperty(DATAMINER_SERVER_PROPERTY);
			if (server == null) {
				server = DEFAULT_DATAMINER_SERVER;
			}
			logger.info("Prepare dataminer channel at server: " + server);
			ManagedChannelBuilder<?> builder = ManagedChannelBuilder.forTarget(server);
			builder.usePlaintext();
			builder.maxInboundMessageSize(16 * 1024 * 1024);
			channel = builder.build();
		}
	}

	@Override
	public void init(String space, UUID fileId, Options options) throws ProminerException {
		try {
			project = fileId.toString();
			prepareProject();
		} catch (Exception e) {
			throw new ProminerException("Fail create garut project", e);
		}
	}

	private void prepareProject() {
		ProjectKey key = createProjectKey(project);
		ProjectPrepareRequest request = ProjectPrepareRequest.newBuilder()
				.setKey(key)
				.setCreate(true)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareProject(request);
	}

	@Override
	public void copyTo(UUID fileId) throws ProminerException {
		String targetId = fileId.toString();
		ProjectKey source = createProjectKey(project);
		ProjectKey target = createProjectKey(targetId);
		ProjectCopyRequest request = ProjectCopyRequest.newBuilder()
				.setSource(source)
				.setTarget(target)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.copyProject(request);
	}

	private ProjectKey createProjectKey(String project) {
		return ProjectKey.newBuilder()
				.setProject(project)
				.build();
	}

	// ========================================================================
	// PREPARE
	// ========================================================================

	@Override
	public void prepareDataset(String sheet) {
		SheetPrepareRequest request = createSheetPrepareRequest(sheet);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareDataset(request);
	}

	private SheetKey createSheetKey(String project, String sheet) {
		return SheetKey.newBuilder()
				.setProject(project)
				.setSheet(sheet)
				.build();
	}

	@Override
	public void preparePreparation(String sheet) throws ProminerException {
		SheetPrepareRequest request = createSheetPrepareRequest(sheet);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.preparePreparation(request);
	}

	@Override
	public void prepareIngestion(String sheet) throws ProminerException {
		SheetPrepareRequest request = createSheetPrepareRequest(sheet);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareIngestion(request);
	}

	private SheetPrepareRequest createSheetPrepareRequest(String sheet) {
		SheetKey key = createSheetKey(project, sheet);
		SheetPrepareRequest request = SheetPrepareRequest.newBuilder()
				.setKey(key)
				.setCreate(true)
				.build();
		return request;
	}

	@Override
	public void prepareBuilder(String sheet) throws ProminerException {
		SheetPrepareRequest request = createSheetPrepareRequest(sheet);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareBuilder(request);
	}

	@Override
	public void prepareBuilderVariable(String sheet, String variable) throws ProminerException {
		BuilderVariablePrepareRequest request = createBuilderVariablePrepareRequest(sheet, variable);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareBuilderVariable(request);
	}

	private BuilderVariablePrepareRequest createBuilderVariablePrepareRequest(String sheet, String variable) {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariablePrepareRequest request = BuilderVariablePrepareRequest.newBuilder()
				.setKey(key)
				.setCreate(true)
				.build();
		return request;
	}

	@Override
	public void prepareBuilderVariablePreparation(String sheet, String variable) throws ProminerException {
		BuilderVariablePrepareRequest request = createBuilderVariablePrepareRequest(sheet, variable);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareBuilderVariablePreparation(request);
	}

	@Override
	public void prepareOutlook(String sheet) throws ProminerException {
		SheetPrepareRequest request = createSheetPrepareRequest(sheet);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareOutlook(request);
	}

	private OutletKey createOutletKey(String project, String sheet, String outlet) {
		return OutletKey.newBuilder()
				.setProject(project)
				.setSheet(sheet)
				.setOutlet(outlet)
				.build();
	}

	@Override
	public void prepareOutcome(String sheet, String variable) throws ProminerException {
		OutletPrepareRequest request = createOutletPrepareRequest(sheet, variable);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareOutcome(request);
	}

	private OutletPrepareRequest createOutletPrepareRequest(String sheet, String variable) {
		OutletKey key = createOutletKey(project, sheet, variable);
		OutletPrepareRequest request = OutletPrepareRequest.newBuilder()
				.setKey(key)
				.setCreate(true)
				.build();
		return request;
	}

	@Override
	public void prepareFigure(String sheet, String figure) throws ProminerException {
		OutletPrepareRequest request = createOutletPrepareRequest(sheet, figure);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareFigure(request);
	}

	private FigureVariableKey createFigureVariableKey(String project, String sheet, String figure,
			String variable) {
		return FigureVariableKey.newBuilder()
				.setProject(project)
				.setSheet(sheet)
				.setOutlet(figure)
				.setVariable(variable)
				.build();
	}

	@Override
	public void prepareFigureVariable(String sheet, String figure, String variable) throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, figure, variable);
		FigureVariablePrepareRequest request = FigureVariablePrepareRequest.newBuilder()
				.setKey(key)
				.setCreate(true)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.prepareFigureVariable(request);
	}

	// ========================================================================
	// ASSIGN
	// ========================================================================

	@Override
	public void assignReceiptInput(String dataset, String input, SExpression value) throws ProminerException {
		ReceiptInputAssignRequest request = createReceiptInputAssignRequest(dataset, input, value);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.assignReceiptInput(request);
	}

	private ReceiptInputAssignRequest createReceiptInputAssignRequest(String sheet, String input,
			SExpression expression) {
		ReceiptInputKey key = createReceiptInputKey(project, sheet, input);
		EvaluateExpression value = createExpression(expression);
		ReceiptInputAssignRequest request = ReceiptInputAssignRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		return request;
	}

	private ReceiptInputKey createReceiptInputKey(String project, String sheet, String input) {
		return ReceiptInputKey.newBuilder()
				.setProject(project)
				.setSheet(sheet)
				.setInput(input)
				.build();
	}

	@Override
	public void assignBuilderVariableExpression(String sheet, String variable, SExpression expression)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		EvaluateExpression value = createExpression(expression);
		BuilderVariableExpressionAssignRequest request = BuilderVariableExpressionAssignRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.assignBuilderVariableExpression(request);
	}

	@Override
	public void assignOutcomeExpression(String sheet, String variable, SExpression expression)
			throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, variable);
		EvaluateExpression value = createExpression(expression);
		OutcomeExpressionAssignRequest request = OutcomeExpressionAssignRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.assignOutcomeExpression(request);
	}

	@Override
	public void assignFigureVariableExpression(
			String sheet, String figure, String variable, SExpression expression) throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, figure, variable);
		EvaluateExpression value = createExpression(expression);
		FigureVariableExpressionAssignRequest request = FigureVariableExpressionAssignRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.assignFigureVariableExpression(request);
	}

	// ========================================================================
	// RENAME
	// ========================================================================

	@Override
	public void renameReceiptInput(String dataset, String oldName, String newName) throws ProminerException {
		SheetKey key = createSheetKey(project, dataset);
		ReceiptInputRenameRequest request = ReceiptInputRenameRequest.newBuilder()
				.setKey(key)
				.setOldName(oldName)
				.setNewName(newName)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.renameReceiptInput(request);
	}

	@Override
	public void renameSheet(String oldName, String newName) throws ProminerException {
		ProjectKey key = createProjectKey(project);
		SheetRenameRequest request = SheetRenameRequest.newBuilder()
				.setKey(key)
				.setOldName(oldName)
				.setNewName(newName)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		RenameResponse response = stub.renameSheet(request);
		if (!response.getRenamed()) {
			String message = response.getMessage();
			throw new ProminerException(message);
		}
	}

	@Override
	public void renameBuilderVariable(String sheet, String oldName, String newName) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		BuilderVariableRenameRequest request = BuilderVariableRenameRequest.newBuilder()
				.setKey(key)
				.setOldName(oldName)
				.setNewName(newName)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.renameBuilderVariable(request);
	}

	@Override
	public void renameOutlet(String sheet, String oldName, String newName) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		OutletRenameRequest request = OutletRenameRequest.newBuilder()
				.setKey(key)
				.setOldName(oldName)
				.setNewName(newName)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.renameOutlet(request);
	}

	@Override
	public void renameFigureVariable(
			String sheet, String figure, String oldName, String newName) throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, figure);
		FigureVariableRenameRequest request = FigureVariableRenameRequest.newBuilder()
				.setKey(key)
				.setOldName(oldName)
				.setNewName(newName)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.renameFigureVariable(request);
	}

	// ========================================================================
	// INSERT
	// ========================================================================

	@Override
	public void insertPreparationMutation(
			String sheet, int index, Transformation transmutation) throws ProminerException {
		DatasetMutationInsertRequest request = createDatasetMutationInsertRequest(sheet, index, transmutation);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.insertPreparationMutation(request);
	}

	private Order createOrder(Transformation transmutation) {
		String operation = transmutation.getName();
		Collection<String> names = transmutation.getOptionNames();
		Order.Builder builder = Order.newBuilder()
				.setName(operation);
		for (String name : names) {
			ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();
			SExpression value = transmutation.getOptionValue(name);
			EvaluateExpression expression = registry.toExpression(value);
			builder.putOptions(name, expression);
		}
		return builder.build();
	}

	@Override
	public void insertPreparationDisplayMutation(
			String sheet, int index, Transformation transmutation) throws ProminerException {
		DatasetMutationInsertRequest request = createDatasetMutationInsertRequest(sheet, index, transmutation);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.insertPreparationDisplayMutation(request);
	}

	@Override
	public void insertDatasetDisplayMutation(
			String sheet, int index, Transformation transmutation) throws ProminerException {
		DatasetMutationInsertRequest request = createDatasetMutationInsertRequest(sheet, index, transmutation);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.insertDatasetDisplayMutation(request);
	}

	private DatasetMutationInsertRequest createDatasetMutationInsertRequest(String sheet, int index,
			Transformation transmutation) {
		SheetKey key = createSheetKey(project, sheet);
		Order order = createOrder(transmutation);
		DatasetMutationInsertRequest request = DatasetMutationInsertRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.setOrder(order)
				.build();
		return request;
	}

	@Override
	public void insertBuilderVariableMutation(String sheet, String variable, int index,
			Transformation transmutation) throws ProminerException {
		BuilderVariableMutationInsertRequest request = createBuilderVariableMutationInsertRequest(
				sheet, variable, index, transmutation);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.insertBuilderVariableMutation(request);
	}

	private BuilderVariableKey createBuilderVariableKey(String project, String sheet, String variable) {
		return BuilderVariableKey.newBuilder()
				.setProject(project)
				.setSheet(sheet)
				.setVariable(variable)
				.build();
	}

	@Override
	public void insertBuilderVariableDisplayMutation(String sheet, String variable, int index,
			Transformation transmutation) throws ProminerException {
		BuilderVariableMutationInsertRequest request = createBuilderVariableMutationInsertRequest(
				sheet, variable, index, transmutation);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.insertBuilderVariableDisplayMutation(request);
	}

	private BuilderVariableMutationInsertRequest createBuilderVariableMutationInsertRequest(String sheet,
			String variable, int index, Transformation transmutation) {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		Order order = createOrder(transmutation);
		BuilderVariableMutationInsertRequest request = BuilderVariableMutationInsertRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.setOrder(order)
				.build();
		return request;
	}

	// ========================================================================
	// EXPORT
	// ========================================================================

	@Override
	public Object listDatasetExportFormat(String sheet) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		DatasetExportFormatListRequest request = DatasetExportFormatListRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		FormatListResponse response = stub.listDatasetExportFormat(request);
		return getObject(response);
	}

	@Override
	public Object listBuilderVariableExportFormat(String sheet, String variable) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableExportFormatListRequest request = BuilderVariableExportFormatListRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		FormatListResponse response = stub.listBuilderVariableExportFormat(request);
		return getObject(response);
	}

	@Override
	public Object listFigureVariableExportFormat(String sheet, String figure, String variable)
			throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, figure, variable);
		FigureVariableExportFormatListRequest request = FigureVariableExportFormatListRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		FormatListResponse response = stub.listFigureVariableExportFormat(request);
		return getObject(response);
	}

	@Override
	public Object listOutcomeExportFormat(String sheet, String variable) throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, variable);
		OutcomeExportFormatListRequest request = OutcomeExportFormatListRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		FormatListResponse response = stub.listOutcomeExportFormat(request);
		return getObject(response);
	}

	private Object getObject(FormatListResponse response) {
		DataminerObject list = response.getList();
		ObjectConverter converter = ObjectConverter.getInstance();
		Object object = converter.createObject(list);
		return object;
	}

	private Object getObject(ExportResponse response) {
		DataminerValue value = response.getValue();
		ValueConverterRegistry registry = ValueConverterRegistry.getInstance();
		Object object = registry.toObject(value);
		return object;
	}

	@Override
	public Object exportDatasetResult(String sheet, String format) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		DatasetExportRequest request = DatasetExportRequest.newBuilder()
				.setKey(key)
				.setFormat(format)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ExportResponse response = stub.exportDatasetResult(request);
		return getObject(response);
	}

	@Override
	public Object exportBuilderVariableResult(String sheet, String variable, String format)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableExportRequest request = BuilderVariableExportRequest.newBuilder()
				.setKey(key)
				.setFormat(format)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ExportResponse response = stub.exportBuilderVariableResult(request);
		return getObject(response);
	}

	@Override
	public Object exportFigureVariableResult(String sheet, String figure, String variable, String format)
			throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, figure, variable);
		FigureVariableExportRequest request = FigureVariableExportRequest.newBuilder()
				.setKey(key)
				.setFormat(format)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ExportResponse response = stub.exportFigureVariableResult(request);
		return getObject(response);
	}

	@Override
	public Object exportOutcomeResult(String sheet, String variable, String format) throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, variable);
		OutcomeExportRequest request = OutcomeExportRequest.newBuilder()
				.setKey(key)
				.setFormat(format)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ExportResponse response = stub.exportOutcomeResult(request);
		return getObject(response);
	}

	// ========================================================================
	// SELECT
	// ========================================================================

	@Override
	public Object selectIngestionResult(String sheet, Transformation transmutation) throws ProminerException {
		Order order = createOrder(transmutation);
		SheetKey key = createSheetKey(project, sheet);
		IngestionResultSelectRequest request = IngestionResultSelectRequest.newBuilder()
				.setKey(key)
				.setOrder(order)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		SelectResponse response = stub.selectIngestionResult(request);
		return getObject(response);
	}

	private Object getObject(SelectResponse response) {
		DataminerValue value = response.getValue();
		ValueConverterRegistry registry = ValueConverterRegistry.getInstance();
		Object object = registry.toObject(value);
		return object;
	}

	@Override
	public Object selectPreparationMutationResult(
			String sheet, int index, Transformation transmutation) throws ProminerException {
		Order order = createOrder(transmutation);
		SheetKey key = createSheetKey(project, sheet);
		PreparationMutationResultSelectRequest request = PreparationMutationResultSelectRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.setOrder(order)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		SelectResponse response = stub.selectPreparationMutationResult(request);
		return getObject(response);
	}

	@Override
	public Object selectDatasetResult(String sheet, Transformation transmutation, boolean display)
			throws ProminerException {
		Order order = createOrder(transmutation);
		SheetKey key = createSheetKey(project, sheet);
		DatasetSelectRequest request = DatasetSelectRequest.newBuilder()
				.setKey(key)
				.setOrder(order)
				.setDisplay(display)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		SelectResponse response = stub.selectDatasetResult(request);
		return getObject(response);
	}

	@Override
	public Object evaluateOnProject(SExpression expression) throws ProminerException {
		ProjectKey key = createProjectKey(project);
		EvaluateExpression value = createExpression(expression);
		OnProjectEvaluateRequest request = OnProjectEvaluateRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		EvaluateResponse response = stub.evaluateOnProject(request);
		return getObject(response);
	}

	@Override
	public Object evaluateOnForesee(String sheet, SExpression expression) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		EvaluateExpression value = createExpression(expression);
		OnForeseeEvaluateRequest request = OnForeseeEvaluateRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		EvaluateResponse response = stub.evaluateOnForesee(request);
		return getObject(response);
	}

	@Override
	public Object evaluateOnPreparation(String sheet, XExpression expression) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		EvaluateExpression value = createExpression(expression);
		OnPreparationEvaluateRequest request = OnPreparationEvaluateRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		EvaluateResponse response = stub.evaluateOnPreparation(request);
		return getObject(response);
	}

	@Override
	public Object evaluateOnFigure(String sheet, String outlet, SExpression expression)
			throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, outlet);
		EvaluateExpression value = createExpression(expression);
		OnFigureEvaluateRequest request = OnFigureEvaluateRequest.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		EvaluateResponse response = stub.evaluateOnFigure(request);
		return getObject(response);
	}

	private EvaluateExpression createExpression(SExpression expression) {
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();
		EvaluateExpression value = registry.toExpression(expression);
		return value;
	}

	private Object getObject(EvaluateResponse response) {
		DataminerValue value = response.getValue();
		ValueConverterRegistry registry = ValueConverterRegistry.getInstance();
		Object object = registry.toObject(value);
		return object;
	}

	@Override
	public Object selectBuilderVariablePreparationResult(String sheet, String variable,
			Transformation transmutation) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		Order order = createOrder(transmutation);
		BuilderVariablePreparationResultSelectRequest request = BuilderVariablePreparationResultSelectRequest
				.newBuilder()
				.setKey(key)
				.setOrder(order)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		SelectResponse response = stub.selectBuilderVariablePreparationResult(request);
		return getObject(response);
	}

	@Override
	public Object selectBuilderVariableMutationResult(String sheet, String variable,
			int index, Transformation transmutation) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		Order order = createOrder(transmutation);
		BuilderVariableMutationResultSelectRequest request = BuilderVariableMutationResultSelectRequest
				.newBuilder()
				.setKey(key)
				.setOrder(order)
				.setIndex(index)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		SelectResponse response = stub.selectBuilderVariableMutationResult(request);
		return getObject(response);
	}

	@Override
	public Object evaluateOnBuilderVariablePreparation(String sheet,
			String variable, XExpression expression) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		EvaluateExpression value = createExpression(expression);
		OnBuilderVariablePreparationEvaluateRequest request = OnBuilderVariablePreparationEvaluateRequest
				.newBuilder()
				.setKey(key)
				.setExpression(value)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		EvaluateResponse response = stub.evaluateOnBuilderVariablePreparation(request);
		return getObject(response);
	}

	// ========================================================================
	// APPLY
	// ========================================================================

	@Override
	public boolean computeReceipt(String sheet) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		ReceiptComputeRequest request = ReceiptComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computeReceipt(request);
		return response.getApplied();
	}

	@Override
	public boolean computePreparation(String sheet) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		PreparationComputeRequest request = PreparationComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computePreparation(request);
		return response.getApplied();
	}

	@Override
	public boolean applySourceResult(String sheet) throws ProminerException {
		SheetKey key = createSheetKey(project, sheet);
		SourceResultApplyRequest request = SourceResultApplyRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.applySourceResult(request);
		return response.getApplied();
	}

	@Override
	public boolean computeBuilderVariable(String sheet, String variable) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableComputeRequest request = BuilderVariableComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computeBuilderVariable(request);
		return response.getApplied();
	}

	@Override
	public boolean computeBuilderVariablePreparation(String sheet, String variable)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableComputeRequest request = BuilderVariableComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computeBuilderVariablePreparation(request);
		return response.getApplied();
	}

	@Override
	public boolean computeOutcome(String sheet, String variable) throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, variable);
		OutcomeComputeRequest request = OutcomeComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computeOutcome(request);
		return response.getApplied();
	}

	@Override
	public boolean computeFigureVariable(String sheet, String outlet, String variable)
			throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, outlet, variable);
		FigureVariableComputeRequest request = FigureVariableComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.computeFigureVariable(request);
		return response.getApplied();
	}

	@Override
	public boolean applyBuilderVariablePreparation(String sheet, String variable)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableComputeRequest request = BuilderVariableComputeRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		ApplyResponse response = stub.applyBuilderVariablePreparation(request);
		return response.getApplied();
	}

	// ========================================================================
	// REMOVE
	// ========================================================================

	@Override
	public void removeReceiptInput(String dataset, String input) throws ProminerException {
		ReceiptInputKey key = createReceiptInputKey(project, dataset, input);
		ReceiptInputRemoveRequest request = ReceiptInputRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeReceiptInput(request);
	}

	private DatasetMutationRemoveRequest createDatasetMutationRemoveRequest(String sheet, int index) {
		SheetKey key = createSheetKey(project, sheet);
		DatasetMutationRemoveRequest request = DatasetMutationRemoveRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.build();
		return request;
	}

	@Override
	public void removePreparationMutation(String sheet, int index) throws ProminerException {
		DatasetMutationRemoveRequest request = createDatasetMutationRemoveRequest(sheet, index);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removePreparationMutation(request);
	}

	@Override
	public void removePreparationDisplayMutation(String sheet, int index) throws ProminerException {
		DatasetMutationRemoveRequest request = createDatasetMutationRemoveRequest(sheet, index);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removePreparationDisplayMutation(request);
	}

	@Override
	public void removeDatasetDisplayMutation(String sheet, int index) throws ProminerException {
		DatasetMutationRemoveRequest request = createDatasetMutationRemoveRequest(sheet, index);
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeDatasetDisplayMutation(request);
	}

	@Override
	public void removeBuilderVariable(String sheet, String variable) throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableRemoveRequest request = BuilderVariableRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeBuilderVariable(request);
	}

	@Override
	public void removeBuilderVariableMutation(String sheet, String variable, int index)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableMutationRemoveRequest request = BuilderVariableMutationRemoveRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeBuilderVariableMutation(request);
	}

	@Override
	public void removeBuilderVariableDisplayMutation(String sheet, String variable, int index)
			throws ProminerException {
		BuilderVariableKey key = createBuilderVariableKey(project, sheet, variable);
		BuilderVariableMutationRemoveRequest request = BuilderVariableMutationRemoveRequest.newBuilder()
				.setKey(key)
				.setIndex(index)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeBuilderVariableDisplayMutation(request);
	}

	@Override
	public void removeOutlet(String sheet, String outlet) throws ProminerException {
		OutletKey key = createOutletKey(project, sheet, outlet);
		OutletRemoveRequest request = OutletRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeOutlet(request);
	}

	@Override
	public void removeFigureVariable(String sheet, String figure, String variable) throws ProminerException {
		FigureVariableKey key = createFigureVariableKey(project, sheet, figure, variable);
		FigureVariableRemoveRequest request = FigureVariableRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeFigureVariable(request);
	}

	@Override
	public void removeSheet(String sheet) {
		SheetKey key = createSheetKey(project, sheet);
		SheetRemoveRequest request = SheetRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeSheet(request);
	}

	@Override
	public void removeProject() throws ProminerException {
		ProjectKey key = createProjectKey(project);
		ProjectRemoveRequest request = ProjectRemoveRequest.newBuilder()
				.setKey(key)
				.build();
		DataminerBlockingStub stub = DataminerGrpc.newBlockingStub(channel);
		stub.removeProject(request);
	}

	// ========================================================================
	// PLAN
	// ========================================================================

	public static QualifiedPlan getPlan() {
		QualifiedPlan plan = new QualifiedPlan(GarutProminer.class);
		return plan;
	}

}
