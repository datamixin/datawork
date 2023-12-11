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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EVALUATE;

import java.util.concurrent.atomic.AtomicBoolean;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.PlotterAnchor;
import com.andia.mixin.padang.dumai.anchors.ScopeAnchor;
import com.andia.mixin.padang.outset.GraphicOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerGraphicOutset implements GraphicOutset {

	private PlotterAnchor plotter;
	private Supervisor supervisor;

	public ProminerGraphicOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignPlotterAnchor();
		prepareScopeAnchor();
	}

	private void assignPlotterAnchor() {
		plotter = supervisor.getPreparedObject(PlotterAnchor.class);
	}

	private void prepareScopeAnchor() {
		supervisor.setPreparedObject(ScopeAnchor.class, new GraphicOriginAnchor());
	}

	@Override
	public void setRenderer(String renderer) {

	}

	@Override
	public void setFormation(String formation) {

	}

	@Invoke(INSPECT_EVALUATE)
	public Object inspectEvaluate(XExpression expression) {
		try {
			Object value = plotter.evaluateExpression(expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	class GraphicOriginAnchor extends OriginAnchor implements ScopeAnchor {

		public GraphicOriginAnchor() {
			super(supervisor.getCapability(OriginAnchor.class));
		}

		@Override
		protected String getPathName() {
			return plotter.getPathName();
		}

		@Override
		protected boolean isExists(String child) {
			final AtomicBoolean exists = new AtomicBoolean(false);
			supervisor.applyFirstDescendant(ProminerVariableOutset.class, (outset) -> {
				ProminerVariableOutset variableOutset = (ProminerVariableOutset) outset;
				if (!variableOutset.isUnderResult()) {
					String name = variableOutset.getName();
					return name.equals(child);
				}
				return false;
			}, (outset) -> exists.set(true));
			return exists.get();
		}

		@Override
		public void prepareVariable(String variable) throws ProminerException {
			plotter.prepareVariable(variable);
		}

		@Override
		public boolean computeVariable(String variable) throws ProminerException {
			return plotter.computeVariable(variable);
		}

		@Override
		public void renameVariable(String oldName, String newName) throws ProminerException {
			plotter.renameVariable(oldName, newName);
		}

		@Override
		public void assignVariableExpression(String variable, SExpression value) throws ProminerException {
			plotter.assignVariableExpression(variable, value);
		}

		@Override
		public Object evaluateExpression(SExpression expression) throws ProminerException {
			return plotter.evaluateExpression(expression);
		}

		@Override
		public void removeVariable(String variable) throws ProminerException {
			plotter.removeVariable(variable);
		}

	}

}
