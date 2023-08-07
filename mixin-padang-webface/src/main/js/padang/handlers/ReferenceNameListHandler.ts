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
import EList from "webface/model/EList";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import BaseHandler from "webface/wef/base/BaseHandler";

import XProject from "padang/model/XProject";
import XDataset from "padang/model/XDataset";

import ReferenceNameListRequest from "padang/requests/ReferenceNameListRequest";

export default class ReferenceNameListHandler extends BaseHandler {

	public handle(_request: ReferenceNameListRequest, callback: (names: string[]) => void): void {
		let model: EObject = this.controller.getModel();
		if (model instanceof EList) {
			model = model.eOwner();
		}
		let names: string[] = [];
		let project = <XProject>util.getRootContainer(model);
		let sheets = project.getSheets();
		for (let sheet of sheets) {
			let foresee = sheet.getForesee();
			if (foresee instanceof XDataset) {
				let name = sheet.getName();
				names.push(name);
			}
		}
		callback(names);
	}

}
