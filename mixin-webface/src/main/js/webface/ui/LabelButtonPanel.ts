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
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import * as functions from "webface/functions";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class LabelButtonPanel {

	public static BUTTON_WIDTH = 18;

	private composite: Composite = null;
	private label: Label = null;
	private buttonCallback: (event: Event) => void = () => { };
	private button: Button = null;

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.css("border", "1px solid #D8D8D8");
		element.css("border-radius", "3px");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabel(this.composite);
		this.createButton(this.composite);
	}

	private createLabel(parent: Composite): void {

		this.label = new Label(parent);

		let element = this.label.getElement();
		element.css("text-indent", "5px");
		element.css("line-height", "inherit");

		let layoutData = new GridData(true, true);
		this.label.setLayoutData(layoutData);
	}

	private createButton(parent: Composite): void {

		this.button = new Button(parent);

		let element = this.button.getElement();
		element.css("border", 0);
		element.css("border-radius", 0);
		element.css("border-left", "1px solid #D8D8D8");
		element.css("line-height", "inherit");
		element.css("padding", 0);

		let layoutData = new GridData(LabelButtonPanel.BUTTON_WIDTH, true);
		this.button.setLayoutData(layoutData);

		this.button.onSelection((event: Event) => {
			this.buttonCallback(event);
		});
	}

	public getLabelControl(): Label {
		return this.label;
	}

	public getButtonControl(): Button {
		return this.button;
	}

	public setLabelText(text: string): void {
		let value = this.label.getText();
		if (value !== text) {
			this.label.setText(text);
		}
	}

	public getLabelText(): string {
		return this.label.getText();
	}

	public setButtonText(text: string): void {

		let element = this.button.getElement();
		let width = functions.measureTextWidth(element, text);
		width += LabelButtonPanel.BUTTON_WIDTH;

		let layoutData = <GridData>this.button.getLayoutData();
		layoutData.widthHint = width;

		this.button.setText(text);
		this.composite.relayout();
	}

	public setButtonCallback(callback: (event: Event) => void): void {
		this.buttonCallback = callback;
	}

	public setEnabled(enabled: boolean): void {
		this.label.setEnabled(enabled);
		this.button.setEnabled(enabled);
	}

	public getControl(): Control {
		return this.composite;
	}
}
