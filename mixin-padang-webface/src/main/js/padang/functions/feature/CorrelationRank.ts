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

import Learning from "padang/functions/model/Learning";

export default class CorrelationRank extends Function {

	public static FUNCTION_NAME = "CorrelationRank";

	constructor(
		public values: any,
		public algorithm: any) {
		super(CorrelationRank.FUNCTION_NAME);
	}

	public static ALGORITHM_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"algorithm",
		"Algorithm",
		"Ranking algorithm",
		"pearson"
	);

	public static FEATURES_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.FEATURES,
		"Features",
		"Numerical features"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			CorrelationRank.FUNCTION_NAME,
			"CorrelationRank",
			"mdi-hexagon-outline",
			"Create correlation rank matrix"
		);
		let parameters = plan.getParameterList();
		parameters.add(CorrelationRank.FEATURES_PLAN);
		parameters.add(CorrelationRank.ALGORITHM_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(CorrelationRank.getPlan());