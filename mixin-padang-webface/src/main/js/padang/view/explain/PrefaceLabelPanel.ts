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
import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ObjectMap from "webface/util/ObjectMap";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as padang from "padang/padang";

import * as view from "padang/view/view";
import IconLabelPanel from "padang/view/IconLabelPanel";

import PrefaceDragAreaRequest from "padang/requests/explain/PrefaceDragAreaRequest";
import ValueFieldPrefaceSetRequest from "padang/requests/explain/ValueFieldPrefaceSetRequest";
import PrefaceDragSourceDragRequest from "padang/requests/explain/PrefaceDragSourceDragRequest";
import PrefaceDragSourceStopRequest from "padang/requests/explain/PrefaceDragSourceStopRequest";
import PrefaceDragSourceStartRequest from "padang/requests/explain/PrefaceDragSourceStartRequest";

export default class PrefaceLabelPanel extends ConductorPanel {

	public static LABEL_HEIGHT = 30;

	private composite: Composite = null;
	private panel: IconLabelPanel = null;

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "padang-preface-label-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createPanel(this.composite);
		this.createDragSource(this.composite);
	}

	private createPanel(parent: Composite): void {
		this.panel = new IconLabelPanel(5);
		this.panel.createControl(parent);
		this.panel.setColor("#444");
		this.panel.setIconColor("#888");
		view.setGridData(this.panel, true, true);
		view.css(this.panel, "line-height", (PrefaceLabelPanel.LABEL_HEIGHT - 2) + "px");
		this.panel.setOnSelection(() => {
			let preface = this.getLabel();
			let request = new ValueFieldPrefaceSetRequest(preface);
			this.conductor.submit(request);
		});
	}

	private createDragSource(control: Control): void {

		// Request drag area
		let request = new PrefaceDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			let handler = this.panel.getControl();
			source.setHandle(handler);

			let helper = new CloneDragHelper(handler, {
				border: "1px solid transparent",
				height: PrefaceLabelPanel.LABEL_HEIGHT
			});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any, ui: any) => {

				let request = new PrefaceDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let label = this.getLabel();
				data.put(padang.PREFACE, label);
				let request = new PrefaceDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((event: any, ui: any) => {

				let request = new PrefaceDragSourceStopRequest();
				this.conductor.submit(request);

			});

			source.applyTo(control);

		});

	}

	public setLabel(text: string): void {
		this.panel.setLabel(text);
	}

	public setIcon(icon: string): void {
		this.panel.setIcon(icon);
	}

	public getLabel(): string {
		return this.panel.getLabel();
	}

	public setSelected(state: boolean): void {
		view.setSelected(this, state);
	}

	public adjustHeight(): number {
		return PrefaceLabelPanel.LABEL_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}