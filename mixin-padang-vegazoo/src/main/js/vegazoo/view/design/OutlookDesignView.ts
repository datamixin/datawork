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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";
import ConductorPanel from "webface/wef/ConductorPanel";

import ScrollablePanel from "padang/panels/ScrollablePanel";

export default class OutlookDesignView extends ConductorView {

	private composite: Composite = null;
	private scrollablePanel: ScrollablePanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-outlook-design-view");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createScrollablePanel(this.composite);
	}

	private createScrollablePanel(parent: Composite): void {

		this.scrollablePanel = new ScrollablePanel(5, 5);
		this.scrollablePanel.createControl(parent);

		let control = this.scrollablePanel.getControl();
		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public relayout(): void {
		this.scrollablePanel.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		this.scrollablePanel.addPanel(<ConductorPanel><any>child, index);
	}

	public removeView(child: ConductorView): void {
		this.scrollablePanel.removePanel(<ConductorPanel><any>child);
	}

}
