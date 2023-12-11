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

import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import IconLabelPanel from "padang/view/IconLabelPanel";

import PreloadContentNameSetRequest from "malang/requests/expose/PreloadContentNameSetRequest";

export default class PreloadEntryPanel extends ConductorPanel {

	public static LABEL_HEIGHT = 30;

	private composite: Composite = null;
	private panel: IconLabelPanel = null;
	private preload: string = null;

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-preload-entry-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createPanel(this.composite);
	}

	private createPanel(parent: Composite): void {
		this.panel = new IconLabelPanel(5);
		this.panel.createControl(parent);
		this.panel.setColor("#444");
		this.panel.setIconColor("#888");
		view.setGridData(this.panel, true, true);
		view.css(this.panel, "line-height", (PreloadEntryPanel.LABEL_HEIGHT - 2) + "px");
		this.panel.setOnSelection(() => {
			let request = new PreloadContentNameSetRequest(this.preload);
			this.conductor.submit(request);
		});
	}

	public setPreload(preload: string): void {
		let colon = preload.indexOf(":");
		let label = preload.substring(colon + 1);
		this.panel.setLabel(label);
		this.preload = preload;
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
		return PreloadEntryPanel.LABEL_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}