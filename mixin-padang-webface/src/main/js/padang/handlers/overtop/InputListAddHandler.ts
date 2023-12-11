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
import ListAddCommand from "webface/wef/base/ListAddCommand";

import XInput from "padang/model/XInput";
import PadangCreator from "padang/model/PadangCreator";

import InputListAddRequest from "padang/requests/overtop/InputListAddRequest";

export default class InputListAddHandler extends BaseHandler {

	public handle(request: InputListAddRequest, callback: () => void): void {

		let list = <EList<XInput>>this.controller.getModel();
		let creator = PadangCreator.eINSTANCE;
		let input = creator.createInput(list);

		let command = new ListAddCommand();
		command.setList(list);
		command.setElement(input);

		this.controller.execute(command);

	}

}
