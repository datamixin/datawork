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

export default class GenerateDataset extends Function {

	public static FUNCTION_NAME = "GenerateDataset";
	public static COLUMNS = "columns";

	constructor(
		public result: any) {
		super(GenerateDataset.FUNCTION_NAME);
	}

	public static GENERATOR_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		"generator",
		"Generator",
		"Generator expression"
	);

	public static START_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"start",
		"Start",
		"Start number",
		0
	);

	public static STOP_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"stop",
		"Stop",
		"Stop number",
		10
	);

	public static STEP_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"step",
		"Step",
		"Step number",
		1
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			GenerateDataset.FUNCTION_NAME,
			"Generate Dataset",
			"mdi-table-plus",
			"Generate dataset from generator expression result"
		);
		let parameters = plan.getParameterList();
		parameters.add(GenerateDataset.GENERATOR_PLAN);
		parameters.add(GenerateDataset.START_PLAN);
		parameters.add(GenerateDataset.STOP_PLAN);
		parameters.add(GenerateDataset.STEP_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(GenerateDataset.getPlan());