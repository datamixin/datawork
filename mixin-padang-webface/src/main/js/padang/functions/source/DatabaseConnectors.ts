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
import PlanUtils from "webface/plan/PlanUtils";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import FunctionPlan from "padang/plan/FunctionPlan";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class DatabaseConnectors extends Function {

	public static FUNCTION_NAME = "DatabaseConnectors";

	constructor(
	) {
		super(DatabaseConnectors.FUNCTION_NAME);
	}

	public static SPECIFIED_PLAN: SpecifiedPlan = PlanUtils.createSpecifiedPlan(
		"driver",
		PlanUtils.createTextPlan().setAssignable(DatabaseConnectors.getDriversAssignable())
	);

	public static getDriversAssignable(): string {
		return "=" + DatabaseConnectors.FUNCTION_NAME + "()";
	}

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			DatabaseConnectors.FUNCTION_NAME,
			"Database Drivers",
			"mdi-format-list-bulleted-type",
			"List database driver names"
		);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(DatabaseConnectors.getPlan());