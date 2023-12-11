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

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class InputListDesignView extends ConductorView implements HeightAdjustablePart {

	private static LABEL_HEIGHT = 24;

	private composite: Composite = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index)
		this.composite.setData(this);
		view.addClass(this.composite, "malang-input-list-design-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createArgumentsLabel(this.composite);
		this.createContainer(this.composite);
	}

	private createArgumentsLabel(parent: Composite): void {
		let label = new LabelPanel();
		label.createControl(parent);
		label.setText("Inputs:");
		label.setLineHeight(InputListDesignView.LABEL_HEIGHT);
		view.setGridData(label, true, InputListDesignView.LABEL_HEIGHT);
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.setGridLayout(this.container, 1, 0, 0);
		view.setGridData(this.container, true, true);
	}

	public adjustHeight(): number {
		let adjuster = new GridCompositeAdjuster(this.container);
		let height = adjuster.adjustHeight();
		return InputListDesignView.LABEL_HEIGHT + height;
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