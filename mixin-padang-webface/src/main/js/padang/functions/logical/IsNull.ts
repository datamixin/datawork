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

export default class IsNull extends Function {

	public static FUNCTION_NAME = "IsNull";

	constructor(
		public value: any) {
		super(IsNull.FUNCTION_NAME);
	}

	public static VALUE_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"value",
		"Value",
		"Expression value"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			IsNull.FUNCTION_NAME,
			"IsNull",
			"mdi-null",
			"Logical function IsNull"
		);
		let parameters = plan.getParameterList();
		parameters.add(IsNull.VALUE_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(IsNull.getPlan());