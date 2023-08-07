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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EVALUATE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerFormer;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.PlotterAnchor;
import com.andia.mixin.padang.dumai.anchors.ViewsetAnchor;
import com.andia.mixin.padang.outset.FigureOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class ProminerFigureOutset extends ProminerFacetOutset implements FigureOutset, Lifetime {

	private static Logger logger = LoggerFactory.getLogger(ProminerFigureOutset.class);

	private Consolidator consolidation;
	private ProminerFormer former;
	private ViewsetAnchor viewset;
	private String name;

	public ProminerFigureOutset(Supervisor supervisor) {
		super(supervisor);
		assignConsolidation();
		assignViewsetAnchor();
		preparePlotterAnchor();
		preparePath();
	}

	private void assignConsolidation() {
		consolidation = supervisor.getCapability(Consolidator.class);
	}

	private void assignViewsetAnchor() {
		viewset = supervisor.getPreparedObject(ViewsetAnchor.class);
	}

	private void preparePlotterAnchor() {
		supervisor.setPreparedObject(PlotterAnchor.class, new FigurePlotterAnchor());
	}

	private void preparePath() {
		former = new ProminerFormer(supervisor, (OriginAnchor) viewset);
	}

	@Override
	public void setName(String name) {
		former.setName(name);
		if (this.name != null) {
			try {
				viewset.renameOutlet(this.name, name);
				consolidation.referenceRenamed(former);
			} catch (Exception e) {
				logger.error("Fail set figure name '" + name + "'", e);
			}
		}
		former.updatePath();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Override
	public void initiate() {
		try {
			if (viewset.isOnmove(name)) {
				viewset.restoreOnmove(name);
			} else {
				viewset.prepareViewsetFigure(name);
				consolidation.referenceCreated(former);
			}
		} catch (Exception e) {
			logger.error("Fail initiate figure '" + name + "'", e);
		}
	}

	@Override
	public void activate() {

	}

	@Invoke(INSPECT_EVALUATE)
	public Object inspectEvaluate(XExpression expression) {
		try {
			Object value = viewset.evaluateOnFigure(name, expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Override
	public void terminate() {
		try {
			if (!viewset.isOnmove(name)) {
				viewset.removeOutlet(name);
				consolidation.referenceRemoved(former);
			}
		} catch (Exception e) {
			logger.error("Fail terminate figure '" + name + "'", e);
		}
	}

	class FigurePlotterAnchor implements PlotterAnchor {

		@Override
		public String getPathName() {
			return name;
		}

		@Override
		public void prepareVariable(String variable) throws ProminerException {
			viewset.prepareFigureVariable(name, variable);
		}

		@Override
		public boolean computeVariable(String variable) throws ProminerException {
			return viewset.computeFigureVariable(name, variable);
		}

		@Override
		public void renameVariable(String oldName, String newName) throws ProminerException {
			viewset.renameFigureVariable(name, oldName, newName);
		}

		@Override
		public void assignVariableExpression(String variable, SExpression value) throws ProminerException {
			viewset.assignFigureVariableExpression(name, variable, value);
		}

		@Override
		public Object evaluateExpression(SExpression expression) throws ProminerException {
			return viewset.evaluateOnFigure(name, expression);
		}

		@Override
		public void removeVariable(String variable) throws ProminerException {
			viewset.removeFigureVariable(name, variable);
		}

	}

}
