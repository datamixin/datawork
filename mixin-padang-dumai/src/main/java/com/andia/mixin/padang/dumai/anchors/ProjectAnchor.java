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
package com.andia.mixin.padang.dumai.anchors;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public interface ProjectAnchor {

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareDataset(String sheet) throws ProminerException;

	public void prepareIngestion(String sheet) throws ProminerException;

	public void preparePreparation(String sheet) throws ProminerException;

	public void prepareBuilder(String sheet) throws ProminerException;

	public void prepareBuilderVariable(String sheet, String variable) throws ProminerException;

	public void prepareBuilderVariablePreparation(String name, String variable) throws ProminerException;

	public void prepareOutlook(String sheet) throws ProminerException;

	public void prepareOutcome(String sheet, String outlet) throws ProminerException;

	public void prepareFigure(String sheet, String outlet) throws ProminerException;

	public void prepareFigureVariable(String sheet, String outlet, String variable) throws ProminerException;

	// ========================================================================
	// ASSIGN
	// ========================================================================

	public void assignReceiptInput(String sheet, String input, SExpression value) throws ProminerException;

	public void assignBuilderVariableExpression(
			String sheet, String variable, SExpression expression) throws ProminerException;

	public void assignOutcomeExpression(
			String sheet, String outlet, SExpression expression) throws ProminerException;

	public void assignFigureVariableExpression(
			String sheet, String outlet, String variable, SExpression expression) throws ProminerException;

	// ========================================================================
	// RENAME
	// ========================================================================

	public void renameSheet(String oldName, String newName) throws ProminerException;

	public void renameReceiptInput(String sheet, String oldName, String newName) throws ProminerException;

	public void renameBuilderVariable(String sheet, String oldName, String newName) throws ProminerException;

	public void renameOutlet(String sheet, String oldName, String newName) throws ProminerException;

	public void renameFigureVariable(
			String sheet, String outlet, String oldName, String newName) throws ProminerException;

	// ========================================================================
	// INSERT
	// ========================================================================

	public void insertPreparationMutation(String sheet, int index, Transformation transformation)
			throws ProminerException;

	public void insertDatasetDisplayMutation(String sheet, int index, Transformation transformation)
			throws ProminerException;

	public void insertPreparationDisplayMutation(
			String sheet, int index, Transformation transformation) throws ProminerException;

	public void insertBuilderVariablePreparationMutation(String name, String variable,
			int index, Transformation transmutation) throws ProminerException;

	public void insertBuilderVariablePreparationDisplayMutation(String name, String variable,
			int index, Transformation transmutation) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object selectIngestionResult(String sheet, Transformation transformation)
			throws ProminerException;

	public Object selectPreparationMutationResult(
			String sheet, int index, Transformation transformation) throws ProminerException;

	public Object selectDatasetResult(String sheet, Transformation transformation, boolean display)
			throws ProminerException;

	public Object selectBuilderVariablePreparationResult(String name, String variable,
			Transformation transmutation) throws ProminerException;

	public Object selectBuilderVariablePreparationMutationResult(String name, String variable,
			int index, Transformation transmutation) throws ProminerException;

	public Object evaluateOnForesee(String sheet, SExpression expression) throws ProminerException;

	public Object evaluateOnPreparation(String name, XExpression expression) throws ProminerException;

	public Object evaluateOnOutlookFigure(String sheet, String outlet, SExpression expression)
			throws ProminerException;

	public Object evaluateOnBuilderVariablePreparation(String name, String variable, XExpression expression)
			throws ProminerException;

	// ========================================================================
	// EXPORT
	// ========================================================================

	public Object listDatasetExportFormat(String sheet) throws ProminerException;

	public Object listBuilderVariableExportFormat(String sheet, String variable) throws ProminerException;

	public Object listOutcomeExportFormat(String sheet, String variable) throws ProminerException;

	public Object listFigureVariableExportFormat(String sheet, String figure, String variable)
			throws ProminerException;

	public Object exportDatasetResult(String sheet, String format) throws ProminerException;

	public Object exportBuilderVariableResult(String sheet, String variable, String format)
			throws ProminerException;

	public Object exportOutcomeResult(String sheet, String variable, String format)
			throws ProminerException;

	public Object exportFigureVariableResult(String sheet, String figure, String variable, String format)
			throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computeReceipt(String sheet) throws ProminerException;

	public boolean computePreparation(String sheet) throws ProminerException;

	public boolean applySourceResult(String sheet) throws ProminerException;

	public boolean computeBuilderVariable(String sheet, String variable) throws ProminerException;

	public boolean computeBuilderVariablePreparation(String name, String variable) throws ProminerException;

	public boolean applyBuilderVariablePreparation(String name, String variable) throws ProminerException;

	public boolean computeOutcome(String sheet, String variable) throws ProminerException;

	public boolean computeFigureVariable(String sheet, String outlet, String variable) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removePreparationMutation(String sheet, int index) throws ProminerException;

	public void removeDatasetDisplayMutation(String sheet, int index) throws ProminerException;

	public void removeReceiptInput(String sheet, String input) throws ProminerException;

	public void removePreparationDisplayMutation(String sheet, int index) throws ProminerException;

	public void removeBuilderVariable(String sheet, String variable) throws ProminerException;

	public void removeBuilderVariableMutation(String name, String variable, int index)
			throws ProminerException;

	public void removeBuilderVariableDisplayMutation(String name, String variable, int index)
			throws ProminerException;

	public void removeOutlet(String sheet, String outlet) throws ProminerException;

	public void removeFigureVariable(String sheet, String outlet, String variable) throws ProminerException;

	public void removeSheet(String sheet) throws ProminerException;

}
