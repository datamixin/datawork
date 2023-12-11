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

import Label from "webface/widgets/Label";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import FillLayout from "webface/layout/FillLayout";

export default class ProgressDialog extends Dialog {

	private messageLabel: Label;
	private message: string;

	constructor() {
		super();
		super.setWindowTitle("Progress Dialog");
		super.setDialogSize(Dialog.MIN_WIDTH * 2, Dialog.MIN_HEIGHT);
	}

	public createContents(parent: Composite): void {

		let composite = new Composite(parent);
		let layout = new FillLayout(webface.VERTICAL, 15, 15);
		composite.setLayout(layout);

		this.createMessageLabel(composite);
	}

	private createMessageLabel(parent: Composite): void {
		this.messageLabel = new Label(parent);
		let element = this.messageLabel.getElement();
		element.css("white-space", "normal");
		if (this.message) {
			this.messageLabel.setText(this.message);
		}
	}

	public createButtons(buttons: DialogButtons): void {
		let calcelButton = buttons.createCancelButton();
		calcelButton.setEnabled(false);
	}

	public setMessage(message: string): void {
		this.message = message;
		if (this.messageLabel) {
			this.messageLabel.setText(this.message);
		}
	}

}
