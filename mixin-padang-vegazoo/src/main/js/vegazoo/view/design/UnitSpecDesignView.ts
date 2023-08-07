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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import ViewSpecDesignView from "vegazoo/view/design/ViewSpecDesignView";

export default class UnitSpecDesignView extends ViewSpecDesignView {

	private static MARGIN = 10;

	private composite: Composite = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-unit-spec-design-view");
		element.css("background-color", "#F0F0F0");
		element.css("border", "1px solid #E0E0E0");
		element.css("border-top", "0px");

		let layout = new GridLayout(1, UnitSpecDesignView.MARGIN, UnitSpecDesignView.MARGIN, 0, 0);
		this.composite.setLayout(layout);

		this.createContainer(this.composite);

	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);
		let element = this.container.getElement();
		element.addClass("vegazoo-unit-spec-design-container");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.container.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		height += UnitSpecDesignView.MARGIN * 2 + 1;
		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {

		child.createControl(this.container, index);
		let control = child.getControl();
		control.setData(child);

		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);
	}

	public removeView(child: ConductorView): void {
		let control = child.getControl();
		control.dispose();
	}

}
