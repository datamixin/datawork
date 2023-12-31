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

import NestedNames from "padang/functions/dataset/NestedNames";
import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class ExpandTable extends DatasetFunction {

	public static FUNCTION_NAME = "ExpandTable";

	constructor(
		public dataset: string,
		public column: string,
		public includes: string[]
	) {
		super(ExpandTable.FUNCTION_NAME, dataset);
	}

	public static COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"column",
		"Column",
		"Object column to expand into columns",
		"",
		ColumnFunction.getDefaultColumnKeysAssignable()
	);

	public static INCLUDES_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"includes",
		"Includes",
		"Field to includes",
		NestedNames.SPECIFIED_PLAN
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ExpandTable.FUNCTION_NAME,
			"Expand Table",
			"mdi-arrow-expand",
			"Expand table column into multiple rows and columns"
		);
		let parameters = plan.getParameterList();
		parameters.add(DatasetFunction.DATASET_PLAN);
		parameters.add(ExpandTable.COLUMN_PLAN);
		parameters.add(ExpandTable.INCLUDES_PLAN);
		return plan;
	}
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ExpandTable.getPlan());