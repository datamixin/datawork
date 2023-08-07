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
import Function from "padang/functions/Function";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class FromDataset extends Function {

	public static FUNCTION_NAME = "FromDataset";

	constructor(
		dataset: any,
		display: boolean) {
		super(FromDataset.FUNCTION_NAME);
	}

	public static DATASET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"dataset",
		"Dataset",
		"Source dataset name",
		DatasetFunction.DATASET_NAMES_ASSIGNABLE
	);

	public static DISPLAY: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
		"display",
		"Display",
		"State whether to use result after for display",
		false
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			FromDataset.FUNCTION_NAME,
			"Read Dataset",
			"mdi-table-sync",
			"Create dataset from other dataset result"
		);
		let parameters = plan.getParameterList();
		parameters.add(FromDataset.DATASET_PLAN);
		parameters.add(FromDataset.DISPLAY);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(FromDataset.getPlan());