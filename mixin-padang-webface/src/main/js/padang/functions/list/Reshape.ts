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

import ListFunction from "padang/functions/list/ListFunction";

export default class Reshape extends ListFunction {

	public static FUNCTION_NAME = "Reshape";

	constructor(
		public list: any,
		public shape: any) {
		super(Reshape.FUNCTION_NAME, list);
	}

	public static SHAPE_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"shape",
		"Shape",
		"Element shape"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			Reshape.FUNCTION_NAME,
			"Reshape",
			"mdi-list-status",
			"Check wether element in contained in list"
		);
		let parameters = plan.getParameterList();
		parameters.add(ListFunction.LIST_PLAN);
		parameters.add(Reshape.SHAPE_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Reshape.getPlan());