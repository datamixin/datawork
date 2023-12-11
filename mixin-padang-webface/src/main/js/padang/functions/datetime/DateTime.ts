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
import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

export default class DateTime extends Function {

	public static FUNCTION_NAME = "DateTime";

	constructor(
		public time: string,
		public unit: string,
	) {
		super(DateTime.FUNCTION_NAME, time);
	}

	public static UNIT_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"unit",
		"Unit",
		"Date time unit",
		"ms",
		"=['ns', 'ms', 's']",
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			DateTime.FUNCTION_NAME,
			"DateTime",
			"mdi-calendar-clock",
			"Create datetime from time stamp"
		);
		let list = plan.getParameterList();
		list.add(DateTime.UNIT_PLAN);
		return plan;
	}
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(DateTime.getPlan());