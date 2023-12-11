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

import PadangCreator from "padang/model/PadangCreator";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

export default class CellAddHandler extends BaseHandler {

	public handle(_request: CellAddRequest, _callback?: (data?: any) => void): void {
		let director = directors.getViewsetPresentDirector(this.controller);
		let mixture = director.getFocusedMixture();
		let creator = PadangCreator.eINSTANCE;
		let newCell = creator.createCell()
		let command = director.createCellAddCommand(mixture, newCell);
		this.controller.execute(command);
	}

}
