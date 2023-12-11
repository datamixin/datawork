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

import ToolboxIconPanel from "padang/view/toolbox/ToolboxIconPanel";
import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import JsonSpecDialog from "vegazoo/dialogs/JsonSpecDialog";

import RoutineResultSpecRequest from "rinjani/requests/topbar/RoutineResultSpecRequest";

export default class RoutineTopbarView extends ConductorView {

	private composite: Composite = null;

	private resultToolbarPanel: GroupToolbarPanel = null;
	private executeIcon: ToolboxIconPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "rinjani-routine-topbar-view");
		view.setGridLayout(this.composite, 4, 0, 4);

		this.createResultToolbarPanel(this.composite);

	}

	private createResultToolbarPanel(parent: Composite): void {
		this.resultToolbarPanel = new GroupToolbarPanel(this.conductor, "Result");
		this.resultToolbarPanel.createControl(parent);
		view.setGridData(this.resultToolbarPanel, 0, true);
		this.createResultSpecIcon(this.resultToolbarPanel);
	}

	private createResultSpecIcon(parent: GroupToolbarPanel): void {
		this.executeIcon = parent.createIcon("mdi-script-text-outline", "Execute Result", () => {
			let request = new RoutineResultSpecRequest();
			this.conductor.submit(request, (spec) => {
				let dialog = new JsonSpecDialog(spec);
				dialog.open(() => { });
			});
		});
	}

	public setExecuteEnabled(enabled: boolean): void {
		this.executeIcon.setEnabled(enabled);
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
