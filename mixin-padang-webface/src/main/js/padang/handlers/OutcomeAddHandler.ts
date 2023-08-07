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
import * as wef from "webface/wef";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import BaseHandler from "webface/wef/base/BaseHandler";
import ListAddCommand from "webface/wef/base/ListAddCommand";

import XProject from "padang/model/XProject";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import OutcomeAddRequest from "padang/requests/OutcomeAddRequest";

export default class OutcomeAddHandler extends BaseHandler {

	public handle(_request: OutcomeAddRequest, callback: () => void): void {

		let model = <EObject>this.controller.getModel();
		let project = <XProject>util.getRootContainer(model);
		let sheets = project.getSheets();
		let creator = PadangCreator.eINSTANCE;
		let sheet = creator.createMixtureViewsetSheet(project, true);

		let director = wef.getSynchronizationDirector(this.controller);
		director.onCommit(() => {
			let director = directors.getOutlinePartDirector(this.controller);
			director.onSelectionChanged(() => {
				callback();
			});
		});

		let command = new ListAddCommand();
		command.setList(sheets);
		command.setElement(sheet);

		this.controller.execute(command);

	}

}
