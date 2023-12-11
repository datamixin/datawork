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
import Controller from "webface/wef/Controller";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";
import PadangCreator from "padang/model/PadangCreator";

import ToolboxPartDirector from "padang/directors/ToolboxPartDirector";

export default class BaseToolboxPartDirector implements ToolboxPartDirector {

	constructor(_viewer: BaseControllerViewer) {
	}

	public executeAddDatasetSheet(controller: Controller): XSheet {

		let model = <EObject>controller.getModel();
		let project = <XProject>util.getRootContainer(model);
		let sheets = project.getSheets();
		let creator = PadangCreator.eINSTANCE;
		let sheet = <XSheet>creator.createDatasetSheet(project);

		let command = new ListAddCommand();
		command.setList(sheets);
		command.setElement(sheet);

		controller.execute(command);

		return sheet;
	}

}