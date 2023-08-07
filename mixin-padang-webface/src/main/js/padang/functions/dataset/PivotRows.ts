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

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class PivotRows extends DatasetFunction {

	public static FUNCTION_NAME = "PivotRows";

	constructor(
		public dataset: string,
		public rows: string[],
		public columns: string,
		public values: string,
		public aggregate: string) {
		super(PivotRows.FUNCTION_NAME, dataset);
	}

	public static ROWS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
		"rows",
		"Rows",
		"Columns where values will be converted into row value",
		ColumnFunction.SPECIFIED_PLAN
	);
	public static COLUMNS_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"columns",
		"Columns",
		"Column where values will be converted into column names",
		"",
		ColumnFunction.getDefaultColumnKeysAssignable()
	);
	public static VALUES_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"values",
		"Values",
		"Column where values to be aggregated",
		"",
		ColumnFunction.getDefaultColumnKeysAssignable()
	);
	public static AGGREGATE_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
		"aggregate",
		"Aggregate",
		"Used aggregate function used to calculate value"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			PivotRows.FUNCTION_NAME,
			"Pivot Rows",
			"mdi-table-pivot",
			"Pivot rows and columns into multiple columns with aggregate"
		);
		let parameters = plan.getParameterList();
		parameters.add(DatasetFunction.DATASET_PLAN);
		parameters.add(PivotRows.ROWS_PLAN);
		parameters.add(PivotRows.COLUMNS_PLAN);
		parameters.add(PivotRows.VALUES_PLAN);
		parameters.add(PivotRows.AGGREGATE_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(PivotRows.getPlan());