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
import com.andia.mixin.sleman.api.SExpression;

public interface ScopeAnchor extends ContextAnchor {

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareVariable(String name) throws ProminerException;

	// ========================================================================
	// INSERT
	// ========================================================================

	public void assignVariableExpression(String name, SExpression value) throws ProminerException;

	// ========================================================================
	// RENAME
	// ========================================================================

	public void renameVariable(String oldName, String newName) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removeVariable(String name) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object evaluateExpression(SExpression expression) throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computeVariable(String name) throws ProminerException;

}
