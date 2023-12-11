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
package com.andia.mixin.padang.dumai.anchors;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.sleman.model.XExpression;

public interface DatasetAnchor {

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareIngestion() throws ProminerException;

	public void preparePreparation() throws ProminerException;

	// ========================================================================
	// INSERT
	// ========================================================================

	public void insertPreparationDisplayMutation(int index, Transformation transformation) throws ProminerException;

	public void insertPreparationMutation(int index, Transformation transformation) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removePreparationMutation(int index) throws ProminerException;

	public void removePreparationDisplayMutation(int index) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object selectIngestionResult(Transformation direction) throws ProminerException;

	public Object selectPreparationMutationResult(int index, Transformation transformation) throws ProminerException;

	public Object evaluateOnPreparation(XExpression expression) throws ProminerException;

	public Object selectResult(Transformation direction, boolean display) throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computePreparation() throws ProminerException;

	public boolean applySourceResult() throws ProminerException;

}
