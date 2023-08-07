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
import WebFontIcon from "webface/widgets/WebFontIcon";

import WebFontImage from "webface/graphics/WebFontImage";

import * as functions from "webface/functions";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ToolboxToolPanel from "padang/view/toolbox/ToolboxToolPanel";

export default class ToolboxIconPanel extends ToolboxToolPanel {

	public static ICON_WIDTH = 30;
	public static ICON_HEIGHT = 30;

	private image: string | WebFontImage = null;
	private icon: WebFontIcon = null;
	private label: string = null;
	private tooltip: string = null;
	private composite: Composite = null;

	constructor(image: string | WebFontImage, tooltip: string, label?: string) {
		super();
		this.image = image;
		this.tooltip = tooltip;
		this.label = label === undefined ? null : label;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-toolbox-icon-panel");
		element.attr("title", this.tooltip);

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createIconPart(this.composite);
		if (this.label !== null) {
			this.createLabelPart(this.composite);
		}
	}

	private createIconPart(parent: Composite): void {

		this.icon = new WebFontIcon(parent);
		if (this.image instanceof WebFontImage) {
			let classes = this.image.getClasses();
			for (let className of classes) {
				this.icon.addClass(className);
			}
		} else {
			this.icon.addClasses("mdi", this.image);
		}

		let element = this.icon.getElement();
		element.css("font-size", "24px");
		element.css("line-height", (ToolboxIconPanel.ICON_HEIGHT) + "px");

		let layoutData = new GridData(ToolboxIconPanel.ICON_WIDTH, true);
		this.icon.setLayoutData(layoutData);

	}

	private createLabelPart(parent: Composite): void {

		let label = new Label(parent);
		label.setText(this.label);

		let element = label.getElement();
		element.css("line-height", (ToolboxIconPanel.ICON_HEIGHT) + "px");

		let layoutData = new GridData(true, true);
		label.setLayoutData(layoutData);

	}

	public onSelection(callback: (event: Event) => void): void {
		this.composite.onSelection(callback);
	}

	public setEnabled(enabled: boolean): void {
		this.composite.setEnabled(enabled);
	}

	public setIcon(icon: string): void {
		this.icon.removeClasses("^mdi-");
		this.icon.addClass(icon);
	}

	public setAttr(name: string, value: any): void {
		let element = this.icon.getElement();
		element.attr(name, value);
	}

	public select(): void {
		let element = this.composite.getElement();
		element.click();
	}

	public adjustWidth(): number {

		let width = ToolboxIconPanel.ICON_WIDTH;
		if (this.label !== null) {

			let element = this.composite.getElement();
			let space = ToolboxIconPanel.ICON_WIDTH;
			width += functions.measureTextWidth(element, this.label) + space;

			let layoutData = <GridData>this.icon.getLayoutData();
			layoutData.horizontalIndent = space / 2;

		}
		return width;
	}

	public getControl(): Control {
		return this.composite;
	}

}