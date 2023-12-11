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
import BaseContentAdapter from "webface/wef/base/BaseContentAdapter";

import * as bekasi from "bekasi/directors";

import XOutcome from "padang/model/XOutcome";
import XVariable from "padang/model/XVariable";

import * as directors from "padang/directors";

import Frontage from "padang/directors/frontages/Frontage";

import ControllerProperties from "padang/util/ControllerProperties";

import OutcomeToolsetView from "padang/view/toolset/OutcomeToolsetView";

import VariableFormulaSetCommand from "padang/commands/VariableFormulaSetCommand";

import FacetToolsetController from "padang/controller/toolset/FacetToolsetController";

import OutcomeCreateFigureRequest from "padang/requests/present/OutcomeCreateFigureRequest";
import OutcomeVariableFormulaEnhanceRequest from "padang/requests/present/OutcomeVariableFormulaEnhanceRequest";

export default class OutcomeToolsetController extends FacetToolsetController {

	private adapter = new VariableAdapter(this);

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(OutcomeCreateFigureRequest.REQUEST_NAME, new OutcomeCreateFigureHandler(this));
		super.installRequestHandler(OutcomeVariableFormulaEnhanceRequest.REQUEST_NAME, new OutcomeVariableFormulaEnhanceHandler(this));
	}

	public createView(): OutcomeToolsetView {
		return new OutcomeToolsetView(this);
	}

	public getModel(): XOutcome {
		return <XOutcome>super.getModel();
	}

	public getView(): OutcomeToolsetView {
		return <OutcomeToolsetView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshActions();
	}

	private refreshActions(): void {
		let model = this.getModel();
		let view = this.getView();
		let properties = new ControllerProperties(this, XOutcome.FEATURE_PROPERTIES);
		let multikeyProperties = properties.toMultikeyProperties();
		let director = directors.getOutcomePresentDirector(this);
		director.getValueFrontage(model, (frontage: Frontage) => {
			let actions = frontage.createToolsetActions(this, multikeyProperties);
			view.setActions(actions);
			this.relayout();
		});
	}

	protected refreshProperties(): void {
		this.refreshActions();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public getCustomAdapters(): BaseContentAdapter[] {
		return [this.adapter];
	}

}

class VariableAdapter extends BaseContentAdapter {

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		let controller = <OutcomeToolsetController>this.controller;
		let eventType = notification.getEventType();
		if (feature === XVariable.FEATURE_FORMULA) {
			if (eventType === Notification.SET) {
				controller.refreshVisuals();
			}
		}
	}

}

abstract class VariableHandler extends BaseHandler {

	protected getVariable(): XVariable {
		let controller = <OutcomeToolsetController>this.controller;
		let model = controller.getModel();
		return model.getVariable();
	}
}

class OutcomeCreateFigureHandler extends VariableHandler {

	public handle(request: OutcomeCreateFigureRequest, _callback: (data: any) => void): void {
		let renderer = request.getStringData(OutcomeCreateFigureRequest.RENDERER);
		let controller = <OutcomeToolsetController>this.controller;
		let variable = this.getVariable();
		let formula = variable.getFormula();
		let director = directors.getGraphicPresentDirector(controller);
		director.addGraphicCompose(this.controller, renderer, formula);
	}

}

class OutcomeVariableFormulaEnhanceHandler extends VariableHandler {

	public handle(request: OutcomeVariableFormulaEnhanceRequest, _callback: (data: any) => void): void {
		let addition = request.getStringData(OutcomeVariableFormulaEnhanceRequest.FORMULA);
		let controller = <OutcomeToolsetController>this.controller;
		let variable = this.getVariable();
		let formula = variable.getFormula();
		let director = directors.getLetAuxiliaryDirector(controller);
		let enhanced = director.enhanceFormulaWithFormula(formula, addition);
		let command = new VariableFormulaSetCommand();
		command.setVariable(variable);
		command.setFormula(enhanced);
		this.controller.execute(command);
	}

}
