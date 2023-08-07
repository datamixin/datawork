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

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import com.andia.mixin.bekasi.visage.VisageNumber;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.anchors.ObserverAnchor;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.ScopeAnchor;
import com.andia.mixin.padang.dumai.anchors.ViewsetAnchor;
import com.andia.mixin.padang.outset.ViewsetOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public class ProminerViewsetOutset implements ViewsetOutset {

	public final static String INSPECT_ONMOVE = "inspect-onmove";

	private Supervisor supervisor;
	private Set<Object> onmove = new HashSet<>();

	private ObserverAnchor observer;

	public ProminerViewsetOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		prepareScopeAnchor();
		prepareViewsetAnchor();
		assignObserverAnchor();
	}

	private void assignObserverAnchor() {
		observer = supervisor.getPreparedObject(ObserverAnchor.class);
	}

	protected void prepareScopeAnchor() {
		supervisor.setPreparedObject(ScopeAnchor.class, new ViewsetScopeAnchor());
	}

	protected void prepareViewsetAnchor() {
		ViewsetOriginAnchor anchor = new ViewsetOriginAnchor();
		supervisor.setPreparedObject(OriginAnchor.class, anchor);
		supervisor.setPreparedObject(ViewsetAnchor.class, anchor);
	}

	@Invoke(INSPECT_ONMOVE)
	public VisageNumber inspectOnmove(String[] identifiers) {
		for (String identifier : identifiers) {
			onmove.add(identifier);
		}
		int size = onmove.size();
		return new VisageNumber(size);
	}

	class ViewsetOriginAnchor extends OriginAnchor implements ViewsetAnchor {

		public ViewsetOriginAnchor() {
			super(supervisor.getPreparedObject(OriginAnchor.class));
		}

		@Override
		protected String getPathName() {
			return observer.getPathName();
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
			observer.prepareOutcome(outlet);
		}

		@Override
		public void prepareViewsetFigure(String outlet) throws ProminerException {
			observer.prepareFigure(outlet);
		}

		@Override
		public void prepareFigureVariable(String outlet, String variable) throws ProminerException {
			observer.prepareFigureVariable(outlet, variable);
		}

		// ========================================================================
		// RENAME
		// ========================================================================

		@Override
		public void renameOutlet(String oldName, String newName) throws ProminerException {
			observer.renameOutlet(oldName, newName);
		}

		@Override
		public void renameFigureVariable(String outlet, String oldName, String newName) throws ProminerException {
			observer.renameFigureVariable(outlet, oldName, newName);
		}

		// ========================================================================
		// ASSIGN
		// ========================================================================

		@Override
		public void assignViewsetVariableExpression(String outlet, SExpression expression) throws ProminerException {
			observer.assignOutcomeExpression(outlet, expression);
		}

		@Override
		public void assignFigureVariableExpression(String outlet, String variable, SExpression expression)
				throws ProminerException {
			observer.assignFigureVariableExpression(outlet, variable, expression);
		}

		// ========================================================================
		// SELECT
		// ========================================================================

		@Override
		public Object evaluateOnFigure(String outlet, SExpression expression) throws ProminerException {
			return observer.evaluateOnFigure(outlet, expression);
		}

		@Override
		public boolean computeFigureVariable(String outlet, String variable) throws ProminerException {
			return observer.computeFigureVariable(outlet, variable);
		}

		// ========================================================================
		// REMOVE
		// ========================================================================

		@Override
		public void removeFigureVariable(String outlet, String variable) throws ProminerException {
			observer.removeFigureVariable(outlet, variable);
		}

		@Override
		public void removeOutlet(String outlet) throws ProminerException {
			observer.removeOutlet(outlet);
		}

		@Override
		public boolean isOnmove(String identifier) {
			return onmove.contains(identifier);
		}

		@Override
		public void restoreOnmove(String identifier) {
			onmove.remove(identifier);
		}

	}

	class ViewsetScopeAnchor implements ScopeAnchor {

		@Override
		public void prepareVariable(String variable) throws ProminerException {
			observer.prepareOutcome(variable);
		}

		@Override
		public boolean computeVariable(String variable) throws ProminerException {
			return observer.computeOutcome(variable);
		}

		@Override
		public void renameVariable(String oldName, String newName) throws ProminerException {
			observer.renameOutlet(oldName, newName);
		}

		@Override
		public void assignVariableExpression(String variable, SExpression value) throws ProminerException {
			observer.assignOutcomeExpression(variable, value);
		}

		@Override
		public Object evaluateExpression(SExpression expression) throws ProminerException {
			return observer.evaluate(expression);
		}

		@Override
		public void removeVariable(String variable) throws ProminerException {
			observer.removeOutlet(variable);
		}

	}

}
