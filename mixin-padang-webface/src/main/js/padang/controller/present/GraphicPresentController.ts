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

import EObjectController from "webface/wef/base/EObjectController";

import XExpression from "sleman/model/XExpression";

import XGraphic from "padang/model/XGraphic";

import VisageValue from "bekasi/visage/VisageValue";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueMapping from "padang/util/ValueMapping";

import GraphicPresentView from "padang/view/present/GraphicPresentView";

export default class GraphicPresentController extends EObjectController {

	private mapping = new ValueMapping();

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): GraphicPresentView {
		return new GraphicPresentView(this);
	}

	public getModel(): XGraphic {
		return <XGraphic>super.getModel();
	}

	public getView(): GraphicPresentView {
		return <GraphicPresentView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshEvaluates();
	}

	public refreshComplete(): void {
		this.refreshVariables(() => {
			this.refreshEvaluates();
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

	public refreshEvaluates(): void {
		let counter: number = 0;
		let model = this.getModel();
		let evaluates = model.getEvaluates();
		if (evaluates.size() === 0) {
			this.refreshFormation();
		} else {
			for (let key of evaluates.keySet()) {
				let formula = evaluates.get(key);
				this.mapping.setFormula(key, formula);
				if (key.startsWith(padang.CLIENT)) {
					let director = directors.getOptionFormulaDirector(this);
					director.evaluateValue(formula, (value: VisageValue) => {
						this.mapping.setValue(key, value);
						counter++;
						if (counter === evaluates.size()) {
							this.refreshFormation();
						}
					});
				} else if (key.startsWith(padang.SERVER)) {
					let expression = this.getExpression(formula);
					this.inspectValue(expression, (value: VisageValue) => {
						this.mapping.setValue(key, value);
						counter++;
						if (counter === evaluates.size()) {
							this.refreshFormation();
						}
					});
				}
			}
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

	private refreshFormation(): void {

		let model = this.getModel();
		let formation = model.getFormation();
		this.mapping.setFormula(padang.FORMATION, formation);

		let expression = this.getExpression(formation);
		this.inspectValue(expression, (result: VisageValue) => {

			let active = this.isActive();
			if (active === false) {
				return;
			}

			this.mapping.setValue(padang.FORMATION, result);
			this.refreshPanel();
		});

	}

	private refreshPanel(): void {
		let director = directors.getGraphicPresentDirector(this);
		let panel = director.createPresentPanel(this, this.mapping);
		let view = this.getView();
		view.setRendererPanel(panel);
	}

	public getMapping(): ValueMapping {
		return this.mapping;
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
		let feature = notification.getFeature();
		let eventType = notification.getEventType();
		if (feature === XGraphic.FEATURE_FORMATION) {
			if (eventType === Notification.SET) {
				this.refreshEvaluates();
			}
		}
	}

}
