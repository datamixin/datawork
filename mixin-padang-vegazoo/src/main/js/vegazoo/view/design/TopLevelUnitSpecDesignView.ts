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

import TopLevelSpecDesignView from "vegazoo/view/design/TopLevelSpecDesignView";

import TopLevelUnitSpecSelectionRequest from "vegazoo/requests/design/TopLevelUnitSpecSelectionRequest";

export default class TopLevelUnitSpecDesignView extends TopLevelSpecDesignView {

	private static MARGIN = 5;

	private composite: Composite = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("vegazoo-top-level-unit-spec-design-view");
		element.css("border", TopLevelSpecDesignView.BORDER_WIDTH + "px solid transparent");

		let layout = new GridLayout(1, TopLevelUnitSpecDesignView.MARGIN, TopLevelUnitSpecDesignView.MARGIN, 0, 0);
		this.composite.setLayout(layout);

		this.composite.onSelection(() => {
			let request = new TopLevelUnitSpecSelectionRequest();
			this.conductor.submit(request);
		});

		this.createHeaderPanel(this.composite)
		this.createControlPanel(this.composite)
		this.createContainer(this.composite);

	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let element = this.container.getElement();
		element.addClass("vegazoo-top-level-unit-spec-container");

		let layout = new GridLayout(1, 0, 0, 0, 10);
		this.container.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);
	}

	public setSelected(selected: boolean): void {
		let element = this.composite.getElement();
		element.css("border-color", selected === true ? "#80bdff" : "transparent");
	}

	public adjustHeight(): number {
		let height = super.adjustHeight();
		let border = TopLevelUnitSpecDesignView.BORDER_WIDTH * 2;
		let adjuster = new GridCompositeAdjuster(this.container);
		height += adjuster.adjustHeight();
		return height + TopLevelUnitSpecDesignView.MARGIN * 2 + border;
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
