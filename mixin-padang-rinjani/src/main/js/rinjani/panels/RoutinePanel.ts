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
import Point from "webface/graphics/Point";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageObject from "bekasi/visage/VisageObject";

import * as padang from "padang/padang";

import * as view from "padang/view/view";

import GraphicPremise from "padang/ui/GraphicPremise";

import XRoutine from "rinjani/model/XRoutine";

import OutputPartSupport from "rinjani/directors/OutputPartSupport";

import ModelConverter from "rinjani/directors/converters/ModelConverter";

export default class RoutinePanel extends ConductorPanel {

	private composite: Composite = null;
	private premise: GraphicPremise = null;
	private resultPanel: ConductorPanel = null;

	constructor(conductor: Conductor, premise: GraphicPremise) {
		super(conductor);
		this.premise = premise;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "rinjani-routine-panel");
		view.setGridLayout(this.composite, 1, 5, 5, 0, 0);
		this.createRundown();
	}

	private createRundown(): void {
		let converter = new ModelConverter();
		let mapping = this.premise.getMapping();
		let object = mapping.getValue(padang.FORMATION);
		if (object instanceof VisageObject) {
			let routine = <XRoutine>converter.convertValueToModel(object);
			let result = routine.getResult();
			let width = result.getWidth();
			let height = result.getHeight();
			let size = new Point(width, height);
			let support = new OutputPartSupport(this.premise);
			support.getPlotResult(routine, size, (panel: ConductorPanel) => {
				if (this.resultPanel !== null) {
					view.dispose(this.resultPanel);
				}
				panel.createControl(this.composite);
				view.setGridData(panel, true, true);
				this.composite.relayout();
				this.resultPanel = panel;
			});
		}

	}

	public getControl(): Control {
		return this.composite;
	}

}