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
import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";

import * as bekasi from "bekasi/directors";

import * as directors from "padang/directors";

import VariableField from "padang/model/VariableField";

import VariableFieldRemoveRequest from "padang/requests/anatomy/VariableFieldRemoveRequest";

import VariableFieldAnatomyView from "padang/view/anatomy/VariableFieldAnatomyView";

import ValueFieldAnatomyController from "padang/controller/anatomy/ValueFieldAnatomyController";

export default class VariableFieldAnatomyController extends ValueFieldAnatomyController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VariableFieldRemoveRequest.REQUEST_NAME, new VariableFieldRemoveHandler(this));
	}

	public createView(): VariableFieldAnatomyView {
		return new VariableFieldAnatomyView(this);
	}

	public getModel(): VariableField {
		return <VariableField>super.getModel();
	}

	public getView(): VariableFieldAnatomyView {
		return <VariableFieldAnatomyView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let variable = model.getVariable();
		let list = model.getList();
		return [variable, list];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshBrief();
		this.refreshBriefList();
	}

	private refreshBrief(): void {
		let model = this.getModel();
		let director = directors.getVariableFieldDirector(this);
		director.loadVariableBrief(model, () => {

		});
	}

	private refreshBriefList(): void {
		setTimeout(() => {
			let model = this.getModel();
			let director = directors.getVariableFieldDirector(this);
			director.loadValueFieldList(model, () => {
				if (this.isActive()) {
					this.relayout();
				}
			});
		}, 0);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public getName(): string {
		let model = this.getModel();
		let variable = model.getVariable();
		let name = variable.getName();
		return name;
	}

}

class VariableFieldRemoveHandler extends BaseHandler {

	public handle(_request: VariableFieldRemoveRequest, _callback: (data: any) => void): void {
		let model = <VariableField>this.controller.getModel()
		let variable = model.getVariable();
		let command = new RemoveCommand();
		command.setModel(variable);
		this.controller.execute(command);
	}

}
