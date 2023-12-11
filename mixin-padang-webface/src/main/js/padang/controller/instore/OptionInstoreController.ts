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
import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import AssignedPlan from "webface/plan/AssignedPlan";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import FormulaParser from "bekasi/FormulaParser";

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";

import * as directors from "padang/directors";

import ParameterPlan from "padang/plan/ParameterPlan";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import CredentialRemoveRequest from "padang/requests/CredentialRemoveRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import CredentialNameListRequest from "padang/requests/CredentialNameListRequest";
import CredentialOptionsSaveRequest from "padang/requests/CredentialOptionsSaveRequest";
import CredentialOptionsLoadRequest from "padang/requests/CredentialOptionsLoadRequest";


import OptionInstoreView from "padang/view/instore/OptionInstoreView";

import OptionFormulaSetCommand from "padang/commands/OptionFormulaSetCommand";

import CredentialRemoveHandler from "padang/handlers/CredentialRemoveHandler";
import FormulaAssignableHandler from "padang/handlers/FormulaAssignableHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import CredentialNameListHandler from "padang/handlers/CredentialNameListHandler";
import CredentialOptionsSaveHandler from "padang/handlers/CredentialOptionsSaveHandler";
import CredentialOptionsLoadHandler from "padang/handlers/CredentialOptionsLoadHandler";

export default class OptionInstoreController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new OptionCommitHandler(this));
		super.installRequestHandler(CredentialRemoveRequest.REQUEST_NAME, new CredentialRemoveHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		super.installRequestHandler(FormulaAssignableRequest.REQUEST_NAME, new OptionAssignableHandler(this));
		super.installRequestHandler(CredentialNameListRequest.REQUEST_NAME, new CredentialNameListHandler(this));
		super.installRequestHandler(CredentialOptionsSaveRequest.REQUEST_NAME, new CredentialOptionsSaveHandler(this));
		super.installRequestHandler(CredentialOptionsLoadRequest.REQUEST_NAME, new CredentialOptionsLoadHandler(this));
	}

	public createView(): OptionInstoreView {
		return new OptionInstoreView(this);
	}

	public getModel(): XOption {
		return <XOption>super.getModel();
	}

	public getView(): OptionInstoreView {
		return <OptionInstoreView>super.getView();
	}

	public refreshVisuals(): void {
		this.refreshPlan();
		this.refreshType();
		this.refreshFormula();
		this.refreshAssignable();
	}

	private getParameterPlan(): ParameterPlan {
		let model = this.getModel();
		let director = directors.getOptionFormulaDirector(this);
		return director.getParameterPlan(model);
	}

	private getAssignedPlan(): AssignedPlan {
		let parameterPlan = this.getParameterPlan();
		let assignedPlan = parameterPlan.getAssignedPlan();
		return assignedPlan;
	}

	private refreshPlan(): void {
		let plan = this.getParameterPlan();
		let view = this.getView();
		let label = plan.getLabel();
		let description = plan.getDescription();
		view.setLabel(label);
		view.setDescription(description);
	}

	private refreshType(): void {
		let plan = this.getAssignedPlan();
		let leanName = plan.xLeanName();
		let view = this.getView();
		view.setType(leanName);
	}

	private refreshFormula(): void {
		let model = this.getModel()
		let view = this.getView();
		let formula = model.getFormula();
		view.setFormula(formula);
	}

	private refreshAssignable(): void {
		let plan = this.getAssignedPlan();
		let assignable = plan.getAssignable();
		let view = this.getView();
		view.setAssignable(assignable);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XOption.FEATURE_FORMULA) {
				this.refreshFormula();
			}
		}
	}

}

class OptionCommitHandler extends BaseHandler {

	public handle(request: FormulaCommitRequest, _callback: () => void): void {
		let value = request.getData(FormulaCommitRequest.FORMULA);
		let option = <XOption>this.controller.getModel();
		let director = directors.getExpressionFormulaDirector(this.controller);
		let formula = director.getFormulaFromObjectOrString(value);
		let command = new OptionFormulaSetCommand();
		command.setFormula(formula);
		command.setOption(option)
		this.controller.execute(command);
	}

}

class OptionAssignableHandler extends FormulaAssignableHandler {

	constructor(controller: OptionInstoreController) {
		super(controller);
	}

	public getPreparationIndex(): number {
		return 0;
	}

	private getParameters(): EList<XOption> {
		let model = <XOption>this.controller.getModel();
		let mutation = <XMutation>model.eContainer();
		return mutation.getOptions();
	}

	public getOperation(): string {
		let model = <XOption>this.controller.getModel();
		let mutation = <XMutation>model.eContainer();
		return mutation.getOperation();
	}

	public hasOption(name: string): boolean {
		let parameters = this.getParameters();
		for (let parameter of parameters) {
			if (parameter.getName() === name) {
				return true;
			}
		}
		return false;
	}

	public getOption(name: string): any {
		let parameters = this.getParameters();
		for (let parameter of parameters) {
			if (parameter.getName() === name) {
				let formula = parameter.getFormula();
				let parser = new FormulaParser();
				return parser.parse(formula);
			}
		}
		return null;
	}

}
