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

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import * as view from "padang/view/view";

export default class IconLabelPanel implements Panel {

	public static HEIGHT = 24;

	private marginWidth = 0;
	private marginHeight = 0;
	private composite: Composite = null;
	private icon: WebFontIcon = null;
	private label: Label = null;
	private onSelection = () => { };

	constructor(marginWidth?: number, marginHeight?: number) {
		this.marginWidth = marginWidth === undefined ? 0 : marginWidth;
		this.marginHeight = marginHeight === undefined ? 0 : marginHeight;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let layout = new GridLayout(2, this.marginWidth, this.marginHeight);
		this.composite.setLayout(layout);

		let element = this.composite.getElement();
		element.addClass("padang-icon-label-panel");
		element.css("line-height", "inherite");

		this.createIcon(this.composite);
		this.createLabel(this.composite);

		this.composite.onSelection(() => {
			this.onSelection();
		});
	}

	private createIcon(parent: Composite): void {

		this.icon = new WebFontIcon(parent);
		this.icon.addClass("mdi");

		let element = this.icon.getElement();
		element.css("color", "#888");
		element.css("font-size", "24px");
		element.css("line-height", "inherit");

		let layoutData = new GridData(IconLabelPanel.HEIGHT, true);
		this.icon.setLayoutData(layoutData);
	}

	private createLabel(parent: Composite): void {

		this.label = new Label(parent);

		let element = this.label.getElement();
		element.css("line-height", "inherit");
		element.css("text-overflow", "ellipsis");

		let layoutData = new GridData(true, true);
		this.label.setLayoutData(layoutData);
	}

	public setIcon(icon: string): void {
		if (icon !== undefined) {
			this.icon.addClass(icon);
		}
	}

	public setColor(color: string): void {
		view.css(this.icon, "color", color);
		view.css(this.label, "color", color);
	}

	public setIconColor(color: string): void {
		view.css(this.icon, "color", color);
	}

	public setLabel(text: string): void {
		this.label.setText(text);
	}

	public setTooltip(text: string): void {
		let element = this.label.getElement();
		element.attr("title", text);
	}

	public setLabelColor(color: string): void {
		view.css(this.label, "color", color);
	}

	public setShowIcon(show: boolean): void {
		view.setGridData(this.icon, show ? IconLabelPanel.HEIGHT : 0, true);
		view.setGridLayout(this.composite, 2, this.marginWidth, this.marginHeight, show ? 5 : 0, 0);
	}

	public getLabel(): string {
		return this.label.getText();
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
		let element = this.composite.getElement();
		element.addClass("padang-icon-label-panel-callback");
	}

	public adjustHeight(): number {
		return IconLabelPanel.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}