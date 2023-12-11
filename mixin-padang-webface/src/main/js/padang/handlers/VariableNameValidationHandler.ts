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
import EList from "webface/model/EList";

import BaseHandler from "webface/wef/base/BaseHandler";

import XVariable from "padang/model/XVariable";
import PadangInspector from "padang/model/PadangInspector";

import * as directors from "padang/directors";

import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

export default class VariableNameValidationHandler extends BaseHandler {

    public handle(request: VariableNameValidationRequest, callback: (data: any) => void): void {
        let name = request.getStringData(VariableNameValidationRequest.NAME);
        let inspector = PadangInspector.eINSTANCE;
        let parent = this.controller.getParent();
        let variable = <EList<XVariable>>parent.getModel();
        let names = inspector.getVariableNames(variable);
        if (names.indexOf(name) !== -1) {
            callback("Variable name '" + name + "' already exists");
        } else {
            let director = directors.getExpressionFormulaDirector(this.controller);
            let message = director.validateName(name);
            callback(message);
        }
    }

}
