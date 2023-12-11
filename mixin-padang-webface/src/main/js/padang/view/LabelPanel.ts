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

import * as view from "padang/view/view";

export default class LabelPanel implements Panel {

	private label: Label = null;
	private indent: number = null;
	private onSelection = () => { };

	constructor(indent?: number) {
		this.indent = indent === undefined ? null : indent;
	}

	public createControl(parent: Composite, index?: number): void {

		this.label = new Label(parent, index);

		let element = this.label.getElement();
		element.css("line-height", "inhirent");
		element.css("text-indent", this.indent === null ? 0 : this.indent);

		this.label.onSelection(() => {
			this.onSelection();
		})
	}

	public setFontWeight(weight: string): void {
		view.css(this.label, "font-weight", weight);
	}

	public setFontStyle(style: string): void {
		view.css(this.label, "font-style", style);
	}

	public setLineHeight(pixel: number): void {
		view.css(this.label, "line-height", pixel + "px");
	}

	public setTextColor(color: string): void {
		view.css(this.label, "color", color);
	}

	public setTextAlign(align: string): void {
		view.css(this.label, "text-align", align);
	}

	public setTextIndent(indent: number): void {
		view.css(this.label, "text-indent", indent);
	}

	public setText(text: string): void {
		this.label.setText(text);
	}

	public setTextHint(text: string): void {
		let element = this.label.getElement();
		element.attr("title", text);
	}

	public getText(): string {
		return this.label.getText();
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public getControl(): Control {
		return this.label;
	}

}
