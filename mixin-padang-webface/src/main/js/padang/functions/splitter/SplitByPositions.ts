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
import PlanUtils from "webface/plan/PlanUtils";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class SplitByPositions extends Function {

	public static FUNCTION_NAME = "SplitByPositions";

	constructor(
		public delimiter: string,
		public regex: boolean,
		public limit: number) {
		super(SplitByPositions.FUNCTION_NAME);
	}

	public static POSITIONS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"positions",
		"Positions",
		"Positions list",
		PlanUtils.createSpecifiedPlan(
			"position",
			PlanUtils.createNumberPlan()
		)
	);
	public static TRIM_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
		"trim",
		"Trim",
		"Remove beginning and ending white space"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			SplitByPositions.FUNCTION_NAME,
			"SplitByPositions",
			"mdi-arrow-split-vertical",
			"Split by position list"
		);
		let parameters = plan.getParameterList();
		parameters.add(SplitByPositions.POSITIONS_PLAN);
		parameters.add(SplitByPositions.TRIM_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(SplitByPositions.getPlan());