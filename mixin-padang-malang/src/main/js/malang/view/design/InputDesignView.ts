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

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class InputDesignView extends ConductorView implements HeightAdjustablePart {

	private static NAME_WIDTH = 72;
	private static MIN_HEIGHT = 28;

	private composite: Composite = null;
	private namePanel: LabelPanel = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index)
		this.composite.setData(this);
		view.addClass(this.composite, "malang-input-design-view");
		view.css(this.composite, "border", "1px solid #D8D8D8");
		view.css(this.composite, "border-radius", "4px");
		view.css(this.composite, "background-color", "#E8E8E8");
		view.setGridLayout(this.composite, 2, 0, 0);
		this.createNamePanel(this.composite);
		this.createContainer(this.composite);
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel = new LabelPanel();
		this.namePanel.createControl(parent);
		this.namePanel.setTextIndent(5);
		view.css(this.namePanel, "line-height", (InputDesignView.MIN_HEIGHT - 2) + "px");
		view.setGridData(this.namePanel, InputDesignView.NAME_WIDTH, true);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.setGridLayout(this.container, 1, 0, 0);
		view.setGridData(this.container, true, true);
		view.css(this.container, "border-radius", "3px");
		view.css(this.container, "border-top-left-radius", "0");
		view.css(this.container, "border-bottom-left-radius", "0");
		view.css(this.container, "background-color", "#FFFFFF");
	}

	public setName(name: string): void {
		this.namePanel.setText(name);
	}

	public adjustHeight(): number {
		let adjuster = new GridCompositeAdjuster(this.container);
		let height = adjuster.adjustHeight();
		return Math.max(InputDesignView.MIN_HEIGHT, height);
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