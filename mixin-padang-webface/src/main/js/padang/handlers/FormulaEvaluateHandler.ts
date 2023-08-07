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
import EObject from "webface/model/EObject";

import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "padang/directors";

import FormulaEvaluateRequest from "padang/requests/FormulaEvaluateRequest";

export default class FormulaEvaluateHandler extends BaseHandler {

	public handle(request: FormulaEvaluateRequest, callback: (data: any) => void): void {
		let model = this.getModel();
		let formula = request.getData(FormulaEvaluateRequest.FORMULA);
		let director = directors.getExpressionFormulaDirector(this.controller);
		director.evaluateFormula(model, formula, callback);
	}

	public getModel(): EObject {
		return <EObject>this.controller.getModel();
	}

}