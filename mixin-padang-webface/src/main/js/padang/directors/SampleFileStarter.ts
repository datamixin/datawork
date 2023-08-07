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

import * as ajax from "webface/core/ajax";

import ConstantPlan from "webface/plan/ConstantPlan";

import XValue from "sleman/model/XValue";
import XObject from "sleman/model/XObject";

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";
import PadangCreator from "padang/model/PadangCreator";

import ParameterPlan from "padang/plan/ParameterPlan";

import ReadCsv from "padang/functions/source/ReadCsv";

import OptionFormula from "padang/directors/OptionFormula";
import ExpressionFormula from "padang/directors/ExpressionFormula";

import DetailMessageDialog from "webface/dialogs/DetailMessageDialog";

export default class SampleFileStarter {

	public readFile(path: string, callback: (text: string) => void): void {
		ajax.doGet(path, {
		}).done((text: string) => {
			callback(text);
		}).fail((error) => {
			DetailMessageDialog.open(error, "File read sample file '" + path + "'");
		});
	}

	public createMutation(filePath: string, options: string): XMutation {
		let formula = new ExpressionFormula();
		let values = <XObject>formula.parseFormula(options);

		// Mutation
		let planName = ReadCsv.FUNCTION_NAME;
		let creator = PadangCreator.eINSTANCE;
		let mutation = creator.createMutation(planName);
		let parameters = mutation.getOptions();

		// Path
		this.add(parameters, ReadCsv.PATH_PLAN, values, filePath);
		this.add(parameters, ReadCsv.DELIMITER_PLAN, values);
		this.add(parameters, ReadCsv.FIRST_ROW_HEADER_PLAN, values);
		this.add(parameters, ReadCsv.QUOTE_CHARACTER_PLAN, values);
		this.add(parameters, ReadCsv.PARSE_DATES_PLAN, values);

		return mutation;
	}

	private add(parameters: EList<XOption>, plan: ParameterPlan, options: XObject, value?: string): void {
		let creator = PadangCreator.eINSTANCE;
		let name = plan.getName()
		let parameter: XOption = null;
		if (value !== undefined) {
			parameter = creator.createOption(name, value);
		} else {
			let custom = options.getField(name);
			if (custom instanceof XValue) {
				value = custom.toValue();
			}
			if (value === undefined) {
				let assignedPlan = plan.getAssignedPlan();
				if (assignedPlan instanceof ConstantPlan) {
					let formula = new OptionFormula();
					value = formula.getDefaultLiteral(plan);
				}
			}
			parameter = creator.createOption(name, value);
		}
		parameters.add(parameter);
	}

}