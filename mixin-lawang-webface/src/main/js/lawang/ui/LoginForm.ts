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
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import UserForm from "lawang/ui/UserForm";
import FormLink from "lawang/ui/FormLink";
import FormInput from "lawang/ui/FormInput";

export default class LoginForm extends UserForm {

	constructor(parent: Composite) {
		super(parent, "lawang/login");
	}

	protected createSubmitInput(parent: Composite): void {

		this.createLabel(parent, "");
		let submitButton = new FormInput(parent, FormInput.TYPE_SUBMIT, "login");
		submitButton.setValue("Login");

		let element = submitButton.getElement();
		element.addClass("btn");
		element.addClass("btn-primary");

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

		this.createSecondLabel(secondPart, "Don't have an account?", 160);
		this.createSignupInput(secondPart);

	}

	private createSignupInput(parent: Composite): void {

		let signupLink = new FormLink(parent, "signup.html");
		signupLink.setValue("Signup");

		let layoutData = new GridData(true, true);
		signupLink.setLayoutData(layoutData);

	}

}
