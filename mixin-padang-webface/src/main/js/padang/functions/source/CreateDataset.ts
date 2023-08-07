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

import Function from "padang/functions/Function";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

export default class CreateDataset extends Function {

	public static FUNCTION_NAME = "CreateDataset";
	public static COLUMNS = "columns";

	constructor(
		public result: any) {
		super(CreateDataset.FUNCTION_NAME);
	}

	public static RESULT_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"result",
		"Result",
		"Expression result",
		PlanUtils.createSpecifiedPlan(
			"item",
			PlanUtils.createAnyPlan()
		)
	);

	public static COLUMNS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"columns",
		"Columns",
		"Column name list",
		PlanUtils.createSpecifiedPlan(
			"name",
			PlanUtils.createAnyPlan()
		)

	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			CreateDataset.FUNCTION_NAME,
			"Create Dataset",
			"mdi-table-plus",
			"Create dataset from expression result"
		);
		let parameters = plan.getParameterList();
		parameters.add(CreateDataset.RESULT_PLAN);
		parameters.add(CreateDataset.COLUMNS_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(CreateDataset.getPlan());