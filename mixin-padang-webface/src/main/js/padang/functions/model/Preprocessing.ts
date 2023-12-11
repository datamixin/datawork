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

import Function from "padang/functions/Function";

export default class Preprocessing extends Function {

	public static FUNCTION_NAME = "Preprocessing";

	public static MUTATIONS = "mutations";
	public static ENCODERS = "encoders";
	public static RESULT = "result";

	constructor(
		public mutations: any,
		public encoders: any,) {
		super(Preprocessing.FUNCTION_NAME);
	}

	public static MUTATIONS_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Preprocessing.MUTATIONS,
		"Mutations",
		"Mutation steps"
	);

	public static ENCODERS_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Preprocessing.ENCODERS,
		"Encoders",
		"Input encoders"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			Preprocessing.FUNCTION_NAME,
			"Preprocessing",
			"mdi-flask-outline",
			"Data preprocessing"
		);
		let parameters = plan.getParameterList();
		parameters.add(Preprocessing.MUTATIONS_PLAN);
		parameters.add(Preprocessing.ENCODERS_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Preprocessing.getPlan());