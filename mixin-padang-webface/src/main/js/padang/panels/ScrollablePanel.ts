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
import Panel from "webface/wef/Panel";
import LayoutablePart from "webface/wef/LayoutablePart";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

export default class ScrollablePanel implements Panel, LayoutablePart {

	private marginWidth: number = 10;
	private marginHeight: number = 10;
	private spacing: number = 10;
	private scrollable: Scrollable = null;
	private container: Composite = null;

	constructor(marginWidth?: number, marginHeight?: number, spacing?: number) {
		this.marginWidth = marginWidth !== undefined ? marginWidth : this.marginWidth;
		this.marginHeight = marginHeight !== undefined ? marginHeight : this.marginHeight;
		this.spacing = spacing !== undefined ? spacing : this.spacing;
	}

	public createControl(parent: Composite): void {

		this.scrollable = new Scrollable(parent);
		this.scrollable.setExpandHorizontal(true);
		this.scrollable.setData(this);

		let element = this.scrollable.getElement();
		element.addClass("padang-scrollable-panel");

		this.createContainer(this.scrollable);
		this.scrollable.setContent(this.container);
	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let element = this.container.getElement();
		element.addClass("padang-scrollable-container");

		let layout = new GridLayout(1, this.marginWidth, this.marginHeight, this.spacing, this.spacing);
		this.container.setLayout(layout);

	}

	public clear(): void {
		view.disposeChildren(this.container);
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		let height = part.adjustHeight();
		this.scrollable.setMinHeight(height);
		this.scrollable.relayout();
		return height;
	}

	public relayout(): void {
		this.adjustHeight();
	}

	public getContent(): Control {
		return this.container;
	}

	public getControl(): Control {
		return this.scrollable;
	}

	public addPanel(child: Panel, index?: number): void {

		child.createControl(this.container, index);
		let control = child.getControl();
		control.setData(child);

		let layoutData = new GridData(true, 0);
		control.setLayoutData(layoutData);

	}

	public removePanel(child: Panel): void {
		let control = child.getControl();
		control.dispose();
	}

}