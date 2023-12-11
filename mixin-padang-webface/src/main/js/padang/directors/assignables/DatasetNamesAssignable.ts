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

import XCall from "sleman/model/XCall";

import XDataset from "padang/model/XDataset";
import XProject from "padang/model/XProject";

import DatasetNames from "padang/functions/system/DatasetNames";

import Assignable from "padang/directors/assignables/Assignable";
import AssignableRegistry from "padang/directors/assignables/AssignableRegistry";

import OptionFormulaContext from "padang/directors/OptionFormulaContext";

export default class DatasetNamesAssignable extends Assignable {

	public evaluate(context: OptionFormulaContext, _call: XCall, callback: (result: any) => void): boolean {
		let controller = context.getController();
		let model = <EObject>controller.getModel();
		let project = <XProject>util.getAncestor(model, XProject);
		if (project !== null) {
			let sheets = project.getSheets();
			let datasets: string[] = [];
			for (let sheet of sheets) {
				let foresee = sheet.getForesee();
				if (foresee instanceof XDataset) {
					let name = sheet.getName();
					let dataset = context.getContainingSheet();
					if (dataset !== name) {
						datasets.push(name);
					}
				}
			}
			callback(datasets);
			return true;
		}

		return false;
	}

}

let registry = AssignableRegistry.getInstance();
registry.register(DatasetNames.FUNCTION_NAME, new DatasetNamesAssignable());
