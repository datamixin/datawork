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

export default class Transmute extends Function {

	public static FUNCTION_NAME = "Transmute";

	public static OPERATION = "operation";
	public static OPTIONS = "options";

	constructor(
		public operation: string,
		public options: any,) {
		super(Transmute.FUNCTION_NAME);
	}

	public static OPERATION_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		Transmute.OPERATION,
		"Operation",
		"Dataset operation"
	);

	public static OPTIONS_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Transmute.OPTIONS,
		"Options",
		"Operation options"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			Transmute.FUNCTION_NAME,
			"Transmute",
			"mdi-flask-outline",
			"Data transmutation"
		);
		let parameters = plan.getParameterList();
		parameters.add(Transmute.OPERATION_PLAN);
		parameters.add(Transmute.OPTIONS_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Transmute.getPlan());