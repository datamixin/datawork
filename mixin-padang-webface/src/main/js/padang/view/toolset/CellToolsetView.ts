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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

export default class CellToolsetView extends ConductorView {

	private composite: Composite = null;

	private cellToolbarPanel: GroupToolbarPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-cell-toolset-view");
		view.setGridLayout(this.composite, 3, 0, 0);

		this.createCellToolbarPanel(this.composite);

	}

	private createCellToolbarPanel(parent: Composite): void {
		this.cellToolbarPanel = new GroupToolbarPanel(this.conductor, "Cell");
		this.cellToolbarPanel.createControl(parent);
		view.setGridData(this.cellToolbarPanel, 0, true);
		this.createAddCellIcon(this.cellToolbarPanel);
	}

	private createAddCellIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-shape-square-plus", "Add Cell", () => {
			let request = new CellAddRequest();
			this.conductor.submit(request);
		});
	}

	public relayout(): void {
		let part = new GridCompositeAdjuster(this.composite);
		part.adjustWidth();
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.composite, -1);
		view.setControlData(child);
		view.setGridData(child, 0, true);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
