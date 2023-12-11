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

import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.anchors.ObserverAnchor;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.ScopeAnchor;
import com.andia.mixin.padang.outset.OutlookOutset;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public class ProminerOutlookOutset extends ProminerForeseeOutset implements OutlookOutset {

	private static Logger logger = LoggerFactory.getLogger(ProminerOutlookOutset.class);

	public ProminerOutlookOutset(Supervisor supervisor) {
		super(supervisor);
		prepareViewsetAnchor();
	}

	protected void prepareViewsetAnchor() {
		OutlookOriginAnchor anchor = new OutlookOriginAnchor();
		supervisor.setPreparedObject(OriginAnchor.class, anchor);
		supervisor.setPreparedObject(ObserverAnchor.class, anchor);
	}

	@Override
	public void initiate() {
		try {
			sheet.prepareOutlook();
		} catch (ProminerException e) {
			logger.error("Fail initiate outlook", e);
		}
	}

	class OutlookOriginAnchor extends OriginAnchor implements ObserverAnchor {

		public OutlookOriginAnchor() {
			super(supervisor.getPreparedObject(OriginAnchor.class));
		}

		@Override
		public String getPathName() {
			return sheet.getPathName();
		}

		@Override
		protected boolean isExists(String child) {

			// Cari figure
			final AtomicBoolean exists = new AtomicBoolean(false);
			supervisor.applyFirstDescendant(ProminerFigureOutset.class, (outset) -> {
				ProminerFigureOutset figureOutset = (ProminerFigureOutset) outset;
				String name = figureOutset.getName();
				return name.equals(child);
			}, (outset) -> exists.set(true));

			if (!exists.get()) {

				// Cari outcome
				supervisor.applyFirstDescendant(ProminerVariableOutset.class, (outset) -> {
					ProminerVariableOutset figureOutset = (ProminerVariableOutset) outset;
					if (figureOutset.isUnderResult()) {
						String name = figureOutset.getName();
						return name.equals(child);
					}
					return false;
				}, (outset) -> exists.set(true));
			}
			return exists.get();
		}

		// ========================================================================
		// PREPARE
		// ========================================================================

		@Override
		public void prepareOutcome(String outlet) throws ProminerException {
			sheet.prepareOutlookOutcome(outlet);
		}

		@Override
		public void prepareFigure(String outlet) throws ProminerException {
			sheet.prepareOutlookFigure(outlet);
		}

		@Override
		public void prepareFigureVariable(String outlet, String variable) throws ProminerException {
			sheet.prepareOutlookFigureVariable(outlet, variable);
		}

		// ========================================================================
		// RENAME
		// ========================================================================

		@Override
		public void renameOutlet(String oldName, String newName) throws ProminerException {
			sheet.renameOutlookOutlet(oldName, newName);
		}

		@Override
		public void renameFigureVariable(String outlet, String oldName, String newName) throws ProminerException {
			sheet.renameOutlookFigureVariable(outlet, oldName, newName);
		}

		// ========================================================================
		// ASSIGN
		// ========================================================================

		@Override
		public void assignOutcomeExpression(String outlet, SExpression expression) throws ProminerException {
			sheet.assignOutlookOutcomeExpression(outlet, expression);
		}

		@Override
		public void assignFigureVariableExpression(String outlet, String variable, SExpression expression)
				throws ProminerException {
			sheet.assignOutlookFigureVariableExpression(outlet, variable, expression);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object evaluate(SExpression expression) throws ProminerException {
			return sheet.evaluateOnForesee(expression);
		}

		@Override
		public Object evaluateOnFigure(String outlet, SExpression expression) throws ProminerException {
			return sheet.evaluateOnOutlookFigure(outlet, expression);
		}

		// ========================================================================
		// APPLY
		// ========================================================================

		@Override
		public boolean computeOutcome(String variable) throws ProminerException {
			return sheet.computeOutlookOutcome(variable);
		}

		@Override
		public boolean computeFigureVariable(String outlet, String variable) throws ProminerException {
			return sheet.computeOutlookFigureVariable(outlet, variable);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removeOutlet(String outlet) throws ProminerException {
			sheet.removeOutlookOutlet(outlet);
		}

		@Override
		public void removeFigureVariable(String outlet, String variable) throws ProminerException {
			sheet.removeOutlookFigureVariable(outlet, variable);
		}

	}

	class OutlookScopeAnchor implements ScopeAnchor {

		@Override
		public void prepareVariable(String variable) throws ProminerException {
			sheet.prepareOutlookOutcome(variable);
		}

		@Override
		public boolean computeVariable(String variable) throws ProminerException {
			return sheet.computeOutlookOutcome(variable);
		}

		@Override
		public void renameVariable(String oldName, String newName) throws ProminerException {
			sheet.renameOutlookOutlet(oldName, newName);
		}

		@Override
		public void assignVariableExpression(String variable, SExpression value) throws ProminerException {
			sheet.assignOutlookOutcomeExpression(variable, value);
		}

		@Override
		public Object evaluateExpression(SExpression expression) throws ProminerException {
			return sheet.evaluateOnForesee(expression);
		}

		@Override
		public void removeVariable(String variable) throws ProminerException {
			sheet.removeOutlookOutlet(variable);
		}

	}

}
