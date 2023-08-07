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
import EList from "webface/model/EList";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import FormulaParser from "bekasi/FormulaParser";

import * as padang from "padang/directors";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import FormulaAssignableHandler from "padang/handlers/FormulaAssignableHandler";

import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

import * as directors from "malang/directors";

import XParameter from "malang/model/XParameter";

import ParameterCustomView from "malang/view/custom/ParameterCustomView";

import ParameterValueSetCommand from "malang/commands/ParameterValueSetCommand";

export default class ParameterCustomController extends EObjectController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new ParameterCommitHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		super.installRequestHandler(FormulaAssignableRequest.REQUEST_NAME, new ParameterAssignableHandler(this));
	}

	public createView(): ParameterCustomView {
		return new ParameterCustomView(this);
	}

	public getView(): ParameterCustomView {
		return <ParameterCustomView>super.getView();
	}

	public getModel(): XParameter {
		return <XParameter>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshType();
		this.refreshName();
		this.refreshValue();
	}

	private refreshType(): void {
		let model = this.getModel();
		let director = directors.getDesignPartDirector(this);
		let type = director.getParameterType(model);
		let view = this.getView();
		view.setType(type);
	}

	private refreshName(): void {
		let model = this.getModel();
		let director = directors.getDesignPartDirector(this);
		let label = director.getParameterLabel(model);
		let view = this.getView();
		view.setLabel(label);
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		view.setValue(value);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XParameter.FEATURE_VALUE) {
				this.refreshValue();
			}
		}
	}

}

class ParameterCommitHandler extends BaseHandler {

	public handle(request: FormulaCommitRequest, _callback: () => void): void {
		let value = request.getData(FormulaCommitRequest.FORMULA);
		let option = <XParameter>this.controller.getModel();
		let director = padang.getExpressionFormulaDirector(this.controller);
		let formula = director.getFormulaFromObjectOrString(value);
		let command = new ParameterValueSetCommand();
		command.setValue(formula);
		command.setParameter(option)
		this.controller.execute(command);
	}

}

class ParameterAssignableHandler extends FormulaAssignableHandler {

	constructor(controller: ParameterCustomController) {
		super(controller);
	}

	public getPreparationIndex(): number {
		return 0;
	}

	public getOperation(): string {
		throw new Error("Not implemented");
	}

	private getParameters(): EList<XParameter> {
		let model = <XParameter>this.controller.getModel();
		let director = directors.getDesignPartDirector(this.controller);
		return director.getOtherParameters(model);
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
				let formula = parameter.getValue();
				let parser = new FormulaParser();
				return parser.parse(formula);
			}
		}
		return null;
	}

}
