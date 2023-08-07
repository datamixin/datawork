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
import * as webface from "webface/webface";

import Conductor from "webface/wef/Conductor";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";
import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";

import OverlayResizeStrip from "vegazoo/view/output/OverlayResizeStrip";

import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import ResultResizeRequest from "rinjani/requests/output/ResultResizeRequest";

export default class ResultOutputView extends ConductorView {

	private static MARGIN = 5;

	private editable: boolean = false;
	private composite: Composite = null;
	private container: Composite = null;
	private resultPanel: ConductorPanel = null;
	private resizeStrip = new OverlayResizeStrip(1, "#D8D8D8");

	constructor(conductor: Conductor, editable: boolean) {
		super(conductor);
		this.editable = editable;
	}

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "rinjani-result-output-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createContainer(this.composite);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "rinjani-result-output-container");
		view.setGridData(this.container, true, true);
		view.setGridLayout(this.container, 1, ResultOutputView.MARGIN, ResultOutputView.MARGIN, 0, 0);
		if (this.editable === true) {

		}
	}

	public setResult(panel: ConductorPanel): void {
		view.dispose(this.resultPanel);
		if (panel instanceof VegazooPanel) {
			this.applyResizeStrip(panel);
		}
		panel.createControl(this.container);
		view.css(panel, "background-color", "#F8F8F8");
		view.setGridData(panel, true, true);
		this.container.relayout();
		this.resultPanel = panel;
	}

	private applyResizeStrip(panel: VegazooPanel): void {
		panel.setOnRender((root: VegaliteNode) => {

			let container = this.container.getElement();
			this.resizeStrip.setContainer(container);

			let chart = root.getChart();
			let width = chart.width();
			let height = chart.height();
			this.resizeStrip.setWidthCallback((deltaX: number) => {
				let request = new ResultResizeRequest(width + deltaX, webface.HORIZONTAL);
				this.conductor.submit(request);
			});
			this.resizeStrip.setHeightCallback((deltaY: number) => {
				let request = new ResultResizeRequest(height + deltaY, webface.VERTICAL);
				this.conductor.submit(request);
			});

			let control = panel.getControl();
			let element = control.getElement();
			let offset = element.offset();
			let source = container[0].getBoundingClientRect();
			let rect = new DOMRect(offset.left - source.x, offset.top - source.y, width, height);
			this.resizeStrip.createHandlers(rect);
		});
	}

	public relayout(): void {
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
