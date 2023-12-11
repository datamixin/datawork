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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "padang/directors";

import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

export default class FormulaValidationHandler extends BaseHandler {

    public handle(request: FormulaValidationRequest, callback: (message: any) => void): void {
        let director = directors.getExpressionFormulaDirector(this.controller);
        let formula = <string>request.getData(FormulaValidationRequest.FORMULA);
        try {
            director.parseFormula(formula);
            callback(null);
        } catch (e) {
            callback(e.message);
        }
    }
}

