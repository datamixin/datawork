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
import com.andia.mixin.sleman.api.SExpression;

public interface ExperimentAnchor {

	public String getPathName();

	// ========================================================================
	// PREPARE
	// ========================================================================

	public void prepareInsight(String insight) throws ProminerException;

	public void prepareInsightOutcome(String insight, String outlet) throws ProminerException;

	public void prepareInsightFigure(String insight, String outlet) throws ProminerException;

	public void prepareInsightFigureVariable(String insight, String outlet, String variable) throws ProminerException;

	// ========================================================================
	// RENAME
	// ========================================================================

	public void renameInsight(String oldName, String newName) throws ProminerException;

	public void renameInsightOutlet(String insight, String oldName, String newName) throws ProminerException;

	public void renameInsightFigureVariable(String insight, String outlet, String oldName, String newName)
			throws ProminerException;

	// ========================================================================
	// ASSIGN
	// ========================================================================

	public void assignInsightOutcomeExpression(String insight, String outlet, SExpression expression)
			throws ProminerException;

	public void assignInsightFigureVariableExpression(String insight, String outlet, String variable,
			SExpression expression) throws ProminerException;

	// ========================================================================
	// SELECT
	// ========================================================================

	public Object evaluateOnInsight(String name, SExpression expression) throws ProminerException;

	public Object evaluateOnInsightFigure(String insight, String outlet, SExpression expression)
			throws ProminerException;

	// ========================================================================
	// APPLY
	// ========================================================================

	public boolean computeInsightOutcome(String name, String variable) throws ProminerException;

	public boolean computeInsightFigureVariable(String name, String outlet, String variable) throws ProminerException;

	// ========================================================================
	// REMOVE
	// ========================================================================

	public void removeInsightOutlet(String name, String outlet) throws ProminerException;

	public void removeInsightFigureVariable(String name, String outlet, String variable) throws ProminerException;

}
