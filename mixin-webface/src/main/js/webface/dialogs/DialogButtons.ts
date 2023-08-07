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
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/functions";

import Closable from "webface/core/Closable";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import SelectionListener from "webface/events/SelectionListener";

export default class DialogButtons {

	public static HEIGHT = 50;
	public static OK: string = "OK";
	public static NO: string = "No";
	public static CANCEL: string = "Cancel";
	public static BUTTON_WIDTH: number = 72;

	private closable: Closable;
	private layout: GridLayout;
	private composite: Composite;
	private callback = (result: string) => { };

	constructor(closable: Closable, parent: Composite, margin?: number, height?: number) {

		this.closable = closable;
		this.composite = new Composite(parent);

		// Layout
		margin = margin === undefined ? 10 : margin;
		this.layout = new GridLayout(1, margin, margin, 10);
		this.composite.setLayout(this.layout);

		// Layout Data
		height = height === undefined ? DialogButtons.HEIGHT : height;
		let layoutData = new GridData(true, height);
		this.composite.setLayoutData(layoutData);

		this.createSpace(this.composite)
	}

	private createSpace(parent: Composite): void {

		let label = new Label(parent);

		let layoutData = new GridData(true);
		label.setLayoutData(layoutData);
	}

	public createButton(label: string, classname: string): Button {

		let button = new Button(this.composite);
		button.setText(label);

		let width = functions.measureTextWidth(this.composite, label);
		width = Math.max(DialogButtons.BUTTON_WIDTH, width + 30);

		let element = button.getElement();
		element.removeClass("btn-default");
		element.addClass(classname);

		// Layout
		this.layout.numColumns = this.layout.numColumns + 1;
		let layoutData = new GridData(width);
		button.setLayoutData(layoutData);

		return button;
	}

	/**
	 * Complete button adalah button selain OK seperti 'apply'.
	 * @param label
	 */
	public createCompleteButton(label: string, classname?: string): Button {
		let button = this.createButton(label, classname === undefined ? "btn-primary" : classname);
		button.addSelectionListener(<SelectionListener>{
			widgetSelected: () => {
				this.closable.close();
				let result = button.getText();
				this.callback(result);
			}
		});
		return button;
	}

	/**
	 * Buat tombol untuk action didialog tanpa menutup seperti 'reset'.
	 * @param label
	 */
	public createActionButton(label: string, classname: string): Button {
		let button = this.createButton(label, classname);
		button.addSelectionListener(<SelectionListener>{
			widgetSelected: () => {
				let text = button.getText();
				this.callback(text);
			}
		});
		return button;
	}

	public createOKButton(): Button {
		return this.createCompleteButton(DialogButtons.OK, "btn-primary");
	}

	public createNOButton(): Button {
		return this.createCompleteButton(DialogButtons.NO, "btn-warning");
	}

	public createCancelButton(): Button {
		return this.createCompleteButton(DialogButtons.CANCEL, "btn-default");
	}

	public setCallback(callback?: (result: string) => void): void {
		if (callback !== undefined) {
			this.callback = callback;
		}
	}

}
