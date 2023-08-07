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
import * as util from "webface/model/util";

import Controller from "webface/wef/Controller";

import BaseHandler from "webface/wef/base/BaseHandler";

import XExpression from "sleman/model/XExpression";

import VisageList from "bekasi/visage/VisageList";
import VisageValue from "bekasi/visage/VisageValue";
import VisageObject from "bekasi/visage/VisageObject";

import XSheet from "padang/model/XSheet";

import * as directors from "padang/directors";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";

import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";

import AssignableSelectionDialog from "padang/dialogs/AssignableSelectionDialog";

export abstract class FormulaAssignableHandler extends BaseHandler implements OptionFormulaContext {

	public handle(request: FormulaAssignableRequest, callback: (assignable: any) => void): void {
		let director = directors.getOptionFormulaDirector(this.controller);
		let assignable = <string>request.getData(FormulaAssignableRequest.ASSIGNABLE);
		director.evaluateAssignable(this, assignable, (result: VisageValue) => {
			if (result instanceof Array || result instanceof Map || result instanceof AssignableSelectionDialog) {
				callback(result);
			} else if (result instanceof VisageList) {
				let values = result.toArray();
				callback(values);
			} else if (result instanceof VisageObject) {
				let values = result.getObjectMap();
				callback(values);
			}
		});
	}

	public getController(): Controller {
		return this.controller;
	}

	public getContainingSheet(): string {
		let model = this.controller.getModel();
		let sheet = <XSheet>util.getAncestor(model, XSheet);
		return sheet.getName();
	}

	public abstract getOperation(): string;

	public abstract getPreparationIndex(): number;

	public abstract hasOption(name: string): boolean;

	public abstract getOption(name: string): XExpression;

}

export default FormulaAssignableHandler;