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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

import VegaliteNode from "vegazoo/widgets/VegaliteNode";
import VegaliteEvent from "vegazoo/widgets/VegaliteEvent";
import VegaliteChart from "vegazoo/widgets/VegaliteChart";

import ViewletOutputView from "vegazoo/view/output/ViewletOutputView";

import VegaliteRootApplyRequest from "vegazoo/requests/output/VegaliteRootApplyRequest";
import VegaliteClickApplyRequest from "vegazoo/requests/output/VegaliteClickApplyRequest";

export default class VegaliteOutputView extends ViewletOutputView {

	private static MARGIN = 5;
	private static HEADER_HEIGHT = 24;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private messageBar: Label = null;
	private vegaliteChart: VegaliteChart = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-vegalite-output-view");

		let layout = new AbsoluteLayout();
		this.composite.setLayout(layout);

		this.createVegaliteChart(this.composite);
		this.createHeaderPart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);

		let layout = new GridLayout(2, 0, 0);
		this.headerPart.setLayout(layout);

		let layoutData = new AbsoluteData(0, 0, "100%", VegaliteOutputView.HEADER_HEIGHT);
		this.headerPart.setLayoutData(layoutData);

		this.createMessageLabel(this.headerPart);

	}

	private createMessageLabel(parent: Composite): void {

		this.messageBar = new Label(parent);

		let element = this.messageBar.getElement();
		element.css("line-height", VegaliteOutputView.HEADER_HEIGHT + "px");
		element.css("color", "#888");
		element.css("font-style", "italic");
		element.css("text-indent", "5px");

		let layoutData = new GridData(true, true);
		this.messageBar.setLayoutData(layoutData);

	}

	private createVegaliteChart(parent: Composite): void {

		this.vegaliteChart = new VegaliteChart(parent);

		let layoutData = new AbsoluteData(VegaliteOutputView.MARGIN, VegaliteOutputView.MARGIN);
		layoutData.right = VegaliteOutputView.MARGIN;
		layoutData.bottom = VegaliteOutputView.MARGIN;
		this.vegaliteChart.setLayoutData(layoutData);

		this.vegaliteChart.setOnRender((root: VegaliteNode) => {
			let request = new VegaliteRootApplyRequest(root);
			this.conductor.submit(request);
		});

		this.vegaliteChart.setOnClick((event: VegaliteEvent) => {
			let request = new VegaliteClickApplyRequest(event);
			this.conductor.submit(request);
		});

	}

	public setSpec(spec: any): void {
		this.setMessageShow(false);
		if (spec.encoding !== undefined
			|| spec.layer !== undefined
			|| spec.facet !== undefined
			|| spec.hconcat !== undefined
			|| spec.vconcat !== undefined) {
			this.vegaliteChart.setSpec(spec);
		} else {
			this.setMessage("Please define encoding");
		}
	}

	private setMessageShow(state: boolean): void {
		let layoutData = new AbsoluteData(0, 0, "100%", state ? VegaliteOutputView.HEADER_HEIGHT : 0);
		this.headerPart.setLayoutData(layoutData);
		this.composite.relayout();
	}

	private setMessage(message: string): void {
		this.setMessageShow(true);
		this.messageBar.setText(message);
	}

	public relayout(): void {
		this.vegaliteChart.render();
	}

	public getControl(): Control {
		return this.composite;
	}

}
