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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import BaseHandler from "webface/wef/base/BaseHandler";

import XAutomatedLearning from "malang/model/XAutomatedLearning";

export abstract class AutomatedTaskHandler extends BaseHandler {

	protected getLibraryName(): string {
		let model = <EObject>this.controller.getModel();
		let learning = <XAutomatedLearning>util.getAncestor(model, XAutomatedLearning);
		let library = learning.getLibrary();
		return library.getName();
	}
}

export default AutomatedTaskHandler;