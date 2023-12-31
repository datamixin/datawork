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

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

import SplitByDelimiter from "padang/functions/splitter/SplitByDelimiter";
import SplitByPositions from "padang/functions/splitter/SplitByPositions";

export default class SplitColumn extends DatasetFunction {

	public static FUNCTION_NAME = "SplitColumn";

	constructor(
		public dataset: string,
		public column: string,
		public splitter: any) {
		super(SplitColumn.FUNCTION_NAME, dataset);
	}

	public static COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"column",
		"Column",
		"Column to be splitted",
		"",
		ColumnFunction.getDefaultColumnKeysAssignable()
	);
	public static SPLITTER_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"splitter",
		"Splitter",
		"Splitter function",
		"=[" +
		SplitByDelimiter.FUNCTION_NAME + ", " +
		SplitByPositions.FUNCTION_NAME +
		"]",
		SplitByDelimiter.FUNCTION_NAME + "(',', false, -1)"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			SplitColumn.FUNCTION_NAME,
			"Split Column",
			"mdi-arrow-split-vertical",
			"Split a string column into multiple columns"
		);
		let parameters = plan.getParameterList();
		parameters.add(DatasetFunction.DATASET_PLAN);
		parameters.add(SplitColumn.COLUMN_PLAN);
		parameters.add(SplitColumn.SPLITTER_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(SplitColumn.getPlan());