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
import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";
import MessagePresenter from "webface/dialogs/MessagePresenter";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

export abstract class TitleAreaDialog extends Dialog implements MessagePresenter {

	public static TITLE_AREA_HEIGHT = 54;
	public static BODY_MARGIN = 5;

	private titleArea: Composite;
	private titleLabel: Label;
	private messageLabel: Label;
	private body: Composite = null;

	protected okButton: Button;

	private title = "Title Area Dialog";
	private message = "Please specify inputs";

	constructor() {
		super();
		this.setDialogSize(420, 360);
	}

	public createContents(parent: Composite): void {

		let composite = new Composite(parent);

		let element = composite.getElement();
		element.addClass("title-area-dialog-contents");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		composite.setLayout(layout);

		this.createTitleArea(composite);
		this.createBody(composite);
	}

	private createTitleArea(parent: Composite): void {

		this.titleArea = new Composite(parent);

		let element = this.titleArea.getElement();
		element.addClass("title-area-dialog-title-area");

		let layout = new GridLayout(1, 10);
		this.titleArea.setLayout(layout);

		let layoutData = new GridData(true, TitleAreaDialog.TITLE_AREA_HEIGHT);
		layoutData.grabExcessHorizontalSpace = true;
		this.titleArea.setLayoutData(layoutData);

		this.createTitleLabel(this.titleArea);
		this.createMessageLabel(this.titleArea);

	}

	private createTitleLabel(parent: Composite): void {

		this.titleLabel = new Label(parent);
		this.titleLabel.setText(this.title);

		// Element
		let element = this.titleLabel.getElement();
		element.addClass("title-area-dialog-title-label");
		element.css("font-weight", "bold");
	}

	private createMessageLabel(parent: Composite): void {

		this.messageLabel = new Label(parent);
		this.messageLabel.setText(this.message);

		let element = this.messageLabel.getElement();
		element.addClass("title-area-dialog-message-label");

		let layoutData = new GridData(true, true);
		layoutData.horizontalIndent = 10;
		this.messageLabel.setLayoutData(layoutData);
	}

	private createBody(parent: Composite): void {

		this.body = new Composite(parent);

		// Element
		let element = this.body.getElement();
		element.css("border-top", "1px solid #F0F0F0");
		element.css("border-bottom", "1px solid #F0F0F0");

		element.addClass("title-area-dialog-body");

		let layout = new FillLayout(webface.HORIZONTAL, TitleAreaDialog.BODY_MARGIN, TitleAreaDialog.BODY_MARGIN);
		this.body.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.body.setLayoutData(layoutData);

		this.createControl(this.body);

	}

	protected abstract createControl(parent: Composite): void;

	protected createButtons(buttons: DialogButtons): void {
		buttons.createCancelButton();
		this.okButton = buttons.createOKButton();
		this.okButton.setEnabled(false);
	}

	public setTitle(text: string): void {
		this.title = text;
		if (this.titleLabel) {
			this.titleLabel.setText(text)
		}
	}

	protected getBaseHeight(): number {
		let height = super.getBaseHeight();
		height += TitleAreaDialog.TITLE_AREA_HEIGHT + 1;
		return height;
	}

	/**
	  * Support sebelum dan sesudah create title area
	  */
	public setMessage(text: string): void {
		this.message = text;
		if (this.messageLabel) { // Support sesudah create title area
			if (text === null || text === undefined) {
				this.messageLabel.setText("");
			} else {
				this.messageLabel.setText(text);
			}
			let element = this.messageLabel.getElement();
			element.css("color", "inherit");
		}
	}

	public setErrorMessage(text: string): void {
		this.message = text;
		if (this.messageLabel) { // Support sesudah create title area 
			if (text) {
				this.messageLabel.setText(text);
				let element = this.messageLabel.getElement();
				element.css("color", "#AE3341");
			} else {
				this.messageLabel.setText("");
				let element = this.messageLabel.getElement();
				element.css("color", "inherit");
			}
		}
	}
}

export default TitleAreaDialog;

