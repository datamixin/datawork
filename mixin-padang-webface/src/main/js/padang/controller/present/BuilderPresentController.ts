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

import XExpression from "sleman/model/XExpression";

import XBuilder from "padang/model/XBuilder";

import VisageValue from "bekasi/visage/VisageValue";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueMapping from "padang/util/ValueMapping";

import BuilderPresentView from "padang/view/present/BuilderPresentView";

import BuilderTryoutPanelRequest from "padang/requests/present/BuilderTryoutPanelRequest";
import BuilderComposerOpenRequest from "padang/requests/present/BuilderComposerOpenRequest";

export default class BuilderPresentController extends EObjectController {

	private mapping = new ValueMapping();

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(BuilderTryoutPanelRequest.REQUEST_NAME, new BuilderTryoutPanelHandler(this));
		super.installRequestHandler(BuilderComposerOpenRequest.REQUEST_NAME, new BuilderComposerOpenHandler(this));
	}

	public createView(): BuilderPresentView {
		return new BuilderPresentView(this);
	}

	public getModel(): XBuilder {
		return <XBuilder>super.getModel();
	}

	public getView(): BuilderPresentView {
		return <BuilderPresentView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshExplanation();
	}

	public refreshComplete(): void {
		this.refreshVariables(() => {
			this.refreshExplanation();
		});
	}

	public refreshVariables(callback: () => void): void {
		let counter: number = 0;
		let model = this.getModel();
		let variables = model.getVariables();
		for (let variable of variables) {
			let director = directors.getProjectComposerDirector(this);
			director.inspectValue(variable, padang.INSPECT_COMPUTE, [], () => {
				counter++;
				if (counter === variables.size) {
					callback();
				}
			});
		}
	}

	private getExpression(formula: string): XExpression {
		let director = directors.getExpressionFormulaDirector(this);
		return director.parseFormula(formula);
	}

	private inspectValue(expression: XExpression, callback: (value: VisageValue) => void): void {
		let model = this.getModel();
		let director = directors.getProjectComposerDirector(this);
		director.inspectValue(model, padang.INSPECT_EVALUATE, [expression], callback);
	}

	private refreshExplanation(): void {

		let model = this.getModel();
		let explanation = model.getExplanation();
		this.mapping.setFormula(padang.EXPLANATION, explanation);

		let expression = this.getExpression(explanation);
		this.inspectValue(expression, (result: VisageValue) => {

			let active = this.isActive();
			if (active === false) {
				return;
			}

			this.mapping.setValue(padang.EXPLANATION, result);
			this.refreshPanel();
		});

	}

	private refreshPanel(): void {
		let director = directors.getBuilderPresentDirector(this);
		let panel = director.createPresentPanel(this);
		let view = this.getView();
		view.setStructurePanel(panel);
	}

	public getMapping(): ValueMapping {
		return this.mapping;
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
		let feature = notification.getFeature();
		let eventType = notification.getEventType();
		if (feature === XBuilder.FEATURE_EXPLANATION) {
			if (eventType === Notification.SET) {
				this.refreshExplanation();
			}
		}
	}

}

class BuilderComposerOpenHandler extends BaseHandler {

	public handle(_request: BuilderComposerOpenRequest, _callback: (data: any) => void): void {
		let controller = <BuilderPresentController>this.controller;
		let builder = controller.getModel();
		let mapping = controller.getMapping();
		let director = directors.getBuilderPresentDirector(this.controller);
		director.openBuilderComposer(builder, mapping, (_ok: boolean) => {
		});
	}

}

class BuilderTryoutPanelHandler extends BaseHandler {

	public handle(_request: BuilderTryoutPanelRequest, callback: (data: any) => void): void {
		let controller = <BuilderPresentController>this.controller;
		let director = directors.getBuilderPresentDirector(this.controller);
		let panel = director.createTryoutPanel(controller);
		callback(panel);
	}

}
