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
import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Composite from "webface/widgets/Composite";

import UserForm from "pagar/ui/UserForm";
import FormInput from "pagar/ui/FormInput";

import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";

import { api } from "pagar/pagar";

import PagarContext from "pagar/ui/PagarContext";

export default class SignupForm extends UserForm {

	private static NAME = "name";

	protected nameInput: FormInput = null;

	constructor(context: PagarContext) {
		super(context);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let layout = new GridLayout(2, 0, 0, 10, 10);
		this.composite.setLayout(layout);

		this.createMessageLabel(this.composite, "Please fill the information below");
		this.createNameInput(this.composite);
		this.createEmailInput(this.composite);
		this.createPasswordInput(this.composite);
		this.createSubmitInput(this.composite);
		this.createSecondPart(this.composite);

	}

	protected createNameInput(parent: Composite): void {

		this.createLabel(parent, "Name");
		this.nameInput = new FormInput(parent, FormInput.TYPE_TEXT, SignupForm.NAME);

		let element = this.nameInput.getElement();
		element.css("line-height", UserForm.INPUT_HEIGHT - 2 + "px");

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		this.nameInput.setLayoutData(layoutData);

	}

	protected createSubmitInput(parent: Composite): void {

		this.createLabel(parent, "");
		let submitButton = new Button(parent);
		submitButton.setText("Signup");

		let element = submitButton.getElement();
		element.addClass("btn");
		element.addClass("btn-success");

		submitButton.onSelection(async (event: Event) => {

			let name = this.nameInput.getElement().val();
			let email = this.usernameInput.getElement().val();
			let password = this.passwordInput.getElement().val();

			api.createAccount(email, password, name, (model) => {
				model.then(respon => {
					api.createSession(email, password, (model) => {
						model.then(respon => {
							this.context.successSignup();
						}, error => {
							let message = error.message;
							this.setMessage(message, true);
						});
					})
				}, error => {
					let message = error.message;
					this.setMessage(message, true);
				});
			});
		});

		let layoutData = new GridData(true, UserForm.INPUT_HEIGHT);
		submitButton.setLayoutData(layoutData);

	}

	protected createSecondPart(parent: Composite): void {

		let secondPart = new Composite(parent);

		let element = secondPart.getElement();
		element.css("border-top", "1px dashed #CCC");

		let layout = new GridLayout(2, 0, 10, 0, 0);
		secondPart.setLayout(layout);

		let layoutData = new GridData(true, UserForm.SECOND_PART_HEIGHT);
		layoutData.verticalIndent = 20;
		layoutData.horizontalSpan = 2;
		secondPart.setLayoutData(layoutData);

		this.createSecondLabel(secondPart, "Already have an account?", 175);
		this.createLoginLink(secondPart);

	}

	private createLoginLink(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Login")

		let element = label.getElement();
		element.addClass("btn-link");
		element.css("cursor", "pointer");

		label.onSelection((event: Event) => {
			this.context.showLogin(true);
		});

		let layoutData = new GridData(true, true);
		label.setLayoutData(layoutData);
	}

	public adjustHeight(): number {
		return 360;
	}

}