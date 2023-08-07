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
import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class ReadLines extends Function {

	public static FUNCTION_NAME = "ReadLines";

	constructor(
		public path: string,
		public delimiter: string,
		public firstRowHeader: boolean,
		public quoteCharacter: string,
	) {
		super(ReadLines.FUNCTION_NAME);
	}

	public static PATH_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"path",
		"Path",
		"File or directory path"
	);
	public static SEPARATOR_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"separator",
		"Line separator",
		"Regex expression separating lines",
		"\\n"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ReadLines.FUNCTION_NAME,
			"Read Lines",
			"mdi-file-document-outline",
			"Create dataset text files lines"
		);
		let list = plan.getParameterList();
		list.add(ReadLines.PATH_PLAN);
		list.add(ReadLines.SEPARATOR_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ReadLines.getPlan());