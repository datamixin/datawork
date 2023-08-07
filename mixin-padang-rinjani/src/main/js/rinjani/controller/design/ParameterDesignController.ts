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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import FormulaParser from "bekasi/FormulaParser";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

import XParameter from "rinjani/model/XParameter";

import * as directors from "rinjani/directors";

import ParameterDesignView from "rinjani/view/design/ParameterDesignView";

import ParameterValueSetCommand from "rinjani/commands/ParameterValueSetCommand";

export default class ParameterDesignController extends EObjectController {

	private optioned: boolean = false;

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new ParameterCommitHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new ParameterAssignableHandler(this));
		super.installRequestHandler(FormulaAssignableRequest.REQUEST_NAME, new ParameterAssignableHandler(this));
	}

	public createView(): ParameterDesignView {
		return new ParameterDesignView(this);
	}

	public getView(): ParameterDesignView {
		return <ParameterDesignView>super.getView();
	}

	public getModel(): XParameter {
		return <XParameter>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		if (this.optioned === false) {
			this.refreshType();
			this.refreshOption();
			this.optioned = true;
		}
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

	private refreshOption(): void {
		let model = this.getModel();
		let director = directors.getDesignPartDirector(this);
		let assignable = director.getParameterAssignable(model);
		let view = this.getView();
		view.setAssignable(assignable);
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		name = name[0].toUpperCase() + name.substring(1);
		view.setName(name);
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		view.setValue(value);
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XParameter.FEATURE_VALUE) {
			this.refreshValue();
		}
	}

}

class ParameterCommitHandler extends BaseHandler {

	public handle(request: FormulaCommitRequest, _callback: () => void): void {
		let value = request.getData(FormulaCommitRequest.FORMULA);
		let parameter = <XParameter>this.controller.getModel();
		let command = new ParameterValueSetCommand();
		command.setValue(value);
		command.setParameter(parameter)
		this.controller.execute(command);
	}

}

class ParameterAssignableHandler extends BaseHandler {

	public handle(request: FormulaAssignableRequest, callback: (value: any) => void): void {
		let assignable = request.getStringData(FormulaAssignableRequest.ASSIGNABLE);
		let parser = new FormulaParser();
		let expression = parser.parse(assignable);
		let factory = ExpressionEvaluatorFactory.getInstance();
		let evaluator = factory.create(expression);
		let result = evaluator.evaluate();
		callback(result);
	}

}