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
import Button from "webface/widgets/Button";

import Caution from "webface/core/Caution";
import Response from "webface/core/Response";
import ExceptionCaution from "webface/core/ExceptionCaution";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import TextArea from "webface/widgets/TextArea";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import SelectionListener from "webface/events/SelectionListener";

export default class DetailMessageDialog extends Dialog {

	private static WIDTH = 600;
	private static SHOW_DETAILS = "Show Details";
	private static HIDE_DETAILS = "Hide Details";

	protected composite: Composite;

	private message: string = null;
	private messageLabel: Label = null;
	private detailPart: Composite = null;
	private detailMessage: string = null;

	private detailButton: Button = null;
	private detailTextArea: TextArea = null;
	private expanded = false;

	constructor() {
		super();
		super.setWindowTitle("Detail Dialog");
		super.setDialogSize(DetailMessageDialog.WIDTH, Dialog.MIN_HEIGHT);
	}

	public createContents(parent: Composite): void {

		this.composite = new Composite(parent);

		let layout = new GridLayout(1, 10, 15);
		this.composite.setLayout(layout);

		this.createMessageLabel(this.composite);
		this.createDetailPart(this.composite);
		this.doExpanded();
	}

	private createMessageLabel(parent: Composite): void {
		this.messageLabel = new Label(parent);
		this.messageLabel.setText(this.message);
	}

	protected createButtons(buttons: DialogButtons): void {
		let okButton = buttons.createOKButton();
		this.setDefaultButton(okButton);
	}

	public setMessage(message: string): void {
		this.message = message;
	}

	private createDetailPart(parent: Composite): void {

		this.detailPart = new Composite(parent);

		let layout = new GridLayout(1, 0, 0);
		this.detailPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.detailPart.setLayoutData(layoutData);

		this.createDetailButton(this.detailPart);
		this.createDetailViewer(this.detailPart);
	}

	private createDetailButton(parent: Composite): void {

		this.detailButton = new Button(parent);
		this.detailButton.setText(DetailMessageDialog.SHOW_DETAILS);

		let layoutData = new GridData();
		layoutData.widthHint = 120;
		this.detailButton.setLayoutData(layoutData);

		this.detailButton.addSelectionListener(<SelectionListener>{
			widgetSelected: () => {
				this.setExpanded(!this.expanded);
			}
		});

		if (this.detailMessage !== null) {
			this.detailButton.setEnabled(true);
		}
	}

	private createDetailViewer(parent: Composite): void {

		this.detailTextArea = new TextArea(parent);
		this.detailTextArea.setText(this.detailMessage);
		this.detailTextArea.setVisible(false);

		let layoutData = new GridData(true, 0);
		this.detailTextArea.setLayoutData(layoutData);

	}

	public setExpanded(expanded: boolean): void {
		if (this.expanded === expanded) {
			return;
		}
		this.expanded = expanded;
		if (this.messageLabel !== null) {
			this.doExpanded();
		}
	}

	private doExpanded(): void {
		let layoutData = <GridData>this.detailTextArea.getLayoutData();
		if (this.expanded === true) {
			this.detailButton.setText(DetailMessageDialog.HIDE_DETAILS);
			layoutData.heightHint = webface.DEFAULT;
			layoutData.grabExcessVerticalSpace = true;
			this.setDialogSize(DetailMessageDialog.WIDTH, 480);
		} else {
			this.detailButton.setText(DetailMessageDialog.SHOW_DETAILS);
			layoutData.heightHint = 0;
			layoutData.grabExcessVerticalSpace = false;
			this.setDialogSize(DetailMessageDialog.WIDTH, Dialog.MIN_HEIGHT);
		}
		this.detailTextArea.setVisible(this.expanded);
		this.reposition();
	}

	public setDetailMessage(detailMessage: string): void {
		this.detailMessage = detailMessage;
	}

	public setContent(object: any, title?: string): void {

		if (object instanceof Response) {

			let response = <Response>object;
			this.setMessage(response.getMessage());
			this.setDetailMessage(response.getDetailMessage());

		} else if (object instanceof Caution) {

			let caution = <Caution>object;
			this.setMessage(caution.getMessage());
			this.setDetailMessage(caution.getDetailMessage());

		} else {

			if (object["responseJSON"] !== undefined) {
				let caution = new ExceptionCaution(object);
				this.setMessage(caution.getMessage());
				this.setDetailMessage(caution.getDetailMessage());
			} else {
				let response = new Response(object);
				this.setMessage(response.getMessage());
				this.setDetailMessage(response.getDetailMessage());
			}

		}

		if (title !== undefined) {
			this.setWindowTitle(title);
		}

	}

	public static open(object: any, title?: string, callback?: () => void): void {
		let dialog = new DetailMessageDialog();
		dialog.setContent(object, title);
		dialog.open(() => {
			if (callback !== undefined) {
				callback();
			}
		});
	}

}

