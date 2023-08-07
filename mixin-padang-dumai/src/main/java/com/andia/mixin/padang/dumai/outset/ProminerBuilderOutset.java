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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.RefineryAnchor;
import com.andia.mixin.padang.dumai.anchors.ScopeAnchor;
import com.andia.mixin.padang.outset.BuilderOutset;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerBuilderOutset extends ProminerForeseeOutset implements BuilderOutset {

	private static Logger logger = LoggerFactory.getLogger(ProminerBuilderOutset.class);

	public ProminerBuilderOutset(Supervisor supervisor) {
		super(supervisor);
		prepareScopeAnchor();
		prepareRefineryAnchor();
	}

	private void prepareRefineryAnchor() {
		supervisor.setPreparedObject(RefineryAnchor.class, new BuilderRefineryAnchor());
	}

	private void prepareScopeAnchor() {
		supervisor.setPreparedObject(ScopeAnchor.class, new BuilderOriginAnchor());
	}

	@Override
	public void setRevision(String revision) {

	}

	@Override
	public void setStructure(String renderer) {

	}

	@Override
	public void setExplanation(String explaination) {

	}

	@Override
	public void initiate() {
		try {
			sheet.prepareBuilder();
		} catch (ProminerException e) {
			logger.error("Fail initiate modeler", e);
		}
	}

	class BuilderOriginAnchor implements ScopeAnchor {

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepareVariable(String variable) throws ProminerException {
			sheet.prepareBuilderVariable(variable);
		}

		// ========================================================================
		// RENAME
		// ========================================================================

		@Override
		public void renameVariable(String oldName, String newName) throws ProminerException {
			sheet.renameBuilderVariable(oldName, newName);
		}

		// ========================================================================
		// ASSIGN
		// ========================================================================

		@Override
		public void assignVariableExpression(String variable, SExpression value) throws ProminerException {
			sheet.assignBuilderVariableExpression(variable, value);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object evaluateExpression(SExpression expression) throws ProminerException {
			return sheet.evaluateOnForesee(expression);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean computeVariable(String variable) throws ProminerException {
			return sheet.computeBuilderVariable(variable);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removeVariable(String variable) throws ProminerException {
			sheet.removeBuilderVariable(variable);
		}

	}

	class BuilderRefineryAnchor implements RefineryAnchor {

		@Override
		public void preparePreparation(String variable) throws ProminerException {
			sheet.prepareBuilderVariablePreparation(variable);
		}

		@Override
		public void insertPreparationMutation(String variable, int index, Transformation transmutation)
				throws ProminerException {
			sheet.insertBuilderVariablePreparationMutation(variable, index, transmutation);
		}

		@Override
		public void insertPreparationDisplayMutation(String variable, int index, Transformation transmutation)
				throws ProminerException {
			sheet.insertBuilderVariablePreparationDisplayMutation(variable, index, transmutation);
		}

		@Override
		public void removePreparationMutation(String variable, int index) throws ProminerException {
			sheet.removeBuilderVariableMutation(variable, index);
		}

		@Override
		public void removePreparationDisplayMutation(String variable, int index) throws ProminerException {
			sheet.removeBuilderVariableDisplayMutation(variable, index);
		}

		@Override
		public Object selectPreparationMutationResult(String variable, int index, Transformation transmutation)
				throws ProminerException {
			return sheet.selectBuilderVariablePreparationMutationResult(variable, index, transmutation);
		}

		@Override
		public Object selectPreparationResult(String variable, Transformation transmutation, boolean display)
				throws ProminerException {
			return sheet.selectBuilderVariablePreparationResult(variable, transmutation, display);
		}

		@Override
		public Object evaluateOnPreparation(String variable, XExpression expression) throws ProminerException {
			return sheet.evaluateOnBuilderVariablePreparation(variable, expression);
		}

		@Override
		public boolean computePreparation(String variable) throws ProminerException {
			return sheet.computeBuilderVariablePreparation(variable);
		}

		@Override
		public boolean applyPreparationResult(String variable) throws ProminerException {
			return sheet.applyBuilderVariablePreparation(variable);
		}

	}

}
