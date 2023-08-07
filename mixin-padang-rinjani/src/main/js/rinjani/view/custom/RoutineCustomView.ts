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

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class RoutineCustomView extends ConductorView {

	private static VERTICAL_SPACING = 5;
	private static HEIGHT = 30;

	private composite: Composite = null;
	private titlePanel = new LabelPanel();
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("rinjani-routine-custom-view");

		view.setGridLayout(this.composite, 1, 0, RoutineCustomView.VERTICAL_SPACING, 0, 0);
		this.createTitlePanel(this.composite);
		this.createContainer(this.composite);

	}

	private createTitlePanel(parent: Composite): void {
		this.titlePanel.createControl(parent);
		this.titlePanel.setText("Parameters: ?");
		view.css(this.titlePanel, "font-weight", "500");
		view.css(this.titlePanel, "line-height", RoutineCustomView.HEIGHT + "px");
		view.setGridData(this.titlePanel, true, RoutineCustomView.HEIGHT);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.setGridLayout(this.container, 2, 0, 0);
		view.setGridData(this.container, true, true);
	}

	public setParameterCount(count: number): void {
		this.titlePanel.setText("Parameters: " + count);
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		return height + RoutineCustomView.HEIGHT + RoutineCustomView.VERTICAL_SPACING * 2;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, 0);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
