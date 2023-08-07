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
import RootView from "webface/wef/RootView";
import ConductorView from "webface/wef/ConductorView";
import ConductorPanel from "webface/wef/ConductorPanel";

import Composite from "webface/widgets/Composite";

import FillLayout from "webface/layout/FillLayout";

import ScrollablePanel from "padang/panels/ScrollablePanel";

export default class ScrollableView extends RootView {

	private scrollablePanel: ScrollablePanel = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let layout = new FillLayout();
		this.composite.setLayout(layout);

		this.createScrollablePanel(this.composite);
	}

	private createScrollablePanel(parent: Composite): void {
		this.scrollablePanel = new ScrollablePanel(10, 5);
		this.scrollablePanel.createControl(parent);
	}

	public relayout(): void {
		this.scrollablePanel.relayout();
	}

	public addView(child: ConductorView, index: number): void {
		this.scrollablePanel.addPanel(<ConductorPanel><any>child, index);
	}

	public removeView(child: ConductorView): void {
		this.scrollablePanel.removePanel(<ConductorPanel><any>child);
	}

}