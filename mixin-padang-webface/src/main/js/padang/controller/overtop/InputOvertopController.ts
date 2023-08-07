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
import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";
import BaseSelectionHandler from "webface/wef/base/BaseSelectionHandler";

import XInput from "padang/model/XInput";
import XDataset from "padang/model/XDataset";
import PadangInspector from "padang/model/PadangInspector";

import * as directors from "padang/directors";

import InputOvertopView from "padang/view/overtop/InputOvertopView";

import InputNameSetCommand from "padang/commands/InputNameSetCommand";
import InputValueSetCommand from "padang/commands/InputValueSetCommand";

import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import InputSelectRequest from "padang/requests/overtop/InputSelectRequest";
import InputRemoveRequest from "padang/requests/overtop/InputRemoveRequest";
import InputNameSetRequest from "padang/requests/overtop/InputNameSetRequest";
import InputNameValidationRequest from "padang/requests/overtop/InputNameValidationRequest";

import InputRemoveHandler from "padang/handlers/overtop/InputRemoveHandler";

import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

export default class InputOvertopController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaCommitRequest.REQUEST_NAME, new InputCommitHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));

		super.installRequestHandler(InputRemoveRequest.REQUEST_NAME, new InputRemoveHandler(this));
		super.installRequestHandler(InputSelectRequest.REQUEST_NAME, new BaseSelectionHandler(this));
		super.installRequestHandler(InputNameSetRequest.REQUEST_NAME, new InputNameSetHandler(this));
		super.installRequestHandler(InputNameValidationRequest.REQUEST_NAME, new InputNameValidationHandler(this));
	}

	public getModel(): XInput {
		return <XInput>super.getModel();
	}

	public createView(): InputOvertopView {
		return new InputOvertopView(this);
	}

	public getView(): InputOvertopView {
		return <InputOvertopView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshValue();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		view.setValue(value);
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);

		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {

			let feature = notification.getFeature();
			if (feature === XInput.FEATURE_NAME) {

				this.refreshName();

			} else if (feature === XInput.FEATURE_VALUE) {

				this.refreshValue();
				let director = directors.getDatasetPresentDirector(this);
				let model = this.getModel();
				let dataset = <XDataset>util.getAncestor(model, XDataset);
				director.computeResult(dataset);

			}
		}
	}

}

class InputNameSetHandler extends BaseHandler {

	public handle(request: InputNameSetRequest, callback: (data: any) => void): void {
		let input = <XInput>this.controller.getModel();
		let name = request.getStringData(InputNameSetRequest.NAME);
		let command = new InputNameSetCommand();
		command.setInput(input);
		command.setName(name)
		this.controller.execute(command);
	}

}

class InputNameValidationHandler extends BaseHandler {

	public handle(request: InputNameValidationRequest, callback: (data: any) => void): void {
		let name = request.getStringData(InputNameValidationRequest.NAME);
		let parent = this.controller.getParent();
		let list = <EList<XInput>>parent.getModel();
		let inspector = PadangInspector.eINSTANCE;
		let names = inspector.getInputNames(list);
		if (names.indexOf(name) !== -1) {
			callback("Input name '" + name + "' already exists");
		} else {
			let director = directors.getExpressionFormulaDirector(this.controller);
			let message = director.validateName(name);
			callback(message);
		}
	}

}

class InputCommitHandler extends BaseHandler {

	public handle(request: FormulaCommitRequest, callback: (data: any) => void): void {
		let input = <XInput>this.controller.getModel();
		let value = request.getStringData(FormulaCommitRequest.FORMULA);
		let director = directors.getExpressionFormulaDirector(this.controller);
		let formula = director.getFormulaFromObjectOrString(value);
		let command = new InputValueSetCommand();
		command.setValue(formula);
		command.setInput(input)
		this.controller.execute(command);
	}

}

