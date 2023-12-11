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
import EObject from "webface/model/EObject";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import FormulaParser from "bekasi/FormulaParser";

import VisageValue from "bekasi/visage/VisageValue";

import XValue from "sleman/model/XValue";
import XExpression from "sleman/model/XExpression";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import { expressionFactory } from "sleman/ExpressionFactory";

import ExpressionFormula from "padang/directors/ExpressionFormula";
import ExpressionFormulaDirector from "padang/directors/ExpressionFormulaDirector";

export default class BaseExpressionFormulaDirector implements ExpressionFormulaDirector {

	private viewer: BasePartViewer = null;
	private formula = new ExpressionFormula();

	constructor(viewer: BasePartViewer) {
		this.viewer = viewer;
	}

	public parseFormula(formula: string): XExpression {
		let parser = new FormulaParser();
		return parser.parse(formula);
	}

	public formatFormula(formula: string): string {
		let expression = this.parseFormula(formula);
		return expression.toLiteral(0);
	}

	public getFormula(value: XValue): string {
		return this.formula.getFormula(value);
	}

	public getFormulaFromObject(object: any): string {
		let value = <XValue>expressionFactory.createValue(object);
		return this.getFormula(value);
	}

	public getFormulaFromObjectOrString(formula: any | string): string {
		if (typeof (formula) !== "string") {
			let value = <XValue>expressionFactory.createValue(formula);
			return this.getFormula(value);
		}
		return formula;
	}

	public validateName(name: string): string {
		let regex = /^[\w\_\ ]+$/;
		if (regex.test(name) === false) {
			return "Invalid name '" + name + "', only special character '_' and ' ' allowed";
		} else {
			return null;
		}
	}

	public evaluateFormula(model: EObject, formula: string, callback: (result: VisageValue) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		let expression = this.parseFormula(formula);
		director.inspectValue(model, padang.INSPECT_EVALUATE, [expression], callback);
	}

}