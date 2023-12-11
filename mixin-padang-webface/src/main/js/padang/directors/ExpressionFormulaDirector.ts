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
export let EXPRESSION_FORMULA_DIRECTOR = "expression-formula-director";

import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XExpression from "sleman/model/XExpression";

import VisageValue from "bekasi/visage/VisageValue";

export interface ExpressionFormulaDirector {

	parseFormula(formula: string): XExpression;

	formatFormula(formula: string): string;

	getFormula(value: XExpression): string;

	getFormulaFromObject(object: any): string;

	getFormulaFromObjectOrString(object: any | string): string;

	validateName(name: string): string;

	evaluateFormula(model: EObject, formula: string, callback: (result: VisageValue) => void): void;

}

export function getExpressionFormulaDirector(host: Controller | PartViewer): ExpressionFormulaDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ExpressionFormulaDirector>viewer.getDirector(EXPRESSION_FORMULA_DIRECTOR);
}

export default ExpressionFormulaDirector;

