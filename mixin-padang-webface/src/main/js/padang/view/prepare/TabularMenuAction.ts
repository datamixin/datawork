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
import Action from "webface/action/Action";
import ViewAction from "padang/view/ViewAction";

import Conductor from "webface/wef/Conductor";

import GroupAction from "webface/action/GroupAction";
import CascadeAction from "webface/action/CascadeAction";

import FunctionPlan from "padang/plan/FunctionPlan";

import Interaction from "padang/interactions/Interaction";

import TabularInteractionRequest from "padang/requests/prepare/TabularInteractionRequest";
import TabularGuideDialogRequest from "padang/requests/prepare/TabularGuideDialogRequest";
import WebFontImage from "webface/graphics/WebFontImage";

export abstract class TabularMenuAction extends GroupAction {

	private conductor: Conductor = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
	}

	private getIcon(icon: string | FunctionPlan): string {
		let image = "mdi-blank";
		if (icon instanceof FunctionPlan) {
			image = icon.getImage();
		} else {
			image = <string>icon;
		}
		return image;
	}

	protected instantAction(text: string, icon: string | FunctionPlan, interaction: Interaction): ViewAction {
		let image = this.getIcon(icon);
		return this.viewAction(text, image, false, interaction);
	}

	protected dialogAction(text: string, icon: string | FunctionPlan, interaction: Interaction): ViewAction {
		let image = this.getIcon(icon);
		return this.viewAction(text, image, true, interaction);
	}

	protected cascadeAction(text: string, actions: ViewAction[], icon?: string): CascadeAction {
		return new SubmenuAction(text, actions, icon);
	}

	private viewAction(text: string, icon: string, prompt: boolean, interaction: Interaction): ViewAction {
		return new ViewAction(text, () => {
			if (prompt === true) {
				let request = new TabularGuideDialogRequest(interaction);
				this.conductor.submit(request);
			} else {
				let request = new TabularInteractionRequest(interaction);
				this.conductor.submit(request);
			}
		}, icon);
	}

}

class SubmenuAction extends CascadeAction {


	private actions: Action[] = [];
	private icon: string = null;

	constructor(text: string, actions: Action[], icon?: string) {
		super(text);
		this.actions = actions;
		this.icon = icon === undefined ? null : icon;
	}

	public getImage(): WebFontImage {
		if (this.icon !== null) {
			return new WebFontImage("mdi", this.icon);
		} else {
			return null;
		}
	}

	public getActions(): Action[] {
		return this.actions;
	}

}

export default TabularMenuAction;