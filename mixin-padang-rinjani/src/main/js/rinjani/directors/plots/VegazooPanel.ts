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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";
import VegaliteChart from "vegazoo/widgets/VegaliteChart";

import OutputSpecPart from "rinjani/directors/OutputSpecPart";

export default class VegazooPanel implements Panel, OutputSpecPart {

	private spec: any = null;
	private onRender = (_root: VegaliteNode) => { };
	private composite: Composite = null;
	private chart: VegaliteChart = null;

	constructor(spec: any) {
		this.spec = spec;
	}

	public getSpec(): any {
		return this.spec;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "rinjani-vegazoo-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createChart(this.composite);
	}

	private createChart(parent: Composite): void {
		this.chart = new VegaliteChart(parent);
		this.chart.setOnRender(this.onRender);
		view.setGridData(this.chart, true, true);
		this.chart.setSpec(this.spec);
	}

	public setOnRender(onRender: (root: VegaliteNode) => void): void {
		this.onRender = onRender;
	}

	public getControl(): Control {
		return this.composite;
	}

}