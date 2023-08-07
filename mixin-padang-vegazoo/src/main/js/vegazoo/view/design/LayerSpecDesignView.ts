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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import MessageDialog from "webface/dialogs/MessageDialog";

import ViewSpecListPanel from "vegazoo/view/design/ViewSpecListPanel";
import ViewSpecDesignView from "vegazoo/view/design/ViewSpecDesignView";

import LayerSpecLayerAddRequest from "vegazoo/requests/design/LayerSpecLayerAddRequest";
import LayerSpecLayerCountRequest from "vegazoo/requests/design/LayerSpecLayerCountRequest";
import LayerSpecLayerRemoveRequest from "vegazoo/requests/design/LayerSpecLayerRemoveRequest";
import LayerSpecLayerSelectionRequest from "vegazoo/requests/design/LayerSpecLayerSelectionRequest";

export default class LayerSpecDesignView extends ViewSpecDesignView {

	private composite: Composite = null;
	private listPanel = new ViewSpecListPanel();

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-top-level-layer-spec-design-view");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createListPanel(this.composite);

	}

	private createListPanel(parent: Composite): void {

		this.listPanel.createControl(parent);

		this.listPanel.setOnAdd(() => {
			let request = new LayerSpecLayerAddRequest();
			this.conductor.submit(request);
		});

		this.listPanel.setOnSelect((index: number) => {
			let request = new LayerSpecLayerSelectionRequest(index);
			this.conductor.submit(request);
		});

		this.listPanel.setOnRemove((index: number) => {
			let request = new LayerSpecLayerCountRequest();
			this.conductor.submit(request, (count) => {
				if (count === 1) {
					let message = "A layered view must be containing at least one layer";
					MessageDialog.openError("Remove Error", message);
				} else {
					let request = new LayerSpecLayerRemoveRequest(index);
					this.conductor.submit(request);
				}
			});
		});

		let control = this.listPanel.getControl();
		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public setLayerSelected(index: number, selected: boolean): void {
		this.listPanel.setLayerSelected(index, selected);
	}

	public adjustHeight(): number {
		let height = this.listPanel.adjustHeight();
		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		this.listPanel.addView(child, index);
	}

	public moveView(child: ConductorView, index: number): void {
		this.listPanel.moveView(child, index);
	}

	public removeView(child: ConductorView): void {
		this.listPanel.removeView(child);
	}

}
