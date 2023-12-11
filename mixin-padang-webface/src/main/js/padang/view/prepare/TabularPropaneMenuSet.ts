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

import Conductor from "webface/wef/Conductor";

import ViewAction from "padang/view/ViewAction";

import Not from "padang/functions/logical/Not";
import IsNull from "padang/functions/logical/IsNull";
import IsError from "padang/functions/logical/IsError";

import Interaction from "padang/interactions/Interaction";
import InteractionFactory from "padang/interactions/InteractionFactory";

import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";

import TabularInteractionRequest from "padang/requests/prepare/TabularInteractionRequest";
import TabularGuideDialogRequest from "padang/requests/prepare/TabularGuideDialogRequest";

export default class TabularPropaneMenuSet extends PropaneMenuSet {

	private conductor: Conductor = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
	}

	private alias(column: string): string {
		return "$`" + column + "`";
	}

	public listNullActions(column: string): Action[] {
		let alias = this.alias(column);
		let list = new ActionList(this.conductor);
		let isNullPlan = IsNull.getPlan();
		let isNull = isNullPlan.getName();
		let notPlan = Not.getPlan();
		let not = notPlan.getName();
		list.selectRows("Keep", "mdi-check", false, "=foreach " + isNull + "(" + alias + ")");
		list.selectRows("Remove", "mdi-close", false, "=foreach " + not + "(" + isNull + "(" + alias + "))");
		return list.getActions();
	}

	public listErrorActions(column: string): Action[] {
		let alias = this.alias(column);
		let list = new ActionList(this.conductor);
		let isErrorPlan = IsError.getPlan();
		let isError = isErrorPlan.getName();
		let notPlan = Not.getPlan();
		let not = notPlan.getName();
		list.selectRows("Keep", "mdi-check", false, "=foreach " + isError + "(" + alias + ")");
		list.selectRows("Remove", "mdi-close", false, "=foreach " + not + "(" + isError + "(" + alias + "))");
		return list.getActions();
	}

	public listCategoryActions(column: string, category: string): Action[] {
		let alias = this.alias(column);
		let list = new ActionList(this.conductor);
		list.selectRows("Keep", "mdi-check", false, "=foreach " + alias + " == '" + category + "'");
		list.selectRows("Remove", "mdi-close", false, "=foreach " + alias + " != '" + category + "'");
		return list.getActions();
	}

	public hasHistogramActions(): boolean {
		return true;
	}

	public listStartActions(column: string, start: string, end: string): Action[] {
		let alias = this.alias(column);
		let list = new ActionList(this.conductor);
		list.selectRows("Keep Greater Then", "mdi-greater-than", false, "=foreach " + alias + " > " + start);
		list.selectRows("Keep Greater Then Or Equal", "mdi-greater-than-or-equal", false, "=foreach " + alias + " >= " + start);
		list.selectRows("Keep Less Then", "mdi-less-than", false, "=foreach " + alias + " < " + start);
		list.selectRows("Keep Less Then Or Equals", "mdi-less-than-or-equal", false, "=foreach " + alias + " <= " + start);
		if (end !== null) {
			list.selectRows("Keep Between Range", "mdi-set-center", false, "=foreach " + alias + " >= " + start + " && " + alias + " < " + end + "");
			list.selectRows("Remove Between Range", "mdi-set-left-right", false, "=foreach " + alias + " < " + start + " && " + alias + " >= " + end + "");
		}
		return list.getActions();
	}

	public listEndActions(column: string, start: string, end: string): Action[] {
		let alias = this.alias(column);
		let list = new ActionList(this.conductor);
		list.selectRows("Keep Less Then", "mdi-less-than", false, "=foreach " + alias + " < " + end);
		list.selectRows("Keep Less Then Or Equals", "mdi-less-than-or-equal", false, "=foreach " + alias + " <= " + end);
		list.selectRows("Keep Greater Then", "mdi-greater-than", false, "=foreach " + alias + " > " + end);
		list.selectRows("Keep Greater Then Or Equals", "mdi-greater-than-or-equal", false, "=foreach " + alias + " >= " + end);
		if (start !== null) {
			list.selectRows("Keep Between Range", "mdi-set-center", false, "=foreach " + alias + " >= " + start + " && " + alias + " < " + end + "");
			list.selectRows("Remove Between Range", "mdi-set-left-right", false, "=foreach " + alias + " < " + start + " && " + alias + " >= " + end + "");
		}
		return list.getActions();
	}

}

class ActionList {

	private actions: Action[] = [];
	private conductor: Conductor = null;
	private factory = InteractionFactory.getInstance();

	constructor(conductor: Conductor) {
		this.conductor = conductor;
	}

	public add(text: string, icon: string, prompt: boolean, interaction: Interaction): void {
		this.actions.push(new ViewAction(text, () => {
			if (prompt === true) {
				let request = new TabularGuideDialogRequest(interaction);
				this.conductor.submit(request);
			} else {
				let request = new TabularInteractionRequest(interaction);
				this.conductor.submit(request);
			}
		}, icon));
	}

	public selectRows(text: string, icon: string, prompt: boolean, condition: string): void {
		let interaction = this.factory.createSelectRows(condition);
		this.add(text, icon, prompt, interaction);
	}

	public getActions(): Action[] {
		return this.actions;
	}

}