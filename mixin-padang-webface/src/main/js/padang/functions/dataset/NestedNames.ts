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
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class NestedNames extends DatasetFunction {

	public static FUNCTION_NAME = "NestedNames";

	constructor(
		public dataset: string,
		public column: string) {
		super(NestedNames.FUNCTION_NAME, dataset);
	}

	public static COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"column",
		"Column",
		"Object column to expand into columns",
		"",
		ColumnFunction.getDefaultColumnKeysAssignable()
	);

	public static SPECIFIED_PLAN: SpecifiedPlan = PlanUtils.createSpecifiedPlan(
		"name",
		PlanUtils.createTextPlan().setAssignable(NestedNames.getDefaultNestedNamesAssignable())
	);

	public static getDefaultNestedNamesAssignable(): string {
		let datasetName = DatasetFunction.DATASET_PLAN.getName();
		let columnName = NestedNames.COLUMN_PLAN.getName();
		return NestedNames.getNestedNamesAssignable(datasetName, columnName);
	}

	public static getNestedNamesAssignable(datasetName: string, columnName: string): string {
		return "=" + NestedNames.FUNCTION_NAME + "(" + datasetName + ", " + columnName + ")";
	}

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			NestedNames.FUNCTION_NAME,
			"Nested Names",
			"mdi-view-column",
			"List nested names"
		);
		let parameters = plan.getParameterList();
		parameters.add(DatasetFunction.DATASET_PLAN);
		parameters.add(NestedNames.COLUMN_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(NestedNames.getPlan());