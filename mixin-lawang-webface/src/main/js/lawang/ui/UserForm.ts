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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import FormInput from "lawang/ui/FormInput";

export abstract class UserForm extends Control {

	public static LABEL_WIDTH = 100;
	public static INPUT_HEIGHT = 32;
	public static SECOND_PART_HEIGHT = 50;

	private static USERNAME = "username";
	private static PASSWORD = "password";

	private composite: Composite = null;
	private messageLabel: Label = null;
	private usernameInput: FormInput = null;
	private passwordInput: FormInput = null;

	constructor(parent: Composite, action: string, index?: number) {
		super(jQuery("<form>"), parent, index);
		this.element.attr("method", "post");
		this.element.attr("action", action);
		this.createComposite();
	}

	private createComposite(): void {

		this.composite = new Composite(this.element);

		let layout = new GridLayout(2, 0, 0, 10, 10);
		this.composite.setLayout(layout);

		this.createMessageLabel(this.composite);
		this.createEmailInput(this.composite);
		this.createPasswordInput(this.composite);
		this.createSubmitInput(this.composite);
		this.createSecondPart(this.composite);

	}

	private createMessageLabel(parent: Composite): void {

		this.messageLabel = new Label(parent);
		this.setMessage("Please specify e-mail and password");

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		layoutData.horizontalSpan = 2;
		this.messageLabel.setLayoutData(layoutData);

	}

	private createEmailInput(parent: Composite): void {

		this.createLabel(parent, "Email");
		this.usernameInput = new FormInput(parent, FormInput.TYPE_TEXT, UserForm.USERNAME);

		let element = this.usernameInput.getElement();
		element.css("line-height", UserForm.INPUT_HEIGHT - 2 + "px");

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		this.usernameInput.setLayoutData(layoutData);

	}

	private createPasswordInput(parent: Composite): void {

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

	private setMessage(message: string, error?: boolean): void {
		this.messageLabel.setText(message);
		let element = this.messageLabel.getElement();
		element.css("color", error === true ? "#F44" : "#444");
	}

	public setSize(width: number, height: number): void {
		super.setSize(width, height);
		this.composite.setSize(width, height);
		this.composite.relayout();
	}
}

export default UserForm;