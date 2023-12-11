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

import PlotFunction from "padang/functions/plot/PlotFunction";

export default class HorizontalPlot extends PlotFunction {

	public static FUNCTION_NAME = "HorizontalPlot";

	constructor(
		public list: any) {
		super(HorizontalPlot.FUNCTION_NAME);
	}

	public static PLOTS_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"plots",
		"Plots",
		"Plot list"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			HorizontalPlot.FUNCTION_NAME,
			"HorizontalPlot",
			"mdi-land-rows-horizontal",
			"Arrange plots horizontally"
		);
		let parameters = plan.getParameterList();
		parameters.add(HorizontalPlot.PLOTS_PLAN);
		parameters.add(PlotFunction.CONFIG_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(HorizontalPlot.getPlan());