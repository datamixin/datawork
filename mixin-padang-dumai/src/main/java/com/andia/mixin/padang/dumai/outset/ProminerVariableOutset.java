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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_COMPUTE;
import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EVALUATE;
import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_POINTED;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.bekasi.ConsolidatorTarget;
import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.FormulaModifier;
import com.andia.mixin.padang.dumai.FormulaParser;
import com.andia.mixin.padang.dumai.FormulaRectification;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerFormer;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.RecipeAnchor;
import com.andia.mixin.padang.dumai.anchors.RefineryAnchor;
import com.andia.mixin.padang.dumai.anchors.ScopeAnchor;
import com.andia.mixin.padang.dumai.anchors.ViewsetAnchor;
import com.andia.mixin.padang.outset.VariableOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Rectification;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerVariableOutset implements VariableOutset, Lifetime, ConsolidatorTarget {

	private static Logger logger = LoggerFactory.getLogger(ProminerVariableOutset.class);

	private Supervisor supervisor;
	private Consolidator consolidation;
	private ProminerFormer former;
	private ScopeAnchor scope;
	private RefineryAnchor refinery;
	private String name;
	private String formula;

	public ProminerVariableOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignConsolidation();
		assignScopeAnchor();
		preparePath();
		prepareRecipeAnchor();
		assignRefineryAnchor();
	}

	private void assignConsolidation() {
		consolidation = supervisor.getCapability(Consolidator.class);
	}

	private void assignScopeAnchor() {
		scope = supervisor.getPreparedObject(ScopeAnchor.class);
	}

	private void assignRefineryAnchor() {
		refinery = supervisor.getPreparedObject(RefineryAnchor.class);
	}

	private void preparePath() {
		Supervisor parent = supervisor.getParent();
		OriginAnchor anchor = parent.getPreparedObject(OriginAnchor.class);
		former = new ProminerFormer(supervisor, anchor);
	}

	private void prepareRecipeAnchor() {
		supervisor.setPreparedObject(RecipeAnchor.class, new ProminerRecipeAnchor());
	}

	@Override
	public void setName(String name) {
		former.setName(name);
		if (this.name != null) {
			try {
				scope.renameVariable(this.name, name);
				consolidation.referenceRenamed(former);
			} catch (Exception e) {
				logger.error("Fail set name variable '" + name + "'", e);
			}
		}
		former.updatePath();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Invoke(INSPECT_POINTED)
	public Object inspectPointed() {
		return consolidation.referencePointed(former);
	}

	public boolean isUnderResult() {
		Supervisor parent = supervisor.getParent();
		OriginAnchor anchor = parent.getCapability(OriginAnchor.class);
		return anchor instanceof ViewsetAnchor;
	}

	@Override
	public void setFormula(String formula) {
		if (this.formula != null) {
			try {
				setVariableExpression(formula);
				scope.computeVariable(name);
			} catch (Exception e) {
				logger.error("Fail set formula variable '" + name + "'", e);
			}
		}
		this.formula = formula;
	}

	private void setVariableExpression(String formula) throws Exception {
		FormulaParser parser = new FormulaParser();
		SExpression value = parser.parse(formula);
		scope.assignVariableExpression(name, value);
	}

	@Override
	public void initiate() {
		try {
			scope.prepareVariable(name);
			setVariableExpression(formula);
			consolidation.referenceCreated(former);
		} catch (Exception e) {
			logger.error("Fail initiate variable '" + name + "'", e);
		}
	}

	@Override
	public void activate() {
	}

	@Override
	public void referencePointed(ConsolidatorPath path, Set<Object> users) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, formula);
			modifier.inusedReference(path, users);
		} catch (Exception e) {
			logger.error("Fail check used reference variable '" + name + "'", e);
		}
	}

	@Override
	public void referenceRenamed(ConsolidatorPath path) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, formula);
			int reference = modifier.renameReference(path);
			if (reference > 0) {
				modifier.commit((formula) -> {
					Rectification rectification = new FormulaRectification(formula);
					supervisor.submit(rectification);
				});
			}
		} catch (Exception e) {
			logger.error("Fail rename reference variable '" + name + "'", e);
		}
	}

	@Override
	public void terminate() {
		try {
			scope.removeVariable(name);
			consolidation.referenceRemoved(former);
		} catch (Exception e) {
			logger.error("Fail terminate variable '" + name + "'", e);
		}
	}

	@Invoke(INSPECT_COMPUTE)
	public Object inspectCompute() {
		try {
			return scope.computeVariable(name);
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(INSPECT_EVALUATE)
	public Object inspectEvaluate(XExpression expression) {
		try {
			Object value = scope.evaluateExpression(expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	class ProminerRecipeAnchor implements RecipeAnchor {

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepare() throws ProminerException {
			refinery.preparePreparation(name);
		}

		// ========================================================================
		// INSERT
		// ========================================================================

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			refinery.insertPreparationMutation(name, index, transmutation);
		}

		@Override
		public void insertDisplayMutation(int index, Transformation transmutation)
				throws ProminerException {
			refinery.insertPreparationDisplayMutation(name, index, transmutation);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object selectMutationResult(int index, Transformation transmutation)
				throws ProminerException {
			return refinery.selectPreparationMutationResult(name, index, transmutation);
		}

		@Override
		public Object evaluate(XExpression expression) throws ProminerException {
			return refinery.evaluateOnPreparation(name, expression);
		}

		@Override
		public Object selectResult(Transformation transmutation, boolean display) throws ProminerException {
			return refinery.selectPreparationResult(name, transmutation, display);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removeMutation(int index) throws ProminerException {
			refinery.removePreparationMutation(name, index);
		}

		@Override
		public void removeDisplayMutation(int index) throws ProminerException {
			refinery.removePreparationDisplayMutation(name, index);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean compute() throws ProminerException {
			return refinery.computePreparation(name);
		}

		@Override
		public boolean applyResult() throws ProminerException {
			return refinery.applyPreparationResult(name);
		}

	}

}
