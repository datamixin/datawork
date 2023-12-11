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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_COMPUTE;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.bekasi.visage.VisageLogical;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerTransmutation;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.InspectionAnchor;
import com.andia.mixin.padang.dumai.anchors.PreparationAnchor;
import com.andia.mixin.padang.dumai.anchors.RecipeAnchor;
import com.andia.mixin.padang.outset.PreparationOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerPreparationOutset extends ProminerSourceOutset implements PreparationOutset, Lifetime {

	private static final String INSPECT_RESULT_AT = "inspect-result-at";
	private static final String INSPECT_APPLY_RESULT = "inspect-apply-result";

	private static Logger logger = LoggerFactory.getLogger(ProminerPreparationOutset.class);

	private Supervisor supervisor;
	private RecipeAnchor recipe;

	public ProminerPreparationOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignRecipeAnchor();
		prepareInspectionAnchor();
		preparePreparationAnchor();
	}

	private void assignRecipeAnchor() {
		recipe = supervisor.getPreparedObject(RecipeAnchor.class);
	}

	private void prepareInspectionAnchor() {
		supervisor.setPreparedObject(InspectionAnchor.class, new ProminerInspectionAnchor());
	}

	private void preparePreparationAnchor() {
		supervisor.setPreparedObject(PreparationAnchor.class, new ProminerPreparationAnchor());
	}

	@Invoke(ProminerOutset.INSPECT_RESULT)
	public Object inspectResult(String operation, Map<String, SExpression> arguments) {
		try {
			Transformation transmutation = new ProminerTransmutation(operation, arguments);
			return recipe.selectResult(transmutation, true);
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(INSPECT_RESULT_AT)
	public Object inspectResultAt(int index, String operation, Map<String, SExpression> arguments) {
		try {
			Transformation transmutation = new ProminerTransmutation(operation, arguments);
			Object value = recipe.selectMutationResult(index, transmutation);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(INSPECT_COMPUTE)
	public Object inspectCompute() {
		try {
			Object value = recipe.compute();
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(ProminerOutset.INSPECT_EVALUATE)
	public Object inspectEvaluateAt(XExpression expression) {
		try {
			Object value = recipe.evaluate(expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Override
	public void initiate() {
		try {
			recipe.prepare();
		} catch (ProminerException e) {
			logger.error("Fail initiate preparation", e);
		}
	}

	@Override
	public void activate() {

	}

	@Override
	public void terminate() {

	}

	@Invoke(INSPECT_APPLY_RESULT)
	public Object applyResult() {
		try {
			boolean applied = recipe.applyResult();
			return new VisageLogical(applied);
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	class ProminerInspectionAnchor implements InspectionAnchor {

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			recipe.insertDisplayMutation(index, transmutation);
		}

		@Override
		public void removeMutation(int index) throws ProminerException {
			recipe.removeDisplayMutation(index);
		}

	}

	class ProminerPreparationAnchor implements PreparationAnchor {

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			recipe.insertMutation(index, transmutation);
		}

		@Override
		public void removeMutation(int index) throws ProminerException {
			recipe.removeMutation(index);
		}

		@Override
		public Object selectMutationResult(int index, Transformation transmutation) throws ProminerException {
			return recipe.selectMutationResult(index, transmutation);
		}

	}

}
