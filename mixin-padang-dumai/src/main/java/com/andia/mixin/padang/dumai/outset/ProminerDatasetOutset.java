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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.DISPLAY;
import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EXPORT_FORMAT_LIST;
import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EXPORT_RESULT;
import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_RESULT;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerTransmutation;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.DatasetAnchor;
import com.andia.mixin.padang.dumai.anchors.InspectionAnchor;
import com.andia.mixin.padang.dumai.anchors.RecipeAnchor;
import com.andia.mixin.padang.outset.DatasetOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SLogical;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerDatasetOutset extends ProminerReceiptOutset implements DatasetOutset {

	private static Logger logger = LoggerFactory.getLogger(ProminerDatasetOutset.class);

	public ProminerDatasetOutset(Supervisor supervisor) {
		super(supervisor);
		prepareRecipeAnchor();
		prepareDatasetAnchor();
		prepareInspectionAnchor();
	}

	private void prepareRecipeAnchor() {
		supervisor.setPreparedObject(RecipeAnchor.class, new ProminerRecipeAnchor());
	}

	private void prepareDatasetAnchor() {
		supervisor.setPreparedObject(DatasetAnchor.class, new ProminerDatasetAnchor());
	}

	private void prepareInspectionAnchor() {
		supervisor.setPreparedObject(InspectionAnchor.class, new ProminerInspectionAnchor());
	}

	@Override
	public void initiate() {
		try {
			sheet.prepareDataset();
		} catch (ProminerException e) {
			logger.error("Fail initiate dataset", e);
		}
	}

	@Invoke(INSPECT_RESULT)
	public Object inspectResult(String operation, Map<String, SExpression> arguments) {
		try {
			Transformation transmutation = new ProminerTransmutation(operation, arguments);
			boolean display = true;
			if (arguments.containsKey(DISPLAY)) {
				SLogical logical = (SLogical) arguments.remove(DISPLAY);
				display = logical.getValue();
			}
			return sheet.selectDatasetResult(transmutation, display);
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(INSPECT_EXPORT_FORMAT_LIST)
	public Object inspectExportFormatList() {
		try {
			return sheet.listDatasetExportFormat();
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Invoke(INSPECT_EXPORT_RESULT)
	public Object inspectExportResult(String format) {
		try {
			return sheet.exportDatasetResult(format);
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	class ProminerInspectionAnchor implements InspectionAnchor {

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			sheet.insertDatasetDisplayMutation(index, transmutation);
		}

		@Override
		public void removeMutation(int index) throws ProminerException {
			sheet.removeDatasetDisplayMutation(index);
		}

	}

	class ProminerDatasetAnchor implements DatasetAnchor {

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepareIngestion() throws ProminerException {
			sheet.prepareIngestion();
		}

		@Override
		public void preparePreparation() throws ProminerException {
			sheet.preparePreparation();
		}

		// ========================================================================
		// INSERT
		// ========================================================================

		@Override
		public void insertPreparationMutation(int index, Transformation transmutation) throws ProminerException {
			sheet.insertPreparationMutation(index, transmutation);
		}

		@Override
		public void insertPreparationDisplayMutation(int index, Transformation transmutation)
				throws ProminerException {
			sheet.insertPreparationDisplayMutation(index, transmutation);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object selectIngestionResult(Transformation transmutation) throws ProminerException {
			return sheet.selectIngestionResult(transmutation);
		}

		@Override
		public Object selectPreparationMutationResult(int index, Transformation transmutation)
				throws ProminerException {
			return sheet.selectPreparationMutationResult(index, transmutation);
		}

		@Override
		public Object evaluateOnPreparation(XExpression expression) throws ProminerException {
			return sheet.evaluateOnPreparation(expression);
		}

		@Override
		public Object selectResult(Transformation transmutation, boolean display) throws ProminerException {
			return sheet.selectDatasetResult(transmutation, display);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removePreparationMutation(int index) throws ProminerException {
			sheet.removePreparationMutation(index);
		}

		@Override
		public void removePreparationDisplayMutation(int index) throws ProminerException {
			sheet.removePreparationDisplayMutation(index);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean computePreparation() throws ProminerException {
			return sheet.computePreparation();
		}

		@Override
		public boolean applySourceResult() throws ProminerException {
			return sheet.applySourceResult();
		}

	}

	class ProminerRecipeAnchor implements RecipeAnchor {

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepare() throws ProminerException {
			sheet.preparePreparation();
		}

		// ========================================================================
		// INSERT
		// ========================================================================

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			sheet.insertPreparationMutation(index, transmutation);
		}

		@Override
		public void insertDisplayMutation(int index, Transformation transmutation)
				throws ProminerException {
			sheet.insertPreparationDisplayMutation(index, transmutation);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object selectMutationResult(int index, Transformation transmutation)
				throws ProminerException {
			return sheet.selectPreparationMutationResult(index, transmutation);
		}

		@Override
		public Object evaluate(XExpression expression) throws ProminerException {
			return sheet.evaluateOnPreparation(expression);
		}

		@Override
		public Object selectResult(Transformation transmutation, boolean display) throws ProminerException {
			return sheet.selectDatasetResult(transmutation, display);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removeMutation(int index) throws ProminerException {
			sheet.removePreparationMutation(index);
		}

		@Override
		public void removeDisplayMutation(int index) throws ProminerException {
			sheet.removePreparationDisplayMutation(index);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean compute() throws ProminerException {
			return sheet.computePreparation();
		}

		@Override
		public boolean applyResult() throws ProminerException {
			return sheet.applySourceResult();
		}

	}

}
