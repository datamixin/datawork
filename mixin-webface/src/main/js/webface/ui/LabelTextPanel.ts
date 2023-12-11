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
import * as webface from "webface/webface";

import Text from "webface/widgets/Text";
import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import * as widgets from "webface/functions";
import * as functions from "webface/widgets/functions";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

export default class LabelTextPanel {

	private static TEXT_ALIGN = "left";
	private static PADDING_WIDTH = 5;

	private composite: Composite = null;
	private container: Composite = null;
	private readOnly: boolean = false;
	private value: string = webface.BLANK;
	private oldText: string = null;
	private placeholder: string = null;
	private holderLabel: Label = null;
	private editLabel: Label = null;
	private editText: Text = null;
	private editCallback = () => { };
	private editOnFocus: boolean = false;
	private modifyCallback = (text: string) => { };
	private commitCallback = (oldText: string, newText: string) => { };
	private cancelCallback = () => { };

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("ui-label-text-panel");
		element.css("text-align", LabelTextPanel.TEXT_ALIGN);
		element.css("line-height", "inherit");

		let layout = new AbsoluteLayout();
		this.composite.setLayout(layout);

		this.createHolderLabel(this.composite);
		this.createContainer(this.composite);

		this.composite.onSelection((event: Event) => {
			if (this.editOnFocus === true) {
				if (this.readOnly !== true) {
					this.setShowEdit(true, event);
				}
			}
		});

	}

	private createHolderLabel(parent: Composite): void {

		this.holderLabel = new Label(parent);

		let element = this.holderLabel.getElement();
		element.addClass("ui-label-text-panel-placeholder");
		element.css("font-style", "italic");
		element.css("color", "#CCC");

		this.fillbothDirection(this.holderLabel);

	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.container.setLayout(layout);

		this.fillbothDirection(this.container);

		this.createEditLabel(this.container);

	}

	private fillbothDirection(control: Control): void {
		let layoutData = new AbsoluteData(0, 0, "100%", "100%");
		control.setLayoutData(layoutData);
	}

	private createEditLabel(parent: Composite): void {

		this.editLabel = new Label(parent);

		let element = this.editLabel.getElement();
		element.addClass("ui-label-text-panel-label");

		this.prepareStyle(element);

		let layoutData = new GridData(true, true);
		this.editLabel.setLayoutData(layoutData);

		this.editLabel.addListener(webface.MouseDoubleClick, <Listener>{
			handleEvent: (event: Event) => {
				if (this.readOnly !== true) {
					this.setShowEdit(true, event)
				}
			}
		});

	}

	private prepareStyle(element: JQuery): void {
		element.css("text-align", "inherit");
		element.css("line-height", "inherit");
		element.css("padding-left", LabelTextPanel.PADDING_WIDTH + "px");
		element.css("padding-right", LabelTextPanel.PADDING_WIDTH + "px");
	}

	private createEditText(parent: Composite): void {

		this.editText = new Text(parent);
		this.editText.setReadOnly(this.readOnly);

		let element = this.editText.getElement();
		element.addClass("ui-label-text-panel-text");
		this.prepareStyle(element);

		element.css("border", "0px");
		element.css("text-indent", "0px");
		element.css("border-radius", "0px");
		element.css("background-color", "#FFF4CE");

		// Focus hilang otomatis commit
		element.on("focusout", (event: JQueryEventObject) => {
			this.commit();
		});

		// Key Enter -> commit
		element.on("keydown", (event: JQueryEventObject) => {

			if (event.which === 13) {
				this.commit();
			} else if (event.which === 27) {
				this.cancel();
			}

		});

		// Tidak ada response double click di edit
		this.editText.addListener(webface.MouseDoubleClick, <Listener>{
			handleEvent: (event: Event) => {
				event.eventObject.stopPropagation();
			}
		});

		let layoutData = new GridData(true, true);
		this.editText.setLayoutData(layoutData);

		this.editText.onModify((value: string) => {
			this.value = value;
			this.modifyCallback(this.value);
		});

		element.focus();

	}

	public commit(): void {
		this.setShowEdit(false);
		if (this.oldText !== this.value) {
			this.commitCallback(this.value, this.oldText);
		}
	}

	private cancel(): void {
		this.value = this.oldText;
		this.setShowEdit(false);
		this.cancelCallback();
	}

	public setText(text: string): void {
		this.value = text;
		if (this.editLabel !== null) {
			this.editLabel.setText(text);
		} else {
			this.editText.setText(text);
		}
		if (this.value === null || this.value === "") {
			this.holderLabel.setText(this.placeholder);
		}
	}

	public setReadOnly(readOnly: boolean): void {
		this.readOnly = readOnly;
	}

	public getText(): string {
		return this.value;
	}

	public setEditOnFocus(editOnFocus: boolean): void {
		this.editOnFocus = editOnFocus;
	}

	public setShowEdit(edit: boolean, eventPositionReset?: Event | number | boolean): void {

		if (edit === true && this.editLabel === null && this.readOnly !== true) {
			return; // Sudah dalam keadaan edit
		}

		functions.removeChildren(this.container);
		if (edit === true) {

			// Buat edit text dan icon
			this.oldText = this.value;
			this.editLabel = null;
			this.createEditText(this.container);

			if (eventPositionReset !== true) {

				this.editText.setText(this.value);

				let end = -1;
				if (this.editOnFocus === true) {
					if (eventPositionReset instanceof Event && this.value !== null) {
						let eventObject = eventPositionReset.eventObject;
						let element = this.editText.getElement();
						let x = eventObject.offsetX;
						let prev = 0;
						let inrange = false;
						for (let i = 0; i <= this.value.length; i++) {
							end = i;
							let text = this.value.substr(0, i);
							let width = widgets.measureTextWidth(element, text);
							if (width > x) {
								if (x - prev < width - x) {
									end = i === 0 ? 0 : i - 1;
								}
								inrange = true;
								break;
							}
							prev = width;
						}
						if (inrange === false) {
							end++;
						}
					} else {
						end = <number>eventPositionReset;
					}
				}

				let element = this.editText.getElement();
				let htmlText = <HTMLInputElement>element[0];
				if (end !== -1) {

					htmlText.selectionStart = end;
					htmlText.selectionEnd = end;

				} else {

					// Set full selection
					htmlText.selectionStart = 0;
					htmlText.selectionEnd = this.value === null ? 0 : this.value.length;
				}
			}

			// Panggil edit callback
			this.editCallback();

		} else {

			// Buat edit label
			this.editText = null;
			this.createEditLabel(this.container);
			this.editLabel.setText(this.value);

		}
		this.container.relayout();
	}

	public setPlaceholder(placeholder: string): void {
		this.placeholder = placeholder;
	}

	public onEdit(callback: () => void): void {
		this.editCallback = callback;
	}

	public onModify(callback: () => void): void {
		this.modifyCallback = callback;
	}

	public onCommit(callback: (newText: string, oldText: string) => void): void {
		this.commitCallback = callback;
	}

	public onCancel(callback: () => void): void {
		this.cancelCallback = callback;
	}

	public getLabelControl(): Label {
		return this.editLabel;
	}

	public getTextControl(): Text {
		return this.editText;
	}

	public getControl(): Control {
		return this.composite;
	}

}

