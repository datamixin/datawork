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

public interface RecipeAnchor {

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepare() throws ProminerException;

	// ========================================================================
	// INSERT
	// ========================================================================

	public void insertDisplayMutation(int index, Transformation direction) throws ProminerException;

	public void insertMutation(int index, Transformation direction) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removeDisplayMutation(int index) throws ProminerException;

	public void removeMutation(int index) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object selectResult(Transformation transmutation, boolean display) throws ProminerException;

	public Object selectMutationResult(int index, Transformation transmutation) throws ProminerException;

	public Object evaluate(XExpression expression) throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean compute() throws ProminerException;

	public boolean applyResult() throws ProminerException;

}
