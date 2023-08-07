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

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class RoutineOutputView extends ConductorView {

	private static MARGIN = 5;
	private static MESSAGE_HEIGHT = 30;

	private composite: Composite = null;
	private messagePanel: LabelPanel = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "rinjani-routine-output-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createMessagePanel(this.composite);
		this.createContainer(this.composite);
	}

	private createMessagePanel(parent: Composite): void {
		this.messagePanel = new LabelPanel(RoutineOutputView.MESSAGE_HEIGHT / 2);
		this.messagePanel.createControl(parent);
		this.messagePanel.setFontStyle("italic");
		this.messagePanel.setLineHeight(RoutineOutputView.MESSAGE_HEIGHT);
		view.css(this.messagePanel, "background-color", "#FFFCDA");
		view.setGridData(this.messagePanel, true, 0);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "rinjani-routine-output-container");
		view.setGridData(this.container, true, true);
		view.setGridLayout(this.container, 1, RoutineOutputView.MARGIN, RoutineOutputView.MARGIN, 0, 0);
	}

	private setMessageShow(state: boolean): void {
		view.setGridData(this.messagePanel, true, state ? RoutineOutputView.MESSAGE_HEIGHT : 0);
		this.composite.relayout();
	}

	public setMessage(message: string): void {
		this.setMessageShow(true);
		this.messagePanel.setText(message);
	}

	public relayout(): void {
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, true);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
