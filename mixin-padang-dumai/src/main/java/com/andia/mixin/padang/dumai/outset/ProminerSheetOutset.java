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
package com.andia.mixin.padang.dumai.outset;

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_POINTED;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.Lifestage.Stage;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerFormer;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.ProjectAnchor;
import com.andia.mixin.padang.dumai.anchors.SheetAnchor;
import com.andia.mixin.padang.outset.SheetOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerSheetOutset implements SheetOutset, Lifetime {

	private static Logger logger = LoggerFactory.getLogger(ProminerSheetOutset.class);

	private Supervisor supervisor;
	private Consolidator consolidation;
	private ProminerFormer former;
	private ProjectAnchor project;
	private String name;

	public ProminerSheetOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignConsolidation();
		assignProjectAnchor();
		prepareNamePath();
		prepareSheetAnchor();
	}

	private void assignConsolidation() {
		consolidation = supervisor.getCapability(Consolidator.class);
	}

	private void assignProjectAnchor() {
		project = supervisor.getPreparedObject(ProjectAnchor.class);
	}

	private void prepareNamePath() {
		former = new ProminerFormer(supervisor, (OriginAnchor) project);
	}

	private void prepareSheetAnchor() {
		supervisor.setPreparedObject(SheetAnchor.class, new ProminerSheetAnchor());
	}

	@Override
	public void setName(String name) {
		former.setName(name);
		if (this.name != null) {
			try {
				project.renameSheet(this.name, name);
				consolidation.referenceRenamed(former);
			} catch (ProminerException e) {
				logger.error("Fail rename sheet to '" + name + "'", e);
			}
		}
		former.updatePath();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Override
	public void initiate() {
		consolidation.referenceCreated(former);
	}

	@Override
	public void activate() {

	}

	@Override
	public void terminate() {
		Lifestage lifestage = supervisor.getCapability(Lifestage.class);
		Stage stage = lifestage.getStage();
		if (stage == Stage.SERVING) {
			try {
				project.removeSheet(name);
				consolidation.referenceRemoved(former);
			} catch (ProminerException e) {
				logger.error("Fail terminate sheet '" + name + "'", e);
			}
		}
	}

	@Invoke(INSPECT_POINTED)
	public Object inspectPointed() {
		return consolidation.referencePointed(former);
	}

	class ProminerSheetAnchor implements SheetAnchor {

		@Override
		public String getPathName() {
			return name;
		}

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepareDataset() throws ProminerException {
			project.prepareDataset(name);
		}

		@Override
		public void prepareIngestion() throws ProminerException {
			project.prepareIngestion(name);
		}

		@Override
		public void preparePreparation() throws ProminerException {
			project.preparePreparation(name);
		}

		@Override
		public void prepareBuilder() throws ProminerException {
			project.prepareBuilder(name);
		}

		@Override
		public void prepareBuilderVariable(String variable) throws ProminerException {
			project.prepareBuilderVariable(name, variable);
		}

		@Override
		public void prepareBuilderVariablePreparation(String variable)
				throws ProminerException {
			project.prepareBuilderVariablePreparation(name, variable);
		}

		@Override
		public void prepareOutlook() throws ProminerException {
			project.prepareOutlook(name);
		}

		@Override
		public void prepareOutlookOutcome(String outlet) throws ProminerException {
			project.prepareOutcome(name, outlet);
		}

		@Override
		public void prepareOutlookFigure(String outlet) throws ProminerException {
			project.prepareFigure(name, outlet);
		}

		@Override
		public void prepareOutlookFigureVariable(String outlet, String variable) throws ProminerException {
			project.prepareFigureVariable(name, outlet, variable);
		}

		// ========================================================================
		// ASSIGN
		// ========================================================================

		@Override
		public void assignReceiptInput(String input, SExpression value) throws ProminerException {
			project.assignReceiptInput(name, input, value);
		}

		@Override
		public void assignBuilderVariableExpression(
				String variable, SExpression expression) throws ProminerException {
			project.assignBuilderVariableExpression(name, variable, expression);
		}

		@Override
		public void assignOutlookOutcomeExpression(
				String outlet, SExpression expression) throws ProminerException {
			project.assignOutcomeExpression(name, outlet, expression);
		}

		@Override
		public void assignOutlookFigureVariableExpression(
				String outlet, String variable, SExpression expression) throws ProminerException {
			project.assignFigureVariableExpression(name, outlet, variable, expression);
		}

		// ========================================================================
		// RENAME
		// ========================================================================

		@Override
		public void renameBuilderVariable(String oldName, String newName) throws ProminerException {
			project.renameBuilderVariable(name, oldName, newName);
		}

		@Override
		public void renameReceiptInput(String oldName, String newName) throws ProminerException {
			project.renameReceiptInput(name, oldName, newName);
		}

		@Override
		public void renameOutlookOutlet(String oldName, String newName) throws ProminerException {
			project.renameOutlet(name, oldName, newName);
		}

		@Override
		public void renameOutlookFigureVariable(String outlet, String oldName, String newName)
				throws ProminerException {
			project.renameFigureVariable(name, outlet, oldName, newName);
		}

		// ========================================================================
		// INSERT
		// ========================================================================

		@Override
		public void insertDatasetDisplayMutation(int index, Transformation transformation)
				throws ProminerException {
			project.insertDatasetDisplayMutation(name, index, transformation);
		}

		@Override
		public void insertPreparationMutation(int index, Transformation transformation)
				throws ProminerException {
			project.insertPreparationMutation(name, index, transformation);
		}

		@Override
		public void insertPreparationDisplayMutation(
				int index, Transformation transformation) throws ProminerException {
			project.insertPreparationDisplayMutation(name, index, transformation);
		}

		@Override
		public void insertBuilderVariablePreparationMutation(String variable, int index,
				Transformation transmutation) throws ProminerException {
			project.insertBuilderVariablePreparationMutation(name, variable, index, transmutation);
		}

		@Override
		public void insertBuilderVariablePreparationDisplayMutation(
				String variable, int index, Transformation transmutation) throws ProminerException {
			project.insertBuilderVariablePreparationDisplayMutation(name, variable, index, transmutation);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object selectIngestionResult(Transformation transformation) throws ProminerException {
			return project.selectIngestionResult(name, transformation);
		}

		@Override
		public Object selectPreparationMutationResult(
				int index, Transformation transformation) throws ProminerException {
			return project.selectPreparationMutationResult(name, index, transformation);
		}

		@Override
		public Object evaluateOnPreparation(XExpression expression) throws ProminerException {
			return project.evaluateOnPreparation(name, expression);
		}

		@Override
		public Object selectDatasetResult(Transformation transformation, boolean display)
				throws ProminerException {
			return project.selectDatasetResult(name, transformation, display);
		}

		@Override
		public Object evaluateOnForesee(SExpression expression) throws ProminerException {
			return project.evaluateOnForesee(name, expression);
		}

		@Override
		public Object selectBuilderVariablePreparationResult(String variable,
				Transformation transmutation, boolean display) throws ProminerException {
			return project.selectBuilderVariablePreparationResult(name, variable, transmutation);
		}

		@Override
		public Object selectBuilderVariablePreparationMutationResult(String variable,
				int index, Transformation transmutation) throws ProminerException {
			return project.selectBuilderVariablePreparationMutationResult(name, variable, index, transmutation);
		}

		@Override
		public Object evaluateOnBuilderVariablePreparation(String variable,
				XExpression expression) throws ProminerException {
			return project.evaluateOnBuilderVariablePreparation(name, variable, expression);
		}

		@Override
		public Object evaluateOnOutlookFigure(String outlet, SExpression expression) throws ProminerException {
			return project.evaluateOnOutlookFigure(name, outlet, expression);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean computeReceipt() throws ProminerException {
			return project.computeReceipt(name);
		}

		@Override
		public boolean computePreparation() throws ProminerException {
			return project.computePreparation(name);
		}

		@Override
		public boolean applySourceResult() throws ProminerException {
			return project.applySourceResult(name);
		}

		@Override
		public boolean computeBuilderVariable(String variable) throws ProminerException {
			return project.computeBuilderVariable(name, variable);
		}

		@Override
		public boolean computeBuilderVariablePreparation(String variable)
				throws ProminerException {
			return project.computeBuilderVariablePreparation(name, variable);
		}

		@Override
		public boolean applyBuilderVariablePreparation(String variable) throws ProminerException {
			return project.applyBuilderVariablePreparation(name, variable);
		}

		@Override
		public boolean computeOutlookOutcome(String outlet) throws ProminerException {
			return project.computeOutcome(name, outlet);
		}

		@Override
		public boolean computeOutlookFigureVariable(String outlet, String variable) throws ProminerException {
			return project.computeFigureVariable(name, outlet, variable);
		}

		// ========================================================================
		// EXPORT
		// ========================================================================

		@Override
		public Object listDatasetExportFormat() throws ProminerException {
			return project.listDatasetExportFormat(name);
		}

		@Override
		public Object listBuilderVariableExportFormat(String variable) throws ProminerException {
			return project.listBuilderVariableExportFormat(name, variable);
		}

		@Override
		public Object listOutlookOutcomeExportFormat(String variable) throws ProminerException {
			return project.listOutcomeExportFormat(name, variable);
		}

		@Override
		public Object listOutlookFigureVariableExportFormat(
				String figure, String variable) throws ProminerException {
			return project.listFigureVariableExportFormat(name, figure, variable);
		}

		@Override
		public Object exportDatasetResult(String format) throws ProminerException {
			return project.exportDatasetResult(name, format);
		}

		@Override
		public Object exportBuilderVariableResult(String variable, String format) throws ProminerException {
			return project.exportBuilderVariableResult(name, variable, format);
		}

		@Override
		public Object exportOutlookOutcomeResult(
				String variable, String format) throws ProminerException {
			return project.exportOutcomeResult(name, variable, format);
		}

		@Override
		public Object exportOutlookFigureVariableResult(
				String figure, String variable, String format) throws ProminerException {
			return project.exportFigureVariableResult(name, figure, variable, format);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removePreparationMutation(int index) throws ProminerException {
			project.removePreparationMutation(name, index);
		}

		@Override
		public void removeDatasetDisplayMutation(int index) throws ProminerException {
			project.removeDatasetDisplayMutation(name, index);
		}

		@Override
		public void removeReceiptInput(String input) throws ProminerException {
			project.removeReceiptInput(name, input);
		}

		@Override
		public void removePreparationDisplayMutation(int index) throws ProminerException {
			project.removePreparationDisplayMutation(name, index);
		}

		@Override
		public void removeBuilderVariable(String variable) throws ProminerException {
			project.removeBuilderVariable(name, variable);
		}

		@Override
		public void removeBuilderVariableMutation(String variable, int index)
				throws ProminerException {
			project.removeBuilderVariableMutation(name, variable, index);
		}

		@Override
		public void removeBuilderVariableDisplayMutation(String variable, int index) throws ProminerException {
			project.removeBuilderVariableDisplayMutation(name, variable, index);
		}

		@Override
		public void removeOutlookOutlet(String outlet) throws ProminerException {
			project.removeOutlet(name, outlet);
		}

		@Override
		public void removeOutlookFigureVariable(String outlet, String variable) throws ProminerException {
			project.removeFigureVariable(name, outlet, variable);
		}

	}

}
