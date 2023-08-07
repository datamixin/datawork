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
import * as wef from "webface/wef";

import * as util from "webface/model/util";
import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import EObjectController from "webface/wef/base/EObjectController";

import XValue from "sleman/model/XValue";
import { expressionFactory } from "sleman/ExpressionFactory";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import * as directors from "padang/directors";

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";

import Provision from "padang/provisions/Provision";

import DataForm from "padang/functions/source/DataForm";

import GenericInstoreView from "padang/view/instore/GenericInstoreView";
import DataFormInstoreView from "padang/view/instore/DataFormInstoreView";
import MutationInstoreView from "padang/view/instore/MutationInstoreView";

import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

import DataFormApplyRequest from "padang/requests/instore/DataFormApplyRequest";
import MutationProvisionRequest from "padang/requests/instore/MutationProvisionRequest";
import MutationTextParseRequest from "padang/requests/instore/MutationTextParseRequest";

export class MutationInstoreController extends EObjectController {

	public static RESULT_BORDER = "result-border";
	public static OPTION_LIST_MARGIN = "option-list-margin";

	private adapter = new MutationContentAdapter(this);

	constructor() {
		super();
		super.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(DataFormApplyRequest.REQUEST_NAME, new DataFormApplyHandler(this));
		super.installRequestHandler(BufferedProvisionRequest.REQUEST_NAME, new MutationProvisionHandler(this));
		super.installRequestHandler(MutationProvisionRequest.REQUEST_NAME, new MutationProvisionHandler(this));
		super.installRequestHandler(MutationTextParseRequest.REQUEST_NAME, new MutationTextParseHandler(this));
	}

	public getModel(): XMutation {
		return <XMutation>super.getModel();
	}

	public getView(): MutationInstoreView {
		return <MutationInstoreView>super.getView();
	}

	public createView(): MutationInstoreView {
		let model = this.getModel();
		let operation = model.getOperation();
		if (operation === DataForm.FUNCTION_NAME) {
			return new DataFormInstoreView(this);
		} else {
			let viewer = this.getViewer();
			let border = <boolean>viewer.getProperty(MutationInstoreController.RESULT_BORDER);
			let margin = <number>viewer.getProperty(MutationInstoreController.OPTION_LIST_MARGIN);
			return new GenericInstoreView(this, margin, border);
		}
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let operation = model.getOperation();
		if (operation === DataForm.FUNCTION_NAME) {
			return [];
		} else {

			// Hanya kembalikan options yang ada plan-nya saja 
			let options = model.getOptions();
			let removed: XOption[] = [];
			for (let option of options) {
				let director = directors.getOptionFormulaDirector(this);
				let plan = director.getParameterPlan(option);
				if (plan === null) {
					removed.push(option);
				}
			}
			for (let remove of removed) {
				options.remove(remove);
			}
			return [options];
		}
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshContent();
	}

	public refreshContent(): void {
		let view = this.getView();
		view.refresh();
	}

}

export default MutationInstoreController;

class MutationContentAdapter extends ContentAdapter {

	private controller: MutationInstoreController = null;

	constructor(controller: MutationInstoreController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(_notification: Notification) {
		let view = this.controller.getView();
		if (view instanceof GenericInstoreView) {
			this.controller.refreshContent();
		}
	}

}

class MutationProvisionHandler extends BaseHandler {

	public handle(request: BufferedProvisionRequest, callback: (data: any) => void): void {
		let provision = <Provision>request.getData(BufferedProvisionRequest.PROVISION);
		let director = directors.getProvisionResultDirector(this.controller);
		director.inspect(this.controller, provision, callback);
	}

}

class MutationTextParseHandler extends BaseHandler {

	public handle(request: MutationTextParseRequest, callback: () => void): void {
		let text = request.getStringData(MutationTextParseRequest.TEXT);
		let director = directors.getOptionFormulaDirector(this.controller);
		director.evaluateValue(text, callback);
	}

}

class DataFormApplyHandler extends BaseHandler {

	public handle(request: DataFormApplyRequest, callback: () => void): void {

		let data = <any>request.getData(DataFormApplyRequest.DATA);
		let types = <any>request.getData(DataFormApplyRequest.TYPES);

		let director = wef.getSynchronizationDirector(this.controller)
		director.onCommit(callback);

		let model = <XMutation>this.controller.getModel();
		let copy = <XMutation>util.copy(model);
		this.setParameter(copy, 0, data);
		this.setParameter(copy, 1, types);

		let command = new ReplaceCommand();
		command.setModel(model);
		command.setReplacement(copy);
		this.controller.execute(command);
	}

	private setParameter(mutation: XMutation, index: number, value: any): void {
		let expression = <XValue>expressionFactory.createValue(value);
		let director = directors.getExpressionFormulaDirector(this.controller);
		let formula = director.getFormula(expression);
		let parameters = mutation.getOptions();
		let parameter = parameters.get(index);
		parameter.setFormula(formula);
	}

}
