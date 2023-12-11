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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import FormulaParser from "bekasi/FormulaParser";

import * as padang from "padang/directors";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

import * as directors from "rinjani/directors";

import XParameter from "rinjani/model/XParameter";

import ParameterCustomView from "rinjani/view/custom/ParameterCustomView";

import ParameterValueSetCommand from "rinjani/commands/ParameterValueSetCommand";

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

class ParameterAssignableHandler extends BaseHandler {

	public handle(request: FormulaAssignableRequest, callback: (assignable: any) => void): void {
		let assignable = request.getStringData(FormulaAssignableRequest.ASSIGNABLE);
		let parser = new FormulaParser();
		let expression = parser.parse(assignable);
		let factory = ExpressionEvaluatorFactory.getInstance();
		let evaluator = factory.create(expression);
		let value = evaluator.evaluate();
		callback(value);
	}

}
