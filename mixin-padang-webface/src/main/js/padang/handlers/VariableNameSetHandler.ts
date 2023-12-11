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

import XVariable from "padang/model/XVariable";

import VariableNameSetCommand from "padang/commands/VariableNameSetCommand";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";

export default class VariableNameSetHandler extends BaseHandler {

    public handle(request: VariableNameSetRequest, callback: (data: any) => void): void {
        let name = request.getStringData(VariableNameSetRequest.NAME);
        let sheet = <XVariable>this.controller.getModel()
        let command = new VariableNameSetCommand();
        command.setVariable(sheet);
        command.setName(name);
        this.controller.execute(command);
    }

}
