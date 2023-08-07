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

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import UniqueRows from "padang/functions/dataset/UniqueRows";

export default class GroupRows extends UniqueRows {

	public static FUNCTION_NAME = "GroupRows";

	public static ALIAS = "alias";
	public static AGGREGATE = "aggregate";

	public static SUM = "Sum";
	public static AVERAGE = "Average";
	public static COUNT = "Count";
	public static MAX = "Max";
	public static MIN = "Min";
	public static NONE = "None";

	public static FUNCTIONS = [
		GroupRows.SUM,
		GroupRows.AVERAGE,
		GroupRows.COUNT,
		GroupRows.MAX,
		GroupRows.MIN
	];

	constructor(
		public dataset: string,
		public keys: any[],
		public values: any[]) {
		super(GroupRows.FUNCTION_NAME, dataset);
	}

	public static VALUES_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"values",
		"Values",
		"Group aggragate value list",
		PlanUtils.createSpecifiedPlan(
			"value",
			PlanUtils.createEntityPlan([
				PlanUtils.createSpecifiedPlan(GroupRows.ALIAS, PlanUtils.createTextPlan()),
				PlanUtils.createSpecifiedPlan(GroupRows.AGGREGATE, PlanUtils.createAnyPlan())
			])
		)
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			GroupRows.FUNCTION_NAME,
			"Group Rows",
			"mdi-sigma",
			"Group rows based on keys and calculate aggregate list"
		);
		let parameters = plan.getParameterList();
		parameters.add(GroupRows.DATASET_PLAN);
		parameters.add(GroupRows.KEYS_PLAN);
		parameters.add(GroupRows.VALUES_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(GroupRows.getPlan());