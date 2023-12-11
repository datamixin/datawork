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

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import JsonSpecDialog from "vegazoo/dialogs/JsonSpecDialog";

import ViewletTopbarView from "vegazoo/view/topbar/ViewletTopbarView";

import VegaliteSpecRequest from "vegazoo/requests/topbar/VegaliteSpecRequest";
import VegaliteRefreshRequest from "vegazoo/requests/topbar/VegaliteRefreshRequest";

export default class VegaliteTopbarView extends ViewletTopbarView {

	private composite: Composite = null;

	private resultToolbarPanel: GroupToolbarPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "vegazoo-vegalite-topbar-view");
		view.setGridLayout(this.composite, 4, 0, 0);

		this.createResultToolbarPanel(this.composite);

	}

	private createResultToolbarPanel(parent: Composite): void {
		this.resultToolbarPanel = new GroupToolbarPanel(this.conductor, "Result");
		this.resultToolbarPanel.createControl(parent);
		view.setGridData(this.resultToolbarPanel, 0, true);
		this.createResultRefreshIcon(this.resultToolbarPanel);
		this.createResultSpecIcon(this.resultToolbarPanel);
	}

	private createResultRefreshIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-refresh", "Refresh Result", () => {
			let request = new VegaliteRefreshRequest();
			this.conductor.submit(request);
		});
	}

	private createResultSpecIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-code-json", "View JSON Specification", () => {
			let request = new VegaliteSpecRequest();
			this.conductor.submit(request, (spec: any) => {
				let dialog = new JsonSpecDialog(spec);
				dialog.open(() => { });
			});
		});
	}

	public relayout(): void {
		this.adjustWidth();
	}

	public adjustWidth(): number {
		let part = new GridCompositeAdjuster(this.composite);
		return part.adjustWidth();
	}

	public getControl(): Control {
		return this.composite;
	}

}
