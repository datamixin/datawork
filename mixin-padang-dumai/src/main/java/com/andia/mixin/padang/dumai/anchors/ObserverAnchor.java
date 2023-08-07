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

public interface ObserverAnchor {

	public String getPathName();

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareOutcome(String outlet) throws ProminerException;

	public void prepareFigure(String outlet) throws ProminerException;

	public void prepareFigureVariable(String outlet, String variable) throws ProminerException;

	// ========================================================================
	// RENAME
	// ========================================================================

	public void renameOutlet(String oldName, String newName) throws ProminerException;

	public void renameFigureVariable(String outlet, String oldName, String newName) throws ProminerException;

	// ========================================================================
	// ASSIGN
	// ========================================================================

	public void assignOutcomeExpression(String outlet, SExpression expression) throws ProminerException;

	public void assignFigureVariableExpression(String outlet, String variable, SExpression expression)
			throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object evaluate(SExpression expression) throws ProminerException;

	public Object evaluateOnFigure(String outlet, SExpression expression) throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computeOutcome(String variable) throws ProminerException;

	public boolean computeFigureVariable(String outlet, String variable) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removeFigureVariable(String outlet, String variable) throws ProminerException;

	public void removeOutlet(String outlet) throws ProminerException;

}
