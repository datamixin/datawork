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

import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import ElementPanel from "padang/view/ElementPanel";

export default class OnsideElementPanel implements ElementPanel {

	private static ICON_SIZE = 24;

	private lineHeight = 24;
	private composite: Composite = null;
	private indexPanel = new LabelPanel();
	private view: ConductorView = null;
	private onLabel = (index: number): string => { return <any>index; };

	constructor(view: ConductorView, lineHeight?: number) {
		this.view = view;
		this.lineHeight = lineHeight === undefined ? 24 : lineHeight;
	}

	public getView(): ConductorView {
		return this.view;
	}

	public createControl(parent: Composite, index: number) {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-onside-element-panel");
		element.css("line-height", "inherit");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createIndexPanel(this.composite);
		this.createElementView(this.composite);
	}

	private createIndexPanel(parent: Composite): void {
		this.indexPanel.createControl(parent);
		let control = this.indexPanel.getControl();
		let element = control.getElement();
		element.css("text-align", "center");
		element.css("font-style", "italic");
		element.css("line-height", this.lineHeight + "px");
		element.css("color", "#888");
		view.setGridData(this.indexPanel, OnsideElementPanel.ICON_SIZE, this.lineHeight);
	}

	private createElementView(parent: Composite): void {
		this.view.createControl(parent, 1);
		view.setGridData(this.view, true, true);
	}

	private getIndex(): number {
		let parent = this.composite.getParent();
		let children = parent.getChildren();
		let index = children.indexOf(this.composite);
		return index;
	}

	public setOnLabel(callback: (index: number) => any): void {
		this.onLabel = callback;
	}

	public updateLabel(): void {
		let index = this.getIndex();
		let label = this.onLabel(index);
		this.indexPanel.setText(label);
	}

	public adjustHeight(): number {
		let height = (<HeightAdjustablePart><any>this.view).adjustHeight();
		this.composite.relayout();
		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

}
