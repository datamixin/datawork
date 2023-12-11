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

import Event from "webface/widgets/Event";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontImage from "webface/graphics/WebFontImage";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

export default class ButtonMenuPanel {

	private static MENU_WIDTH = 32;

	private composite: Composite = null;
	private button: Button = null;
	private text: string = null;
	private icon: string = null;
	private menu: Button = null;
	private mainClass: string = null;
	private buttonClass: string = null;
	private callback: () => void = () => { };
	private actions: Action[] = [];

	constructor(text: string, icon: string, mainClass: string, buttonClass?: string) {
		this.text = text;
		this.icon = icon;
		this.mainClass = mainClass;
		this.buttonClass = buttonClass === undefined ? null : buttonClass;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-button-menu-panel");

		let layout = new GridLayout(2, 0, 0, 1, 0);
		this.composite.setLayout(layout);

		this.createButton(this.composite);
		this.createMenu(this.composite);
	}

	private createButton(parent: Composite): void {

		this.button = new Button(parent);
		this.button.setText(this.text);

		let element = this.button.getElement();
		element.addClass(this.mainClass);
		if (this.buttonClass !== undefined) {
			element.addClass(this.buttonClass);
		}
		element.removeClass("btn-default");
		element.css("border-top-right-radius", "0");
		element.css("border-bottom-right-radius", "0");
		element.css("line-height", "16px")

		let image = new WebFontImage("mdi", this.icon);
		let imageElement = this.button.prependImage(image);
		imageElement.css("font-size", "24px");

		let layoutData = new GridData(true, true);
		this.button.setLayoutData(layoutData);

		this.button.onSelection(() => {
			this.callback();
		});
	}

	private createMenu(parent: Composite): void {

		this.menu = new Button(parent);

		let element = this.menu.getElement();
		element.addClass(this.mainClass);
		element.removeClass("btn-default");
		element.css("border-top-left-radius", "0");
		element.css("border-bottom-left-radius", "0");
		element.css("padding-left", "3px");
		element.css("line-height", "16px")

		let image = new WebFontImage("mdi", "mdi-menu-down");
		let imageElement = this.menu.prependImage(image);
		imageElement.css("font-size", "24px");

		let layoutData = new GridData(ButtonMenuPanel.MENU_WIDTH, true);
		this.menu.setLayoutData(layoutData);

		this.menu.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				let action = new ButtonMenuPopupAction(this.actions);
				action.open(event);
			}
		});
	}

	public onButtonSelection(callback: () => void): void {
		this.callback = callback;
	}

	public setMenuActions(actions: Action[]): void {
		this.actions = actions;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class ButtonMenuPopupAction extends PopupAction {

	private actions: Action[] = [];

	constructor(actions: Action[]) {
		super();
		this.actions = actions;
	}

	public getActions(): Action[] {
		return this.actions;
	}

}
