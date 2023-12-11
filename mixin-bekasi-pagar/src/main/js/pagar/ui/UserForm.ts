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
import HeightAdjustablePanel from "webface/wef/HeightAdjustablePanel";

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";

import FormInput from "pagar/ui/FormInput";

import PagarContext from "pagar/ui/PagarContext";

export abstract class UserForm implements HeightAdjustablePanel {

	protected context: PagarContext;

	public static LABEL_WIDTH = 120;
	public static INPUT_HEIGHT = 32;
	public static SECOND_PART_HEIGHT = 50;

	private static USERNAME = "username";
	private static PASSWORD = "password";

	protected composite: Composite = null;
	protected messageLabel: Label = null;
	protected usernameInput: FormInput = null;
	protected passwordInput: FormInput = null;

	constructor(context: PagarContext) {
		this.context = context;
	}

	public abstract createControl(parent: Composite, index?: number): void;

	public abstract adjustHeight(): number;

	public getControl(): Control {
		return this.composite;
	}

	protected createMessageLabel(parent: Composite, message: string): void {

		this.messageLabel = new Label(parent);
		this.setMessage(message);

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		layoutData.horizontalSpan = 2;
		this.messageLabel.setLayoutData(layoutData);

	}

	protected createEmailInput(parent: Composite): void {

		this.createLabel(parent, "Email");
		this.usernameInput = new FormInput(parent, FormInput.TYPE_TEXT, UserForm.USERNAME);

		let element = this.usernameInput.getElement();
		element.css("line-height", UserForm.INPUT_HEIGHT - 2 + "px");

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		this.usernameInput.setLayoutData(layoutData);

	}

	protected createPasswordInput(parent: Composite): void {

		this.createLabel(parent, "Password");

		this.passwordInput = new FormInput(parent, FormInput.TYPE_PASSWORD, UserForm.PASSWORD);

		let element = this.passwordInput.getElement();
		element.css("line-height", UserForm.INPUT_HEIGHT - 2 + "px");

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		this.passwordInput.setLayoutData(layoutData);

	}

	protected abstract createSubmitInput(parent: Composite): void;

	protected abstract createSecondPart(parent: Composite): void;

	protected createSecondLabel(parent: Composite, label: string, width: number): void {

		let secondLabel = new Label(parent);
		secondLabel.setText(label);

		let layoutData = new GridData(width, true);
		secondLabel.setLayoutData(layoutData);

	}

	protected createLabel(parent: Composite, text: string): Label {

		let label = new Label(parent);
		label.setText(text);

		let layoutData = new GridData(UserForm.LABEL_WIDTH, UserForm.INPUT_HEIGHT);
		label.setLayoutData(layoutData);

		return label;
	}

	protected setMessage(message: string, error?: boolean): void {
		this.messageLabel.setText(message);
		let element = this.messageLabel.getElement();
		element.css("color", error === true ? "#F44" : "#444");
	}

}

export default UserForm;