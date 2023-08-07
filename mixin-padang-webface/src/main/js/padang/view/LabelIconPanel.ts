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
import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";

export default class LabelIconPanel implements HeightAdjustablePart {

	private static HEIGHT = 30;

	private iconWidth: number = 24;
	private composite: Composite = null;
	private label: Label = null;
	private iconPanel = new IconPanel();
	private onLabelSelection = (event: Event) => { };
	private onIconSelection = (event: Event) => { };

	constructor(iconWidth?: number) {
		this.iconWidth = iconWidth === undefined ? this.iconWidth : iconWidth;
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-label-icon-panel");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabel(this.composite);
		this.createIconPanel(this.composite);

	}

	private createLabel(parent: Composite): void {
		this.label = new Label(parent);
		view.css(this.label, "line-height", "inherit");
		view.setGridData(this.label, true, true);
		this.label.onSelection((event: Event) => {
			this.onLabelSelection(event);
		});

	}

	private createIconPanel(parent: Composite): void {
		this.iconPanel.createControl(parent);
		this.iconPanel.setOnSelection((event: Event) => {
			this.onIconSelection(event);
		});
		view.css(this.iconPanel, "cursor", "pointer");
		view.setGridData(this.iconPanel, this.iconWidth, true);
	}

	public setIcon(icon: string): void {
		this.iconPanel.setIcon(icon);
	}

	public setLabel(name: string): void {
		this.label.setText(name);
	}

	public setLabelIndent(pixel: number): void {
		view.css(this.label, "text-indent", pixel + "px");
	}

	public setOnLabelSelection(callback: (event: Event) => void): void {
		this.onLabelSelection = callback;
	}

	public setOnIconSelection(callback: (event: Event) => void): void {
		this.onIconSelection = callback;
	}

	public setIconEnabled(enabled: boolean): void {
		this.iconPanel.setEnabled(enabled);
	}

	public adjustHeight(): number {
		return LabelIconPanel.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
