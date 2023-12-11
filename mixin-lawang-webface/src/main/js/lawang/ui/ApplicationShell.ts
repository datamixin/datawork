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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import AbsoluteData from "webface/layout/AbsoluteData";
import AbsoluteLayout from "webface/layout/AbsoluteLayout";

import LoginForm from "lawang/ui/LoginForm";
import UserForm from "./UserForm";

export class ApplicationShell {

	private static WIDTH = 480;
	private static HEIGHT = 480;
	private static LOGIN_WIDTH = 420;
	private static LOGIN_HEIGHT = 320;
	private static FOOTER_HEIGHT = 34;

	private formType: any = null;
	private composite: Composite = null;
	private contentPart: Composite = null;
	private introPart: Composite = null;
	private userPart: Composite = null;
	private userForm: UserForm = null;
	private footerPart: Composite = null;

	constructor(formType: typeof UserForm) {
		this.formType = formType;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("lawang-application-shell");
		element.css("line-height", LoginForm.INPUT_HEIGHT + "px");
		element.css("background-color", "#F8F8F8");

		let layout = new AbsoluteLayout();
		this.composite.setLayout(layout);

		this.createContentPart(this.composite);
	}

	private createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);

		let element = this.contentPart.getElement();
		element.addClass("lawang-application-shell-content-part");

		let layoutData = new AbsoluteData("50%", "50%", ApplicationShell.WIDTH, ApplicationShell.HEIGHT);
		layoutData.transform = "translate(-50%, -60%)";
		this.contentPart.setLayoutData(layoutData);

		let layout = new GridLayout(1, 0, 0, 0, 10);
		this.contentPart.setLayout(layout);

		this.createIntroPart(this.contentPart);
		this.createUserPart(this.contentPart);
		this.createFooterPart(this.contentPart);

	}

	private createIntroPart(parent: Composite): void {

		this.introPart = new Composite(parent);

		let layoutData = new GridData(true, true);
		this.introPart.setLayoutData(layoutData);

		let layout = new GridLayout(1);
		this.introPart.setLayout(layout);

		this.createCaptionLabel(this.introPart);
		this.createMessageLabel(this.introPart);

	}

	private createCaptionLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Andiasoft");

		let element = label.getElement();
		element.css("font-size", "56px");
		element.css("line-height", "56px");
		element.css("text-align", "center");
		element.css("color", "#337ab7");

		let layoutData = new GridData(true, 56);
		label.setLayoutData(layoutData);

	}

	private createMessageLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Self Service Data Science");

		let element = label.getElement();
		element.css("font-size", "24px");
		element.css("text-align", "center");
		element.css("color", "#ff7812");

		let layoutData = new GridData(true, 32);
		label.setLayoutData(layoutData);

	}

	private createUserPart(parent: Composite): void {

		this.userPart = new Composite(parent);

		let element = this.userPart.getElement();
		element.addClass("lawang-application-shell-user-part");
		element.css("transition", "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s");
		element.css("border", "2px solid #80bdff");
		element.css("border-radius", "4px");
		element.css("background-color", "#FFF");

		let layout = new GridLayout(1, 40, 40, 0, 0);
		this.userPart.setLayout(layout);

		let layoutData = new GridData(ApplicationShell.LOGIN_WIDTH, ApplicationShell.LOGIN_HEIGHT);
		layoutData.horizontalAlignment = webface.CENTER;
		this.userPart.setLayoutData(layoutData);

		this.createUserForm(this.userPart);

	}

	private createUserForm(parent: Composite): void {

		this.userForm = <UserForm>new this.formType(parent);

		let layoutData = new GridData(true, true);
		this.userForm.setLayoutData(layoutData);

	}

	private createFooterPart(parent: Composite): void {

		this.footerPart = new Composite(parent);

		let layoutData = new GridData(true, ApplicationShell.FOOTER_HEIGHT);
		this.footerPart.setLayoutData(layoutData);

		let layout = new GridLayout(1);
		this.footerPart.setLayout(layout);

		this.createFooterLabel(this.footerPart);

	}

	private createFooterLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("All Right Reserved @2022");

		let element = label.getElement();
		element.css("font-size", "12px");
		element.css("text-align", "center");
		element.css("color", "#CCC");

		let layoutData = new GridData(true, true);
		label.setLayoutData(layoutData);

	}

	public getControl(): Control {
		return this.composite;
	}

}

export default ApplicationShell;