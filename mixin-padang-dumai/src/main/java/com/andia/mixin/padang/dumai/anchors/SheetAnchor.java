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

public interface SheetAnchor {

	public String getPathName();

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareDataset() throws ProminerException;

	public void prepareIngestion() throws ProminerException;

	public void preparePreparation() throws ProminerException;

	public void prepareBuilder() throws ProminerException;

	public void prepareBuilderVariable(String variable) throws ProminerException;

	public void prepareBuilderVariablePreparation(String variable) throws ProminerException;

	public void prepareOutlook() throws ProminerException;

	public void prepareOutlookOutcome(String outlet) throws ProminerException;

	public void prepareOutlookFigure(String outlet) throws ProminerException;

	public void prepareOutlookFigureVariable(String outlet, String variable) throws ProminerException;

	// ========================================================================
	// ASSIGN
	// ========================================================================

	public void assignReceiptInput(String input, SExpression value) throws ProminerException;

	public void assignBuilderVariableExpression(String variable, SExpression expression) throws ProminerException;

	public void assignOutlookOutcomeExpression(String outlet, SExpression expression) throws ProminerException;

	public void assignOutlookFigureVariableExpression(
			String outlet, String variable, SExpression expression) throws ProminerException;

	// ========================================================================
	// RENAME
	// ========================================================================

	public void renameReceiptInput(String oldName, String newName) throws ProminerException;

	public void renameBuilderVariable(String oldName, String newName) throws ProminerException;

	public void renameOutlookOutlet(String oldName, String newName) throws ProminerException;

	public void renameOutlookFigureVariable(String outlet, String oldName, String newName) throws ProminerException;

	// ========================================================================
	// INSERT
	// ========================================================================

	public void insertDatasetDisplayMutation(int index, Transformation transformation)
			throws ProminerException;

	public void insertPreparationMutation(int index, Transformation transformation)
			throws ProminerException;

	public void insertPreparationDisplayMutation(
			int index, Transformation transformation) throws ProminerException;

	public void insertBuilderVariablePreparationMutation(String variable, int index,
			Transformation transmutation) throws ProminerException;

	public void insertBuilderVariablePreparationDisplayMutation(String variable, int index,
			Transformation transmutation) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object selectIngestionResult(Transformation transformation) throws ProminerException;

	public Object selectPreparationMutationResult(
			int index, Transformation transformation) throws ProminerException;

	public Object evaluateOnPreparation(XExpression expression) throws ProminerException;

	public Object selectDatasetResult(Transformation transformation, boolean display)
			throws ProminerException;

	public Object selectBuilderVariablePreparationResult(String variable,
			Transformation transmutation, boolean display) throws ProminerException;

	public Object selectBuilderVariablePreparationMutationResult(String variable, int index,
			Transformation transmutation) throws ProminerException;

	public Object evaluateOnBuilderVariablePreparation(String variable,
			XExpression expression) throws ProminerException;

	public Object evaluateOnForesee(SExpression expression) throws ProminerException;

	public Object evaluateOnOutlookFigure(String outlet, SExpression expression) throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computeReceipt() throws ProminerException;

	public boolean computePreparation() throws ProminerException;

	public boolean applySourceResult() throws ProminerException;

	public boolean computeBuilderVariable(String variable) throws ProminerException;

	public boolean computeBuilderVariablePreparation(String variable) throws ProminerException;

	public boolean applyBuilderVariablePreparation(String variable) throws ProminerException;

	public boolean computeOutlookOutcome(String outlet) throws ProminerException;

	public boolean computeOutlookFigureVariable(String outlet, String variable) throws ProminerException;

	// ========================================================================
	// EXPORT
	// ========================================================================

	public Object listDatasetExportFormat() throws ProminerException;

	public Object listBuilderVariableExportFormat(String variable) throws ProminerException;

	public Object listOutlookOutcomeExportFormat(String variable) throws ProminerException;

	public Object listOutlookFigureVariableExportFormat(
			String figure, String variable) throws ProminerException;

	public Object exportDatasetResult(String format) throws ProminerException;

	public Object exportBuilderVariableResult(String variable, String format) throws ProminerException;

	public Object exportOutlookOutcomeResult(String variable, String format) throws ProminerException;

	public Object exportOutlookFigureVariableResult(
			String figure, String variable, String format) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removePreparationMutation(int index) throws ProminerException;

	public void removeDatasetDisplayMutation(int index) throws ProminerException;

	public void removeReceiptInput(String input) throws ProminerException;

	public void removePreparationDisplayMutation(int index) throws ProminerException;

	public void removeBuilderVariable(String variable) throws ProminerException;

	public void removeBuilderVariableMutation(String variable, int index) throws ProminerException;

	public void removeBuilderVariableDisplayMutation(String variable, int index) throws ProminerException;

	public void removeOutlookOutlet(String outlet) throws ProminerException;

	public void removeOutlookFigureVariable(String outlet, String variable) throws ProminerException;

}
