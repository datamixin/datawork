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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "padang/directors";

import OutcomeFormulaResultRequest from "padang/requests/OutcomeFormulaResultRequest";

export default class OutcomeFormulaResultHandler extends BaseHandler {

    public handle(request: OutcomeFormulaResultRequest, callback: (list: any) => void): void {
        let formula = request.getStringData(OutcomeFormulaResultRequest.FORMULA);
        let director = directors.getOutcomePresentDirector(this.controller);
        director.computeExample(this.controller, formula, callback);
    }

}
