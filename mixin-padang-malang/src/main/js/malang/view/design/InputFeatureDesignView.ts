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
import DragArea from "webface/dnd/DragArea";
import * as dnd from "webface/dnd/functions";
import DragSource from "webface/dnd/DragSource";
import CloneDragHelper from "webface/dnd/CloneDragHelper";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/functions";

import ObjectMap from "webface/util/ObjectMap";
import ConductorView from "webface/wef/ConductorView";

import BaseAction from "webface/wef/base/BaseAction";

import * as view from "padang/view/view";
import IconLabelMenuPanel from "padang/view/IconLabelMenuPanel";

import * as rinjani from "rinjani/rinjani";

import InputFeatureRemoveRequest from "malang/requests/design/InputFeatureRemoveRequest";
import InputFeatureDragAreaRequest from "malang/requests/design/InputFeatureDragAreaRequest";
import InputFeatureDragSourceDragRequest from "malang/requests/design/InputFeatureDragSourceDragRequest";
import InputFeatureDragSourceStopRequest from "malang/requests/design/InputFeatureDragSourceStopRequest";
import InputFeatureDragSourceStartRequest from "malang/requests/design/InputFeatureDragSourceStartRequest";

export default class InputFeatureDesignView extends ConductorView {

	public static HEIGHT = 28;

	private composite: Composite = null;
	private valuePanel: IconLabelMenuPanel = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index)
		this.composite.setData(this);
		view.css(this.composite, "background-color", "#FFF");
		view.addClass(this.composite, "malang-input-feature-design-view");
		view.setGridLayout(this.composite, 1, 0, 0);
		this.createValuePanel(this.composite);
		this.createDragSource(this.composite);
	}

	private createValuePanel(parent: Composite): void {
		this.valuePanel = new IconLabelMenuPanel();
		this.valuePanel.createControl(parent);
		view.css(this.valuePanel, "line-height", (InputFeatureDesignView.HEIGHT - 2) + "px");
		view.setGridData(this.valuePanel, true, InputFeatureDesignView.HEIGHT - 2);
		this.valuePanel.setActions([
			new InputFeatureRemoveAction(this.conductor)
		]);
	}

	private createDragSource(control: Control): void {

		// Request drag area
		let request = new InputFeatureDragAreaRequest();
		this.conductor.submit(request, (dragArea: DragArea) => {

			let source = new DragSource();
			let handle = this.valuePanel.getControl();
			source.setHandle(handle);

			let helper = new CloneDragHelper(control, {});
			source.setHelper(helper);
			source.setContainment(dragArea);

			source.start((event: any) => {

				let request = new InputFeatureDragSourceStartRequest();
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.drag((event: any) => {

				let x = event.clientX;
				let y = event.clientY;

				// Process drag
				let data = new ObjectMap<any>();
				let request = new InputFeatureDragSourceDragRequest(data, x, y);
				this.conductor.submit(request, (data: any) => {
					dnd.reconcileDragData(event, data);
				})

			});

			source.stop((event: any) => {

				let x = event.clientX;
				let y = event.clientY;
				let parent = this.composite.getParent();
				let element = parent.getElement();
				let request = new InputFeatureDragSourceStopRequest();
				this.conductor.submit(request);
				if (!functions.isInRange(element, x, y)) {
					let request = new InputFeatureRemoveRequest();
					this.conductor.submit(request);
				}

			});

			source.applyTo(this.composite);

		});

	}

	public setResultType(type: string): void {
		let icon = rinjani.TYPE_ICON_MAP[type];
		this.valuePanel.setIcon(icon);
	}

	public setValue(value: string, name: string): void {
		this.valuePanel.setLabel(name);
		this.valuePanel.setTooltip(value);
	}

	public adjustHeight(): number {
		return InputFeatureDesignView.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class InputFeatureRemoveAction extends BaseAction {

	public getText(): string {
		return "Remove";
	}

	public run(): void {
		let request = new InputFeatureRemoveRequest();
		this.conductor.submit(request);
	}

}
