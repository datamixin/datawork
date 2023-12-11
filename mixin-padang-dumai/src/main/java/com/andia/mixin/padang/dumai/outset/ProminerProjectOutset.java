/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
package com.andia.mixin.padang.dumai.outset;

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EVALUATE;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.ProjectException;
import com.andia.mixin.padang.dumai.Prominer;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.ProjectAnchor;
import com.andia.mixin.padang.outset.ProjectOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerProjectOutset implements ProjectOutset {

	private Supervisor supervisor;
	private Prominer datastore;

	public ProminerProjectOutset(Supervisor supervisor) throws ProminerException {
		this.supervisor = supervisor;
		assignProminer();
		prepareProjectAnchor(supervisor);
	}

	private void assignProminer() throws ProminerException {
		datastore = supervisor.getCapability(Prominer.class);
	}

	private void prepareProjectAnchor(Supervisor supervisor) {
		ProjectOriginAnchor anchor = new ProjectOriginAnchor();
		supervisor.setPreparedObject(OriginAnchor.class, anchor);
		supervisor.setPreparedObject(ProjectAnchor.class, anchor);
	}

	@Override
	public void copyTo(UUID fileId) throws ProjectException {
		try {
			datastore.copyTo(fileId);
		} catch (ProminerException e) {
			throw new ProjectException("Fail copy project", e);
		}
	}

	@Invoke(INSPECT_EVALUATE)
	public Object inspectEvaluate(XExpression expression) {
		try {
			Object value = datastore.evaluateOnProject(expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Override
	public void delete() throws ProjectException {
		try {
			datastore.removeProject();
		} catch (ProminerException e) {
			throw new ProjectException("Fail delete project", e);
		}
	}

	class ProjectOriginAnchor extends OriginAnchor implements ProjectAnchor {

		@Override
		protected String getPathName() {
			Lifestage lifestage = supervisor.getCapability(Lifestage.class);
			UUID fileId = lifestage.getFileId();
			Consolidator consolidator = supervisor.getCapability(Consolidator.class);
			String fullPath = consolidator.getFullPath(fileId);
			return fullPath;
		}

		@Override
		protected boolean isExists(String child) {
			final AtomicBoolean exists = new AtomicBoolean(false);
			supervisor.applyFirstDescendant(ProminerSheetOutset.class, (outset) -> {
				String name = outset.getName();
				return name.equals(child);
			}, (outset) -> exists.set(true));
			return exists.get();
		}

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepareDataset(String name) throws ProminerException {
			datastore.prepareDataset(name);
		}

		@Override
		public void prepareIngestion(String sheet) throws ProminerException {
			datastore.prepareIngestion(sheet);
		}

		@Override
		public void preparePreparation(String sheet) throws ProminerException {
			datastore.preparePreparation(sheet);
		}

		@Override
		public void prepareBuilder(String sheet) throws ProminerException {
			datastore.prepareBuilder(sheet);
		}

		@Override
		public void prepareBuilderVariable(String sheet, String variable) throws ProminerException {
			datastore.prepareBuilderVariable(sheet, variable);
		}

		@Override
		public void prepareBuilderVariablePreparation(String sheet, String variable) throws ProminerException {
			datastore.prepareBuilderVariablePreparation(sheet, variable);
		}

		@Override
		public void prepareOutlook(String sheet) throws ProminerException {
			datastore.prepareOutlook(sheet);
		}

		@Override
		public void prepareOutcome(String sheet, String outlet) throws ProminerException {
			datastore.prepareOutcome(sheet, outlet);
		}

		@Override
		public void prepareFigure(String sheet, String outlet) throws ProminerException {
			datastore.prepareFigure(sheet, outlet);
		}

		// @Override
		public void prepareFigureVariable(String sheet, String outlet, String variable)
				throws ProminerException {
			datastore.prepareFigureVariable(sheet, outlet, variable);
		}

		// ========================================================================
		// ASSIGN
		// ========================================================================

		@Override
		public void assignReceiptInput(String sheet, String input, SExpression value) throws ProminerException {
			datastore.assignReceiptInput(sheet, input, value);
		}

		@Override
		public void assignBuilderVariableExpression(String sheet, String variable, SExpression expression)
				throws ProminerException {
			datastore.assignBuilderVariableExpression(sheet, variable, expression);
		}

		@Override
		public void assignOutcomeExpression(String sheet, String outlet, SExpression expression)
				throws ProminerException {
			datastore.assignOutcomeExpression(sheet, outlet, expression);
		}

		@Override
		public void assignFigureVariableExpression(
				String sheet, String outlet, String variable, SExpression expression) throws ProminerException {
			datastore.assignFigureVariableExpression(sheet, outlet, variable, expression);
		}

		// ========================================================================
		// RENAME
		// ========================================================================

		@Override
		public void renameSheet(String oldName, String newName) throws ProminerException {
			datastore.renameSheet(oldName, newName);
		}

		@Override
		public void renameReceiptInput(String sheet, String oldName, String newName) throws ProminerException {
			datastore.renameReceiptInput(sheet, oldName, newName);
		}

		@Override
		public void renameBuilderVariable(String sheet, String oldName, String newName) throws ProminerException {
			datastore.renameBuilderVariable(sheet, oldName, newName);
		}

		@Override
		public void renameOutlet(String sheet, String oldName, String newName) throws ProminerException {
			datastore.renameOutlet(sheet, oldName, newName);
		}

		@Override
		public void renameFigureVariable(String sheet, String outlet, String oldName, String newName)
				throws ProminerException {
			datastore.renameFigureVariable(sheet, outlet, oldName, newName);
		}

		// ========================================================================
		// INSERT
		// ========================================================================

		@Override
		public void insertPreparationMutation(String sheet, int index, Transformation transformation)
				throws ProminerException {
			datastore.insertPreparationMutation(sheet, index, transformation);
		}

		@Override
		public void insertDatasetDisplayMutation(
				String sheet, int index, Transformation transformation) throws ProminerException {
			datastore.insertDatasetDisplayMutation(sheet, index, transformation);
		}

		@Override
		public void insertPreparationDisplayMutation(String sheet, int index, Transformation transformation)
				throws ProminerException {
			datastore.insertPreparationDisplayMutation(sheet, index, transformation);
		}

		@Override
		public void insertBuilderVariablePreparationMutation(String sheet, String variable,
				int index, Transformation transmutation) throws ProminerException {
			datastore.insertBuilderVariableMutation(sheet, variable, index, transmutation);
		}

		@Override
		public void insertBuilderVariablePreparationDisplayMutation(String sheet, String variable,
				int index, Transformation transmutation) throws ProminerException {
			datastore.insertBuilderVariableDisplayMutation(sheet, variable, index, transmutation);
		}

		// ========================================================================
		// EXPORT
		// ========================================================================

		@Override
		public Object listDatasetExportFormat(String sheet) throws ProminerException {
			return datastore.listDatasetExportFormat(sheet);
		}

		@Override
		public Object listOutcomeExportFormat(String sheet, String variable) throws ProminerException {
			return datastore.listOutcomeExportFormat(sheet, variable);
		}

		@Override
		public Object listBuilderVariableExportFormat(String sheet, String variable) throws ProminerException {
			return datastore.listBuilderVariableExportFormat(sheet, variable);
		}

		@Override
		public Object listFigureVariableExportFormat(String sheet, String figure, String variable)
				throws ProminerException {
			return datastore.listFigureVariableExportFormat(sheet, figure, variable);
		}

		@Override
		public Object exportDatasetResult(String sheet, String format) throws ProminerException {
			return datastore.exportDatasetResult(sheet, format);
		}

		@Override
		public Object exportBuilderVariableResult(String sheet, String variable, String format)
				throws ProminerException {
			return datastore.exportBuilderVariableResult(sheet, variable, format);
		}

		@Override
		public Object exportOutcomeResult(String sheet, String variable, String format)
				throws ProminerException {
			return datastore.exportOutcomeResult(sheet, variable, format);
		}

		@Override
		public Object exportFigureVariableResult(String sheet, String figure, String variable, String format)
				throws ProminerException {
			return datastore.exportFigureVariableResult(sheet, figure, variable, format);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object selectIngestionResult(String sheet, Transformation transformation) throws ProminerException {
			return datastore.selectIngestionResult(sheet, transformation);
		}

		@Override
		public Object selectPreparationMutationResult(
				String sheet, int index, Transformation transformation) throws ProminerException {
			return datastore.selectPreparationMutationResult(sheet, index, transformation);
		}

		@Override
		public Object selectDatasetResult(
				String dataset, Transformation transformation, boolean display) throws ProminerException {
			return datastore.selectDatasetResult(dataset, transformation, display);
		}

		@Override
		public Object selectBuilderVariablePreparationResult(String sheet, String variable,
				Transformation transmutation) throws ProminerException {
			return datastore.selectBuilderVariablePreparationResult(sheet, variable, transmutation);
		}

		@Override
		public Object selectBuilderVariablePreparationMutationResult(String sheet, String variable,
				int index, Transformation transmutation) throws ProminerException {
			return datastore.selectBuilderVariableMutationResult(
					sheet, variable, index, transmutation);
		}

		@Override
		public Object evaluateOnForesee(String sheet, SExpression expression) throws ProminerException {
			return datastore.evaluateOnForesee(sheet, expression);
		}

		@Override
		public Object evaluateOnPreparation(String sheet, XExpression expression)
				throws ProminerException {
			return datastore.evaluateOnPreparation(sheet, expression);
		}

		@Override
		public Object evaluateOnOutlookFigure(String sheet, String outlet, SExpression expression)
				throws ProminerException {
			return datastore.evaluateOnFigure(sheet, outlet, expression);
		}

		@Override
		public Object evaluateOnBuilderVariablePreparation(String sheet,
				String variable, XExpression expression) throws ProminerException {
			return datastore.evaluateOnBuilderVariablePreparation(sheet, variable, expression);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean computeReceipt(String sheet) throws ProminerException {
			return datastore.computeReceipt(sheet);
		}

		@Override
		public boolean computePreparation(String sheet) throws ProminerException {
			return datastore.computePreparation(sheet);
		}

		@Override
		public boolean applySourceResult(String sheet) throws ProminerException {
			return datastore.applySourceResult(sheet);
		}

		@Override
		public boolean computeBuilderVariable(String sheet, String variable) throws ProminerException {
			return datastore.computeBuilderVariable(sheet, variable);
		}

		@Override
		public boolean computeOutcome(String sheet, String variable) throws ProminerException {
			return datastore.computeOutcome(sheet, variable);
		}

		@Override
		public boolean applyBuilderVariablePreparation(String sheet, String variable) throws ProminerException {
			return datastore.applyBuilderVariablePreparation(sheet, variable);
		}

		@Override
		public boolean computeBuilderVariablePreparation(String sheet, String variable) throws ProminerException {
			return datastore.computeBuilderVariablePreparation(sheet, variable);
		}

		@Override
		public boolean computeFigureVariable(String name, String outlet, String variable)
				throws ProminerException {
			return datastore.computeFigureVariable(name, outlet, variable);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removePreparationMutation(String sheet, int index) throws ProminerException {
			datastore.removePreparationMutation(sheet, index);
		}

		@Override
		public void removeDatasetDisplayMutation(String sheet, int index) throws ProminerException {
			datastore.removeDatasetDisplayMutation(sheet, index);
		}

		@Override
		public void removePreparationDisplayMutation(String sheet, int index) throws ProminerException {
			datastore.removePreparationDisplayMutation(sheet, index);
		}

		@Override
		public void removeReceiptInput(String sheet, String input) throws ProminerException {
			datastore.removeReceiptInput(sheet, input);
		}

		@Override
		public void removeBuilderVariable(String sheet, String variable) throws ProminerException {
			datastore.removeBuilderVariable(sheet, variable);
		}

		@Override
		public void removeBuilderVariableMutation(String sheet, String variable,
				int index) throws ProminerException {
			datastore.removeBuilderVariableMutation(sheet, variable, index);
		}

		@Override
		public void removeBuilderVariableDisplayMutation(String sheet, String variable,
				int index) throws ProminerException {
			datastore.removeBuilderVariableDisplayMutation(sheet, variable, index);
		}

		@Override
		public void removeOutlet(String sheet, String outlet) throws ProminerException {
			datastore.removeOutlet(sheet, outlet);
		}

		@Override
		public void removeFigureVariable(String sheet, String outlet, String variable)
				throws ProminerException {
			datastore.removeFigureVariable(sheet, outlet, variable);
		}

		public void removeSheet(String sheet) throws ProminerException {
			datastore.removeSheet(sheet);
		}

	}

}
