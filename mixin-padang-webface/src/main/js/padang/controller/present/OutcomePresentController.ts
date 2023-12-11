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
import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import BaseContentAdapter from "webface/wef/base/BaseContentAdapter";

import XOutcome from "padang/model/XOutcome";
import XViewset from "padang/model/XViewset";
import XVariable from "padang/model/XVariable";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import Provision from "padang/provisions/Provision";

import FrontagePanel from "padang/view/present/FrontagePanel";
import OutcomePresentView from "padang/view/present/OutcomePresentView";

import ControllerProperties from "padang/util/ControllerProperties";

import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

import FormulaFormatHandler from "padang/handlers/FormulaFormatHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

import VariableNameSetCommand from "padang/commands/VariableNameSetCommand";
import VariableFormulaSetCommand from "padang/commands/VariableFormulaSetCommand";

import FacetPresentController from "padang/controller/present/FacetPresentController";

import OutcomeVariableRefreshRequest from "padang/requests/present/OutcomeVariableRefreshRequest";
import OutcomeVariableNameSetRequest from "padang/requests/present/OutcomeVariableNameSetRequest";
import OutcomeVariableFormulaSetRequest from "padang/requests/present/OutcomeVariableFormulaSetRequest";
import OutcomeVariableNameValidationRequest from "padang/requests/present/OutcomeVariableNameValidationRequest";

import OutcomeCreateFromFieldRequest from "padang/requests/present/OutcomeCreateFromFieldRequest";

export default class OutcomePresentController extends FacetPresentController {

	private adapter = new VariableAdapter(this);

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		super.installRequestHandler(FormulaFormatRequest.REQUEST_NAME, new FormulaFormatHandler(this));
		super.installRequestHandler(BufferedProvisionRequest.REQUEST_NAME, new OutcomeProvisionHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));

		super.installRequestHandler(OutcomeVariableRefreshRequest.REQUEST_NAME, new OutcomeVariableRefreshHandler(this));
		super.installRequestHandler(OutcomeVariableNameSetRequest.REQUEST_NAME, new OutcomeVariableNameSetHandler(this));
		super.installRequestHandler(OutcomeVariableFormulaSetRequest.REQUEST_NAME, new OutcomeVariableFormulaSetHandler(this));
		super.installRequestHandler(OutcomeVariableNameValidationRequest.REQUEST_NAME, new OutcomeVariableNameValidationHandler(this));

		super.installRequestHandler(OutcomeCreateFromFieldRequest.REQUEST_NAME, new OutcomeCreateFromFieldHandler(this));

	}

	public createView(): OutcomePresentView {
		return new OutcomePresentView(this);
	}

	public getModel(): XOutcome {
		return <XOutcome>super.getModel();
	}

	public getView(): OutcomePresentView {
		return <OutcomePresentView>super.getView();
	}

	public getVariable(): XVariable {
		let model = this.getModel();
		return model.getVariable();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshFormula();
		this.refreshResult();
	}

	public refreshName(): void {
		let variable = this.getVariable();
		let name = variable.getName();
		let view = this.getView();
		view.setName(name);
	}

	public refreshFormula(): void {
		let variable = this.getVariable();
		let formula = variable.getFormula();
		let view = this.getView();
		view.setFormula(formula);
	}

	public refreshProgress(state: boolean): void {
		let view = this.getView();
		view.setProgress(state);
	}

	public refreshResult(): void {

		let director = directors.getOutcomePresentDirector(this);
		director.createPresentPanel(this, (type: string, panel: FrontagePanel) => {

			let active = this.isActive();
			if (active === false) {
				return;
			}

			let view = this.getView();
			view.setType(type);
			view.setFrontagePanel(panel);
			this.refreshProperties();

		});
	}

	private refreshProperties(): void {
		let model = this.getModel();
		let map = model.getProperties();
		let keySet = map.keySet();
		for (let key of keySet) {
			let keys = ControllerProperties.createKeys(key);
			this.refreshProperty(keys);
		}
	}

	protected refreshProperty(keys: string[]): void {
		let model = this.getModel();
		let map = model.getProperties();
		let properties = new ControllerProperties(this, map);
		let value = properties.getProperty(keys);
		let view = this.getView();
		view.setProperty(keys, value);
	}

	public getCustomAdapters(): BaseContentAdapter[] {
		return [this.adapter];
	}

}

class VariableAdapter extends BaseContentAdapter {

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		let controller = <OutcomePresentController>this.controller;
		let eventType = notification.getEventType();
		if (feature === XVariable.FEATURE_FORMULA) {
			if (eventType === Notification.SET) {
				controller.refreshFormula();
				controller.refreshResult();
			}
		} else if (feature === XVariable.FEATURE_NAME) {
			if (eventType === Notification.SET) {
				controller.refreshName();
			}
		}
	}

}

class OutcomeVariableRefreshHandler extends BaseHandler {

	public handle(_request: OutcomeVariableRefreshRequest, _callback: (data: any) => void): void {
		let controller = <OutcomePresentController>this.controller;
		controller.refreshProgress(true);
		let director = directors.getOutcomePresentDirector(this.controller);
		director.computeResult(controller, () => {
			controller.refreshResult();
			controller.refreshProgress(false);
		});
	}

}

abstract class VariableHandler extends BaseHandler {

	protected getVariable(): XVariable {
		let controller = <OutcomePresentController>this.controller;
		let model = controller.getModel();
		return model.getVariable();
	}

}

class OutcomeVariableNameSetHandler extends VariableHandler {

	public handle(request: OutcomeVariableNameSetRequest, _callback: (data: any) => void): void {
		let name = request.getStringData(OutcomeVariableNameSetRequest.NAME);
		let variable = this.getVariable();
		let command = new VariableNameSetCommand();
		command.setVariable(variable);
		command.setName(name)
		this.controller.execute(command);
	}

}

class OutcomeVariableFormulaSetHandler extends VariableHandler {

	public handle(request: OutcomeVariableFormulaSetRequest, _callback: (data: any) => void): void {
		let formula = request.getStringData(OutcomeVariableFormulaSetRequest.FORMULA);
		let variable = this.getVariable();
		let command = new VariableFormulaSetCommand();
		command.setVariable(variable);
		command.setFormula(formula)
		this.controller.execute(command);
	}

}

class OutcomeVariableNameValidationHandler extends BaseHandler {

	public handle(request: OutcomeVariableNameValidationRequest, callback: (data: any) => void): void {
		let name = request.getStringData(OutcomeVariableNameValidationRequest.NAME);
		let director = directors.getViewsetPresentDirector(this.controller);
		director.validateOutletName(name, callback);
	}

}

class OutcomeProvisionHandler extends BaseHandler {

	public handle(request: BufferedProvisionRequest, callback: (data: any) => void): void {
		let provision = <Provision>request.getData(BufferedProvisionRequest.PROVISION);
		let director = directors.getProvisionResultDirector(this.controller);
		director.inspect(this.controller, provision, callback);
	}

}

abstract class AddOutcomeCellHandler extends BaseHandler {

	public addOutcomeCell(formula: string, name: string): void {

		let director = directors.getViewsetPresentDirector(this.controller);
		let mixture = director.getFocusedMixture();
		let viewset = <XViewset>util.getAncestor(mixture, XViewset);

		let creator = PadangCreator.eINSTANCE;
		let newCell = creator.createOutcomeCell(viewset, formula, name);

		let command = director.createCellAddCommand(mixture, newCell);
		this.controller.execute(command);

	}

}

class OutcomeCreateFromFieldHandler extends AddOutcomeCellHandler {

	public handle(request: OutcomeCreateFromFieldRequest, _callback: (data: any) => void): void {
		let key = request.getStringData(OutcomeCreateFromFieldRequest.KEY);
		let controller = <OutcomePresentController>this.controller;
		let variable = controller.getVariable();
		let formula = variable.getFormula();
		let director = directors.getLetAuxiliaryDirector(controller);
		let augmented = director.augmentFormulaWithField(formula, key);
		this.addOutcomeCell(augmented, key);
	}

}
