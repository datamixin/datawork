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

import PlotFunction from "padang/functions/plot/PlotFunction";

export default class InstantPlot extends PlotFunction {

	public static FUNCTION_NAME = "InstantPlot";

	constructor(
		public routine: string,
		public result: any,
		public config: any
	) {
		super(InstantPlot.FUNCTION_NAME);
	}

	public static ROUTINE_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"routine",
		"Routine",
		"Routine name"
	);

	public static RESULT_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"result",
		"Result",
		"Result data"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			InstantPlot.FUNCTION_NAME,
			"InstantPlot",
			"mdi-chart-box-outline",
			"Plot result instantly"
		);
		let parameters = plan.getParameterList();
		parameters.add(InstantPlot.ROUTINE_PLAN);
		parameters.add(InstantPlot.RESULT_PLAN);
		parameters.add(PlotFunction.CONFIG_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(InstantPlot.getPlan());